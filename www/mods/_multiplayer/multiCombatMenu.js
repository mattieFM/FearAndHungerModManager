var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.multiplayer.multiCombat = {};
MATTIE.scenes.multiplayer.multiCombat = {};
MATTIE.windows.multiplayer.multiCombat = {};
MATTIE.windows.multicombat_SceneBattleOrg = Scene_Battle.prototype.createAllWindows;
MATTIE.multiplayer.multiCombat.netPlayerOffset = 0;

MATTIE.multiplayer.multiCombat.rowHeight = 0.1;
MATTIE.multiplayer.multiCombat.maxAlliesPerRow = 6;
MATTIE.multiplayer.multiCombat.minCharHeight = 50;

MATTIE.multiplayer.multiCombat.ellipseHor = MATTIE.multiplayer.multiCombat.maxAlliesPerRow;
MATTIE.multiplayer.multiCombat.ellipseVert = MATTIE.multiplayer.multiCombat.maxAlliesPerRow / 1.5;
MATTIE.multiplayer.multiCombat.ellipseGetY = function (x) {
	const b = MATTIE.multiplayer.multiCombat.ellipseVert;
	const a = MATTIE.multiplayer.multiCombat.ellipseHor;
	return Math.sqrt((1 / b ** 2) + (((x ** 2) * b ** 2) / a ** 2)); // ellipse formula for y from x;
};

MATTIE.multiplayer.multiCombat.additionalStatusRows = 1;
MATTIE.multiplayer.multiCombat.additionalCommandRows = 1;

TextManager.multiplayer = 'view allies';
TextManager.viewNextParty = 'view next party';

Scene_Battle.prototype.createAllWindows = function () {
	const that = this;
	MATTIE.multiplayer.multiCombat.netPlayerOffset = 0; // reset the offset anytime we create a new scene
	MATTIE.windows.multicombat_SceneBattleOrg.call(this);

	if (MATTIE.multiplayer.config.showAlliesMenu) {
		this._textWindow = new MATTIE.windows.multiplayer.multiCombat.AllyCount(0, 0, 155, 75);
		this._textWindow.opacity = 100;
		this.addWindow(this._textWindow);
	}

	if (MATTIE.multiplayer.config.showViewingMenu) {
		this._partyDisplay = new MATTIE.windows.TextDisplay(155, 0, 400, 75, 'Viewing: Self');
		this._partyDisplay.opacity = 100;
		this.addWindow(this._partyDisplay);
	}

	// make windows not overlap
	function show() {
		if (typeof that._textWindow != 'undefined') that._textWindow.show();
		if (typeof that._partyDisplay != 'undefined') that._partyDisplay.show();
	}
	function hide() {
		if (typeof that._textWindow != 'undefined') that._textWindow.hide();
		if (typeof that._partyDisplay != 'undefined') that._partyDisplay.hide();
	}
	const oldWinMsgShow = Window_Help.prototype.show;
	Window_Message.prototype.show = function () {
		hide();
		oldWinMsgShow.call(this);
	};
	const oldWinMsgHide = Window_Help.prototype.hide;
	Window_Message.prototype.show = function () {
		show();
		oldWinMsgHide.call(this);
	};
	const oldWinHelpActivate = Window_Help.prototype.show;
	Window_Help.prototype.show = function () {
		hide();
		oldWinHelpActivate.call(this);
	};

	const oldWinHelpDeactivate = Window_Help.prototype.hide;
	Window_Help.prototype.hide = function () {
		show();
		oldWinHelpDeactivate.call(this);
	};

	this._statusWindow.setHandler('cancel', BattleManager.unready.bind(this));
	MATTIE.multiplayer.BattleController.addListener('ready', () => {
		this._statusWindow.activate();
	});

	MATTIE.multiplayer.BattleController.addListener('unready', () => {
		this._statusWindow.deactivate();
	});

	MATTIE.multiplayer.BattleController.addListener('refreshNetBattlers', () => {
		this.refreshNetBattlers();
	});

	this.refreshNetBattlers();
};

