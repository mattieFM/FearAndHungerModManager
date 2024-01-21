MATTIE.menus = MATTIE.menus || {};
MATTIE.windows = MATTIE.windows || {};
MATTIE.scenes = MATTIE.scenes || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};

/** go to the item cheat menu scene */
MATTIE.menus.toItemCheatMenu = function () {
	SceneManager.push(MATTIE.scenes.Scene_DevItems);
};

/**
 * // Scene_DevItems
 * @description a scene to spawn in items for dev
 * @extends Scene_Item
 * @class
 */
MATTIE.scenes.Scene_DevItems = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.scenes.Scene_DevItems.prototype = Object.create(Scene_Item.prototype);
MATTIE.scenes.Scene_DevItems.prototype.constructor = MATTIE.scenes.Scene_DevItems;

MATTIE.scenes.Scene_DevItems.prototype.initialize = function () {
	Scene_Item.prototype.initialize.call(this);
	this.lastItem = null;
};

// override to use our cheatItemWin instead of the default window
MATTIE.scenes.Scene_DevItems.prototype.createItemWindow = function () {
	const wy = this._categoryWindow.y + this._categoryWindow.height;
	const wh = Graphics.boxHeight - wy;
	this._itemWindow = new MATTIE.windows.Window_CheatItem(0, wy, Graphics.boxWidth, wh);
	this._itemWindow.setHelpWindow(this._helpWindow);
	this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
	this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
	this.addWindow(this._itemWindow);
	this._categoryWindow.setItemWindow(this._itemWindow);
};

// override on categoryOk to work properly
MATTIE.scenes.Scene_DevItems.prototype.onCategoryOk = function () {
	this._itemWindow.activate();
	const index = this._itemWindow._data.indexOf(this.lastItem);
	this._itemWindow.select(index >= 0 ? index : 0);
};

// override the on item function to give the player that item instead of using it.
MATTIE.scenes.Scene_DevItems.prototype.onItemOk = function () {
	$gameParty.gainItem(this.item(), 1, false);
	this.lastItem = this.item();
	this._itemWindow.activate();
	this._itemWindow.refresh();
};

MATTIE.scenes.Scene_DevItems.prototype.onItemCancel = function () {
	this._categoryWindow.activate();
};

/**
 * Window_CheatItem
 * @description a window that displays all items in the game, intended to be used for the cheat menu
 * @extends Window_ItemList
 * @class
 */
MATTIE.windows.Window_CheatItem = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.windows.Window_CheatItem.prototype = Object.create(Window_ItemList.prototype);
MATTIE.windows.Window_CheatItem.prototype.constructor = MATTIE.windows.Window_CheatItem;

MATTIE.windows.Window_CheatItem.prototype.initialize = function (x, y, width, height) {
	Window_ItemList.prototype.initialize.call(this, x, y, width, height);
};
MATTIE.windows.Window_CheatItem.allItems = function () {
	return $dataItems.concat($dataArmors).concat($dataWeapons);
};

MATTIE.windows.Window_CheatItem.prototype.isCurrentItemEnabled = function () {
	return true;
};

MATTIE.windows.Window_CheatItem.prototype.isEnabled = function (item) {
	return true;
};

MATTIE.windows.Window_CheatItem.prototype.setCategory = function (category) {
	if (this._category !== category) {
		this._category = category;
		this.refresh();
	}
};

MATTIE.windows.Window_CheatItem.prototype.makeItemList = function () {
	const allItems = MATTIE.windows.Window_CheatItem.allItems();
	this._data = allItems.filter(function (item) {
		if (this) return this.includes(item);
		return false;
	}, this);
	if (this.includes(null)) {
		this._data.push(null);
	}
};

/**
 * // Scene_OneUseCheat
 * A scene to spawn in one item and then close
 * @extends MATTIE.scenes.Scene_DevItems
 */
MATTIE.scenes.Scene_OneUseCheat = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.scenes.Scene_OneUseCheat.prototype = Object.create(MATTIE.scenes.Scene_DevItems.prototype);
MATTIE.scenes.Scene_OneUseCheat.prototype.constructor = MATTIE.scenes.Scene_OneUseCheat;

