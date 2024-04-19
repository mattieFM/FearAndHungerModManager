var MATTIE = MATTIE || {};
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};
MATTIE.TextManager.joinGame = 'Join';
MATTIE.TextManager.returnToMultiplayer = 'Return';
MATTIE.CmdManager.joinGame = 'MATTIE_Join_Game';
MATTIE.CmdManager.returnToMultiplayer = 'MATTIE_ReturnToMulti';
MATTIE.TextManager.reconnect = 'Reconnect';
MATTIE.CmdManager.reconnect = 'MATTIE_Reconnect';

/**
 * @description The scene for hosting a multiplayer game
 * @extends Scene_Base
 * @class
 */
MATTIE.scenes.multiplayer.join = function () {
	this.initialize.apply(this, arguments);
};
MATTIE.scenes.multiplayer.join.prototype = Object.create(MATTIE.scenes.multiplayer.base.prototype); // extend Scene_Base
MATTIE.scenes.multiplayer.join.prototype.constructor = MATTIE.scenes.multiplayer.join; // use constructor

MATTIE.scenes.multiplayer.join.prototype.create = function () {
	MATTIE.scenes.multiplayer.base.prototype.create.call(this);
	this.createWindowLayer();
	this.addOptionsBtns();
	this.addTextField();
};
MATTIE.scenes.multiplayer.join.prototype.addTextField = function () {
	this._inputWin = new MATTIE.windows.TextInput(0, 0, 500, 150, 'Enter your connection key below:');
	this.addWindow(this._inputWin);
};
MATTIE.scenes.multiplayer.join.prototype.addOptionsBtns = function () {
	const btns = {};
	btns[MATTIE.TextManager.joinGame] = MATTIE.CmdManager.joinGame;
	btns[MATTIE.TextManager.returnToMultiplayer] = MATTIE.CmdManager.returnToMultiplayer;
	btns[MATTIE.TextManager.reconnect] = MATTIE.CmdManager.reconnect;
	const enabled = {};
	enabled[MATTIE.TextManager.reconnect] = {};
	const netCont = MATTIE.multiplayer.getCurrentNetController();
	enabled[MATTIE.TextManager.reconnect].val = netCont ? netCont.canTryToReconnect : false;

	this._optionsWindow = new MATTIE.windows.HorizontalBtns(175 + 300 + 10, btns, 3, enabled);

	this._optionsWindow.setHandler(MATTIE.CmdManager.joinGame, (() => {
		this._inputWin.close();
		MATTIE.multiplayer.clientController.hostId = (this._inputWin.getInput()).trim();
		MATTIE.menus.multiplayer.openLobby();
	}));

	this._optionsWindow.setHandler(MATTIE.CmdManager.returnToMultiplayer, (() => {
		this._inputWin.close();
		MATTIE.menus.multiplayer.openMultiplayer();
	}));

	this._optionsWindow.setHandler(MATTIE.CmdManager.reconnect, (() => {
		this._inputWin.close();
		MATTIE.multiplayer.getCurrentNetController().reconnectAllConns();
		MATTIE.menus.multiplayer.openGame();
	}));

	this.addWindow(this._optionsWindow);
	this._optionsWindow.updateWidth(600);
	this._optionsWindow.updatePlacement(175 + 300 + 10);
};
