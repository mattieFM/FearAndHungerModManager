/* eslint-disable no-unused-expressions */
/**
 * @description the main randomizer namespace for the randomizer mod
 * contains all methods used by the randomizer mod
 * @namespace MATTIE.randomiser
 * */
MATTIE.randomiser = MATTIE.randomiser || {};

/**
 * @description Contains all configuration settings for the randomizer mod.
 * @namespace MATTIE.randomiser.config
 * */
MATTIE.randomiser.config = {};

/**
 * @description whether to include dungeon knights maps for map randomization.
 * !!DANGER!! this will likely result in soft locks, but is funny when it doesn't
 * @default false
 */
MATTIE.randomiser.config.includeDungeonKnights;

/**
 * @description whether to randomize troops or not
 * @default true
 * */
MATTIE.randomiser.config.randomizeTroops;

/**
 * @description whether to randomize items or not
 * @default true
*/
MATTIE.randomiser.config.randomizeItems;

/**
 * @description whether to randomize armors or not
 * @default true
 * */
MATTIE.randomiser.config.randomizeArmors;

/**
 * @description whether to randomize weapons or not
 * @default true
 * */
MATTIE.randomiser.config.randomizeWeapons;

/**
 * @description whether to randomize enemies or not. Note that this means randomizing the limbs
 * that troops are composed of.
 * !!Danger!! this will make the game quite incomprehensible but it shouldn't actually crash
 * @default false
*/
MATTIE.randomiser.config.randomizeEnemies;

/**
 * @description whether to randomize skills or not
 * @default true
*/
MATTIE.randomiser.config.randomizeSkills;

/**
 * @description whether to randomize classes or not
 * !!DANGER!! tends to break things --if class gets switched with nashrah or test or... then it will break etc...
 * @default false
 */
MATTIE.randomiser.config.randomizeClasses;

/**
 * @description whether to randomize maps or not
 * @default true
 * Works as long as you can use the books in your inventory to recover from softlocks
 * Ex Altiora lets you use the airship to get un stuck
 * and The Seven Lamps of Arcitecture lets you teleport to a new room (sometimes) if you got stuck.
 *  */
MATTIE.randomiser.config.randomizeMaps;

/**
 * @description whether to randomize animations or not
 * @default true
 * */
MATTIE.randomiser.config.randomizeAnimations;

/**
 * @description whether to randomize states or not
 * @default true
 * */
MATTIE.randomiser.config.randomizeStates;

/**
 * @description whether to randomize common events or not
 * !!DANGER!! This will crash the game. Its funny but it is not safe and will blow up.
 * @default false
 * */
MATTIE.randomiser.config.commonEvents = false;

Object.defineProperties(MATTIE.randomiser.config, {
	includeDungeonKnights: {
		get: () => MATTIE.configGet('includeDungeonKnights', false),
		set: (value) => { MATTIE.configSet('includeDungeonKnights', value); },
	},
	randomizeTroops: {
		get: () => MATTIE.configGet('randomizeTroops', true),
		set: (value) => { MATTIE.configSet('randomizeTroops', value); },
	},
	randomizeItems: {
		get: () => MATTIE.configGet('randomizeItems', true),
		set: (value) => { MATTIE.configSet('randomizeItems', value); },
	},
	randomizeArmors: {
		get: () => MATTIE.configGet('randomizeArmors', true),
		set: (value) => { MATTIE.configSet('randomizeArmors', value); },
	},
	randomizeClasses: {
		get: () => MATTIE.configGet('randomizeClasses', false),
		set: (value) => { MATTIE.configSet('randomizeClasses', value); },
	},
	randomizeEnemies: {
		get: () => MATTIE.configGet('randomizeEnemies', false),
		set: (value) => { MATTIE.configSet('randomizeEnemies', value); },
	},
	randomizeMaps: {
		get: () => MATTIE.configGet('randomizeMaps', true),
		set: (value) => { MATTIE.configSet('randomizeMaps', value); },
	},
	randomizeStates: {
		get: () => MATTIE.configGet('randomizeStates', true),
		set: (value) => { MATTIE.configSet('randomizeStates', value); },
	},
	randomizeAnimations: {
		get: () => MATTIE.configGet('randomizeAnimations', false),
		set: (value) => { MATTIE.configSet('randomizeAnimations', value); },
	},
	randomizeWeapons: {
		get: () => MATTIE.configGet('randomizeWeapons', true),
		set: (value) => { MATTIE.configSet('randomizeWeapons', value); },
	},
});

MATTIE.static = MATTIE.static || {};

