// TODO: make this less hacky in the future.
// TODO: add popup that appears if the user forgot to decompile the game before using the modmanager.

/**
 * @namespace MATTIE.compat
 * @description the name space used for compatibility changes
 * */
MATTIE.compat = MATTIE.compat || {};
MATTIE.compat.terminaBlockedMods = ['bossRushOfTheEndless'];

MATTIE.compat.shouldBlockModOnTermina = function (modName) {
	const isTermina = MATTIE.global && MATTIE.global.version === 2;
	return isTermina && MATTIE.compat.terminaBlockedMods.includes(modName);
};

/** @description whether decryption of images should be forcibly stopped or not */
MATTIE.compat.pauseDecrypt = false;

/**
 * @description weather or not files should be decrypted and saved to their unencrypted sate while playing the game
 * this has some benefits and some drawbacks. This should not be any better than leaving the files encrypted as it decrypts them first anyways
 * this might be useful for some edge cases though.
 * @default false
 */
MATTIE.compat.runtime_decrypt = false;

/**
 * @description set the field hasEncryptedImages to true or false in memory and system.json
 * @param {boolean} bool
 */
MATTIE.compat.setEncryptedImagesInSystemJson = function (bool) {
	const fs = require('fs');
	sysJsonPath = `${MATTIE.DataManager.localGamePath()}/data/System.json`;
	Decrypter.hasEncryptedImages = bool;
	// console.log('system.json loading');
	if (fs.existsSync(sysJsonPath)) {
		// console.log('system.json found');
		contents = JSON.parse(fs.readFileSync(sysJsonPath));
		contents.hasEncryptedImages = bool;
		contents = JSON.stringify(contents);
		fs.writeFileSync(sysJsonPath, contents);
	}
	// console.log('system.json updated');
};

Bitmap.prototype.decryptAndSave = function (url) {
	let pngUrl = `${MATTIE.DataManager.localGamePath()}/`;
	let rpgMVPUrl = `${pngUrl}/`;
	if (url.endsWith('.rpgmvp')) {
		rpgMVPUrl += url;
		pngUrl += url.replace('.rpgmvp', '.png');
	} else if (url.endsWith('.png')) {
		rpgMVPUrl += url.replace('.png', '.rpgmvp');
		pngUrl += url;
	}

	pngUrl = decodeURIComponent(pngUrl);
	rpgMVPUrl = decodeURIComponent(rpgMVPUrl);

	this._loadingState = 'decrypting';
	Decrypter.decryptImg(pngUrl, this);
	// MATTIE.imageAPI.saveBitmapToFile(this,pngUrl)
	// console.log('image decrypted');
};

/**
 * @description a loader for assets that can load encrypted and unencrypted files
 * slightly heavier as it is using fs.existssync
 */
Bitmap.prototype.compatabilityLoad = function (url, force = false) {
	var fs = require('fs');

	try {
		let pngUrl = `${MATTIE.DataManager.localGamePath()}/`;
		let rpgMVPUrl = `${pngUrl}/`;

		if (url.endsWith('.rpgmvp')) {
			rpgMVPUrl += url;
			pngUrl += url.replace('.rpgmvp', '.png');
		} else if (url.endsWith('.png')) {
			rpgMVPUrl += url.replace('.png', '.rpgmvp');
			pngUrl += url;
		}

		// pngUrl = decodeURIComponent(pngUrl);
		// rpgMVPUrl = decodeURIComponent(rpgMVPUrl);

		// console.log(rpgMVPUrl);

		rpgmakerWantsToDecrypt = !Decrypter.checkImgIgnore(url) && Decrypter.hasEncryptedImages;
		modmanagerWantsToDecrypt = fs.existsSync(rpgMVPUrl) && !MATTIE.compat.pauseDecrypt;
		cannotUseEncrypted = !fs.existsSync(rpgMVPUrl) && fs.existsSync(pngUrl);

		/// /console.log(`modmanger want to decrypt:${modmanagerWantsToDecrypt}\nrpgmakerwantstodecrypt${rpgmakerWantsToDecrypt}`);
		if (((rpgmakerWantsToDecrypt) || force || (fs.existsSync(rpgMVPUrl) && !fs.existsSync(pngUrl))) && !MATTIE.compat.pauseDecrypt && !cannotUseEncrypted) {
			if (Utils.isNwjs()) {
				this._loadingState = 'decrypting';
				Decrypter.decryptImg(pngUrl, this);
				// console.log(pngUrl);
				if (MATTIE.compat.runtime_decrypt) MATTIE.imageAPI.saveBitmapToFile(this, pngUrl);
				/// /console.log('image decrypted');
			}
		} else if (pngUrl) {
		// this line will fix the issue with caching images and let us update files during runtime.
			fetch(url, { cache: 'reload', mode: 'no-cors' });

			// load image
			url.replace('.rpgmvp', '.png');
			this._image.src = url;
			this._image.addEventListener('load', this._loadListener = Bitmap.prototype._onLoad.bind(this));
			this._image.addEventListener('error', this._errorListener = this._loader || Bitmap.prototype._onError.bind(this));
		}
	} catch (error) {
		// console.log(`caught error:${error}`);
	}
};

