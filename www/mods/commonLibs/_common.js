var MATTIE = MATTIE || {};
MATTIE.menus = MATTIE.menus || {};
MATTIE.windows = MATTIE.windows || {};
MATTIE.scenes = MATTIE.scenes || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};
MATTIE.modLoader = MATTIE.modLoader || {};
MATTIE.menus.mainMenu = MATTIE.menus.mainMenu || {};
MATTIE.global = MATTIE.global || {};
MATTIE.global.version = 1;
MATTIE.GameInfo = {};
MATTIE.GameInfo.getDifficulty = (data = $gameSwitches) => {
	let difficulty = 'Fear & Hunger';
	if (MATTIE.GameInfo.isHardMode(data)) { // Hard mode
		difficulty = 'Hard Mode'; // funnier name: "Trepidation & Famine"
	} else if (MATTIE.GameInfo.isTerrorAndStarvation(data)) { // terror and starvation
		difficulty = 'Terror And Starvation';
	}
	return difficulty;
};
MATTIE.GameInfo.getCharName = (data = $gameParty) => data.menuActor()._name;
MATTIE.GameInfo.isHardMode = (data = $gameSwitches) => data._data[2190] === true;
MATTIE.GameInfo.isTerrorAndStarvation = (data = $gameSwitches) => (!data._data[2190] && data._data[3153] === true);

/**
 * @description test
 */
class CommonMod {
	constructor() {
		this.status = true;
		this.name = 'commonMod';
		this.params = {};
		this.loaded = false;
	}

	setLoaded(loaded) {
		this.loaded = loaded;
	}

	setStatus(status) {
		this.status = status;
	}

	setName(name) {
		this.name = name;
	}

	setParams(params) {
		this.params = params;
	}

	addParam(key, val) {
		this.params[key] = val;
	}

	register(cb) {
		cb();
	}
}

// --UTIL--
function updateKeys(keys, name = '') {
	Object.keys(keys).forEach((key) => {
		Input.keyMapper[key.toUpperCase().charCodeAt(0)] = key; // add our key to the list of watched keys
	});
}

function updateKey(key, name = '') {
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
 *
 * @param {int} scope
 * -2 = in dev mode
 * -1 = never
 * 0 = global
 * 1 = on scene_map
 * 2 = on scene_battle
 * 3 = on scene_menu
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
	case -2:
		return MATTIE.isDev;
	default:
		return false;
	}
};

const keys = {};
let i = 128;
/**
 *
 * @param {*} key (optional) always bind to this key on boot
 * @param {*} cb the call back to run
 * @param {*} name the name of this command
 * @param {*} scope the scope of this command
 * @param {*} wasdDefualt the default key in wasd layout
 * @param {*} defaultKey the default key in defualt layout
 */
Input.addKeyBind = function (key, cb, name = '', scope = 0, wasdDefualt = null, defaultKey = null) {
	if (typeof key === 'number') key = String.fromCharCode(key);

	if (typeof defaultKey === 'number') key = String.fromCharCode(defaultKey);
	if (!key) key = String.fromCharCode(i);

	// setup default keybinds
	if (wasdDefualt) {
		if (typeof wasdDefualt !== 'number') {
			ConfigManager.wasdMap[wasdDefualt.toUpperCase().charCodeAt(0)] = wasdDefualt;
		} else {
			ConfigManager.wasdMap[wasdDefualt] = String.fromCharCode(wasdDefualt);
		}
	}
	if (defaultKey) {
		if (typeof defaultKey !== 'number') {
			ConfigManager.defaultMap[defaultKey.toUpperCase().charCodeAt(0)] = defaultKey;
		} else {
			ConfigManager.defaultMap[defaultKey] = String.fromCharCode(defaultKey);
		}
	}

	if (name != '') {
		const tempFunc = Window_KeyConfig.prototype.actionKey;
		const tempFunc2 = Window_KeyAction.prototype.makeCommandList;
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
	i++;

	keys[name] = {
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
		const { key } = obj;
		const { cb } = obj;
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
	MATTIE_RPG.Game_Player_PerformTransfer.call(this);
};

/** @description check if the spot is passible in any direction */
/** @param {Game_Event} event */
MATTIE.isPassableAnyDir = function (event) {
	const dirs = [2, 4, 6, 8]; // dir 4 dirsections
	for (let index = 0; index < dirs.length; index++) {
		const dir = dirs[index];
		if (event.canPass(event.x, event.y, dir)) return true;
	}
	return false;
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
