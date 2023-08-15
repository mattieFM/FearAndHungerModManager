var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.multiplayer.multiCombat = {};
MATTIE.scenes.multiplayer.multiCombat = {};
MATTIE.windows.multiplayer.multiCombat = {};
MATTIE.windows.multicombat_SceneBattleOrg = Scene_Battle.prototype.createAllWindows;


MATTIE.multiplayer.multiCombat.rowHeight = .1;
MATTIE.multiplayer.multiCombat.maxAlliesPerRow = 6;


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

    MATTIE.multiplayer.getCurrentNetController().addListener('battleChange', () =>{
        this.refreshNetBattlers();
    })

    // this._netBattlers = new Spriteset_Battle_ActorRow();
    // this.addChild(this._netBattlers);
    
    this.refreshNetBattlers();
    

    //todo: render other players 
};

Spriteset_Battle.prototype.removeNetBattler = function(index) {
    console.log("net battlers remove")
    if(!this._netActorSprites) this._netActorSprites = [];
    if(!this._netActors) this._netActors = [];
    var val = this._netActorSprites.splice(index,1)[0];
    this._netActors.splice(index,1);
    console.log(this._battleField.removeChild(val));
}

Spriteset_Battle.prototype.addNetBattler = function(actor) {
    if(!this._netActorSprites) this._netActorSprites = [];
    if(!this._netActors) this._netActors = [];
    this._netActorSprites.push(new Sprite_Actor(actor));
    this._netActors.push(actor);
    
    this._battleField.addChild(this._netActorSprites[this._netActorSprites.length-1]);
}

Scene_Battle.prototype.refreshNetBattlers = function(){
    let playersIds = MATTIE.multiplayer.currentBattleEvent.getIdsInCombatWith();
    let netCont = MATTIE.multiplayer.getCurrentNetController();
    if(!this._spriteset._netActorSprites) this._spriteset._netActorSprites = [];
    if(!this._spriteset._netActors) this._spriteset._netActors = [];
    for (let index = 0; index < this._spriteset._netActorSprites.length; index++) {
        this._spriteset.removeNetBattler(index);
    }
    playersIds.forEach(id => {
        if(id !== netCont.peerId){
            netCont.netPlayers[id].$gamePlayer.getBattleMembers().forEach(actor =>{
                this._spriteset.addNetBattler(actor);
            });
        }
    });
    this._spriteset.updateNetBattlers();
}

Spriteset_Battle.prototype.updateNetBattlers = function(){
    if(!this._netActorSprites) this._netActorSprites = [];
    if(!this._netActors) this._netActors = [];
    var members = this._netActors;
    for (var i = 0; i < this._netActorSprites.length; i++) {
        this.setBattlerPos(this._netActorSprites[i], members[i], i+1);
    }
}

MATTIE.multiplayer.spiresetBattleUpdate = Spriteset_Battle.prototype.update;
Spriteset_Battle.prototype.update = function(){
    MATTIE.multiplayer.spiresetBattleUpdate.call(this);
    //this.updateNetBattlers();
}


Spriteset_Battle.prototype.setBattlerPos = function (sprite, battler, index) {
    sprite.setBattler(battler);
    var changed = (battler !== this._actor);
    if (changed) {
        sprite._actor = battler;
        if (battler) {
            let colNum = index % MATTIE.multiplayer.multiCombat.maxAlliesPerRow;
            let rowNum = Math.floor(index/MATTIE.multiplayer.multiCombat.maxAlliesPerRow)
            
            let xOffset = (Graphics.width / MATTIE.multiplayer.multiCombat.maxAlliesPerRow) * colNum;
            let yOffset = ((MATTIE.multiplayer.multiCombat.rowHeight*Graphics.boxHeight / MATTIE.multiplayer.multiCombat.maxAlliesPerRow) * colNum) + (rowNum * MATTIE.multiplayer.multiCombat.rowHeight*Graphics.boxHeight)
            sprite.setHome(0+xOffset, Graphics.boxHeight/2+100+yOffset);
        }
        sprite.startEntryMotion();
        sprite._stateSprite.setup(battler);
    }
}

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

Spriteset_Battle_ActorRow.prototype.createBaseSprite = function() {
    this._baseSprite = new Sprite();
    this._baseSprite.setFrame(0, 0, this.width, this.height);
    this._blackScreen = new ScreenSprite();
    this._blackScreen.opacity = 0;
    this.addChild(this._baseSprite);
    this._baseSprite.addChild(this._blackScreen);
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
    this._battleField.setColorTone([255,0,0,1])
    this._battleField.x = x;
    this._battleField.y = y;
    this._baseSprite.addChild(this._battleField);
};

Spriteset_Battle_ActorRow.prototype.createActors = function() {
    this._actorSprites = [];
    for (var i = 0; i < 6; i++) {
        this._actorSprites[i] = new Sprite_Actor();
        this._battleField.addChild(this._actorSprites[i]);
    }
};

Spriteset_Battle_ActorRow.prototype.updateActors = function() {
    
    var members = $gameActors._data;
    for (var i = 0; i < this._actorSprites.length; i++) {
        this.setBattlerPos(this._actorSprites[i], members[i], i);
    }
};


Spriteset_Battle_ActorRow.prototype.setBattlerPos = function (sprite, battler, index) {
    sprite.setBattler(battler);
    var changed = (battler !== this._actor);
    if (changed) {
        sprite._actor = battler;
        if (battler) {
            sprite.setHome(300 + index * 16, 280 + index * 48);
        }
        sprite.startEntryMotion();
        sprite._stateSprite.setup(battler);
    }
}


Spriteset_Battle_ActorRow.prototype.validFog = function (id){
    return false;
}