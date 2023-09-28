var MATTIE = MATTIE || {};
MATTIE.menus = MATTIE.menus || {};
MATTIE.windows = MATTIE.windows || {};
MATTIE.scenes = MATTIE.scenes || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};
MATTIE.modLoader = MATTIE.modLoader || {};

MATTIE.scenes.base = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.scenes.base.prototype = Object.create(Scene_Base.prototype);
MATTIE.scenes.base.prototype.constructor = MATTIE.scenes.base;

MATTIE.scenes.base.prototype.create = function () {
	Scene_Base.prototype.create.call(this);
	this.createBackground();
};

MATTIE.scenes.base.prototype.createBackground = function () {
	this._backSprite2 = new Sprite(ImageManager.loadBitmap('mods/commonLibs/_common/images/', 'FearAndHungerModMan', 0, true, true));
	this.addChild(this._backSprite2);
	this._modListWin = new MATTIE.windows.ModListWin(0, 0);
	this.addChild(this._modListWin);
};

MATTIE.scenes.modLoader = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.scenes.modLoader.prototype = Object.create(MATTIE.scenes.base.prototype);
MATTIE.scenes.modLoader.prototype.constructor = MATTIE.scenes.modLoader;

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
