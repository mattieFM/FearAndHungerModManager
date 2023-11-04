/**
 * create a new horisontal btn menu
 * y pos,
 * btns
 * width
 * @class
 */
MATTIE.windows.HorizontalBtns = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.windows.HorizontalBtns.prototype = Object.create(Window_HorzCommand.prototype);
MATTIE.windows.HorizontalBtns.prototype.constructor = MATTIE.windows.HorizontalBtns;

MATTIE.windows.HorizontalBtns.prototype.initialize = function (y, btns, width, enabled = null) {
	this._mattieBtns = btns;
	this._mattieMaxCols = width;
	this.enabled = enabled;
	Window_HorzCommand.prototype.initialize.call(this, 0, 0);
	this.updatePlacement(y);
};

MATTIE.windows.HorizontalBtns.prototype.updateWidth = function (width) {
	this.width = width;
	this.refresh();
	this.select(0);
	this.activate();
};

MATTIE.windows.HorizontalBtns.prototype.windowWidth = function () {
	return this.width || 240;
};

MATTIE.windows.HorizontalBtns.prototype.updatePlacement = function (y) {
	this.x = (Graphics.boxWidth - this.width) / 2;
	this.y = y;
};

MATTIE.windows.HorizontalBtns.prototype.maxCols = function () {
	return this._mattieMaxCols;
};

/**
 *
 * @param {dict} btns a key pair value {displayname:commandname}
 */
MATTIE.windows.HorizontalBtns.prototype.makeCommandList = function () {
	Object.keys(this._mattieBtns).forEach((key) => {
		let added = false;
		if (this.enabled) {
			if (this.enabled[key]) {
				this.addCommand(key, this._mattieBtns[key], this.enabled[key].val);
				added = true;
			}
		}

		if (!added) this.addCommand(key, this._mattieBtns[key]);
	});
};

/**
 * A window to display text
 * @extends Window_Base
 * @class
 */
MATTIE.windows.TextDisplay = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.windows.TextDisplay.prototype = Object.create(Window_Base.prototype);
MATTIE.windows.TextDisplay.prototype.constructor = MATTIE.windows.TextDisplay;

MATTIE.windows.TextDisplay.prototype.initialize = function (x, y, width, height, text) {
	Window_Base.prototype.initialize.call(this, x, y, width, height);
	this.mattieWidth = width;
	this.resetTextColor();
	this.changePaintOpacity(true);
	this.updateText(text);
};

/**
 * center this window then add the offsets
 * @param {*} xOffset how much to offset x by
 * @param {*} yOffset how much to offset y by
 */
MATTIE.windows.TextDisplay.prototype.updatePlacement = function (xOffset = 0, yOffset = 0) {
	this.x = ((Graphics.boxWidth - this.width)) / 2 + xOffset;
	this.y = ((Graphics.boxHeight - this.height)) / 2 + yOffset;
};

MATTIE.windows.TextDisplay.prototype.updateText = function (text) {
	this.contents.clear();
	if (typeof text === typeof 'string') {
		text += '\n';
		text = text.split('\n');
	}
	let i = 0;
	text.forEach((element) => {
		this.drawText(element, 0, 25 * i, 0);
		i++;
	});
};

MATTIE.windows.TextDisplay.prototype.windowWidth = function () {
	return this.mattieWidth;
};

/**
 * A list with header
 * @extends Window_Base
 * @class
 */
MATTIE.windows.List = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.windows.List.prototype = Object.create(MATTIE.windows.TextDisplay.prototype);
MATTIE.windows.List.prototype.constructor = MATTIE.windows.List;

MATTIE.windows.List.prototype.initialize = function (x, y, width, height, header) {
	this._items = [];
	this._index = 0;
	this._header = header;
	MATTIE.windows.TextDisplay.prototype.initialize.call(this, x, y, width, height);
};

MATTIE.windows.List.prototype.updateText = function (text) {
	if (typeof text === typeof 'string') {
		text += '\n';
		text = text.split('\n');
		this._items = text;
	} else if (typeof text === typeof []) {
		this._items = text;
	}
	this.contents.clear();
	this._index = 0;
	this.drawText(this._header, 0, 25 * this._index, 0);
	this._index++;
	this._items.forEach((element) => {
		this.drawText(element, 0, 25 * this._index, 0);
		this._index++;
	});
};

MATTIE.windows.List.prototype.addItem = function (text) {
	this.drawText(text, 0, 25 * this._index, 0);
	this._index++;
};

