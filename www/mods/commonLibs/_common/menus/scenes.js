MATTIE.menus = MATTIE.menus || {};
MATTIE.windows = MATTIE.windows || {};
MATTIE.scenes = MATTIE.scenes || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};
MATTIE.modLoader = MATTIE.modLoader || {};


MATTIE.TextManager.decryptBtn="Decrypt Game"
MATTIE.CmdManager.decryptBtn="CMD_Decrypt"
MATTIE.TextManager.encryptBtn = "Encrypt Game"
MATTIE.CmdManager.encryptBtn = "CMD_Encrypt"

/**
 * @class
 * @description the base menu page with the manager logo
 * */
MATTIE.scenes.base = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.scenes.base.prototype = Object.create(Scene_Base.prototype);
MATTIE.scenes.base.prototype.constructor = MATTIE.scenes.base;

MATTIE.scenes.base.prototype.create = function () {
	Scene_Base.prototype.create.call(this);
	this.createBackground();
};

/**
 * @override the create background function to have the modmanager background logo
 */
MATTIE.scenes.base.prototype.createBackground = function () {
	this._backSprite2 = new Sprite(ImageManager.loadBitmap('mods/commonLibs/_common/images/', 'FearAndHungerModMan', 0, true, true));
	this.addChild(this._backSprite2);
};

//-----------------------------------
// Mod loader Scene 
//-----------------------------------

/**
 * @class the main scene for the mod list page or the modloader itself depending on how you view it.
 */
MATTIE.scenes.modLoader = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.scenes.modLoader.prototype = Object.create(MATTIE.scenes.base.prototype);
MATTIE.scenes.modLoader.prototype.constructor = MATTIE.scenes.modLoader;

/**
 * @override we add the mods list window here.
 */
MATTIE.scenes.modLoader.prototype.create = function () {
	MATTIE.scenes.base.prototype.create.call(this)
	console.log("modloader create")
	this.addModsListWindow()
}

/**
 * a method that adds the mods list window to the page
 */
MATTIE.scenes.modLoader.prototype.addModsListWindow = function () {
	this._modListWin = new MATTIE.windows.ModListWin(0, 0);
	this.addChild(this._modListWin);
};

//-----------------------------------
// Decrypter Scene 
//-----------------------------------

MATTIE.scenes.decrypter = function () {
	this.initialize.apply(this, arguments);
	this.text3="test"
};

MATTIE.scenes.decrypter.prototype = Object.create(MATTIE.scenes.base.prototype);
MATTIE.scenes.decrypter.prototype.constructor = MATTIE.scenes.decrypter;

/**
 * @override we add the mods list window here.
 */
MATTIE.scenes.decrypter.prototype.create = function () {
	MATTIE.scenes.base.prototype.create.call(this)
	this.createWindowLayer();
	this.addWins()
	this.setupHandlers()
	
}

/**add all wins for this scene */
MATTIE.scenes.decrypter.prototype.addWins = function(){
	this.addDecryptBtn()
	this.addTextWindow()
}

/**add the window that shows information and text for this scene */
MATTIE.scenes.decrypter.prototype.addTextWindow = function () {
	const text = [
		'This is the decryption utility page It will let',
		'you encrypt and decrypt all applicable files.',
	];
	this._textDisplayWin = new MATTIE.windows.TextDisplay(0,0,600,200, text);
	this._textDisplayWin.updatePlacement()
	this.addWindow(this._textDisplayWin);

	const text2 = [
		`RPGMaker Status: ${Decrypter.hasEncryptedImages?"Encrypted":"Decrypted"}`,
		`Files Status: ${Decrypter.hasEncryptedImages?"Encrypted":"Decrypted"}`,
	];
	this._decryptStatusWin = new MATTIE.windows.TextDisplay(0,0,400,100, text2);
	this._decryptStatusWin.updatePlacement(100,-200)
	this.addWindow(this._decryptStatusWin);

	// Create the tooltip window
    this._tooltipWindow = new MATTIE.windows.Window_Tooltip(0,0,"hiya");
    this.addWindow(this._tooltipWindow);

}


/**
 * a method that adds the decrypt btn to the page
 */
MATTIE.scenes.decrypter.prototype.addDecryptBtn = function () {
	const btns = {};
	btns[MATTIE.TextManager.decryptBtn] = MATTIE.CmdManager.decryptBtn;
	btns[MATTIE.TextManager.encryptBtn] = MATTIE.CmdManager.encryptBtn;
	this._decryptBtn = new MATTIE.windows.HorizontalBtns(175 + 300 + 10, btns, 2);
	this.addWindow(this._decryptBtn)
};

/**
 * setup all handlers for this scene
 */
MATTIE.scenes.decrypter.prototype.setupHandlers = function() {
	this._decryptBtn.setHandler(MATTIE.CmdManager.decryptBtn, (() => {
		console.log("hiya")
		//call activate so we dont get locked out
		this._decryptBtn.activate();
	}));
	
	this._decryptBtn.setHandler(MATTIE.CmdManager.encryptBtn, (() => {
		console.log("hiya")
		//call activate so we dont get locked out
		this._decryptBtn.activate();
	}));
	this._decryptBtn.setHandler('cancel', this.popScene.bind(this));
}






//-----------------------------------
// Window Item List Overrides @override
//-----------------------------------
// forces all items to be enabled for menu use
Window_ItemList.prototype.forceEnableAll = function () {
	this.forceEnable = true;
};

Window_ItemList.prototype.isCurrentItemEnabled = function () {
	return this.forceEnable || this.isEnabled(this.item());
};

Window_ItemList.prototype.isEnabled = function (item) {
	return this.forceEnable || $gameParty.canUse(item);
};
