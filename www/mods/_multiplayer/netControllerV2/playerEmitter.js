// a class to override the base Game_Player to emit their inputs for multiplayer
var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.multiplayer.gamePlayer = MATTIE.multiplayer.gamePlayer || {};
MATTIE.multiplayer.movementEmitter = MATTIE.multiplayer.movementEmitter || {};
MATTIE.multiplayer.playerEmitter = MATTIE.multiplayer.playerEmitter || {};
MATTIE.RPG = MATTIE.RPG || {};

/**
 *
 * override all uneccacary methods making them emit events for multiplayer support
 */

// every x moves send player x and y to move
MATTIE.multiplayer.selfMoveCount = 0;
MATTIE.multiplayer.selfMax = 15;
// every x moves send player x and y to transfer
MATTIE.multiplayer.selfTransMoveCount = 0;
MATTIE.multiplayer.selfTransMax = 100;

MATTIE.multiplayer.movementEmitter.secondsTillPosSend = 10 * 1000;
MATTIE.multiplayer.movementEmitter.secondsTillTrans = 100 * 1000;

setInterval(() => {
	if (MATTIE.multiplayer.isActive) {
		var netController = MATTIE.multiplayer.getCurrentNetController();
		if (netController) {
			if (netController.started) netController.emitMoveEvent(0, $gamePlayer.x, $gamePlayer.y);
		}
	}
}, MATTIE.multiplayer.movementEmitter.secondsTillPosSend);

setInterval(() => {
	if (MATTIE.multiplayer.isActive) {
		var netController = MATTIE.multiplayer.getCurrentNetController();
		if (netController) {
			if (netController.started) netController.emitMoveEvent(0, $gamePlayer.x, $gamePlayer.y, true);
		}
	}
}, MATTIE.multiplayer.movementEmitter.secondsTillTrans);