/**
 * A window to display text
 * @extends MATTIE.windows.TextDisplay
 * @class
 */
MATTIE.windows.TextInput = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.windows.TextInput.prototype = Object.create(MATTIE.windows.TextDisplay.prototype);
MATTIE.windows.TextInput.prototype.constructor = MATTIE.windows.TextInput;

MATTIE.windows.TextInput.prototype.initialize = function (x, y, width, height, header) {
	this._text = '';
	this._header = header;
	MATTIE.windows.TextDisplay.prototype.initialize.call(this, x, y, width, height, '');
	this.updatePlacement();
	this.initEventHandler();
};
MATTIE.windows.TextInput.prototype.close = function () {
	MATTIE.windows.TextDisplay.prototype.close.call(this);
	document.removeEventListener('keydown', this._listenFunc, false);
};
MATTIE.windows.TextInput.prototype.initEventHandler = function () {
	let lastKey = '';
	this._listenFunc = (event) => {
		console.log(event.key);
		const { key } = event;
		// this is fucky but w/e its just a shitty menu so it shouldn't cause issues
		if (!key.startsWith('Arrow')) { // no arrow key inputs
			if (key !== 'Return') {
				if (key !== 'Enter') {
					if (key !== 'PageDown') {
						if (key !== 'PageUp') {
							if (key !== 'Shift') {
								if (key === 'Control') {
									lastKey = 'Control';
								} else if (key !== 'Alt') {
									if (key !== 'Tab') {
										switch (key) {
										case 'Escape':
											this._text = '';
											break;
										case 'Backspace':
											this._text = this._text.slice(0, this._text.length - 1);
											break;
										case 'v':
										case 'V':
											if (lastKey === 'Control') {
												let data;
												if (Utils.isNwjs) {
													data = nwGui.Clipboard.get().get();
												} else {
													data = window.navigator.clipboard.readText();
												}
												this._text += data;
												break;
											}
										default:
											this._text += key;
											break;
										}
									}
								}
							}
						}
					}
				}
			}
		}
		this.updateText();
	};

	document.addEventListener('keydown', this._listenFunc, false);

	setTimeout(() => { // automatically close after 50 seconds
		this.close();
	}, 50000);
};

MATTIE.windows.TextInput.prototype.getInput = function () {
	return this._text;
};
MATTIE.windows.TextInput.prototype.updateText = function (text = this._text) {
	if (text != this._text) {
		this._text = text;
	}
	this.contents.clear();
	let i = 0;
	this.drawText(this._header, 0, 25 * i, 0);
	i++;

	if (typeof text === typeof 'string') {
		text += '\n';
		text = text.split('\n');
	}
	text.forEach((element) => {
		this.drawText(element, 0, 25 * i, 0);
		i++;
	});
};

MATTIE.windows.ModListWin = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.windows.ModListWin.prototype = Object.create(Window_HorzCommand.prototype);
MATTIE.windows.ModListWin.prototype.constructor = MATTIE.windows.ModListWin;

MATTIE.windows.ModListWin.prototype.initialize = function () {
	Window_HorzCommand.prototype.initialize.call(this, 0, 0);
	this.setUpHandlers();
};

MATTIE.windows.ModListWin.prototype.refresh = function () {
	Window_HorzCommand.prototype.refresh.call(this);
	this.curRow = 0;
};
MATTIE.windows.ModListWin.prototype.drawItem = function (index) {
	this.curRow = this.curRow || 0;
	if (index % this.maxCols() == 0) this.curRow++;
	var rect = this.itemRect(index);
	this.contents.paintOpacity = 5;
	if (this.curRow == 1) {
		this.contents.paintOpacity = 15;
		this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, 'white');
	} else
		if (this.curRow % 2 == 0) {
			this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, 'black');
		} else {
			this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, 'white');
		}

	var rect = this.itemRectForText(index);
	const align = this.itemTextAlign();
	this.resetTextColor();
	this.changePaintOpacity(this._list[index].modActive);
	this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};

MATTIE.windows.ModListWin.prototype.addCommand = function (name, symbol, enabled) {
	Window_HorzCommand.prototype.addCommand.call(this, name, symbol);
	this._list[this._list.length - 1].modActive = enabled;
};

MATTIE.windows.ModListWin.prototype.itemTextAlign = function () {
	return 'left';
};

MATTIE.windows.ModListWin.prototype.windowWidth = function () {
	return Graphics.boxWidth;
};

