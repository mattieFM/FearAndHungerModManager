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

        this.$netActors = new MATTIE.multiplayer.NetActors();
       
        /** battle members that only appear in battle */
        this.battleOnlyMembers =[]
        
        /** the actor ids of any and all followers, -1 if not present */
        this.followerIds = [];

        this.map = 0;

    }

    select(activeMember){
        this.members().forEach(function(member) {
            if (member === activeMember) {
                member.select();
            } else {
                member.deselect();
            }
        });
    }

    members(){
        return this.battleMembers();
    }

    displayMembers(){
        let arr = [];
        arr.push(this.$gamePlayer.actor());
        this.followerIds.forEach(followerId=>{
            let actor = this.$netActors.baseActor(followerId);
            arr.push(actor);
        })
        return arr;
    }

    addBattleOnlyMember(actor){
        this.battleOnlyMembers.push(actor);
    }

    removeBattleOnlyMember(id){
        this.battleOnlyMembers.splice(id,1);
    }

    clearBattleOnlyMembers(){
        this.battleOnlyMembers = [];
    }

    battleMembers(){
        let arr = this.displayMembers();
        if(MATTIE.multiplayer.inBattle){
            arr = arr.concat(this.battleOnlyMembers)
        }
        // while(arr.length < $gameParty.maxBattleMembers()){
        //     arr.push(new Game_Actor());
        // }
        return arr;
    }


    /**
     * set the followers on the playermodel and the $gamePlayer
     * @param {int array} ids the actor ids of any and all followers, -1 if not present
     */
    getFollowers(){
        this.followerIds = [];
        for (let index = 1; index < $gameParty.maxBattleMembers(); index++) {
            if($gameParty.battleMembers()[index]){
            let actorId = $gameParty.battleMembers()[index].actorId();
            if(actorId){
                if(actorId != this.actorId && actorId !=  $gameParty.leader().actorId()){
                this.followerIds[index-1] = actorId;
                } else {
                    this.followerIds[index-1] = -1;
                }
            } else {
                this.followerIds[index-1] = -1;
            }
        }
        }
        return this.followerIds;
    }

    followers(){
        let displayMembers = this.displayMembers();
        let followers = [];
        for (let index = 0; index < displayMembers.length; index++) {
            const actor = displayMembers[index];
            if(actor.actorId() != this.actorId){
                followers.push(actor);
            }
        }
        return followers;
    }

    setFollowers(ids){
        console.log("set followers")
        if(this.$gamePlayer){
            let netFollowers =  this.$gamePlayer._followers._data;
            for (let index = 0; index < ids.length; index++) {
                this.followerIds[index] = ids[index];
                const follower = netFollowers[index];
                if(follower){
                    if(this.followerIds[index] >= 0){
                        follower.setActor(this.followerIds[index])
                    };
                }
                
            }
            if(ids.length === 0){
                this.$gamePlayer._followers.setup(null);
            }
        }
      
    }

    setMap(map){
        this.map = map;
    }

    setActorId(id){
        this.actorId = id;
        if(this.$gamePlayer && typeof this.$gamePlayer === typeof MATTIE.multiplayer.Secondary_Player){
            this.$gamePlayer.setActor(id);
            this.$gamePlayer.refresh();
        }
        
    }
    
    initSecondaryGamePlayer(){
        this.$gamePlayer = new MATTIE.multiplayer.Secondary_Player(this.$netActors);
        this.$gamePlayer.setActor(this.actorId);
        this.getFollowers();
        this.$gamePlayer.refresh();
    }

    updateSelfCoreData(){
        this.setActorId($gameParty.leader().actorId());
        this.getFollowers();
    }

    getCoreData(){
        if(MATTIE.multiplayer.getCurrentNetController())
        if(MATTIE.multiplayer.getCurrentNetController().peerId === this.peerId){
            this.updateSelfCoreData();
        }
        let obj = {};
        obj.name = this.name;
        obj.actorId = this.actorId;
        obj.peerId = this.peerId;
        obj.followerIds = this.followerIds;
        return obj;
    }

    setPeerId(peerId){
        this.peerId = peerId;
        this.$netActors.setPeerId(peerId);
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

MATTIE.multiplayer.Secondary_Player.prototype.initialize = function (netActors) {
    this.ctrlDir4 = 0; //start standing still
    Game_Player.prototype.initialize.call(this);
    this.$netActors = netActors;


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
    MATTIE.multiplayer.updateEnemyHost();
}

MATTIE.multiplayer.Secondary_Player.prototype.locate = function(x, y) {
    Game_Character.prototype.locate.call(this, x, y);
    this.center(x, y);
    this.makeEncounterCount();
    if (this.isInVehicle()) {
        this.vehicle().refresh();
    }
    let leaderX =this.x;
    let leaderY = this.y;
    this._followers.synchronize(x, y, this.direction(),leaderX,leaderY);
};

/**
 * 
 * @param {*} x target x
 * @param {*} y target y
 * @param {*} d target dir
 * @param {*} leaderX leader x
 * @param {*} leaderY leader y
 */
Game_Followers.prototype.synchronize = function(x, y, d,leaderX=null,leaderY=null) {
    if(!leaderX) leaderX = $gamePlayer.x;
    if(!leaderY) leaderY = $gamePlayer.y;
    this.forEach(function(follower) {
        let dist = Math.sqrt((follower.x - leaderX)**2 + (follower.y -leaderY)**2);
        if(dist > $gameParty.maxBattleMembers()+1){ //only sync if follower too far away
            follower.locate(x, y);
            follower.setDirection(d);
        }
        // else if (dist > 0) {
        //     let deltaY = y-leaderY;
        //     let deltaX = x-leaderX;
        //     console.log("deltaY" + deltaY + "deltax" + deltaX)
        //     follower.setPosition(follower.x+deltaX,follower.y+deltaY);
        // }

    }, this);
};

MATTIE.multiplayer.Secondary_Player.prototype.reserveTransfer = function(mapId, x, y, d, fadeType){
    MATTIE.RPG.reserveTransfer.call(this, mapId, x, y, d, fadeType);
}

MATTIE.multiplayer.Secondary_Player.prototype.setActor = function(id) {
    if(!this.$netActors.baseActor(id)) this.$netActors.createNewNetActor(id);
    this.actorId = id;
}

MATTIE.multiplayer.Secondary_Player.prototype.actor = function(){
    return this.$netActors.baseActor(this.actorId);
}

MATTIE.multiplayer.Secondary_Player.prototype.refresh = function() {
    var actor = this.$netActors.baseActor(this.actorId);
    var characterName = actor ? actor.characterName() : '';
    var characterIndex = actor ? actor.characterIndex() : 0;
    this.setImage(characterName, characterIndex);
    this._followers.refresh();
};


MATTIE.multiplayer.Secondary_Player.prototype.getBattleMembers = function(){
    let arr = [];
    arr.push(this.$netActors.baseActor(this.actorId));
    
    this._followers.forEach(follower =>{
        let actor = follower.actor();
        if(actor) arr.push(actor);
    });
    return arr;
}

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