Spriteset_Battle.prototype.removeNetBattler = function (index) {
	if (!this._netActorSprites) this._netActorSprites = [];
	if (!this._netActors) this._netActors = [];
	var val = this._netActorSprites.splice(index, 1)[0];
	this._netActors.splice(index, 1);
	BattleManager._netActors.splice(index, 1);
	this._battleField.removeChild(val);
};

Sprite_Actor.prototype.setNet = function () {
	this.isNet = true;
};

Spriteset_Battle.prototype.addNetBattler = function (actor) {
	if (!this._netActorSprites) this._netActorSprites = [];
	if (!this._netActors) this._netActors = [];
	actor.forceIndex(this._netActorSprites.length);
	const sprite = new Sprite_Actor();
	sprite.setNet();
	sprite.setBattler(actor);
	MATTIE.multiplayer.multiCombat.netPlayerOffset = $gameParty.battleMembers().length;
	if (MATTIE.multiplayer.devTools.shouldTint) {
		if (!MATTIE.multiplayer.devTools.consistentTint) {
			MATTIE.multiplayer.devTools.consistentTint = MATTIE.multiplayer.devTools.getTint();
		}
		sprite._mainSprite.tint = MATTIE.multiplayer.devTools.consistentTint;
	}

	this._netActorSprites.push(sprite);
	BattleManager._netActors.push(actor);
	this._netActors.push(actor);

	this._battleField.addChild(this._netActorSprites[this._netActorSprites.length - 1]);
};

Scene_Battle.prototype.refreshNetBattlers = function () {
	if (!MATTIE.multiplayer.pvp.inPVP) {
		MATTIE.multiplayer.multiCombat.netPlayerOffset = $gameParty.battleMembers().length;
		const playersIds = $gameTroop.getIdsInCombatWith();
		const netCont = MATTIE.multiplayer.getCurrentNetController();
		if (!this._spriteset._netActorSprites) this._spriteset._netActorSprites = [];
		if (!this._spriteset._netActors) this._spriteset._netActors = [];
		for (let index = 0; index < this._spriteset._netActorSprites.length + 1; index++) {
			this._spriteset.removeNetBattler(0); // becouse this is destructive just remove index 0 for every time.
		}
		playersIds.forEach((id) => {
			if (id !== netCont.peerId) {
				netCont.netPlayers[id].battleMembers().forEach((actor) => {
					this._spriteset.addNetBattler(actor);
				});
			}
		});
		this._spriteset.updateNetBattlers();
	}
};

MATTIE.multiplayer.gameActorInit = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function () {
	MATTIE.multiplayer.gameActorInit.call(this);
	this._forcedIndex = null;
};
Game_Actor.prototype.index = function () {
	if (this._forcedIndex != null) return this._forcedIndex;
	return $gameParty.members().indexOf(this);
};

Game_Actor.prototype.forceIndex = function (index) {
	this._forcedIndex = index;
};

Game_Actor.prototype.unForceIndex = function () {
	this._forcedIndex = null;
};

Spriteset_Battle.prototype.updateNetBattlers = function () {
	if (!this._netActorSprites) this._netActorSprites = [];
	if (!this._netActors) this._netActors = [];
	var members = this._netActors;
	for (var i = 0; i < this._netActorSprites.length; i++) {
		this._netActorSprites[i].setBattler(members[i]);
	}
};

MATTIE.multiplayer.spiresetBattleUpdate = Spriteset_Battle.prototype.update;
Spriteset_Battle.prototype.update = function () {
	MATTIE.multiplayer.spiresetBattleUpdate.call(this);
	this.updateNetBattlers();
};

