MATTIE.menus = MATTIE.menus || {};
MATTIE.windows = MATTIE.windows || {};
MATTIE.scenes = MATTIE.scenes || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};
MATTIE.modLoader = MATTIE.modLoader || {};
MATTIE.menus.mainMenu = MATTIE.menus.mainMenu || {};

/** @description the current version of the game, 1 if funger 2 if Terming */
MATTIE.global.version = 1;
/**
 * @namespace MATTIE.GameInfo
 * @description a namespace containing methods to get game info
 */
MATTIE.GameInfo = {};

/**
 * @description check what difficulty the game is in
 * @returns {string}
 * */
MATTIE.GameInfo.getDifficulty = (data = $gameSwitches) => {
	let difficulty = 'Fear & Hunger';
	if (MATTIE.GameInfo.isHardMode(data)) { // Hard mode
		difficulty = 'Hard Mode'; // funnier name: "Trepidation & Famine"
	} else if (MATTIE.GameInfo.isTerrorAndStarvation(data)) { // terror and starvation
		difficulty = 'Terror And Starvation';
	}
	return difficulty;
};
/**
 * @description provided with a same object get the menu actor's name
 * @param {Object} data
 * @returns {string} menu actor name
 */
MATTIE.GameInfo.getCharName = (data = $gameParty) => data.menuActor()._name;

/**
 * @description provided with a same object check if it is hardmode
 * @param {Object} data
 * @returns {boolean} is hardmode
 */
MATTIE.GameInfo.isHardMode = (data = $gameSwitches) => data._data[2190] === true;

/**
 * @description provided with a same object check if it is t&s
 * @param {Object} data
 * @returns {boolean} is t&s
 */
MATTIE.GameInfo.isTerrorAndStarvation = (data = $gameSwitches) => (!data._data[2190] && data._data[3153] === true);

// --UTIL--
function updateKeys(keys) {
	Object.keys(keys).forEach((key) => {
		Input.keyMapper[key.toUpperCase().charCodeAt(0)] = key; // add our key to the list of watched keys
	});
}

function updateKey(key) {
	if (key.includes('&')) {
		const keys = key.split('&');
		keys.forEach((element) => {
			Input.keyMapper[element.toUpperCase().charCodeAt(0)] = element; // add our key to the list of watched keys
		});
	} else {
		Input.keyMapper[key.toUpperCase().charCodeAt(0)] = key; // add our key to the list of watched keys
	}
}
/**
 * @namespace Input
 * @description the input object of RPG maker, note: only the added methods and functions will display in this documentation
 */

/**
 * @param {int} scope
 * -2 = in dev mode
 * -1 = never
 * 0 = global
 * 1 = on scene_map
 * 2 = on scene_battle
 * 3 = on scene_menu
 * 4 = not on scene_map
 */
Input.checkScope = function (scope) {
	switch (scope) {
	case -1:
		return false;
	case 0:
		return true;
	case 1:
		return SceneManager._scene instanceof Scene_Map;
	case 2:
		return SceneManager._scene instanceof Scene_Battle;
	case 3:
		return SceneManager._scene instanceof Scene_Menu;
	case 4:
		return !(SceneManager._scene instanceof Scene_Map);
	case -2:
		return MATTIE.isDev;
	default:
		return false;
	}
};

const keys = {};
let i = 128;

MATTIE_RPG.commandWasd = Scene_KeyConfig.prototype.commandWasd;
Scene_KeyConfig.prototype.commandWasd = function () {
	MATTIE_RPG.commandWasd.call(this);
	Object.keys(keys).forEach((name) => {
		const keyObj = keys[name];
		if (keyObj.wasdDefualt) { keyObj.key = keyObj.wasdDefualt; }
	});
};

MATTIE_RPG.commandDefualt = Scene_KeyConfig.prototype.commandDefault;
Scene_KeyConfig.prototype.commandDefault = function () {
	MATTIE_RPG.commandDefualt.call(this);
	Object.keys(keys).forEach((name) => {
		const keyObj = keys[name];
		if (keyObj.defaultKey) { keyObj.key = keyObj.defaultKey; }
	});
};

/**
 *
 * @param {string} key (optional) always bind to this key on boot
 * @param {Function} cb the call back to run
 * @param {string} name the name of this command
 * @param {int} scope the scope of this command
 * @param {string} wasdDefualt the default key in wasd layout
 * @param {string} defaultKey the default key in defualt layout
 */
