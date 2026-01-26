var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};

/**
 * @description Host-authoritative enemy AI system
 * Enemies make action decisions ONLY on the host, including target selection from ALL parties
 * Results (hit/miss/damage) are pre-calculated and broadcast to clients
 */
MATTIE.multiplayer.HostEnemyAI = {
	/**
	 * Get all possible targets across all parties (local + netplayers)
	 * @returns {Array<{battler: Game_Actor, ownerId: string, index: number}>}
	 */
	getAllPossibleTargets() {
		const targets = [];
		const netController = MATTIE.multiplayer.getCurrentNetController();
		
		// Add local party members
		$gameParty.battleMembers().forEach((member, index) => {
			if (member && member.isAlive()) {
				targets.push({
					battler: member,
					ownerId: netController.peerId,
					index: index,
					isLocal: true
				});
			}
		});
		
		// Add netplayer party members
		if (netController.netPlayers) {
			Object.keys(netController.netPlayers).forEach(playerId => {
				const netPlayer = netController.netPlayers[playerId];
				if (netPlayer && netPlayer.battleMembers) {
					netPlayer.battleMembers().forEach((member, index) => {
						if (member && member.isAlive()) {
							targets.push({
								battler: member,
								ownerId: playerId,
								index: index,
								isLocal: false,
								dataActorId: member.actorId() // Store the netactor's dataActorId
							});
						}
					});
				}
			});
		}
		
		return targets;
	},

	/**
	 * Host-side enemy action generation
	 * Called during turn start phase on host only
	 */
	makeEnemyActions() {
		if (!MATTIE.multiplayer.getCurrentNetController().isHost) return;
		
		const enemies = $gameTroop.members();
		const enemyActions = [];
		
		enemies.forEach(enemy => {
			if (!enemy || !enemy.isAlive()) return;
			
			// Let enemy make actions naturally (this sets up the action list)
			enemy.makeActions();
			
			// Process each action the enemy wants to take
			enemy._actions.forEach(action => {
				if (!action || !action.item()) return;
				
				// Select target from ALL available parties
				const targetInfo = this.selectEnemyTarget(enemy, action);
				if (!targetInfo) return;
				
				// Pre-calculate results
				const results = this.precalculateActionResults(enemy, action, targetInfo);
				
				enemyActions.push({
					enemyIndex: enemy.index(),
					enemyId: enemy.enemyId(),
					skillId: action.item().id,
					itemType: action.isSkill() ? 'skill' : 'item',
					targetOwnerId: targetInfo.ownerId,
					targetIndex: targetInfo.index,
					targetDataActorId: targetInfo.dataActorId,
					results: results
				});
			});
		});
		
		return enemyActions;
	},

	/**
	 * Select target for enemy action from ALL available parties
	 * @param {Game_Enemy} enemy 
	 * @param {Game_Action} action 
	 */
	selectEnemyTarget(enemy, action) {
		const allTargets = this.getAllPossibleTargets();
		if (allTargets.length === 0) return null;
		
		// Handle different target scopes
		if (action.isForAll()) {
			// For AoE, return a marker to hit all
			return { all: true };
		}
		
		if (action.isForRandom()) {
			// Random target from all available
			const randomIndex = Math.floor(Math.random() * allTargets.length);
			return allTargets[randomIndex];
		}
		
		// Default: single target selection
		// Use enemy AI to pick target index, but apply it to our expanded target pool
		let targetIndex = enemy.index() % allTargets.length; // Fallback
		
		// Try to use game's target selection if available
		if (action.decideRandomTarget) {
			// Some enemies have custom target selection
			targetIndex = Math.floor(Math.random() * allTargets.length);
		} else {
			// Standard selection: alive target
			targetIndex = Math.floor(Math.random() * allTargets.length);
		}
		
		return allTargets[targetIndex];
	},

	/**
	 * Pre-calculate hit/miss/damage for an enemy action
	 * @param {Game_Enemy} enemy 
	 * @param {Game_Action} action 
	 * @param {Object} targetInfo 
	 */
	precalculateActionResults(enemy, action, targetInfo) {
		if (targetInfo.all) {
			// Calculate for all targets
			const allTargets = this.getAllPossibleTargets();
			const results = {};
			allTargets.forEach(t => {
				const key = `${t.ownerId}_${t.index}`;
				results[key] = this.calculateSingleResult(action, t.battler);
			});
			return { all: true, results: results };
		} else {
			// Calculate for single target
			return this.calculateSingleResult(action, targetInfo.battler);
		}
	},

	/**
	 * Calculate hit/miss/damage for a single target
	 * @param {Game_Action} action 
	 * @param {Game_Actor} target 
	 */
	calculateSingleResult(action, target) {
		const hitRate = action.itemHit(target);
		const missed = Math.random() >= hitRate;
		const evaded = !missed && Math.random() < action.itemEva(target);
		const critical = !missed && !evaded && Math.random() < action.itemCri(target);
		
		let damage = 0;
		if (!missed && !evaded) {
			// Calculate damage
			const baseDamage = action.makeDamageValue(target, critical);
			damage = Math.floor(baseDamage);
		}
		
		return {
			missed: missed,
			evaded: evaded,
			critical: critical,
			damage: damage,
			hit: !missed && !evaded
		};
	}
};