MATTIE.scenes.Scene_OneUseCheat.prototype.initialize = function () {
	MATTIE.scenes.Scene_DevItems.prototype.initialize.call(this);
};

// override the on item ok function to give the item then return to the previous scene closing the cheat menu.
MATTIE.scenes.Scene_OneUseCheat.prototype.onItemOk = function () {
	MATTIE.scenes.Scene_DevItems.prototype.onItemOk.call(this);
	SceneManager.pop();
};

MATTIE.windows.EmptyScrollHelpWindow = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.windows.EmptyScrollHelpWindow.prototype = Object.create(Window_Help.prototype);
MATTIE.windows.EmptyScrollHelpWindow.prototype.constructor = MATTIE.windows.EmptyScrollHelpWindow;

MATTIE.windows.EmptyScrollHelpWindow.prototype.initialize = function (numLines) {
	Window_Help.prototype.initialize.call(this, numLines);
};

// a poorly written function that gives a typing affect to the text. deleting till the current text matches then typing the rest.
MATTIE.windows.EmptyScrollHelpWindow.prototype.setText = function (text) {
	this.typingActions = [];
	if (this.interval) clearInterval(this.interval);
	if (this._text !== text) {
		const wantedText = `O Lord, Give, ${text}`;
		let keepDeleting = true;
		let doneTyping = false;
		let index = 0;
		const textLength = this._text.length - 1;
		while (keepDeleting) {
			if (wantedText.startsWith(this._text.slice(0, textLength - index))) {
				// start typing forwards
				keepDeleting = false;
			}
			this.typingActions.push(this._text.slice(0, textLength - index));
			if (index >= textLength) keepDeleting = false;
			index++;
		}
		let otherText = this._text.slice(0, textLength - index);
		index = otherText.length;// continue typing from where we know strings are same.

		while (!doneTyping) {
			const char = wantedText[index];

			if (char) {
				otherText += char;
				this.typingActions.push(otherText);
			}
			if (text === wantedText) doneTyping = true;
			if (index >= wantedText.length - 1) doneTyping = true;
			index++;
		}

		index = 0;
		this.interval = setInterval(() => {
			if (index < this.typingActions.length && this._text != wantedText) {
				const element = this.typingActions[index];
				this._text = element;
				this.refresh();
			} else {
				clearInterval(this.interval);
			}
			index++;
		}, 75);

		this.refresh();
	}
};

MATTIE.windows.EmptyScrollHelpWindow.prototype.setItem = function (item) {
	this.setText(item ? item.name : 'O Lord, Give,');
};

/**
 * A scene to spawn in one item that an empty scroll can provide and then close
 * @extends MATTIE.scenes.emptyScroll
 * @class
 */
MATTIE.scenes.emptyScroll = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.scenes.emptyScroll.prototype = Object.create(MATTIE.scenes.Scene_OneUseCheat.prototype);
MATTIE.scenes.emptyScroll.prototype.constructor = MATTIE.scenes.emptyScroll;

MATTIE.scenes.emptyScroll.prototype.initialize = function () {
	MATTIE.scenes.Scene_OneUseCheat.prototype.initialize.call(this);
};

MATTIE.scenes.emptyScroll.prototype.create = function () {
	MATTIE.scenes.Scene_OneUseCheat.prototype.create.call(this);
};

MATTIE.scenes.emptyScroll.prototype.createHelpWindow = function () {
	this._helpWindow = new MATTIE.windows.EmptyScrollHelpWindow(1);
	this._helpWindow.setText('O Lord, Give, ');
	this.addWindow(this._helpWindow);
	this._helpWindow.refresh();
};

/**
 * Scene_CheatSkill
 * A scene that extends the skill scene intended for dev work / cheating
 * @extends Scene_Skill
 */
MATTIE.scenes.Scene_DevSkill = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.scenes.Scene_DevSkill.prototype = Object.create(Scene_Skill.prototype);
MATTIE.scenes.Scene_DevSkill.prototype.constructor = MATTIE.scenes.Scene_DevSkill;

MATTIE.scenes.Scene_DevSkill.prototype.initialize = function () {
	Scene_Skill.prototype.initialize.call(this);
};

