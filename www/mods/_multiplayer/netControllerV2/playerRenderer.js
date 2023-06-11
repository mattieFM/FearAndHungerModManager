
var MATTIE = MATTIE || {};
MATTIE.RPG = MATTIE.RPG || {}
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.multiplayer.renderer = MATTIE.multiplayer.renderer || {};

MATTIE.RPG.spriteSetMap_CreateChars = Spriteset_Map.prototype.createCharacters;
/** a function that handles overriding the player rendering settings to allow rendering of multiple PCs */
MATTIE.multiplayer.renderer.playerOverrides = function(){
    Spriteset_Map.prototype.createCharacters = function() {
        MATTIE.RPG.spriteSetMap_CreateChars.call(this);
        if(MATTIE.multiplayer.isActive) MATTIE.multiplayer.renderer._createSecondaryChars.call(this);
    };
}

/** render all secondary characters */
MATTIE.multiplayer.renderer._createSecondaryChars = function() {
    this.playersSprites = [];
    let players = [];
    if(MATTIE.multiplayer.isClient){
        players = MATTIE.multiplayer.clientController.netPlayers;
    } else if(MATTIE.multiplayer.isHost){
        players = MATTIE.multiplayer.hostController.netPlayers;
    }
        for(key in players){
            /** @type {PlayerModel} */
            const netPlayer = players[key];
            if($gameMap.mapId() === netPlayer.map){//only render players on same map
                if(!netPlayer.$gamePlayer){
                    netPlayer.initSecondaryGamePlayer();
                }
                let p2 = netPlayer.$gamePlayer;
                p2.setTransparent(false);

                
                p2.name = netPlayer.name;
                let p2Sprite = new Sprite_Character(p2);
                if(MATTIE.multiplayer.isDev) p2Sprite.tint = '003c9c'; //make secondary players obvious for dev mode
                this.playersSprites.push(p2Sprite);
            }
        }
        
        this._characterSprites.concat(this.playersSprites)

        
        for (var i = 0; i < this.playersSprites.length; i++) {
            this._tilemap.addChild(this.playersSprites[i]);
        }




}

MATTIE.multiplayer.renderer.playerOverrides();