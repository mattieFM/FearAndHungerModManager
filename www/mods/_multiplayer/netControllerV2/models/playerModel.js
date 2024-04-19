var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
/**
 * @class the class that represents all non local players
 */
class PlayerModel {
	constructor(name, actorId) {
		/** a username */
		this.name = name;

		/** @description whether this player can be interacted with or not. */
		this.canBeInteractedWith = true;

		/** the actor id this player should use */
		this.actorId = actorId;

		/** the id of the peer this player is hosted on */
		this.peerId = undefined;

		/** @type {MATTIE.multiplayer.Secondary_Player} */
		this.$gamePlayer = undefined;

		this.$netActors = new MATTIE.multiplayer.NetActors();

		/** battle members that only appear in battle */
		this.battleOnlyMembers = [];

		/** the actor ids of any and all followers, -1 if not present */
		this.followerIds = [];

		this.map = 0;

		this.isSpectating = false;

		this.conversationModel = new MATTIE.multiplayer.Conversations();

		/** @description an array of all player's ids who currently in combat with this player */
		this.pvpCombatArr = [];

		/** @description whether this play is part of a marriage */
		this.isMarried = false;

		/** @description an array of all peerId's this player is married to */
		this.marriedTo = [];

		/** @description whether marriage has been initalized or not */
		this.marriageSetup = false;

		/** @description whether this player is the host of a marriage */
		this.isMarriageHost = false;

		/** @description the peerid of the host of this marriage */
		this.marriageHost = null;

		/** @description the troopod this peer is currently incombat with */
		this.troopInCombatWith = null;
	}

	setCanInteract(bool) {
		this.canBeInteractedWith = bool;
	}

	/** @description add an id to the pvp arr if it does not already exist */
	addIdToPvp(id) {
		if (this.pvpCombatArr.indexOf(id) == -1) this.pvpCombatArr.push(id);
	}

	/** @description remove an id from the pvp arr if it exists */
	removeIdFromPvp(id) {
		const index = this.pvpCombatArr.indexOf(id);
		if (index > 0) this.pvpCombatArr.slice(index);
	}

	/** @description remove all values from the pvp arr */
	clearPvpArr() {
		this.pvpCombatArr = [];
	}

	/**
     * @description check if this player is on the map
     * @returns {bool} if this player is on the map
     */
	isOnMap() {
		return this.map === $gameMap.mapId() || this.$gamePlayer.isOnMap();
	}

	onInteract() {
		// called when this player is interacted with by pressing okay.
		if (this.canBeInteractedWith && MATTIE.multiplayer.config.canInteract) {
			this.conversationModel.talk($gameParty.leader().actorId(), this);
		}
	}

	resurrect() {
		this.setSpectate(false);
	}

	canResurrect() {
		return this.isSpectating;
	}

	setSpectate(bool, doNotEmit = false) {
		const netCont = MATTIE.multiplayer.getCurrentNetController();
		if (!doNotEmit) netCont.emitSpectateEvent(bool, this.peerId);
		if (this.peerId === netCont.peerId) { // self change spectate event
			MATTIE.multiplayer.isSpectator = bool;
			if (!bool) {
				SceneManager.goto(Scene_Map);
				if (MATTIE.actorAPI.lastLeader != MATTIE.static.actors.ghost._data.id) {
					MATTIE.actorAPI.changePartyLeader(MATTIE.actorAPI.lastLeader);
				} else {
					MATTIE.actorAPI.changePartyLeader(MATTIE.static.actors.mercenaryId);
				}
			} else { //
				$gameParty.leader().setHp(50);
				SceneManager.goto(MATTIE.scenes.multiplayer.Scene_Spectate);

				MATTIE.actorAPI.changePartyLeader(MATTIE.static.actors.ghost._data.id);

				const members = $gameParty.members();
				for (let index = 1; index < members.length; index++) {
					const element = members[index];
					$gameParty.removeActor(element.actorId());
				}
			}
		}
		this.isSpectating = bool;
	}

	select(activeMember) {
		this.members().forEach((member) => {
			if (member === activeMember) {
				member.select();
			} else {
				member.deselect();
			}
		});
	}

	members() {
		return this.battleMembers();
	}

	displayMembers() {
		const arr = [];
		arr.push(this.$gamePlayer.actor());
		this.followerIds.forEach((followerId) => {
			const actor = this.$netActors.baseActor(followerId);
			arr.push(actor);
		});
		return arr;
	}

	/** @description get the ids of the actors in this party */
	memberIds() {
		const arr = [];
		arr.push(this.actorId);
		this.followerIds.forEach((followerId) => {
			arr.push(followerId);
		});
		return arr;
	}

	addBattleOnlyMember(actor) {
		this.battleOnlyMembers.push(actor);
	}

	removeBattleOnlyMember(id) {
		this.battleOnlyMembers.splice(id, 1);
	}

	clearBattleOnlyMembers() {
		this.battleOnlyMembers = [];
	}

