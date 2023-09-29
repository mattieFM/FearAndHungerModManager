/* eslint-disable max-classes-per-file */
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
// Asset Class
//----------------------------------------------------------------

/**
 * @description assets are used to handle copying assets from mods into the game files to override or extend default
 * assets. For instance you could copy an image from your mods data folder to the pictures folder.
 */
class Asset {
	/**
	 * @description Create a new asset.
	 * @param {string} sourcePath the path from the working dir of the storage manager to the file
	 * @param {string} destinationPath the path from the working dir of the storage manager to the destination of the file
	 */
	constructor(sourcePath, destinationPath, fileName, type) {
		/**
		 * @description the name of the file within the path including extension
		 * @type {string}
		 */
		this.fileName = fileName;

		/**
		 * @description The path of the source file of the asset.
		 * note that this is the path from within the www/ folder
		 * @type {string}
		 */
		this.sourcePath = sourcePath;

		/**
		 * @description The path that the source file will be copied to
		 * note that this is the path from within the www/ folder
		 * @type {string}
		 */
		this.destinationPath = destinationPath;

		/**
		 * @description whether to override any existing files automatically
		 * @default true
		 * */
		this._force = true;

		/**
		 * @description the type of this asset
		 * @type {Asset.TYPES}
		 */
		this.type = type;

		/**
		 * @description if this asset is an image this is its type of image
		 * @type {Asset.IMG_FOLDERS}
		 */
		this.imgType = null;

		if (this.type === Asset.TYPES.IMG) {
			this.imgType = Asset.IMG_FOLDERS[this.destinationPath];
			if (!this.imgType) this.imgType = Asset.IMG_FOLDERS.PICTURES;
		}
	}

	/**
	 * @description check if this asset should forcibly overwrite any conflicting files
	 * @returns {boolean}
	 */
	shouldForce() {
		return this._force;
	}

	/**
	 * @description Load an image asset into game files
	 * @param {boolean} force whether to force overwrite the img
	 */
	loadImage(force = false) {
		const fileExists = MATTIE.DataManager.addFileToImgFolder(this.sourcePath, `/${this.imgType}/`, this.fileName, this.fileName, force);
		if (fileExists && !force) {
			this.backupImage();
			this.loadImage(true);
		}
	}

	/**
	 * @description Create a backup for an existing image.
	 */
	backupImage() {
		MATTIE.DataManager.addFileToImgFolder(`/img/${this.imgType}/`, `/${this.imgType}/`, this.fileName, `_${this.fileName}`);
	}

	/**
	 * @description Restores image from backup.
	 */
	restoreBackup() {
		MATTIE.DataManager.addFileToImgFolder(`/img/${this.imgType}/`, `/${this.imgType}/`, `_${this.fileName}`, this.fileName, true, true);
	}

	/**
	 * @description load this asset into game files
	 */
	loadAsset() {
		switch (this.type) {
		case Asset.TYPES.IMG:
			this.loadImage();
			break;
		case Asset.TYPES.AUDIO:

			break;
		case Asset.TYPES.JS:

			break;
		case Asset.TYPES.DATA:

			break;

		default:
			break;
		}
	}

	/**
	 * @description unload this asset from game files
	 * */
	unloadAsset() {
		try {
			switch (this.type) {
			case Asset.TYPES.IMG:
				this.restoreBackup();
				break;
			case Asset.TYPES.AUDIO:

				break;
			case Asset.TYPES.JS:

				break;
			case Asset.TYPES.DATA:

				break;

			default:
				break;
			}
		} catch (error) {
			console.warn('failed to restore backup of file');
		}
	}
}

Asset.TYPES = {
	DATA: 'data',
	IMG: 'img',
	JS: 'js',
	AUDIO: 'audio',
};

