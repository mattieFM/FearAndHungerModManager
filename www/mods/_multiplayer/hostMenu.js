var MATTIE = MATTIE || {};
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};
MATTIE.TextManager.startGame = 'Start Game';
MATTIE.TextManager.returnToMultiplayer = 'Close Server';
MATTIE.CmdManager.startGame = 'MATTIE_Start_Game';
MATTIE.CmdManager.returnToMultiplayer = 'MATTIE_ReturnToMulti';
MATTIE.TextManager.copy = 'Copy Code';
MATTIE.CmdManager.copy = 'MATTIE_Copy_Code';
MATTIE.TextManager.show = 'Show/Hide';
MATTIE.CmdManager.show = 'MATTIE_Show_Hide';

/**
 * @description The scene for hosting a multiplayer game
 * @extends Scene_Base
 * @class
 */
MATTIE.scenes.multiplayer.host = function () {
	this.initialize.apply(this, arguments);
};
MATTIE.scenes.multiplayer.host.prototype = Object.create(MATTIE.scenes.multiplayer.base.prototype); // extend Scene_Base
MATTIE.scenes.multiplayer.host.prototype.constructor = MATTIE.scenes.multiplayer.host; // use constructor

MATTIE.scenes.multiplayer.host.prototype.create = function () {
	MATTIE.scenes.multiplayer.base.prototype.create.call(this);
	this.createWindowLayer();

	// Determine correct fallback state before opening controller
	if (MATTIE.multiplayer.userOverrideFallback === true) {
		MATTIE.multiplayer.forceFallback = true;
	} else if (MATTIE.multiplayer.userOverrideFallback === false) {
		MATTIE.multiplayer.forceFallback = false;
	}
	// If null (no override), allow auto-switch logic or defaults effectively.
	// But host open() is what initiates connections.

	MATTIE.multiplayer.hostController.open();
	this.addPlayerListWindow();
	this.addOptionsBtns();
	// this.addFallbackToggle(); // Removed separate toggle
	this.addPeerDisplayWindow();

	this._loadingInterval = setInterval(() => {
		this.animateTick();
	}, 500);

	// Setup fallback detection if not already forced
	if (!MATTIE.multiplayer.forceFallback && !MATTIE.multiplayer.fallbackAutoSwitched && MATTIE.multiplayer.userOverrideFallback === null) {
		this._connectionTimeout = setTimeout(() => {
			if (!MATTIE.multiplayer.hostController.peerId) {
				console.log('Connection timed out. Auto-switching to Fallback TCP.');
				MATTIE.multiplayer.fallbackAutoSwitched = true;
				MATTIE.multiplayer.forceFallback = true;
				MATTIE.multiplayer.hostController.open(); // Re-open with new settings

				// Re-bind to the new self instance
				this.bindToHostEvents();
			}
		}, 10000); // 10 seconds
	}

	this.bindToHostEvents();
};

MATTIE.scenes.multiplayer.host.prototype.bindToHostEvents = function () {
	if (MATTIE.multiplayer.hostController.self) {
		MATTIE.multiplayer.hostController.self.on('open', () => {
			if (this._connectionTimeout) clearTimeout(this._connectionTimeout);
			this.initListController();

			if (this._loadingInterval) {
				clearInterval(this._loadingInterval);
				this._loadingInterval = null;
			}

			this.showHideCode(true);
		});
	}
};

MATTIE.scenes.multiplayer.host.prototype.addPlayerListWindow = function () {
	this._playerWindow = new MATTIE.windows.List(0, 0, 600, 300, 'Connected Players:');
	this._playerWindow.updatePlacement(0, 15);
	this.addWindow(this._playerWindow);
};

MATTIE.scenes.multiplayer.host.prototype.initListController = function () {
	MATTIE.multiplayer.hostController.addListener('updateNetPlayers', () => {
		const arr = [];
		arr.push(MATTIE.multiplayer.hostController.player.name);
		for (key in MATTIE.multiplayer.hostController.netPlayers) {
			if (key) {
				const netPlayer = MATTIE.multiplayer.hostController.netPlayers[key];
				arr.push(netPlayer.name);
			}
		}

		this._playerWindow.updateText(arr);
	});

	this._playerWindow.updateText([MATTIE.multiplayer.hostController.player.name]);
};

