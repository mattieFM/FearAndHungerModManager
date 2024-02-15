// TODO: make this less hacky in the future.
// TODO: add popup that appears if the user forgot to decompile the game before using the modmanager.

/**
 * @namespace MATTIE.compat
 * @description the name space used for compatibility changes
 * */
MATTIE.compat = MATTIE.compat || {};

/** @description whether decryption of images should be forcibly stopped or not */
MATTIE.compat.pauseDecrypt = false;

// override this so that when we request an image it will not try to decrypt it.
Bitmap.prototype._requestImage = function (url) {
	if (Bitmap._reuseImages.length !== 0) {
		this._image = Bitmap._reuseImages.pop();
	} else {
		this._image = new Image();
	}

	if (this._decodeAfterRequest && !this._loader) {
		this._loader = ResourceHandler.createLoader(url, this._requestImage.bind(this, url), this._onError.bind(this));
	}

	this._image = new Image();

	//---------------
	// very important
	//---------------

	// this line will fix the issue with caching images and let us update files during runtime.
	fetch(url, { cache: 'reload', mode: 'no-cors' });

	this._url = url;
	this._loadingState = 'requesting';
	const that = this;
	function otherLoad() {
		url.replace(".rpgmv", ".png")
		that._image.src = url;
		that._image.addEventListener('load', that._loadListener = Bitmap.prototype._onLoad.bind(that));
		that._image.addEventListener('error', that._errorListener = that._loader || Bitmap.prototype._onError.bind(that));
	}
	try {
		console.log(url);
	if (!Decrypter.checkImgIgnore(url) && Decrypter.hasEncryptedImages && !MATTIE.compat.pauseDecrypt && !url.contains(/.png/gi)) {
		if (Utils.isNwjs()) {
			var fs = require('fs');
			const fileExists = fs.existsSync(url);
			if(fileExists){
				this._loadingState = 'decrypting';
				Decrypter.decryptImg(url, this);
			} else {
				otherLoad();
			}
		} else {
			this._loadingState = 'decrypting';
			Decrypter.decryptImg(url, this);
		}
	} else {
		otherLoad();
	}
	} catch (error) {
		console.log("caught error:" + error)
		otherLoad();
	}
	
};

ImageManager.loadBitmap = function (folder, filename, hue, smooth, forceNoDecrypt = false) {
	// this is a hacky soltion but should work fine for now
	if (forceNoDecrypt) MATTIE.compat.pauseDecrypt = true;
	setTimeout(() => {
		MATTIE.compat.pauseDecrypt = false;
	}, 1000);
	if (filename) {
		const path = `${folder + encodeURIComponent(filename)}.png`;

		const bitmap = this.loadNormalBitmap(path, hue || 0);
		bitmap.smooth = smooth;
		return bitmap;
	}
	return this.loadEmptyBitmap();
};

/**
 * @description we override this such that it will not return an undefined result ever. Even if another mod fucks up
 * @todo I don't like this way of fixing this bug but does work.
 * @param unsafe, if true does not add anything
 * @returns {Game_Map} the datamap event obj
 */
MATTIE_RPG.Game_Event_Event = Game_Event.prototype.event;
Game_Event.prototype.event = function () {
	let val = MATTIE_RPG.Game_Event_Event.call(this);
	if (!val) val = $dataMap.events[1];
	if (!val) val = new MapEvent().data;
	return val;
};

// for some reason cheshire doesn't check if TY exists, so we will define it here.
const TY = {};

//------------------------------
// Termina Compatibility
//------------------------------
var Olivia = Olivia || false;
if (Olivia) {
	if (Olivia.AntiPlayerStress) {
		setTimeout(() => {
			Olivia.AntiPlayerStress.ProperErrorDisplay = false; // termina should use my error menu to
		}, 5000);
	}
}

//---------------------------------
// Engine Fixes
//---------------------------------

// this fixes the screen freeze

/**
 * Renders the stage to the game screen.
 *
 * @static
 * @method render
 * @param {Stage} stage The stage object to be rendered
 */
Graphics.render = function (stage) {
	if (this._skipCount <= 0) {
		const startTime = Date.now();
		if (stage) {
			this._renderer.render(stage);
			if (this._renderer.gl && this._renderer.gl.flush) {
				this._renderer.gl.flush();
			}
		}
		const endTime = Date.now();
		const elapsed = endTime - startTime;
		this._skipCount = Math.min(Math.floor(elapsed / 15), this._maxSkip);
		this._rendered = true;
	} else {
		this._skipCount--;
		this._rendered = false;
	}
	this.frameCount++;
};

Window_EquipItem.prototype.includes = function (item) {
	if (item === null || typeof item === 'undefined') {
		return true;
	}
	if (this._slotId < 0 || item.etypeId !== this._actor.equipSlots()[this._slotId]) {
		return false;
	}
	return this._actor.canEquip(item);
};

/**
 * @override
 * @description
 * we override this method to return an empty bit map if one does not exist, that way if something calls this before the bit map is initialized
 * it won't error and give time for this to init hopefully.
 * The bitmap used for the window contents.
 *
 * @property contents
 * @type Bitmap
 */
Object.defineProperty(Window.prototype, 'contents', {
	get() {
		return this._windowContentsSprite ? this._windowContentsSprite.bitmap : ImageManager.loadEmptyBitmap();
	},
	set(value) {
		if (this._windowContentsSprite) this._windowContentsSprite.bitmap = value;
	},
	configurable: true,
});

/**
 * @override
 * @description override this method the hopefully fix https://itch.io/post/8679462
 *
 */
MATTIE.compat.createLayerGraphics = Spriteset_Map.prototype.createLayerGraphics;
Spriteset_Map.prototype.createLayerGraphics = function () {
	this.layerGraphics = this.layerGraphics || {};
	MATTIE.compat.createLayerGraphics.call(this);
};
// FIX non existant items from loading other mods
Game_Party.prototype.items = function () {
	var list = [];
	for (var id in this._items) {
		if ($dataItems[id]) { list.push($dataItems[id]); }
	}
	return list;
};

Game_Party.prototype.weapons = function () {
	var list = [];
	for (var id in this._weapons) {
		if ($dataWeapons[id]) list.push($dataWeapons[id]);
	}
	return list;
};

Game_Party.prototype.armors = function () {
	var list = [];
	for (var id in this._armors) {
		if ($dataArmors[id]) list.push($dataArmors[id]);
	}
	return list;
};

//-----------------------------------------
// fixes the gitpixel not defined bug
//-----------------------------------------
Window_Base.prototype.textColor = function (n) {
	var px = 96 + (n % 8) * 12 + 6;
	var py = 144 + Math.floor(n / 8) * 12 + 6;
	const bitMap = this.windowskin || new Bitmap(px + 2, py + 2);
	return bitMap.getPixel(px, py);
};

Window_Base.prototype.pendingColor = function () {
	const bitMap = this.windowskin || new Bitmap(120 + 2, 120 + 2);
	return bitMap.getPixel(120, 120);
};

Game_Character.prototype.updateRoutineMove = function () {
	if (this._waitCount > 0) {
		this._waitCount--;
	} else {
		this.setMovementSuccess(true);
		if (this._moveRoute) {
			var command = this._moveRoute.list[this._moveRouteIndex];
			if (command) {
				this.processMoveCommand(command);
				this.advanceMoveRouteIndex();
			}
		}
	}
};
