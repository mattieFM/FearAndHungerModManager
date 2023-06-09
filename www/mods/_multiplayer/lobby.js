var MATTIE = MATTIE || {};
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};
/**
 * @description The scene for hosting a multiplayer game
 * @extends MATTIE.scenes.multiplayer.base
 */
MATTIE.scenes.multiplayer.lobby = function () {
    this.initialize.apply(this, arguments);
}
MATTIE.scenes.multiplayer.lobby.prototype = Object.create(MATTIE.scenes.multiplayer.base.prototype); //extend Scene_Base
MATTIE.scenes.multiplayer.lobby.prototype.constructor = MATTIE.scenes.multiplayer.lobby; //use constructor

MATTIE.scenes.multiplayer.lobby.prototype.create = function(){ 
    MATTIE.scenes.multiplayer.base.prototype.create.call(this);
    this.createWindowLayer();
    MATTIE.multiplayer.clientController.open();
    MATTIE.multiplayer.clientController.self.on("open", ()=>{
        this.addPlayerListWindow();
        this.initListController();
    });
}

MATTIE.scenes.multiplayer.lobby.prototype.addPlayerListWindow = function(){
    this._playerWindow = new MATTIE.windows.list(0,0,600,300,"Connected Players:");
    this._playerWindow.updatePlacement(0,15);
    this.addWindow(this._playerWindow);
}

MATTIE.scenes.multiplayer.lobby.prototype.initListController = function(){
    var clientController = MATTIE.multiplayer.clientController; 
    clientController.addListener('updateNetPlayers', (netPlayers) =>{
        let arr = [];
        for(key in netPlayers){
            let netPlayer = netPlayers[key];
            arr.push(netPlayer.name);
        }
        arr.push(clientController.player.name);
        this._playerWindow.updateText(arr);
    })

    clientController.addListener('startGame', () =>{
        MATTIE.menus.multiplayer.openGame();
    })
}
