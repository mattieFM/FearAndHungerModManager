var MATTIE = MATTIE || {};
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};
MATTIE.TextManager.disconnect = 'Disconnect';
MATTIE.CmdManager.disconnect = 'MATTIE_Deconnect';
MATTIE.TextManager.forceStart = 'Join Mid Game';
MATTIE.CmdManager.forceStart = 'MATTIE_Force_start';
MATTIE.helpOncePerSession = false;
/**
 * @description The scene for hosting a multiplayer game
 * @extends MATTIE.scenes.multiplayer.base
 */
MATTIE.scenes.multiplayer.lobby = function () {
	this.initialize.apply(this, arguments);
};
MATTIE.scenes.multiplayer.lobby.prototype = Object.create(MATTIE.scenes.multiplayer.base.prototype); // extend Scene_Base
MATTIE.scenes.multiplayer.lobby.prototype.constructor = MATTIE.scenes.multiplayer.lobby; // use constructor

MATTIE.scenes.multiplayer.lobby.prototype.create = function () {
	MATTIE.scenes.multiplayer.base.prototype.create.call(this);
	this.createWindowLayer();

	this.connected = false;

	setTimeout(() => {
		if (!this.connected) {
			this._connectionStatusField.updateText('NOT CONNECTED, Taking longer than expected...');
		}
		setTimeout(() => {
			if (!this.connected) {
				if (!MATTIE.helpOncePerSession) {
					// only ever open this tab once per session
					MATTIE.helpOncePerSession = true;
					window.open('./mods/commonLibs/docs/tutorial-connectionHelp.html', '_blank').focus();
				}

				this._connectionStatusField.updateText('NOT CONNECTED!');
			}
		}, 10000);
	}, 15000);

	MATTIE.multiplayer.clientController.addListener('clientConnectedToHost', () => {
		this._connectionStatusField.updateText('Connected');
		this.connected = true;
		console.log('connected');
	});

	MATTIE.multiplayer.clientController.open();

	if (!MATTIE.multiplayer.clientController.self) {
		MATTIE.multiplayer.clientController.self.on('open', () => {
			this.addPlayerListWindow();
			this.initListController();
		});
	} else {
		this.addPlayerListWindow();
		this.initListController();
	}
	const btns = {};
	btns[MATTIE.TextManager.disconnect] = MATTIE.CmdManager.disconnect;
	btns[MATTIE.TextManager.forceStart] = MATTIE.CmdManager.forceStart;
	this._optionsWindow = new MATTIE.windows.HorizontalBtns(175 + 300 + 10, btns, 2);
	this._optionsWindow.setHandler(MATTIE.CmdManager.disconnect, (() => {
		MATTIE.multiplayer.clientController.disconnectAllConns();
		MATTIE.menus.multiplayer.openMultiplayer();
	}));

	this._optionsWindow.setHandler(MATTIE.CmdManager.forceStart, (() => {
		MATTIE.multiplayer.clientController.emit('startGame');
	}));

	this.addConnectionDisplayWindow();

	this.addWindow(this._optionsWindow);
	this._optionsWindow.updateWidth(600);
	this._optionsWindow.updatePlacement(175 + 300 + 10);
};

MATTIE.scenes.multiplayer.lobby.prototype.addConnectionDisplayWindow = function () {
	const text = [
		'Attempting to connect...',
	];
	this._connectionStatusField = new MATTIE.windows.TextDisplay((Graphics.boxWidth - 600) / 2 + 100, 0, 600, 100, text);
	this.addWindow(this._connectionStatusField);
};

MATTIE.scenes.multiplayer.lobby.prototype.addPlayerListWindow = function () {
	this._playerWindow = new MATTIE.windows.List(0, 0, 600, 300, 'Connected Players:');
	this._playerWindow.updatePlacement(0, 15);
	this.addWindow(this._playerWindow);
};

MATTIE.scenes.multiplayer.lobby.prototype.initListController = function () {
	var clientController = MATTIE.multiplayer.clientController;
	clientController.addListener('updateNetPlayers', (netPlayers) => {
		this.updateList(netPlayers);
	});

	clientController.addListener('startGame', () => {
		MATTIE.menus.multiplayer.openGame();
	});

	this.updateList(clientController.netPlayers);
};
MATTIE.scenes.multiplayer.lobby.prototype.updateList = function (list) {
	const arr = [];
	for (key in list) {
		if (key) {
			const netPlayer = list[key];
			arr.push(netPlayer.name);
		}
	}
	arr.push(MATTIE.multiplayer.clientController.player.name);
	this._playerWindow.updateText(arr);
};