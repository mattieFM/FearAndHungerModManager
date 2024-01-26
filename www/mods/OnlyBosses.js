/* eslint-disable max-len */
/** ==============================================
 *
 *INSTALL Instructions. Either use my mod loader and put this in your mods folder, or
 *
 *find the index.html file within your game install folder (on mac it is within the executable file (like a zip archive))
 *copy this file into the same folder as the file labeled "index.html" (on mac this is within the executable run file (like a zip archive))
 *then edit the index.html file, adding the line pasted below directly beneath the last line in the file that looks like "<script>lorem ipsum seit de amor</script>"
 *"<script type="text/javascript" src="OnlyBosses.js"></script>"
 *=============================================* */

/* eslint-disable max-classes-per-file */
/*:
 * @plugindesc V0
 * a mod for fear and hunger that makes all enemies bosses
 * @author Mattie
 */

(() => {
	/** =======================
     *
     *     Config
     *
     *========================* */
	// toggle these on or off for which bosses you want in the pool of bosses
	const includeGrogoroth = true;
	const includeSylvian = false;
	const includeGriffith = false;
	const includeGohaf = false;

	// if you want to add more troops to be included put their id in here;
	const baseIncludedTroops = [];

	if (includeGohaf) {
		baseIncludedTroops.push(130);
	}
	if (includeGrogoroth) {
		baseIncludedTroops.push(170);
	}
	if (includeSylvian) {
		baseIncludedTroops.push(210);
	}
	if (includeGriffith) {
		baseIncludedTroops.push(126);
	}

	/** =====================================
     *       END OF CONFIG SECTION
     * !      Below this is code !
     *
     *
     *======================================* */
	// override battle processing cmd
	Game_Interpreter.prototype.command301 = function () {
		if (!$gameParty.inBattle()) {
			var troopId = baseIncludedTroops[randBetween(0, baseIncludedTroops.length - 1)];
			troopId = BattleManager.setup(troopId, this._params[2], this._params[3]);
			BattleManager.setEventCallback((n) => {
				this._branch[this._indent] = n;
			});
			$gamePlayer.makeEncounterCount();
			SceneManager.push(Scene_Battle);
		}
		return true;
	};

	/**
     * @description get a random number between inclusive min and max
     * @param {*} min inclusive min
     * @param {*} max inclusive max
     * @returns {int}
     */
	let randBetween = function (min, max) {
		return min + Math.floor(Math.random() * (max - min + 1));
	};
})();