// eslint-disable-next-line import/no-unresolved
const randomizerName = require('./mods/randomiser.json').name;

const params = PluginManager.parameters(randomizerName);

// setup the seed for the rng
if (params.seed === 'random') {
	// if random string randomize the seed
	MATTIE.util.setSeed(MATTIE.supporters.getRandomSupporter());
} else {
	// else use provided
	MATTIE.util.setSeed(params.seed);
}

/**
 * @description the base filter callback for the shuffle method
 * @param {*} e the elemnt to check if it exists
 * @param {string} attrib the attribute to use to check if element is defined
 * @returns {boolean}
 */
MATTIE.randomiser.baseShuffleFilter = function (e, attrib) {
	if (e != null) {
		if (typeof e[attrib] != 'undefined') {
			if (e[attrib] != '') {
				return true;
			}
		} else {
			return true;
		}
	}
	return false;
};

/**
 * @description shuffle an array randomly and then ensure that if the elements had an
 * id property to fix the id to be the new index
 * @param {Array} arr the array to shuffle
 * @param {string} attrib the atribute to use to check if an element is defined
 * @param {function} filterCb the callback used by the filter method when filtering the original list.
 * @param {function} cb (optional) a cb to call on each element after they are shuffled and the element and index are passed to it so (element, index)
 * @returns {Array} the shuffled array. Note this method is destructive so the original array is also modified
 */
MATTIE.randomiser.shuffle = function (arr, attrib = 'name', cb = () => {}, filterCb = null) {
	if (filterCb === null) {
		filterCb = (e) => this.baseShuffleFilter(e, attrib);
	}
	const realArr = arr.filter(filterCb);

	realArr.sort(() => MATTIE.util.seedRandom() - 0.5);

	let j = 0;
	let i = 0;
	arr.map((e) => {
		if (filterCb(e) && typeof realArr[i] != 'undefined') {
			if (typeof e[attrib] != 'undefined') {
				if (e[attrib] != '') {
					arr[j] = realArr[i];
					i++;
				}
			} else {
				arr[j] = realArr[i];
				i++;
			}
		}
		j++;
		return null;
	});

	for (let index = 0; index < arr.length; index++) {
		const element = arr[index];
		cb(element, index);
		if (element) {
			if (element.id) {
				arr[index].id = index;
			}
		}
	}

	return arr;
};

/**
 * @description shuffle the troops array and fix ids
 */
MATTIE.randomiser.shuffleTroops = function () {
	this.shuffle($dataTroops);
};

/**
 * @description shuffle the items array and fix ids
 */
MATTIE.randomiser.shuffleItems = function () {
	this.shuffle($dataItems);
};

/**
 * @description shuffle the armor array and fix ids
 */
MATTIE.randomiser.shuffleArmors = function () {
	this.shuffle($dataArmors);
};

/**
 * @description shuffle the armor array and fix ids
 */
MATTIE.randomiser.shuffleWeapons = function () {
	this.shuffle($dataWeapons);
};

/**
 * @description shuffle the enemies array and fix ids.
 * note: because funger stores limbs as enemies this will result in utter chaos with troops being composed of random limbs of random creatures
 */
MATTIE.randomiser.shuffleEnemies = function () {
	this.shuffle($dataEnemies);
};

/**
 * @description shuffle the skills array and fix ids.
 * note: because skills contain both player and enemy skills this will result in very very weird things
 */
MATTIE.randomiser.shuffleSkills = function () {
	const excludedSkills = [
		1, // player should always be allowed to attack
		2, // player should always be allowed to gaurd
		11, // player should always be allowed to talk
		40, // player should be able to run
	];
	this.shuffle($dataSkills, 'name', () => {}, (e) => {
		const baseFilterRes = this.baseShuffleFilter(e, 'name');
		let passes = true;
		if (e) {
			if (e.id) {
				passes = !excludedSkills.includes(e.id);
			}
		}
		return baseFilterRes && passes;
	});
};

/**
 * @description shuffle the classes array and fix ids.
 * note: this will randomize starting abilities and stats IE: merc could have war cry or nash'ra abilities, etc...
 */
MATTIE.randomiser.shuffleClasses = function () {
	this.shuffle($dataClasses);
};

/**
 * @description shuffle the animations array and fix ids.
 * note: Fear and hunger doesn't really use animations the way it should so this might not be as chaotic as expected but will result in very
 * very weird things
 */
MATTIE.randomiser.shuffleAnimations = function () {
	this.shuffle($dataAnimations);
};

/**
 * @description shuffle the common events array and fix ids.
 * Note: This will almost certainly break things completely, this is the most likely to crash the game.
 */