// override skills display window creation to use our window
MATTIE.scenes.Scene_DevSkill.prototype.createItemWindow = function () {
	const wx = 0;
	const wy = this._statusWindow.y + this._statusWindow.height;
	const ww = Graphics.boxWidth;
	const wh = Graphics.boxHeight - wy;
	this._itemWindow = new MATTIE.windows.Window_DevSkillList(wx, wy, ww, wh);
	this._itemWindow.setHelpWindow(this._helpWindow);
	this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
	this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
	this._skillTypeWindow.setSkillWindow(this._itemWindow);
	this.addWindow(this._itemWindow);
};

MATTIE.scenes.Scene_DevSkill.prototype.createActorWindow = function () {
	Scene_Skill.prototype.createActorWindow.call(this);
	this._actorWindow.select($gameParty.leader());
	this._actorWindow.refresh();
	this._actorWindow._formationMode = () => true;
};

// override. This is the function that actually uses the skill, cus skills are "items"
// we want to always select an actor to teach the skill to
MATTIE.scenes.Scene_DevSkill.prototype.determineItem = function () {
	const action = new Game_Action(this.user());
	const item = this.item();
	action.setItemObject(item);
	this.showSubWindow(this._actorWindow);
	this._actorWindow.selectForItem(this.item());
};

MATTIE.scenes.Scene_DevSkill.prototype.onActorOk = function () {
	/** @type {Game_Actor} */
	const actor = this.user();
	actor.learnSkill(this.item().id);
	this.hideSubWindow(this._actorWindow);
	this._itemWindow.activate();
};

/**
 * Window_DevSkillList
 * @description a window that displays all skills in the game, intended for dev use.
 * @extends Window_SkillList
 */
MATTIE.windows.Window_DevSkillList = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.windows.Window_DevSkillList.prototype = Object.create(Window_SkillList.prototype);
MATTIE.windows.Window_DevSkillList.prototype.constructor = MATTIE.windows.Window_DevSkillList;

MATTIE.windows.Window_DevSkillList.prototype.initialize = function (x, y, width, height) {
	Window_SkillList.prototype.initialize.call(this, x, y, width, height);
	BattleManager.clearActor();
	this.setActor($gameParty.leader());
	this.refresh();
};
// override to return all skills. We return the skills with icons first
MATTIE.windows.Window_DevSkillList.prototype.makeItemList = function () {
	const allSkills = $dataSkills.filter((skill) => skill != null);
	const skillsWithIcons = allSkills.filter((skill) => skill.iconIndex != 0);
	const skillsWithoutIcons = allSkills.filter((skill) => skill.iconIndex == 0);
	const orderedSkills = skillsWithIcons.concat(skillsWithoutIcons);
	this._data = orderedSkills;
};
// by default this function checks against the actor to get the cost, we need to check against the skill's data instead
MATTIE.windows.Window_DevSkillList.prototype.drawSkillCost = function (skill, x, y, width) {
	if (skill.tpCost > 0) {
		this.changeTextColor(this.tpCostColor());
		this.drawText(skill.tpCost, x, y, width, 'right');
	} else if (skill.mpCost > 0) {
		this.changeTextColor(this.mpCostColor());
		this.drawText(skill.mpCost, x, y, width, 'right');
	}
};
// we wand all skills to be enabled
MATTIE.windows.Window_DevSkillList.prototype.isEnabled = function (item) {
	return true;
};

MATTIE.windows.Window_DevSkillList.prototype.isCurrentItemEnabled = function () {
	return true;
};

/**
 * Scene_DevActors
 * @description a scene to spawn in or remove actors
 * @extends Scene_MenuBase
 * @class
 */
MATTIE.scenes.Scene_DevActors = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.scenes.Scene_DevActors.prototype = Object.create(Scene_MenuBase.prototype);
MATTIE.scenes.Scene_DevActors.prototype.constructor = MATTIE.scenes.Scene_DevActors;

MATTIE.scenes.Scene_DevActors.prototype.initialize = function () {
	Scene_MenuBase.prototype.initialize.call(this);
};

