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
 * @description clamp a number between a min and a max
 * @param {*} num the number
 * @param {*} min the min number
 * @param {*} max the max number
 * @returns
 */
MATTIE.util.clamp = (num, min, max) => Math.min(Math.max(num, min), max);

(() => {
	// setup the default seed
	MATTIE.util.setSeed('default');
})();