Sprite_Actor.prototype.setActorHome = function (index) {
	// use this if you want it to fill from middle
	// if (this.isNet) index += MATTIE.multiplayer.multiCombat.netPlayerOffset;
	// const colNum = index % MATTIE.multiplayer.multiCombat.maxAlliesPerRow;
	// const rowNum = Math.floor(index / MATTIE.multiplayer.multiCombat.maxAlliesPerRow);

	// let effectiveCol = (MATTIE.multiplayer.multiCombat.maxAlliesPerRow / 2) - 1;
	// if (colNum % 2 == 0) {
	// 	effectiveCol -= Math.floor(colNum / 2);
	// } else {
	// 	effectiveCol += Math.ceil(colNum / 2);
	// }
	// const xOffset = (Graphics.width / MATTIE.multiplayer.multiCombat.maxAlliesPerRow) * x;
	// // const x = effectiveCol - MATTIE.multiplayer.multiCombat.maxAlliesPerRow / 2;
	// const x = colNum - MATTIE.multiplayer.multiCombat.maxAlliesPerRow / 2;
	// console.log(x);
	// console.log(`eff${effectiveCol}`);
	// // x needs to fill like 2,3,4,1

	// const y = MATTIE.multiplayer.multiCombat.ellipseGetY(x);
	// const rowOffset = (rowNum * MATTIE.multiplayer.multiCombat.rowHeight * Graphics.height);
	// const yOffset = (y * MATTIE.multiplayer.multiCombat.rowHeight * Graphics.height);
	// this.setHome(50 + xOffset, Graphics.boxHeight - MATTIE.multiplayer.multiCombat.minCharHeight - rowOffset - yOffset - 50);
	if (this.isNet) index += MATTIE.multiplayer.multiCombat.netPlayerOffset;
	const colNum = index % MATTIE.multiplayer.multiCombat.maxAlliesPerRow;
	const rowNum = Math.floor(index / MATTIE.multiplayer.multiCombat.maxAlliesPerRow);

	const xOffset = (Graphics.width / MATTIE.multiplayer.multiCombat.maxAlliesPerRow) * colNum;
	const x = colNum - MATTIE.multiplayer.multiCombat.maxAlliesPerRow / 2;
	const y = MATTIE.multiplayer.multiCombat.ellipseGetY(x);
	const rowOffset = (rowNum * MATTIE.multiplayer.multiCombat.rowHeight * Graphics.height);
	const yOffset = (y * MATTIE.multiplayer.multiCombat.rowHeight * Graphics.height);
	this.setHome(50 + xOffset, Graphics.boxHeight - MATTIE.multiplayer.multiCombat.minCharHeight - rowOffset - yOffset);
};

/**
 * @description a window that displays the current number of alies in the fight with you.
 * @class
 */
MATTIE.windows.multiplayer.multiCombat.AllyCount = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.windows.multiplayer.multiCombat.AllyCount.prototype = Object.create(MATTIE.windows.TextDisplay.prototype);
MATTIE.windows.multiplayer.multiCombat.AllyCount.prototype.constructor = MATTIE.windows.multiplayer.multiCombat.AllyCount;

MATTIE.windows.multiplayer.multiCombat.AllyCount.prototype.initialize = function (x, y, width, height) {
	this._items = [];
	this._index = 0;
	this._header = '';
	MATTIE.windows.TextDisplay.prototype.initialize.call(this, x, y, width, height, MATTIE.windows.multiplayer.multiCombat.AllyCount.prototype.getText());
	MATTIE.multiplayer.getCurrentNetController().addListener('battleChange', () => {
		this.updateCount();
	});
};
MATTIE.windows.multiplayer.multiCombat.AllyCount.prototype.getText = function () {
	return (MATTIE.multiplayer.pvp.inPVP ? 'Enemies' : `Allies: ${MATTIE.windows.multiplayer.multiCombat.AllyCount.prototype.getTotalAllies()}`).toString();
};