MATTIE.scenes.Scene_DevActors.prototype.create = function () {
	Scene_MenuBase.prototype.create.call(this);
	for (let index = 0; index < $dataActors.length; index++) {
		$gameActors.actor(index);
	}
	this._actorWindow = new MATTIE.windows.Window_AllStatus(0, 0);
	this._actorWindow.loadImages();
	this._actorWindow.reserveFaceImages();
	this._actorWindow.setFormationMode(false);
	this._actorWindow.selectLast();
	this._actorWindow.activate();
	this._actorWindow.refresh();
	this.addWindow(this._actorWindow);
	this._actorWindow.setHandler('cancel', () => { SceneManager.pop(); });
	this._actorWindow.setHandler('ok', MATTIE.scenes.Scene_DevActors.prototype.onActorOk.bind(this));
};

MATTIE.scenes.Scene_DevActors.prototype.onActorOk = function () {
	const actor = $gameActors.actor(this._actorWindow.index());
	if ($gameParty.allMembers().includes(actor)) {
		$gameParty.removeActor(actor._actorId);
	} else {
		if (actor.hp <= 0) { // resurrect actor if dead
			actor.setHp(1);
			actor.revive();
		}
		$gameParty.addActor(actor._actorId);
	}
	this._actorWindow.activate();
	this._actorWindow.refresh();
};

/**
 * Scene_ForceActors
 * @description a scene to change what actor you are
 * @extends Scene_DevActors
 * @class
 */
MATTIE.scenes.Scene_ForceActors = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.scenes.Scene_ForceActors.prototype = Object.create(MATTIE.scenes.Scene_DevActors.prototype);
MATTIE.scenes.Scene_ForceActors.prototype.constructor = MATTIE.scenes.Scene_ForceActors;

MATTIE.scenes.Scene_ForceActors.prototype.initialize = function () {
	MATTIE.scenes.Scene_DevActors.prototype.initialize.call(this);
};

MATTIE.scenes.Scene_ForceActors.prototype.onActorOk = function () {
	const actor = $gameActors.actor(this._actorWindow.index());
	if (actor) MATTIE.actorAPI.changeMainChar(actor._actorId);
	this._actorWindow.activate();
	this._actorWindow.refresh();
};

/**
 * Window_AllStatus
 * @description a window that displays all actors
 * @extends Window_MenuStatus
 * @class
 */
MATTIE.windows.Window_AllStatus = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.windows.Window_AllStatus.prototype = Object.create(Window_MenuStatus.prototype);
MATTIE.windows.Window_AllStatus.prototype.constructor = MATTIE.windows.Window_AllStatus;

MATTIE.windows.Window_AllStatus.prototype.initialize = function (x, y) {
	Window_MenuStatus.prototype.initialize.call(this, x, y);
	this.last = 0;
	this.refresh();
};

MATTIE.windows.Window_AllStatus.prototype.maxItems = function () {
	return $dataActors.length;
};

MATTIE.windows.Window_AllStatus.prototype.drawItemImage = function (index) {
	const actor = $gameActors.actor(index) || $gameActors.actor(15);
	const rect = this.itemRect(index);
	this.changePaintOpacity(actor.isBattleMember());
	this.drawActorFace(actor, rect.x + 1, rect.y + 1, Window_Base._faceWidth, Window_Base._faceHeight);
	this.changePaintOpacity(true);
};

MATTIE.windows.Window_AllStatus.prototype.drawItemStatus = function (index) {
	const actor = $gameActors.actor(index) || $gameActors.actor(15);
	const rect = this.itemRect(index);
	const x = rect.x + 162;
	const y = rect.y + rect.height / 2 - this.lineHeight() * 1.5;
	const width = rect.width - x - this.textPadding();
	this.drawActorSimpleStatus(actor, x, y, width);
};

MATTIE.windows.Window_AllStatus.prototype.processOk = function () {
	Window_Selectable.prototype.processOk.call(this);
	this.last = this.index();
};

MATTIE.windows.Window_AllStatus.prototype.isCurrentItemEnabled = function () {
	if (this._formationMode) {
		const actor = $gameActors.actor(this.index()) || $gameActors.actor(15);
		return actor && actor.isFormationChangeOk();
	}
	return true;
};

