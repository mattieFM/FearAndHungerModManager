var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.multiplayer.devTools = {};
MATTIE.multiplayer.enemyEmitter = {};
MATTIE.multiplayer.currentBattleEnemy = MATTIE.multiplayer.currentBattleEnemy || {};

function enemyLog(msg) {
    if(MATTIE.multiplayer.devTools.moveLogger){
        console.info("Enemy Logger -- " + msg);
    }
}

//event battle emitters
MATTIE.multiplayer.gameSystem_OnBattleStart = Game_System.prototype.onBattleStart; //game system.onBattleStart is only used for statistics, but this makes the most logical sense to override.
Game_System.prototype.onBattleStart = function() {
    MATTIE.multiplayer.inBattle= true;
    enemyLog("Battle Started");
    return MATTIE.multiplayer.gameSystem_OnBattleStart.call(this);;
}

MATTIE.multiplayer.BattleManager_EndBattle = BattleManager.endBattle;
BattleManager.endBattle = function(result) {
    var res = MATTIE.multiplayer.BattleManager_EndBattle.call(this, result);
    var obj = {};
    obj.battleEnd = MATTIE.multiplayer.currentBattleEnemy;
    MATTIE.multiplayer.getCurrentNetController().emitBattleEndEvent(obj);
    MATTIE.multiplayer.inBattle = false;
    enemyLog("Battle Ended" + JSON.stringify(obj));
    return res;
}

MATTIE.multiplayer.gameSystem_OnBattleWin = Game_System.prototype.onBattleWin;
Game_System.prototype.onBattleWin = function() {
    
    enemyLog("Battle Won");
    return MATTIE.multiplayer.gameSystem_OnBattleWin.call(this);
};


MATTIE.multiplayer.gameSystem_onBattleEscape = Game_System.prototype.onBattleEscape;
Game_System.prototype.onBattleEscape = function() {
    
    enemyLog("Battle Escaped");
    return MATTIE.multiplayer.gameSystem_onBattleEscape.call(this);
};

MATTIE.multiplayer.battleProcessing = Game_Interpreter.prototype.command301;
Game_Interpreter.prototype.command301 = function() {
    
    MATTIE.multiplayer.battleProcessing.call(this);
    var obj = {};
    obj.battleStart = {};
    obj.battleStart.eventId = this.eventId();
    obj.battleStart.mapId = this._mapId;
    MATTIE.multiplayer.currentBattleEnemy = obj.battleStart;
    MATTIE.multiplayer.currentBattleEvent = $gameMap.event(this.eventId());
    MATTIE.multiplayer.getCurrentNetController().emitBattleStartEvent(obj);
    MATTIE.multiplayer.hasImmunityToBattles = true;
    enemyLog("Battle Processing for event #" + this.eventId() + " on map #"+this._mapId);
    return true;
}

MATTIE.multiplayer.GameCharBase_Init = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function () {
    MATTIE.multiplayer.GameCharBase_Init.call(this);
    this._combatants = {};
}

Game_Map.prototype.unlockEvent = function(eventId) {
    if (this._events[eventId]) {
        if(!this._events[eventId].inCombat())
        this._events[eventId].unlock();
    }
};

Game_CharacterBase.prototype.getIdsInCombatWith = function () {
    return Object.keys(this._combatants);
}

Game_CharacterBase.prototype.totalCombatants = function () {
    return Object.keys(this._combatants).length;
}

Game_CharacterBase.prototype.inCombat = function () {
    if(!this._combatants) this._combatants = {};
    if(MATTIE.multiplayer.devTools.battleLogger) console.info("incombat. The following players are in combat with this event: " + this.totalCombatants());
    return this.totalCombatants() > 0;
}

Game_CharacterBase.prototype.addIdToCombatArr = function (id) {
    console.log(id);
    if(this._combatants)
    this._combatants[id] = 0;
    else{
    this._combatants = {};
    this._combatants[id] = 0;
    console.log(this._combatants);

    }

    if(MATTIE.multiplayer.devTools.battleLogger) console.info("The following players are in combat with this event: " + this.totalCombatants());
}

Game_CharacterBase.prototype.removeIdFromCombatArr = function (id) {
    delete this._combatants[id];
    if(MATTIE.multiplayer.devTools.battleLogger) console.info("The following players are in combat with this event: " + this.totalCombatants());
}

