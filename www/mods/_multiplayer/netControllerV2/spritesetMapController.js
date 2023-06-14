//override the create characters function to create a wrapper around the characters so that we can delete/edit/update them
Spriteset_Map.prototype.createCharacters = function() {
    this._charLayer = new Sprite();
    this._characterSprites = [];
    $gameMap.events().forEach(function(event) {
        this._characterSprites.push(new Sprite_Character(event));
    }, this);
    $gameMap.vehicles().forEach(function(vehicle) {
        this._characterSprites.push(new Sprite_Character(vehicle));
    }, this);
    $gamePlayer.followers().reverseEach(function(follower) {
        this._characterSprites.push(new Sprite_Character(follower));
    }, this);
    this._characterSprites.push(new Sprite_Character($gamePlayer));
    for (var i = 0; i < this._characterSprites.length; i++) {
        this._tilemap.addChild(this._characterSprites[i]);
    }
    this.addNetPlayers();
};


Spriteset_Map.prototype.deleteCharacters = function (){
    for (var i = 0; i < this._characterSprites.length; i++) {
        this._tilemap.removeChild(this._characterSprites[i]);
    }
}

Spriteset_Map.prototype.addNetPlayers = function (){
    MATTIE.multiplayer.renderer._renderNetPlayers(this._tilemap);
}

MATTIE.RPG.Scene_MapCreateSpriteSet = Scene_Map.prototype.createSpriteset;

Scene_Map.prototype.updateCharacters = function () {
    if(this._spriteset){
        this._spriteset.deleteCharacters();
        this._spriteset.createCharacters();
        
    } else {
        MATTIE.RPG.Scene_MapCreateSpriteSet.call(this);
    }
}

