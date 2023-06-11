var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
class PlayerModel {
    constructor(name,actorId) {

        /** a username */
        this.name = name;

        /** the actor id this player should use */
        this.actorId = actorId;

        /** the id of the peer this player is hosted on */
        this.peerId = undefined;

        /** @type {MATTIE.multiplayer.Secondary_Player} */
        this.$gamePlayer;
        
        this.map = 0;
    }

    setMap(map){
        this.map = map;
    }
    
    initSecondaryGamePlayer(){
        this.$gamePlayer = new MATTIE.multiplayer.Secondary_Player()
    }

    getCoreData(){
        let obj = {};
        obj.name = this.name;
        obj.actorId = this.actorId;
        obj.peerId = this.peerId;
        return obj;
    }

    setPeerId(peerId){
        this.peerId = peerId;
    }
}


/**
 * @description a class that represents any player that is not the one the user is actively controlling.
 * @extends Game_Player
 */
MATTIE.multiplayer.Secondary_Player =  function () {
    this.initialize.apply(this, arguments);
}

MATTIE.multiplayer.Secondary_Player.prototype = Object.create(Game_Player.prototype);
MATTIE.multiplayer.Secondary_Player.prototype.constructor = MATTIE.multiplayer.Secondary_Player;

MATTIE.multiplayer.Secondary_Player.prototype.initialize = function () {
    this.ctrlDir4 = 0; //start standing still
    Game_Player.prototype.initialize.call(this);
}

/** set the dir4 current control. dir4 is the direction on the arrow keys. */
MATTIE.multiplayer.Secondary_Player.prototype.moveOneTile = function(dir4) {
    this.ctrlDir4 = dir4;
}
MATTIE.multiplayer.Secondary_Player.prototype.performTransfer = function () {
    MATTIE.RPG.performTransfer.call(this);
}

MATTIE.multiplayer.Secondary_Player.prototype.reserveTransfer = function(mapId, x, y, d, fadeType){
    MATTIE.RPG.reserveTransfer.call(this, mapId, x, y, d, fadeType);
}


MATTIE.multiplayer.Secondary_Player.prototype.executeMove = function (direction) {
    MATTIE.multiplayer.gamePlayer.executeMove.call(this, direction);
}
/** 
 * This function is how the movement controller determines if the player should move in a direction when a movement event is triggered.
 * Might need to be expanded in future to accommodate gamepads
 * @returns
 * 0 if not moving
 * 2 if down
 * 8 if up
 * 6 if right
 * 4 if left
 */
MATTIE.multiplayer.Secondary_Player.prototype.getInputDirection = function() {
    let oldDir4 = this.ctrlDir4;
    this.ctrlDir4 = 0;
    return oldDir4;
};