MATTIE.multiplayer.gamePlayer.override = function () {
	console.info('--emitter overrides initialized--');

	// override the execute move command
	MATTIE.multiplayer.gamePlayer.executeMove = Game_Player.prototype.executeMove;
	Game_Player.prototype.executeMove = function (direction) {
		MATTIE.multiplayer.gamePlayer.executeMove.call(this, direction);
		var netController = MATTIE.multiplayer.getCurrentNetController();
		const args = [direction];
		if (MATTIE.multiplayer.selfMoveCount >= MATTIE.multiplayer.selfMax) {
			args.push(this.x);
			args.push(this.y);
			MATTIE.multiplayer.selfMoveCount = 0;
		}
		if (MATTIE.multiplayer.selfTransMoveCount >= MATTIE.multiplayer.selfTransMax) {
			args.push(this.x);
			args.push(this.y);
			args.push(1);
			MATTIE.multiplayer.selfTransMoveCount = 0;
		}
		netController.emitMoveEvent(...args);
		MATTIE.multiplayer.selfMoveCount++;
		MATTIE.multiplayer.selfTransMoveCount++;
	};

	// override the update main command to make all netPlayers update at the same time as though they were Game_Player
	MATTIE.RPG.SceneMap_MainUpdate = Scene_Map.prototype.updateMain;
	Scene_Map.prototype.updateMain = function () {
		MATTIE.RPG.SceneMap_MainUpdate.call(this);
		const netController = MATTIE.multiplayer.getCurrentNetController();
		for (key in netController.netPlayers) {
			if (key) {
				const netPlayer = netController.netPlayers[key];
				const localPlayer = netPlayer.$gamePlayer;
				if (localPlayer) {
					localPlayer.update(SceneManager._scene.isActive());
				}
			}
		}
		MATTIE.multiplayer._interpreter.update();
	};

	// create an objet to sure transfer data
	MATTIE.multiplayer.renderer.currentTransferObj = {};

	// override reserve transfer to also store its data in our obj
	MATTIE.RPG.reserveTransfer = Game_Player.prototype.reserveTransfer;
	Game_Player.prototype.reserveTransfer = function (mapId, x, y, d, fadeType) {
		MATTIE.RPG.reserveTransfer.call(this, mapId, x, y, d, fadeType);
		if (MATTIE.multiplayer.isActive) {
			MATTIE.multiplayer.renderer.currentTransferObj = {};
			MATTIE.multiplayer.renderer.currentTransferObj.transfer = {};
			MATTIE.multiplayer.renderer.currentTransferObj.transfer.x = x;
			MATTIE.multiplayer.renderer.currentTransferObj.transfer.y = y;
			MATTIE.multiplayer.renderer.currentTransferObj.transfer.map = mapId;
		}
	};

	// override performTransfer to emit events with the data we stored
	MATTIE.RPG.performTransfer = Game_Player.prototype.performTransfer;
	Game_Player.prototype.performTransfer = function (shouldSync = true) {
		MATTIE.RPG.performTransfer.call(this);
		if (MATTIE.multiplayer.isActive && shouldSync) {
			const netController = MATTIE.multiplayer.getCurrentNetController();
			netController.emitTransferEvent(MATTIE.multiplayer.renderer.currentTransferObj);
		}
	};

	// override the function that triggers when the scene map is fully loaded
	MATTIE.RPG.sceneMapOnLoaded = Scene_Map.prototype.onMapLoaded;
	Scene_Map.prototype.onMapLoaded = function () {
		// console.log("map loaded")
		MATTIE.RPG.sceneMapOnLoaded.call(this);
		if (MATTIE.multiplayer.isActive) {
			MATTIE.emitTransfer();
			MATTIE.multiplayer.setEnemyHost();
			MATTIE.multiplayer.getCurrentNetController().updatePlayersOnCurrentMap();
			$gamePlayer.setTransparent(false); // make sure the player is not transparent
		}
	};

	MATTIE.emitTransfer = function () {
		MATTIE.multiplayer.renderer.currentTransferObj = {};
		MATTIE.multiplayer.renderer.currentTransferObj.transfer = {};
		MATTIE.multiplayer.renderer.currentTransferObj.transfer.x = $gamePlayer.x;
		MATTIE.multiplayer.renderer.currentTransferObj.transfer.y = $gamePlayer.y;
		MATTIE.multiplayer.renderer.currentTransferObj.transfer.map = $gameMap.mapId();
		const netController = MATTIE.multiplayer.getCurrentNetController();

		// handle setting the proper actor id when the player loads into a map
		// this does also allow the main actor changing if we want
		netController.updatePlayerInfo();
		netController.emitTransferEvent(MATTIE.multiplayer.renderer.currentTransferObj);
	};

	// extend the follower change command to emit the event we need
	MATTIE.RPG.addActor = Game_Party.prototype.addActor;
	MATTIE.RPG.removeActor = Game_Party.prototype.removeActor;
	Game_Party.prototype.addActor = function (actorId) {
		console.info('follower change event');
		MATTIE.RPG.addActor.call(this, actorId);
		MATTIE.multiplayer.getCurrentNetController().updatePlayerInfo();
	};

	const removedActorIds = [];
	Game_Party.prototype.removeActor = function (actorId) {
		MATTIE.RPG.removeActor.call(this, actorId);
		if (!removedActorIds.includes(actorId)) {
			MATTIE.multiplayer.getCurrentNetController().updatePlayerInfo();
			console.info('follower change event');
		}
		removedActorIds.push(actorId);
	};

	MATTIE_RPG.Game_PlayerStartMapEvent = Game_Player.prototype.startMapEvent;

	Game_Player.prototype.startMapEvent = function (x, y, triggers, normal) {
		MATTIE_RPG.Game_PlayerStartMapEvent.call(this, x, y, triggers, normal);
		MATTIE.multiplayer.playerEmitter.checkPlayerActionBtnEvent.call(this, x, y, triggers);
	};

	MATTIE.multiplayer.playerEmitter.checkPlayerActionBtnEvent = function (x, y, triggers) {
		const netCont = MATTIE.multiplayer.getCurrentNetController();
		Object.keys(netCont.netPlayers).forEach((key) => {
			/** @type {PlayerModel} */
			const netPlayer = netCont.netPlayers[key];
			if (netPlayer.map === $gameMap.mapId()) {
				if (!MATTIE.static.maps.onMenuMap()) {
					if (netPlayer.$gamePlayer.x === x && netPlayer.$gamePlayer.y === y) {
						if (triggers.contains(0)) { // if this is an action button trigger
							netPlayer.onInteract();
						}
					}
				}
			}
		});
	};

	/** @description the base set transparent method for game player */
	MATTIE_RPG.Game_Player_setTransparent = Game_Player.prototype.setTransparent;

	/**
	 * @description the overridden method for set transparent overridden to emit its event
	 * @param {boolean} bool whether the player is transparent or visible
	 * @param {boolean} doNotEmit whether to not send this event to net clients or not
	 */
	Game_Player.prototype.setTransparent = function (bool, doNotEmit = false) {
		const netCont = MATTIE.multiplayer.getCurrentNetController();
		MATTIE_RPG.Game_Player_setTransparent.call(this, bool);
		if (!doNotEmit)netCont.emitSetTransparentEvent(bool);
	};

	/** @description the base setCharacterImage method for game actor */
	MATTIE_RPG.Game_Actor_setCharacterImage = Game_Actor.prototype.setCharacterImage;
	/**
	 * @description the overridden method for set character image to handle emitting outfit changes
	 * @param {string} characterName the name of the charsheet (the file within www/imgs/charecters excluding .png)
	 * @param {ing} characterIndex the index within that sprite sheet
	 */
	Game_Actor.prototype.setCharacterImage = function (characterName, characterIndex) {
		if (!(this instanceof MATTIE.multiplayer.NetActor)) { // only emit this event if this is a main actor and not a net actor
			if (this._lastCharName != characterName || this._lastCharIndex != characterIndex) { // check that anything has changed
				if ($gameParty._actors.contains(this.actorId())) { // only send if this char exists in party
					MATTIE.multiplayer.getCurrentNetController().emitSetCharacterImageEvent(characterName, characterIndex, this.actorId());
				}
			}
		}

		this._lastCharName = this._characterName;
		this._lastCharIndex = this._characterIndex;
		MATTIE_RPG.Game_Actor_setCharacterImage.call(this, characterName, characterIndex);
	};

	/** @description the base isDashButtonPressed method for game player */
	MATTIE_RPG.Game_Player_updateDashing = Game_Player.prototype.updateDashing;
	/**
	 * @description override the update dashing method to emit the dash event when there is a change in dashing
	 */
	Game_Player.prototype.updateDashing = function () {
		MATTIE_RPG.Game_Player_updateDashing.call(this);
		// console.log(`isDashBtnPressed:${this._dashing}`);
		if (this.lastVal != this._dashing && this.isMoving()) {
			// dash is always false if player is not moving thus only check if player is moving
			// console.log(`IS DASH PRESSED CHANGED:\n -FROM:${this.lastVal}\n -TO:${this._dashing}`);
			MATTIE.multiplayer.getCurrentNetController().emitDashEvent(this._dashing);
			this.lastVal = this._dashing;
		}
	};

	/** @description the base set move speed method */
	MATTIE_RPG.Game_Player_SetMoveSpeed = Game_Player.prototype.setMoveSpeed;
	/** @description override the set move speed method to emit the event as well */
	Game_Player.prototype.setMoveSpeed = function (moveSpeed) {
		// console.log(`moveSpeedSetTo:${moveSpeed}`);
		if (!(this instanceof MATTIE.multiplayer.Secondary_Player)) { // if not a net player
			if (this.lastMoveSpeed != moveSpeed) {
				// console.log(`MOVE SPEED CHANGED:\n -FROM:${this.lastMoveSpeed}\n -TO:${moveSpeed}`);
				MATTIE.multiplayer.getCurrentNetController().emitSpeedEvent(moveSpeed);
				this.lastMoveSpeed = moveSpeed;
			}
		}
		MATTIE_RPG.Game_Player_SetMoveSpeed.call(this, moveSpeed);
	};
};
