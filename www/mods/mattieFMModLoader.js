/*:
 * @plugindesc V0
 * a mod for fear and hunger
 * @author Mattie
 *
 *
 *
 * @param modName
 * @desc the name of the mod to load
 * @text mod name
 * @type string
 * @default testMod
 */

// -----------------------------------------------------------------------------\\
// ModManager
// -----------------------------------------------------------------------------\\

/**
 * By default mod's cannot load anything outside of their folder, all dependencies must be included within the mods folder.
 */

var MATTIE_ModManager = MATTIE_ModManager || {};
/** @global */
var MATTIE = MATTIE || {};
var MATTIE_RPG = MATTIE_RPG || {};

MATTIE.isDev = MATTIE.isDev || false;

MATTIE.global = MATTIE.global || {};
MATTIE.menus = MATTIE.menus || {};
MATTIE.windows = MATTIE.windows || {};
MATTIE.scenes = MATTIE.scenes || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};
MATTIE.menus.mainMenu = MATTIE.menus.mainMenu || {};

//----------------------------------------------------------------
// Plugin Manager
//----------------------------------------------------------------

//----------------------------------------------------------------
// Plugin Manager
//----------------------------------------------------------------

/**
 * @description the plugin manager loadscript function, this will load a script into the DOM
 * @param {*} plugins
 * @returns {Promise}
 */
PluginManager.loadScript = function (name) {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (res) => {
		await MATTIE.global.checkGameVersion();
		const url = this._path + name;
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;
		script.async = false;
		script.onerror = this.onError.bind(this);
		script._url = url;
		script.addEventListener('load', (ev) => {
			res();
		});
		document.body.appendChild(script);
	});
};
/**
 * @description the setup function for plugins, this does not matter right now. But later when we want to optimize
 * and override plugins that did things privately Cough Cough TarraxLighting, we can use this
 * @param {*} plugins
 * @returns {Promise} all promises
 */
PluginManager.setup = function (plugins) {
	const promises = [];
	plugins.forEach(function (plugin) {
		if (plugin.status && !this._scripts.contains(plugin.name)) {
			if (!MATTIE.ignoredPlugins().includes(plugin.name)) { // this does not work as we load after the plugins
				this.setParameters(plugin.name, plugin.parameters);
				promises.push(this.loadScript(`${plugin.name}.js`));
				this._scripts.push(plugin.name);
			}
		}
	}, this);
	return Promise.all(promises);
};
/**
 * @description we override the load database function to update our game version dependant variables
 */
MATTIE.DataManagerLoaddatabase = DataManager.loadDatabase;
DataManager.loadDatabase = function () {
	return new Promise((res) => {
		MATTIE.DataManagerLoaddatabase.call(this);
		const int = setInterval(() => {
			if (DataManager.isDatabaseLoaded()) {
				if (MATTIE.global) {
					if (MATTIE.static) {
						MATTIE.global.checkGameVersion();
						MATTIE.static.update();
					}
				}
				clearInterval(int);
				res();
			}
		}, 50);
	});
};

/**
 * @description a function that will return a promise, waiting till the database is loaded
 */
DataManager.waitTillDatabaseLoaded = function () {
	return new Promise((res) => {
		const int = setInterval(() => {
			if (DataManager.isDatabaseLoaded()) {
				clearInterval(int);
				res();
			}
		}, 50);
	});
};

//----------------------------------------------------------------
// Mod Manager
//----------------------------------------------------------------
/**
 * @description the main mod manager that handles loading and unloading all mods
 */
class ModManager {
	constructor(path) {
		Object.assign(this, PluginManager);
		this._path = path;
		this._realMods = [];
		this._mods = [];
		this._modsDict = {};
		this.forceModdedSaves = false;
		this.forceVanillaSaves = false;
	}

	/**
     *
     * @param {*} name the name of the mod
     * @returns {boolean} is the mod enabled
     */
	checkMod(name) {
		const allMods = this.getAllMods();
		for (let index = 0; index < allMods.length; index++) {
			const element = allMods[index];
			if (element.name == name) return true;
		}
		return false;
	}

	/**
     * @description get mod info about a mod
     * @param {*} path path to the file
     * @param {*} modName the name of the file
     * @returns a modinfo obj
     */
	getModInfo(path, modName) {
		const fs = require('fs');
		if (!modName.endsWith('.json')) modName += '.json';
		const modInfoPath = path + modName;
		const modInfoData = fs.readFileSync(modInfoPath);
		const modInfo = JSON.parse(modInfoData);
		return modInfo;
	}

