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
    this.addPlayerListWindow();
    this.addOptionsBtns();
    MATTIE.multiplayer.netController.host.on("open", ()=>{
        this.addPeerDisplayWindow();
        this.initListController();
    });
}

MATTIE.scenes.multiplayer.host.prototype.addPlayerListWindow = function(){
    this._playerWindow = new MATTIE.windows.list(0,0,600,300,"Connected Players:");
    this._playerWindow.updatePlacement(0,15)
    this.addWindow(this._playerWindow);
}

MATTIE.scenes.multiplayer.host.prototype.initListController = function(){
    var netController = MATTIE.multiplayer.netController; 
    netController.addListener('connect', (name) =>{
        this._playerWindow.addItem(name)
    })
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
    this._optionsWindow.setHandler(MATTIE.CmdManager.startGame, (()=>{
        let obj = {};
        obj.gameStarted = "y";
        MATTIE.multiplayer.netController.sendAll(obj);
        
        MATTIE.menus.multiplayer.openGame();
    }).bind(this));
    this._optionsWindow.setHandler(MATTIE.CmdManager.returnToMultiplayer,  MATTIE.menus.multiplayer.openMultiplayer.bind(this));
    this.addWindow(this._optionsWindow);
}