MATTIE.windows.multiplayer.multiCombat.AllyCount.prototype.getTotalAllies = function () {
	var x = $gameTroop.totalCombatants();
	return ((x || 0) - 1);
};

MATTIE.windows.multiplayer.multiCombat.AllyCount.prototype.updateCount = function () {
	this.updateText(MATTIE.windows.multiplayer.multiCombat.AllyCount.prototype.getText());
};

// spritesets
function Spriteset_Battle_ActorRow() {
	this.initialize.apply(this, arguments);
}

Spriteset_Battle_ActorRow.prototype = Object.create(Spriteset_Base.prototype);
Spriteset_Battle_ActorRow.prototype.constructor = Spriteset_Battle_ActorRow;

Spriteset_Battle_ActorRow.prototype.initialize = function () {
	Spriteset_Base.prototype.initialize.call(this);
	this.maxActors = 6;
};

Spriteset_Battle_ActorRow.prototype.createBaseSprite = function () {
	this._baseSprite = new Sprite();
	this._baseSprite.setFrame(0, 0, this.width, this.height);
	this._blackScreen = new ScreenSprite();
	this._blackScreen.opacity = 0;
	this.addChild(this._baseSprite);
	this._baseSprite.addChild(this._blackScreen);
};

Spriteset_Battle_ActorRow.prototype.createLowerLayer = function () {
	Spriteset_Base.prototype.createLowerLayer.call(this);
	this.createBattleField();
	this.createActors($gameActors);
};

Spriteset_Battle_ActorRow.prototype.update = function () {
	Spriteset_Base.prototype.update.call(this);
	this.updateActors($gameActors);
};

Spriteset_Battle_ActorRow.prototype.createBattleField = function () {
	var width = Graphics.boxWidth;
	var height = Graphics.boxHeight;
	var x = (Graphics.width - width) / 2;
	var y = (Graphics.height - height) / 2;
	this._battleField = new Sprite();
	this._battleField.setFrame(x, y, width, height);
	this._battleField.setColorTone([255, 0, 0, 1]);
	this._battleField.x = x;
	this._battleField.y = y;
	this._baseSprite.addChild(this._battleField);
};

Spriteset_Battle_ActorRow.prototype.createActors = function () {
	this._actorSprites = [];
	for (var i = 0; i < 6; i++) {
		this._actorSprites[i] = new Sprite_Actor();
		this._battleField.addChild(this._actorSprites[i]);
	}
};

Spriteset_Battle_ActorRow.prototype.updateActors = function () {
	var members = $gameActors._data;
	for (var i = 0; i < this._actorSprites.length; i++) {
		this.setBattlerPos(this._actorSprites[i], members[i], i);
	}
};

Spriteset_Battle_ActorRow.prototype.setBattlerPos = function (sprite, battler, index) {
	sprite.setBattler(battler);
	var changed = (battler !== this._actor);
	if (changed) {
		sprite._actor = battler;
		if (battler) {
			sprite.setHome(300 + index * 16, 280 + index * 48);
		}
		sprite.startEntryMotion();
		sprite._stateSprite.setup(battler);
	}
};

Spriteset_Battle_ActorRow.prototype.validFog = function (id) {
	return false;
};

MATTIE.multiplayer.multiCombat.maxItems = Window_BattleStatus.prototype.maxItems;
Window_BattleStatus.prototype.maxItems = function () {
	return MATTIE.multiplayer.multiCombat.maxItems.call(this) + MATTIE.multiplayer.multiCombat.additionalStatusRows;
};
MATTIE.multiplayer.multiCombat.numVisibleRows = Window_BattleStatus.prototype.numVisibleRows;
Window_BattleStatus.prototype.numVisibleRows = function () {
	const numRows = MATTIE.multiplayer.multiCombat.numVisibleRows.call(this);
	if (this.maxItems() + MATTIE.multiplayer.multiCombat.additionalStatusRows > numRows) {
		return numRows + MATTIE.multiplayer.multiCombat.additionalStatusRows;
	}
	return numRows;
};

