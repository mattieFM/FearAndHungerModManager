// var MATTIE = MATTIE || {};
// MATTIE.multiplayer = MATTIE.multiplayer || {}
// MATTIE.multiplayer.devTools = {};
// MATTIE.multiplayer.enemyEmitter = {};
// MATTIE.multiplayer.currentBattleEnemy = MATTIE.multiplayer.currentBattleEnemy || {};



// MATTIE.multiplayer.enemyIFrames = {};
// MATTIE.multiplayer.enemyIFrames.start =Game_Event.prototype.start;
// MATTIE.multiplayer.enemyIFrames.amountMs = 500;

// Game_Event.prototype.start = function () {
//     if(!MATTIE.multiplayer.hasImmunityToBattles){
//         console.log("game event started");
//         MATTIE.multiplayer.enemyIFrames.start.call(this);
//         this._timeLastTriggered = Date.now();
//     }else{
//         console.log("game event blocked by iframe");
//     }
// }