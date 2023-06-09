var MATTIE = MATTIE || {};
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};
MATTIE.TextManager.startGame = "Start Game";
MATTIE.TextManager.returnToMultiplayer = "Return";
MATTIE.CmdManager.startGame = "MATTIE_Start_Game"
MATTIE.CmdManager.returnToMultiplayer = "MATTIE_ReturnToMulti"

/**
 * @description The scene for hosting a multiplayer game
 * @extends Scene_Base
 */
MATTIE.scenes.multiplayer.host = function () {
    this.initialize.apply(this, arguments);
}
MATTIE.scenes.multiplayer.host.prototype = Object.create(MATTIE.scenes.multiplayer.base.prototype); //extend Scene_Base
MATTIE.scenes.multiplayer.host.prototype.constructor = MATTIE.scenes.multiplayer.host; //use constructor

MATTIE.scenes.multiplayer.host.prototype.create = function(){ 
    MATTIE.scenes.multiplayer.base.prototype.create.call(this);
    this.createWindowLayer();
    MATTIE.multiplayer.netController.openHostPeer();
    MATTIE.multiplayer.netController.host.on("open", ()=>{
        this.addPlayerListWindow();
        this.addPeerDisplayWindow();
        this.addOptionsBtns();
    });
}

MATTIE.scenes.multiplayer.host.prototype.addPlayerListWindow = function(){
    this._playerWindow = new MATTIE.windows.multiplayer.playerList(175);
    this.addWindow(this._playerWindow);
}
MATTIE.scenes.multiplayer.host.prototype.addPeerDisplayWindow = function(){
    let text = [
        "People can join using this number:",
        MATTIE.multiplayer.netController.host.id
        ]
    this._peerWindow = new MATTIE.windows.textDisplay((Graphics.boxWidth - 600) / 2+100,0,600,100,text);
    this.addWindow(this._peerWindow);
}

MATTIE.scenes.multiplayer.host.prototype.addOptionsBtns = function(){
    let btns = {}
    btns[MATTIE.TextManager.startGame] = MATTIE.CmdManager.startGame;
    btns[MATTIE.TextManager.returnToMultiplayer] = MATTIE.CmdManager.returnToMultiplayer;
    this._optionsWindow = new MATTIE.windows.horizontalBtns(175+300+10, btns, 2);
    this._optionsWindow.setHandler(MATTIE.CmdManager.startGame, (()=>{console.log("start game")}).bind(this));
    this._optionsWindow.setHandler(MATTIE.CmdManager.returnToMultiplayer,  MATTIE.menus.multiplayer.openMultiplayer.bind(this));
    this.addWindow(this._optionsWindow);
}



/**
 * A list of connected players
 * @extends Window_Base
 */
MATTIE.windows.multiplayer.playerList = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.windows.multiplayer.playerList.prototype = Object.create(Window_Base.prototype);
MATTIE.windows.multiplayer.playerList.prototype.constructor = MATTIE.windows.multiplayer.playerList;

MATTIE.windows.multiplayer.playerList.prototype.initialize = function(y) {
    Window_Base.prototype.initialize.call(this, 0,0,400,300);
    this.updatePlacement(y);
    this.resetTextColor();
    this.changePaintOpacity(true);
    this.drawText("List Of Connected Players:",0,0,0)
    this.initNetCode();
    
};
MATTIE.windows.multiplayer.playerList.prototype.initNetCode = function(){
    var netController = MATTIE.multiplayer.netController; 
    netController.addListener('connect', (name) =>{
        this.drawText(name,0,25*netController.connections.length,0)
    })
}
MATTIE.windows.multiplayer.playerList.prototype.updatePlacement = function(y) {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = y;
};

MATTIE.windows.multiplayer.playerList.prototype.windowWidth = function() {
    return 400;
};

