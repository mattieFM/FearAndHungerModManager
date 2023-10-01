MATTIE.devTools = MATTIE.devTools || {};
//
(() => {
	Input.addKeyBind('', () => {
		SceneManager.push(MATTIE.scenes.Scene_Dev);
	}, 'CHEAT', 1, 'p', 'p');

	Input.addKeyBind('', () => {
		SceneManager.push(Scene_Debug);
	}, 'DEBUG (DEV)', -2);

	Input.addKeyBind('', () => {
		SceneManager.push(MATTIE.scenes.Scene_Dev);
	}, 'DEV MENU (DEV)', -2);

	Input.addKeyBind('', () => {
		SceneManager.onError(new Error('hiya im an error'));
	}, 'THROW ERROR (DEV)', -2);

	Input.addKeyBind('', () => {
		console.log('here');
		$gameSystem.enableMenu();
		$gameScreen.clearPictures();
	}, 'clear images (DEV)', -2);

	Input.addKeyBind('v', () => {
		const amount = 1;
		const d = $gamePlayer.direction();
	});

	Input.addKeyBind('', () => {
		SceneManager.push(MATTIE.scenes.Scene_Dev);
	}, 'DEV MENU (DEV)', -2);

	Input.addKeyBind('', () => {
		const pocketCatEvent = new MapEvent();
		pocketCatEvent.copyActionsFromEventOnMap(10, 8);
		pocketCatEvent.spawn($gamePlayer.x, $gamePlayer.y);
	}, 'Spawn Cat (DEV)', -2);

	Input.addKeyBind('', () => {
		const sex = MATTIE.eventAPI.marriageAPI.displaySex(1, i, $gamePlayer.x, $gamePlayer.y, false);
		sex.data.pages[0].image.characterName = '$caharSect';
		sex.spawn($gamePlayer.x, $gamePlayer.y);
	}, 'Spawn CaharSex (DEV)', -2);

	Input.addKeyBind('', () => {
		const caharahSitting = new MapEvent();
		caharahSitting.copyActionsFromEventOnMap(274, 6);
		caharahSitting.data.pages = [caharahSitting.data.pages[0]];
		caharahSitting.data.pages[0].conditions = caharahSitting.setDefaultConditions();
		caharahSitting.data.pages[0].list = [];
		caharahSitting.spawn($gamePlayer.x, $gamePlayer.y);
	}, 'Spawn Bussy Sitting (DEV)', -2);

	let i = 1;
	Input.addKeyBind('', () => {
		MATTIE.eventAPI.marriageAPI.displaySex(1, i, $gamePlayer.x, $gamePlayer.y);
		i++;
		if (i > 5)i = 1;
	}, 'Spawn Bussy Focking (DEV)', -2);

	Input.addKeyBind('', () => {
		const caharahSitting = new MapEvent();
		caharahSitting.copyActionsFromEventOnMap(274, 6);
		caharahSitting.data.pages = [caharahSitting.data.pages[2]];
		caharahSitting.data.pages[0].list = [];
		caharahSitting.data.pages[0].conditions = caharahSitting.setDefaultConditions();
		caharahSitting.spawn($gamePlayer.x, $gamePlayer.y);
	}, 'Spawn Bussy standing (DEV)', -2);

	Input.addKeyBind('', () => {
		SceneManager.onError(new Error('hiya im an error'));
	}, 'THROW ERROR (DEV)', -2);

	Input.addKeyBind('', () => {
		console.log('here');
		$gameSystem.enableMenu();
		$gameScreen.clearPictures();
	}, 'clear images (DEV)', -2);

	Input.addKeyBind('v', () => {
		const amount = 1;
		const d = $gamePlayer.direction();

		let { x } = $gamePlayer;
		let { y } = $gamePlayer;
		switch (d) {
		case 8: // up
			y -= amount;
			break;

		case 6: // right
			x += amount;
			break;

		case 4: // left
			x -= amount;
			break;
		case 2: // down
			y += amount;
			break;

		default:
			break;
		}
		$gamePlayer.reserveTransfer($gameMap.mapId(), x, y, d, 2);
	}, 'PHASE', 1);
})();

MATTIE.devTools.switchCheatScene = function () {
	if (SceneManager._scene instanceof MATTIE.scenes.Scene_DevItems) {
		SceneManager.pop();
	} else {
		MATTIE.devTools.lastScene = SceneManager._scene;
		SceneManager.push(MATTIE.scenes.Scene_DevItems);
	}
};
