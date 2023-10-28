var MATTIE = MATTIE || {};
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.TextManager.host = 'Host A Game';
MATTIE.TextManager.join = 'Join A Game';
MATTIE.TextManager.return = 'Return';
MATTIE.TextManager.newGame = 'New Game ';
MATTIE.TextManager.loadGame = 'Load Game';
MATTIE.CmdManager.host = 'MATTIE_host';
MATTIE.CmdManager.join = 'MATTIE_join';
MATTIE.CmdManager.return = 'MATTIE_return';
MATTIE.CmdManager.newGame = 'MATTIE_New_Game';
MATTIE.CmdManager.loadGame = 'MATTIE_Load_Game';

MATTIE.scenes.multiplayer.base = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.scenes.multiplayer.base.prototype = Object.create(Scene_Base.prototype);
MATTIE.scenes.multiplayer.base.prototype.constructor = MATTIE.scenes.multiplayer.base;

MATTIE.scenes.multiplayer.base.prototype.create = function () {
	Scene_Base.prototype.create.call(this);
	this.createBackground();
};

MATTIE.scenes.multiplayer.base.prototype.createBackground = function () {
	this._backSprite2 = new Sprite(ImageManager.loadBitmap('mods/_multiplayer/', 'multiPlayerMenu', 0, true, true));
	this.addChild(this._backSprite2);
};

/**
 * main scene
 */

MATTIE.scenes.multiplayer.main = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.scenes.multiplayer.main.prototype = Object.create(Scene_Title.prototype);
MATTIE.scenes.multiplayer.main.prototype.constructor = MATTIE.scenes.multiplayer.main;

MATTIE.scenes.multiplayer.main.prototype.create = function () {
	Scene_Title.prototype.create.call(this);
	this.addTextField();
	this._inputWin.updateText(MATTIE.multiplayer.clientController.player.name);
};

MATTIE.scenes.multiplayer.main.prototype.updateName = function () {
	const name = this._inputWin.getInput();
	MATTIE.multiplayer.clientController.player.name = name;
	MATTIE.multiplayer.hostController.player.name = name;
	MATTIE.DataManager.global.set('name', name);
};

MATTIE.scenes.multiplayer.main.prototype.createCommandWindow = function () {
	this._commandWindow = new MATTIE.windows.multiplayer.Main();

	this._commandWindow.setHandler(MATTIE.CmdManager.host, (() => {
		this._inputWin.close();
		this.updateName();
		MATTIE.menus.multiplayer.openHost();
	}));

	this._commandWindow.setHandler(MATTIE.CmdManager.join, (() => {
		this._inputWin.close();
		this.updateName();
		MATTIE.menus.multiplayer.openJoin();
	}));

	this._commandWindow.setHandler(MATTIE.CmdManager.return, (() => {
		this._inputWin.close();
		this.updateName();
		MATTIE.menus.toMainMenu();
	}));
	this.addWindow(this._commandWindow);
};

MATTIE.scenes.multiplayer.main.prototype.addTextField = function () {
	this._inputWin = new MATTIE.windows.TextInput(0, 0, 500, 150, 'Type Username:');
	this._inputWin.updateText(MATTIE.util.getName());
	this.addWindow(this._inputWin);
};

MATTIE.scenes.multiplayer.main.prototype.createBackground = function () {
	this._backSprite1 = new Sprite(ImageManager.loadTitle1($dataSystem.title1Name));
	this._backSprite2 = new Sprite(ImageManager.loadBitmap('mods/_multiplayer/', 'multiPlayerMenu', 0, true, true));
	this.addChild(this._backSprite1);
	this.addChild(this._backSprite2);
};

/**
 * main window
 */
MATTIE.windows.multiplayer.Main = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.windows.multiplayer.Main.prototype = Object.create(Window_TitleCommand.prototype);
MATTIE.windows.multiplayer.Main.prototype.constructor = MATTIE.windows.multiplayer.Main;

