var MATTIE = MATTIE || {};
MATTIE.menus = MATTIE.menus || {};
MATTIE.windows = MATTIE.windows || {};
MATTIE.scenes = MATTIE.scenes || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};
MATTIE.menus.mainMenu = MATTIE.menus.mainMenu || {};

var MATTIE_RPG = MATTIE_RPG || {};
TextManager.Mods = "Mods";

/** @description removes a */
MATTIE.menus.mainMenu.removeBtnFromMainMenu = function(displayText,sym){
    let prevFunc = Window_TitleCommand.prototype.addCommand
    Window_TitleCommand.prototype.addCommand = function(name, symbol, enabled, ext){
        console.log(name);
        if(name != displayText && symbol !=sym){
            prevFunc.call(this,name,symbol,enabled,ext);
        }
    }
}


/**
 * @description add a new button to the main menu
 * @param {string} displayText the text to display
 * @param {string} cmdText the string to name the command (must be unique)
 * @param {()=>{}} cb the callback
 */

MATTIE.menus.mainMenu.addBtnToMainMenu = function (displayText,cmdText,cb,enabled=true) {
    cmdText ="MATTIEModManager" + cmdText

    var previousFunc = Scene_Title.prototype.createCommandWindow;

    Scene_Title.prototype.createCommandWindow = function() {
        previousFunc.call(this)
        this._commandWindow.setHandler(cmdText, (cb).bind(this));
    };
    var prevWindowTitle = Window_TitleCommand.prototype.makeCommandList;

    Window_TitleCommand.prototype.makeCommandList = function() {
        let bool = enabled;
        try {
            bool = enabled();
        } catch (error) {
            
        }
        prevWindowTitle.call(this);
        this.addCommand(displayText, cmdText, bool);
    };
} 



