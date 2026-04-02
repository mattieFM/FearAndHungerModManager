var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
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
/** @description true when the local client is in an extra turn (local or received from net) */
MATTIE.multiplayer.combatEmitter.inExtraTurn = false;

/** log info with the proper conditionals */
function BattleLog(str) {
	if (MATTIE.multiplayer.devTools.inBattleLogger) console.info(str);
}

MATTIE.multiplayer.battleManagerInit = BattleManager.initMembers;
BattleManager.initMembers = function () {
	MATTIE.multiplayer.battleManagerInit.call(this);
	this._netActors = [];
};

BattleManager.getNetBattlers = function () {
	if (!this._netActors) this._netActors = [];
	return this._netActors;
};

BattleManager.startAfterReady = function () {
	MATTIE.BattleManagerStartTurn.call(this);
};

/** exit the ready state, returning to the beginning of the input phase
 * TODO: instead of returning to the start of the input phase return to the last input so that players can easily correct mistakes without having to...
 *
*/
BattleManager.unready = function () {
	BattleManager.startInput();
	this._phase = 'input';
	BattleLog('unready!');
	MATTIE.multiplayer.BattleController.emitUnreadyEvent();
};

/** enter the ready state */
BattleManager.ready = function () {
	this._phase = 'ready';

	BattleLog('ready!');
	MATTIE.multiplayer.BattleController.emitReadyEvent(JSON.stringify(this.getAllPlayerActions()));
};

/** enter the syncing state */
BattleManager.sync = function () {
	this._phase = 'syncing';
	BattleLog('syncing');
	setTimeout(() => {
		this.doneSyncing(); // enter done syncing state after 5 seconds
	}, MATTIE.multiplayer.combatEmitter.maxSyncTime);
};

/** enter the done syncing state */
BattleManager.doneSyncing = function () {
	if (this._phase == 'syncing') {
		this._phase = 'doneSyncing';
		BattleLog('donesyncing');
	}
};

/** check if a battler exists in the local party */
Game_Battler.prototype.battlerInParty = function () {
	return $gameParty.battleMembers().contains(this);
};

/** finds all currently inputted actions for the local party and returns an array of them */
BattleManager.getAllPlayerActions = function () {
	const arr = [];
	this.makeActionOrders();
	this._actionBattlers.forEach((battler) => {
		if (battler.isAlive()) {
			/** @type {Game_Action} */
			const action = battler.currentAction();
			if (action) { // only do stuff if the action exists
				if (action.item() != null) {
					action.setNetTarget(MATTIE.multiplayer.getCurrentNetController().peerId);
					action._netActionSlot = arr.length;
					const actionSeed = `${Date.now().toString(36)}:${Math.random().toString(36).substr(2, 6)}:${arr.length}`;
					action._netActionUuid = action._netActionUuid
						|| `${MATTIE.multiplayer.getCurrentNetController().peerId}:${actionSeed}`;
					if (action._subjectActorId > 0) {
						action._netSubjectDataActorId = battler.actorId ? battler.actorId() : action._subjectActorId;
						action._netSubjectUUID = `actor:${MATTIE.multiplayer.getCurrentNetController().peerId}:${action._netSubjectDataActorId}`;
					} else {
						const enemy = battler;
						const enemyId = enemy && typeof enemy.enemyId === 'function' ? enemy.enemyId() : 0;
						action._netSubjectUUID = `enemy:${$gameTroop._troopId}:${action._subjectEnemyIndex}:${enemyId}`;
					}
					const actionTargets = action.makeTargets();
					const hasActorTarget = actionTargets.some((target) => target && target.isActor && target.isActor());
					if (hasActorTarget && !action.netPartyId) {
						action.setNetPartyId(MATTIE.multiplayer.getCurrentNetController().peerId);
					}
					action.preloadRng(actionTargets);
					if (MATTIE.multiplayer.pvp.inPVP) {
						const targetTroopId = $gameTroop.mapMemberIndexToTroopId(action._targetIndex);
						const targetActorId = MATTIE.multiplayer.pvp.PvpController.mapTroopToActor(targetTroopId);
						action.targetActorId = targetActorId;
						action.userBattlerIndex = battler.partyIndex();
					}
					arr.push(action);
				}
			}
		}
	});
	return (arr);
};

Game_Action.prototype.forceHit = function (obj) {
	if (typeof obj != 'undefined') {
		this._forcedHit = obj.res;
		this._preloadMissed = obj.miss;
		this._preloadEvade = obj.evade;
	} else {
		this._forcedHit = undefined;
		this._preloadMissed = undefined;
		this._preloadEvade = undefined;
	}
};

Game_Action.prototype.getNetSubjectPeerId = function () {
	const subject = this.subject ? this.subject() : null;
	const netController = MATTIE.multiplayer.getCurrentNetController();
	return this._netSubjectPeerId
		|| this._netTarget
		|| (subject && (subject.peerId || subject.netID))
		|| (netController && netController.peerId)
		|| 'local';
};

Game_Action.prototype.getNetActionUuid = function () {
	if (!this._netActionUuid) {
		const peerId = this.getNetSubjectPeerId();
		this._netActionUuid = `${peerId}:${Date.now().toString(36)}:${Math.random().toString(36).substr(2, 6)}`;
	}
	return this._netActionUuid;
};

