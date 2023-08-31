var MATTIE = MATTIE || {};
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};
MATTIE.TextManager.joinGame = "Join";
MATTIE.TextManager.returnToMultiplayer = "Return";
MATTIE.CmdManager.joinGame = "MATTIE_Join_Game"
MATTIE.CmdManager.returnToMultiplayer = "MATTIE_ReturnToMulti"

/**
 * @description The scene for hosting a multiplayer game
 * @extends Scene_Base
 */
MATTIE.scenes.multiplayer.join = function () {
    this.initialize.apply(this, arguments);
}
MATTIE.scenes.multiplayer.join.prototype = Object.create(MATTIE.scenes.multiplayer.base.prototype); //extend Scene_Base
MATTIE.scenes.multiplayer.join.prototype.constructor = MATTIE.scenes.multiplayer.join; //use constructor

MATTIE.scenes.multiplayer.join.prototype.create = function(){ 
    MATTIE.scenes.multiplayer.base.prototype.create.call(this);
    this.createWindowLayer();
    this.addOptionsBtns();
    this.addTextField();
}
MATTIE.scenes.multiplayer.join.prototype.addTextField = function (){
    this._inputWin = new MATTIE.windows.textInput(0,0,500,150,"Enter your connection key below:")
    this.addWindow(this._inputWin);
}
MATTIE.scenes.multiplayer.join.prototype.addOptionsBtns = function(){
    let btns = {}
    btns[MATTIE.TextManager.joinGame] = MATTIE.CmdManager.joinGame;
    btns[MATTIE.TextManager.returnToMultiplayer] = MATTIE.CmdManager.returnToMultiplayer;
    this._optionsWindow = new MATTIE.windows.horizontalBtns(175+300+10, btns, 2);
    this._optionsWindow.setHandler(MATTIE.CmdManager.joinGame, (()=>{
        MATTIE.multiplayer.clientController.hostId = this._inputWin.getInput()
        MATTIE.menus.multiplayer.openLobby();
    }).bind(this));
    this._optionsWindow.setHandler(MATTIE.CmdManager.returnToMultiplayer, (()=> {
        
        MATTIE.menus.multiplayer.openMultiplayer();
    
    }).bind(this));
    this.addWindow(this._optionsWindow);
}