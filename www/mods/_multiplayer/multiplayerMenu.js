var MATTIE = MATTIE || {};
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.TextManager.host = "Host A Game"
MATTIE.TextManager.join = "Join A Game"
MATTIE.TextManager.return = "Return"
MATTIE.CmdManager.host = "MATTIE_host"
MATTIE.CmdManager.join = "MATTIE_join"
MATTIE.CmdManager.return = "MATTIE_return"



MATTIE.scenes.multiplayer.base = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.scenes.multiplayer.base.prototype = Object.create(Scene_Base.prototype);
MATTIE.scenes.multiplayer.base.prototype.constructor = MATTIE.scenes.multiplayer.base;

MATTIE.scenes.multiplayer.base.prototype.create = function (){
    Scene_Base.prototype.create.call(this);
    this.createBackground();
}

MATTIE.scenes.multiplayer.base.prototype.createBackground = function() {
    this._backSprite2 = new Sprite(ImageManager.loadBitmap("mods/_multiplayer/","multiPlayerMenu",0,true));
    this.addChild(this._backSprite2);
    
};



/**
 * main scene
 */

MATTIE.scenes.multiplayer.main = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.scenes.multiplayer.main.prototype = Object.create(Scene_Title.prototype);
MATTIE.scenes.multiplayer.main.prototype.constructor = MATTIE.scenes.multiplayer.main;

MATTIE.scenes.multiplayer.main.prototype.create = function() {
    Scene_Title.prototype.create.call(this);
    this.addTextField()
}

MATTIE.scenes.multiplayer.main.prototype.createCommandWindow = function() {
    this._commandWindow = new MATTIE.windows.multiplayer.main();
    
    this._commandWindow.setHandler(MATTIE.CmdManager.host, (() => {
        MATTIE.multiplayer.netController.name = this._inputWin.getInput();
        MATTIE.menus.multiplayer.openHost();
    }).bind(this));

    this._commandWindow.setHandler(MATTIE.CmdManager.join,    (()=>{
        MATTIE.multiplayer.netController.name = this._inputWin.getInput();
        MATTIE.menus.multiplayer.openJoin();
    }).bind(this));

    this._commandWindow.setHandler(MATTIE.CmdManager.return,  (()=>{
        MATTIE.multiplayer.netController.name = this._inputWin.getInput();
        MATTIE.menus.toMainMenu();
    }).bind(this));
    this.addWindow(this._commandWindow);
};

MATTIE.scenes.multiplayer.main.prototype.addTextField = function (){
    this._inputWin = new MATTIE.windows.textInput(0,0,250,150,"Type Username:");
    this._inputWin.updateText(MATTIE.multiplayer.netController.name);
    this.addWindow(this._inputWin);
}

MATTIE.scenes.multiplayer.main.prototype.createBackground = function() {
    this._backSprite1 = new Sprite(ImageManager.loadTitle1($dataSystem.title1Name));
    this._backSprite2 = new Sprite(ImageManager.loadBitmap("mods/_multiplayer/","multiPlayerMenu",0,true));
    this.addChild(this._backSprite1);
    this.addChild(this._backSprite2);
};



/**
 * main window
 */
MATTIE.windows.multiplayer.main = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.windows.multiplayer.main.prototype = Object.create(Window_TitleCommand.prototype);
MATTIE.windows.multiplayer.main.prototype.constructor = MATTIE.windows.multiplayer.main;

MATTIE.windows.multiplayer.main.prototype.makeCommandList = function() {
    this.addCommand(MATTIE.TextManager.host,   MATTIE.CmdManager.host);
    this.addCommand(MATTIE.TextManager.join, MATTIE.CmdManager.join);
    this.addCommand(MATTIE.TextManager.return,   MATTIE.CmdManager.return);
};