	/**
     * @description get the path of the mods folder, checking if we are in dev or prod mode and adding the appropriate prefix
     * @returns {string} proper path
     * */
	getPath() {
		const fs = require('fs');
		let path;
		let mode;
		try {
			fs.readdirSync(`www/${this._path}`); // dist mode
			mode = 'dist';
		} catch (error) {
			mode = 'dev';
		}
		if (mode === 'dist') {
			path = `www/${this._path}`;
		} else {
			path = this._path;
		}
		return path;
	}

	/**
     * @description get a list of all files in the mods dir
     * @returns {String[]} an array of all file names in the mods folder
     */
	getModsFolder() {
		const arr = [];
		const fs = require('fs');

		const readMods = fs.readdirSync(this.getPath());

		readMods.forEach((modName) => { // load _mods first
			arr.push(modName);
		});
		return arr;
	}

	/**
     * @description write a default json file for the mod name
     * @param {string} modName the file name to write not including .json
     */
	generateDefaultJSONForMod(modName) {
		const fs = require('fs');
		const path = this.getPath();
		const obj = {};
		obj.name = modName;
		obj.status = false;
		obj.parameters = {};
		obj.danger = true;
		fs.writeFileSync(`${path + modName}.json`, JSON.stringify(obj));
	}

	/** @description generate the default json file for all mods without jsons */
	generateDefaultJsonForModsWithoutJsons() {
		const modsWithoutJson = this.getModsWithoutJson();
		modsWithoutJson.forEach((modName) => {
			this.generateDefaultJSONForMod(modName);
		});
	}

	/** @description find all files in the mods folder that do not have a json file attached to them */
	getModsWithoutJson() {
		const modsWithJson = this.getAllMods().map((mod) => mod.name);
		const modsWithoutJson = [];
		this.getModsFolder().forEach((modName) => {
			if (modName.endsWith('.js') && !modName.includes('mattieFMModLoader')) {
				modName = modName.replace('.js', '');
				if (!modsWithJson.includes(modName)) {
					modsWithoutJson.push(modName);
				}
			}
		});
		return modsWithoutJson;
	}

	/**
     * @description Add a mod to the list of mods that setup will initialize. All mod dependencies (Defined in its mod.json) will be loaded before that mod.
     * @param {*} path the path to the folder
     * @param {*} modName the name of the json file containing the mod info
     */
	parseMod(path, modName) {
		const fs = require('fs');

		const modInfoPath = path + modName;
		const modInfoData = fs.readFileSync(modInfoPath);
		const modInfo = JSON.parse(modInfoData);
		if (modInfo.dependencies && this.getModActive(modInfo.name)) { // load all dependencies before mod
			modInfo.dependencies.forEach((dep) => {
				this.addModEntry(dep);
			});
		}
		if (modInfo.name) {
			this.addModEntry(modInfo.name, this.getModActive(modInfo.name), modInfo.danger, modInfo.parameters);
		} else {
			this.addModEntry(modName);
		}
	}

	/**
     * @description get a list of all active real mods (not dependencies) that are marked as dangerous.
     * @returns a list of all real danger mods
     */
	getActiveRealDangerMods() {
		const arr = [];
		const currentModsData = this.getAllMods();
		currentModsData.forEach((mod) => {
			if (this.getModActive(mod.name) && mod.name[0] != '_' && mod.danger == true) arr.push(mod);
		});
		return arr;
	}

	getModActive(modName) {
		modName = modName.replace('.json', '');
		const userDataMod = MATTIE.DataManager.global.get(`${modName}_Active`);
		const path = this.getPath();
		const dataInfo = this.getModInfo(path, modName);
		return typeof userDataMod !== 'undefined' ? userDataMod : dataInfo.status;
	}

	setModActive(modName, bool) {
		modName = modName.replace('.json', '');
		MATTIE.DataManager.global.set(`${modName}_Active`, bool);
	}

	/**
     * @description get a list of all mods, not including preReqs
     * @returns {array} mod info array
    */
	getActiveRealMods() {
		const arr = [];
		const currentModsData = this.getAllMods();
		currentModsData.forEach((mod) => {
			if (this.getModActive(mod.name) && mod.name[0] != '_') arr.push(mod);
		});
		return arr;
	}

	/** @description check if any dangerous mods are enabled */
	checkSaveDanger() {
		return this.getActiveRealDangerMods().length > 0;
	}

	/** @description switch the value of the force modded saves option */
	switchForceModdedSaves() {
		this.forceModdedSaves = !MATTIE.DataManager.global.get('forceModded');
		MATTIE.DataManager.global.set('forceModded', this.forceModdedSaves);
		this.forceVanillaSaves = false;
	}

