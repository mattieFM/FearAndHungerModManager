var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};

var EventEmitter = require('events');

/**
 * @description a small class that helps handle some battle events
 * @class
 */
class BattleController extends EventEmitter {
	/**
     * @description trigger the ready event on battle controller and net controller.
     * @param {Game_Action[]} actions an array of the actions the player is taking
     * @emits ready
     */
	emitReadyEvent(actions) {
		this.emit('ready');
		MATTIE.multiplayer.ready = true;
		MATTIE.multiplayer.waitingOnAllies = true;
		MATTIE.multiplayer.getCurrentNetController().emitReadyEvent(actions);
	}

	/**
     * @description trigger the unready event on battle controller and net controller
     * @emits unready
     */
	emitUnreadyEvent() {
		this.emit('unready');
		MATTIE.multiplayer.waitingOnAllies = false;
		MATTIE.multiplayer.ready = false;
		MATTIE.multiplayer.getCurrentNetController().emitUnreadyEvent();
	}

	/** @description called whenever a battle ends */
	emitBattleEnd() {
		this.emit('battleEnd');
	}

	/**
     * @description emits the turn end event on the battle controller and net controller
     * @emits turnEnd
     */
	emitTurnEndEvent() {
		this.emit('turnEnd');
		if ($gameParty.leader().isDead() || ($gameTroop.isAllDead() && !$dataTroops[$gameTroop._troopId].isBoss)) {
			MATTIE.multiplayer.getCurrentNetController().emitBattleEndEvent($gameTroop._troopId, MATTIE.multiplayer.currentBattleEnemy);
		}
		// Include enemy ID and index for proper sync matching
		const enemyHps = $gameTroop.members().map((enemy) => ({
			hp: enemy._hp,
			enemyId: enemy.enemyId(),
			index: enemy.index(),
		}));
		const enemyMhps = $gameTroop.members().map((enemy) => ({
			mhp: enemy.mhp,
			enemyId: enemy.enemyId(),
			index: enemy.index(),
		}));
		// console.log($gameTroop.members());
		const enemyStates = $gameTroop.members().map((enemy) => ({
			states: enemy.states().map((state) => state.id),
			enemyId: enemy.enemyId(),
			index: enemy.index(),
		}));
		const actorData = $gameParty.battleMembers().map((actor) => {
			const obj = {};
			obj.hp = actor.hp;
			obj.mp = actor.mp;
			obj.actorId = actor.actorId(); // Include actor ID for proper matching
			return obj;
		});
		MATTIE.multiplayer.getCurrentNetController().emitTurnEndEvent(enemyHps, enemyStates, actorData, enemyMhps);
	}

	/**
     * @emits "refreshNetBattlers"
     */
	emitNetBattlerRefresh() {
		this.emit('refreshNetBattlers');
	}

	/**
     * @description this is called anytime a skill is executed
     * @param {Game_Action} action
     * @param {Game_Actor} actor
     * @param {*} isNet
     */
	onSkillExecution(action, actor, isNet) {
		const shouldExecute = true;

		const skillId = action._item._itemId;
		switch (skillId) {
		case MATTIE.static.skills.healingWhispers.id:
			if (!this.baseHealingWhispersDamageFormula) this.baseHealingWhispersDamageFormula = action.item().damage.formula;
			if (MATTIE.multiplayer.config.scaling.shouldScaleHealingWhispers) {
				action.item().damage.formula = this.baseHealingWhispersDamageFormula * MATTIE.multiplayer.config.scaling.getHealingWhispersScaler();
				MATTIE.multiplayer.config.scaling.shouldScaleHealingWhispers = false;
			}
			break;

		default:
			break;
		}

		if (shouldExecute) {
			if (isNet) {
				this.onNetSkillExecution(action, actor);
			} else {
				this.onLocalSkillExecution(action, actor);
			}
		}
	}

	/**
     *
     * @param {Game_Action} action the action
     * @param {Game_Battler} actor the subject
     * @param {Function} startAction the unoverriden battlemanager.startaction function
     */
	onLocalSkillExecution(action, actor) {
		MATTIE.multiplayer.combatEmitter.startAction.call(BattleManager);
		if (action._item._itemId == MATTIE.static.skills.bloodGolem.id
			|| action._item._itemId == MATTIE.static.skills.greaterBloodGolem.id) { // refresh battlers if we summon blood golem
			this.emitNetBattlerRefresh();
		}
	}

	/**
     *
     * @param {Game_Action} action  the action
     * @param {Game_Battler} actor the subject
     * @param {UUID} netPlayerId
     * @param {Function} startAction the unoverriden battlemanager.startaction function
     */
	onNetSkillExecution(action, actor) {
		const netCont = MATTIE.multiplayer.getCurrentNetController();
		const netPlayer = netCont.netPlayers[actor.netID];
		const skillId = action._item._itemId;
		let shouldExecute = true;
		switch (skillId) {
		case MATTIE.static.skills.run.id:
			shouldExecute = false;
			break;
		case MATTIE.static.skills.bloodGolem.id:
		case MATTIE.static.skills.greaterBloodGolem.id:
			netPlayer.addBattleOnlyMember(netPlayer.$netActors.baseActor(MATTIE.static.actors.bloodGolemId));
			MATTIE.multiplayer.BattleController.emitNetBattlerRefresh();
			shouldExecute = false;
			break;

		default:
			break;
		}

		if (shouldExecute) MATTIE.multiplayer.combatEmitter.startAction.call(BattleManager);
	}

	/**
     * @description called when a party action targets a specific net party
     * @param {Game_Action} action
     */
	onPartyActionTargetingNet(action) {
		const skillId = action._item._itemId;
		switch (skillId) {
		case MATTIE.static.skills.healingWhispers.id:

			break;

		default:
			break;
		}
	}
}

MATTIE.multiplayer.BattleController = new BattleController();
