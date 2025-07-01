////////////////////////////////////////////////////////////////////////////
// System Pre-define Functions
// 95099372-ef3e-11ea-9c81-bf848405c62e

async function OnInitializeData() {
        //ui.sidepane.visible = false;
        initCompositeWidget();
        initCanvasWidget();
}

function OnCloseForm(is_preview) {
        if(is_preview) {return true;}
                
        parent.setTimeout(()=>{
                if(ui.MessageBox('DXF 浏览器 | 提示信息', '应用程序将被关闭，您确认退出么?',
                        MessageBox.Icon.Information,
                        MessageBox.Button.Yes | MessageBox.Button.No) === MessageBox.Button.Yes) {
                        process.exit();
                }
	
        }, 10);
        return false;
}

function OnException(err) {
        //ui.MessageBox('Error', '' + err, MessageBox.Icon.Critical, MessageBox.Button.Ok);
}

//////////////////////////////////////////////////////////////////////////
// Callback Functions.
// 641a254c-ef3e-11ea-bc8a-379bb908bdd7

function OnMeasureDistance(){

}

function OnPickup(){
        if(!ui.canvas.hits) {return;}
        var rec = ui.canvas.hits[0];
        var key = rec.keyRecord;
        
        var keyObj = ui.canvas.parseKey(key);
        let layer = comx.dxf_engine.GetLayerOfEntity(keyObj.mid, keyObj.sid);
        
        ui.pickup.info = "Layer : " + layer;
        let layer_rec = comx.dxf_engine.GetEntitiesOfLayer(layer).split(',');
        
        console.log(ui.pickup.picker.filter_code);
        // 处理图层选择模式
        if (ui.pickup.picker.filter_code === -3) {
                const entities = model.dxf.getEntities(layer);
                const hits = entities.map(e => ({
                        keyRecord: ui.canvas.generateKey(e.mid, e.sid),
                        primitive: 0
                }));
        
                ui.canvas.hits = hits;
                model.state.selection = entities;
        
                // 更新显示
                parent.setTimeout(() => {
                        ui.canvas.view().setVisible(false);
                        ui.canvas.update();
                        parent.setTimeout(() => {
                                ui.canvas.view().setVisible(true);
                                ui.canvas.update();
                        }, 300);
                }, 100);
        } else {
        // 普通选择
                model.state.addSelection(keyObj);
        }
        
        if(ui.pickup.picker.filter_code === -3) {
        
                var objLayerRec = [];
                for(let idx = 0; idx < layer_rec.length / 2; ++idx) {
                        let mid = layer_rec[idx * 2 + 0];
                        let sid = layer_rec[idx * 2 + 1];
                        
                        //console.log(mid, sid);
                
                        objLayerRec.push({
                                keyRecord : ui.canvas.generateKey(mid, sid),
                                primitive : 0
                        });
                }
        
                ui.canvas.hits = objLayerRec;
                
                parent.setTimeout(()=>{
                        ui.canvas.view().setVisible(false);
                        ui.canvas.update();
                        parent.setTimeout(()=>{
                                ui.canvas.view().setVisible(true);
                                ui.canvas.update();
                        }, 1000);
                }, 300);
        }
        
        /*
        console.log(ui.canvas.parseKey(key));
        
        ui.canvas.hits = [
                {
                        keyRecord : ui.canvas.generateKey(2023, 120),
                        primitive : 0
                },
                {
                        keyRecord : ui.canvas.generateKey(2023, 121),
                        primitive : 0
                }
        ];
                
        ui.canvas.view().setColor(0, 1.0, 0, 1.0);*/
}

//////////////////////////////////////////////////////////////////////////
// Top Menu Callback
function handleSidePaneEvents(type, data) {
        switch (type) {
        case 'update':
                // 更新图层列表
                ui.sidepane.layers = model.dxf.getLayers().map(name => ({
                        name,
                        visible: true
                }));
            
                // 更新块列表
                ui.sidepane.blocks = model.dxf.getBlocks().map(name => ({
                        name
                }));
                break;
            
        case 'layer_toggle':
                // 实现图层可见性切换
                if (data && data.layerName !== undefined && data.visible !== undefined) {
                        comx.dxf_engine.SetLayerVisible(data.layerName, data.visible);
                        ui.canvas.update(); // 刷新视图
                } else {
                        model.util.ide_warning("Invalid data for layer_toggle event");
                }
                break;
            
        case 'block_selected':
                // 处理块选择事件
                if (data && data.blockName) {
                // 执行块相关操作...
                }
                break;
            
        default:
                // 处理未知事件类型
                model.util.ide_warning(`Unknown sidepane event type: ${type}`);
                // 可选：记录事件数据
                if (data) {
                        console.debug("Event data:", data);
                }
                break;
        }
}

function OnOpen() {
        var fname = ui.OpenFileDialog("Import CAD File", unit.dir + 'data/', "DXF Files(*.dxf)");
        if(fname) {
                ui.statusbar.cueline = "正在打开DXF文件...";
                
                ui.canvas.db = null;
                fireSideBarEvent('clear');
                
                try {
                        model.dxf.open(fname);
                        ui.canvas.db = model.dxf.render();
                        model.state.openFile(fname);
                        
                        // 更新界面
                        fireSideBarEvent('update');
                        updatePicker();
                        OnSensor({ type: 'fit' });
                } catch (err) {
                        OnException(err);
                } finally {
                        ui.statusbar.cueline = "Ready";
                }
            
                parent.setTimeout(()=>{
                        ui.canvas.dxf = fname;
                        ui.statusbar.cueline = "就绪.";
                        
                        OnSensor({type : 'yox'});
                        fireSideBarEvent('update');
                        
                        updatePicker();
                }, 100);
        }
}

