# Host-Authoritative Enemy AI Integration Guide

## Overview
This system makes enemy AI decisions ONLY on the host computer. The host selects targets from ALL parties (local + net players), pre-calculates hit/miss/damage, and broadcasts the predetermined results to clients.

## Files Created
1. `hostEnemyAI.js` - Core AI system with target selection and damage calculation
2. Modified `baseNetController.js` - Added broadcast/receive methods

## Remaining Integration Steps

### 1. Add processHostEnemyAction method to baseNetController.js
```javascript
/**
 * @description process a host-decided enemy action
 * @param {Object} actionData enemy action data from host
 * @param {string} hostId host peer id
 */
processHostEnemyAction(actionData, hostId) {
	const enemy = $gameTroop.members().find(e => 
		e.index() === actionData.enemyIndex && e.enemyId() === actionData.enemyId
	);
	
	if (!enemy) {
		console.error('[HostAI] Could not find enemy:', actionData);
		return;
	}
	
	// Create action from host data
	const action = new Game_Action(enemy);
	if (actionData.itemType === 'skill') {
		action.setSkill(actionData.skillId);
	} else {
		action.setItem(actionData.skillId);
	}
	
	// Determine target(s)
	let forcedTargets = [];
	if (actionData.results.all) {
		// AoE - target everyone
		forcedTargets = this.getAllBattleMembers();
	} else {
		// Single target
		const target = this.resolveActionTarget(actionData);
		if (target) forcedTargets = [target];
	}
	
	action.forcedTargets = forcedTargets;
	
	// Load predetermined results
	if (actionData.results.all) {
		action.targetResults = actionData.results.results;
	} else {
		const targetKey = this.makeTargetKey(actionData);
		action.targetResults = {};
		action.targetResults[targetKey] = actionData.results;
	}
	
	// Queue action
	enemy.setCurrentAction(action);
	BattleManager.addNetActionBattler(enemy, false);
}

resolveActionTarget(actionData) {
	if (actionData.targetOwnerId === this.peerId) {
		// Local player's actor
		return $gameParty.battleMembers()[actionData.targetIndex];
	} else {
		// Net player's actor
		const netPlayer = this.netPlayers[actionData.targetOwnerId];
		if (!netPlayer) return null;
		return netPlayer.battleMembers()[actionData.targetIndex];
	}
}

getAllBattleMembers() {
	const members = [...$gameParty.battleMembers()];
	Object.keys(this.netPlayers).forEach(playerId => {
		const netPlayer = this.netPlayers[playerId];
		if (netPlayer && netPlayer.battleMembers) {
			members.push(...netPlayer.battleMembers());
		}
	});
	return members.filter(m => m && m.isAlive());
}

makeTargetKey(actionData) {
	return `${actionData.targetOwnerId}_${actionData.targetIndex}`;
}
```

### 2. Integrate into combatEmitter.js
In the turn start sequence, add host-side enemy action generation:

```javascript
// In BattleManager.startTurn or during ready phase
if (MATTIE.multiplayer.getCurrentNetController().isHost) {
	// Host generates enemy actions
	const enemyActions = MATTIE.multiplayer.HostEnemyAI.makeEnemyActions();
	if (enemyActions && enemyActions.length > 0) {
		MATTIE.multiplayer.getCurrentNetController().emitEnemyActions(enemyActions);
	}
}
```

### 3. Disable local enemy makeActions on clients
```javascript
// In enemyEmitter.js or wherever enemies make actions
const originalMakeActions = Game_Enemy.prototype.makeActions;
Game_Enemy.prototype.makeActions = function() {
	// Only allow host to make enemy actions
	if (!MATTIE.multiplayer.getCurrentNetController().isHost) {
		// Client: wait for host's decision
		this.clearActions();
		return;
	}
	
	// Host: proceed normally (but host will use HostEnemyAI instead)
	originalMakeActions.call(this);
};
```

### 4. Hook into turn system
The host should generate and broadcast enemy actions during the "ready" phase, before player actions are executed. This ensures clients receive enemy action data before they need it.

## Key Benefits
- ✅ Eliminates enemy target selection desync
- ✅ Ensures all clients see same combat results
- ✅ Host authority prevents client-side cheating
- ✅ Pre-calculated damage removes RNG variance between machines

## Testing Checklist
- [ ] Host can select targets from any connected player
- [ ] Clients receive and execute predetermined enemy actions
- [ ] Damage values match on all clients
- [ ] AoE attacks hit all parties correctly
- [ ] Enemy target selection feels fair/random