Window_BattleStatus.prototype.drawTextItem = function (index, text) {
	const rect = this.basicAreaRect(index);
	this.drawTitleText(text, rect.x + 0, rect.y, 150);
};

Window_BattleStatus.prototype.setGameParty = function (party) {
	this._gameParty = party;
};

Window_BattleStatus.prototype.drawTitleText = function (text, x, y, width) {
	width = width || 168;
	this.drawText(text, x, y, width);
};

Window_BattleStatus.prototype.drawItem = function (index) {
	const gameParty = this._gameParty || $gameParty;
	var actor = gameParty.battleMembers()[index];
	if (actor) {
		this.drawBasicArea(this.basicAreaRect(index), actor);
		this.drawGaugeArea(this.gaugeAreaRect(index), actor);
	}
};

Window_BattleStatus.prototype.maxItems = function () { // fix battles length on net parties viewing
	const gameParty = this._gameParty || $gameParty;
	return gameParty.battleMembers().length + 1;
};

MATTIE.multiplayer.multiCombat.drawItem = Window_BattleStatus.prototype.drawItem;
Window_BattleStatus.prototype.drawItem = function (index) {
	if (index < MATTIE.multiplayer.multiCombat.maxItems()) { // if non extended row
		MATTIE.multiplayer.multiCombat.drawItem.call(this, index);
	} else { // if extended row
		this.drawTextItem(index, TextManager.viewNextParty);
	}
};

// MATTIE.multiplayer.Window_BattleStatusDrawAll = Window_BattleStatus.prototype.drawAllItems;
// Window_BattleStatus.prototype.drawAllItems = function (){
//     MATTIE.multiplayer.Window_BattleStatusDrawAll.call(this);
//     this.drawText("party",0,0,200);
// }

MATTIE.multiplayer.multiCombat.numVisibleRowsActorCommand = Window_ActorCommand.prototype.numVisibleRows;
Window_ActorCommand.prototype.numVisibleRows = function () {
	return MATTIE.multiplayer.multiCombat.numVisibleRowsActorCommand.call(this) + MATTIE.multiplayer.multiCombat.additionalCommandRows;
};

MATTIE.multiplayer.multiCombat.window_actorcommandMakeCommandList = Window_ActorCommand.prototype.makeCommandList;
Window_ActorCommand.prototype.makeCommandList = function () {
	MATTIE.multiplayer.multiCombat.window_actorcommandMakeCommandList.call(this);
	if (this._actor && MATTIE.isDev) {
		this.addMultiplayerCommand();
	}
};

Window_ActorCommand.prototype.addMultiplayerCommand = function () {
	this.addCommand(TextManager.multiplayer, 'multiplayer');
};
Scene_Battle.prototype.resetParty = function () {
	if (MATTIE.multiplayer.config.showViewingMenu) this._partyDisplay.updateText('Viewing: Self');
	this._actorWindow.setGameParty(null);
	this._statusWindow.setGameParty(null);
	this._actorWindow.currentid = 0;
};

Scene_Battle.prototype.viewNetParty = function (n) {
	const playersIds = $gameTroop.getIdsInCombatWithExSelf();
	const netCont = MATTIE.multiplayer.getCurrentNetController();
	this._actorWindow.setGameParty(netCont.netPlayers[playersIds[n]]);
	this._statusWindow.setGameParty(netCont.netPlayers[playersIds[n]]);
	if (MATTIE.multiplayer.config.showViewingMenu) this._partyDisplay.updateText(`Viewing: ${netCont.netPlayers[playersIds[n]].name}`);
};

Scene_Battle.prototype.refreshParties = function () {
	this._actorWindow.refresh();
	this._statusWindow.refresh();
};