Game_Action.prototype.getNetSubjectUuid = function () {
	if (this._netSubjectUUID) return this._netSubjectUUID;
	if (this._subjectActorId > 0) {
		return `actor:${this.getNetSubjectPeerId()}:${this._netSubjectDataActorId || this._subjectActorId}`;
	}
	const troopId = $gameTroop ? $gameTroop._troopId : 0;
	const subjectEnemyIndex = typeof this._subjectEnemyIndex === 'number' ? this._subjectEnemyIndex : -1;
	const subject = this.subject ? this.subject() : null;
	const subjectEnemyId = subject && typeof subject.enemyId === 'function' ? subject.enemyId() : 0;
	return `enemy:${troopId}:${subjectEnemyIndex}:${subjectEnemyId}`;
};

Game_Action.prototype.getNetTargetPeerId = function (target, id = MATTIE.multiplayer.getCurrentNetController().peerId) {
	const currentPeerId = MATTIE.multiplayer.getCurrentNetController().peerId;
	const isTargetActor = target && typeof target.isActor === 'function' && target.isActor();
	if (!isTargetActor) return 'troop';

	return this.netPartyId
		|| (target && (target.peerId || target.netID))
		|| this._netSubjectPeerId
		|| this._netTarget
		|| id
		|| currentPeerId
		|| 'local';
};

Game_Action.prototype.makeLegacyTargetResultsId = function (target) {
	return `${target.name() + (this.subject().isActor() ? `${this.subject()._classId}-` : '')}-${this._targetIndex}-${this._item._itemId}-`;
};

Game_Action.prototype.makeSimpleTargetResultsId = function (target) {
	const isSubjectActor = this._subjectActorId > 0;
	const subjectType = isSubjectActor ? 'actor' : 'enemy';
	let subjectId = this._netSubjectDataActorId || this._subjectActorId;
	if (!isSubjectActor) {
		subjectId = typeof this._subjectEnemyIndex === 'number' ? this._subjectEnemyIndex : -1;
	}

	const isTargetActor = target && typeof target.isActor === 'function' && target.isActor();
	const targetType = isTargetActor ? 'actor' : 'enemy';
	let targetId = this._targetIndex;
	if (isTargetActor) {
		targetId = target && typeof target.actorId === 'function' ? target.actorId() : this._targetIndex;
	} else {
		targetId = target && typeof target.enemyId === 'function' ? target.enemyId() : this._targetIndex;
	}
	const targetIndex = target && typeof target.index === 'function' ? target.index() : this._targetIndex;

	const itemClass = this._item && this._item._dataClass ? this._item._dataClass : 'skill';
	const itemId = this._item ? this._item._itemId : 0;

	return [
		`s:${subjectType}`,
		`sid:${subjectId}`,
		`t:${targetType}`,
		`tid:${targetId}`,
		`ti:${targetIndex}`,
		`it:${itemClass}:${itemId}`,
		`idx:${this._targetIndex}`,
	].join('|');
};

Game_Action.prototype.makeTargetResultMeta = function (target) {
	const isTargetActor = target && typeof target.isActor === 'function' && target.isActor();
	const itemClass = this._item && this._item._dataClass ? this._item._dataClass : 'skill';
	const itemId = this._item ? this._item._itemId : 0;
	const targetPeerId = this.getNetTargetPeerId(target);
	const subject = this.subject ? this.subject() : null;
	let subjectEnemyId = 0;
	if (this._subjectActorId <= 0 && subject && typeof subject.enemyId === 'function') {
		subjectEnemyId = subject.enemyId();
	}

	return {
		actionUuid: this.getNetActionUuid(),
		subjectUuid: this.getNetSubjectUuid(),
		subjectPeerId: this.getNetSubjectPeerId(),
		subjectActorId: this._subjectActorId > 0 ? (this._netSubjectDataActorId || this._subjectActorId) : 0,
		subjectEnemyIndex: typeof this._subjectEnemyIndex === 'number' ? this._subjectEnemyIndex : -1,
		subjectEnemyId,
		targetType: isTargetActor ? 'actor' : 'enemy',
		targetPeerId,
		targetActorId: isTargetActor && target && typeof target.actorId === 'function' ? target.actorId() : 0,
		targetEnemyId: !isTargetActor && target && typeof target.enemyId === 'function' ? target.enemyId() : 0,
		targetIndex: target && typeof target.index === 'function' ? target.index() : this._targetIndex,
		actionTargetIndex: this._targetIndex,
		itemClass,
		itemId,
	};
};

Game_Action.prototype.getUniqueTargetResultEntries = function (targets) {
	if (!targets || typeof targets !== 'object') return [];
	const seen = [];

	return Object.keys(targets)
		.map((key) => targets[key])
		.filter((entry) => {
			if (!entry || typeof entry !== 'object') return false;
			if (seen.indexOf(entry) !== -1) return false;
			seen.push(entry);
			return true;
		});
};