Input.addKeyBind = function (key, cb, name = '', scope = 0, wasdDefualt = null, defaultKey = null, hidden = false) {
	if (typeof key === 'number') key = String.fromCharCode(key);
	if (typeof defaultKey === 'number') key = String.fromCharCode(defaultKey);
	if (!key) {
		if ((defaultKey && !Input.keyMapper[defaultKey.toUpperCase().charCodeAt(0)]
		|| (defaultKey && Input.keyMapper[defaultKey.toUpperCase().charCodeAt(0)] == defaultKey) && defaultKey != null) && !defaultKey.includes('&')) {
			key = defaultKey;
		} else {
			key = String.fromCharCode(i);
		}
	}

	// setup default keybinds
	if (wasdDefualt && !wasdDefualt.includes('&')) {
		if (typeof wasdDefualt !== 'number') {
			ConfigManager.wasdMap[wasdDefualt.toUpperCase().charCodeAt(0)] = wasdDefualt;
		} else {
			ConfigManager.wasdMap[wasdDefualt] = String.fromCharCode(wasdDefualt);
		}
	}
	if (defaultKey && !defaultKey.includes('&')) {
		if (typeof defaultKey !== 'number') {
			ConfigManager.defaultMap[defaultKey.toUpperCase().charCodeAt(0)] = defaultKey;
		} else {
			ConfigManager.defaultMap[defaultKey] = String.fromCharCode(defaultKey);
		}
	}

	if (name != '') {
		const tempFunc = Window_KeyConfig.prototype.actionKey;
		const tempFunc2 = Window_KeyAction.prototype.makeCommandList;

		if ((scope != -2 || MATTIE.isDev) && !hidden) {
			// this is so that keys can be rebound
			Window_KeyConfig.prototype.actionKey = function (action) {
				if (action === key || action == wasdDefualt || action == defaultKey) return name;
				return tempFunc.call(this, action);
			};
			// this is so that keys can be rebound
			Window_KeyAction.prototype.makeCommandList = function () {
				tempFunc2.call(this);
				this.addCommand(name, 'ok', true, key);
			};
		}
	}
	i++;

	keys[name] = {
		wasdDefualt,
		defaultKey,
		key,
		cb: () => { if (Input.checkScope(scope))cb(); },
	};
	updateKey(key, name);
};
MATTIE.Prev_Input_Update = Input.update;
Input.update = function () {
	MATTIE.Prev_Input_Update.call(this);
	Object.keys(keys).forEach((name) => {
		const obj = keys[name];
		let key = obj.key;
		const cb = obj.cb;
		if (typeof key === 'number') key = String.fromCharCode(key);
		if (key.contains('&')) {
			/** @type {any[]} */
			const combinedKeys = key.split('&');

			const pressed = (() => {
				for (let index = 0; index < combinedKeys.length - 1; index++) {
					const element = combinedKeys[index];
					if (!Input.isPressed(element)) return false;
				}
				return Input.isRepeated(combinedKeys[combinedKeys.length - 1]);
			})();
			if (pressed) {
				cb();
			}
		} else if (Input.isRepeated(key)) {
			cb();
		}
	});
};

this.forceModdedSaves = MATTIE.DataManager.global.get('forceModded');
this.forceVanillaSaves = MATTIE.DataManager.global.get('forceVanilla');
MATTIE.menus.mainMenu.addBtnToMainMenu(
	TextManager.Mods,
	TextManager.Mods,
	MATTIE.menus.toModMenu.bind(this),
);

// --ENGINE OVERRIDES--

// MATTIE_RPG.Game_Map_Setup = Game_Map.prototype.setup;
// Game_Map.prototype.setup = function(mapId) {
//     /** @description the last map that the player was on */
//     this._lastMapId = mapId;
//     console.log(this._lastMapId);
//     MATTIE_RPG.Game_Map_Setup.call(this, mapId)
// };

MATTIE_RPG.Game_Player_PerformTransfer = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function () {
	$gameMap._lastMapId = $gameMap.mapId();
	$gameMap._lastX = $gamePlayer.x;
	$gameMap._lastY = $gamePlayer.y;
	MATTIE_RPG.Game_Player_PerformTransfer.call(this);
};

/** @description check if the spot is passible in any direction */
/** @param {Game_Event} event */
MATTIE.isPassableAnyDir = function (event) {
	const dirs = [2, 4, 6, 8]; // dir 4 dirsections
	for (let index = 0; index < dirs.length; index++) {
		const dir = dirs[index];
		if (
			$gamePlayer.canPass(event.x, event.y, dir)
			&& $gamePlayer.isMapPassable(event.x, event.y, dir)
			&& !$gamePlayer.isCollided(event.x, event.y)
			&& $gameMap.isPassable(event.x, event.y, dir)
		) return true;
	}
	return false;
};

/** @description check if the spot is passible in any direction
 * @param {Game_Event} event
 * @param {int} x how many directions must this is passable in to return true
*/
MATTIE.isPassableXDirs = function (event, x) {
	let count = 0;
	const dirs = [2, 4, 6, 8]; // dir 4 dirsections
	for (let index = 0; index < dirs.length; index++) {
		const dir = dirs[index];
		if (
			$gamePlayer.canPass(event.x, event.y, dir)
			&& $gamePlayer.isMapPassable(event.x, event.y, dir)
			&& !$gamePlayer.isCollided(event.x, event.y)
			&& $gameMap.isPassable(event.x, event.y, dir)
		) count++;
	}
	return count >= x;
};

/**
 * @description get the last map id
 * @returns the id of the last map
 */
Game_Map.prototype.lastMapId = function () {
	return this._lastMapId;
};
/**
 * @description format the key of a self swtich id
 * @param {*} mapId the map id that this event is on
 * @param {*} eventId the event id of this event
 * @param {*} letter the letter of this switch
 * @returns {string[]}
 */
Game_SelfSwitches.prototype.formatKey = function (mapId, eventId, letter) {
	const key = [mapId, eventId, letter];
	return key;
};
