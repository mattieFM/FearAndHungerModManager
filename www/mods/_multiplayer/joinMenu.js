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

	// Ensure we respect user override or current state
	if (MATTIE.multiplayer.userOverrideFallback === true) {
		MATTIE.multiplayer.forceFallback = true;
	} else if (MATTIE.multiplayer.userOverrideFallback === false) {
		MATTIE.multiplayer.forceFallback = false;
	}

	this.addOptionsBtns();
	this.addTextField();
	// this.addFallbackToggle();
};

MATTIE.scenes.multiplayer.join.prototype.addFallbackToggle = function () {
	const text = `Use TCP Fallback: ${MATTIE.multiplayer.forceFallback ? '[ON]' : '[OFF]'}`;
	const btns = {};
	btns[text] = 'TOGGLE_FALLBACK';

	this._fallbackWin = new MATTIE.windows.HorizontalBtns(200, btns, 1); // Position below text input
	this._fallbackWin.x = 20;
	this._fallbackWin.width = 300;

	this._fallbackWin.setHandler('TOGGLE_FALLBACK', () => {
		const newState = !MATTIE.multiplayer.forceFallback;
		MATTIE.multiplayer.forceFallback = newState;
		MATTIE.multiplayer.userOverrideFallback = newState; // User manual overrides auto logic

		this._fallbackWin._list[0].name = `Use TCP Fallback: ${newState ? '[ON]' : '[OFF]'}`;
		this._fallbackWin.refresh();
		this._fallbackWin.activate();
	});
	this.addWindow(this._fallbackWin);
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
		const inputVal = (this._inputWin.getInput()).trim();

		// Regex to detect IP addresses (IP, IP:Port, IP_Suffix, IP:Port_Suffix)
		const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?(_[\w]+)?$/;
		let decodedHostId = inputVal;

		// If input matches IP pattern directly, use it as-is (Raw IP)
		if (ipRegex.test(inputVal)) {
			console.log('Input detected as raw IP address');
			decodedHostId = inputVal;
		} else {
			// Otherwise try to decode base64
			try {
				const decoded = atob(inputVal);
				decodedHostId = decoded;
				console.log('Decoded peer ID from base64');
			} catch (e) {
				console.warn('Input is not base64, using as-is (legacy/raw format)');
				decodedHostId = inputVal;
			}
		}

		MATTIE.multiplayer.clientController.hostId = decodedHostId;

		// Auto-detect IP format if no user override is set
		if (MATTIE.multiplayer.userOverrideFallback === null) {
			const isIpLike = ipRegex.test(decodedHostId);
			if (isIpLike) {
				console.log('Detected IP address input, auto-switching to Fallback TCP.');
				MATTIE.multiplayer.forceFallback = true;
				// Update UI for clarity
				if (this._fallbackWin) {
					this._fallbackWin._list[0].name = 'Use TCP Fallback: [ON]';
					this._fallbackWin.refresh();
				}
			} else {
				// Assume PeerJS ID
				MATTIE.multiplayer.forceFallback = false;
			}
		}

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

// Ensure event listeners are cleaned up when leaving the scene
MATTIE.scenes.multiplayer.join.prototype.terminate = function () {
	if (this._inputWin) {
		this._inputWin.close();
	}
	MATTIE.scenes.multiplayer.base.prototype.terminate.call(this);
};