Game_Action.prototype.findTargetResultByMeta = function (target, targetEntries) {
	if (!Array.isArray(targetEntries) || targetEntries.length === 0) return null;

	const meta = this.makeTargetResultMeta(target);
	const matches = targetEntries.filter((entry) => {
		if (!entry._netMeta || typeof entry._netMeta !== 'object') return false;
		const entryMeta = entry._netMeta;

		if (entryMeta.itemClass !== meta.itemClass || entryMeta.itemId !== meta.itemId) return false;
		if (entryMeta.actionUuid && meta.actionUuid && entryMeta.actionUuid !== meta.actionUuid) return false;
		if (entryMeta.subjectUuid && meta.subjectUuid && entryMeta.subjectUuid !== meta.subjectUuid) return false;
		if (entryMeta.subjectPeerId && meta.subjectPeerId && entryMeta.subjectPeerId !== meta.subjectPeerId) return false;
		if (entryMeta.targetType !== meta.targetType) return false;
		if (entryMeta.targetPeerId && meta.targetPeerId && entryMeta.targetPeerId !== meta.targetPeerId) return false;
		if (entryMeta.subjectActorId !== meta.subjectActorId || entryMeta.subjectEnemyIndex !== meta.subjectEnemyIndex) return false;
		if (Object.prototype.hasOwnProperty.call(entryMeta, 'subjectEnemyId')
			&& entryMeta.subjectEnemyId !== meta.subjectEnemyId) return false;

		if (meta.targetType === 'actor') return entryMeta.targetActorId === meta.targetActorId;
		return entryMeta.targetEnemyId === meta.targetEnemyId;
	});

	if (matches.length === 1) return matches[0];
	if (matches.length === 0) return null;

	const exactIndexMatch = matches.find((entry) => entry._netMeta.targetIndex === meta.targetIndex);
	if (exactIndexMatch) return exactIndexMatch;

	const actionIndexMatch = matches.find((entry) => entry._netMeta.actionTargetIndex === meta.actionTargetIndex);
	if (actionIndexMatch) return actionIndexMatch;

	return matches[0];
};

Game_Action.prototype.makeTargetResultsId = function (target, id = MATTIE.multiplayer.getCurrentNetController().peerId) {
	const subject = this.subject ? this.subject() : null;
	const isSubjectActor = (this._subjectActorId > 0)
		|| (subject && typeof subject.isActor === 'function' && subject.isActor());
	const subjectType = isSubjectActor ? 'actor' : 'enemy';
	let subjectId = 0;
	if (isSubjectActor) {
		subjectId = this._netSubjectDataActorId || this._subjectActorId || 0;
		if (!subjectId && subject && typeof subject.actorId === 'function') subjectId = subject.actorId();
	} else {
		subjectId = typeof this._subjectEnemyIndex === 'number' ? this._subjectEnemyIndex : -1;
		if (subjectId < 0 && subject && typeof subject.index === 'function') subjectId = subject.index();
	}
	const subjectEnemyId = !isSubjectActor && subject && typeof subject.enemyId === 'function' ? subject.enemyId() : 0;
	const subjectPeerId = this._netSubjectPeerId
		|| this._netTarget
		|| (subject && (subject.peerId || subject.netID))
		|| MATTIE.multiplayer.getCurrentNetController().peerId
		|| 'local';
	const actionUuid = this.getNetActionUuid();

	const isTargetActor = target && typeof target.isActor === 'function' && target.isActor();
	const targetType = isTargetActor ? 'actor' : 'enemy';
	let targetId = 0;
	if (isTargetActor) {
		targetId = target && typeof target.actorId === 'function' ? target.actorId() : 0;
	} else {
		targetId = target && typeof target.enemyId === 'function' ? target.enemyId() : 0;
	}
	const targetIndex = target && typeof target.index === 'function' ? target.index() : this._targetIndex;
	const targetPeerId = this.getNetTargetPeerId(target, id);

	const itemClass = this._item && this._item._dataClass ? this._item._dataClass : 'skill';
	const itemId = this._item ? this._item._itemId : 0;

	return [
		`aid:${actionUuid}`,
		`s:${subjectType}`,
		`sid:${subjectId}`,
		`seid:${subjectEnemyId}`,
		`sp:${subjectPeerId}`,
		`t:${targetType}`,
		`tid:${targetId}`,
		`tp:${targetPeerId}`,
		`ti:${targetIndex}`,
		`it:${itemClass}:${itemId}`,
		`idx:${this._targetIndex}`,
	].join('|');
};

Game_Action.prototype.getTargetResultLookupIds = function (target, id = MATTIE.multiplayer.getCurrentNetController().peerId) {
	const currentPeerId = MATTIE.multiplayer.getCurrentNetController().peerId;
	const candidateIds = [
		id,
		this.netPartyId,
		this._netSubjectPeerId,
		this._netTarget,
		currentPeerId,
	].filter((candidate) => !!candidate);

	const lookups = [];
	candidateIds.forEach((candidateId) => {
		lookups.push(this.makeTargetResultsId(target, candidateId));
	});
	lookups.push(this.makeSimpleTargetResultsId(target));
	lookups.push(this.makeLegacyTargetResultsId(target));

	return [...new Set(lookups)];
};

