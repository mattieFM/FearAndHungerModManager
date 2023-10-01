var MATTIE = MATTIE || {};
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};

/**
 * start game scene
 */

MATTIE.scenes.multiplayer.startGame = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.scenes.multiplayer.startGame.prototype = Object.create(Scene_Title.prototype);
MATTIE.scenes.multiplayer.startGame.prototype.constructor = MATTIE.scenes.multiplayer.startGame;

MATTIE.scenes.multiplayer.startGame.prototype.create = function () {
	Scene_Title.prototype.create.call(this);
};

MATTIE.scenes.multiplayer.startGame.prototype.createCommandWindow = function () {
	this._commandWindow = new MATTIE.windows.multiplayer.StartWin();

	this._commandWindow.setHandler(MATTIE.CmdManager.newGame, (() => {
		MATTIE.menus.toNewMenu();
	}));

	this._commandWindow.setHandler(MATTIE.CmdManager.loadGame, (() => {
		MATTIE.menus.toLoadMenu();
	}));

	this.addWindow(this._commandWindow);
};

MATTIE.scenes.multiplayer.startGame.prototype.createBackground = function () {
	this._backSprite1 = new Sprite(ImageManager.loadTitle1($dataSystem.title1Name));
	this._backSprite2 = new Sprite(ImageManager.loadBitmap('mods/_multiplayer/', 'multiPlayerMenu', 0, true, true));
	this.addChild(this._backSprite1);
	this.addChild(this._backSprite2);
};

/**
 * new game scene
 */

MATTIE.scenes.multiplayer.newGame = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.scenes.multiplayer.newGame.prototype = Object.create(Scene_Title.prototype);
MATTIE.scenes.multiplayer.newGame.prototype.constructor = MATTIE.scenes.multiplayer.newGame;

MATTIE.scenes.multiplayer.newGame.prototype.create = function () {
	Scene_Title.prototype.create.call(this);
};

MATTIE.scenes.multiplayer.newGame.prototype.createCommandWindow = function () {
	this._commandWindow = new MATTIE.windows.multiplayer.NewGameWin();

	this._commandWindow.setHandler(MATTIE.CmdManager.newGame, (() => {
		MATTIE.menus.toNewMenu();
	}));

	this.addWindow(this._commandWindow);
};

MATTIE.scenes.multiplayer.newGame.prototype.createBackground = function () {
	this._backSprite1 = new Sprite(ImageManager.loadTitle1($dataSystem.title1Name));
	this._backSprite2 = new Sprite(ImageManager.loadBitmap('mods/_multiplayer/', 'multiPlayerMenu', 0, true, true));
	this.addChild(this._backSprite1);
	this.addChild(this._backSprite2);
};
