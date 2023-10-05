/**
 * @description the main randomizer namespace for the randomizer mod
 * contains all methods used by the randomizer mod
 * @namespace MATTIE.randomiser
 * */
MATTIE.randomiser = MATTIE.randomiser || {};
MATTIE.static = MATTIE.static || {};

// eslint-disable-next-line import/no-unresolved
const randomizerName = require('./mods/randomiser.json').name;

const params = PluginManager.parameters(randomizerName);

// setup the seed for the rng
if (params.seed === 'random') {
	// if random string randomize the seed
	console.log('random seed');
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
	console.log(realArr);

	realArr.sort(() => MATTIE.util.seedRandom() - 0.5);

	let j = 0;
	let i = 0;
	arr.map((e) => {
		if (e != null) {
			if (typeof e[attrib] != 'undefined') {
				if (e[attrib] != '') {
					arr[j] = realArr[i];
				}
			} else {
				console.log('here');
				arr[j] = realArr[i];
			}
			i++;
		}
		j++;
		return null;
	});
	for (let index = 0; index < arr.length; index++) {
		const element = arr[index];
		cb(element, index);
		if (element) { if (element.id) { element.id = index; } }
	}
	console.log(arr);
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
	let excludedMapIds = [];
	excludedMapIds = excludedMapIds.concat(MATTIE.static.maps.menuMaps); // exclude menus
	excludedMapIds = excludedMapIds.concat(MATTIE.static.blockingMaps);
	this.shuffle($dataMapInfos, 'name', (element, index) => {
		if (element) { if (element.id) element.orgId = element.id; }
	}, (e) => {
		const baseFilterRes = this.baseShuffleFilter(e, 'name');
		let passes = true;
		if (e) {
			if (e.id) {
				passes = !excludedMapIds.includes(e.id);
			}
		}
		return baseFilterRes && passes;
	});
};

/**
 * @description shuffle the maps array and fix ids.
 */
MATTIE.randomiser.shuffleMaps = function () {
	const that = this;
	this.shuffleMapInfo();
	this.idMappings = {};
	for (let index = 0; index < $dataMapInfos.length; index++) {
		const e = $dataMapInfos[index];
		if (e) {
			this.idMappings[e.orgId] = e.id;
		}
	}

	if (!this.mapsCmdInited) {
		const lastFunc = Game_Player.prototype.reserveTransfer;
		Game_Player.prototype.reserveTransfer = function (baseMapId, x, y, d, fadeType) {
			let mapId = that.idMappings[baseMapId];
			if (!mapId) mapId = baseMapId;
			return lastFunc.call(this, mapId, x, y, d, fadeType);
		};

		const lastPerform = Game_Player.prototype.performTransfer;
		Game_Player.prototype.performTransfer = function () {
			lastPerform.call(this);
			setTimeout(() => {
				const spot = MATTIE.betterCrowMauler.CrowController.prototype.findClosestSpawnPoint(this._newX, this._newY);
				$gamePlayer.locate(spot.x, spot.y);
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
	this.shuffle($dataStates);
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
	this.shuffleAnimations();
	this.shuffleArmors();
	this.shuffleClasses();
	this.shuffleItems();
	this.shuffleTroops();
	this.shuffleWeapons();
};

MATTIE.randomiser.randomise = function () {
	this.safeShuffle();
};

MATTIE.randomiser.randomise();
