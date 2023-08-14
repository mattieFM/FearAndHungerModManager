var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};

MATTIE.scenes.multiplayer.multiCombat = {};
MATTIE.windows.multiplayer.multiCombat = {};
MATTIE.windows.multicombat_SceneBattleOrg = Scene_Battle.prototype.createAllWindows;

Scene_Battle.prototype.createAllWindows = function() {
    MATTIE.windows.multicombat_SceneBattleOrg.call(this);

    this._textWindow = new MATTIE.windows.multiplayer.multiCombat.allyCount(0,0,155,75);
    this.addWindow(this._textWindow);

    this._readyDisplay = new Window_Selectable(0+this._textWindow.width,0,155,75);
    this._readyDisplay.drawText("Ready!",0,0,155,75)
    this._readyDisplay.setHandler('cancel', BattleManager.unready.bind(this));
    this.addWindow(this._readyDisplay);
    this._readyDisplay.hide();

    MATTIE.multiplayer.BattleController.addListener('ready', () =>{
        this._readyDisplay.show();
        this._readyDisplay.activate();
    })

    MATTIE.multiplayer.BattleController.addListener('unready', () =>{
        this._readyDisplay.hide();
        this._readyDisplay.deactivate();
    })
    

    //todo: render other players 
};

MATTIE.windows.multiplayer.multiCombat.allyCount = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.windows.multiplayer.multiCombat.allyCount.prototype = Object.create(MATTIE.windows.textDisplay.prototype);
MATTIE.windows.multiplayer.multiCombat.allyCount.prototype.constructor = MATTIE.windows.multiplayer.multiCombat.allyCount;

MATTIE.windows.multiplayer.multiCombat.allyCount.prototype.initialize = function(x, y, width, height) {
    this._items = [];
    this._index = 0;
    this._header = "";
    MATTIE.windows.textDisplay.prototype.initialize.call(this, x, y, width, height, MATTIE.windows.multiplayer.multiCombat.allyCount.prototype.getText());
    MATTIE.multiplayer.getCurrentNetController().addListener('battleChange', () =>{
        this.updateCount();
    })
};
MATTIE.windows.multiplayer.multiCombat.allyCount.prototype.getText = function(){
    return("Allies: "+ MATTIE.windows.multiplayer.multiCombat.allyCount.prototype.getTotalAllies()).toString();
}

MATTIE.windows.multiplayer.multiCombat.allyCount.prototype.getTotalAllies = function() {
    var x = MATTIE.multiplayer.currentBattleEvent.totalCombatants();
    return ((x?x:0)-1);
}

MATTIE.windows.multiplayer.multiCombat.allyCount.prototype.updateCount = function(){
    this.updateText(MATTIE.windows.multiplayer.multiCombat.allyCount.prototype.getText());
}




//spritesets
function Spriteset_Battle_ActorRow() {
    this.initialize.apply(this, arguments);
}

Spriteset_Battle_ActorRow.prototype = Object.create(Spriteset_Base.prototype);
Spriteset_Battle_ActorRow.prototype.constructor = Spriteset_Battle_ActorRow;

Spriteset_Battle_ActorRow.prototype.initialize = function() {
    Spriteset_Base.prototype.initialize.call(this);
    this.maxActors = 6;
};

Spriteset_Battle_ActorRow.prototype.createLowerLayer = function() {
    Spriteset_Base.prototype.createLowerLayer.call(this);
    this.createBattleField();
    this.createActors($gameActors);
};

Spriteset_Battle_ActorRow.prototype.update = function() {
    Spriteset_Base.prototype.update.call(this);
    this.updateActors($gameActors);
};

Spriteset_Battle_ActorRow.prototype.createBattleField = function() {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    var x = (Graphics.width - width) / 2;
    var y = (Graphics.height - height) / 2;
    this._battleField = new Sprite();
    this._battleField.setFrame(x, y, width, height);
    this._battleField.x = x;
    this._battleField.y = y;
    this._baseSprite.addChild(this._battleField);
};

Spriteset_Battle_ActorRow.prototype.createActors = function(members) {
    this._actorSprites = [];
    for (var i = 0; i < this.maxActors; i++) {
        this._actorSprites[i] = new Sprite_Actor(members[i]);
        this._battleField.addChild(this._actorSprites[i]);
    }
};

/**
 * this function actually creates the actors teh first time and then updates them when it needs to later
 * @param {*} members battle members array
 */
Spriteset_Battle_ActorRow.prototype.updateActors = function(members) {
    for (var i = 0; i < this._actorSprites.length; i++) {
        this._actorSprites[i].setBattler(members[i]);
    }
};

Spriteset_Battle_ActorRow.prototype.validFog = function (id){
    return false;
}