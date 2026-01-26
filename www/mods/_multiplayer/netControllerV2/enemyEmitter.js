var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.multiplayer.devTools = {};
MATTIE.multiplayer.enemyEmitter = {};
MATTIE.multiplayer.currentBattleEnemy = MATTIE.multiplayer.currentBattleEnemy || {};

function enemyLog(msg) {
	if (MATTIE.multiplayer.devTools.moveLogger) {
		console.info(`Enemy Logger -- ${msg}`);
	}
}

//-----------------------------------------------------
// Enemy Action Authority - Deterministic Target Selection
//-----------------------------------------------------
/**
 * @description Build a list of all actors across all parties for enemy targeting
 */
MATTIE.multiplayer.getAllBattleActors = function() {
	const netController = MATTIE.multiplayer.getCurrentNetController();
	const allActors = [];
	
	// Build a sorted list of all peer IDs for deterministic ordering
	const allPeerIds = [netController.peerId];
	if (netController.netPlayers) {
		allPeerIds.push(...Object.keys(netController.netPlayers));
	}
	allPeerIds.sort(); // Sort alphabetically for deterministic order
	
	// Add actors in sorted peer order
	allPeerIds.forEach(peerId => {
		let members = [];
		if (peerId === netController.peerId) {
			members = $gameParty.battleMembers();
		} else if (netController.netPlayers[peerId]) {
			const netPlayer = netController.netPlayers[peerId];
			if (netPlayer && netPlayer.battleMembers) {
				members = netPlayer.battleMembers();
			}
		}
		
		members.forEach((actor, index) => {
			if (actor && actor.isAlive()) {
				allActors.push({
					actor: actor,
					ownerId: peerId,
					actorId: actor.actorId(),
					index: index
				});
			}
		});
	});
	
	return allActors;
};

/**
 * @description Override targetsForOpponents to make enemy target selection deterministic across all parties
 * Uses turn count and enemy index as seed so both machines pick the same target
 */