	battleMembers() {
		let arr = this.displayMembers();
		if (MATTIE.multiplayer.inBattle) {
			arr = arr.concat(this.battleOnlyMembers);
		}
		// while(arr.length < $gameParty.maxBattleMembers()){
		//     arr.push(new Game_Actor());
		// }
		return arr;
	}

	/**
     * set the followers on the playermodel and the $gamePlayer
     * @param {int[]} ids the actor ids of any and all followers, -1 if not present
     */
	getFollowers() {
		this.followerIds = [];
		for (let index = 1; index < $gameParty.maxBattleMembers(); index++) {
			if ($gameParty.battleMembers()[index]) {
				const actorId = $gameParty.battleMembers()[index].actorId();
				if (actorId) {
					if (actorId != this.actorId && actorId != $gameParty.leader().actorId()) {
						this.followerIds[index - 1] = actorId;
					} else {
						this.followerIds[index - 1] = -1;
					}
				} else {
					this.followerIds[index - 1] = -1;
				}
			}
		}
		return this.followerIds;
	}

	followers() {
		const displayMembers = this.displayMembers();
		const followers = [];
		for (let index = 0; index < displayMembers.length; index++) {
			/** @type {Game_Actor} */
			const actor = displayMembers[index];
			if (actor.actorId() != this.actorId) {
				followers.push(actor);
			}
		}
		return followers;
	}

	setFollowers(ids) {
		console.log('set followers');
		if (this.$gamePlayer) {
			const netFollowers = this.$gamePlayer._followers._data;
			for (let index = 0; index < ids.length; index++) {
				this.followerIds[index] = ids[index];
				const follower = netFollowers[index];
				if (follower) {
					if (this.followerIds[index] >= 0) {
						follower.setActor(this.followerIds[index]);
					}
				}
			}
			if (ids.length === 0) {
				this.$gamePlayer._followers.setup(null);
			}
		}
	}

	setMap(map) {
		this.map = map;
	}

	setActorId(id) {
		this.actorId = id;
		if (this.$gamePlayer && typeof this.$gamePlayer === typeof MATTIE.multiplayer.Secondary_Player) {
			this.$gamePlayer.setActor(id);
			this.$gamePlayer.refresh();
		}
	}

	initSecondaryGamePlayer() {
		this.$gamePlayer = new MATTIE.multiplayer.Secondary_Player(this.$netActors);
		this.$gamePlayer.setActor(this.actorId);
		this.getFollowers();
		this.$gamePlayer.refresh();
	}

	updateSelfCoreData() {
		this.setActorId($gameParty.leader().actorId());
		this.getFollowers();
	}

	getCoreData() {
		if (MATTIE.multiplayer.getCurrentNetController()) {
			if (MATTIE.multiplayer.getCurrentNetController().peerId === this.peerId) {
				this.updateSelfCoreData();
			}
		}
		const obj = {};
		obj.name = this.name;
		obj.actorId = this.actorId;
		obj.peerId = this.peerId;
		obj.followerIds = this.followerIds;
		obj.isMarriageHost = this.isMarriageHost;
		obj.marriageHost = this.marriageHost;
		obj.isMarried = this.isMarried;
		obj.marriedTo = this.marriedTo;
		return obj;
	}

	setPeerId(peerId) {
		this.peerId = peerId;
		this.$netActors.setPeerId(peerId);
	}
}

/** set the dir4 current control. dir4 is the direction on the arrow keys. */
Game_Player.prototype.moveOneTile = function (dir4) {
	this.ctrlDir4 = dir4;
};

/**
 * @description a class that represents any player that is not the one the user is actively controlling.
 * @extends Game_Player
 * @class
 */
MATTIE.multiplayer.Secondary_Player = function () {
	this.initialize.apply(this, arguments);
	this.actorId = $gameParty._menuActorId;
};

MATTIE.multiplayer.Secondary_Player.prototype = Object.create(Game_Player.prototype);
MATTIE.multiplayer.Secondary_Player.prototype.constructor = MATTIE.multiplayer.Secondary_Player;

MATTIE.multiplayer.Secondary_Player.prototype.initialize = function (netActors) {
	this.ctrlDir4 = 0; // start standing still
	this.$netActors = netActors;
	Game_Player.prototype.initialize.call(this);
	MATTIE.fxAPI.addLightObject(() => this, () => this.torchIsLit());
};

/**
 * @description check if this player currently has a torch out
 * @returns {boolean}
 */
MATTIE.multiplayer.Secondary_Player.prototype.torchIsLit = function () {
	return this._torch || false;
};

/**
 * @description set whether this player currently has a torch out
 * @param {bool} bool whether the player has a torch active or not
 * @returns void
 */
MATTIE.multiplayer.Secondary_Player.prototype.setTorch = function (bool) {
	this._torch = bool;
};
// override init members to use netfollowers instead of followers
MATTIE.multiplayer.Secondary_Player.prototype.initMembers = function () {
	Game_Player.prototype.initMembers.call(this);
	this._followers = new MATTIE.multiplayer.NetFollowers(this);
};

