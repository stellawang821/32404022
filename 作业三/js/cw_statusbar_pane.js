////////////////////////////////////////////////////////////////////////////
// System Pre-define Functions
// 95099372-ef3e-11ea-9c81-bf848405c62e

function OnInitializeData() {
    
        PUI(()=>{
                //you can access the 'ui' namespace in the parent form using the variable 'pui' here.
                //The 'pui' variable is valid in all functions of this document.
                //For robustness, you'd better use 'PUI(cb);' to access 'pui' variable.
	
        });
        
        //ui.cueline.tip = model.getTipTemplete('提示', 'info2.bmp', '提示信息栏');
}

function OnCloseForm() {
}

function OnException(err) {
        //ui.MessageBox('Error', '' + err, MessageBox.Icon.Critical, MessageBox.Button.Ok);
}

//////////////////////////////////////////////////////////////////////////
// Callback Functions.
// 641a254c-ef3e-11ea-bc8a-379bb908bdd7

//////////////////////////////////////////////////////////////////////////
// Utils Functions.
// 6c165ad6-ef3e-11ea-987c-b761a131c2fe

CW_DeclareVariable('cueline', 
        cueline=>{
                //<b><u style="color:black">提示信息:</u></b> <span style="color:darkblue">就绪.</span>
                ui.cueline.value = "<b><u style='color:black'>提示信息:</u></b> <span style='color:darkblue'>" + cueline + "</span>";
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