MATTIE.multiplayer.Game_Action_targetsForOpponents_Original = Game_Action.prototype.targetsForOpponents;
Game_Action.prototype.targetsForOpponents = function() {
	const netController = MATTIE.multiplayer.getCurrentNetController();
	
	// Only apply for enemy actions in multiplayer
	if (!this.subject() || !this.subject().isEnemy || !this.subject().isEnemy() ||
	    !netController || !netController.netPlayers || Object.keys(netController.netPlayers).length === 0) {
		return MATTIE.multiplayer.Game_Action_targetsForOpponents_Original.call(this);
	}
	
	const allActors = MATTIE.multiplayer.getAllBattleActors();
	
	if (allActors.length === 0) {
		return MATTIE.multiplayer.Game_Action_targetsForOpponents_Original.call(this);
	}
	
	let targets = [];
	
	// Improved Deterministic Seed Generation to prevent static targeting
	// Inputs: Turn Count, Enemy ID, Enemy Index, Remaining Actions
	const turn = $gameTroop._turnCount || 1; 
    // Use unique enemy ID + Index to ensure different enemies have different seeds/targets
	const enemyId = this.subject().enemyId();
    const enemyIndex = this.subject().index();
	const currentActionCount = this.subject()._actions ? this.subject()._actions.length : 0;
    
    // Create a composite seed integer
    // We mix these values to create a unique state for this specific action attempt
    let seedState = (turn * 397) ^ (enemyId * 769) ^ (enemyIndex * 2039) ^ (currentActionCount * 4099);

    // Simple Jenkins-like hash for better avalanche
    seedState = (seedState + 0x7ED55D16) + (seedState << 12);
    seedState = (seedState ^ 0xC761C23C) ^ (seedState >>> 19);
    seedState = (seedState + 0x165667B1) + (seedState << 5);
    seedState = (seedState + 0xD3A2646C) ^ (seedState << 9);
    seedState = (seedState + 0xFD7046C5) + (seedState << 3);
    seedState = (seedState ^ 0xB55A4F09) ^ (seedState >>> 16);
    
    // Normalize to 0-1 float
    const randomVal = (seedState >>> 0) / 4294967296;

    // DEBUG LOGGING
    if (MATTIE.isDev || MATTIE.multiplayer.devTools.battleLogger) {
        console.log(`[TargetDEBUG] Turn: ${turn}, Enemy: ${enemyIndex}, Hash: ${randomVal.toFixed(4)}`);
        console.log(`[TargetDEBUG] Global Targets: ${allActors.length}`);
    }
	
	if (this.isForRandom()) {
		// Random target needs deterministic selection across ALL parties
		const targetIndex = Math.floor(randomVal * allActors.length) % allActors.length;
		targets.push(allActors[targetIndex].actor);
	} else if (this.isForOne()) {
		if (this._targetIndex < 0) {
			// Random single target - deterministic across ALL parties
			const targetIndex = Math.floor(randomVal * allActors.length) % allActors.length;
            if (MATTIE.isDev) console.log(`[TargetDEBUG] Target Index: ${targetIndex} (${allActors[targetIndex].actor.name()})`);
			targets.push(allActors[targetIndex].actor);
		} else {
            // [Fix] Even specific target indices (0-3) are likely from local-only AI logic
            // To ensure we hit ALL players, we treat "Specific Index" as a "Deterministic Random" as well
            // UNLESS it's a very specific script usage, but in vanilla/F&H, 0 usually just means "First Actor"
            // We mix the specific index into the hash to keep it deterministic but allowing global spread
            
            // Re-use hash logic but add targetIndex as salt
            // This ensures if AI picked Index 1 vs Index 0, we get different global targets
            const salt = this._targetIndex * 127;
            let targetedState = (seedState + salt) >>> 0;
            const targetedRandom = (targetedState / 4294967296);

			const targetIndex = Math.floor(targetedRandom * allActors.length) % allActors.length;
            if (MATTIE.isDev) console.log(`[TargetDEBUG] Selected Index: ${targetIndex} (One-Specific-Remapped) -> ${allActors[targetIndex].actor.name()}`);
			targets.push(allActors[targetIndex].actor);
		}
	} else {
		// For all - return all actors from all parties
		targets = allActors.map(a => a.actor);
	}
	
	return targets;
};

/**
 * @description Override Game_Action.apply to prevent enemy damage from duplicating across machines
 * Enemies can target any party member, but damage only applies if target is in LOCAL party
 * This ensures each attack hits ONE party's actors, not both
 */
MATTIE.multiplayer.Game_Action_apply_Original = Game_Action.prototype.apply;
Game_Action.prototype.apply = function(target) {
	const netController = MATTIE.multiplayer.getCurrentNetController();
	
	// If this is an enemy action and we're in multiplayer
	if (this.subject() && this.subject().isEnemy && this.subject().isEnemy() && 
	    netController && netController.netPlayers && Object.keys(netController.netPlayers).length > 0) {
		
		// Check if target is in a netplayer's party (not local)
		let isNetPlayerActor = false;
		let matchingPeer = "";
		
		Object.keys(netController.netPlayers).forEach(playerId => {
			// Safety: Skip self if present in netPlayers for any reason
			if (playerId === netController.peerId) return;
			
			const netPlayer = netController.netPlayers[playerId];
			if (netPlayer && netPlayer.battleMembers) {
				if (netPlayer.battleMembers().includes(target)) {
					isNetPlayerActor = true;
					matchingPeer = playerId;
				}
			}
		});
		
		// If target belongs to a netplayer, skip damage on this machine
		if (isNetPlayerActor) {
			if (MATTIE.isDev || MATTIE.multiplayer.devTools.battleLogger) {
				console.log(`[EnemyAI] Skipping damage to actor ${target.name()} (ID: ${target.actorId()}) belonging to Peer ${matchingPeer}`);
			}
			target.result().clear();
			return;
		}
	}
	
	// Proceed with normal damage application
	return MATTIE.multiplayer.Game_Action_apply_Original.call(this, target);
};

