MATTIE.util = MATTIE.util || {};

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
 * @returns {boolean} whether the
 */
MATTIE.util.randChance = function (chance) {
	return (Math.random() <= chance);
};
