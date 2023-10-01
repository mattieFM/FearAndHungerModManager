MATTIE.menus = MATTIE.menus || {};
MATTIE.windows = MATTIE.windows || {};
MATTIE.scenes = MATTIE.scenes || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};

/**
 * @namespace MATTIE.menus.mainMenu
 * @description methods related to main menu manipulation
 * */
MATTIE.menus.mainMenu = MATTIE.menus.mainMenu || {};

var MATTIE_RPG = MATTIE_RPG || {};
TextManager.Mods = 'Mods';

/**
 * @description removes a button from the main menu forcibly. That is to say this is able
 * to override other mods that add buttons to main menu, it will just disable the command from displaying period.
 * */
MATTIE.menus.mainMenu.removeBtnFromMainMenu = function (displayText, sym) {
	const prevFunc = Window_TitleCommand.prototype.addCommand;
	Window_TitleCommand.prototype.addCommand = function (name, symbol, enabled, ext) {
		if (name != displayText && symbol != sym) {
			prevFunc.call(this, name, symbol, enabled, ext);
		}
	};
};

/**
 * @description add a new button to the main menu
 * @param {string} displayText the text to display
 * @param {string} cmdText the string to name the command (must be unique)
 * @param {Function} cb the callback
 */

MATTIE.menus.mainMenu.addBtnToMainMenu = function (displayText, cmdText, cb, enabled = true) {
	cmdText = `MATTIEModManager${cmdText}`;

	const previousFunc = Scene_Title.prototype.createCommandWindow;

	Scene_Title.prototype.createCommandWindow = function () {
		previousFunc.call(this);
		this._commandWindow.setHandler(cmdText, (cb).bind(this));
	};
	const prevWindowTitle = Window_TitleCommand.prototype.makeCommandList;

	Window_TitleCommand.prototype.makeCommandList = function () {
		let bool = enabled;
		try {
			bool = enabled();
		} catch (error) {
			// throw error
		}
		prevWindowTitle.call(this);
		this.addCommand(displayText, cmdText, bool);
	};
};
