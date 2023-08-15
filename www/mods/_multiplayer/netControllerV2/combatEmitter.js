var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.multiplayer.devTools = {};
MATTIE.multiplayer.enemyEmitter = {};
MATTIE.multiplayer.currentBattleEnemy = MATTIE.multiplayer.currentBattleEnemy || {};

MATTIE.BattleManagerStartTurn = BattleManager.startTurn;

/** log info with the proper conditionals */
function BattleLog(str) {
    if(MATTIE.multiplayer.devTools.inBattleLogger) console.info(str);
}

/** exit the ready state, returning to the beginning of the input phase 
 * TODO: instead of returning to the start of the input phase return to the last input so that players can easily correct mistakes without having to...
 * 
*/
BattleManager.unready = function(){
    BattleManager.startInput();
    this._phase = 'input';
    BattleLog("unready!");
    MATTIE.multiplayer.BattleController.emitUnreadyEvent();
}

/** enter the ready state */
BattleManager.ready = function(){
    this._phase = 'ready';
    
    BattleLog("ready!");
    MATTIE.multiplayer.BattleController.emitReadyEvent();
}

/** check if a battler exists in the local party */
Game_Battler.prototype.battlerInParty = function(){
    return $gameParty.battleMembers().contains(this);
}

/** finds all currently inputted actions for the local party and returns an array of them */
BattleManager.getAllPlayerActions = function () {
    let arr = [];
    this.makeActionOrders();
    this._actionBattlers.forEach(battler => {
        if (battler.battlerInParty() && battler.isAlive())
        arr.push(battler.currentAction());
    });
    console.log(arr);
}
/** start the combat round */
BattleManager.startTurn = function() {
    if(MATTIE.multiplayer.currentBattleEvent.totalCombatants() == 1){ //if solo, start next phase
        this.getAllPlayerActions();
        MATTIE.BattleManagerStartTurn.call(this);
    }else{ //if the player is fighting with allies enter "ready" state
        this.ready();
    }
    
  };

  /** check that all combatants on this event are ready */
  BattleManager.checkAllPlayersReady = function(){
    return MATTIE.multiplayer.currentBattleEvent.allReady();
  }

  //override YANFly's update function to have the ready state aswell
  BattleManager.update = function() {
    if (!this.isBusy() && !this.updateEvent()) {
        switch (this._phase) {
        case 'start':
            this.startInput();
            console.log("start case")
            break;
        case 'ready':
            //allow 'un-reading' to go back to previous state.
            //and if all players are ready proceed to turn state.
            if(this.checkAllPlayersReady()){
                this.getAllPlayerActions();
                 MATTIE.BattleManagerStartTurn.call(this);
            }
            
            break;
        case 'turn':
            this.updateTurn();
            console.log("update turn case:\n" + this._actionList)
            break;
        case 'action':
            this.updateAction();
            console.log("update turn case")
            break;
        case 'phaseChange':
            this.updatePhase();
            console.log("update phase case")
            break;
        case 'actionList':
            this.updateActionList()
            console.log("action list case")
            break;
        case 'actionTargetList':
            this.updateActionTargetList()
            console.log("action list target case")
            break;
        case 'turnEnd':
            this.updateTurnEnd();
            MATTIE.multiplayer.BattleController.emitUnreadyEvent();
            console.log("turn end case")
            break;
        case 'battleEnd':
            this.updateBattleEnd();
            console.log("battle end case")
            break;
        }
    }
};