var MATTIE = MATTIE || {};

MATTIE.simpleBattleAPI = {};

/**
 * @description a simple function to start a fight and send the user to the assosiated scene
 * @param {*} troopId the id of the troop
 */
MATTIE.simpleBattleAPI.startFightWith = function (troopId) {
	if ($dataTroops[troopId]) {
		BattleManager.setup(troopId, true, true);
		$gamePlayer.makeEncounterCount();
		SceneManager.push(Scene_Battle);

		if (MATTIE.multiplayer) {
			MATTIE.multiplayer.getCurrentNetController().emitBattleStartEvent(1, $gameMap.mapId(), troopId);
		}
	}
};
