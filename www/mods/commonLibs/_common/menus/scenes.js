var MATTIE = MATTIE || {};
MATTIE.menus = MATTIE.menus || {};
MATTIE.windows = MATTIE.windows || {};
MATTIE.scenes = MATTIE.scenes || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};
MATTIE.modLoader = MATTIE.modLoader || {};

MATTIE.scenes.base = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.scenes.base.prototype = Object.create(Scene_Base.prototype);
MATTIE.scenes.base.prototype.constructor = MATTIE.scenes.base;

MATTIE.scenes.base.prototype.create = function (){
    Scene_Base.prototype.create.call(this);
    this.createBackground();
}

MATTIE.scenes.base.prototype.createBackground = function() {
    this._backSprite2 = new Sprite(ImageManager.loadBitmap("mods/commonLibs/_common/images/","FearAndHungerModMan",0,true, true));
    this.addChild(this._backSprite2);
    this._modListWin = new MATTIE.windows.modListWin(0,0);
    this.addChild(this._modListWin);
};

MATTIE.scenes.modLoader = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.scenes.modLoader.prototype = Object.create(MATTIE.scenes.base.prototype);
MATTIE.scenes.modLoader.prototype.constructor = MATTIE.scenes.modLoader;