Scene_Battle.prototype.shiftParty = function () {
	const playersIds = $gameTroop.getIdsInCombatWithExSelf();
	const netCont = MATTIE.multiplayer.getCurrentNetController();
	if (this._actorWindow._gameParty == netCont.netPlayers[playersIds[playersIds.length - 1]]) {
		this.resetParty();
	} else {
		if (!this._actorWindow.currentid) this._actorWindow.currentid = 0;
		this.viewNetParty(this._actorWindow.currentid);
		this._actorWindow.currentid++;
	}
};

Scene_Battle.prototype.multiplayerCmd = function () {
	const playersIds = $gameTroop.getIdsInCombatWith();
	const netCont = MATTIE.multiplayer.getCurrentNetController();
	this._actorWindow.setGameParty(netCont.netPlayers[playersIds[1]]);
	this._statusWindow.setGameParty(netCont.netPlayers[playersIds[1]]);
};

MATTIE.multiplayer.sceneBattleOk = Scene_Battle.prototype.onActorOk;
Scene_Battle.prototype.onActorOk = function () {
	if (this._actorWindow.index() + 1 <= MATTIE.multiplayer.multiCombat.maxItems.call(this._actorWindow)) {
		var action = BattleManager.inputtingAction();
		const playersIds = $gameTroop.getIdsInCombatWithExSelf();
		const netCont = MATTIE.multiplayer.getCurrentNetController();
		const id = playersIds[this._actorWindow.currentid - 1]
			? playersIds[this._actorWindow.currentid - 1]
			: MATTIE.multiplayer.getCurrentNetController().peerId;
		action.setNetPartyId(id);
		MATTIE.multiplayer.sceneBattleOk.call(this);
		this.resetParty();
		this.refreshParties();
	} else {
		this.shiftParty();
		this.selectActorSelection();
	}
};

MATTIE.multiplayer.sceneBattleCreateCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
Scene_Battle.prototype.createActorCommandWindow = function () {
	MATTIE.multiplayer.sceneBattleCreateCommandWindow.call(this);
	this._actorCommandWindow.setHandler('multiplayer', this.shiftParty.bind(this));
};

Window_BattleActor.prototype.hide = function () {
	const gameParty = this._gameParty || $gameParty;
	Window_BattleStatus.prototype.hide.call(this);
	gameParty.select(null);
};

Window_BattleActor.prototype.select = function (index) {
	const gameParty = this._gameParty || $gameParty;
	Window_BattleStatus.prototype.select.call(this, index);
	gameParty.select(this.actor());
};

Window_BattleActor.prototype.actor = function () {
	const gameParty = this._gameParty || $gameParty;
	return gameParty.members()[this.index()];
};

//-----------------------------------------------------------------------------
// Galv Extra turn stuffs
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// SPRITE Net Ex Turn
//-----------------------------------------------------------------------------

/**
 * @description a window that displays the extra turn pop up
 * @class
 */
MATTIE.multiplayer.SpriteNetExTurn = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.multiplayer.SpriteNetExTurn.prototype = Object.create(Sprite.prototype);
MATTIE.multiplayer.SpriteNetExTurn.prototype.constructor = MATTIE.multiplayer.SpriteNetExTurn;

MATTIE.multiplayer.SpriteNetExTurn.prototype.initialize = function () {
	Sprite.prototype.initialize.call(this);
	this.createBitmap();
};

MATTIE.multiplayer.SpriteNetExTurn.prototype.createBitmap = function () {
	this.bitmap = ImageManager.loadBitmap('mods/_multiplayer/', 'netExTurn', 0, true, true);
	this.x = Galv.EXTURN.x + 70;
	this.y = Galv.EXTURN.y;
	this.opacity = 0;
};

MATTIE.multiplayer.SpriteNetExTurn.prototype.update = function () {
	Sprite.prototype.update.call(this);
	this.opacity += MATTIE.multiplayer.combatEmitter.netExTurn ? Galv.EXTURN.fade : -Galv.EXTURN.fade;
};

