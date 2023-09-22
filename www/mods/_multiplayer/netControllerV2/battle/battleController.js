var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};

var EventEmitter = require("events");


class BattleController extends EventEmitter {

    /**
     * @description trigger the ready event on battle controller and net controller.
     * @param {Game_Action[]} actions an array of the actions the player is taking
     * @emits ready
     */
    emitReadyEvent(actions){
        this.emit("ready")
        MATTIE.multiplayer.ready = true;
        MATTIE.multiplayer.waitingOnAllies = true;
        MATTIE.multiplayer.getCurrentNetController().emitReadyEvent(actions);
    }

    /**
     * @description trigger the unready event on battle controller and net controller
     * @emits unready
     */
    emitUnreadyEvent(){
        this.emit("unready")
        MATTIE.multiplayer.waitingOnAllies = false;
        MATTIE.multiplayer.ready = false;
        MATTIE.multiplayer.getCurrentNetController().emitUnreadyEvent();
    }

    /** @description called whenever a battle ends */
    emitBattleEnd(){
        this.emit("battleEnd")
    }


    /**
     * @description emits the turn end event on the battle controller and net controller
     * @emits turnEnd
     */
    emitTurnEndEvent(){
        this.emit("turnEnd");
        if($gameParty.leader().isDead()){
            MATTIE.multiplayer.getCurrentNetController().emitBattleEndEvent($gameTroop._troopId, MATTIE.multiplayer.currentBattleEnemy)
        }
        let enemyHps = $gameTroop.members().map(enemy=>{return enemy._hp});
        let enemyStates = $gameTroop.members().map(enemy=>{return enemy.states().map(state=>state.id)});
        let actorData = $gameParty.battleMembers().map(actor=>{
            let obj = {};
            obj.hp = actor.hp
            obj.mp = actor.mp;
            return obj;
        })
        MATTIE.multiplayer.getCurrentNetController().emitTurnEndEvent(enemyHps, enemyStates, actorData);
    }

    /**
     * @emits "refreshNetBattlers"
     */
    emitNetBattlerRefresh(){
        this.emit("refreshNetBattlers");
    }


    /**
     * @description this is called anytime a skill is executed 
     * @param {Game_Action} action 
     * @param {Game_Actor} actor 
     * @param {*} isNet 
     */
    onSkillExecution(action,actor,isNet){
        let shouldExecute = true

        

        let skillId = action._item._itemId
        switch (skillId) {
            case MATTIE.static.skills.healingWhispers.id:
                if(!this.baseHealingWhispersDamageFormula) this.baseHealingWhispersDamageFormula = action.item().damage.formula;
                if(MATTIE.multiplayer.scaling.shouldScaleHealingWhispers){
                    action.item().damage.formula = this.baseHealingWhispersDamageFormula * MATTIE.multiplayer.scaling.getHealingWhispersScaler();
                    MATTIE.multiplayer.scaling.shouldScaleHealingWhispers = false;
                }
                break;
        
            default:
                break;
        }

        if(shouldExecute){
            if(isNet){
                this.onNetSkillExecution(action,actor);
            }else{
                this.onLocalSkillExecution(action,actor);
            }
        }   
    }


    /**
     * 
     * @param {Game_Action} action the action
     * @param {Game_Battler} actor the subject
     * @param {Function} startAction the unoverriden battlemanager.startaction function
     */
    onLocalSkillExecution(action, actor){
        MATTIE.multiplayer.combatEmitter.startAction.call(BattleManager);
        if(action._item._itemId == MATTIE.static.skills.bloodGolem.id || action._item._itemId == MATTIE.static.skills.greaterBloodGolem.id){ //refresh battlers if we summon blood golem
            this.emitNetBattlerRefresh()
        }
        
    }

    /**
     * 
     * @param {Game_Action} action  the action
     * @param {Game_Battler} actor the subject
     * @param {UUID} netPlayerId 
     * @param {Function} startAction the unoverriden battlemanager.startaction function
     */
    onNetSkillExecution(action, actor){
        let netCont =MATTIE.multiplayer.getCurrentNetController();
        let netPlayer = netCont.netPlayers[actor.netID];
        let skillId = action._item._itemId;
        let shouldExecute = true;
        switch (skillId) {
            case MATTIE.static.skills.run.id:
                shouldExecute = false;
                break;
            case MATTIE.static.skills.bloodGolem.id:
            case MATTIE.static.skills.greaterBloodGolem.id:
                netPlayer.addBattleOnlyMember(netPlayer.$netActors.baseActor(MATTIE.static.actors.bloodGolemId))
                MATTIE.multiplayer.BattleController.emitNetBattlerRefresh()
                shouldExecute = false;
                break
        
            default:
                break;
        }

        if(shouldExecute) MATTIE.multiplayer.combatEmitter.startAction.call(BattleManager);
        
    }


    /**
     * @description called when a party action targets a specific net party
     * @param {Game_Action} action 
     */
    onPartyActionTargetingNet(action){
        let skillId = action._item._itemId
        switch (skillId) {
            case MATTIE.static.skills.healingWhispers.id:
                
                break;
        
            default:
                break;
        }
    }

    
}


MATTIE.multiplayer.BattleController = new BattleController();