/**
 * @namespace MATTIE.fxAPI
 * @description The api for screen effects. IE: filters, screen shake, etc...
 */
MATTIE.fxAPI = {};
MATTIE.fxAPI.trackedLights = [];
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
	const tint = this.formatTint(red, green, blue, gray);
	$gameScreen.startTint(tint, framesDur);
	$gameScreen.forceTint(true);
};

MATTIE.fxAPI.startScreenShake = function (intensity, speed, duration) {
	$gameScreen.startShake(intensity, speed, duration);
};

/**
 * @description format a tint in rpg maker format
 * @param {int} red
 * @param {int} green
 * @param {int} blue
 * @param {int} gray
 * @returns formatted tint obj
 */
MATTIE.fxAPI.formatTint = function (red, green, blue, gray) {
	const tint = [red, green, blue, gray];
	return tint;
};

/**
 * @description displays www/data/imgs/picture/name
 * @param {string} name name of file in www/data/imgs/picture to display
 * @param {int} id the id of the picture to create (this is like the layer number of the layer in photoshop)
 * @param {int} x the x to show the image at
 * @param {int} y
 */
MATTIE.fxAPI.showImage = function (name, id, x, y) {
	$gameScreen.showPicture(id, name, 0, x, y, 100, 100, 255, 0);
};

MATTIE.fxAPI.deleteImage = function (id) {
	$gameScreen.erasePicture(id);
};

/**
 * @description draw a circle on the light mask
 * @param {lightMask} the lightmask to target
 * @param {number} x the x cord of the center of the circle
 * @param {number} y the y cord of the center of the circle
 * @param {number} r1 the radius of the inner circle for gradient
 * @param {number} r2 the radius of the outer circle for gradient
 * @param {string} clr1 the color in the center of the circle gradient, in hex ie: '#FFFFFF'
 * @param {string} clr2 the color on the edge of the circle gradient, in hex
 * @param {string} blendMode the blend mode
 */
MATTIE.fxAPI.drawCircleMap = function (x, y, lightMask, r1 = 50, r2 = 250, clr1 = '#FFFFFF', clr2 = 'black', blendMode = 'lighter') {
	const pw = $gameMap.tileWidth();
	const ph = $gameMap.tileHeight();
	const dx = $gameMap.displayX();
	const dy = $gameMap.displayY();
	const px = x;
	const py = y;
	const paralax = false;
	var x1 = (pw / 2) + ((px - dx) * pw);
	var y1 = (ph / 2) + ((py - dy) * ph);
	// paralax does something weird with coordinates.. recalc needed
	if (dx > $gamePlayer.x) {
		const xjump = $gameMap.width() - Math.floor(dx - px);
		x1 = (pw / 2) + (xjump * pw);
	}
	if (dy > $gamePlayer.y) {
		const yjump = $gameMap.height() - Math.floor(dy - py);
		y1 = (ph / 2) + (yjump * ph);
	}

	const { canvas } = lightMask._maskBitmap;
	const ctx = canvas.getContext('2d');
	const temp = ctx.globalCompositeOperation;
	ctx.globalCompositeOperation = blendMode;
	lightMask._maskBitmap.radialgradientFillRect(x1, y1, r1, r2, clr1, clr2, true, 0.45);
	ctx.globalCompositeOperation = temp;
};

/**
 * @description add a game object to the list of tracked lights
 * @param {function} object any object with ._realX and realY
 * @param {function} active a function to check if the light is on or not
 * @param {number} r1 the radius of the inner circle for gradient
 * @param {number} r2 the radius of the outer circle for gradient
 * @param {string} clr1 the color in the center of the circle gradient, in hex ie: '#FFFFFF'
 * @param {string} clr2 the color on the edge of the circle gradient, in hex
 * @param {string} blendMode the blend mode
 */
MATTIE.fxAPI.addLightObject = function (object, active = () => true, r1 = 50, r2 = 250, clr1 = '#FFFFFF', clr2 = 'black', blendMode = 'lighter') {
	const obj = {};
	obj.getContent = object;
	obj.active = active;
	obj.r1 = r1;
	obj.r2 = r2;
	obj.clr1 = clr1;
	obj.clr2 = clr2;
	obj.blendMode = blendMode;
	MATTIE.fxAPI.trackedLights.push(obj);
};

MATTIE.prevLightMask = Lightmask.prototype._updateMask;
Lightmask.prototype._updateMask = function () {
	MATTIE.prevLightMask.call(this);
	for (let index = 0; index < MATTIE.fxAPI.trackedLights.length; index++) {
		const element = MATTIE.fxAPI.trackedLights[index];
		console.log(element);
		if (element.active()) {
			MATTIE.fxAPI.drawCircleMap(
				element.getContent()._realX,
				element.getContent()._realY,
				this,
				element.r1,
				element.r2,
				element.clr1,
				element.clr2,
				element.blendMode,
			);
		} else {
			console.log('not active');
		}
	}
};