Game_Action.prototype.findTargetResult = function (target, id = MATTIE.multiplayer.getCurrentNetController().peerId) {
	const targets = this.getTargetResults();
	if (!targets) return null;

	const resultIds = this.getTargetResultLookupIds(target, id);
	for (let i = 0; i < resultIds.length; i++) {
		const resultId = resultIds[i];
		if (Object.prototype.hasOwnProperty.call(targets, resultId)) {
			if (i > 0 && MATTIE.multiplayer.devTools.battleLogger) {
				console.warn(`[NetRNG] Fallback key hit ${resultId}`);
			}
			return targets[resultId];
		}
	}

	const targetEntries = this.getUniqueTargetResultEntries(targets);
	const metaMatchedResult = this.findTargetResultByMeta(target, targetEntries);
	if (metaMatchedResult) {
		if (MATTIE.multiplayer.devTools.battleLogger) {
			console.warn('[NetRNG] Metadata fallback hit for target result');
		}
		return metaMatchedResult;
	}

	if (this.isForOne && this.isForOne()) {
		if (targetEntries.length > 0) {
			const first = targetEntries[0];
			const allEquivalent = targetEntries.every((entry) => entry.miss === first.miss
				&& entry.evade === first.evade
				&& entry.res === first.res
				&& entry.crit === first.crit
				&& entry.dmg === first.dmg);

			if (allEquivalent) {
				if (MATTIE.multiplayer.devTools.battleLogger) {
					console.warn('[NetRNG] Using single-target deterministic fallback result');
				}
				return first;
			}
		}
	}

	if (MATTIE.multiplayer.devTools.battleLogger) {
		const targetMeta = this.makeTargetResultMeta(target);
		const availableKeys = Object.keys(targets);
		console.warn(`[NetRNG] Missing target result. Tried keys: ${resultIds.join(', ')}`);
		console.warn(`[NetRNG] Missing target meta: ${JSON.stringify(targetMeta)}`);
		console.warn(`[NetRNG] Available result keys(${availableKeys.length}): ${availableKeys.join(', ')}`);
	}

	return null;
};

Game_Action.prototype.makeEffectOutcomeKey = function (effect) {
	if (!effect || !this.item || !this.item()) return null;
	const effects = this.item().effects || [];
	const effectIndex = effects.indexOf(effect);
	if (effectIndex < 0) return null;
	return `${effect.code}:${effect.dataId}:${effectIndex}`;
};

Game_Action.prototype.computeDeterministicEffectOutcomes = function (target) {
	const outcomes = {};
	const item = this.item ? this.item() : null;
	if (!item || !Array.isArray(item.effects)) return outcomes;

	item.effects.forEach((effect) => {
		const key = this.makeEffectOutcomeKey(effect);
		if (!key) return;

		switch (effect.code) {
		case Game_Action.EFFECT_ADD_STATE:
			if (effect.dataId === 0) {
				const attackStateOutcomes = [];
				this.subject().attackStates().forEach((stateId) => {
					let chance = effect.value1;
					chance *= target.stateRate(stateId);
					chance *= this.subject().attackStatesRate(stateId);
					chance *= this.lukEffectRate(target);
					attackStateOutcomes.push({
						stateId,
						apply: Math.random() < chance,
					});
				});
				outcomes[key] = { states: attackStateOutcomes };
			} else {
				let chance = effect.value1;
				if (!this.isCertainHit()) {
					chance *= target.stateRate(effect.dataId);
					chance *= this.lukEffectRate(target);
				}
				outcomes[key] = {
					apply: Math.random() < chance,
				};
			}
			break;
		case Game_Action.EFFECT_REMOVE_STATE:
			outcomes[key] = {
				apply: Math.random() < effect.value1,
			};
			break;
		case Game_Action.EFFECT_ADD_DEBUFF: {
			const chance = target.debuffRate(effect.dataId) * this.lukEffectRate(target);
			outcomes[key] = {
				apply: Math.random() < chance,
			};
			break;
		}
		default:
			break;
		}
	});

	return outcomes;
};

Game_Action.prototype.getDeterministicEffectOutcome = function (target, effect) {
	const targetResult = this.findTargetResult(target);
	if (!targetResult || !targetResult.effectOutcomes) return null;
	const key = this.makeEffectOutcomeKey(effect);
	if (!key) return null;
	return targetResult.effectOutcomes[key] || null;
};
/**
 *
 * @param {Game_Battler[]} targets
 */
