
var MATTIE = MATTIE || {};
MATTIE.optimisations = MATTIE.optimisations || {};


//rewrite loadallsavefile images to only load up to the max number of saves
DataManager.loadAllSavefileImages = function() {
    var globalInfo = this.loadGlobalInfo();
    if (globalInfo) {
        for (var i = 1; i < DataManager.maxSavefiles(); i++) {
            if (this.isThisGameFile(i)) {
                var info = globalInfo[i];
                this.loadSavefileImages(info);
            }
        }
    }
};

MATTIE.optimisations.loadGlobalInfo = DataManager.loadGlobalInfo;
MATTIE.optimisations.lastGlobalInfo = null;
MATTIE.optimisations.lastGlobalInfoTime = 0;
MATTIE.optimisations.refreshTime = 500; //the number of milli seconds since the last time global info was acsessed to wait till reloading the data.
DataManager.loadGlobalInfo = function(forcedReload = false) {
    let currentTime = new Date().getTime();
    let val;
    if(forcedReload ||  currentTime > MATTIE.optimisations.lastGlobalInfoTime + MATTIE.optimisations.refreshTime){
         val = MATTIE.optimisations.loadGlobalInfo.call(this);
    }else{
        val = MATTIE.optimisations.lastGlobalInfo;
    }
    
    MATTIE.optimisations.lastGlobalInfo = val;
    MATTIE.optimisations.lastGlobalInfoTime = new Date().getTime();
    return val
};

DataManager.saveGame = function(savefileId, noTimeStamp=false) {
    console.log(noTimeStamp);
    try {
        StorageManager.backup(savefileId);
        return this.saveGameWithoutRescue(savefileId, noTimeStamp);
    } catch (e) {
        console.error(e);
        try {
            StorageManager.remove(savefileId);
            StorageManager.restoreBackup(savefileId);
        } catch (e2) {
        }
        return false;
    }
}
//
DataManager.saveGameWithoutRescue = function(savefileId, noTimeStamp=false) {
    console.log(noTimeStamp);
    var json = JsonEx.stringify(this.makeSaveContents());
    if (json.length >= 200000) {
        console.warn('Save data too big!');
    }
    StorageManager.save(savefileId, json);
    this._lastAccessedId = savefileId;
    var globalInfo = this.loadGlobalInfo() || [];
    console.log(noTimeStamp);
    globalInfo[savefileId] = this.makeSavefileInfo(noTimeStamp);
    this.saveGlobalInfo(globalInfo);
    return true;
};
MATTIE.optimisations.makeSavefileInfo = DataManager.makeSavefileInfo;
DataManager.makeSavefileInfo = function(noTimeStamp = false) {
    var info = MATTIE.optimisations.makeSavefileInfo.call(this);
    if(noTimeStamp) info.timestamp = 0;
    return info;
};

Scene_Save.prototype.firstSavefileIndex = function() {
    return DataManager.latestSavefileId();
};


//this function is so insanely heavy with the forEach. replacing it with for should give about a 5% speed up
Game_Map.prototype.updateEvents = function() {
    let events = this.events();
    for (let index = 0; index < events.length; index++) {
        const event = events[index];
        event.update();
        
    }

    for (let index = 0; index < this._commonEvents.length; index++) {
        const event = this._commonEvents[index];
        event.update();
        
    }
};

Game_Map.prototype.refresh = function() {
    let events = this.events();
    for (let index = 0; index < events.length; index++) {
        const event = events[index];
        event.refresh();
        
    }

    for (let index = 0; index < this._commonEvents.length; index++) {
        const event = this._commonEvents[index];
        event.refresh();
        
    }
    this.refreshTileEvents();
    this._needsRefresh = false;
};



//these just replace for each loops with the faster for loops
//=============================================================================
// KODERA_optimization.js
//=============================================================================

/*:
 * @plugindesc 1.0.3 Speed up core RPG Maker engine
 * @author Mariusz 'koder' Chwalba
 */