Asset.IMG_FOLDERS = {
	ANIMATIONS: 'animations',
	BATTLEBACKS_1: 'battlebacks1',
	BATTLEBACKS_2: 'battlebacks2',
	CHARACTERS: 'characters',
	ENEMIES: 'enemies',
	FACES: 'faces',
	FOGS: 'fogs',
	PARALLAXES: 'parallaxes',
	PICTURES: 'pictures',
	SV_ACTORS: 'sv_actors',
	SV_ENEMIES: 'sv_enemies',
	SYSTEM: 'system',
	TILESETS: 'tilesets',
	TITLES_1: 'titles1',
	TITLES_2: 'titles2',
};
//----------------------------------------------------------------
// Mod Class
//----------------------------------------------------------------

class Mod {
	/**
	 *
	 * @param {String} name the unique name of this mod
	 * @param {boolean} isDependency is this mod a dependency of another mod
	 */
	constructor(name, isDependency = false) {
		/**
		 * @description the name of this mod MUST BE UNQUIET
		 * @type {string}
		 * */
		this.name = name;

		/**
		 * @description if this mod is a dependency of another mod or not
		 * @type {boolean}
		 * @default false
		 */
		this.isDependency = false;

		/**
		 * @description the default status of this mod, should it be automatically enabled or not
		 * @default false
		 * @type {boolean}
		 * */
		this.status = false;

		/**
		 * @description the last status of this mod
		 * @default false
		 * @type {boolean}
		 */
		this.lastStatus = false;

		/**
		 * @description any script dependencies this mod has in the form of paths to the dependency
		 * @type {string[]}
		 * @default {};
		 */
		this.dependencies = [];

		/**
		 * @description any script dependencies this mod has in the form of paths to the dependency
		 * @type {Asset[]}
		 * @default {};
		 */
		this.assets = [];

		/**
		 * @description any user configurable parameters this mod has
		 * @type {{}}
		 * @default {};
		 */
		this.params = {};

		/**
		 * @description the name of this mod that should be displayed to the user
		 * @default this.name
		 * @type {string}
		 */
		this.displayName = this.name;

		/**
		 * @description the function to call when this mod loads
		 * @type {Function|null}
		 * @default null
		 */
		this.onloadScript = null;

		/**
		 * @description the function to call when this mod is offloaded
		 * @type {Function|null}
		 * @default null
		 */
		this.offloadScript = null;

		this.name = name;
		this.displayName = name;
		this.status = false;
		this.lastStatus = false;
		this.params = {};
		this.dependencies = [];
	}

	/**
	 * @description add a callback to call when this mod is unloaded/disabled
	 * @param {Function} cb the call back to be called
	 */
	addToOffLoad(cb) {
		if (!this.offloadScript) {
			this.offloadScript = cb;
		} else {
			const oldFunc = this.offloadScript;
			this.offloadScript = () => {
				oldFunc();
				cb();
			};
		}
	}

	/**
	 * @description add a callback to call when this mod is loaded
	 * @param {Function} cb the call back to be called
	 */
	addToOnLoad(cb) {
		if (!this.onloadScript) {
			this.onloadScript = cb;
		} else {
			const oldFunc = this.onloadScript;
			this.offloadScript = () => {
				oldFunc();
				cb();
			};
		}
	}

	/**
	 * @description change the status of this mod
	 * @param {bool} bool whether the mod is enabled or not
	 */
	setStatus(bool) {
		this.lastStatus = this.status;
		this.status = bool;
	}

	/** @description check if this mod is enabled or not */
	getStatus() {
		return this.status || this.isDependency;
	}

	/**
	 * @description check if current status and last status are different
	 * @returns {bool} whether the status has changed
	 */
	statusHasChanged() {
		return (this.status !== this.lastStatus);
	}

	/**
	 * @description add all members of an object to this mod
	 * @param {Object} obj;
	 */
	loadFromObj(obj) {
		if (obj.assets) {
			obj.assets.forEach((asset) => {
				this.addAsset(asset);
			});
			obj.asset = undefined;
		}

		Object.assign(this, obj);
	}

