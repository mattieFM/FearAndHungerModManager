var MATTIE = MATTIE || {};
MATTIE.menus.mainMenu = MATTIE.menus.mainMenu || {};

var MATTIE_RPG = MATTIE_RPG || {};


/**
 * @description add a new button to the main menu
 * @param {string} displayText the text to display
 * @param {string} cmdText the string to name the command (must be unique)
 * @param {()=>{}} cb the callback
 */

MATTIE.menus.mainMenu.addBtnToMainMenu = function (displayText,cmdText,cb) {
    cmdText ="MATTIEModManager" + cmdText
    TextManager.multiplayer = displayText;

    MATTIE_RPG.Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;

    Scene_Title.prototype.createCommandWindow = function() {
        MATTIE_RPG.Scene_Title_createCommandWindow.call(this)
        this._commandWindow.setHandler(cmdText, (cb).bind(this));
    };
    MATTIE_RPG.WindowTitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;

    Window_TitleCommand.prototype.makeCommandList = function() {
        MATTIE_RPG.WindowTitleCommand_makeCommandList.call(this);
        this.addCommand(TextManager.multiplayer,   cmdText);
    };
} 