	/** @description switch the value of the force vanilla saves option */
	switchForceVanillaSaves() {
		this.forceModdedSaves = false;

		this.forceVanillaSaves = !MATTIE.DataManager.global.get('forceVanilla');
		MATTIE.DataManager.global.set('forceVanilla', this.forceVanillaSaves);
	}

	/** @description check if the force modded saves option is set to true */
	checkForceModdedSaves() {
		return MATTIE.DataManager.global.get('forceModded');
	}

	/** @description check if the force vanilla saves option is set to true */
	checkForceVanillaSaves() {
		return MATTIE.DataManager.global.get('forceVanilla');
	}

	/** @description check if no mods are enabled */
	checkVanilla() {
		return this.getActiveRealMods().length === 0;
	}

	/** @description check if any mods are enabled */
	checkModded() {
		return this.getActiveRealMods().length > 0;
	}

	/**
     * @description toggle off all mods
     */
	setVanilla() {
		const currentModsData = this.getAllMods();
		currentModsData.forEach((mod) => {
			if (this.getModActive(mod.name)) this.switchStatusOfMod(mod.name);
		});
	}

	/**
     * @description toggle off all mods that are dangerous
     */
	setNonDanger() {
		const currentModsData = this.getAllMods();
		currentModsData.forEach((mod) => {
			if (this.getModActive(mod.name) && mod.danger == true) {
				this.switchStatusOfMod(mod.name);
			}
		});
		if (this.forceModdedSaves) this.switchForceModdedSaves();
	}

	/**
     * @description check if any mods have changed their status
     * @returns {boolean}
     * */
	checkModsChanged() {
		const keys = Object.keys(this._modsDict);
		for (let index = 0; index < keys.length; index++) {
			const mod = this._modsDict[keys[index]];
			if (mod.status != mod.lastStatus) {
				return true;
			}
		}
		return false;
	}

	/**
     * @description reload the game if changes were made to the mod jsons
     */
	reloadIfChangedGame() {
		if (this.checkModsChanged()) this.reloadGame();
	}

	/**
     * @description reload the window
     */
	reloadGame() {
		location.reload();
	}

	/**
     * @description disable the s
     * @param {String} modName the mod name to change
     * @param {boolean} bool whether to set the mod as enabled or disabled
     */
	setEnabled(modName, bool) {
		this._modsDict[modName].lastStatus = this._modsDict[modName].status;
		this._modsDict[modName].status = bool;
		if (!modName.includes('.json')) modName += '.json';

		if (!bool) { // if a mod is being disabled call its offload script
			this.callOnOffloadModScript(modName.replace('.json', ''));
		}
		if (bool) {
			this.callOnLoadModScript(modName.replace('.json', ''));
		}

		this.setModActive(modName, bool);
	}

	switchStatusOfMod(modName) {
		const path = this.getPath();
		const dataInfo = this.getModInfo(path, modName);
		this.setEnabled(modName, !this.getModActive(modName));
	}

	/**
     * @description this will check the _modsDict and see if this mod has an offload script
     * @param {string} modName the name of the mod to call the off load script of
     */
	callOnOffloadModScript(modName) {
		if (this._modsDict[modName]) {
			const onOffloadScriptExists = !!this._modsDict[modName].offloadScript;
			if (onOffloadScriptExists) this._modsDict[modName].offloadScript();
		}
	}

	/**
     * @description this will check the _modsDict and see if this mod has an offload script
     * @param {string} modName the name of the mod to call the off load script of
     */
	callOnLoadModScript(modName) {
		if (this._modsDict[modName]) {
			const onOffloadScriptExists = !!this._modsDict[modName].onloadScript;
			if (onOffloadScriptExists) this._modsDict[modName].onloadScript();
		}
	}

	getAllMods() {
		const fs = require('fs');
		const arr = [];
		const path = this.getPath();
		const readMods = fs.readdirSync(path);

		readMods.forEach((modName) => { // load _mods first
			if (modName.includes('.json')) {
				const name = modName.replace('.json', '').replace('_', '');
				const obj = {};
				const dataInfo = this.getModInfo(path, modName);
				arr.push(dataInfo);
			}
		});
		return arr;
	}