	/**
	 * @description add an asset to the assets arr. this function handles setting up onload and offload scripts for assets
	 * @param {Object} asset ;
	 */
	addAsset(dataAsset) {
		const asset = new Asset(dataAsset.source, dataAsset.dest, dataAsset.name, dataAsset.type);

		this.addToOnLoad(() => {
			asset.loadAsset();
			setTimeout(() => {
				ImageManager._imageCache.releaseReservation(ImageManager._systemReservationId);
				setTimeout(() => {
					Scene_Boot.loadSystemImages();
				}, 500);
			}, 1000);
		});

		this.addToOffLoad(() => {
			asset.unloadAsset();
		});

		this.assets.push(asset);
	}
}

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
 * @extends PluginManager
 */
class ModManager {
	constructor(path) {
		// extend plugin manager
		Object.assign(this, PluginManager);

		/**
		 * @description the current path that the mod loader is looking at
		 * @type {string}
		 * */
		this._path = path;

		/**
		 * @description a dictionary of all mods
		 * @type {Object.<string, Mod>}
		 * */
		this._modsDict = {};

		/**
		 * @description a control variable for whether the engine will force modded saves to be used or not
		 * @default false
		 */
		this.forceModdedSaves = false;

		/**
		 * @description a control variable for whether the engine will force vanilla saves to be used or not
		 * @default false
		 */
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
			modInfo.status = this.getModActive(modInfo.name);
			this.addModEntry(modInfo.name, modInfo);
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

		try {
			let userDataMod = MATTIE.DataManager.global.get(`${modName}_Active`);
			if (typeof userDataMod === 'undefined') {
				const path = this.getPath();
				const dataInfo = this.getModInfo(path, modName);
				userDataMod = dataInfo.status;
			}
			return userDataMod;
		} catch (error) {
			return true;
		}
	}

	setModActive(modName, bool) {
		modName = modName.replace('.json', '');
		MATTIE.DataManager.global.set(`${modName}_Active`, bool);
	}

	/**
     * @description get a list of all mods, not including preReqs from file system
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
			if (mod.statusHasChanged()) {
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
		this._modsDict[modName].setStatus(bool);
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

	/**
	 *
	 * @returns all mods
	 */
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
     * @param {*} args any other args that this mod might have
     */
	addModEntry(name, args = {}) {
		// create default values if the user did not provide them
		let isDependency = false;
		if (args == {}) isDependency = true;
		if (typeof args.status === 'undefined') args.status = true;
		if (typeof args.danger === 'undefined') args.danger = false;
		if (typeof args.params === 'undefined') args.params = {};
		const mod = new Mod(name, isDependency);
		mod.loadFromObj(args);
		this._modsDict[mod.name] = mod;

		this.setEnabled(mod.name, args.status);
	}

	findModIndexByName(name) {
		const index = -1;
		const keys = Object.keys(this._modsDict);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const mod = this._modsDict[key];
			if (mod.name === name) return i;
		}
		return index;
	}

	/**
     * @description add a offload script that will be called when a mod is deactivated to a mod
     * @param {String} name the name of the mod
     * @param {Function} cb the call back to be called
     */
	addOffloadScriptToMod(name, cb) {
		this._modsDict[name].addToOffLoad(cb);
	}

	/**
     * @description add a offload script that will be called when a mod is activated to a mod
     * @param {String} name
     * @param {Function} cb
     */
	addOnloadScriptToMod(name, cb) {
		this._modsDict[name].addToOnLoad(cb);
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
		return this.getModArr();
	}

	/**
	 * @description convert the mods dict into an arr and return
	 * @returns {Mod[]}
	 */
	getModArr() {
		return Object.values(this._modsDict);
	}

	/**
	 * @deprecated we just use the inherited method setup from plugin manager see top of file
     * @description load all mods from a list that are not already loaded
     * @extends PluginManager.prototype.loadScript
     * @param {Mod[]} mods a list of mods to load
     * @returns a promise that will resolve once all scripts are loaded
     */
	setupMods(mods) {
		const promises = [];
		mods.forEach((mod) => {
			if (this.getModActive(mod.name) && !Object.keys(this._modsDict).contains(mod.name)) {
				this.setParameters(mod.name, mod.parameters);
				promises.push(this.loadScript(mod.name));
			}
		});
		return Promise.all(promises);
	}
}

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
/**
 * @global
 * @description the global method that handles all exceptions
 * @param {Error} e the error that was thrown
 */
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
