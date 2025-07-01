////////////////////////////////////////////////////////////////////////////
// System Pre-define Functions
// 95099372-ef3e-11ea-9c81-bf848405c62e

function OnInitializeData() {
    
        PUI(()=>{
                //you can access the 'ui' namespace in the parent form using the variable 'pui' here.
                //The 'pui' variable is valid in all functions of this document.
                //For robustness, you'd better use 'PUI(cb);' to access 'pui' variable.
                clear();
        });
        
        ui.block.tip = model.getTipTemplete('块列表', 'blocklist.bmp', '块列表显示区');
        ui.layer.tip = model.getTipTemplete('层列表', 'layerlist.bmp', '层列表显示区');
}

function OnCloseForm() {
}

function OnException(err) {
        //ui.MessageBox('Error', '' + err, MessageBox.Icon.Critical, MessageBox.Button.Ok);
}

function update(){
        var block_list  = comx.dxf_engine.GetBlockList().split(",").filter(item=>{return true;/*item[0] !== '*';*/});
        var block_table = [["块名", "可见性"]].concat(block_list.map(item=>{ return [item, true]; }));
        
        ui.block.table     = block_table;
        ui.block.head_size = [0, 0];
                                
        for(let idx = 0; idx < block_table.length - 1; ++idx) {ui.block.filter = [idx, 1, [true, false]];}
                                
        var layer_list  = comx.dxf_engine.GetLayerList().split(",");
        var layer_table = [["层名", "颜色", "可见性"]];
        for(let idx = 0; idx < layer_list.length / 2; ++idx) {
                layer_table.push([layer_list[idx * 2 + 0], layer_list[idx * 2 + 1], true]);
        }
                         
        ui.layer.table  = layer_table;
                                
        for(let idx = 0; idx < layer_list.length / 2; ++idx) {
                ui.layer.color  = [idx, 1, layer_table[idx + 1][1]];
                ui.layer.filter = [idx, 2, [true, false]];
        }
                       
        ui.layer.head_size = [0, 0, 0];
}

function clear() {
        ui.block.table = [
                ['块名', '可见性']
        ];
        ui.layer.table = [
                ['层名', '颜色', '可见性']
        ];
}

//////////////////////////////////////////////////////////////////////////
// Callback Functions.
// 641a254c-ef3e-11ea-bc8a-379bb908bdd7

//////////////////////////////////////////////////////////////////////////
// Utils Functions.
// 6c165ad6-ef3e-11ea-987c-b761a131c2fe

CW_DeclareVariable('bvisible',
        flag=>{
                ui.block.visible = flag;
        },
        ()=>{
                return ui.block.visible;
        });
        
CW_DeclareVariable('lvisible',
        flag=>{
                ui.layer.visible = flag;
        },
        ()=>{
                return ui.layer.visible;
        });     
     
CW_DeclareVariable('event',
        event=>{
                if(event.type === 'update') {update();}
                if(event.type === 'clear') {clear();}
        },
        ()=>{
                return undefined;
        });   

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
