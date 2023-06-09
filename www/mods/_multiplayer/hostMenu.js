var MATTIE = MATTIE || {};
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
/**
 * @description The scene for hosting a multiplayer game
 * @extends Scene_Base
 */
MATTIE.scenes.multiplayer.host = function () {
    this.initialize.apply(this, arguments);
}
MATTIE.scenes.multiplayer.host.prototype = Object.create(Scene_Base.prototype); //extend Scene_Base
MATTIE.scenes.multiplayer.host.prototype.constructor = MATTIE.scenes.multiplayer.host; //use constructor

MATTIE.scenes.multiplayer.host.prototype.create = function(){ 
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    this.createWindowLayer();
    MATTIE.multiplayer.netController.openHostPeer();
    MATTIE.multiplayer.netController.host.on("open", ()=>{
        this.addPlayerListWindow();
        this.addPeerDisplayWindow();
    });
    
    //Scene_Title.prototype.centerSprite(this._backSprite2);
}

MATTIE.scenes.multiplayer.host.prototype.addPlayerListWindow = function(){
    this._playerWindow = new MATTIE.windows.multiplayer.playerList();
    this.addWindow(this._playerWindow);
}
MATTIE.scenes.multiplayer.host.prototype.addPeerDisplayWindow = function(){
    this._peerWindow = new MATTIE.windows.multiplayer.peerDisplay();
    this.addWindow(this._peerWindow);
}

MATTIE.scenes.multiplayer.host.prototype.createBackground = function() {
    this._backSprite2 = new Sprite(ImageManager.loadBitmap("mods/_multiplayer/","multiPlayerMenu",0,true));
    this.addChild(this._backSprite2);
};

/**
 * A window to display the peer id
 * @extends Window_Base
 */
MATTIE.windows.multiplayer.peerDisplay = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.windows.multiplayer.peerDisplay.prototype = Object.create(Window_Base.prototype);
MATTIE.windows.multiplayer.peerDisplay.prototype.constructor = MATTIE.windows.multiplayer.peerDisplay;

MATTIE.windows.multiplayer.peerDisplay.prototype.initialize = function() {
    Window_Base.prototype.initialize.call(this, 0,0,600,100);
    this.updatePlacement();
    this.resetTextColor();
    this.changePaintOpacity(true);
    
    this.drawText("People can join using this number:",0,0,0)
    this.drawText(MATTIE.multiplayer.netController.host.id,0,25,0)
};
MATTIE.windows.multiplayer.peerDisplay.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2+100;
    this.y = 0;
};

MATTIE.windows.multiplayer.peerDisplay.prototype.windowWidth = function() {
    return 400;
};

/**
 * A list of connected players
 * @extends Window_Base
 */
MATTIE.windows.multiplayer.playerList = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.windows.multiplayer.playerList.prototype = Object.create(Window_Base.prototype);
MATTIE.windows.multiplayer.playerList.prototype.constructor = MATTIE.windows.multiplayer.playerList;

MATTIE.windows.multiplayer.playerList.prototype.initialize = function() {
    Window_Base.prototype.initialize.call(this, 0,0,400,300);
    this.updatePlacement();
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
MATTIE.windows.multiplayer.playerList.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = 175;
};

MATTIE.windows.multiplayer.playerList.prototype.windowWidth = function() {
    return 400;
};

