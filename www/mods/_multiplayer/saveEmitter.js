var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.multiplayer.saveEmitter = MATTIE.multiplayer.saveEmitter || {};



MATTIE.multiplayer.saveEmitter.saveGame = DataManager.saveGame
DataManager.saveGame = function(savefileId, noTimeStamp=false) {
    let returnVal = MATTIE.multiplayer.saveEmitter.saveGame.call(this, savefileId, noTimeStamp);
    MATTIE.multiplayer.getCurrentNetController().emitSaveEvent();
    return returnVal;
}