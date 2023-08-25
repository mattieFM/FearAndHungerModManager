

var MATTIE = MATTIE || {};
MATTIE.quickSaves = MATTIE.quickSaves || {};

MATTIE.quickSaves.quickSaveId = 9998;
function initQuickSave (){
    Input.addKeyBind('l', ()=>{
        $gameSystem.onBeforeSave();
        DataManager.saveGame(MATTIE.quickSaves.quickSaveId,true);
    }, "Quick Save")

    Input.addKeyBind('o', ()=>{
        MATTIE.menus.loadGameAndGoTo(MATTIE.quickSaves.quickSaveId);
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
