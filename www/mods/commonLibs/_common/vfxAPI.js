var MATTIE = MATTIE || {};

MATTIE.fxAPI = {};

//----------------------------------------------
// Game_Screen
//----------------------------------------------
MATTIE_RPG.fxAPI = {};

/** @description the base start tint function */
MATTIE_RPG.fxAPI.startTint = Game_Screen.prototype.startTint;
/**
 * @description the start tint function overriden to only fire if an effect is not being forced
 * @param {*} tone [r,b,g,gray]
 * @param {*} duration frames till end
 */
Game_Screen.prototype.startTint = function (tone, duration) {
	if (!this.forcingTint) MATTIE_RPG.fxAPI.startTint.call(this, tone, duration);
};

/**
 * @description set the forcing tint attribute to bool
 */
Game_Screen.prototype.forceTint = function (bool) {
	this.forcingTint = bool;
};

/** @description the base update tone method */
MATTIE_RPG.fxAPI.updateTone = Game_Screen.prototype.updateTone;
/** @description the update tone method extended to stop forcing if duration is over */
Game_Screen.prototype.updateTone = function () {
	MATTIE_RPG.fxAPI.updateTone.call(this);
	if (this._toneDuration <= 0) this.forceTint(false);
};

MATTIE.fxAPI.setupTint = function (red, green, blue, gray, framesDur) {
	const tint = [red, green,
		blue, gray];
	$gameScreen.startTint(tint, framesDur);
	$gameScreen.forceTint(true);
};

MATTIE.fxAPI.startScreenShake = function (intensity, speed, duration) {
	$gameScreen.startShake(intensity, speed, duration);
};

MATTIE.fxAPI.showImage = function (name, id, x, y) {
	$gameScreen.showPicture(id, name, 0, x, y, 100, 100, 255, 0);
};

MATTIE.fxAPI.deleteImage = function (id) {
	$gameScreen.erasePicture(id);
};
