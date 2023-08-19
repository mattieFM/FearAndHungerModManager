

var MATTIE = MATTIE || {};
MATTIE.devTools = MATTIE.devTools || {};

function initQuickSave (){
    Input.addKeyBind('l', ()=>{
        $gameSystem.onBeforeSave();
        DataManager.saveGame(DataManager.maxSavefiles() + 1);
    }, "Quick Save")

    Input.addKeyBind('o', ()=>{
       
        DataManager.loadGame(DataManager.maxSavefiles() + 1);
        $gameSystem.onAfterLoad();
        SceneManager.goto(Scene_Map);
    }, "Quick Load")

    Input.addKeyBind('u', ()=>{
        Game_Interpreter.prototype.command352();
    }, "Save")

    Input.addKeyBind('i', ()=>{
        SceneManager.push(Scene_Load);
    }, "Load")


    //maxSavefiles
}
initQuickSave();
