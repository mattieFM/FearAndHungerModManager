var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.multiplayer.devTools = {};
MATTIE.multiplayer.enemyEmitter = {};
MATTIE.multiplayer.currentBattleEnemy = MATTIE.multiplayer.currentBattleEnemy || {};
MATTIE.multiplayer.combatEmitter = MATTIE.multiplayer.combatEmitter || {};
/** the max amount of time to spend in the sync state in ms */
MATTIE.multiplayer.combatEmitter.maxSyncTime = 1500;
MATTIE.multiplayer.combatEmitter.minSyncTime = 500;
MATTIE.BattleManagerStartTurn = BattleManager.startTurn;

MATTIE.multiplayer.combatEmitter.netExTurn = false;
MATTIE.multiplayer.ready = false;
MATTIE.multiplayer.waitingOnAllies = false;


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

/** enter the syncing state */
BattleManager.sync = function(){
    this._phase = 'syncing';
    BattleLog("syncing");
    setTimeout(() => {
        this.doneSyncing() //enter done syncing state after 5 seconds
    }, MATTIE.multiplayer.combatEmitter.maxSyncTime);
}

/** enter the done syncing state */
BattleManager.doneSyncing = function(){
    if(this._phase == 'syncing'){
        this._phase = 'doneSyncing';
        BattleLog("donesyncing");
    }
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
            /** @type {Game_Action} */
            let action = battler.currentAction();
            if(action){ //only do stuff if the action exists
                action.setNetTarget(MATTIE.multiplayer.getCurrentNetController().peerId)
                action.preloadRng(action.makeTargets());
                arr.push(action);
            }
        }
    });
    return(arr);
}


Game_Action.prototype.forceHit = function(bool){
    this._forcedHit = bool;
}
/**
 * 
 * @param {Game_Battler[]} targets 
 */
Game_Action.prototype.preloadRng = function(targets){
    BattleManager.targetResults = {};
    targets.forEach(target => {
        let rand = Math.random();
        let rand2 = Math.random();
        let missed = (rand >= this.itemHit(target));
        let evaded = (!missed && rand2 < this.itemEva(target));
        BattleManager.targetResults[target.name()] = (!missed && !evaded);
    });    
    this.targetResults = BattleManager.targetResults;
}

Game_Action.prototype.loadRng = function(results){
    BattleManager.targetResults = Object.assign({}, BattleManager.targetResults||{}, results)
    console.log(BattleManager.targetResults);
}

Game_Action.prototype.getTargetResults = function(){
    return BattleManager.targetResults;
}

MATTIE.multiplayer.Game_Action_Apply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function(target) {
    MATTIE.multiplayer.Game_Action_Apply.call(this, target);
}
MATTIE.multiplayer.Game_Action_testApply = Game_Action.prototype.testApply;
Game_Action.prototype.testApply = function(target) {
    let targets = this.getTargetResults();
    if(targets){
        if(Object.keys(targets).includes(target.name())){
            if(target.result().forceHit)
            target.result().forceHit(targets[target.name()])
        } else {
            if(target)
            if(target.result())
            if(target.result().forceHit)
            target.result().forceHit(undefined)
        }
    }
    return MATTIE.multiplayer.Game_Action_testApply.call(this,target)
};

/** @description extend the is hit function to include if it is being forced to hit */
MATTIE.multiplayer.Game_ActionResultisHit = Game_ActionResult.prototype.isHit
Game_ActionResult.prototype.isHit = function() {
    if(typeof this._forceHit != 'undefined'){
        return this._forceHit;
    }
    return (MATTIE.multiplayer.Game_ActionResultisHit.call(this))
};
/** @description set a action result as forced hit */
Game_ActionResult.prototype.forceHit = function(bool=undefined) {
    this._forceHit = bool;
};