MATTIE.windows.Window_AllStatus.prototype.selectLast = function () {
	this.select(this.last || 0);
};

MATTIE.windows.Window_AllStatus.prototype.loadImages = function () {
	$gameActors._data.forEach((actor) => {
		if (actor) { ImageManager.reserveFace(actor.faceName()); }
	}, this);
};

MATTIE.windows.Window_AllStatus.prototype.drawActorName = function (actor, x, y, width) {
	width = width || 168;
	this.changeTextColor(this.hpColor(actor));
	this.drawText(actor.name(), x - 100, y + 200, width);
};

MATTIE.windows.Window_AllStatus.prototype.reserveFaceImages = function () {
	$gameActors._data.forEach((actor) => {
		if (actor) { ImageManager.reserveFace(actor.faceName()); }
	}, this);
};

/**
 * Scene_Misc
 * @description a scene to show all info that might be useful
 * @extends Scene_MenuBase
 * @class
 */
MATTIE.scenes.Scene_Misc = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.scenes.Scene_Misc.baseList = {

};

setTimeout(() => {
	if (MATTIE_ModManager.modManager.checkMod('multiplayer')) 	{
		MATTIE.scenes.Scene_Misc.baseList.MULTIPLAYER = 'multiplayer';
	}
	if (MATTIE_ModManager.modManager.checkMod('devTools')) 	{
		// is dev tool enabled
		MATTIE.scenes.Scene_Misc.baseList.LIMBS = 'limbs';
		MATTIE.scenes.Scene_Misc.baseList.CHEATS = 'cheats';
		MATTIE.scenes.Scene_Misc.baseList.LOGIC = 'logical';
		MATTIE.scenes.Scene_Misc.baseList.TELEPORTS = 'TELEPORT';
	}
	if (MATTIE.isDev) 	{
		// is dev mode
		MATTIE.scenes.Scene_Misc.baseList.TAS = 'tas';
	}
}, 5000);

MATTIE.scenes.Scene_Misc.prototype = Object.create(Scene_MenuBase.prototype);
MATTIE.scenes.Scene_Misc.prototype.constructor = MATTIE.scenes.Scene_Misc;

MATTIE.scenes.Scene_Misc.prototype.initialize = function () {
	Scene_MenuBase.prototype.initialize.call(this);
	this.mode = 'switch';
};

/**
 * @description set the mode of the help menu to switch, false for var
 */
MATTIE.scenes.Scene_Misc.prototype.setModeSwitch = function (bool) {
	this.mode = bool ? 'switch' : 'var';
};

MATTIE.scenes.Scene_Misc.prototype.create = function () {
	Scene_MenuBase.prototype.create.call(this);
	this.tabDisplays = [];
	this._infoList = new MATTIE.windows.MenuSelectableBase(0, 0, 200);
	this._infoList.setItemList(Object.keys(MATTIE.scenes.Scene_Misc.baseList).map((e) => ({ name: MATTIE.scenes.Scene_Misc.baseList[e] })));
	this.addWindow(this._infoList);
	this.createEditWindow();
	this.createDebugHelpWindow();
	this.createCheatOptionsMenu();
	const that = this;
	this._infoList.select = function (index) {
		Window_Selectable.prototype.select.call(this, index);
		that.onTabSelect();
		that.refreshHelpWindow();
	};

	this._infoList.setHandler('cancel', () => SceneManager.pop());
	this._infoList.setHandler('ok', () => this.onTabSelect());
	this._infoList.activate();
};

