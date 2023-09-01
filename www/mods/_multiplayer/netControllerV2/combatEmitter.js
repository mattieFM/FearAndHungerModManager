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
        if (battler.battlerInParty() && battler.isAlive()){
            let action = battler.currentAction();
            action.setNetTarget(MATTIE.multiplayer.getCurrentNetController().peerId)
            arr.push(action);
        }
    });
    return(arr);
}
Game_Action.prototype.setNetTarget = function(peerId){
    this._netTarget = peerId;
}
MATTIE.multiplayer.gameActonSubject = Game_Action.prototype.subject;
Game_Action.prototype.subject = function() {
    
    if(this._netTarget) {
        if(this._netTarget != MATTIE.multiplayer.getCurrentNetController().peerId){
            console.log(this._netTarget)
            console.log(MATTIE.multiplayer.getCurrentNetController().peerId)
            return MATTIE.multiplayer.getCurrentNetController().netPlayers[this._netTarget].$netActors.dataActor(this._subjectActorId);
        }
    }

    if (this._subjectActorId > 0) {
        return $gameActors.actor(this._subjectActorId);
    } else {
        return $gameTroop.members()[this._subjectEnemyIndex];
    }
};

/** start the combat round */
BattleManager.startTurn = function() {
    if($gameTroop.totalCombatants() == 1 && !Galv.EXTURN.active){ //if solo, start next phase
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
        if (!battler) return null;
        if (battler.isAlive()) {
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
    //this._actionBattlers.splice.apply(this._actionBattlers, [$gameParty.maxBattleMembers, 0].concat(this._netActionBattlers));
    let battlers = this._actionBattlers.concat(this._netActionBattlers)
    
    battlers.forEach(function(battler) {
        battler.makeSpeed();
    });
    battlers.sort(function(a, b) {
        return b.speed() - a.speed();
    });
    this._actionBattlers = battlers;
  }

  Game_Battler.prototype.setCurrentAction = function(action) {
    this.forceAction(action._item._itemId,action._targetIndex, action.forcedTargets);
    this._actions[this._actions.length-1]._netTarget = action._netTarget;
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
    if(this.forcedTargets) { //net player targetting someone
        console.log("net target")
        return this.forcedTargets;
        
    }

    if(this.netPartyId) {//host targeting net player
        console.log("host targetted nett")
        let net = MATTIE.multiplayer.getCurrentNetController().netPlayers[this.netPartyId];
        let netParty = []
        if(net){
            netParty = net.battleMembers();
        }
        return netParty;
    }
    console.log("base target")
    return MATTIE.maketargets.call(this);
};

Game_Action.prototype.setNetPartyId = function(id){
    this.netPartyId = id;
}

  /** check that all combatants on this event are ready */
  BattleManager.checkAllPlayersReady = function(){
    return $gameTroop.allReady();
  }

  //override YANFly's update function to have the ready state aswell
  BattleManager.update = function() {
    if (!this.isBusy() && !this.updateEvent()) {
        switch (this._phase) {
        case 'start':
            this.startInput();
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
            break;
        case 'action':
            this.updateAction();
            break;
        case 'phaseChange':
            this.updatePhase();
            break;
        case 'actionList':
            this.updateActionList()
            break;
        case 'actionTargetList':
            this.updateActionTargetList()
            break;
        case 'turnEnd':
            this.updateTurnEnd();
            MATTIE.multiplayer.BattleController.emitUnreadyEvent();
            MATTIE.multiplayer.BattleController.emitTurnEndEvent();
            break;
        case 'battleEnd':
            MATTIE.multiplayer.BattleController.emitTurnEndEvent();
            this.updateBattleEnd();
            break;
        }
    }
};