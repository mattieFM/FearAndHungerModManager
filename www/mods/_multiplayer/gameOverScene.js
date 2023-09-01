
var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.TextManager.returnToTitle = "Stop Thinking"
MATTIE.CmdManager.returnToTitle = "MATTIE_ReturnToTitle"
MATTIE.TextManager.spectate = "Wander as a lost soul"
MATTIE.CmdManager.spectate = "MATTIE_ReturnToTitle"

MATTIE.scenes.multiplayer.Scene_GameOver = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.scenes.multiplayer.Scene_GameOver .prototype = Object.create(Scene_Base.prototype);
MATTIE.scenes.multiplayer.Scene_GameOver .prototype.constructor = MATTIE.scenes.multiplayer.Scene_GameOver ;

MATTIE.scenes.multiplayer.Scene_GameOver .prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

MATTIE.scenes.multiplayer.Scene_GameOver .prototype.create = function() {
    
    Scene_Base.prototype.create.call(this);
    this.playGameoverMusic();
    
    this.createBackground();
    this.createWindowLayer();

    let btns = {};
    btns[MATTIE.TextManager.returnToTitle] = MATTIE.CmdManager.returnToTitle;
    btns[MATTIE.TextManager.spectate] = MATTIE.CmdManager.spectate;

    let text = "You have died, the dungeons of fear and hunger have \nclaimed one more soul. \n\nAnd yet...\n\nWithout a body, you remain.\nSome aspect of your mind, preserved.\nEven in death the forces at work in these dungeons can \nstill reach you."
    this._textWin = new MATTIE.windows.textDisplay(0,0,700,300,"")


    this.addWindow(this._textWin);
    this._textWin.updatePlacement()
    this._optionsWindow = new MATTIE.windows.horizontalBtns(175+300+10, btns, 2);
    this.addWindow(this._optionsWindow);
    this._optionsWindow.updateWidth(600);
    this._optionsWindow.updatePlacement(175+300+10);

    this._optionsWindow.setHandler(MATTIE.CmdManager.returnToTitle, (()=>{
        this.animateText("You quiet your mind, and over time cease to be.\nBut whether your soul ever escaped these dungeons... ");
        SceneManager.goto(Scene_Title);
    }).bind(this))
    this._optionsWindow.setHandler(MATTIE.CmdManager.spectate, (()=>{
        this.animateText("You give your soul to the god of fear and hunger, may \nyou live again.");
        SceneManager.goto(MATTIE.scenes.multiplayer.Scene_Spectate);
        MATTIE.multiplayer.isSpectator = true;
    }).bind(this))




    this.animateText(text);
};

MATTIE.scenes.multiplayer.Scene_GameOver.prototype.animateText = function(text){
    let timeout = 0;
    if(this.timeouts){
        this.timeouts.forEach(element => {
            clearTimeout(element);
        });
        this.timeouts = [];
    } else {
        this.timeouts = [];
    }
    for (let index = 0; index < text.length; index++) {
        const element = text.slice(0,index+1);
        timeout+=element.endsWith('\n')? 250 : element.endsWith(".")? 550 : element.endsWith(",")? 450 : 75;
        this.timeouts.push(setTimeout(() => {
            this._textWin.updateText(element)
        }, timeout));
        
    }
}

MATTIE.scenes.multiplayer.Scene_GameOver.prototype.createBackground = function(){
    Scene_Gameover.prototype.createBackground.call(this);
}

MATTIE.scenes.multiplayer.Scene_GameOver.prototype.playGameoverMusic = function(){
    Scene_Gameover.prototype.playGameoverMusic.call(this);
}