MATTIE.multiplayer.Secondary_Player.prototype.performTransfer = function () {
	// I dont want to full override this function so instead we can just make the game
	// think that the new player never travels to new maps so that the $gameMap.setup() is never called
	// this is neccacary to stop players from winding up in the fully hell dimension where the game
	// thinks you are on top of every event at once :)
	this._newMapId = $gameMap.mapId();
	MATTIE.RPG.performTransfer.call(this);
	MATTIE.multiplayer.updateEnemyHost();
};

MATTIE.multiplayer.Secondary_Player.prototype.locate = function (x, y) {
	Game_Character.prototype.locate.call(this, x, y);
	this.center(x, y);
	this.makeEncounterCount();
	if (this.isInVehicle()) {
		this.vehicle().refresh();
	}
	const leaderX = this.x;
	const leaderY = this.y;
	this._followers.synchronize(x, y, this.direction(), leaderX, leaderY);
};

/**
 *
 * @param {*} x target x
 * @param {*} y target y
 * @param {*} d target dir
 * @param {*} leaderX leader x
 * @param {*} leaderY leader y
 */
Game_Followers.prototype.synchronize = function (x, y, d, leaderX = null, leaderY = null) {
	if (!leaderX) leaderX = $gamePlayer.x;
	if (!leaderY) leaderY = $gamePlayer.y;
	this.forEach((follower) => {
		const dist = Math.sqrt((follower.x - leaderX) ** 2 + (follower.y - leaderY) ** 2);
		if (dist > $gameParty.maxBattleMembers() + 1) { // only sync if follower too far away
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

MATTIE.multiplayer.Secondary_Player.prototype.reserveTransfer = function (mapId, x, y, d, fadeType) {
	MATTIE.RPG.reserveTransfer.call(this, mapId, x, y, d, fadeType);
};

MATTIE.multiplayer.Secondary_Player.prototype.setActor = function (id) {
	if (!this.$netActors.baseActor(id)) this.$netActors.createNewNetActor(id);
	this.actorId = id;
};

MATTIE.multiplayer.Secondary_Player.prototype.actor = function () {
	return this.$netActors.baseActor(this.actorId);
};

MATTIE.multiplayer.Secondary_Player.prototype.refresh = function () {
	var actor = this.$netActors.baseActor(this.actorId);
	var characterName = actor ? actor.characterName() : '';
	var characterIndex = actor ? actor.characterIndex() : 0;
	this.setImage(characterName, characterIndex);
	this._followers.refresh();
};

MATTIE.multiplayer.Secondary_Player.prototype.getBattleMembers = function () {
	const arr = [];
	arr.push(this.$netActors.baseActor(this.actorId));

	this._followers.forEach((follower) => {
		const actor = follower.actor();
		if (actor) arr.push(actor);
	});
	return arr;
};

MATTIE.multiplayer.Secondary_Player.prototype.center = function (x, y) {
	// stop panning camra with netPlayers
};

MATTIE.multiplayer.Secondary_Player.prototype.updateScroll = function (lastScrolledX, lastScrolledY) {
	// stop panning camra with netPlayers
};

MATTIE.multiplayer.Secondary_Player.prototype.executeMove = function (direction) {
	MATTIE.multiplayer.gamePlayer.executeMove.call(this, direction);
};

MATTIE.multiplayer.Secondary_Player.prototype.startMapEvent = function (x, y, triggers, normal) {
	// netplayer started event on the same map as local player
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
MATTIE.multiplayer.Secondary_Player.prototype.getInputDirection = function () {
	const oldDir4 = this.ctrlDir4;
	this.ctrlDir4 = 0;
	return oldDir4;
};

//-----------------------------------------
// Game_Player
//----------------------------------------
MATTIE.multiplayer.PlayerModelPerformTransfer = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function () {
	this.setMapId(this._newMapId);
	MATTIE.multiplayer.PlayerModelPerformTransfer.call(this);
};

Game_Player.prototype.setMapId = function (id) {
	this._mapId = id;
};

Game_Player.prototype.getMapId = function () {
	return this._mapId;
};
/**
 * @description check if this player is on the map
 * @returns {bool} if this player is on the map
 */
Game_Player.prototype.isOnMap = function () {
	return this.getMapId() === $gameMap.mapId();
};

//----------------------------------------
// Game Actor Overrides
//----------------------------------------
MATTIE.multiplayer.Game_ActorsActor = Game_Actors.prototype.actor;
Game_Actors.prototype.actor = function (actorId) {
	if (this._data[actorId]) {
		if (!this._data[actorId].peerId) {
			this._data[actorId].peerId = MATTIE.multiplayer.getCurrentNetController()
				? MATTIE.multiplayer.getCurrentNetController().peerId
				: false;
		}
	}
	return MATTIE.multiplayer.Game_ActorsActor.call(this, actorId);
};