MATTIE.windows.ModListWin.prototype.maxCols = function () {
	return 2;
};

MATTIE.windows.ModListWin.prototype.numVisibleRows = function () {
	return 14;
};

MATTIE.windows.ModListWin.prototype.makeCommandList = function () {
	TextManager['MATTIE_' + 'Vanilla_Fear_And_Hunger'] = 'Vanilla Fear & Hunger';
	this.addCommand(TextManager['MATTIE_' + 'Vanilla_Fear_And_Hunger'], 'MATTIE_' + 'Vanilla_Fear_And_Hunger', MATTIE_ModManager.modManager.checkVanilla());

	TextManager['MATTIE_' + 'Vanilla_Save_Compatible'] = 'Vanilla Save Compatible';
	// eslint-disable-next-line max-len
	this.addCommand(TextManager['MATTIE_' + 'Vanilla_Save_Compatible'], 'MATTIE_' + 'Vanilla_Save_Compatible', !MATTIE_ModManager.modManager.checkSaveDanger() && !MATTIE_ModManager.modManager.checkForceModdedSaves());

	TextManager['MATTIE_' + 'Force_Vanilla_Saves'] = 'Force Vanilla Saves';
	this.addCommand(TextManager['MATTIE_' + 'Force_Vanilla_Saves'], 'MATTIE_' + 'Force_Vanilla_Saves', MATTIE_ModManager.modManager.checkForceVanillaSaves());

	TextManager['MATTIE_' + 'Force_Modded_Saves'] = 'Force Modded Saves';
	this.addCommand(TextManager['MATTIE_' + 'Force_Modded_Saves'], 'MATTIE_' + 'Force_Modded_Saves', MATTIE_ModManager.modManager.checkForceModdedSaves());

	this.addCommand('', '', false);
	this.addCommand('', '', false);

	MATTIE_ModManager.modManager.getAllMods().forEach((mod) => {
		const { name } = mod;
		const status = MATTIE_ModManager.modManager.getModActive(name);
		const modInfo = MATTIE_ModManager.modManager.getModInfo(MATTIE_ModManager.modManager.getPath(), name);

		if (!modInfo.hidden || MATTIE.isDev) {
			TextManager[`MATTIE_${name}`] = name;
			this.addCommand(TextManager[`MATTIE_${name}`], `MATTIE_${name}`, status);
			// TextManager["MATTIE_"+name+"_STATUS"] = (status? "active": "not active");
			// this.addCommand(TextManager["MATTIE_"+name+"_STATUS"], "MATTIE_"+name, status);
			TextManager[`MATTIE_${name}_CONFIG`] = 'Config';
			this.addCommand(TextManager[`MATTIE_${name}_CONFIG`], `MATTIE_${name}_CONFIG`, status);
		}
	});
	TextManager['MATTIE_' + 'Apply Changes'] = 'Apply Changes';
	TextManager['MATTIE_' + 'Toggle Dev'] = 'Toggle Dev';
	this.addCommand(TextManager['MATTIE_' + 'Apply Changes'], 'MATTIE_' + 'Apply Changes', true);
	this.addCommand(TextManager['MATTIE_' + 'Toggle Dev'], 'MATTIE_' + 'Toggle Dev', MATTIE.isDev);
};

MATTIE.windows.ModListWin.prototype.reloadModsIfNeeded = function () {
	const bool = MATTIE_ModManager.modManager.checkModsChanged();
	if (bool) {
		alert('Press Okay to Reload Mods.');
		MATTIE_ModManager.modManager.reloadGame();
	} else {
		SceneManager.pop();
		setTimeout(() => {
			MATTIE.msgAPI.footerMsg('No Changes to mods were made, no reload is needed.');
		}, 200);
	}
};

