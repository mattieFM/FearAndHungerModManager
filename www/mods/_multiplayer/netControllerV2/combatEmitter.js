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

MATTIE.multiplayer.battleManagerInit = BattleManager.initMembers;
BattleManager.initMembers = function() {
    MATTIE.multiplayer.battleManagerInit.call(this);
    this._netActors = [];
}

BattleManager.getNetBattlers = function(){
    if(!this._netActors)  this._netActors = [];
    return this._netActors;
}

BattleManager.startAfterReady = function(){
    
    MATTIE.BattleManagerStartTurn.call(this);
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
    MATTIE.multiplayer.BattleController.emitReadyEvent(JSON.stringify(this.getAllPlayerActions()));
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
    return(arr);
}
/** start the combat round */
BattleManager.startTurn = function() {
    if(MATTIE.multiplayer.currentBattleEvent.totalCombatants() == 1){ //if solo, start next phase
        MATTIE.BattleManagerStartTurn.call(this);
    }else{ //if the player is fighting with allies enter "ready" state
        this.ready();
    }
    
  };
  BattleManager.getNextSubject = function() {
    if ($gameTroop.turnCount() <= 0) return;
    this._performedBattlers = this._performedBattlers || [];
    this.makeActionOrders();
    for (;;) {
        var battlerArray = [];
        for (var i = 0; i < this._actionBattlers.length; ++i) {
          var obj = this._actionBattlers[i];
          if (!this._performedBattlers.contains(obj)) battlerArray.push(obj);
        }
        this._actionBattlers = battlerArray;
        var battler = this._actionBattlers.shift();
        console.log(battler);
        if (!battler) return null;
        if (battler.isAlive()) {
          console.log("returned");
            this._performedBattlers.push(battler);
            return battler;
        }
    }
};
    MATTIE.multiplayer.battlemanageronStart = BattleManager.startBattle;
    BattleManager.startBattle = function() {
        MATTIE.multiplayer.battlemanageronStart.call(this);
        this._netActors = [];
    };
  

  BattleManager.addNetActionBattler = function(battler){
    if(!this._netActionBattlers) this._netActionBattlers = [];
    this._netActionBattlers.push(battler);
  }

  MATTIE.multiplayer.multiCombat.makeActionOrders = BattleManager.makeActionOrders;
  BattleManager.makeActionOrders = function() {
    if(!this._netActionBattlers) this._netActionBattlers = [];
    MATTIE.multiplayer.multiCombat.makeActionOrders.call(this);
    this._actionBattlers.splice.apply(this._actionBattlers, [4, 0].concat(this._netActionBattlers));
  }
  Game_Battler.prototype.setCurrentAction = function(action) {
    this.forceAction(action._item._itemId,action._targetIndex, action.forcedTargets);
    if(action._item._dataClass==="item") this._actions[this._actions.length-1].setItem(action._item._itemId)

};
MATTIE.forceAction = Game_Battler.prototype.forceAction;
Game_Battler.prototype.forceAction = function(skillId, targetIndex, forcedTargets = []) {
    if(forcedTargets.length > 0) this.forcedTargets = forcedTargets;
    MATTIE.forceAction.call(this, skillId, targetIndex);
    if(forcedTargets.length > 0) this._actions[this._actions.length-1].forcedTargets = forcedTargets;
};

MATTIE.maketargets = Game_Action.prototype.makeTargets
/** override make targets to return forced target if we need */
Game_Action.prototype.makeTargets = function() {
    if(this.forcedTargets) {
        console.log("forced targets thrown");
        return this.forcedTargets;
    }

    if(this.netPartyId) {
        console.log("local targeting net");
        let netParty = MATTIE.multiplayer.getCurrentNetController().netPlayers[this.netPartyId].battleMembers();
        return netParty;
    }
    return MATTIE.maketargets.call(this);
};

Game_Action.prototype.setNetPartyId = function(id){
    this.netPartyId = id;
}

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
                this.startAfterReady();
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