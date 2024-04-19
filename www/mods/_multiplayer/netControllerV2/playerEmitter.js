//-----------------------------------------------------------------------------------
// a class to override the base Game_Player to emit their inputs for multiplayer
//-----------------------------------------------------------------------------------


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
 * override all necessary methods making them emit events for multiplayer support
 */

// every n moves send player x and y to move
MATTIE.multiplayer.selfMoveCount = 0;
MATTIE.multiplayer.selfMax = 5;
// every n moves send player x and y to transfer
MATTIE.multiplayer.selfTransMoveCount = 0;
MATTIE.multiplayer.selfTransMax = 100;

// every n seconds send force a movement position or transfer emission.
MATTIE.multiplayer.movementEmitter.secondsTillPosSend = 10 * 1000;
MATTIE.multiplayer.movementEmitter.secondsTillTrans = 100 * 1000;

//the interval to handle position emission every n seconds
setInterval(() => {
	if (MATTIE.multiplayer.isActive) {
		var netController = MATTIE.multiplayer.getCurrentNetController();
		if (netController) {
			if (netController.started) netController.emitMoveEvent(0, $gamePlayer.x, $gamePlayer.y);
		}
	}
}, MATTIE.multiplayer.movementEmitter.secondsTillPosSend);

//the interval to handle transfer emission every n seconds
setInterval(() => {
	if (MATTIE.multiplayer.isActive) {
		var netController = MATTIE.multiplayer.getCurrentNetController();
		if (netController) {
			if (netController.started) netController.emitMoveEvent(0, $gamePlayer.x, $gamePlayer.y, true);
		}
	}
}, MATTIE.multiplayer.movementEmitter.secondsTillTrans);


//A bit of an old function from the earlier stages of the mod, used to setup some but not all player emissions
//mostly for movement emissions of the player.
MATTIE.multiplayer.gamePlayer.override = function () {
	console.info('--emitter overrides initialized--');

	// override the execute move command
	MATTIE.multiplayer.gamePlayer.executeMove = Game_Player.prototype.executeMove;
	Game_Player.prototype.executeMove = function (direction) {
		//TODO: args is not setup well here. fix that

		MATTIE.multiplayer.gamePlayer.executeMove.call(this, direction);
		var netController = MATTIE.multiplayer.getCurrentNetController();
		const args = [direction];

		//if we should not be transferring
		if (MATTIE.multiplayer.selfMoveCount >= MATTIE.multiplayer.selfMax) {
			args.push(this.x);
			args.push(this.y);
			MATTIE.multiplayer.selfMoveCount = 0;
		}
		
		//if we should be transferring.
		if (MATTIE.multiplayer.selfTransMoveCount >= MATTIE.multiplayer.selfTransMax) {
			args.push(this.x);
			args.push(this.y);
			args.push(1);
			MATTIE.multiplayer.selfTransMoveCount = 0;
		}

		//emit the move event.
		netController.emitMoveEvent(...args);
		MATTIE.multiplayer.selfMoveCount++;
		MATTIE.multiplayer.selfTransMoveCount++;
	};

	// override the update main command to make all netPlayers update at the same time as though they were Game_Player
	MATTIE.RPG.SceneMap_MainUpdate = Scene_Map.prototype.updateMain;
	Scene_Map.prototype.updateMain = function () {
		//TODO: see if this fps function actually works for anything. It was intended to help the game when fps drops, but not sure if it
		//does its job or not.
		if (Graphics._fpsMeter.fps < 10) {
			SceneManager._deltaTime = 0.9 / Graphics._fpsMeter.fps;
		}

		//for each net player, update their local object on the main update
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

		//update everything else
		MATTIE.RPG.SceneMap_MainUpdate.call(this);

		// MATTIE.multiplayer._interpreter.update();
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
		MATTIE.RPG.sceneMapOnLoaded.call(this);
		if (MATTIE.multiplayer.isActive) {
			MATTIE.emitTransfer();
			MATTIE.multiplayer.setEnemyHost();
			MATTIE.multiplayer.getCurrentNetController().updatePlayersOnCurrentMap();

			//TODO: verify that this is not causing any issues for players being visible when they should not be
			//SEE: https://discord.com/channels/1148766509406093342/1157000978885791765/1230770842179207209
			$gamePlayer.setTransparent(false); // make sure the player is not transparent
		}
	};

	//TODO: verify that this should be in this file, likely needs to be moved to the netcontroller class instead of being here.
	//or moved to event local event emitter.
	/**
	 * @description emits a transfer event to net controller
	 */
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

	//extend the addActor method to update player info when a follower is added.
	Game_Party.prototype.addActor = function (actorId) {
		console.info('follower change event');
		MATTIE.RPG.addActor.call(this, actorId);
		MATTIE.multiplayer.getCurrentNetController().updatePlayerInfo();
	};

	const removedActorIds = [];
	//extend the addActor method to update player info when a follower is removed.
	Game_Party.prototype.removeActor = function (actorId) {
		MATTIE.RPG.removeActor.call(this, actorId);
		if (!removedActorIds.includes(actorId)) {
			MATTIE.multiplayer.getCurrentNetController().updatePlayerInfo();
			console.info('follower change event');
		}
		removedActorIds.push(actorId);
	};

	MATTIE_RPG.Game_PlayerStartMapEvent = Game_Player.prototype.startMapEvent;


	//Extend the start map event function to allow interacting with other players. We are doing this directly here
	//as it is easier than having event pages attached to the net players.
	Game_Player.prototype.startMapEvent = function (x, y, triggers, normal) {
		MATTIE_RPG.Game_PlayerStartMapEvent.call(this, x, y, triggers, normal);
		MATTIE.multiplayer.playerEmitter.checkPlayerActionBtnEvent.call(this, x, y, triggers);
	};

	//this handles checking if you can interact with the player on your tile.
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
		this._lastCharName = this._characterName;
		this._lastCharIndex = this._characterIndex;
		MATTIE_RPG.Game_Actor_setCharacterImage.call(this, characterName, characterIndex);
		if (!(this instanceof MATTIE.multiplayer.NetActor)) { // only emit this event if this is a main actor and not a net actor
			if (this._lastCharName != characterName || this._lastCharIndex != characterIndex) { // check that anything has changed
				if ($gameParty._actors.contains(this.actorId())) { // only send if this char exists in party
					MATTIE.multiplayer.getCurrentNetController().emitSetCharacterImageEvent(characterName, characterIndex, this.actorId());
				}
			}
		}
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

	// setup a move event to trigger when player stops moving
	MATTIE.inputAPI.onLongNoInput((() => {
		if (MATTIE.multiplayer.hasController()) {
			const netController = MATTIE.multiplayer.getCurrentNetController();
			if (SceneManager._scene.isActive() && SceneManager._scene instanceof Scene_Map) {
				// console.log(MATTIE.multiplayer.getCurrentNetController());
				// console.log(netController.emitMoveEvent);
				netController.emitMoveEvent(0, $gamePlayer.x, $gamePlayer.y);
			}
		}
	}));
};
