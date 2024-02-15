var MATTIE = MATTIE || {};

MATTIE.simpleBattleAPI = {};

/**
 * @description a simple function to start a fight. Latch onto the battle processing cmd
 * @param {*} troopId the id of the troop
 */
MATTIE.simpleBattleAPI.startFightWith = function (troopId) {
	if ($dataTroops[troopId]) {
		$gameTemp.reserveCommonEvent(74); // before battle
		BattleManager.setEventCallback(() => {
			$gameTemp.reserveCommonEvent(66); // after battle
		});
		let tempInterp = new Game_Interpreter();
		tempInterp._params = [];
		//driect designation of troop
		tempInterp._params[0] = 0;
		//troop id
		tempInterp._params[1] = troopId;
		//can lose
		tempInterp._params[2] = true;
		//can escape
		tempInterp._params[3] = true;
		tempInterp.command301();
	}
};
