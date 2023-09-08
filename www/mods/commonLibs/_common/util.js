var MATTIE = MATTIE || {};
MATTIE.util = MATTIE.util || {};



/**
 * @description get a random number between inclusive min and max
 * @param {*} min inclusive min
 * @param {*} max inclusive max
 * @returns {int}
 */
MATTIE.util.randBetween = function(min, max) {
    return min + Math.floor(Math.random() * (max-min+1))
}

/** @returns a string name of the player */
MATTIE.util.getName = function(){
    return MATTIE.DataManager.global.get("name") ? MATTIE.DataManager.global.get("name") : MATTIE.supporters.getRandomSupporter()
}