	/**
     * @description add a mod entry to the list of mods
     * @param {*} name the name of the mod
     * @param {*} status whether the mod is enabled
     * @param {*} danger is the mod dangerous
     * @param {*} params any params of the mod
     */
	addModEntry(name, status = true, danger = false, params = {}) {
		const mod = {};
		mod.status = status;
		mod.lastStatus = status;
		mod.name = name;
		mod.parameters = params;
		mod.danger = danger;
		this._mods.push(mod);
		this._modsDict[mod.name] = mod;
	}

	findModIndexByName(name) {
		const index = -1;
		for (let i = 0; i < this._mods.length; i++) {
			const mod = this._mods[i];
			if (mod.name === name) return i;
		}
		return index;
	}

	/**
     * @description add a offload script that will be called when a mod is deactivated to a mod
     * @param {*} name
     * @param {*} cb
     */
	addOffloadScriptToMod(name, cb) {
		this._modsDict[name].offloadScript = cb;
	}

	/**
     * @description add a offload script that will be called when a mod is activated to a mod
     * @param {*} name
     * @param {*} cb
     */
	addOnloadScriptToMod(name, cb) {
		this._modsDict[name].onloadScript = cb;
	}

	/**
     * @description disable all mods and reload the game as vanilla
     */
	disableAndReload() {
		this.setVanilla();
		this.reloadGame();
	}

	/**
     * @description finds all mod in a folder
     * @param {String} path the path of the folder inside www/ to load mods from
     * @returns a list of mods
     */
	parseMods(path = this._path) {
		const fs = require('fs');
		this._path = path;
		path = this.getPath();
		const readMods = fs.readdirSync(path);

		readMods.forEach((modName) => { // load _mods first
			if (modName[0] === '_' && modName.includes('.json')) {
				this.parseMod(path, modName);
			}
		});

		readMods.forEach((modName) => { // load all other mods second
			try {
				if (modName.includes('.json') && modName[0] != '_') {
					this.parseMod(path, modName);
				}
			} catch (error) {
				throw new Error(`an error occurred while loading the mod:\n${error}`);
			}
		});
		return this._mods;
	}

	/**
     * @description load all mods from a list that are not already loaded
     * @extends PluginManager.prototype.loadScript
     * @param {*} mods a list of mods to load
     * @returns a promise that will resolve once all scripts are loaded
     */
	setup(mods) {
		const promises = [];
		mods.forEach((mod) => {
			if (this.getModActive(mod.name) && !this._mods.contains(mod.name)) {
				this.setParameters(mod.name, mod.parameters);
				promises.push(this.loadScript(mod.name));
				this._mods.push(mod.name);
			}
		});
		return Promise.all(promises);
	}
}

/**
 * @description load the mod manager
 */
MATTIE_ModManager.init = async function () {
	await DataManager.loadDatabase();
	await PluginManager.setup($plugins);

	const defaultPath = PluginManager._path;
	const path = 'mods/';
	const commonLibsPath = `${path}commonLibs/`;
	const modManager = new ModManager(path);
	MATTIE_ModManager.modManager = modManager;
	modManager.generateDefaultJsonForModsWithoutJsons();
	const commonModManager = new ModManager(commonLibsPath);
	const commonMods = modManager.parseMods(commonLibsPath);

	new Promise((res) => {
		PluginManager._path = commonLibsPath;
		commonModManager.setup(commonMods).then(() => {
			// common mods loaded
			PluginManager._path = defaultPath;
			MATTIE.static.update();
			res();
		});
	}).then(() => {
		PluginManager._path = path;
		const mods = modManager.parseMods(path); // fs is in a different root dir so it needs this.
		console.info(mods);
		modManager.setup(mods).then(() => { // all mods loaded after plugins
			SceneManager.goto(Scene_Title);
			MATTIE.msgAPI.footerMsg('Mod loader successfully initialized');
			PluginManager._path = defaultPath;
		});
	});
};

//----------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------

/**
 * @global
 * @description override the scene manager error functions with our own error screen instead
 */
MATTIE_ModManager.overrideErrorLoggers = function () {
	SceneManager.onError = function (e) {
		MATTIE.onError.call(this, e);
	};

	SceneManager.catchException = function (e) {
		MATTIE.onError.call(this, e);
	};
};

Graphics.clearCanvasFilter = function () {
	if (this._canvas) {
		this._canvas.style.opacity = 1;
		this._canvas.style.filter = null;
		this._canvas.style.webkitFilter = null;
	}
};
Graphics.hideError = function () {
	this._errorShowed = false;
	this.eraseLoadingError();
	this.clearCanvasFilter();
};