// event battle emitters
// game system.onBattleStart is only used for statistics, but this makes the most logical sense to override.
MATTIE.multiplayer.gameSystem_OnBattleStart = Game_System.prototype.onBattleStart;
Game_System.prototype.onBattleStart = function () {
	MATTIE.multiplayer.inBattle = true;
	enemyLog('Battle Started');
	return MATTIE.multiplayer.gameSystem_OnBattleStart.call(this);
};

MATTIE.multiplayer.BattleManager_EndBattle = BattleManager.endBattle;
BattleManager.endBattle = function (result) {
	MATTIE.multiplayer.BattleController.emitBattleEnd();
	var res = MATTIE.multiplayer.BattleManager_EndBattle.call(this, result);
	MATTIE.multiplayer.BattleController.emitTurnEndEvent();
	MATTIE.multiplayer.getCurrentNetController().emitBattleEndEvent($gameTroop._troopId, MATTIE.multiplayer.currentBattleEnemy);
	MATTIE.multiplayer.inBattle = false;
	BattleManager.clearNetActionBuffer();
	enemyLog('Battle Ended');
	return res;
};

MATTIE.multiplayer.gameSystem_OnBattleWin = Game_System.prototype.onBattleWin;
Game_System.prototype.onBattleWin = function () {
	enemyLog('Battle Won');
	return MATTIE.multiplayer.gameSystem_OnBattleWin.call(this);
};

MATTIE.multiplayer.gameSystem_onBattleEscape = Game_System.prototype.onBattleEscape;
Game_System.prototype.onBattleEscape = function () {
	enemyLog('Battle Escaped');
	return MATTIE.multiplayer.gameSystem_onBattleEscape.call(this);
};

MATTIE.multiplayer.battleProcessing = Game_Interpreter.prototype.command301;
Game_Interpreter.prototype.command301 = function () {
	var troopId;
	if (!$gameParty.inBattle()) {
		if (this._params[0] === 0) { // Direct designation
			troopId = this._params[1];
		} else if (this._params[0] === 1) { // Designation with a variable
			troopId = $gameVariables.value(this._params[1]);
		} else { // Same as Random Encounter
			troopId = $gamePlayer.makeEncounterTroopId();
		}
	} else {
		troopId = $gameTroop._troopId;
	}
    MATTIE.multiplayer.battleProcessing.call(this);

    // Sync Check: if joining an existing battle, populate BattleManager with known combatants
    try {
        const netCtrl = MATTIE.multiplayer.getCurrentNetController();
        const activeTroopId = $gameTroop._troopId;
        const myId = netCtrl && netCtrl.peerId;

        // Fallback: Populate from $dataTroops if possible, even if Event is missing/broken
        if (activeTroopId && $dataTroops[activeTroopId] && $dataTroops[activeTroopId]._combatants) {
             const combatants = Object.keys($dataTroops[activeTroopId]._combatants);
             combatants.forEach(id => {
                if (id !== myId && BattleManager._netActors && BattleManager._netActors.indexOf(id) === -1) {
                     BattleManager._netActors.push(id);
                     if (MATTIE.multiplayer.devTools.battleLogger) console.info(`[Net] Fallback linked combatant ${id} from DataTroop`);
                }
             });
        }
        
        // Also check Event Logic if available (Preferred)
        const event = $gameMap.event(this.eventId());
        if (event && event.inCombat && event.inCombat()) {
             const eCombatants = Object.keys(event._combatants || {});
             eCombatants.forEach(id => {
                if (id !== myId && BattleManager._netActors.indexOf(id) === -1) {
                     BattleManager._netActors.push(id);
                }
             });
        }
    
        // Try to request Sync if anyone else is here
        if (BattleManager._netActors && BattleManager._netActors.length > 0 && netCtrl) {
              netCtrl.emitBattleSyncRequest(activeTroopId);
        }

    } catch (err) {
        console.error("[Net] Error linking existing combatants:", err);
    }

    // Defensive check to ensure troopId is valid before emitting
    if (troopId) {
        MATTIE.multiplayer.getCurrentNetController().emitBattleStartEvent(this.eventId(), this._mapId, troopId);
        MATTIE.multiplayer.hasImmunityToBattles = true;
        
        // Safe logging
        const eId = typeof this.eventId === 'function' ? this.eventId() : '???';
        const mId = this._mapId !== undefined ? this._mapId : '???';
        // enemyLog(`Battle Processing for event #${eId} on map #${mId}\n with troopID: ${troopId}`);
    } else {
        console.warn("[Net] Skipping Battle Start limit: Invalid TroopID");
    }
	return true;
};