MATTIE.windows.multiplayer.Main.prototype.makeCommandList = function () {
	this.addCommand(MATTIE.TextManager.host, MATTIE.CmdManager.host);
	this.addCommand(MATTIE.TextManager.join, MATTIE.CmdManager.join);
	this.addCommand(MATTIE.TextManager.return, MATTIE.CmdManager.return);
};

/**
 * main window
 */
MATTIE.windows.multiplayer.StartWin = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.windows.multiplayer.StartWin.prototype = Object.create(Window_TitleCommand.prototype);
MATTIE.windows.multiplayer.StartWin.prototype.constructor = MATTIE.windows.multiplayer.StartWin;

MATTIE.windows.multiplayer.StartWin.prototype.makeCommandList = function () {
	this.addCommand(MATTIE.TextManager.newGame, MATTIE.CmdManager.newGame);
	this.addCommand(MATTIE.TextManager.loadGame, MATTIE.CmdManager.loadGame, DataManager.isAnySavefileExists());
};

/**
 * new game win
 */
MATTIE.windows.multiplayer.NewGameWin = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.windows.multiplayer.NewGameWin.prototype = Object.create(Window_TitleCommand.prototype);
MATTIE.windows.multiplayer.NewGameWin.prototype.constructor = MATTIE.windows.multiplayer.NewGameWin;

MATTIE.windows.multiplayer.NewGameWin.prototype.makeCommandList = function () {
	this.addCommand(MATTIE.TextManager.newGame, MATTIE.CmdManager.newGame);
};

//-----------------------------------
// Drop item menu stuff
//-----------------------------------

/**
 * // Scene_DevItems
 * @description a scene to spawn in items for dev
 * @extends Scene_Item
 */
MATTIE.scenes.Scene_DropItem = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.scenes.Scene_DropItem.prototype = Object.create(Scene_Item.prototype);
MATTIE.scenes.Scene_DropItem.prototype.constructor = MATTIE.scenes.Scene_DropItem;

MATTIE.scenes.Scene_DropItem.prototype.initialize = function () {
	Scene_Item.prototype.initialize.call(this);
	this.lastItem = null;
};

// override onItemOk to drop and remove item from inv rather than what it would do otherwise
MATTIE.scenes.Scene_DropItem.prototype.onItemOk = function () {
	$gameParty.loseItem(this.item(), 1, false);
	SceneManager.pop();
	SceneManager.pop();
	setTimeout(() => {
		MATTIE.eventAPI.addItemDropToCurrentMap(new Game_Item(this.item()));
	}, 500);
};
MATTIE_RPG.createItemWindow = MATTIE.scenes.Scene_DropItem.prototype.createItemWindow;
MATTIE.scenes.Scene_DropItem.prototype.createItemWindow = function () {
	MATTIE_RPG.createItemWindow.call(this);
	this._itemWindow.forceEnableAll();
};

// add our drop items tab to the menu
MATTIE_RPG.sceneMenuCmdwin = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function () {
	MATTIE_RPG.sceneMenuCmdwin.call(this);
	this._commandWindow.setHandler('MATTIE_DROP', () => {
		SceneManager.push(MATTIE.scenes.Scene_DropItem);
	});
	this._commandWindow.setHandler('MATTIE_HELP', () => {
		SceneManager.push(MATTIE.scenes.Scene_Misc);
	});
};
MATTIE_RPG.addMainCommands = Window_MenuCommand.prototype.addMainCommands;
Window_MenuCommand.prototype.addMainCommands = function () {
	MATTIE_RPG.addMainCommands.call(this);
	this.addCommand('Drop', 'MATTIE_DROP', true);
	this.addCommand('Help', 'MATTIE_HELP', true);
};

// MATTIE.eventAPI.addItemDropToCurrentMap(new Game_Item(MATTIE.static.items.emptyScroll));
