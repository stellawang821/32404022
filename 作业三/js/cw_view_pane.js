////////////////////////////////////////////////////////////////////////////
// System Pre-define Functions
// 95099372-ef3e-11ea-9c81-bf848405c62e

function OnInitializeData() {
    
        PUI(()=>{
                //you can access the 'ui' namespace in the parent form using the variable 'pui' here.
                //The 'pui' variable is valid in all functions of this document.
                //For robustness, you'd better use 'PUI(cb);' to access 'pui' variable.
                OnSensor(1);
                ui.block.valid = true;
                ui.layer.valid = true;
                ui.status.valid = true;
        });
        
        initTipInformation();
}

function OnCloseForm() {
}

function OnException(err) {
        //ui.MessageBox('Error', '' + err, MessageBox.Icon.Critical, MessageBox.Button.Ok);
}

//////////////////////////////////////////////////////////////////////////
// Callback Functions.
// 641a254c-ef3e-11ea-bc8a-379bb908bdd7

function OnStatus(){
        fireEvent('statusbar', ui.status.valid);
}

function OnLayerList(){
        fireEvent('layer_list', ui.layer.valid);
        fireEvent('side_pane', ui.layer.valid || ui.block.valid);
}

function OnBlockList(){
        fireEvent('block_list', ui.block.valid);
        fireEvent('side_pane', ui.layer.valid || ui.block.valid);
}

function OnView(type){
        fireEvent(type);
}

function OnFit(){
        fireEvent('fit');
}

function OnSensor(idx){
        var sensor_btn = [ui.rotate, ui.pan, ui.zoom, ui.zoom_window];
        sensor_btn.forEach(btn=>{btn.valid = false;});
        sensor_btn[idx].valid = true;
        
        var sensor_type = ['rotate', 'pan', 'zoom', 'zoom_window'];
        fireEvent(sensor_type[idx]);
}

//////////////////////////////////////////////////////////////////////////
// Utils Functions.
// 6c165ad6-ef3e-11ea-987c-b761a131c2fe

function initTipInformation() {
        ui.rotate.tip        = model.getTipTemplete('旋转',  'rotate.bmp',          '切换到3D旋转模式(同时先按下左右键)');
        ui.pan.tip           = model.getTipTemplete('平移',  'pan.bmp',             '切换到3D平移模式(同时先按下左右键)');
        ui.zoom.tip          = model.getTipTemplete('缩放',  'zoom.bmp',            '切换到3D缩放模式(同时先按下左右键)');
        ui.zoom_window.tip   = model.getTipTemplete('窗口',  'zoom_window.bmp',    '切换到3D窗口模式(同时先按下左右键)');
        ui.fit.tip           = model.getTipTemplete('全屏',  'fit.bmp',             '切换到3D全屏模式(同时先按下左右键)');
        ui.xoy.tip           = model.getTipTemplete('YOX',   'xoy.bmp',            '切换到3D-YOX视图');
        ui.yox.tip           = model.getTipTemplete('XOY',   'yox.bmp',            '切换到3D-XOY视图');
        ui.zoy.tip           = model.getTipTemplete('ZOY',   'yoz.bmp',            '切换到3D-ZOY视图');
        ui.yoz.tip           = model.getTipTemplete('YOZ',   'zoy.bmp',            '切换到3D-YOZ视图');
        ui.xoz.tip           = model.getTipTemplete('XOZ',   'xoz.bmp',            '切换到3D-XOZ视图');
        ui.zox.tip           = model.getTipTemplete('ZOX',   'zox.bmp',            '切换到3D-ZOX视图');
        ui.block.tip         = model.getTipTemplete('块列表', 'blocklist.bmp',     '显示/隐藏块列表');
        ui.layer.tip         = model.getTipTemplete('层列表', 'layerlist.bmp',     '显示/隐藏层列表');
        ui.status.tip        = model.getTipTemplete('状态栏', 'info2.bmp',          '显示/隐藏状态栏');
}

CW_DeclareOuterVariable('event');

function fireEvent(type, data) {
        PUI(() => {
                pui.event = {
                        type: type,
                        data: data
                };
        });
}

function PUI(cb) {
        if(pui){cb();}
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

//////////////////////////////////////////////////////////////////////////
// template codes for cw callback js.

function CW_DeclareVariable(name, setter, getter) {
        if(typeof(__DeclareVariable) === 'function') {
                __DeclareVariable(name, setter, getter);
        }
}

function CW_DeclareOuterVariable(name) {
        if(typeof(__DeclareOuterVariable) === 'function') {
                __DeclareOuterVariable(name);
        }
}