MATTIE.multiplayer.GameCharBase_Init = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function () {
	MATTIE.multiplayer.GameCharBase_Init.call(this);
	this._combatants = {};
};

Game_Map.prototype.unlockEvent = function (eventId) {
	if (this._events[eventId]) {
		if (!this._events[eventId].inCombat()) this._events[eventId].unlock();
	}
};

MATTIE.multiplayer.gameTroopSetup = Game_Troop.prototype.setup;
Game_Troop.prototype.setup = function (troopId) {
	MATTIE.multiplayer.gameTroopSetup.call(this, troopId);
    
    // Fix: Prefer existing combatants (possibly set by TroopAPI fix for multiplayer sync) 
    // or fetch from live dataTroops to ensure network updates persist.
    // Avoid using this.troop()._combatants as it may be a disconnected clone.
	if (!this._combatants) {
        if ($dataTroops[troopId] && $dataTroops[troopId]._combatants) {
            this._combatants = $dataTroops[troopId]._combatants;
        } else {
             this._combatants = this.troop()._combatants || {};
        }
    }
    
	this.name = this.troop().name;
};
Game_Troop.prototype.getIdsInCombatWithExSelf = function () {
	const selfId = MATTIE.multiplayer.getCurrentNetController().peerId;
	if (!this._combatants) this._combatants = {};
	return Object.keys(this._combatants).filter((id) => id != selfId);
};

Game_Troop.prototype.totalCombatants = function () {
	if (!this._combatants) this._combatants = {};
	return Object.keys(this._combatants).length;
};

Game_Troop.prototype.inCombat = function () {
	if (!this._combatants) this._combatants = {};
	if (MATTIE.multiplayer.devTools.battleLogger) console.info(`incombat. The following players are in combat with this event: ${this.totalCombatants()}`);
	return this.totalCombatants() > 0;
};

Game_Troop.prototype.addIdToCombatArr = function (id) {
	if (this._combatants) {
		this._combatants[id] = {};
		this._combatants[id].bool = false;
		this._combatants[id].isExtraTurn = false;
	} else {
		this._combatants = {};
		this._combatants[id] = {};
		this._combatants[id].bool = false;
		this._combatants[id].isExtraTurn = false;
	}
};

Game_Troop.prototype.removeIdFromCombatArr = function (id) {
	if (this._combatants) {
		delete this._combatants[id];
	}
};

Game_Troop.prototype.setReadyIfExists = function (id, bool, isExtraTurn) {
	if (this._combatants) {
		if (Object.keys(this._combatants).indexOf(id) != -1) {
			this._combatants[id] = {};
			this._combatants[id].bool = bool;
			this._combatants[id].isExtraTurn = isExtraTurn;
		}
	}
};

Game_Troop.prototype.allReady = function () {
	let val = true;
	Object.keys(this._combatants).forEach((key) => {
		const element = this._combatants[key].bool;
		if (element == false) {
			val = false;
		}
	});
	return val;
};

