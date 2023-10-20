var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.multiplayer.maxGrabAttempts = 3; // max number of times to try to over take player each cycle

Game_Event.prototype.isCollidedWithPlayerCharacters = function (x, y) {
	var nearestPlayer = MATTIE.multiplayer.getNearestPlayer(this.x, this.y);
	return this.isNormalPriority() && nearestPlayer.isCollided(x, y);
};

/**
 * @description return the nearest player to a point
 * @param {*} x the x cord
 * @param {*} y the y cord
 * @returns {Game_Player} the nearest player to the point
 */
MATTIE.multiplayer.getNearestPlayer = function (x, y) {
	const netController = MATTIE.multiplayer.getCurrentNetController();
	var players = Object.values(netController.netPlayers).concat([netController.player]);
	let nearest = 0;
	let nearTotal = Infinity;
	for (key in players) {
		if (key) {
			/** @type {PlayerModel} */
			const player = players[key];
			if (player.$gamePlayer) {
				const _playerNearX = Math.abs(player.$gamePlayer._x - x);
				const _playerNearY = Math.abs(player.$gamePlayer._y - y);
				const _playerNearTotal = _playerNearX + _playerNearY;
				if (_playerNearTotal < nearTotal) {
					nearest = key;
					nearTotal = _playerNearTotal;
				}
			} else {
				nearest = 0;
			}
		}
	}
	return players[nearest].$gamePlayer;
};

// override yanfly's chase event to find the nearest player rather than just using game player

Game_Event.prototype.updateChaseMovement = function () {
	if (this._staggerCount > 0) {
		return this._staggerCount--;
	}
	if (!this._locked) {
		if (this._stopCount > 0 && this._chasePlayer) {
			var nearestPlayer = MATTIE.multiplayer.getNearestPlayer(this.x, this.y);
			var direction = this.findDirectionTo(nearestPlayer.x, nearestPlayer.y);
			if (direction > 0) {
				var x = this._x;
				var y = this._y;
				this.moveStraight(direction);
				if (x === this._x && y === this._y) this._staggerCount = 20;
			}
		} else if (this._stopCount > 0 && this._fleePlayer) {
			this.updateFleeMovement();
		} else if (this._returnPhase) {
			this.updateMoveReturnAfter();
		} else {
			Yanfly.ECP.Game_Event_updateSelfMovement.call(this);
		}
	}
	return 0;
};

Game_Event.prototype.chaseConditions = function (dis) {
	if (!this.lastDis) this.lastDis = 2;
	if (dis == 1 && this.lastDis == 1) {
		this.grabAttempts = this.grabAttempts ? this.grabAttempts + 1 : 1;
		if (this.grabAttempts >= MATTIE.multiplayer.maxGrabAttempts) {
			return false;
		}
	} else {
		this.grabAttempts = 0;
	}
	this.lastDis = dis;
	if (dis <= this._chaseRange && this.nonSeePlayer()) {
		this._alertLock = this._sightLock;
		return true;
	}
	if (this._alertLock > 0) return true;
	if (dis <= this._chaseRange && this.canSeePlayer()) return true;
	return false;
};

Game_Event.prototype.canSeePlayer = function () {
	if (!this._seePlayer) return false;
	var nearestPlayer = MATTIE.multiplayer.getNearestPlayer(this.x, this.y);
	var sx = this.deltaXFrom(nearestPlayer.x);
	var sy = this.deltaYFrom(nearestPlayer.y);
	if (Math.abs(sx) > Math.abs(sy)) {
		var direction = (sx > 0) ? 4 : 6;
	} else {
		var direction = (sy > 0) ? 8 : 2;
	}
	if (direction === this.direction()) {
		this._alertLock = this._sightLock;
		return true;
	}
	return false;
};

Game_Event.prototype.updateChaseDistance = function () {
	if (this._erased) return;
	if (this._chaseRange <= 0) return;
	var nearestPlayer = MATTIE.multiplayer.getNearestPlayer(this.x, this.y);
	var dis = Math.abs(this.deltaXFrom(nearestPlayer.x));
	dis += Math.abs(this.deltaYFrom(nearestPlayer.y));
	if (this.chaseConditions(dis)) {
		this.startEventChase();
	} else if (this._chasePlayer) {
		this.endEventChase();
	}
};
