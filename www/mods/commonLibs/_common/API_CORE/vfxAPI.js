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

	// Calculate coordinates
	var x1 = (pw / 2) + ((px - dx) * pw);
	var y1 = (ph / 2) + ((py - dy) * ph);

	// Handle screen wraparound / parallax if needed (standard RPG Maker logic)
	if (dx > px && ($gameMap.width() > $gameMap.screenTileX())) {
		const xjump = $gameMap.width() - Math.floor(dx - px);
		if (xjump < $gameMap.screenTileX()) x1 = (pw / 2) + (xjump * pw);
	}
	if (dy > py && ($gameMap.height() > $gameMap.screenTileY())) {
		const yjump = $gameMap.height() - Math.floor(dy - py);
		if (yjump < $gameMap.screenTileY()) y1 = (ph / 2) + (yjump * ph);
	}

	// Ensure bitmap exists
	if (!lightMask._maskBitmap) return;

	const { canvas } = lightMask._maskBitmap;
	if (!canvas) return;

	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	// DEBUG: Log coordinates every 60 frames roughly to check tracking
	// if (Math.random() < 0.016) {
	//      console.log(`[vfxAPI] Drawing Light at Screen: ${x1.toFixed(0)}, ${y1.toFixed(0)} | Map: ${px.toFixed(1)}, ${py.toFixed(1)}`);
	// }

	const temp = ctx.globalCompositeOperation;
	// Terrax uses 'lighter' to accumulate lights on the black mask.
	// 'source-over' creates black squares because the gradient edge is black.
	// 'lighter' allows the black edge (0,0,0) to add nothing, solving the merging issue.
	ctx.globalCompositeOperation = 'lighter';

	// DEBUG: Draw a small red box at center to verify position visible
	// ctx.fillStyle = 'red';
	// ctx.fillRect(x1 - 5, y1 - 5, 10, 10);

	// Manual draw for maximum control
	try {
		const grad = ctx.createRadialGradient(x1, y1, r1, x1, y1, r2);
		// Center: Full White (Transparent hole in Multiply mask)
		grad.addColorStop(0, '#FFFFFF');
		// Middle: Colored tint
		grad.addColorStop(0.5, clr1);
		// Edge: Black (Full Darkness)
		grad.addColorStop(1, 'black');

		ctx.fillStyle = grad;
		ctx.fillRect(x1 - r2, y1 - r2, r2 * 2, r2 * 2);
	} catch (e) {
		console.error('[vfxAPI] Error drawing light:', e);
	}

	ctx.globalCompositeOperation = temp;
};

/**
 * @description make the player invisible for X frames or till turned back visible
 * @param ms if provided turn the player inviable for this many milliseconds, else just leave them invisible till turned visible by something else
 */
MATTIE.fxAPI.hidePlayer = function (ms = -1) {
	$gamePlayer.setTransparent(true);
	if (ms > 0) {
		setTimeout(() => {
			this.showPlayer();
		}, ms);
	}
};

/**
 * @description make the player visible again if they were invisible
 */
MATTIE.fxAPI.showPlayer = function () {
	$gamePlayer.setTransparent(false);
};

/**
 * @description lock player controls for x milliseconds or till turned back on
 * @param ms if provided the player will be unable to act for this many milliseconds, else unable to act till reenabled elsewhere
 */
MATTIE.fxAPI.lockPlayer = function (ms = -1) {
	this.orgCanMove = this.orgCanMove || $gamePlayer.canMove;
	$gamePlayer.canMove = () => false;
	$gameSystem.disableSave();
	$gameSystem.disableMenu();
	if (ms > 0) {
		setTimeout(() => {
			this.unlockPlayer();
		}, ms);
	}
};

/**
 * @description allow the player to input and stuff again
 */
