var MATTIE = MATTIE || {};

MATTIE.simpleBattleAPI = {};

/**
 * @description a simple function to start a fight. Latch onto the battle processing cmd
 * @param {*} troopId the id of the troop
 * @param {*} eventId optional event id to link the battle to
 */
MATTIE.simpleBattleAPI.startFightWith = function (troopId, eventId = 0) {
	console.log(`[SimpleBattleAPI] Attempting to start fight with Troop ID: ${troopId} (Event: ${eventId})`);
	if (!troopId) {
		console.error('[SimpleBattleAPI] Error: troopId is null/undefined');
		return;
	}

	if ($dataTroops[troopId]) {
		$gameTemp.reserveCommonEvent(74); // before battle
		BattleManager.setEventCallback(() => {
			$gameTemp.reserveCommonEvent(66); // after battle
		});
		const tempInterp = new Game_Interpreter();
		tempInterp._params = [];
		// driect designation of troop
		tempInterp._params[0] = 0;
		// troop id
		tempInterp._params[1] = Number(troopId); // Ensure numeric
		// can lose
		tempInterp._params[2] = true;
		// can escape
		tempInterp._params[3] = true;

		// Setup context to mimic a real event (avoids issues in overrides)
		tempInterp._mapId = $gameMap.mapId();
		tempInterp._eventId = Number(eventId) || 0;

		// ROBUSTNESS: If eventId is 0, we risk creating a desynced lobby if an event IS actually involved.
		// Try to find an event that is currently fighting this troop to latch onto it.
		// This fixes "Neither fighting the same enemy" issues when Assist has missing event context.
		if (tempInterp._eventId === 0 && MATTIE.multiplayer.inBattleRefScan) {
			const foundEvent = MATTIE.multiplayer.inBattleRefScan(troopId);
			if (foundEvent) {
				tempInterp._eventId = foundEvent.eventId();
				console.log(`[SimpleBattleAPI] Auto-detected Event #${tempInterp._eventId} for Troop ${troopId}`);
			}
		}

		try {
			const result = tempInterp.command301();
			console.log(`[SimpleBattleAPI] command301 returned: ${result}`);
		} catch (e) {
			console.error('[SimpleBattleAPI] Error executing command301:', e);
		}
	} else {
		console.error(`[SimpleBattleAPI] Error: Troop ${troopId} does not exist in $dataTroops`);
	}
};