Game_Troop.prototype.allExTurnReady = function () {
	let val = true;
	let atleastOnExTurn = false;
	Object.keys(this._combatants).forEach((key) => {
		const element = this._combatants[key];
		if (element.isExtraTurn) atleastOnExTurn = true;
		if (element.isExtraTurn == true && element.bool == false) val = false;
	});
	return val && atleastOnExTurn;
};

Game_Troop.prototype.someExTurn = function () {
	let val = false;
	Object.keys(this._combatants).forEach((key) => {
		const element = this._combatants[key].isExtraTurn;
		if (element == true) {
			val = true;
		}
	});
	return val;
};

Game_Troop.prototype.allExTurn = function () {
	const keys = Object.keys(this._combatants);
	for (let index = 0; index < keys.length; index++) {
		const key = keys[index];
		const element = this._combatants[key].isExtraTurn;
		if (element == 0) {
			return false;
		}
	}

	return true;
};

Game_Troop.prototype.getIdsInCombatWith = function () {
	if (!this._combatants) this._combatants = {};
	return Object.keys(this._combatants);
};

Game_CharacterBase.prototype.addIdToCombatArr = function (id, troopId = null) {
	if (this._combatants) {
		this._combatants[id] = {};
		this._combatants[id].bool = false;
		this._combatants[id].isExtraTurn = false;
	} else {
		this._combatants = {};
		this._combatants[id] = {};
		this._combatants[id].bool = false;
		this._combatants[id].isExtraTurn = false;
	}

	if (MATTIE.multiplayer.devTools.battleLogger) console.info(`The following players are in combat with this event: ${this.totalCombatants()}`);
};

Game_CharacterBase.prototype.removeIdFromCombatArr = function (id) {
	delete this._combatants[id];
	if (MATTIE.multiplayer.devTools.battleLogger) console.info(`The following players are in combat with this event: ${this.totalCombatants()}`);
};

Game_CharacterBase.prototype.setReadyIfExists = function (id, bool) {
	if (Object.keys(this._combatants).indexOf(id) != -1) {
		this._combatants[id].bool = bool;
	}
};

Game_CharacterBase.prototype.allReady = function () {
	const keys = Object.keys(this._combatants);
	for (let index = 0; index < keys.length; index++) {
		const key = keys[index];
		const element = this._combatants[key];
		if (element == 0) {
			val = false;
			return false;
		}
	}

	return true;
};

Game_CharacterBase.prototype.getIdsInCombatWith = function () {
	return Object.keys(this._combatants);
};
/** get ids in combat with excluding self id */
Game_CharacterBase.prototype.getIdsInCombatWithExSelf = function () {
	const selfId = MATTIE.multiplayer.getCurrentNetController().peerId;
	return Object.keys(this._combatants).filter((id) => id != selfId);
};

Game_CharacterBase.prototype.totalCombatants = function () {
	return Object.keys(this._combatants).length;
};

Game_CharacterBase.prototype.inCombat = function () {
	if (!this._combatants) this._combatants = {};
	if (MATTIE.multiplayer.devTools.battleLogger) console.info(`incombat. The following players are in combat with this event: ${this.totalCombatants()}`);
	return this.totalCombatants() > 0;
};

// Global helper to find an event involved in a specific troop battle
// Used by SimpleBattleAPI to auto-resolve "Assist" targets
MATTIE.multiplayer.inBattleRefScan = function(troopId) {
    if (!$gameMap || !$gameMap.events) return null;
    const events = $gameMap.events();
    for (let i = 0; i < events.length; i++) {
        const e = events[i];
        if (e && e.inCombat && e.inCombat() && e.getIdsInCombatWith && e.getIdsInCombatWith().length > 0) {
            // How do we match TroopID? We can't easily on the event itself unless checking NetPlayers.
            // But if ANY event is in combat, it's a strong candidate.
            // Let's refine: Check if the troop members match? No.
            // Let's assume on a map, players are fighting only one active thing usually.
            // Or check NetController to see if any player involved in this event is fighting that Troop.
            const ids = e.getIdsInCombatWith();
            const netCtrl = MATTIE.multiplayer.getCurrentNetController();
            for (let j = 0; j < ids.length; j++) {
                const pid = ids[j];
                const player = netCtrl.netPlayers[pid];
                if (player && player.troopInCombatWith === troopId) {
                    return e;
                }
            }
        }
    }
    return null;
};