MATTIE.fxAPI.unlockPlayer = function () {
	$gameSystem.enableMenu();
	$gameSystem.enableSave();
	if (this.orgCanMove) {
		$gamePlayer.canMove = this.orgCanMove;
		this.orgCanMove = undefined;
	}
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

MATTIE.fxAPI.onUpdateMask = function (lightMaskContext) {
	if (!MATTIE.fxAPI.trackedLights) return;

	// Check if we have any active tracked lights
	const hasActiveLights = MATTIE.fxAPI.trackedLights.some((l) => {
		const active = l && l.active && l.active();
		return active;
	});

	if (hasActiveLights) {
		// If Terrax judged there were no native lights, it might not have added the sprite layer.
		if (lightMaskContext._sprites && lightMaskContext._sprites.length === 0) {
			if (lightMaskContext._addSprite && lightMaskContext._maskBitmap) {
				// console.log('[vfxAPI] Force-adding sprite layer');
				lightMaskContext._addSprite(0, 0, lightMaskContext._maskBitmap);
				lightMaskContext._maskBitmap.fillRect(0, 0, lightMaskContext._maskBitmap.width, lightMaskContext._maskBitmap.height, 'black');
			}
		}
	}

	for (let index = 0; index < MATTIE.fxAPI.trackedLights.length; index++) {
		const element = MATTIE.fxAPI.trackedLights[index];
		if (element && element.active && element.active()) {
			const target = element.getContent();

			// Safety check for target existence
			if (target && typeof target._realX !== 'undefined' && typeof target._realY !== 'undefined') {
				MATTIE.fxAPI.drawCircleMap(
					target._realX,
					target._realY,
					lightMaskContext,
					element.r1,
					element.r2,
					element.clr1,
					element.clr2,
					element.blendMode,
				);
			}
		}
	}
};

MATTIE.fxAPI.hookLightmaskProto = function (proto) {
	if (proto._vfxHooked) return;

	console.log('[vfxAPI] Hooking Lightmask prototype...');
	const oldUpdate = proto._updateMask;
	proto._updateMask = function () {
		if (oldUpdate) oldUpdate.call(this);
		MATTIE.fxAPI.onUpdateMask(this);
	};
	proto._vfxHooked = true;
	console.log('[vfxAPI] Hooked Lightmask successfully via prototype');
};

MATTIE.fxAPI.injectHooks = function () {
	// Strategy 1: Hook Spriteset_Map to catch future Lightmasks
	if (!Spriteset_Map.prototype._vfxHooked) {
		const oldCreate = Spriteset_Map.prototype.createLightmask;
		Spriteset_Map.prototype.createLightmask = function () {
			if (oldCreate) oldCreate.call(this);
			if (this._lightmask) {
				// Determine prototype from the instance
				const proto = Object.getPrototypeOf(this._lightmask);
				MATTIE.fxAPI.hookLightmaskProto(proto);
			}
		};
		Spriteset_Map.prototype._vfxHooked = true;
		console.log('[vfxAPI] Hooked Spriteset_Map.createLightmask');
	}

	// Strategy 2: Attempt to hook existing instance if game is already running
	try {
		if (SceneManager._scene && SceneManager._scene._spriteset && SceneManager._scene._spriteset._lightmask) {
			const proto = Object.getPrototypeOf(SceneManager._scene._spriteset._lightmask);
			MATTIE.fxAPI.hookLightmaskProto(proto);
		}
	} catch (e) {
		// Scene might not be ready, ignore
	}
};

// Initial injection
MATTIE.fxAPI.injectHooks();

// Retry injection a few times just in case we loaded before SceneManager was ready
setTimeout(() => MATTIE.fxAPI.injectHooks(), 1000);
setTimeout(() => MATTIE.fxAPI.injectHooks(), 3000);
setTimeout(() => MATTIE.fxAPI.injectHooks(), 6000);

/**
 * @description a function to zoom in or out focused on the charecter in the middle of the screen
 * @param x the percentage to zoom, ie: 1 = none, .1 = 10x out 10 = 10x in.
 */
MATTIE.fxAPI.zoom = (x) => {
	const height = Graphics.boxHeight;
	const width = Graphics.boxWidth;
	$gameScreen.setZoom(width / 2, height / 2, x);
};
