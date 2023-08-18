

var MATTIE = MATTIE || {};
MATTIE.devTools = MATTIE.devTools || {};

function initQuickSave (){
    Input.addKeyBind('l', ()=>{
        Game_Interpreter.prototype.command352();
    })

    Input.addKeyBind('o', ()=>{
        SceneManager.push(Scene_Load);
    })
}
initQuickSave();