MATTIE.windows.ModListWin.prototype.setUpHandlers = function () {
	this.setHandler('MATTIE_' + 'Vanilla_Fear_And_Hunger', (() => {
		MATTIE_ModManager.modManager.setVanilla();
		this.refresh();
		this.activate();
	}));

	this.setHandler('MATTIE_' + 'Vanilla_Save_Compatible', (() => {
		MATTIE_ModManager.modManager.setNonDanger();
		this.refresh();
		this.activate();
	}));

	this.setHandler('MATTIE_' + 'Force_Vanilla_Saves', (() => {
		MATTIE_ModManager.modManager.switchForceVanillaSaves();
		this.refresh();
		this.activate();
	}));

	this.setHandler('MATTIE_' + 'Force_Modded_Saves', (() => {
		MATTIE_ModManager.modManager.switchForceModdedSaves();
		this.refresh();
		this.activate();
	}));

	MATTIE_ModManager.modManager.getAllMods().forEach((mod) => {
		const { name } = mod;
		const { status } = mod;
		this.setHandler(`MATTIE_${name}`, (() => {
			MATTIE_ModManager.modManager.switchStatusOfMod(name);
			this.refresh();
			this.activate();
		}));

		this.setHandler(`MATTIE_${name}_CONFIG`, (() => {
			const configPath = MATTIE_ModManager.modManager.getModConfigFile(name);
			if (configPath) {
				if (MATTIE_ModManager.modManager.getModActive(name)) {
					if (MATTIE_ModManager.modManager.checkModHasChanged(name)) {
						alert('You seem to have just toggled on this mod, you must reload and then you may configure it.\nPress Okay to reload mods.');
						MATTIE_ModManager.modManager.reloadGame();
					} else {
						Graphics.displayFile(configPath);
					}
				} else {
					alert('cannot configure inactive mods');
				}
			} else {
				alert('mod does not provide config');
			}
			this.refresh();
			this.activate();
		}));
	});

	this.setHandler('cancel', (() => { this.reloadModsIfNeeded(); }));

	this.setHandler('MATTIE_' + 'Apply Changes', (() => { this.reloadModsIfNeeded(); }));
	this.setHandler('MATTIE_' + 'Toggle Dev', (() => {
		MATTIE.isDev = !MATTIE.isDev;
		MATTIE.DataManager.global.set('isDev', MATTIE.isDev);
		this.refresh();
		this.activate();
	}));
};

MATTIE.windows.ModListWin.prototype.setItemWindow = function (itemWindow) {
	this._itemWindow = itemWindow;
	this.update();
};

/**
 * @description a window used for the base of a selectable window
 */
MATTIE.windows.MenuSelectableBase = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.windows.MenuSelectableBase.prototype = Object.create(Window_Selectable.prototype);
MATTIE.windows.MenuSelectableBase.prototype.constructor = MATTIE.windows.menuSelectableBase;

MATTIE.windows.MenuSelectableBase.prototype.initialize = function (x, y, width = null) {
	this._data = [];
	this._itemList = ['test', 'test2'];
	width = width || this.windowWidth();
	var height = this.windowHeight();
	Window_Selectable.prototype.initialize.call(this, x, y, width, height);
	this._formationMode = false;
	this._pendingIndex = -1;
	this.select(0);
	this.refresh();
};

MATTIE.windows.MenuSelectableBase.prototype.windowWidth = function () {
	return Graphics.boxWidth - 240;
};

MATTIE.windows.MenuSelectableBase.prototype.windowHeight = function () {
	return Graphics.boxHeight;
};

MATTIE.windows.MenuSelectableBase.prototype.maxItems = function () {
	return 10;
};

MATTIE.windows.MenuSelectableBase.prototype.numVisibleRows = function () {
	return 4;
};

MATTIE.windows.MenuSelectableBase.prototype.item = function () {
	return this._itemList[this.index()];
};
MATTIE.windows.MenuSelectableBase.prototype.drawItem = function (index) {
	var data = this._data[index];
	if (data) {
		var rect = this.itemRect(index);
		rect.width -= this.textPadding();
		this.drawItemName(data, rect.x, rect.y, rect.width);
	}
};
MATTIE.windows.MenuSelectableBase.prototype.setItemList = function (list) {
	this._itemList = list;
	this.refresh();
};

MATTIE.windows.MenuSelectableBase.prototype.makeItemList = function () {
	this._data = this._itemList;
};

MATTIE.windows.MenuSelectableBase.prototype.refresh = function () {
	this.makeItemList();
	this.createContents();
	this.drawAllItems();
};

//-----------------------------------------------------------------------------
// Window_DebugSpecific
//----------------------------------------------------------------------------

/**
 * @description the window used for displaying specific switches/variables in a long list to the player
 */

MATTIE.windows.Window_DebugSpecific = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.windows.Window_DebugSpecific.prototype = Object.create(Window_DebugEdit.prototype);
MATTIE.windows.Window_DebugSpecific.prototype.constructor = MATTIE.windows.Window_DebugSpecific;

