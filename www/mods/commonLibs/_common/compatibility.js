// TODO: make this less hacky in the future.
// TODO: add popup that appears if the user forgot to decompile the game before using the modmanager.

var MATTIE = MATTIE || {};
MATTIE.compat = MATTIE.compat || {};
MATTIE.compat.pauseDecrypt = false;

var Yanfly = Yanfly || false;

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

	//this line will fix the issue with caching images and let us update files during runtime.
	fetch(url, { cache: 'reload', mode: 'no-cors' })



	this._url = url;
	this._loadingState = 'requesting';

	if (!Decrypter.checkImgIgnore(url) && Decrypter.hasEncryptedImages && !MATTIE.compat.pauseDecrypt) {
		this._loadingState = 'decrypting';
		Decrypter.decryptImg(url, this);
	} else {
		this._image.src = url;

		this._image.addEventListener('load', this._loadListener = Bitmap.prototype._onLoad.bind(this));
		this._image.addEventListener('error', this._errorListener = this._loader || Bitmap.prototype._onError.bind(this));
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
 * @returns the datamap event obj
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
