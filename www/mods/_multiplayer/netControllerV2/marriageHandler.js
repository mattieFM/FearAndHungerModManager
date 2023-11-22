MATTIE.marriageAPI = {};

// override inputupdate direction to choose from an array of dirs

(() => {
	const InputUpdateDir = Input._updateDirection;
	/**
     * @static
     * @method _updateDirection
     * @private
     */
	Input._updateDirection = function () {
		InputUpdateDir.call(this);
		const originalDir = this._dir4;

		// override once for forcedDir4
		if (this.forcedDir4) {
			this._dir4 = this.forcedDir4;
			this.forcedDir4 = undefined;
		}
	};
})();

MATTIE.marriageAPI.setup = function (targetIds) {
	const netCont = MATTIE.multiplayer.getCurrentNetController();
	const player = netCont.player;
	if ($gameSystem.isMarried) {
		player.marriedTo = $gameSystem.marriageIds;
		if ($gameSystem.marriageHost) {
			//
		} else {
			// permanently hide player
			$gamePlayer.isTransparent = () => true;
		}
	}
};
/**
 * @description set the local player as married.
 * NOTE: this does nothing without setup being called
 * @param {*} bool whether they are married or not
 * @param {*} isHost whether they are the host of the marriage
 * @param {string[]} targetIds the ids of all the players this player is married to
 */
MATTIE.marriageAPI.setMarried = function (bool, targetIds, host = false) {
	$gameSystem.isMarried = bool;
	$gameSystem.marriageHost = host;
	$gameSystem.marriageIds = targetIds;
};

MATTIE.marriageAPI.transferCount = 0;
MATTIE.marriageAPI.transferEveryX = 25;

/**
 * @description the handler for married movement, ment to be called while bound to a net controller
 * @param {*} moveData the net movedata obj
 * @param {*} id the net id of the sender
 */
MATTIE.marriageAPI.handleMove = function (moveData, id) {
	const netPlayer = this.netPlayers[id];
	let player = null;

	// if this player is a part of the marriage trying to move
	if (this.player.marriedTo.includes(id)) {
		console.log('a player you are married to is moving');
		MATTIE.marriageAPI.transferCount++;
		if (MATTIE.marriageAPI.transferCount >= MATTIE.marriageAPI.transferEveryX && !this.player.marriageHost) {
			MATTIE.marriageAPI.transferCount = 0;
			const otherPlayer = this.netPlayers[netPlayer.marriageHost].$gamePlayer;
			$gamePlayer.reserveTransfer(this.netPlayers[netPlayer.marriageHost].map, otherPlayer.x, otherPlayer.y, 0);
			$gamePlayer.performTransfer();
		}
		player = $gamePlayer;
	} else if (netPlayer.marriageHost != this.peerId) {
		// if this player is just a normal player not associated with this marriage
		player = this.netPlayers[netPlayer.marriageHost].$gamePlayer;
	}
	if (player) {
		if (moveData.x) {
			const deltaX = moveData.x - $gamePlayer._x;
			const deltaY = moveData.y - $gamePlayer._y;
			const numSteps = Math.abs(deltaX) + Math.abs(deltaY);
			this.smoothMoveNetPlayer(numSteps, player, moveData, 75);
		} else if (this.player.isMarried) {
			Input.forcedDir4 = moveData.d;
		} else {
			this.moveNetPlayer(moveData, netPlayer.marriageHost);
		}
	}
};