//-----------------------------------------------------------------------------
// SPRITE Ready
//-----------------------------------------------------------------------------

/**
 * @description a window that displays the ready popup in battle
 * @class
 */
MATTIE.multiplayer.SpriteReady = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.multiplayer.SpriteReady.prototype = Object.create(Sprite.prototype);
MATTIE.multiplayer.SpriteReady.prototype.constructor = MATTIE.multiplayer.SpriteReady;

MATTIE.multiplayer.SpriteReady.prototype.initialize = function () {
	Sprite.prototype.initialize.call(this);
	this.createBitmap();
};

MATTIE.multiplayer.SpriteReady.prototype.createBitmap = function () {
	this.bitmap = ImageManager.loadBitmap('mods/_multiplayer/', 'ready', 0, true, true);
	this.x = Galv.EXTURN.x + 70;
	this.y = Galv.EXTURN.y - 60;
	this.opacity = 0;
};

MATTIE.multiplayer.SpriteReady.prototype.update = function () {
	Sprite.prototype.update.call(this);
	this.opacity += MATTIE.multiplayer.ready ? Galv.EXTURN.fade : -Galv.EXTURN.fade;
};

//-----------------------------------------------------------------------------
// SPRITE Awaiting Allies
//-----------------------------------------------------------------------------

/**
 * @description a window that displays the waiting popup in battle
 * @class
 */
MATTIE.multiplayer.SpriteWaiting = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.multiplayer.SpriteWaiting.prototype = Object.create(Sprite.prototype);
MATTIE.multiplayer.SpriteWaiting.prototype.constructor = MATTIE.multiplayer.SpriteWaiting;

MATTIE.multiplayer.SpriteWaiting.prototype.initialize = function () {
	Sprite.prototype.initialize.call(this);
	this.createBitmap();
};

MATTIE.multiplayer.SpriteWaiting.prototype.createBitmap = function () {
	this.bitmap = ImageManager.loadBitmap('mods/_multiplayer/', 'awaitingAllies', 0, true, true);
	const readyBitMap = ImageManager.loadBitmap('mods/_multiplayer/', 'ready', 0, true, true);
	this.x = Galv.EXTURN.x + 68;
	this.y = Galv.EXTURN.y - 30;
	this.opacity = 0;
};

MATTIE.multiplayer.SpriteWaiting.prototype.update = function () {
	Sprite.prototype.update.call(this);
	this.opacity += MATTIE.multiplayer.waitingOnAllies ? Galv.EXTURN.fade : -Galv.EXTURN.fade;
};

//-----------------------------------------------------------------------------
// SPRITESET BATTLE
//-----------------------------------------------------------------------------

MATTIE_RPG.Scene_battle_createDisplayObjects = Scene_Battle.prototype.createDisplayObjects;
Scene_Battle.prototype.createDisplayObjects = function () {
	MATTIE_RPG.Scene_battle_createDisplayObjects.call(this);
	this.createNetExTurnImg();
	this.createReadyImg();
	this.createAwaitingImg();
};

Scene_Battle.prototype.createNetExTurnImg = function () {
	this._netExTurnImg = new MATTIE.multiplayer.SpriteNetExTurn();
	this.addChild(this._netExTurnImg);
};

Scene_Battle.prototype.createReadyImg = function () {
	this._netExTurnImg = new MATTIE.multiplayer.SpriteReady();
	this.addChild(this._netExTurnImg);
};

Scene_Battle.prototype.createAwaitingImg = function () {
	this._netExTurnImg = new MATTIE.multiplayer.SpriteWaiting();
	this.addChild(this._netExTurnImg);
};

Sprite_ExTurn.prototype.update = function () {
	Sprite.prototype.update.call(this);
	this.opacity += (Galv.EXTURN.active && !MATTIE.multiplayer.ready) ? Galv.EXTURN.fade : -Galv.EXTURN.fade;
};
