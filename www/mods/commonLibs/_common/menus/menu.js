/**
 * @namespace MATTIE.menus
 * @description a wrapper class for transitioning and switching between scenes
 */
MATTIE.menus = MATTIE.menus || {};

/**
 * @namespace MATTIE.windows
 * @description all additional windows added by the modding api
*/
MATTIE.windows = MATTIE.windows || {};

/**
 * @namespace MATTIE.scenes
 * @description all additional scenes added by the modding api
*/
MATTIE.scenes = MATTIE.scenes || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};

/** return to main menu */
MATTIE.menus.toMainMenu = function () {
	SceneManager.goto(Scene_Title);
};

/** go to mod scene */
MATTIE.menus.toModMenu = function () {
	SceneManager.push(MATTIE.scenes.modLoader);
};

/** go to decrypt scene */
MATTIE.menus.toDecryptMenu = function () {
	SceneManager.push(MATTIE.scenes.decrypter);
};

/** go to load scene */
MATTIE.menus.toLoadMenu = function () {
	SceneManager.push(Scene_Load);
};

/** go to new game menu */
MATTIE.menus.toNewMenu = function () {
	DataManager.setupNewGame();
	SceneManager.push(Scene_Map);
};

/**
 * load a save id and then go to the map
 */
MATTIE.menus.loadGameAndGoTo = function (id) {
	DataManager.loadGame(id);
	$gameSystem.onAfterLoad();
	SceneManager.goto(Scene_Map);
};