Game_Action.prototype.setNetTarget = function(peerId){
    this._netTarget = peerId;
}
MATTIE.multiplayer.gameActonSubject = Game_Action.prototype.subject;
Game_Action.prototype.subject = function() {
    
    if(this._netTarget) {
        if(this._netTarget != MATTIE.multiplayer.getCurrentNetController().peerId){
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
    if($gameTroop.totalCombatants() == 1){ //if solo, start next phase
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
        MATTIE.multiplayer.combatEmitter.netExTurn = false;
        MATTIE.multiplayer.ready = false;
        MATTIE.multiplayer.waitingOnAllies = false;
        MATTIE.multiplayer.battlemanageronStart.call(this);
        this._netActors = [];
    };
  

  BattleManager.addNetActionBattler = function(battler,isExtraTurn){
    if(!this._netActionBattlers) this._netActionBattlers = [];
    let netActionBattler = {}
    netActionBattler.battler = battler;
    netActionBattler.isExtraTurn = isExtraTurn;
    this._netActionBattlers.push(netActionBattler);
  }

  BattleManager.clearNetActionBuffer = function(){
    this._netActionBattlers = [];
  }


  /**
   * @description this function handles where enemies and local player attack in combat
   * @returns int
   */
  Game_Battler.prototype.partyIndex = function(){
    let indexof = $gameParty.battleMembers().indexOf(this);
    return indexof != -1 ? indexof: MATTIE.multiplayer.scaling.enemyBattleIndex(this);
  }

  MATTIE.multiplayer.multiCombat.makeActionOrders = BattleManager.makeActionOrders;
  BattleManager.makeActionOrders = function() {
    if(!this._netActionBattlers) this._netActionBattlers = [];
    MATTIE.multiplayer.multiCombat.makeActionOrders.call(this);
    let currentNetBattlers = this._netActionBattlers.filter(netBattler=>{
        if(Galv.EXTURN.active || MATTIE.multiplayer.combatEmitter.netExTurn){
            return netBattler.isExtraTurn;
        }else{
            return true
        }
    }).map(netBattler=>netBattler.battler);
    let battlers = []
    if(MATTIE.multiplayer.combatEmitter.netExTurn){
        battlers = currentNetBattlers;
    }else{
        battlers = this._actionBattlers.concat(currentNetBattlers)
    }
     
    
    battlers.forEach(function(battler) {
        battler.makeSpeed();
    });
    battlers.sort(function(a, b) {
        let val = 0;
        val = a.partyIndex() - b.partyIndex(); //sort my index in order of decreasing
        if(val === 0 ){//if index is same sort by if the battler is a player
            val = (a instanceof Game_Actor? 1:0) - (b instanceof Game_Actor? 1:0)
        }
        if(val === 0 ){//if both palyers sort by speed
            val = b.speed() - a.speed();
        }
        if(val === 0){ //if speed is same... sort by hp, this is just so that the same exact order will display on all screens
            val = b.hp - a.hp;
        }

        if(val === 0 ){ //finnally sort by luck cus its funny
            val = b.mp - a.mp;
        }

        if(val === 0 ){ //finnally sort by luck cus its funny
            val = b.luk - a.luk;
        }

        if(val === 0 ){ //finnally sort by luck cus its funny
            val = b.name() - a.name();
        }

        return val;
    });
    this._actionBattlers = battlers;
  }

  Game_Battler.prototype.setCurrentAction = function(action) {
    this.forceAction(action._item._itemId,action._targetIndex, action.forcedTargets);
    this._actions[this._actions.length-1]._netTarget = action._netTarget;
    this._actions[this._actions.length-1].loadRng(action.targetResults);
    
    console.log(action.forcedTargets)
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
    if(this.forcedTargets) { //net player targeting someone
        return this.forcedTargets;
    }

    if(this.netPartyId !== MATTIE.multiplayer.getCurrentNetController().peerId) {//host targeting net player
        let net = MATTIE.multiplayer.getCurrentNetController().netPlayers[this.netPartyId];
        let netParty = []
        if(net){
            netParty = net.battleMembers();
            return netParty;
        }
        
    }

    return MATTIE.maketargets.call(this);
};

Game_Action.prototype.setNetPartyId = function(id){
    this.netPartyId = id;
}

  /** check that all combatants on this event are ready */
  BattleManager.checkAllPlayersReady = function(){
    return $gameTroop.allReady();
  }

    /** check that all combatants on this event are ready */
    BattleManager.checkAllExtraTurn = function(){
        return $gameTroop.allExTurn();
    }

     /** check that all combatants on this event are ready */
     BattleManager.checkSomeExtraTurn = function(){
        return $gameTroop.someExTurn();
    }



     /** check that all combatants on this event are ready */
     BattleManager.allExTurnReady = function(){
        return $gameTroop.allExTurnReady();
    }


  //override YANFly's update function to have the ready state aswell
  BattleManager.update = function() {
    if (!this.isBusy() && !this.updateEvent()) {
        switch (this._phase) {
        case 'start':
            this.startInput();
            break;

        case 'input':
            if (!$gameParty.canInput()) { //if the game party cannot input then they are ready
                this.ready();
            }
            break;
        case 'ready':
            //allow 'un-reading' to go back to previous state.
            //and if all players are ready proceed to turn state.
            
            MATTIE.multiplayer.waitingOnAllies = true;
            if(!MATTIE.multiplayer.combatEmitter.netExTurn){
                if(this.checkSomeExtraTurn() && !Galv.EXTURN.active){ //if someone else has an extra turn but local does not
                    if(this.allExTurnReady() && this.checkAllPlayersReady()){
                        //if atleast one player has an extra turn and all players with extra turn are ready.
                        MATTIE.multiplayer.combatEmitter.netExTurn = true;
                        this.startAfterReady();
                    }
                }
                else if(this.checkAllPlayersReady()){ //otherwise normal check all ready
                    this.startAfterReady();
                    setTimeout(() => {
                        MATTIE.multiplayer.BattleController.emitUnreadyEvent(); //unready once the round is well and started
                    }, 1000);
                }
            }
            
            break;
        case 'turn':
            MATTIE.multiplayer.waitingOnAllies = false;
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
            if(!MATTIE.multiplayer.combatEmitter.netExTurn){ //if a net player is taking an extra turn, dont unready
                MATTIE.multiplayer.BattleController.emitUnreadyEvent();
                MATTIE.multiplayer.BattleController.emitTurnEndEvent();
            } 
            BattleManager.sync();
            break;
        case 'syncing':
        
        break;
        case 'doneSyncing':
            if(MATTIE.multiplayer.combatEmitter.netExTurn){
                MATTIE.multiplayer.combatEmitter.netExTurn = false; //turn of net extra turn
                this.ready(); //re enter the ready state
            }else{
                this.updateTurnEnd();
            }
            
        break;
        case 'battleEnd':
            MATTIE.multiplayer.BattleController.emitTurnEndEvent();
            this.updateBattleEnd();
            break;
        }
    }

};


MATTIE.multiplayer.combatEmitter.startAction = BattleManager.startAction;
    BattleManager.startAction = function() {
        var action = this._subject.currentAction();
        let isNet = this._subject.isNetActor
        MATTIE.multiplayer.BattleController.onSkillExecution(action, this._subject, isNet)

        
    };