MATTIE.randomiser.shuffleCommonEvents = function () {
	this.shuffle($dataCommonEvents);
};

/**
 * @description shuffle the mapsinfo array and fix ids.
 */
MATTIE.randomiser.shuffleMapInfo = function () {
	let excludedMapIds = [0, 78, 19, 60, 79, 81, 82, 83, 84, 74, 183];
	excludedMapIds = excludedMapIds.concat(MATTIE.static.maps.menuMaps); // exclude menus
	excludedMapIds = excludedMapIds.concat(MATTIE.static.blockingMaps);
	if (!MATTIE.randomiser.config.includeDungeonKnights) excludedMapIds = excludedMapIds.concat(MATTIE.static.dungeonKnights);
	this.shuffle($dataMapInfos, 'name', (element, index) => {
		// if (element) { if (element.id) };
	}, (e) => {
		const baseFilterRes = this.baseShuffleFilter(e, 'name');
		let passes = false;
		if (e) {
			if (e.id) {
				passes = !excludedMapIds.includes(e.id) && !excludedMapIds.includes(parseInt(e.id, 10));

				if (passes)	{
					e.orgId = e.id;
				}
			}
		}
		return (baseFilterRes && passes);
	});
};

/**
 * @description shuffle the maps array and fix ids.
 */
