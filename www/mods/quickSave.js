

var MATTIE = MATTIE || {};
MATTIE.quickSaves = MATTIE.quickSaves || {};

MATTIE.quickSaves.quickSaveId = 9998;
function initQuickSave (){
    Input.addKeyBind('l', ()=>{
        $gameSystem.onBeforeSave();
        DataManager.saveGame(MATTIE.quickSaves.quickSaveId,true);
    }, "Quick Save", 1)

    Input.addKeyBind('o', ()=>{
        MATTIE.menus.loadGameAndGoTo(MATTIE.quickSaves.quickSaveId);
    }, "Quick Load", 1)

    Input.addKeyBind('u', ()=>{
        Game_Interpreter.prototype.command352();
    }, "Save", 1)

    Input.addKeyBind('i', ()=>{
        SceneManager.push(Scene_Load);
    }, "Load", 1)


    //maxSavefiles
}
initQuickSave();
