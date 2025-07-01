轻量级CAD浏览器工具，基于DCiP软件开发平台构建

功能特性

1.​​DXF文件查看器​​：打开和解析AutoCAD DXF文件

2.​3D视图交互​​：支持旋转、平移、缩放等模型操作

3.图层管理​​：实时显示和控制CAD图层可见性

4.​​对象选择​​：支持单个和多重实体选择

5.​块定义浏览​​：查看和管理CAD块定义

​​基本操作​​

1.​打开文件​​：点击工具栏文件夹图标或按 Ctrl+O

2.​​3D导航​：左键拖动：旋转视图，右键拖动：平移视图，滚轮缩放：缩放视图

3.选择模式​​：顶部选择器工具栏切换选择模式

4.图层控制​​：左侧面板管理图层可见性

关键改进点：

1.图层管理增强：

// handleSidePaneEvents中添加：
case 'layer_toggle':
  const { layerName, visible } = data;
  comx.dxf_engine.SetLayerVisible(layerName, visible);
  ui.canvas.db = model.dxf.render(); // 触发重渲染

2.​​图层状态持久化：

exports.state.layers = {};
// 打开文件时初始化：
openFile(fname) {
  // ...
  model.dxf.getLayers().forEach(layer => {
    this.layers[layer] = true; // 默认可见
  });
}

3.增量渲染机制：

function refreshCanvas(onlyLayers = []) {
  if(onlyLayers.length === 0) {
    ui.canvas.db = model.dxf.render();
  } else {
    // 只重绘特定图层...
  }
}

4.​​​​文件错误处理：

exports.dxf.open = (fname) => {
  try {
    // ...
  } catch (err) {
    if(err.code === 'FILE_CORRUPTED') {
      model.util.recoverBackup(fname);
    }
  }
};

5.​​自动保存机制

setInterval(() => {
  if(model.state.currentFile) {
    autoSaveTemp(model.state.currentFile);
  }
}, 300000); // 每5分钟