MATTIE.randomiser.shuffleMaps = function () {
	const that = this;
	this.shuffleMapInfo();
	this.idMappings = {};
	this.doorMappings = {};
	for (let index = 0; index < $dataMapInfos.length; index++) {
		const e = $dataMapInfos[index];
		if (e) {
			if (e.orgId) {
				this.idMappings[e.orgId] = e.id;
			}
		}
	}

	if (!this.mapsCmdInited) {
		const lastFunc = Game_Player.prototype.reserveTransfer;
		Game_Player.prototype.reserveTransfer = function (baseMapId, x, y, d, fadeType, letBase = false) {
			let mapId = false;
			that.oldMapId = $gameMap.mapId();
			that.oldX = $gamePlayer.x;
			that.oldY = $gamePlayer.y;
			that.baseMapId = baseMapId;
			if (!letBase) {
				mapId = that.idMappings[baseMapId];
			}

			if (!mapId) mapId = baseMapId;
			if (!that.doorMappings[that.oldMapId]) that.doorMappings[that.oldMapId] = {};
			if (!that.doorMappings[that.oldMapId][that.oldX]) that.doorMappings[that.oldMapId][that.oldX] = {};
			if (!that.doorMappings[that.oldMapId][that.oldX][that.oldY]) that.doorMappings[that.oldMapId][that.oldX][that.oldY] = {};
			return lastFunc.call(this, mapId, x, y, d, fadeType);
		};

		Game_Interpreter.prototype.command201 = function () {
			if (!$gameParty.inBattle() && !$gameMessage.isBusy()) {
				var mapId; var x; var
					y;
				if (this._params[0] === 0) { // Direct designation
					mapId = this._params[1];
					x = this._params[2];
					y = this._params[3];
				} else { // Designation with variables
					mapId = $gameVariables.value(this._params[1]);
					x = $gameVariables.value(this._params[2]);
					y = $gameVariables.value(this._params[3]);
				}
				$gamePlayer.reserveTransfer(mapId, x, y, this._params[4], this._params[5], this._params[6]);
				this.setWaitMode('transfer');
				this._index++;
			}
			return false;
		};

		const lastPerform = Game_Player.prototype.performTransfer;
		Game_Player.prototype.performTransfer = function () {
			console.log(`mapid:${this._newMapId}\nx:${this._newX}\ny:${this._newY}`);
			$gamePlayer.setTransparent(false);
			const oldMap = $gameMap.mapId();
			const x = $gamePlayer.x;
			const y = $gamePlayer.y;
			lastPerform.call(this);
			setTimeout(() => {
				let realSpot;
				if (Object.keys(that.doorMappings[that.oldMapId][that.oldX][that.oldY]).length <= 0) {
					const spots = MATTIE.betterCrowMauler.CrowController.prototype.getAllTransferPointsOnMap();
					const spot = spots[MATTIE.util.randBetween(0, spots.length - 1)];
					if (spot) {
						console.log('tp to spot:');
						console.log(spot);
						realSpot = MATTIE.betterCrowMauler.CrowController.prototype.findNearestPassablePoint(50, 50, spot.x, spot.y);
					} else {
						console.log('middle of map tp');
						// eslint-disable-next-line max-len
						realSpot = MATTIE.betterCrowMauler.CrowController.prototype.findNearestPassablePoint(50, 50, $gameMap.width() / 2, $gameMap.height() / 2);
					}
					realSpot.mapId = this._newMapId;
					that.doorMappings[that.oldMapId][that.oldX][that.oldY] = realSpot;
				} else {
					realSpot = that.doorMappings[that.oldMapId][that.oldX][that.oldY];
					this._newMapId = realSpot.mapId;
				}

				$gamePlayer.locate(realSpot.x, realSpot.y);
				for (let x1 = -3; x1 < 3; x1++) {
					for (let y1 = -3; y1 < 3; y1++) {
						const events = $gameMap.eventsXy(realSpot.x + x1, realSpot.y + y1);
						events.forEach((event) => {
							if (event && event.list) {
								event.event().pages.forEach((page) => {
									page.list.forEach((cmd) => {
										if (cmd.code === MATTIE.static.commands.transferId) {
											const obj = {};
											obj.x = x;
											obj.y = y;
											obj.mapId = $gameMap.lastMapId();
											cmd.parameters[1] = $gameMap.lastMapId();
											cmd.parameters[2] = x;
											cmd.parameters[3] = y;
											cmd.parameters[6] = true;
											if (!that.doorMappings[$gameMap.mapId()]) that.doorMappings[$gameMap.mapId()] = {};
											// eslint-disable-next-line max-len
											if (!that.doorMappings[$gameMap.mapId()][realSpot.x + x1]) that.doorMappings[$gameMap.mapId()][realSpot.x + x1] = {};
											// eslint-disable-next-line max-len
											if (!that.doorMappings[$gameMap.mapId()][realSpot.x + x1][realSpot.y + y1]) { that.doorMappings[$gameMap.mapId()][realSpot.x + x1][realSpot.y + y1] = {}; }
											that.doorMappings[$gameMap.mapId()][realSpot.x + x1][realSpot.y + y1] = obj;
										// mapId = this._params[1];
										// x = this._params[2];
										// y = this._params[3];
										}
									});
								});
							}
						});
					}
				}
			}, 500);
		};
	}

	this.mapsCmdInited = true;

	// DataManager.loadMapData = function (baseMapId) {
	// 	let mapId = idMappings[baseMapId];
	// 	if (!mapId) mapId = baseMapId;
	// 	if (mapId > 0) {
	// 		var filename = 'Map%1.json'.format((29).padZero(3));
	// 		this._mapLoader = ResourceHandler.createLoader(`data/${filename}`, this.loadDataFile.bind(this, '$dataMap', filename));
	// 		this.loadDataFile('$dataMap', filename);
	// 	} else {
	// 		this.makeEmptyMap();
	// 	}
	// };

	// Scene_Map.prototype.create = function () {
	// 	Scene_Base.prototype.create.call(this);
	// 	this._transfer = $gamePlayer.isTransferring();
	// 	var baseMapId = this._transfer ? $gamePlayer.newMapId() : $gameMap.mapId();
	// 	let mapId = idMappings[baseMapId];
	// 	if (!mapId) mapId = baseMapId;
	// 	DataManager.loadMapData(mapId);
	// };

	// Game_Map.prototype.setup = function (baseMapId) {
	// 	let mapId = idMappings[baseMapId];
	// 	if (!mapId) mapId = baseMapId;
	// 	if (!$dataMap) {
	// 		throw new Error('The map data is not available');
	// 	}
	// 	this._mapId = mapId;
	// 	this._tilesetId = $dataMap.tilesetId;
	// 	this._displayX = 0;
	// 	this._displayY = 0;
	// 	this.refereshVehicles();
	// 	this.setupEvents();
	// 	this.setupScroll();
	// 	this.setupParallax();
	// 	this.setupBattleback();
	// 	this._needsRefresh = false;
	// };
};

/**
 * @description shuffle the states array and fix ids.
 * Note: This will break things given the knockout state and resist death state will be shuffled, they will need to be hardcoded to stay put.
 */
MATTIE.randomiser.shuffleStates = function () {
	const excludedStates = [1, 13, 36];
	this.shuffle($dataMapInfos, 'name', (element, index) => {
		// if (element) { if (element.id) };
	}, (e) => {
		const baseFilterRes = this.baseShuffleFilter(e, 'name');
		let passes = false;
		if (e) {
			if (e.id) {
				passes = !excludedStates.includes(e.id) && !excludedStates.includes(parseInt(e.id, 10));
			}
		}
		return (baseFilterRes && passes);
	});
};

