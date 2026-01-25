var MATTIE = MATTIE || {};

MATTIE.simpleBattleAPI = {};

/**
 * @description a simple function to start a fight. Latch onto the battle processing cmd
 * @param {*} troopId the id of the troop
 */
MATTIE.simpleBattleAPI.startFightWith = function (troopId) {
	console.log(`[SimpleBattleAPI] Attempting to start fight with Troop ID: ${troopId}`);
	if (!troopId) {
		console.error("[SimpleBattleAPI] Error: troopId is null/undefined");
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
		tempInterp._eventId = 0; 

		try {
			const result = tempInterp.command301();
			console.log(`[SimpleBattleAPI] command301 returned: ${result}`);
		} catch (e) {
			console.error("[SimpleBattleAPI] Error executing command301:", e);
		}
	} else {
		console.error(`[SimpleBattleAPI] Error: Troop ${troopId} does not exist in $dataTroops`);
	}
};
