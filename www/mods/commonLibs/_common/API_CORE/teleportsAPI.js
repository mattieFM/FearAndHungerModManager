/** @namespace MATTIE.tpAPI an api containing all tps for funger 1 and 2 */
MATTIE.tpAPI = {};

/**
 * @description tp the player to a location
 * @param {int} id mapid
 * @param {int} x x cord
 * @param {int} y y cord
 * @param {bool} goto whether the screen should change to the game map or not
 */
MATTIE.tpAPI.genericTp = function (id, x, y, goto = true) {
	if (goto) { SceneManager.goto(Scene_Map); }
	// teleport the player to the fortress
	$gamePlayer.reserveTransfer(id, x, y, 0, 2);
	setTimeout(() => {
		$gamePlayer.performTransfer();
	}, 500);
};

// Game-specific teleport functions (F&H1 and Termina) are registered on MATTIE.tpAPI
// by their respective game modules via hooks.onStaticUpdate.
// See: www/mods/game-modules/fearAndHunger1.js and termina.js
