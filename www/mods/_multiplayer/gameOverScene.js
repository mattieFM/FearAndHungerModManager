/* eslint-disable no-nested-ternary */
var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.TextManager.returnToTitle = 'Stop Thinking';
MATTIE.CmdManager.returnToTitle = 'MATTIE_ReturnToTitle';

MATTIE.TextManager.spectate = 'Wander as a lost soul';
MATTIE.CmdManager.spectate = 'MATTIE_Spectate';

MATTIE.TextManager.bornAnew = 'Be born anew';
MATTIE.CmdManager.bornAnew = 'rebirth';

MATTIE.scenes.multiplayer.Scene_GameOver = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.scenes.multiplayer.Scene_GameOver.prototype = Object.create(Scene_Base.prototype);
MATTIE.scenes.multiplayer.Scene_GameOver.prototype.constructor = MATTIE.scenes.multiplayer.Scene_GameOver;

MATTIE.scenes.multiplayer.Scene_GameOver.prototype.initialize = function () {
	Scene_Base.prototype.initialize.call(this);
};

MATTIE.scenes.multiplayer.Scene_GameOver.prototype.create = function () {
	MATTIE.multiplayer.BattleController.emitTurnEndEvent();
	MATTIE.multiplayer.getCurrentNetController().emitBattleEndEvent($gameTroop._troopId, MATTIE.multiplayer.currentBattleEnemy);

	Scene_Base.prototype.create.call(this);
	this.playGameoverMusic();

	this.createBackground();
	this.createWindowLayer();

	const btns = {};
	btns[MATTIE.TextManager.returnToTitle] = MATTIE.CmdManager.returnToTitle;
	btns[MATTIE.TextManager.spectate] = MATTIE.CmdManager.spectate;
	btns[MATTIE.TextManager.bornAnew] = MATTIE.CmdManager.bornAnew;

	const text = `
	You have died, the dungeons of fear and hunger have 
	\nclaimed one more soul. 
	\n\nAnd yet...
	\n\nWithout a body, you remain.
	\nSome aspect of your mind, preserved.
	\nEven in death the forces at work in these dungeons can 
	\nstill reach you.`;
	this._textWin = new MATTIE.windows.TextDisplay(0, 0, 700, 300, '');

	this.addWindow(this._textWin);
	this._textWin.updatePlacement();
	this._optionsWindow = new MATTIE.windows.HorizontalBtns(175 + 300 + 10, btns, 3);
	this.addWindow(this._optionsWindow);
	this._optionsWindow.updateWidth(600);
	this._optionsWindow.updatePlacement(175 + 300 + 10);

	this._optionsWindow.setHandler(MATTIE.CmdManager.returnToTitle, (() => {
		this.animateText('You quiet your mind, and over time cease to be.\nBut whether your soul ever escaped these dungeons... ', 0.1);
		setTimeout(() => {
			SceneManager.goto(Scene_Title);
		}, 2000);
	}));

	this._optionsWindow.setHandler(MATTIE.CmdManager.spectate, (() => {
		this.animateText('Your body was claimed by the dungeons, but your soul\n roams freely, may you live again.', 0.5);
		// this.animateText("You give your soul to the god of fear and hunger, may \nyou live again.",.5);
		setTimeout(() => {
			MATTIE.multiplayer.getCurrentNetController().player.setSpectate(true);
		}, 4000);
	}));

	this._optionsWindow.setHandler(MATTIE.CmdManager.bornAnew, (() => {
		this.animateText('The dungeons distort and warp everything that you are, \neverything that you were ceases to be. Now, be born anew.', 0.5);
		setTimeout(() => {
			SceneManager.goto(MATTIE.scenes.multiplayer.newGame);
		}, 4000);
	}));

	this.animateText(text);
};

MATTIE.scenes.multiplayer.Scene_GameOver.prototype.animateText = function (text, speed = 1) {
	let timeout = 0;
	if (this.timeouts) {
		this.timeouts.forEach((element) => {
			clearTimeout(element);
		});
		this.timeouts = [];
	} else {
		this.timeouts = [];
	}
	for (let index = 0; index < text.length; index++) {
		const element = text.slice(0, index + 1);
		timeout += element.endsWith('\n') ? 250 * speed
			: element.endsWith('.')
				? 550 * speed
				: element.endsWith(',')
					? 450 * speed
					: 75 * speed;
		this.timeouts.push(setTimeout(() => {
			this._textWin.updateText(element);
		}, timeout));
	}
};

MATTIE.scenes.multiplayer.Scene_GameOver.prototype.createBackground = function () {
	Scene_Gameover.prototype.createBackground.call(this);
};

MATTIE.scenes.multiplayer.Scene_GameOver.prototype.playGameoverMusic = function () {
	Scene_Gameover.prototype.playGameoverMusic.call(this);
};