MATTIE.scenes.Scene_Misc.prototype.onTabSelect = function () {
	const item = this._infoList.item();
	this.tabDisplays.forEach((tab) => {
		tab.deactivate();
		tab.hide();
	});
	if (item) {
		switch (item.name) {
		case MATTIE.scenes.Scene_Misc.baseList.LIMBS:
			console.log('limbs select');
			this._editWindow.setItemList(MATTIE.static.switch.characterLimbs);
			this._editWindow.select(this.last || 1);
			this._editWindow.show();
			this._debugHelpWindow.show();
			this._editWindow.activate();

			break;
		case MATTIE.scenes.Scene_Misc.baseList.CHEATS:
			this._editCheatWindow.setItemList(MATTIE.scenes.Scene_Misc.CHEATS);
			this._editCheatWindow.select(1);
			this._editCheatWindow.show();
			this._editCheatWindow.activate();
			this._editCheatWindow.refresh();
			break;
		case MATTIE.scenes.Scene_Misc.baseList.TAS:
			this._editCheatWindow.setItemList(MATTIE.scenes.Scene_Misc.TAS);
			this._editCheatWindow.select(1);
			this._editCheatWindow.show();
			this._editCheatWindow.activate();
			this._editCheatWindow.refresh();
			break;
		case MATTIE.scenes.Scene_Misc.baseList.LOGIC:
			this._editWindow.setItemList(MATTIE.static.switch.logical);
			this._editWindow.select(this.last || 1);
			this._editWindow.show();
			this._debugHelpWindow.show();
			this._editWindow.activate();
			break;
		case MATTIE.scenes.Scene_Misc.baseList.MULTIPLAYER:
			this._editCheatWindow.setItemList(MATTIE.scenes.Scene_Misc.MULTIPLAYER);
			this._editCheatWindow.select(1);
			this._editCheatWindow.show();
			this._editCheatWindow.activate();
			this._editCheatWindow.refresh();
			break;
		case MATTIE.scenes.Scene_Misc.baseList.TELEPORTS:
			this._editCheatWindow.setItemList(MATTIE.static.teleports);
			this._editCheatWindow.select(1);
			this._editCheatWindow.show();
			this._editCheatWindow.activate();
			this._editCheatWindow.refresh();
			break;
		default:
			break;
		}
	}
};

MATTIE.scenes.Scene_Misc.prototype.onEditCancel = function () {
	this._infoList.activate();
	this._editWindow.hide();
	this._debugHelpWindow.hide();
	this.refreshHelpWindow();
};

MATTIE.scenes.Scene_Misc.prototype.createEditWindow = function () {
	this._editWindow = new MATTIE.windows.Window_DebugSpecific(this._infoList.width, 0, Graphics.width - this._infoList.width);
	this._editWindow.hide();
	this._editWindow.setHandler('cancel', this.onEditCancel.bind(this));
	this.addWindow(this._editWindow);
	this.tabDisplays.push(this._editWindow);
};

MATTIE.scenes.Scene_Misc.CHEATS = [
	{
		id: 0, name: 'god mode', cmd: () => toggleGodMode(), bool: () => $gameSystem.godMode,
	},
	{
		id: 1, name: 'no hunger', cmd: () => toggleHunger(), bool: () => $gameSystem.hungerDisabled,
	},
	{
		id: 2, name: 'no health loss', cmd: () => toggleHealthLoss(), bool: () => $gameSystem.healthDisabled,
	},
	{
		id: 3, name: 'no mana loss', cmd: () => toggleManaLoss(), bool: () => $gameSystem.manaDisabled,
	},
	{
		id: 4, name: 'force dash', cmd: () => toggleForceDash(), bool: () => $gameSystem.forceDash,
	},
	{
		id: 5, name: 'hyper speed', cmd: () => toggleHyperSpeed(), bool: () => $gameSystem.hyperSpeed,
	},

];