Sprite.prototype.update = function () {
    var l = this.children.length;
    for (var i = 0; i < l; i++) {
        var child = this.children[i];
        if (child && child.update) {
            child.update();
        }
    };
};
Tilemap.prototype.update = function () {
    this.animationCount++;
    this.animationFrame = Math.floor(this.animationCount / 30);
    var l = this.children.length;
    for (var i = 0; i < l; i++) {
        var child = this.children[i];
        if (child && child.update) {
            child.update();
        }
    }
    for (var i = 0; i < this.bitmaps.length; i++) {
        if (this.bitmaps[i]) {
            this.bitmaps[i].touch();
        }
    }
};
TilingSprite.prototype.update = function () {
    var l = this.children.length;
    for (var i = 0; i < l; i++) {
        var child = this.children[i];
        if (child && child.update) {
            child.update();
        }
    }
};
Window.prototype.update = function () {
    if (this.active) {
        this._animationCount++;
    }
    var l = this.children.length;
    for (var i = 0; i < l; i++) {
        var child = this.children[i];
        if (child && child.update) {
            child.update();
        }
    }
};
WindowLayer.prototype.update = function () {
    var l = this.children.length;
    for (var i = 0; i < l; i++) {
        var child = this.children[i];
        if (child && child.update) {
            child.update();
        }
    }
};
Weather.prototype._updateAllSprites = function () {
    var maxSprites = Math.floor(this.power * 10);
    while (this._sprites.length < maxSprites) {
        this._addSprite();
    }
    while (this._sprites.length > maxSprites) {
        this._removeSprite();
    }
    var l = this._sprites.length;
    for (var i = 0; i < l; i++) {
        var sprite = this._sprites[i];
        this._updateSprite(sprite);
        sprite.x = sprite.ax - this.origin.x;
        sprite.y = sprite.ay - this.origin.y;
    }
};
Scene_Base.prototype.updateChildren = function () {
    var i;
    var l = this.children.length;
    for (i = 0; i < l; i++) {
        var child = this.children[i];
        if (child.update) {
            child.update();
        }
    }
};

Scene_ItemBase.prototype.applyItem = function () {
    var action = new Game_Action(this.user());
    action.setItemObject(this.item());
    var repeats = action.numRepeats();
    var ita = this.itemTargetActors();
    for (var i = 0; i < ita.length; i++) {
        var target = ita[i];
        for (var ix = 0; ix < repeats; ix++) {
            action.apply(target);
        }
    };
    action.applyGlobal();
};
Sprite_Animation.prototype.updateFrame = function () {
    if (this._duration > 0) {
        var frameIndex = this.currentFrameIndex();
        this.updateAllCellSprites(this._animation.frames[frameIndex]);
        for (var i = 0; i < this._animation.timings.length; i++) {
            var timing = this._animation.timings[i];
            if (timing.frame === frameIndex) {
                this.processTimingData(timing);
            }
        };
    }
};
Spriteset_Map.prototype.createCharacters = function () {
    this._characterSprites = [];
    var events = $gameMap.events()
    for (var i = 0; i < events.length; i++) {
        var event = events[i];
        this._characterSprites.push(new Sprite_Character(event));
    }
    var vehicles = $gameMap.vehicles();
    for (var i = 0; i < vehicles.length; i++) {
        var vehicle = vehicles[i];
        this._characterSprites.push(new Sprite_Character(vehicle));
    };
    var followers = $gamePlayer.followers()._data;
    for (var i = followers.length - 1; i >= 0; i--) {
        var follower = followers[i];
        this._characterSprites.push(new Sprite_Character(follower));
    }
    this._characterSprites.push(new Sprite_Character($gamePlayer));
    for (var i = 0; i < this._characterSprites.length; i++) {
        this._tilemap.addChild(this._characterSprites[i]);
    }
};