Game_Action.prototype.preloadRng = function (targets) {
	BattleManager.targetResults = {};
	this.targetResults = {};
	targets.forEach((target) => {
		const resultId = this.makeTargetResultsId(target);
		const simpleResultId = this.makeSimpleTargetResultsId(target);
		const legacyResultId = this.makeLegacyTargetResultsId(target);
		const targetResult = {};
		targetResult._netMeta = this.makeTargetResultMeta(target);

		this._preloadMissed = (Math.random() >= this.itemHit(target));
		this._preloadEvade = (!this._preloadMissed && Math.random() < this.itemEva(target));
		const crit = (Math.random() < this.itemCri(target));

		targetResult.crit = crit;
		targetResult.evade = this._preloadEvade;
		targetResult.miss = this._preloadMissed;
		targetResult.res = (!this._preloadMissed && !this._preloadEvade);
		if (Math.random() < this.itemCnt(target)) {
			targetResult.invokeType = 'counter';
		} else if (Math.random() < this.itemMrf(target)) {
			targetResult.invokeType = 'reflect';
		} else {
			targetResult.invokeType = 'normal';
		}
		targetResult.effectOutcomes = this.computeDeterministicEffectOutcomes(target);
		this.targetResults[resultId] = targetResult;
		if (simpleResultId !== resultId) this.targetResults[simpleResultId] = targetResult;
		if (legacyResultId !== resultId) this.targetResults[legacyResultId] = targetResult;
		targetResult.dmg = this.makeDamageValue(target, crit);

		if (MATTIE.multiplayer.pvp.inPVP) {
			if (targetResult.dmg >= target.hp) this.killingBlow = true;
			this.targetName = target.name();
			// update dmg vals for pvp

			const originalTarget = target;
			const originalTargetName = target.name();
			const baseDmg = targetResult.dmg;
			atkScaler = 0.05;

			// limbs only do 40% dmg
			targetResult.dmg = Math.ceil(MATTIE.util.clamp(baseDmg * atkScaler * 0.4, 6, 89));

			if (originalTargetName.toLowerCase().includes('torso')) {
				targetResult.dmg = Math.ceil(MATTIE.util.clamp(baseDmg * atkScaler, 6, 89));
				// battler.enemy().params[2] = MATTIE.util.clamp(actor.atk * atkScaler, 4, 100);// min damage 4
			} else if (originalTargetName.toLowerCase().includes('head')) {
				// battler.enemy().params[2] = MATTIE.util.clamp(actor.atk * atkScaler * 3, 4, 100);// 1.5x dmg to head
				// head does 3x dmg
				targetResult.dmg = Math.ceil(MATTIE.util.clamp(baseDmg * atkScaler * 3, 6, 99));
			}
		}
	});
	BattleManager.targetResults = Object.assign(BattleManager.targetResults || {}, this.targetResults);
};

Game_Action.prototype.loadRng = function (results, id) {
	this._id = id;
	if (results && typeof results === 'object') {
		this.targetResults = Object.assign(this.targetResults || {}, results);
	} else {
		this.targetResults = this.targetResults || {};
	}

	if (MATTIE.multiplayer.devTools.battleLogger && Object.keys(this.targetResults).length === 0) {
		console.warn('[NetRNG] loadRng received no target results for action');
	}
};

Game_Action.prototype.getTargetResults = function () {
	return this.targetResults || BattleManager.targetResults;
};

MATTIE.multiplayer.Game_Action_itemEffectAddAttackState = Game_Action.prototype.itemEffectAddAttackState;
Game_Action.prototype.itemEffectAddAttackState = function (target, effect) {
	const deterministicOutcome = this.getDeterministicEffectOutcome(target, effect);
	if (deterministicOutcome && Array.isArray(deterministicOutcome.states)) {
		deterministicOutcome.states.forEach((stateOutcome) => {
			if (stateOutcome && stateOutcome.apply) {
				target.addState(stateOutcome.stateId);
				this.makeSuccess(target);
			}
		});
		return;
	}
	MATTIE.multiplayer.Game_Action_itemEffectAddAttackState.call(this, target, effect);
};

MATTIE.multiplayer.Game_Action_itemEffectAddNormalState = Game_Action.prototype.itemEffectAddNormalState;
Game_Action.prototype.itemEffectAddNormalState = function (target, effect) {
	const deterministicOutcome = this.getDeterministicEffectOutcome(target, effect);
	if (deterministicOutcome && Object.prototype.hasOwnProperty.call(deterministicOutcome, 'apply')) {
		if (deterministicOutcome.apply) {
			target.addState(effect.dataId);
			this.makeSuccess(target);
		}
		return;
	}
	MATTIE.multiplayer.Game_Action_itemEffectAddNormalState.call(this, target, effect);
};

MATTIE.multiplayer.Game_Action_itemEffectRemoveState = Game_Action.prototype.itemEffectRemoveState;
Game_Action.prototype.itemEffectRemoveState = function (target, effect) {
	const deterministicOutcome = this.getDeterministicEffectOutcome(target, effect);
	if (deterministicOutcome && Object.prototype.hasOwnProperty.call(deterministicOutcome, 'apply')) {
		if (deterministicOutcome.apply) {
			target.removeState(effect.dataId);
			this.makeSuccess(target);
		}
		return;
	}
	MATTIE.multiplayer.Game_Action_itemEffectRemoveState.call(this, target, effect);
};

MATTIE.multiplayer.Game_Action_itemEffectAddDebuff = Game_Action.prototype.itemEffectAddDebuff;
Game_Action.prototype.itemEffectAddDebuff = function (target, effect) {
	const deterministicOutcome = this.getDeterministicEffectOutcome(target, effect);
	if (deterministicOutcome && Object.prototype.hasOwnProperty.call(deterministicOutcome, 'apply')) {
		if (deterministicOutcome.apply) {
			target.addDebuff(effect.dataId, effect.value1);
			this.makeSuccess(target);
		}
		return;
	}
	MATTIE.multiplayer.Game_Action_itemEffectAddDebuff.call(this, target, effect);
};

