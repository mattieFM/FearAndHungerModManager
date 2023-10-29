/* eslint-disable no-trailing-spaces */
MATTIE.util = MATTIE.util || {};

/**
 * @description the object used for getting set seed random numbers
 * @type {Math.seedRandom}
 * */
MATTIE.util.seedRandom = null;

MATTIE.util.setSeed = function (seed) {
	// eslint-disable-next-line new-cap
	MATTIE.util.seedRandom = new Math.seedrandom(seed); // create new seedrandom from seedrandom.js
};

/** @description get the next random number in the set seed */
MATTIE.util.getSeedRandom = function () {
	return MATTIE.util.seedRandom();
};

/**
 * @description get a random number between inclusive min and max using seed random
 * @param {*} min inclusive min
 * @param {*} max inclusive max
 * @returns {int}
 */
MATTIE.util.seededRandBetween = function (min, max) {
	return min + Math.floor(MATTIE.util.getSeedRandom() * (max - min + 1));
};

/**
 * @description get a random number between inclusive min and max
 * @param {*} min inclusive min
 * @param {*} max inclusive max
 * @returns {int}
 */
MATTIE.util.randBetween = function (min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
};

/** @returns a string name of the player */
MATTIE.util.getName = function () {
	return MATTIE.DataManager.global.get('name') ? MATTIE.DataManager.global.get('name') : MATTIE.supporters.getRandomSupporter();
};

/** @returns the dist between two points */
MATTIE.util.getDist = function (x1, x2, y1, y2) {
	return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
};

/**
 * @description roll a chance
 * @param {*} chance 0-1, 0 being 0%, 1 being 100%
 * @returns {boolean} whether the chance is true or false
 */
MATTIE.util.randChance = function (chance) {
	const roll = Math.random();
	return (roll <= chance);
};

/**
 * @description roll a chance with the seeded rand
 * @param {*} chance 0-1, 0 being 0%, 1 being 100%
 * @returns {boolean} whether the chance is true or false
 */
MATTIE.util.randSeededChance = function (chance) {
	const roll = MATTIE.util.getSeedRandom();
	return (roll <= chance);
};

/**
 *
 * @description clamp a number between a min and a max
 * @param {*} num the number
 * @param {*} min the min number
 * @param {*} max the max number
 * @returns {int} the number
 */
MATTIE.util.clamp = (num, min, max) => Math.min(Math.max(num, min), max);

(() => {
	// setup the default seed
	MATTIE.util.setSeed('default');
})();

// // eslint-disable-next-line no-extend-native, consistent-return
// Object.prototype.removeItem = function (key) {
// 	// eslint-disable-next-line no-prototype-builtins
// 	if (!this.hasOwnProperty(key)) {
// 		return null;
// 	}
// 	if (isNaN(parseInt(key, 10)) || !(this instanceof Array)) { delete this[key]; } else { this.splice(key, 1); }
// };

/**
 * @description sprial out from a point calling a callback on each point
 * @param {int} X
 * @param {int} Y
 * @param {int} max how far out should we spiral
 * @param {function} cb the callback to call
 */
MATTIE.util.spiral = function (X, Y, dist, cb) {
	const max = (Math.max(X, Y) ** 2);

	let x = 0;
	let y = 0;
	let dx = 0;
	let t = 0;
	let dy = -1;
	for (let index = 0; index < max; index++) {
		console.log(index);
		if ((-X / 2 < x <= X / 2) && (-Y / 2 < y <= Y / 2)) {
			cb(x, y);
			console.log('here');
		}
		if (x == y || (x < 0 && x == -y) || (x > 0 && x == 1 - y)) {
			t = dx;
			dx = -dy;
			dy = t;
		}
		x += dx;
		y += dy;
	}
};

/**
 * @description check if an event is autorun or not. autorun is trigger = 3;
 * @returns {boolean} whether this event is autorun or not
 */
Game_Event.prototype.isAutorun = function () {
	return this._trigger === 3;
};

/**
 * @description get all autorun events on the current data map
 * @returns {Game_Event[]} an array of all autorun events on this map
 * @param {boolean} anyPage default: false. whether to check all pages or just the active page
 */
MATTIE.util.getAllAutoRunEvents = function (anyPage = false) {
	const events = $gameMap.events();
	let autorunEvents;
	if (!anyPage) {
		autorunEvents = events.filter((event) => event.isAutorun()); // check if trigger === 3
	} else {
		autorunEvents = events.filter((event) => event.event().pages.some((page) => page.trigger === 3)); // check if trigger === 3
	}
	return autorunEvents;
};

/**
 * @description check if the player has a torch active
 * @returns {bool} whether the player has a torch active or not
 */
MATTIE.util.hasTorchActive = function () {
	return $gameSwitches.value(MATTIE.static.switch.torchTimer);
};

/**
 * @description get the map variant of the current world
 * @param x the index of the rand var you want IE:  
 * 0, // level1_1  
	1, // level1_2  
	2, // level1_3  
	3, // level1_4  
	4, // level2  
	5, // level3  
	6, // level4  
	7, // level5  
	8, // level6  
	9, // level6_2  
	10, // level7  
	11, // thicket1  
	12, // thicket2  
	13, // thicket3  
	14, // mahabre1  
 * returns a, b or c or z if null
 */
MATTIE.util.getMapVariant = function (x = 0) {
	const randVars = [
		121, // level1_1
		122, // level1_2
		123, // level1_3
		124, // level1_4
		125, // level2
		126, // level3
		127, // level4
		128, // level5
		129, // level6
		130, // level6_2
		131, // level7
		132, // thicket1
		133, // thicket2
		134, // thicket3
		135, // mahabre1
	];
	const vars = [
		'z',
		'a',
		'b',
		'c',
	];

	return vars[$gameVariables.value(randVars[x])];
};

/**
 * linerly interpret between 2 numbers
 * @param {number} a number 1
 * @param {number} b number 2
 * @param {number} alpha val between 0-1 of which number we are at
 * @returns 
 */
MATTIE.util.lerp = function (a, b, alpha) {
	return a + alpha * (b - a);
};
