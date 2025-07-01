////////////////////////////////////////////////////////////////////////////
// System Pre-define Functions
// 95099372-ef3e-11ea-9c81-bf848405c62e

function OnInitializeData() {
        init();
        PUI(() => {
                //you can access the 'ui' namespace in the parent form using the variable 'pui' here.
                //The 'pui' variable is valid in all functions of this document.
                //For robustness, you'd better use 'PUI(cb);' to access 'pui' variable.
                parent.setTimeout(()=>{
                        OnLesson();
                }, 10);
        });
}

function init() {
        ui.quick_start.enable = false;
        ui.pb_dev.valid         = true;

        if(!model.getTipTemplete) {return;}
                
        ui.pb_menu.tip       = model.getTipTemplete('菜单', 'menu_list.bmp', 'DCiP | DXF Viewer Main Menu Entry.');
        ui.pb_menu_arrow.tip = model.getTipTemplete('菜单', 'menu_list.bmp', 'DCiP | DXF Viewer Main Menu Entry.');
        ui.pb_manual.tip     = model.getTipTemplete('打开', 'open.bmp', 'Click this Button to Open DXF File.');
        ui.pb_option.tip     = model.getTipTemplete('系统选项', 'development.bmp',
                'Click this Button to Open the Configuration Options.');
        ui.pb_outdoor.tip    = model.getTipTemplete('退出', 'outdoor.bmp',
                'Click this Button to Exit the Software.');
        ui.pb_dev.tip        = model.getTipTemplete('视图', 'view.bmp',
                'Switch to the View Toolbar.');
        ui.pb_lesson.tip     = model.getTipTemplete('选择', 'pickup.bmp',
                'Switch to the Pickup Toolbar.');
        ui.pb_copyright.tip  = model.getTipTemplete('绘制', 'draw.bmp',
                'Switch to the Draw Toolbar.');
        ui.pb_about.tip      = model.getTipTemplete('关于', 'Help.bmp',
                'About Information.');
        ui.pb_collapse.tip   = model.getTipTemplete('折叠', 'arrow_up.bmp',
                'Click the Button to Collapse the Toolbar.');
        ui.pb_expend.tip     = model.getTipTemplete('展开', 'arrow_down.bmp',
                'Click the Button to Expend the Toolbar.');
    
}

function OnCloseForm() {}

function OnException(err) {
        //ui.MessageBox('Error', '' + err, MessageBox.Icon.Critical, MessageBox.Button.Ok);
}

//////////////////////////////////////////////////////////////////////////
// Callback Functions.
// 641a254c-ef3e-11ea-bc8a-379bb908bdd7

function resetTopmenuStatus() {
        ui.pb_copyright.valid = false;
        ui.pb_dev.valid         = false;
        ui.pb_lesson.valid      = false;
}

function OnCopyright(){
        resetTopmenuStatus();
        ui.pb_copyright.valid = true;
        
        OnExpend();
        
        fireEvent('draw');
}

function OnLesson(){
        resetTopmenuStatus();
        ui.pb_lesson.valid = true;
        
        OnExpend();
        
        fireEvent('pickup');
}

function OnDevelopment(){
        resetTopmenuStatus();
        ui.pb_dev.valid = true;
        
        OnExpend();
        
        fireEvent('view');
}

function OnExpend(){
        ui.rbox.index = 0;
        
        fireEvent('expend');
}

function OnFold(){
        ui.rbox.index = 1;
        
        fireEvent('fold');
}

function OnManual() {
        fireEvent('open');
}

function OnOption() {
        fireEvent('option');
}

function OnExit() {
        fireEvent('exit');
}

function OnHelp() {
        fireEvent('help');
}

function OnContextMenu() {
        if (ui.pb_menu.content_menu === 1) {OnManual();}
        if (ui.pb_menu.content_menu === 2) {OnOption();}
        if (ui.pb_menu.content_menu === 3) {OnExit();}
}

function OnMenu() {
        ui.pb_menu.content_menu = [
                {
                        name: '打开',
                        icon: 'open',
                        tip: model.getTipTemplete('打开', 'open.bmp', 'Click this Button to Open DXF File.'),
                        id: 1
                },
                {
                        name: '-'
                },
                {
                        name: '系统选项 ...',
                        icon: 'development',
                        tip : model.getTipTemplete('系统选项', 'development.bmp',
                                'Click this Button to Open the Configuration Options.'),
                        id: 2
                },
                {
                        name: '-'
                },
                {
                        name: '退出',
                        icon: 'outdoor',
                        tip : model.getTipTemplete('退出', 'outdoor.bmp',
                                'Click this Button to Exit the Software.'),
                        id: 3
                }
        ];
}

function fireEvent(type) {
        PUI(() => {
                pui.event = {
                        type: type
                };
        });
}

CW_DeclareOuterVariable('event');

//////////////////////////////////////////////////////////////////////////
// Utils Functions.
// 6c165ad6-ef3e-11ea-987c-b761a131c2fe

function PUI(cb) {
        if (pui) {cb();}
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
        if (typeof(__DeclareVariable) === 'function') {
                __DeclareVariable(name, setter, getter);
        }
}

function CW_DeclareOuterVariable(name) {
        if (typeof(__DeclareOuterVariable) === 'function') {
                __DeclareOuterVariable(name);
        }
}