MATTIE.multiplayer.Game_Action_Apply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function (target) {
	const targetResult = this.findTargetResult(target);
	MATTIE.multiplayer.Game_Action_Apply.call(this, target);
	if (targetResult && target && target.result && target.result()) {
		if (Object.prototype.hasOwnProperty.call(targetResult, 'crit')) {
			target.result().critical = targetResult.crit;
		}
	}
};
MATTIE.multiplayer.Game_Action_testApply = Game_Action.prototype.testApply;
Game_Action.prototype.testApply = function (target) {
	if (target && target.result && target.result() && target.result().forceHit) {
		const result = this.findTargetResult(target);
		target.result().forceHit(result || undefined);
	}
	return MATTIE.multiplayer.Game_Action_testApply.call(this, target);
};

/** @description the base make damage value function for a game action */
MATTIE.multiplayer.Game_ActionmakeDamageValue = Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue = function (target, critical) {
	const targetResult = this.findTargetResult(target);
	if (targetResult) {
		if (target && target.result && target.result() && target.result().forceHit) {
			if (Object.prototype.hasOwnProperty.call(targetResult, 'crit')) critical = targetResult.crit;
			if (Object.prototype.hasOwnProperty.call(targetResult, 'dmg')) return targetResult.dmg;
		}
	}
	return MATTIE.multiplayer.Game_ActionmakeDamageValue.call(this, target, critical);
};

/** @description extend the is hit function to include if it is being forced to hit */
MATTIE.multiplayer.Game_ActionResultisHit = Game_ActionResult.prototype.isHit;
Game_ActionResult.prototype.isHit = function () {
	if (typeof this._forcedHit != 'undefined') {
		this.missed = this._preloadMissed;
		this.evaded = this._preloadEvade;
		return this._forcedHit && !this.missed && !this.evaded;
	}
	return (MATTIE.multiplayer.Game_ActionResultisHit.call(this));
};
/** @description set a action result as forced hit */
Game_ActionResult.prototype.forceHit = function (obj) {
	if (typeof obj != 'undefined') {
		this._forcedHit = obj.res;
		this._preloadMissed = obj.miss;
		this._preloadEvade = obj.evade;
	} else {
		this._forcedHit = undefined;
		this._preloadMissed = undefined;
		this._preloadEvade = undefined;
	}
};

Game_Action.prototype.setNetTarget = function (peerId) {
	this._netSubjectPeerId = peerId;
	this._netTarget = peerId;
};
MATTIE.multiplayer.gameActonSubject = Game_Action.prototype.subject;
Game_Action.prototype.subject = function () {
	const subjectPeerId = this._netSubjectPeerId || this._netTarget;
	const subjectDataActorId = this._netSubjectDataActorId || this._subjectActorId;
	if (subjectPeerId) {
		if (subjectPeerId != MATTIE.multiplayer.getCurrentNetController().peerId) {
			const netPlayer = MATTIE.multiplayer.getCurrentNetController().netPlayers[subjectPeerId];
			if (netPlayer && netPlayer.$netActors) {
				return netPlayer.$netActors.dataActor(subjectDataActorId);
			}
		}
	}
	if (this._subjectActorId > 0) {
		const localActor = $gameParty.battleMembers().find((member) => member
			&& typeof member.actorId === 'function'
			&& member.actorId() === subjectDataActorId);
		return localActor || $gameActors.actor(subjectDataActorId);
	}
	return $gameTroop.members()[this._subjectEnemyIndex];
};

/** start the combat round */
BattleManager.startTurn = function () {
	if ($gameTroop.totalCombatants() == 1) { // if solo, start next phase
		MATTIE.BattleManagerStartTurn.call(this);
	} else { // if the player is fighting with allies enter "ready" state
		this.ready();
	}
};
BattleManager.getNextSubject = function () {
	if ($gameTroop.turnCount() <= 0) return null;
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
			const currentAction = battler.currentAction ? battler.currentAction() : null;
			if (!currentAction) {
				if (MATTIE.multiplayer.devTools.battleLogger) {
					console.warn(`[NetAction] Skipping battler with no current action: ${battler.name ? battler.name() : 'unknown'}`);
				}
			} else {
				this._performedBattlers.push(battler);
				return battler;
			}
		}
	}
};
MATTIE.multiplayer.battlemanageronStart = BattleManager.startBattle;
BattleManager.startBattle = function () {
	MATTIE.multiplayer.combatEmitter.netExTurn = false;
	MATTIE.multiplayer.ready = false;
	MATTIE.multiplayer.waitingOnAllies = false;
	MATTIE.multiplayer.battlemanageronStart.call(this);
	this._netActors = [];
};

BattleManager.addNetActionBattler = function (battler, isExtraTurn) {
	if (!this._netActionBattlers) this._netActionBattlers = [];
	const netActionBattler = {};
	netActionBattler.battler = battler;
	netActionBattler.isExtraTurn = isExtraTurn;
	this._netActionBattlers.push(netActionBattler);
};

BattleManager.clearNetActionBuffer = function () {
	this._netActionBattlers = [];
};

/**
   * @description this function handles where enemies and local player attack in combat
   * @returns int
   */
Game_Battler.prototype.partyIndex = function () {
	const indexof = $gameParty.battleMembers().indexOf(this);
	return indexof != -1 ? indexof : MATTIE.multiplayer.config.scaling.enemyBattleIndex(this);
};