MATTIE.scenes.Scene_Misc.MULTIPLAYER = [
	{
		id: 0,
		name: 'request resync (client)',
		btn: true,
		cmd: () => {
			if (MATTIE.multiplayer.isClient) { MATTIE.multiplayer.getCurrentNetController().emitRequestedVarSync(); }
			this.requestedSync = true;
		},
		bool: () => this.requestedSync,
	},
	{
		id: 1,
		name: 'send resync (host)',
		btn: true,
		cmd: () => {
			if (MATTIE.multiplayer.isHost) { MATTIE.multiplayer.getCurrentNetController().emitUpdateSyncedVars(); }
			this.sync = true;
		},
		bool: () => this.sync,
	},
	{
		id: 2,
		name: 'get unstuck',
		btn: true,
		cmd: () => {
			unstuck();
		},
		bool: () => this.sync,
	},
	{
		id: 3,
		name: 'TP to spawn (safe)',
		btn: true,
		cmd: () => {
			MATTIE.multiplayer.keybinds.tpToSpawn();
		},
		bool: () => this.sync,
	},
	{
		id: 4,
		name: 'blood portal (safe)',
		btn: true,
		cmd: () => {
			SceneManager.goto(Scene_Map);
			setTimeout(() => {
				$gameTemp.reserveCommonEvent(152);
			}, 1000);
		},
		bool: () => this.sync,
	},
	{
		id: 5,
		name: 'TP to next player (unsafe)',
		btn: true,
		cmd: () => {
			MATTIE.multiplayer.keybinds.tp();
		},
		bool: () => this.sync,
	},
	{
		id: 6,
		name: 'TP to last location (unsafe)',
		btn: true,
		cmd: () => {
			MATTIE.multiplayer.keybinds.tpLast();
		},
		bool: () => this.sync,
	},
	{
		id: 7,
		name: 'Toggle auto unstuck',
		cmd: () => { MATTIE.unstuckAPI.togglePermanentUnstuck(!MATTIE.unstuckAPI.autoUnstuckOn); },
		bool: () => MATTIE.unstuckAPI.autoUnstuckOn,

	},

	{
		id: 8,
		name: 'Toggle player freemovement',
		cmd: () => {
			const bool = !MATTIE.multiplayer.config.freeMove;
			MATTIE.multiplayer.config.freeMove = bool;
		},
		bool: () => MATTIE.multiplayer.config.freeMove,
	},

];

MATTIE.scenes.Scene_Misc.TAS = [
	{
		id: 0, name: 'enableTas', cmd: () => toggleTas(), bool: () => $gameSystem.tas,
	},

];

MATTIE.scenes.Scene_Misc.prototype.createCheatOptionsMenu = function () {
	const that = this;
	this._editCheatWindow = new MATTIE.windows.Window_DebugSpecific(this._infoList.width, 0, Graphics.width - this._infoList.width);
	this._editCheatWindow.hide();
	const prevFunc = this._editCheatWindow.select;
	this._editCheatWindow.setItemList(MATTIE.scenes.Scene_Misc.CHEATS);
	this._editCheatWindow.updateSwitch = function () {
		if (Input.isRepeated('ok')) {
			const index = that._editCheatWindow.index();
			that._editCheatWindow._itemList[index].cmd();
			// that._editCheatWindow._itemList[index].bool =  !that._editCheatWindow._itemList[index].bool;
			this.redrawCurrentItem();
			setTimeout(() => {
				this.redrawItem(index);
			}, 750);
		}
	};

	this._editCheatWindow.itemStatus = function (dataId) {
		if (this.isBtn) {
			return Input.isTriggered('ok') ? '[Processing]' : '[Not Active]';
		}
		return that._editCheatWindow._itemList[dataId].bool() ? '[ON]' : '[OFF]';
	};
	this._editCheatWindow.hide();
	this._editCheatWindow.setHandler('cancel', this.onEditCancel.bind(this));
	this.addWindow(this._editCheatWindow);
	this.tabDisplays.push(this._editCheatWindow);
	this._editCheatWindow.refresh();
};

MATTIE.scenes.Scene_Misc.prototype.createDebugHelpWindow = function () {
	var wx = this._editWindow.x;
	var wy = this._editWindow.height;
	var ww = this._editWindow.width;
	var wh = Graphics.boxHeight - wy;
	this._debugHelpWindow = new Window_Base(wx, wy, ww, wh);
	this.addWindow(this._debugHelpWindow);
	this.tabDisplays.push(this._debugHelpWindow);
};

MATTIE.scenes.Scene_Misc.prototype.helpText = function () {
	if (this.mode === 'switch') {
		return 'Enter : ON / OFF';
	}
	return ('Left     :  -1\n'
                + 'Right    :  +1\n'
                + 'Pageup   : -10\n'
                + 'Pagedown : +10');
};

MATTIE.scenes.Scene_Misc.prototype.refreshHelpWindow = function () {
	this._debugHelpWindow.contents.clear();
	if (this._editWindow.active) {
		this._debugHelpWindow.drawTextEx(this.helpText(), 4, 0);
	}
};
