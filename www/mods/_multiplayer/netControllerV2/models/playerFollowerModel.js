var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};

MATTIE.multiplayer.NetFollower = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.multiplayer.NetFollower.prototype = Object.create(Game_Follower.prototype);
MATTIE.multiplayer.NetFollower.prototype.constructor = MATTIE.multiplayer.NetFollower;

MATTIE.multiplayer.NetFollower.prototype.initialize = function(memberIndex, netPlayer, actorId = undefined) {
    Game_Follower.prototype.initialize.call(this, memberIndex);
    this.actorId = actorId;
    this.netPlayer = netPlayer;
    this.$netActors = netPlayer.$netActors;
};

MATTIE.multiplayer.NetFollower.prototype.setActor = function(actorId) {
    if(actorId)
    if(!this.netPlayer.$netActors.baseActor(actorId)) this.netPlayer.$netActors.createNewNetActor(actorId);
    console.log("from" + this.actorId);
    console.log("set actor id to " + actorId);
    this.actorId = actorId;
   
    this.refresh();
};

MATTIE.multiplayer.NetFollower.prototype.actor = function() {
    return this.netPlayer.$netActors.baseActor(this.actorId);
};

MATTIE.multiplayer.NetFollower.prototype.refresh = function() {
    var characterName = this.isVisible() ? this.actor().characterName() : '';
    var characterIndex = this.isVisible() ? this.actor().characterIndex() : 0;
    this.setImage(characterName, characterIndex);
};


MATTIE.multiplayer.NetFollower.prototype.isVisible = function() {
    return this.actor() && this.netPlayer.followers().isVisible();
};

MATTIE.multiplayer.NetFollower.prototype.update = function() {
    Game_Character.prototype.update.call(this);
    this.setMoveSpeed(this.realMoveSpeed());
    this.setOpacity(this.netPlayer.opacity());
    this.setBlendMode(this.netPlayer.blendMode());
    this.setWalkAnime(this.netPlayer.hasWalkAnime());
    this.setStepAnime(this.netPlayer.hasStepAnime());
    this.setDirectionFix(this.netPlayer.isDirectionFixed());
    this.setTransparent(this.netPlayer.isTransparent());
};

MATTIE.multiplayer.NetFollower.prototype.chaseCharacter = function(character) {
    if(character){
        var sx = this.deltaXFrom(character.x);
        var sy = this.deltaYFrom(character.y);
        if (sx !== 0 && sy !== 0) {
            this.moveDiagonally(sx > 0 ? 4 : 6, sy > 0 ? 8 : 2);
        } else if (sx !== 0) {
            this.moveStraight(sx > 0 ? 4 : 6);
        } else if (sy !== 0) {
            this.moveStraight(sy > 0 ? 8 : 2);
        }
        this.setMoveSpeed(this.netPlayer.realMoveSpeed());
    }
};








MATTIE.multiplayer.NetFollowers = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.multiplayer.NetFollowers.prototype = Object.create(Game_Followers.prototype);
MATTIE.multiplayer.NetFollowers.prototype.constructor = MATTIE.multiplayer.NetFollowers;

MATTIE.multiplayer.NetFollowers.prototype.initialize = function(netPlayer) {
    this._visible = $dataSystem.optFollowers;
    this._gathering = false;
    this._data = [];
    this.netPlayer = netPlayer;
    this.$netActors = this.netPlayer.$netActors;
    this.setup(netPlayer);
};
/**
 * create a set of new empty followers
 */
MATTIE.multiplayer.NetFollowers.prototype.setup = function(netPlayer) {
    if(!netPlayer) netPlayer = this.netPlayer;
    for (var i = 0; i < $gameParty.maxBattleMembers(); i++) {
        this._data[i]=new MATTIE.multiplayer.NetFollower(i,netPlayer);
    }
};

/**
 * clear the ids of all followers
 */
MATTIE.multiplayer.NetFollowers.prototype.clear = function() {
    for (var i = 1; i < $gameParty.maxBattleMembers(); i++) {
        this._data[i].setActor(null);
    }
};


MATTIE.multiplayer.NetFollowers.prototype.updateMove = function() {
    for (var i = this._data.length - 1; i >= 0; i--) {
        var precedingCharacter = (i > 0 ? this._data[i - 1] : this.netPlayer);
        this._data[i].chaseCharacter(precedingCharacter);
        
    }
};

MATTIE.multiplayer.NetFollowers.prototype.jumpAll = function() {
    if (this.netPlayer.isJumping()) {
        for (var i = 0; i < this._data.length; i++) {
            var follower = this._data[i];
            var sx = this.netPlayer.deltaXFrom(follower.x);
            var sy = this.netPlayer.deltaYFrom(follower.y);
            follower.jump(sx, sy);
        }
    }
};

MATTIE.multiplayer.NetFollowers.prototype.areGathered = function() {
    return this.visibleFollowers().every(function(follower) {
        return !follower.isMoving() && follower.pos(this.netPlayer.x, this.netPlayer.y);
    }, this);
};