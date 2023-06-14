
var MATTIE = MATTIE || {};
MATTIE.RPG = MATTIE.RPG || {}
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.multiplayer.renderer = MATTIE.multiplayer.renderer || {};


/** render all net players */
MATTIE.multiplayer.renderer._renderNetPlayers = function(target) {
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
                if(MATTIE.multiplayer.devTools.shouldTint) p2Sprite.tint = MATTIE.multiplayer.devTools.getTint();
                this.playersSprites.push(p2Sprite);
                netPlayer.$gamePlayer.followers().forEach(follower => {
                    let followerSprite = new Sprite_Character(follower);
                    follower.setTransparent(false);
                    this.playersSprites.push(followerSprite);
                });
            }
        }
        for (var i = 0; i < this.playersSprites.length; i++) {
            target.addChild(this.playersSprites[i]);
        }




}