MATTIE.multiplayer.multiCombat.makeActionOrders = BattleManager.makeActionOrders;
BattleManager.makeActionOrders = function () {
	if (!this._netActionBattlers) this._netActionBattlers = [];
	MATTIE.multiplayer.multiCombat.makeActionOrders.call(this);
	const currentNetBattlers = this._netActionBattlers.filter((netBattler) => {
		if (Galv.EXTURN.active || MATTIE.multiplayer.combatEmitter.netExTurn) {
			return netBattler.isExtraTurn;
		}
		return true;
	}).map((netBattler) => netBattler.battler);
	let battlers = [];
	if (MATTIE.multiplayer.combatEmitter.netExTurn) {
		battlers = currentNetBattlers;
	} else {
		battlers = this._actionBattlers.concat(currentNetBattlers);
	}

	battlers.forEach((battler) => {
		battler.makeSpeed();
	});
	battlers.sort((a, b) => {
		let val = 0;
		const aAction = a.currentAction ? a.currentAction() : null;
		const bAction = b.currentAction ? b.currentAction() : null;
		const aSlot = aAction && typeof aAction._netActionSlot === 'number' ? aAction._netActionSlot : Number.MAX_SAFE_INTEGER;
		const bSlot = bAction && typeof bAction._netActionSlot === 'number' ? bAction._netActionSlot : Number.MAX_SAFE_INTEGER;
		val = a.partyIndex() - b.partyIndex(); // sort my index in order of decreasing
		if (val === 0) { // if index is same sort by if the battler is a player
			val = (a instanceof Game_Actor ? 1 : 0) - (b instanceof Game_Actor ? 1 : 0);
		}
		if (val === 0) { // if both palyers sort by speed
			val = b.speed() - a.speed();
		}

		if (val === 0) { // finnally sort by id
			if (a.isActor() && b.isActor()) {
				const aPeerId = a.peerId || a.netID || '';
				const bPeerId = b.peerId || b.netID || '';
				val = bPeerId.localeCompare(aPeerId);
			}
		}

		if (val === 0 && aSlot !== bSlot) {
			val = aSlot - bSlot;
		}

		if (val === 0) {
			const aUuid = aAction && aAction._netActionUuid ? aAction._netActionUuid : '';
			const bUuid = bAction && bAction._netActionUuid ? bAction._netActionUuid : '';
			val = aUuid.localeCompare(bUuid);
		}

		return val;
	});

	this._actionBattlers = battlers;
};

Game_Battler.prototype.setCurrentAction = function (action) {
	this.forceAction(action._item._itemId, action._targetIndex, action.forcedTargets);
	const netSubjectPeerId = action._netSubjectPeerId || action._netTarget;
	const netActionUuid = action._netActionUuid;
	const netSubjectUUID = action._netSubjectUUID;
	const netActionSlot = action._netActionSlot;
	this._actions[this._actions.length - 1]._netSubjectPeerId = netSubjectPeerId;
	this._actions[this._actions.length - 1]._netTarget = netSubjectPeerId;
	this._actions[this._actions.length - 1]._netActionUuid = netActionUuid;
	this._actions[this._actions.length - 1]._netSubjectUUID = netSubjectUUID;
	this._actions[this._actions.length - 1]._netActionSlot = netActionSlot;
	this._actions[this._actions.length - 1]._netSubjectDataActorId = action._netSubjectDataActorId;
	this._actions[this._actions.length - 1]._netSubjectEnemyId = action._netSubjectEnemyId;
	this._actions[this._actions.length - 1].netPartyId = action.netPartyId;
	this._actions[this._actions.length - 1].loadRng(action.targetResults);
	this._actions[this._actions.length - 1].cb = action.cb;

	console.log(action.forcedTargets);
	if (action._item._dataClass === 'item') this._actions[this._actions.length - 1].setItem(action._item._itemId);
};
MATTIE.forceAction = Game_Battler.prototype.forceAction;
Game_Battler.prototype.forceAction = function (skillId, targetIndex, forcedTargets = []) {
	if (forcedTargets.length > 0) this.forcedTargets = forcedTargets;
	MATTIE.forceAction.call(this, skillId, targetIndex);
	if (forcedTargets.length > 0) this._actions[this._actions.length - 1].forcedTargets = forcedTargets;
};

MATTIE.maketargets = Game_Action.prototype.makeTargets;
/** override make targets to return forced target if we need */
Game_Action.prototype.makeTargets = function () {
	if (this.forcedTargets) { // net player targeting someone
		return this.forcedTargets;
	}

	// Only process netPartyId if it's defined and different from current peer
	if (this.netPartyId && this.netPartyId !== MATTIE.multiplayer.getCurrentNetController().peerId) { // host targeting net player
		const net = MATTIE.multiplayer.getCurrentNetController().netPlayers[this.netPartyId];
		let netParty = [];
		if (net && typeof net.battleMembers === 'function') {
			netParty = net.battleMembers();
			// Filter out dead/null members
			netParty = netParty.filter((m) => m && !m.isDead());
			if (netParty.length > 0) {
				return netParty;
			}
		}
		// Fallback to default if net party not found or empty
		console.warn(`[NetAction] Could not find valid targets for netPartyId ${this.netPartyId}`);
	}

	return MATTIE.maketargets.call(this);
};