/**
 * @description shuffle the tilesets array and fix ids.
 * Note: this shouldn't break anything but will make the game very very ugly and not in a funny way (likely)
 */
MATTIE.randomiser.shuffleTilesets = function () {
	this.shuffle($dataTilesets);
};

/**
 * @description only randomize in places where it will not cause major issues.
 */
MATTIE.randomiser.safeShuffle = function () {
	const that = this;
	if (MATTIE.randomiser.config.randomizeStates) this.shuffleStates();
	if (MATTIE.randomiser.config.randomizeAnimations) this.shuffleAnimations();
	if (MATTIE.randomiser.config.randomizeArmors) this.shuffleArmors();
	if (MATTIE.randomiser.config.randomizeClasses) this.shuffleClasses();
	if (MATTIE.randomiser.config.randomizeEnemies) this.shuffleEnemies();
	if (MATTIE.randomiser.config.randomizeItems) this.shuffleItems();
	if (MATTIE.randomiser.config.commonEvents) this.shuffleCommonEvents();
	if (MATTIE.randomiser.config.randomizeMaps) {
		this.shuffleMaps();
		const bookOfLamps = new MATTIE.itemAPI.RunTimeItem();
		bookOfLamps.addRecipe([11, 87, 98], 98);
		bookOfLamps.addRecipeUnlock(11);
		bookOfLamps.addRecipeUnlock(87);
		bookOfLamps.setIconIndex(261);
		bookOfLamps.setName('The Seven Lamps of Architecture');
		bookOfLamps.setDescription('A book that emits the feeling of walls pressing in around you.\nWhen used in moderation can shift reality.');
		bookOfLamps.setItemType(2); // set book
		bookOfLamps.setCallback(() => {
			SceneManager.goto(Scene_Map);
			setTimeout(() => {
				MATTIE.fxAPI.startScreenShake(10, 10, 5);
				MATTIE.fxAPI.startScreenShake(10, 10, 50);
				MATTIE.fxAPI.setupTint(100, 255, 100, 200, 10);
				const keys = Object.keys(that.idMappings);

				const mapId = that.idMappings[keys[MATTIE.util.randBetween(0, keys.length - 1)]];
				$gamePlayer.reserveTransfer(mapId, $gameMap.width() / 2, $gameMap.height() / 2);
				setTimeout(() => {
					$gamePlayer.performTransfer();
				}, 500);
			}, 200);
		});
		bookOfLamps.spawn();
		const exAltiora = new MATTIE.itemAPI.RunTimeItem();
		exAltiora.addRecipe([11, 87, 98], 98);
		exAltiora.addRecipeUnlock(11);
		exAltiora.addRecipeUnlock(87);
		exAltiora.setIconIndex(261);
		exAltiora.setName('Ex Altiora');
		exAltiora.setDescription('A virgil-style poem intermixed with intricate wood carvings of mountains.\nThe book evokes feelings of vertigo.');
		exAltiora.setItemType(2); // set book
		exAltiora.setCallback(() => {
			SceneManager.goto(Scene_Map);
			setTimeout(() => {
				var vehicle = $gameMap.vehicle('airship');
				if (vehicle) {
					vehicle.setLocation($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
				}
				$gamePlayer.getOnOffVehicle();
			}, 500);
		});
		exAltiora.spawn();
		const mapInit = Game_Map.prototype.initialize;
		Game_Map.prototype.initialize = function () {
			mapInit.call(this);
			setTimeout(() => {
				$gameParty.gainItem(bookOfLamps._data, 1, false);
				$gameParty.gainItem(exAltiora._data, 1, false);
			}, 500);
		};
	}
	if (MATTIE.randomiser.config.randomizeSkills) this.shuffleSkills();
	if (MATTIE.randomiser.config.randomizeTroops) this.shuffleTroops();
	if (MATTIE.randomiser.config.randomizeWeapons) this.shuffleWeapons();
};

MATTIE.randomiser.randomise = function () {
	this.safeShuffle();
};

MATTIE.randomiser.randomise();

// supress audio warning
WebAudio.prototype._load = function (url) {
	try {
		if (WebAudio._context) {
			var xhr = new XMLHttpRequest();
			if (Decrypter.hasEncryptedAudio) url = Decrypter.extToEncryptExt(url);
			xhr.open('GET', url);
			xhr.responseType = 'arraybuffer';
			xhr.onload = function () {
				if (xhr.status < 400) {
					this._onXhrLoad(xhr);
				}
			}.bind(this);
			// xhr.onerror = this._loader || function () { this._hasError = true; }.bind(this);
			xhr.send();
		}
	} catch (error) {
		//
	}
};