// override this so that when we request an image it will not try to decrypt it.
Bitmap.prototype._requestImage = function (url) {
	// console.log(url);
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

	this._url = url;
	this._loadingState = 'requesting';

	this.compatabilityLoad(url);
};

ImageManager.loadBitmap = function (folder, filename, hue, smooth, forceNoDecrypt = false) {
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
	if (!this.windowskin || !this.windowskin.isReady()) return '#ffffff'; // Fallback if windowskin is missing
	var px = 96 + (n % 8) * 12 + 6;
	var py = 144 + Math.floor(n / 8) * 12 + 6;
	if (this.windowskin.width < px || this.windowskin.height < py) return '#ffffff'; // Fallback if skin too small
	return this.windowskin.getPixel(px, py); // This line is likely the source of the error
};

Window_Base.prototype.pendingColor = function () {
	const bitMap = this.windowskin || new Bitmap(120 + 2, 120 + 2);
	if (!bitMap.isReady()) return '#ffffff';
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

//-----------------------------------------
// Fixes invisible cursor/pause sign/arrows
//-----------------------------------------

/**
 * @description Fix to ensure windowskin is ready before refreshing cursor
 */
MATTIE.compat.Window_refreshCursor = Window.prototype._refreshCursor;
Window.prototype._refreshCursor = function () {
	if (this._windowskin && !this._windowskin.isReady()) {
		this._windowskin.addLoadListener(this._refreshCursor.bind(this));
		return;
	}
	MATTIE.compat.Window_refreshCursor.call(this);
};

/**
 * @description Fix to ensure windowskin is ready before refreshing pause sign
 */
MATTIE.compat.Window_refreshPauseSign = Window.prototype._refreshPauseSign;
Window.prototype._refreshPauseSign = function () {
	if (this._windowskin && !this._windowskin.isReady()) {
		this._windowskin.addLoadListener(this._refreshPauseSign.bind(this));
		return;
	}
	MATTIE.compat.Window_refreshPauseSign.call(this);
};

/**
 * @description Fix to ensure windowskin is ready before refreshing arrows
 */
MATTIE.compat.Window_refreshArrows = Window.prototype._refreshArrows;
Window.prototype._refreshArrows = function () {
	if (this._windowskin && !this._windowskin.isReady()) {
		this._windowskin.addLoadListener(this._refreshArrows.bind(this));
		return;
	}
	MATTIE.compat.Window_refreshArrows.call(this);
};

//-----------------------------------------
// Termina menu icon compatibility
//-----------------------------------------

/**
 * @description In Termina, some modded menu paths call Window_Command.drawItem directly,
 * which can pick up ARP legacy icon mappings intended for F&H1.
 * For menu command windows, draw default text-only commands to preserve Termina behavior.
 */
MATTIE.compat.Window_Command_drawItem = Window_Command.prototype.drawItem;
Window_Command.prototype.drawItem = function (index) {
	const isTermina = MATTIE.global && MATTIE.global.version === 2;
	const isMenuCommandWindow = this instanceof Window_MenuCommand || this instanceof Window_GameEnd;
	if (isTermina && isMenuCommandWindow) {
		var rect = this.itemRectForText(index);
		var align = this.itemTextAlign();
		var symbol = this.commandSymbol(index);
		var iconMap = {
			item: 1,
			equip: 2,
			synthesis: 3,
			skill: 4,
			status: 5,
			gameEnd: 6,
			options: 7,
		};
		this.resetTextColor();
		this.changePaintOpacity(this.isCommandEnabled(index));
		if (iconMap[symbol]) {
			this.drawIcon(iconMap[symbol], rect.x - 4, rect.y + 2);
			rect.x += 30;
			rect.width -= 30;
		}
		this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
		return;
	}
	MATTIE.compat.Window_Command_drawItem.call(this, index);
};

//-----------------------------------------
// Termina incompatible mod blocking
//-----------------------------------------
if (typeof ModManager !== 'undefined') {
	MATTIE.compat.ModManager_getModActive = ModManager.prototype.getModActive;
	ModManager.prototype.getModActive = function (modName) {
		if (MATTIE.compat.shouldBlockModOnTermina(modName)) return false;
		return MATTIE.compat.ModManager_getModActive.call(this, modName);
	};

	MATTIE.compat.ModManager_switchStatusOfMod = ModManager.prototype.switchStatusOfMod;
	ModManager.prototype.switchStatusOfMod = function (modName) {
		if (MATTIE.compat.shouldBlockModOnTermina(modName)) return;
		MATTIE.compat.ModManager_switchStatusOfMod.call(this, modName);
	};
}
