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
	function updateHpOfEnemy(enemyId, scaler = 10) {
		if (!$dataEnemies[enemyId].scaled) {
			$dataEnemies[enemyId].params[0] *= scaler;
			$dataEnemies[enemyId].scaled = true;
		}
	}

	// override reserve transfer to also store its data in our obj
	const base = Game_Troop.prototype.setup;
	Game_Troop.prototype.setup = function (troopId) {
		base.call(this, troopId);
		$gameTroop._enemies.forEach((enemy) => {
			enemy._hp *= 10;
			enemy._baseParamCache *= 10;
		});
	};
})();