Game_Action.prototype.setNetPartyId = function (id) {
	this.netPartyId = id;
};

/** check that all combatants on this event are ready */
BattleManager.checkAllPlayersReady = function () {
	return $gameTroop.allReady();
};

/** check that all combatants on this event are ready */
BattleManager.checkAllExtraTurn = function () {
	return $gameTroop.allExTurn();
};

/** check that all combatants on this event are ready */
BattleManager.checkSomeExtraTurn = function () {
	return $gameTroop.someExTurn();
};

/** check that all combatants on this event are ready */
BattleManager.allExTurnReady = function () {
	return $gameTroop.allExTurnReady();
};

// override YANFly's update function to have the ready state aswell
BattleManager.update = function () {
	if (!this.isBusy() && !this.updateEvent()) {
		switch (this._phase) {
		case 'start':
			this.startInput();
			break;

		case 'input':
			if (this.checkSomeExtraTurn() && !Galv.EXTURN.active) {
				this.ready();
				break;
			}
			if (!$gameParty.canInput()) { // if the game party cannot input then they are ready
				this.ready();
			}
			break;
		case 'ready':
			// allow 'un-reading' to go back to previous state.
			// and if all players are ready proceed to turn state.

			MATTIE.multiplayer.waitingOnAllies = true;
			if (!MATTIE.multiplayer.combatEmitter.netExTurn) {
				if (this.checkSomeExtraTurn() && !Galv.EXTURN.active) { // if someone else has an extra turn but local does not
					if (this.allExTurnReady() && this.checkAllPlayersReady()) {
						// if atleast one player has an extra turn and all players with extra turn are ready.
						MATTIE.multiplayer.combatEmitter.netExTurn = true;
						this.startAfterReady();
					}
				} else if (this.checkAllPlayersReady()) { // otherwise normal check all ready
					this.startAfterReady();
					setTimeout(() => {
						MATTIE.multiplayer.BattleController.emitUnreadyEvent(); // unready once the round is well and started
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
			this.updateActionList();
			break;
		case 'actionTargetList':
			this.updateActionTargetList();
			break;
		case 'turnEnd':
			if (!MATTIE.multiplayer.combatEmitter.netExTurn) { // if a net player is taking an extra turn, dont unready
				MATTIE.multiplayer.BattleController.emitUnreadyEvent();
				MATTIE.multiplayer.BattleController.emitTurnEndEvent();
			}
			BattleManager.sync();
			break;
		case 'syncing':

			break;
		case 'doneSyncing':
			if (MATTIE.multiplayer.combatEmitter.netExTurn) {
				MATTIE.multiplayer.combatEmitter.netExTurn = false; // turn of net extra turn
				this.updateTurnEnd();
			} else {
				this.updateTurnEnd();
			}

			break;
		case 'battleEnd':
			MATTIE.multiplayer.BattleController.emitTurnEndEvent();
			this.updateBattleEnd();
			break;
		}
	} else if (this._phase === 'ready') {
		if (!this._readyBlockLogTimer || Date.now() - this._readyBlockLogTimer > 2000) {
			this._readyBlockLogTimer = Date.now();
			var _msgBusy = $gameMessage.isBusy();
			var _sprBusy = this._spriteset ? this._spriteset.isBusy() : 'no_spriteset';
			var _logBusy = this._logWindow ? this._logWindow.isBusy() : 'no_logWindow';
			console.warn(`[ReadyBlock] phase=ready but update blocked. isBusy components: msg=${_msgBusy} sprite=${_sprBusy} log=${_logBusy}`);
		}
	}
};

MATTIE.multiplayer.combatEmitter.startAction = BattleManager.startAction;
BattleManager.startAction = function () {
	var action = this._subject.currentAction();
	if (!action) {
		if (MATTIE.multiplayer.devTools.battleLogger) {
			console.warn('[NetAction] startAction called with no current action; skipping to prevent turn softlock');
		}
		if (this._subject && this._subject.removeCurrentAction) this._subject.removeCurrentAction();
		this.endAction();
		return;
	}
	const isNet = this._subject.isNetActor;
	MATTIE.multiplayer.BattleController.onSkillExecution(action, this._subject, isNet);
};

MATTIE.multiplayer.combatEmitter.invokeAction = BattleManager.invokeAction;
BattleManager.invokeAction = function (subject, target) {
	const action = subject && subject.currentAction ? subject.currentAction() : null;
	if (action && typeof action.findTargetResult === 'function') {
		const targetResult = action.findTargetResult(target);
		if (targetResult && targetResult.invokeType) {
			this._logWindow.push('pushBaseLine');
			if (targetResult.invokeType === 'counter') {
				this.invokeCounterAttack(subject, target);
			} else if (targetResult.invokeType === 'reflect') {
				this.invokeMagicReflection(subject, target);
			} else {
				this.invokeNormalAction(subject, target);
			}
			subject.setLastTarget(target);
			this._logWindow.push('popBaseLine');
			return;
		}
	}
	MATTIE.multiplayer.combatEmitter.invokeAction.call(this, subject, target);
};