/**
 * @description for the purpose of matching our error style to that of termina I have used Olivia's formatting below
 * variables names were changed to match coding convention of my modloader not to appear as though this is my code. That said this is like
 * borrowing a color.
 * @credit Olivia AntiPlayerStress
 */
MATTIE_RPG.Graphics_updateErrorPrinter = Graphics._updateErrorPrinter;
Graphics._updateErrorPrinter = function () {
	MATTIE_RPG.Graphics_updateErrorPrinter.call(this);
	this._errorPrinter.height = this._height * 0.5;
	this._errorPrinter.style.textAlign = 'left';
	this._centerElement(this._errorPrinter);
};

MATTIE.suppressingAllErrors = false;
MATTIE.onError = function (e) {
	if (!e.message.includes('greenworks-win32')) {
		if (!MATTIE.suppressingAllErrors) {
			console.error(e);
			console.error(e.message);
			console.error(e.filename, e.lineno);
			try {
				this.stop();
				const color = '#f5f3b0';
				let errorText = '';
				errorText += '<font color="Yellow" size=5>The game has encountered an error, please report this.<br></font>';
				// eslint-disable-next-line max-len
				errorText += '<br> If you are reporting a bug, include this screen with the error and what mod/mods you were using and when you were doing when the bug occurred. <br> Thanks <br> -Mattie<br>';

				errorText += '<br><font color="Yellow" size=5>Error<br></font>';
				if (e.stack) { errorText += e.stack.split('\n').join('<br>'); }
				if (e.message) { errorText += e.message; }
				if (e.lineno) { errorText += `<br>at Line:${e.lineno}`; }
				if (e.fileName) { errorText += `<br>File:${e.fileName}`; }
				if (e.name) { errorText += `<br>name:${e.name}`; }

				errorText += `<font color=${color}><br><br>Press 'F7' or 'escape' to try to continue despite this error. <br></font>`;
				errorText += `<font color=${color}>Press 'F9' to suppress all future errors. (be carful using this)<br></font>`;
				errorText += `<font color=${color}>Press 'F6' To reboot without mods.<br></font>`;
				errorText += `<font color=${color}>Press 'F5' to reboot with mods. <br></font>`;

				Graphics.printError('', errorText);
				AudioManager.stopAll();
				const cb = ((key) => {
					if (key.key === 'F6') {
						MATTIE_ModManager.modManager.disableAndReload();
						MATTIE_ModManager.modManager.reloadGame();
					} else if (key.key === 'F7' || key.key === 'Escape') {
						document.removeEventListener('keydown', cb, false);
						Graphics.hideError();
						this.resume();
					} else if (key.key === 'F5') {
						MATTIE_ModManager.modManager.reloadGame();
					} else if (key.key === 'F9') {
						MATTIE.suppressingAllErrors = true;
						document.removeEventListener('keydown', cb, false);
						Graphics.hideError();
						this.resume();
					}
				});
				document.addEventListener('keydown', cb, false);
			} catch (e2) {
				Graphics.printError('Error', `${e}<br>${e2.message}${e2.stack}<br>\nFUBAR`);
			}
		}
	}
};

/**
 * @description load the mod manager
 */
MATTIE_ModManager.init = async function () {
	await DataManager.waitTillDatabaseLoaded();
	await PluginManager.setup($plugins).then(() => {});
	MATTIE.DataManager.onLoad();
	const defaultPath = PluginManager._path;
	const path = 'mods/';
	const commonLibsPath = `${path}commonLibs/`;
	const modManager = new ModManager(path);
	MATTIE_ModManager.modManager = modManager;
	modManager.generateDefaultJsonForModsWithoutJsons();
	const commonModManager = new ModManager(commonLibsPath);
	const commonMods = modManager.parseMods(commonLibsPath);

	new Promise((res) => {
		PluginManager._path = commonLibsPath;
		commonModManager.setup(commonMods).then(() => {
			// common mods loaded
			MATTIE_ModManager.overrideErrorLoggers();
			PluginManager._path = defaultPath;
			MATTIE.static.update();
			res();
		});
	}).then(() => {
		setTimeout(() => {
			PluginManager._path = path;
			const mods = modManager.parseMods(path); // fs is in a different root dir so it needs this.
			console.info(mods);
			modManager.setup(mods).then(() => { // all mods loaded after plugins
				SceneManager.goto(Scene_Title);
				MATTIE.msgAPI.footerMsg('Mod loader successfully initialized');
				PluginManager._path = defaultPath;
			}, 1000);
		});
	});
};

MATTIE_ModManager.overrideErrorLoggers();
setTimeout(() => {
	MATTIE_ModManager.init();
}, 1000);
