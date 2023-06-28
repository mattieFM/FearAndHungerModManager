var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.multiplayer.devTools = {};
MATTIE.multiplayer.enemyEmitter = {};

function enemyLog(msg) {
    if(MATTIE.multiplayer.devTools.moveLogger){
        console.info("Enemy Logger -- " + msg);
    }
}



//loggers



MATTIE.multiplayer.enemyEmitter.moveTypeRandom = Game_Event.prototype.moveTypeRandom;
Game_Event.prototype.moveTypeRandom = function() {
    enemyLog("enemy has moved randomly");
    return MATTIE.multiplayer.enemyEmitter.moveTypeRandom.call(this)
}

MATTIE.multiplayer.enemyEmitter.moveTypeTowardPlayer = Game_Event.prototype.moveTypeTowardPlayer;
Game_Event.prototype.moveTypeTowardPlayer = function() {
    enemyLog("enemy has moved towards player");
    return MATTIE.multiplayer.enemyEmitter.moveTypeTowardPlayer.call(this)
}

//almost all movement in funger is custom
MATTIE.multiplayer.enemyEmitter.moveTypeCustom = Game_Event.prototype.moveTypeCustom;
Game_Event.prototype.moveTypeCustom = function() {
    enemyLog("enemy has moved custom");
    return MATTIE.multiplayer.enemyEmitter.moveTypeCustom.call(this);
};

//fires a lot (multiple times per custom move call)
// MATTIE.multiplayer.enemyEmitter.updateRoutineMove = Game_Character.prototype.updateRoutineMove;
// Game_Character.prototype.updateRoutineMove = function () {
//     enemyLog("updated routine move");
//     return MATTIE.multiplayer.enemyEmitter.updateRoutineMove.call(this);
// }

//fires very frequently
// MATTIE.multiplayer.enemyEmitter.command205 = Game_Interpreter.prototype.command205;
//     Game_Interpreter.prototype.command205 = function() {
//         enemyLog("command205");
//         return MATTIE.multiplayer.enemyEmitter.command205.call(this)

//     }


MATTIE.multiplayer.enemyEmitter.setMoveRoute = Game_Character.prototype.setMoveRoute;
Game_Character.prototype.setMoveRoute = function(moveRoute) {
    enemyLog("set move route");
    return MATTIE.multiplayer.enemyEmitter.setMoveRoute.call(this,moveRoute);
}

//gets called the same amount as update routine move
MATTIE.multiplayer.enemyEmitter.forceMoveRoute = Game_Character.prototype.forceMoveRoute;
Game_Character.prototype.forceMoveRoute = function(moveRoute) {
    if(!(this instanceof Game_Player))
    enemyLog("force move route");
    return MATTIE.multiplayer.enemyEmitter.forceMoveRoute.call(this,moveRoute);
}

//fires constantly
// MATTIE.multiplayer.enemyEmitter.updateSelfMovement = Game_Event.prototype.updateSelfMovement;
// Game_Event.prototype.updateSelfMovement = function() {
//     enemyLog("updated self movement");
//     return MATTIE.multiplayer.enemyEmitter.updateSelfMovement.call(this)
// }

// MATTIE.multiplayer.enemyEmitter.isNearThePlayer = Game_Event.prototype.isNearThePlayer;
// Game_Event.prototype.isNearThePlayer = function() {
//     let val = MATTIE.multiplayer.enemyEmitter.isNearThePlayer.call(this);
//     if(val) enemyLog("enemy is near the player");
//     return val
// }

// MATTIE.multiplayer.enemyEmitter.isCollidedWithPlayerCharacters = Game_Event.prototype.isCollidedWithPlayerCharacters;
// Game_Event.prototype.isCollidedWithPlayerCharacters = function(x, y) {
//     let val = MATTIE.multiplayer.enemyEmitter.isCollidedWithPlayerCharacters.call(this,x,y);
//     if(val) enemyLog("enemy has collided with player");
//     return val
    
// }