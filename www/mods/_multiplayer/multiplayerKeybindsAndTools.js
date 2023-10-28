var MATTIE = MATTIE || {};
MATTIE.actorAPI = MATTIE.actorAPI || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.multiplayer.keybinds = MATTIE.multiplayer.keybinds || {};
MATTIE.multiplayer.keybinds.currentIndex = 0;

MATTIE.multiplayer.keybinds.tpToSpawn = function () {
	// teleport the player to the fortress
	SceneManager.goto(Scene_Map);
	$gamePlayer.reserveTransfer(MATTIE.static.maps.fortress, 15, 11, 0, 2);
	setTimeout(() => {
		$gamePlayer.performTransfer();
	}, 1000);
};

MATTIE.multiplayer.keybinds.tpLast = function () {
	// teleport the player to the fortress
	SceneManager.goto(Scene_Map);
	if ($gameMap._lastMapId && $gameMap._lastX && $gameMap._lastY) {
		$gamePlayer.reserveTransfer($gameMap._lastMapId, $gameMap._lastX, $gameMap._lastY, 0, 2);
		setTimeout(() => {
			$gamePlayer.performTransfer();
		}, 500);
	}
};

MATTIE.multiplayer.keybinds.tp = function () {
	try {
		SceneManager.goto(Scene_Map);
		const netPlayers = MATTIE.multiplayer.getCurrentNetController().netPlayers;
		const netPlayerIds = Object.keys(netPlayers);

		if (MATTIE.multiplayer.keybinds.currentIndex < netPlayerIds.length - 1) { // handle incrementing / looping
			MATTIE.multiplayer.keybinds.currentIndex++;
		} else {
			MATTIE.multiplayer.keybinds.currentIndex = 0;
		}

		const playerId = netPlayerIds[MATTIE.multiplayer.keybinds.currentIndex];

		console.log(playerId);
		console.log(netPlayers);
		const player = netPlayers[playerId];
		const mapId = player.$gamePlayer._newMapId != 0 ? player.$gamePlayer._newMapId : player.map;
		const x = player.$gamePlayer.x;
		const y = player.$gamePlayer.y;
		$gamePlayer.reserveTransfer(mapId, x, y, 0, 2);
		setTimeout(() => {
			$gamePlayer.performTransfer();
		}, 500);
	} catch (error) {
		console.error(error);
	}
};

Input.addKeyBind('n', () => {
	MATTIE.multiplayer.keybinds.tp();
}, 'TP', 0);

Input.addKeyBind('', () => {
	MATTIE.multiplayer.keybinds.tpToSpawn();
}, 'TP TO SPAWN', 0);

Input.addKeyBind('m', () => {
	MATTIE.unstuckAPI.unstuck();
}, 'UNSTUCK', 0, 'm', 'm');

// Input.addKeyBind('', async () => {
// 	const torturer = new MATTIE.actorAPI.Data_Actor_Wrapper();
// 	torturer.buildDataActorFromEventAndTroop(await MATTIE.eventAPI.getEventOnMap(132, 3), $dataTroops[17]);// add turturer as actor
// 	torturer.create();
// 	const priest3 = new MATTIE.actorAPI.Data_Actor_Wrapper();
// 	priest3.buildDataActorFromEventAndTroop(await MATTIE.eventAPI.getEventOnMap(26, 3), $dataTroops[10]);// add priest3 as actor
// 	priest3.create();

// 	const crowMauler = new MATTIE.actorAPI.Data_Actor_Wrapper();
// 	crowMauler.buildDataActorFromEventAndTroop(await MATTIE.eventAPI.getEventOnMap(173, 24), $dataTroops[51]);// add crow mauler as actor
// 	crowMauler.create();

// 	const Merc = new MATTIE.actorAPI.Data_Actor_Wrapper();
// 	Merc.buildDataActorFromExistingActor($dataActors[1]);
// 	Merc.create();
// }, 'addActor (DEV)', -2);

// Input.addKeyBind('', async () => {
// 	console.log('tried to marraige');
// 	MATTIE.eventAPI.marriageAPI.displayMarriage(1, 3, true, $gamePlayer.x, $gamePlayer.y);
// }, 'sex (DEV)', -2);