function OnOption(){
}

function OnExit() {
        pane.Close();
}

function OnViewPane() {
        ui.toolbar_stack.index = 0;
}

function OnPickupPane(){
        ui.toolbar_stack.index = 1;
}

function OnDrawPane(){
        ui.toolbar_stack.index = 2;
}

function OnHelp(){
}

function OnFold(){
        ui.toolbar_stack.visible = false;
}

function OnExpand(){
        ui.toolbar_stack.visible = true;
}

//////////////////////////////////////////////////////////////////////////
// toolbar view 

function OnStatusBar(event) {
        ui.statusbar.visible = event.data;
}

function OnSidePane(event) {
        ui.sidepane.visible = event.data;
}

function OnSensor(event) {
        var objSensorEntry = {
                rotate      : GL.Sensor.Rotate,
                pan         : GL.Sensor.Pan,
                zoom        : GL.Sensor.Scale,
                zoom_window : GL.Sensor.RectScale,
                fit         : GL.Sensor.Reset,
                xoy         : GL.Sensor.XOY,
                yox         : GL.Sensor.YOX,
                yoz         : GL.Sensor.YOZ,
                zoy         : GL.Sensor.ZOY,
                xoz         : GL.Sensor.XOZ,
                zox         : GL.Sensor.ZOX
        };
        if (sensors[event.type]) {
                ui.canvas.sensor = sensors[event.type];
        }
        ui.canvas.sensor = objSensorEntry[event.type];
}

//////////////////////////////////////////////////////////////////////////
// Utils Functions.
// 6c165ad6-ef3e-11ea-987c-b761a131c2fe

function updatePicker() {
        let picker = ui.pickup.picker;
        console.log(picker);
        
        model.picker.update({
                autoHighlight: ui.pickup.picker.auto_highlight,
                filter: ui.pickup.picker.filter_code < 0 ? 
                        null : [ui.pickup.picker.filter_code]
        });
       
        ui.canvas.picker = model.picker;
        
        ui.canvas.picker = {
                mode          : GL.Picker.Mode.Single,
                autoHighlight : picker.auto_highlight,
                behavior      : picker.pickup_type
        };
        
        if(picker.filter_code < 0) {
                ui.canvas.filter = null;
        } else {
                ui.canvas.filter = [picker.filter_code];
        }
        
        //ui.canvas.hits = [ui.canvas.generateKey(2023, 1)];
}

function initCompositeWidget() {
        let objDispatchEntry = {
                open         : OnOpen,
                option       : OnOption,
                exit         : OnExit,
                view         : OnViewPane,
                pickup       : OnPickupPane,
                draw         : OnDrawPane,
                help         : OnHelp,
                fold         : OnFold,
                expend       : OnExpand,
                statusbar    : OnStatusBar,
                side_pane    : OnSidePane,
                rotate       : OnSensor,
                pan          : OnSensor,
                zoom         : OnSensor,
                zoom_window  : OnSensor,
                fit          : OnSensor,
                xoy          : OnSensor,
                yox          : OnSensor,
                yoz          : OnSensor,
                zoy          : OnSensor,
                xoz          : OnSensor,
                zox          : OnSensor,
                block_list   : event=>{ui.sidepane.bvisible = event.data;},
                layer_list   : event=>{ui.sidepane.lvisible = event.data;}
        };
        
        ui.canvas.adaptor('dxf', function(fname_dxf) {
                try {
                        model.dxf.open(fname_dxf);
                        return model.dxf.render();
                } catch (err) {
                        OnException(err);
                        return null;
                }
        });
    
        ui.canvas.sensor = GL.Sensor.Pan;
        ui.canvas.tip = model.util.getTipTemplate(
                '3D View', 
                'glcanvas.png', 
                '3D graphics display area'
        );

        ui.topmenu.RegisterCallback("event",
                event=>{
                        model.ide_info(event.type);  
                        let cb = objDispatchEntry[event.type];
                        if(cb){cb();}
                },
                ()=>{
                        return undefined;
                });
                
        ui.toolbar_view.RegisterCallback('event',
                event=>{
                        model.ide_info(event.type + ',' + event.data);
                        let cb = objDispatchEntry[event.type];
                        if(cb){cb(event);}
                },
                ()=>{
                });
                
        ui.pickup.RegisterCallback('event',
                event=>{
                        model.ide_info(event.type);
                        updatePicker();
                },
                ()=>{
                        return undefined;
                });
                
        // 添加侧边栏事件处理
        ui.sidepane.RegisterCallback('event', event => {
                handleSidePaneEvents(event.type);
        });
}

function initCanvasWidget() {
        ui.canvas.adaptor('dxf', function(fname_dxf) {
                ui.canvas.db = null;
                
                comx.dxf_engine.Clear();
                comx.dxf_engine.Import(fname_dxf);
                return comx.dxf_engine.Render();
        });
        
        ui.canvas.sensor = GL.Sensor.Pan;
        ui.canvas.tip    = '3D图形显示区';//model.getTipTemplete('3D显示区', 'glcanvas.png', '3D图形显示区');
}

function fireSideBarEvent(type) {
        ui.sidepane.event = { type : type};
}

/*Usage of BLOCK_EVENT
        BLOCK_EVENT(()=>{
                ui.[name].[var] = ...;
        });
*/

function BLOCK_EVENT(cb) {
        ui.block_event = true;
        
        cb();
        
        ui.block_event = false;
}