// loggers

// MATTIE.multiplayer.enemyEmitter.moveTypeRandom = Game_Event.prototype.moveTypeRandom;
// Game_Event.prototype.moveTypeRandom = function() {
//     enemyLog("enemy has moved randomly");
//     return MATTIE.multiplayer.enemyEmitter.moveTypeRandom.call(this)
// }

// MATTIE.multiplayer.enemyEmitter.moveTypeTowardPlayer = Game_Event.prototype.moveTypeTowardPlayer;
// Game_Event.prototype.moveTypeTowardPlayer = function() {
//     enemyLog("enemy has moved towards player");
//     return MATTIE.multiplayer.enemyEmitter.moveTypeTowardPlayer.call(this)
// }

// //almost all movement in funger is custom
// MATTIE.multiplayer.enemyEmitter.moveTypeCustom = Game_Event.prototype.moveTypeCustom;
// Game_Event.prototype.moveTypeCustom = function() {
//     enemyLog("enemy has moved custom");
//     return MATTIE.multiplayer.enemyEmitter.moveTypeCustom.call(this);
// };

// //fires a lot (multiple times per custom move call)
// // MATTIE.multiplayer.enemyEmitter.updateRoutineMove = Game_Character.prototype.updateRoutineMove;
// // Game_Character.prototype.updateRoutineMove = function () {
// //     enemyLog("updated routine move");
// //     return MATTIE.multiplayer.enemyEmitter.updateRoutineMove.call(this);
// // }

// //fires very frequently

// MATTIE.multiplayer.enemyEmitter.setMoveRoute = Game_Character.prototype.setMoveRoute;
// Game_Character.prototype.setMoveRoute = function(moveRoute) {
//     enemyLog("set move route");
//     return MATTIE.multiplayer.enemyEmitter.setMoveRoute.call(this,moveRoute);
// }

// //gets called the same amount as update routine move
// MATTIE.multiplayer.enemyEmitter.forceMoveRoute = Game_Character.prototype.forceMoveRoute;
// Game_Character.prototype.forceMoveRoute = function(moveRoute) {
//     if(!(this instanceof Game_Player))
//     enemyLog("force move route");
//     return MATTIE.multiplayer.enemyEmitter.forceMoveRoute.call(this,moveRoute);
// }

// //fires constantly
// // MATTIE.multiplayer.enemyEmitter.updateSelfMovement = Game_Event.prototype.updateSelfMovement;
// // Game_Event.prototype.updateSelfMovement = function() {
// //     enemyLog("updated self movement");
// //     return MATTIE.multiplayer.enemyEmitter.updateSelfMovement.call(this)
// // }

// // MATTIE.multiplayer.enemyEmitter.isNearThePlayer = Game_Event.prototype.isNearThePlayer;
// // Game_Event.prototype.isNearThePlayer = function() {
// //     let val = MATTIE.multiplayer.enemyEmitter.isNearThePlayer.call(this);
// //     if(val) enemyLog("enemy is near the player");
// //     return val
// // }

// // MATTIE.multiplayer.enemyEmitter.isCollidedWithPlayerCharacters = Game_Event.prototype.isCollidedWithPlayerCharacters;
// // Game_Event.prototype.isCollidedWithPlayerCharacters = function(x, y) {
// //     let val = MATTIE.multiplayer.enemyEmitter.isCollidedWithPlayerCharacters.call(this,x,y);
// //     if(val) enemyLog("enemy has collided with player");
// //     return val

// // }
