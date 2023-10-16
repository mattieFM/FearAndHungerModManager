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
		const arr = ['$CaharaXCahara', '$DarceXCaharaBottom', '$DarceXDarce', '$enkiXenki', '$RagXRag', '$DarceXEnki'];
		let i = -(Math.ceil(arr.length / 2) + 1);
		for (let index = 0; index < arr.length; index++) {
			const element = arr[index];
			const sex = MATTIE.eventAPI.marriageAPI.displayMarriage(1, 1, false, $gamePlayer.x, $gamePlayer.y, false);
			sex.data.pages[0].image.characterName = element;
			sex.data.pages[1].image.characterName = element;
			sex.spawn($gamePlayer.x + i, $gamePlayer.y + 2);
			i += 2;
		}
	}, 'Spawn bad things (DEV)', -2);

	Input.addKeyBind('', () => {
		const sex = MATTIE.eventAPI.marriageAPI.displayMarriage(1, 1, false, $gamePlayer.x, $gamePlayer.y, false);
		sex.data.pages[0].image.characterName = '$CrowXBunny';
		sex.data.pages[1].image.characterName = '';
		sex.spawn($gamePlayer.x + 2, $gamePlayer.y + 2);
		setTimeout(() => {
			sex.removeThisEvent();
			MATTIE.fxAPI.setupTint(-155, -155, -155, -155, 5);
			const baseCrow = MATTIE.eventAPI.createEnemyFromExisting(33, 1, 0, 1);
			baseCrow.spawn(sex.data.x + 1, sex.data.y + 2);
		}, 7500);
	}, 'Form Crow Marriage', -2);

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

	const PHASE = function (n, transfer = false) {
		const amount = n;
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
		$gamePlayer.requestAnimation(256);
		if (!transfer) {
			$gamePlayer.locate(x, y);
		} else {
			$gamePlayer.reserveTransfer($gameMap.mapId(), x, y, d, 2);
		}
	};
	Input.addKeyBind('control&z', () => {
		PHASE(1);
	}, 'LESSER PHASE', 1, 'control&z', 'control&z');

	Input.addKeyBind('shift&z', () => {
		PHASE(4);
	}, 'GREATER PHASE', 1, 'shift&z', 'shift&z');

	Input.addKeyBind('v', () => {
		PHASE(1);
	}, 'FORCEFUL PHASE', 1, 'v', 'v');
})();

MATTIE.devTools.switchCheatScene = function () {
	if (SceneManager._scene instanceof MATTIE.scenes.Scene_DevItems) {
		SceneManager.pop();
	} else {
		MATTIE.devTools.lastScene = SceneManager._scene;
		SceneManager.push(MATTIE.scenes.Scene_DevItems);
	}
};

function godMode() {
	$gameParty.members().forEach((member) => {
		member.param = () => 10000;
		member.recoverAll();
	});
}