Game_CharacterBase.prototype.setReadyIfExists = function (id, bool) {
    console.log(id + " tried to set to "+ bool)
    if(Object.keys(this._combatants).indexOf(id) != -1){
        this._combatants[id] = bool;
    }
    console.log(this._combatants)
}

Game_CharacterBase.prototype.allReady = function () {
    let val = true;
    Object.keys(this._combatants).forEach(key => {
        let element = this._combatants[key];
        if(element == 0){
            val = false
            return false;}
    });
    return val;
}


//loggers



// MATTIE.multiplayer.enemyEmitter.moveTypeRandom = Game_Event.prototype.moveTypeRandom;
// Game_Event.prototype.moveTypeRandom = function() {
//     enemyLog("enemy has moved randomly");
//     return MATTIE.multiplayer.enemyEmitter.moveTypeRandom.call(this)
// }

// MATTIE.multiplayer.enemyEmitter.moveTypeTowardPlayer = Game_Event.prototype.moveTypeTowardPlayer;
// Game_Event.prototype.moveTypeTowardPlayer = function() {
//     enemyLog("enemy has moved towards player");
//     return MATTIE.multiplayer.enemyEmitter.moveTypeTowardPlayer.call(this)
// }

// //almost all movement in funger is custom
// MATTIE.multiplayer.enemyEmitter.moveTypeCustom = Game_Event.prototype.moveTypeCustom;
// Game_Event.prototype.moveTypeCustom = function() {
//     enemyLog("enemy has moved custom");
//     return MATTIE.multiplayer.enemyEmitter.moveTypeCustom.call(this);
// };

// //fires a lot (multiple times per custom move call)
// // MATTIE.multiplayer.enemyEmitter.updateRoutineMove = Game_Character.prototype.updateRoutineMove;
// // Game_Character.prototype.updateRoutineMove = function () {
// //     enemyLog("updated routine move");
// //     return MATTIE.multiplayer.enemyEmitter.updateRoutineMove.call(this);
// // }

// //fires very frequently
// // MATTIE.multiplayer.enemyEmitter.command205 = Game_Interpreter.prototype.command205;
// //     Game_Interpreter.prototype.command205 = function() {
// //         enemyLog("command205");
// //         return MATTIE.multiplayer.enemyEmitter.command205.call(this)

// //     }


// MATTIE.multiplayer.enemyEmitter.setMoveRoute = Game_Character.prototype.setMoveRoute;
// Game_Character.prototype.setMoveRoute = function(moveRoute) {
//     enemyLog("set move route");
//     return MATTIE.multiplayer.enemyEmitter.setMoveRoute.call(this,moveRoute);
// }

// //gets called the same amount as update routine move
// MATTIE.multiplayer.enemyEmitter.forceMoveRoute = Game_Character.prototype.forceMoveRoute;
// Game_Character.prototype.forceMoveRoute = function(moveRoute) {
//     if(!(this instanceof Game_Player))
//     enemyLog("force move route");
//     return MATTIE.multiplayer.enemyEmitter.forceMoveRoute.call(this,moveRoute);
// }

// //fires constantly
// // MATTIE.multiplayer.enemyEmitter.updateSelfMovement = Game_Event.prototype.updateSelfMovement;
// // Game_Event.prototype.updateSelfMovement = function() {
// //     enemyLog("updated self movement");
// //     return MATTIE.multiplayer.enemyEmitter.updateSelfMovement.call(this)
// // }

// // MATTIE.multiplayer.enemyEmitter.isNearThePlayer = Game_Event.prototype.isNearThePlayer;
// // Game_Event.prototype.isNearThePlayer = function() {
// //     let val = MATTIE.multiplayer.enemyEmitter.isNearThePlayer.call(this);
// //     if(val) enemyLog("enemy is near the player");
// //     return val
// // }

// // MATTIE.multiplayer.enemyEmitter.isCollidedWithPlayerCharacters = Game_Event.prototype.isCollidedWithPlayerCharacters;
// // Game_Event.prototype.isCollidedWithPlayerCharacters = function(x, y) {
// //     let val = MATTIE.multiplayer.enemyEmitter.isCollidedWithPlayerCharacters.call(this,x,y);
// //     if(val) enemyLog("enemy has collided with player");
// //     return val
    
// // }