////////////////////////////////////////////////////////////////////////////
// System Pre-define Functions
// 95099372-ef3e-11ea-9c81-bf848405c62e

function OnInitializeData() {
    
        PUI(()=>{
                //you can access the 'ui' namespace in the parent form using the variable 'pui' here.
                //The 'pui' variable is valid in all functions of this document.
                //For robustness, you'd better use 'PUI(cb);' to access 'pui' variable.
                OnPickupMethod(2);
        });
        
        ui.property.tip       = model.getTipTemplete('属性',     'property.bmp',          '显示当前选中图元的属性信息');
        ui.point_pickup.tip   = model.getTipTemplete('点选',     'point_pickup.bmp', '鼠标左键点击方式选择实体');
        ui.rect_pickup.tip    = model.getTipTemplete('框选',     'rect_pickup.bmp',  '鼠标左键拉框方式选择实体');
        ui.nil_pickup.tip     = model.getTipTemplete('不选',     'nil_pickup.bmp',   '关闭选择器，不选择实体');
        ui.auto_highlight.tip = model.getTipTemplete('自动高亮', 'highlight.bmp',     '鼠标滑过实体时，自动高亮<br/>注意：当模型较大时，可关闭该选项提高效率');
        ui.filter.tip         = model.getTipTemplete('过滤器',   'filter.bmp',        '实体选取过滤器列表');
}

function OnCloseForm() {
}

function OnException(err) {
        //ui.MessageBox('Error', '' + err, MessageBox.Icon.Critical, MessageBox.Button.Ok);
}

//////////////////////////////////////////////////////////////////////////
// Callback Functions.
// 641a254c-ef3e-11ea-bc8a-379bb908bdd7

function OnFilterIndexChanged(){
        fireEvent('filter_change', getPickupPara());
}

function OnAutoHighlight(){
        fireEvent('auto_highlight', getPickupPara());
}

function OnPickupMethod(idx){
        var entryBtn = [
                ui.point_pickup,
                ui.rect_pickup,
                ui.nil_pickup
        ];
        
        entryBtn.forEach(btn=>{btn.valid = false;});
        entryBtn[idx].valid = true;
        
        var entryName = [
                'point_pickup',
                'rect_pickup',
                'nil_pickup'
        ];
        
        fireEvent(entryName[idx], getPickupPara());
}

//////////////////////////////////////////////////////////////////////////
// Utils Functions.
// 6c165ad6-ef3e-11ea-987c-b761a131c2fe

function getPickupPara() {
        var entryEnum = [
                0, //GL.Picker.Behavior.Point,
                1, //GL.Picker.Behavior.Rect,
                2  //GL.Picker.Behavior.None
        ];
        
        var entryFilter = [
                -1,   //All Entities Type
                -2,   //Block
                -3,   //Layer
                2024, //Vertex
                2023, //Line
                2026, //Circle
                2025, //Arc
                2027, //Elipse
                2028, //Face
                2029, //Text
                2030  //MText
        ];
        
        let idx = 2;
        
        if(ui.point_pickup.valid) {idx = 0;}
        if(ui.rect_pickup.valid)  {idx = 1;}
       
        return {
                pickup_type    : entryEnum[idx],
                auto_highlight : ui.auto_highlight.valid,
                filter_code    : entryFilter[ui.filter.index]
        };
}

function PUI(cb) {
        if(pui){cb();}
}

CW_DeclareVariable('info',
        info=>{
                ui.property.value = info;
        },
        ()=>{
                return ui.property.value;
        });
        
CW_DeclareVariable('picker',
        info=>{
                console.assert(false, 'picker is readonly.');
        },
        ()=>{
                return getPickupPara();
        });

CW_DeclareOuterVariable('event');

function fireEvent(type, data) {
        PUI(() => {
                pui.event = {
                        type: type,
                        data: data
                };
        });
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
