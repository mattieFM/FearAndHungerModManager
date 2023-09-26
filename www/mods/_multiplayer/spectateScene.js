//the scene for spectating in multiplayer
var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.multiplayer.spectate = MATTIE.multiplayer.spectate || {};
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.multiplayer.spectate.init = Scene_Map.prototype.initialize;

/**
 * Scene_Spectate
 * @description a scene for spectating after death
 * @extends Scene_Map
 */


MATTIE.scenes.multiplayer.Scene_Spectate = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.scenes.multiplayer.Scene_Spectate.prototype = Object.create(Scene_Map.prototype);
MATTIE.scenes.multiplayer.Scene_Spectate.prototype.constructor = MATTIE.scenes.multiplayer.Scene_Spectate;

MATTIE.scenes.multiplayer.Scene_Spectate.prototype.initialize = function() {
    MATTIE.multiplayer.spectate.init.call(this);
};

//functions to make do nothing --make the ghost unable to interact with the world
MATTIE.scenes.multiplayer.Scene_Spectate.prototype.updateEncounter = function() {};
MATTIE.scenes.multiplayer.Scene_Spectate.prototype.startEncounterEffect = function() {};
MATTIE.scenes.multiplayer.Scene_Spectate.prototype.updateEncounterEffect = function() {};


MATTIE.multiplayer.spectate.canPass = Game_CharacterBase.prototype.canPass;
Game_CharacterBase.prototype.canPass = function(x, y, d) {
    if(MATTIE.multiplayer.isSpectator) return true;
    return MATTIE.multiplayer.spectate.canPass.call(this,x,y,d);
};

MATTIE.multiplayer.spectate.start = Game_Event.prototype.start;
Game_Event.prototype.start = function (){
    var list = this.list().map(ev=>ev.code);
    if(MATTIE.multiplayer.isSpectator) {
        if(!list.includes(201)) return
    }
    return MATTIE.multiplayer.spectate.start.call(this);
}

//make sure autorun events cannot run while ghost
MATTIE.multiplayer.spectate.checkEventTriggerAuto = Game_Event.prototype.checkEventTriggerAuto;
Game_Event.prototype.checkEventTriggerAuto = function() {
    if(!MATTIE.multiplayer.isSpectator) MATTIE.multiplayer.spectate.checkEventTriggerAuto.call(this);
};

// //override battle processing to not allow ghosts to enter into combat ever
// MATTIE.multiplayer.spectate.command301 = Game_Interpreter.prototype.command301
// Game_Interpreter.prototype.command301 = function() {
//     if(!MATTIE.multiplayer.isSpectator) MATTIE.multiplayer.spectate.command301.call(this); //spectators cannot enter battles
// }

//make sure player can't somehow wind up back on normal map
Scene_Map.prototype.initialize = function(){
    MATTIE.multiplayer.spectate.init.call(this);
    if(MATTIE.multiplayer.isSpectator) 
    setTimeout(() => {
        SceneManager.goto(MATTIE.scenes.multiplayer.Scene_Spectate);
    }, 1000);
}


