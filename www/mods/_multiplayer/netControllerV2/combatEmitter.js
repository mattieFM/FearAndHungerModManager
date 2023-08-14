var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.multiplayer.devTools = {};
MATTIE.multiplayer.enemyEmitter = {};
MATTIE.multiplayer.currentBattleEnemy = MATTIE.multiplayer.currentBattleEnemy || {};

MATTIE.BattleManagerStartTurn = BattleManager.startTurn;
function BattleLog(str) {
    if(MATTIE.multiplayer.devTools.inBattleLogger) console.info(str);
}


BattleManager.unready = function(){
    BattleManager.startInput();
    this._phase = 'input';
    BattleLog("unready!");
    MATTIE.multiplayer.BattleController.emitUnreadyEvent();
}

BattleManager.ready = function(){
    this._phase = 'ready';
    
    BattleLog("ready!");
    MATTIE.multiplayer.BattleController.emitReadyEvent();
}

BattleManager.startTurn = function() {
    if(MATTIE.multiplayer.currentBattleEvent.totalCombatants() == 1){ //if solo, start next phase
        MATTIE.BattleManagerStartTurn.call(this);
    }else{ //if the player is fighting with allies enter "ready" state
        this.ready();
    }
    
  };

  BattleManager.checkAllPlayersReady = function(){
    return MATTIE.multiplayer.currentBattleEvent.allReady();
  }

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
                 MATTIE.BattleManagerStartTurn.call(this);
        }
            
            break;
        case 'turn':
            this.updateTurn();
            console.log("update turn case")
            break;
        case 'action':
            this.updateAction();
            console.log("action case")
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