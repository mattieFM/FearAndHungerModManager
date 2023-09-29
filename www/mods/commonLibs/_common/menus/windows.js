/**
 * create a new horisontal btn menu
 * y pos,
 * btns
 * width
 * @class
 */
MATTIE.windows.horizontalBtns = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.windows.horizontalBtns.prototype = Object.create(Window_HorzCommand.prototype);
MATTIE.windows.horizontalBtns.prototype.constructor = MATTIE.windows.horizontalBtns;

MATTIE.windows.horizontalBtns.prototype.initialize = function (y, btns, width, enabled = null) {
	this._mattieBtns = btns;
	this._mattieMaxCols = width;
	this.enabled = enabled;
	Window_HorzCommand.prototype.initialize.call(this, 0, 0);
	this.updatePlacement(y);
};

MATTIE.windows.horizontalBtns.prototype.updateWidth = function (width) {
	this.width = width;
	this.refresh();
	this.select(0);
	this.activate();
};

MATTIE.windows.horizontalBtns.prototype.windowWidth = function () {
	return this.width || 240;
};

MATTIE.windows.horizontalBtns.prototype.updatePlacement = function (y) {
	this.x = (Graphics.boxWidth - this.width) / 2;
	this.y = y;
};

MATTIE.windows.horizontalBtns.prototype.maxCols = function () {
	return this._mattieMaxCols;
};

/**
 *
 * @param {dict} btns a key pair value {displayname:commandname}
 */
MATTIE.windows.horizontalBtns.prototype.makeCommandList = function () {
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
MATTIE.windows.textDisplay = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.windows.textDisplay.prototype = Object.create(Window_Base.prototype);
MATTIE.windows.textDisplay.prototype.constructor = MATTIE.windows.textDisplay;

MATTIE.windows.textDisplay.prototype.initialize = function (x, y, width, height, text) {
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
MATTIE.windows.textDisplay.prototype.updatePlacement = function (xOffset = 0, yOffset = 0) {
	this.x = ((Graphics.boxWidth - this.width)) / 2 + xOffset;
	this.y = ((Graphics.boxHeight - this.height)) / 2 + yOffset;
};

MATTIE.windows.textDisplay.prototype.updateText = function (text) {
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

MATTIE.windows.textDisplay.prototype.windowWidth = function () {
	return this.mattieWidth;
};

/**
 * A list with header
 * @extends Window_Base
 * @class
 */
MATTIE.windows.list = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.windows.list.prototype = Object.create(MATTIE.windows.textDisplay.prototype);
MATTIE.windows.list.prototype.constructor = MATTIE.windows.list;

MATTIE.windows.list.prototype.initialize = function (x, y, width, height, header) {
	this._items = [];
	this._index = 0;
	this._header = header;
	MATTIE.windows.textDisplay.prototype.initialize.call(this, x, y, width, height);
};

MATTIE.windows.list.prototype.updateText = function (text) {
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

MATTIE.windows.list.prototype.addItem = function (text) {
	this.drawText(text, 0, 25 * this._index, 0);
	this._index++;
};

/**
 * A window to display text
 * @extends MATTIE.windows.textDisplay
 */
MATTIE.windows.textInput = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.windows.textInput.prototype = Object.create(MATTIE.windows.textDisplay.prototype);
MATTIE.windows.textInput.prototype.constructor = MATTIE.windows.textInput;

MATTIE.windows.textInput.prototype.initialize = function (x, y, width, height, header) {
	this._text = '';
	this._header = header;
	MATTIE.windows.textDisplay.prototype.initialize.call(this, x, y, width, height, '');
	this.updatePlacement();
	this.initEventHandler();
};
MATTIE.windows.textInput.prototype.close = function () {
	MATTIE.windows.textDisplay.prototype.close.call(this);
	document.removeEventListener('keydown', this._listenFunc, false);
};
MATTIE.windows.textInput.prototype.initEventHandler = function () {
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

MATTIE.windows.textInput.prototype.getInput = function () {
	return this._text;
};
MATTIE.windows.textInput.prototype.updateText = function (text = this._text) {
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
		TextManager[`MATTIE_${name}`] = name;
		this.addCommand(TextManager[`MATTIE_${name}`], `MATTIE_${name}`, status);
		// TextManager["MATTIE_"+name+"_STATUS"] = (status? "active": "not active");
		// this.addCommand(TextManager["MATTIE_"+name+"_STATUS"], "MATTIE_"+name, status);
		TextManager[`MATTIE_${name}_CONFIG`] = 'Config';
		this.addCommand(TextManager[`MATTIE_${name}_CONFIG`], `MATTIE_${name}_CONFIG`, status);
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
			alert('TODO: make config editable in game');
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
