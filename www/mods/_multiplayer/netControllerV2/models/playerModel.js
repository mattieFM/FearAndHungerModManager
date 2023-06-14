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

    setActorId(id){
        this.actorId = id;
        if(this.$gamePlayer){
            this.$gamePlayer.setActor(id);
        }
    }
    
    initSecondaryGamePlayer(){
        this.$gamePlayer = new MATTIE.multiplayer.Secondary_Player()
        this.$gamePlayer.setActor(this.actorId);
        this.$gamePlayer.refresh();
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
    this.actorId = $gameParty._menuActorId;
}


MATTIE.multiplayer.Secondary_Player.prototype = Object.create(Game_Player.prototype);
MATTIE.multiplayer.Secondary_Player.prototype.constructor = MATTIE.multiplayer.Secondary_Player;

MATTIE.multiplayer.Secondary_Player.prototype.initialize = function () {
    this.ctrlDir4 = 0; //start standing still
    Game_Player.prototype.initialize.call(this);

    //TODO: followers
    //this._followers = $gamePlayer.followers();
    //this._followers = $gamePlayer.followers();
}

//override init members to use netfollowers instead of followers
MATTIE.multiplayer.Secondary_Player.prototype.initMembers = function() {
    Game_Player.prototype.initMembers.call(this);
    this._followers = new MATTIE.multiplayer.NetFollowers(this);
};

/** set the dir4 current control. dir4 is the direction on the arrow keys. */
MATTIE.multiplayer.Secondary_Player.prototype.moveOneTile = function(dir4) {
    this.ctrlDir4 = dir4;
}
MATTIE.multiplayer.Secondary_Player.prototype.performTransfer = function () {
    //I dont want to full override this function so instead we can just make the game
    //think that the new player never travels to new maps so that the $gameMap.setup() is never called
    //this is neccacary to stop players from winding up in the fully hell dimension where the game
    //thinks you are on top of every event at once :) 
    this._newMapId = $gameMap.mapId(); 
    MATTIE.RPG.performTransfer.call(this);
}

MATTIE.multiplayer.Secondary_Player.prototype.reserveTransfer = function(mapId, x, y, d, fadeType){
    MATTIE.RPG.reserveTransfer.call(this, mapId, x, y, d, fadeType);
}

MATTIE.multiplayer.Secondary_Player.prototype.setActor = function(id) {
    this.actorId = id;
}

MATTIE.multiplayer.Secondary_Player.prototype.refresh = function() {
    var actor = $gameActors.actor(this.actorId)
    var characterName = actor ? actor.characterName() : '';
    var characterIndex = actor ? actor.characterIndex() : 0;
    this.setImage(characterName, characterIndex);
    this._followers.refresh();
};


MATTIE.multiplayer.Secondary_Player.prototype.center = function(x, y) {
    //stop panning camra with netPlayers
};

MATTIE.multiplayer.Secondary_Player.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
    //stop panning camra with netPlayers
};


MATTIE.multiplayer.Secondary_Player.prototype.executeMove = function (direction) {
    MATTIE.multiplayer.gamePlayer.executeMove.call(this, direction);
}

MATTIE.multiplayer.Secondary_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
    //netplayer started event on the same map as local player
};
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