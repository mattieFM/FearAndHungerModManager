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
};