MATTIE.windows.Window_DebugSpecific.prototype.initialize = function (x, y, width) {
	this._itemList = [1];
	Window_DebugEdit.prototype.initialize.call(this, x, y, width);
};

MATTIE.windows.Window_DebugSpecific.prototype.maxItems = function () {
	return 100;
};
MATTIE.windows.Window_DebugSpecific.prototype.setItemList = function (list) {
	this._itemList = list;
	this.refresh();
};

MATTIE.windows.Window_DebugSpecific.prototype.drawItem = function (index) {
	var dataId = this._itemList[index] || null;
	var name;
	this.isBtn = false;
	if (typeof dataId == 'object' && dataId != null) {
		const temp = dataId;
		dataId = temp.id;
		name = temp.name;
		if (temp.btn) {
			this.isBtn = true;
		}
	} else {
		name = dataId != null ? this.itemName(dataId) : '';
	}
	var idText = dataId != null ? `${dataId.padZero(4)}:` : '';
	var idWidth = this.textWidth(idText);
	var statusWidth = this.textWidth('-00000000');
	var status = dataId != null ? this.itemStatus(dataId) : '';
	var rect = this.itemRectForText(index);
	this.resetTextColor();
	this.drawText(idText, rect.x, rect.y, rect.width);
	rect.x += idWidth;
	rect.width -= idWidth + statusWidth;
	this.drawText(name, rect.x, rect.y, rect.width);
	this.drawText(status, rect.x + rect.width, rect.y, statusWidth, 'right');
};

MATTIE.windows.Window_DebugSpecific.prototype.currentId = function () {
	return this._itemList[this.index()].id || this._itemList[this.index()];
};

//-----------------------------------------------------------------------------
// Window_Honey
//
// The window for displaying the map name on the map screen.

/**
 * @description the honey window for silly mode, this can be used for any bar, just override it and do some basic work
 */
function Window_Honey() {
	this.initialize.apply(this, arguments);
}

Window_Honey.prototype = Object.create(Window_Base.prototype);
Window_Honey.prototype.constructor = Window_Honey;
/**
 * @param {function} cb a callback to call every time this bar decremets, passes this to it
 * @param {int} drainRate how many seconds per honey to drain
 */
Window_Honey.prototype.initialize = function (drainRate = 3, honey = 80, cb = () => {}) {
	var wight = this.windowWidth();
	var height = this.windowHeight();
	Window_Base.prototype.initialize.call(this, 0, 0, wight, height);
	this.opacity = 0;
	this.contentsOpacity = 200;
	this._showCount = 0;
	this.setHoney(honey);

	setInterval(() => {
		this.setHoney(this.currentHoney() - 1);
		cb(this);
		this.refresh();
	}, 1000 * drainRate);

	this.refresh();
};

Window_Honey.prototype.windowWidth = function () {
	return 360;
};

Window_Honey.prototype.windowHeight = function () {
	return this.fittingHeight(1);
};

Window_Honey.prototype.update = function () {
	Window_Base.prototype.update.call(this);
};

Window_Honey.prototype.maxHoney = () => 80;

Window_Honey.prototype.currentHoney = function () { return this._currentHoney; };

Window_Honey.prototype.setHoney = function (x) { this._currentHoney = x; };

Window_Honey.prototype.refresh = function () {
	this.contents.clear();

	var width = this.contentsWidth();
	// this.drawBackground(0, 0, width, this.lineHeight());

	this.contents.fillRect(0, 5, this.currentHoney(), 50, '#bd9f0d', '#bd9f0d');
	this.drawText('Honey', 0, 0, width);
	this.drawGauge(0, 5, 50, 1.6, '#f0e7bb', '#f2eed8');
};

Window_Honey.prototype.drawBackground = function (x, y, width, height) {
	var color1 = this.dimColor1();
	var color2 = this.dimColor2();
	this.contents.gradientFillRect(x, y, width / 2, height, color2, color1);
	this.contents.gradientFillRect(x + width / 2, y, width / 2, height, color1, color2);
};

/**
 * @description select the cancel button for the choice
 */
Window_ChoiceList.prototype.selectCancel = function () {
	this.select($gameMessage.choiceCancelType());
};

MATTIE.window_choiceList = Window_ChoiceList.prototype.initialize;
Window_ChoiceList.prototype.initialize = function (messageWindow) {
	MATTIE.window_choiceList.call(this, messageWindow);
	this.setHandler('cancel', this.callCancelHandler);
};