MATTIE.scenes.multiplayer.host.prototype.showHideCode = function (hidden) {
	const text = [
		'People can join using this number:',
		hidden && MATTIE.multiplayer.hostController.peerId
			? '*'.repeat(MATTIE.multiplayer.hostController.peerId.length)
			: (MATTIE.multiplayer.hostController.peerId || 'Error getting ID'),
	];

	if (this._peerWindow) this._peerWindow.updateText(text);
};

MATTIE.scenes.multiplayer.host.prototype.animateTick = function () {
	const text = this._peerWindow.text;
	text[1] = text[1].endsWith('...') ? text[1].replace('...', '') : `${text[1]}.`;

	if (this._peerWindow) this._peerWindow.updateText(text);

	// Ensure fallback button text matches the variable state
	this.updateFallbackButtonState();
};

MATTIE.scenes.multiplayer.host.prototype.updateFallbackButtonState = function () {
	if (!this._optionsWindow || !this._optionsWindow._mattieBtns) return;

	// Determine target state string
	const targetText = `TCP: ${MATTIE.multiplayer.forceFallback ? 'ON' : 'OFF'}`;

	// Check if backing data needs update
	let currentKey = null;
	for (const key in this._optionsWindow._mattieBtns) {
		if (this._optionsWindow._mattieBtns[key] === 'TOGGLE_FALLBACK') {
			currentKey = key;
			break;
		}
	}

	// If key is missing or different, update and refresh
	if (currentKey && currentKey !== targetText) {
		delete this._optionsWindow._mattieBtns[currentKey];
		this._optionsWindow._mattieBtns[targetText] = 'TOGGLE_FALLBACK';
		this._optionsWindow.refresh();
	}
};

MATTIE.scenes.multiplayer.host.prototype.addPeerDisplayWindow = function () {
	const text = [
		'People can join using this number:',
		'Please wait for connection to broker',
	];
	this._peerWindow = new MATTIE.windows.TextDisplay((Graphics.boxWidth - 600) / 2 + 100, 0, 600, 100, text);
	this.addWindow(this._peerWindow);
};

MATTIE.scenes.multiplayer.host.prototype.addOptionsBtns = function () {
	const btns = {};
	btns[MATTIE.TextManager.copy] = MATTIE.CmdManager.copy;
	btns[MATTIE.TextManager.startGame] = MATTIE.CmdManager.startGame;
	btns[MATTIE.TextManager.show] = MATTIE.CmdManager.show;
	btns['Close Server'] = MATTIE.CmdManager.returnToMultiplayer;

	const fallbackText = `TCP: ${MATTIE.multiplayer.forceFallback ? 'ON' : 'OFF'}`;
	btns[fallbackText] = 'TOGGLE_FALLBACK';

	this._optionsWindow = new MATTIE.windows.HorizontalBtns(175 + 300 + 10, btns, 5);
	this._optionsWindow.setHandler(MATTIE.CmdManager.startGame, (() => {
		MATTIE.multiplayer.hostController.startGame();
		MATTIE.menus.multiplayer.openGame();
	}));
	this._optionsWindow.setHandler(MATTIE.CmdManager.returnToMultiplayer, (() => {
		MATTIE.multiplayer.getCurrentNetController().destroyAllConns();
		MATTIE.multiplayer.getCurrentNetController().resetNet();
		MATTIE.menus.multiplayer.openMultiplayer();
	}));

	let hidden = true;
	this._optionsWindow.setHandler(MATTIE.CmdManager.show, (() => {
		this.showHideCode(!hidden);
		hidden = !hidden;
		this._optionsWindow.activate();
	}));

	this._optionsWindow.setHandler(MATTIE.CmdManager.copy, (() => {
		MATTIE.clipboard.put(MATTIE.multiplayer.hostController.peerId || '');
		this._optionsWindow.activate();
	}));

	this._optionsWindow.setHandler('TOGGLE_FALLBACK', () => {
		const newState = !MATTIE.multiplayer.forceFallback;
		MATTIE.multiplayer.forceFallback = newState;
		MATTIE.multiplayer.userOverrideFallback = newState;

		// Immediately update button state (also handled by animateTick if running)
		this.updateFallbackButtonState();

		this._optionsWindow.activate();

		MATTIE.multiplayer.hostController.open();

		// Restart loading animation while we wait for new connection
		if (!this._loadingInterval) {
			this._loadingInterval = setInterval(() => {
				this.animateTick();
			}, 500);
		}

		this.bindToHostEvents();
	});

	this.addWindow(this._optionsWindow);
	this._optionsWindow.updateWidth(600);
	this._optionsWindow.updatePlacement(175 + 300 + 10);
};
