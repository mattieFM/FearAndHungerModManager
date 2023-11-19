MATTIE.devTools = MATTIE.devTools || {};
//
(() => {
	Input.addKeyBind('', () => {
		SceneManager.push(MATTIE.scenes.Scene_Dev);
	}, 'CHEAT', 1, 'p', 'p');

	Input.addKeyBind('', () => {
		SceneManager.push(MATTIE.scenes.Scene_Dev);
	}, 'DEV MENU (DEV)', -2);

	Input.addKeyBind('', () => {
		SceneManager.onError(new Error('hiya im an error'));
	}, 'THROW ERROR (DEV)', -2);

	Input.addKeyBind('', async () => {
		SceneManager.goto(Scene_Gameover);
	}, 'die (DEV)', -2);

	Input.addKeyBind('v', () => {
		const amount = 1;
		const d = $gamePlayer.direction();
	});

	// Input.addKeyBind('', () => {
	// 	const pocketCatEvent = new MapEvent();
	// 	pocketCatEvent.copyActionsFromEventOnMap(10, 8);
	// 	pocketCatEvent.spawn($gamePlayer.x, $gamePlayer.y);
	// }, 'Spawn Cat (DEV)', -2);

	// Input.addKeyBind('', () => {
	// 	const arr = [1, 3, 4, 5];
	// 	let i = -(Math.ceil(arr.length / 2) + 1);
	// 	for (let index = 0; index < arr.length; index++) {
	// 		const e1 = arr[index];
	// 		for (let index2 = 0; index2 < arr.length; index2++) {
	// 			const e2 = arr[index2];
	// 			const sex = MATTIE.eventAPI.marriageAPI.displayMarriage(e1, e2, false, $gamePlayer.x + i, $gamePlayer.y + 2);
	// 			i += 2;
	// 		}
	// 	}
	// }, 'Spawn bad things (DEV)', -2);

	// Input.addKeyBind('', () => {
	// 	const sex = MATTIE.eventAPI.marriageAPI.displayMarriage(1, 1, false, $gamePlayer.x, $gamePlayer.y, false);
	// 	sex.data.pages[0].image.characterName = '$CrowXBunny';
	// 	sex.data.pages[1].image.characterName = '';
	// 	sex.spawn($gamePlayer.x + 2, $gamePlayer.y + 2);
	// 	setTimeout(() => {
	// 		sex.removeThisEvent();
	// 		MATTIE.fxAPI.setupTint(-155, -155, -155, -155, 5);
	// 		const baseCrow = MATTIE.eventAPI.createEnemyFromExisting(33, 1, 0, 1);
	// 		baseCrow.spawn(sex.data.x + 1, sex.data.y + 2);
	// 	}, 7500);
	// }, 'Form Crow Marriage', -2);

	// let i = 1;
	// Input.addKeyBind('', () => {
	// 	MATTIE.eventAPI.marriageAPI.displaySex(1, i, $gamePlayer.x, $gamePlayer.y);
	// 	i++;
	// 	if (i > 5)i = 1;
	// }, 'Spawn Bussy Focking (DEV)', -2);

	// Input.addKeyBind('', () => {
	// 	const caharahSitting = new MapEvent();
	// 	caharahSitting.copyActionsFromEventOnMap(274, 6);
	// 	caharahSitting.data.pages = [caharahSitting.data.pages[2]];
	// 	caharahSitting.data.pages[0].list = [];
	// 	caharahSitting.data.pages[0].conditions = caharahSitting.setDefaultConditions();
	// 	caharahSitting.spawn($gamePlayer.x, $gamePlayer.y);
	// }, 'Spawn Bussy standing (DEV)', -2);

	// Input.addKeyBind('', () => {
	// 	SceneManager.onError(new Error('hiya im an error'));
	// }, 'THROW ERROR (DEV)', -2);

	// Input.addKeyBind('', () => {
	// 	console.log('here');
	// 	$gameSystem.enableMenu();
	// 	$gameScreen.clearPictures();
	// }, 'clear images (DEV)', -2);

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
	Input.addKeyBind('v', () => {
		PHASE(1);
	}, 'LESSER PHASE', 1, 'v', 'v');

	Input.addKeyBind('', () => {
		PHASE(4);
	}, 'GREATER PHASE', 1);

	Input.addKeyBind('', () => {
		PHASE(1, true);
	}, 'FORCEFUL PHASE', 1);
})();

MATTIE.devTools.switchCheatScene = function () {
	if (SceneManager._scene instanceof MATTIE.scenes.Scene_DevItems) {
		SceneManager.pop();
	} else {
		MATTIE.devTools.lastScene = SceneManager._scene;
		SceneManager.push(MATTIE.scenes.Scene_DevItems);
	}
};

/**
 * @description force a specific prarm to be a specific value
 * @param {Game_BattlerBase} target the target game battler
 * @param {int} targetId the target paramid
 * @param {int} val the value to set it to
 */
function forceParamValue(target, targetId, val) {
	if (!target.prevParam) target.prevParam = target.param;
	target.param = (id) => (id != targetId ? target.prevParam(id) : val);
}

/**
 * @description turn on god mode for an enemy (set  parameters to 10,000)
 * @param {Game_BattlerBase} enemy
 */
function targetedGodMode(enemy) {
	if (!enemy.prevParam) enemy.prevParam = enemy.param;
	enemy.param = () => 10000;
	enemy.recoverAll();
}

/**
 * @description set all character parameters to 10,000
 */
function godMode() {
	$gameParty.members().forEach((member) => {
		targetedGodMode(member);
	});
}
/**
 * @description undo god mode and set params back to normal
 */
function restoreGodMode() {
	$gameParty.members().forEach((member) => {
		if (member.prevParam) {
			member.param = member.prevParam;
			member.prevParam = undefined;
			member.recoverAll();
		}
	});
}

/**
 * @description a generic toggle prop method that applies to all
 * @param {string} propName the name of the property to chance
 * @param {string} systemSwitchName the name of the key in $gameSystem to store the bool of this toggle in
 * @param {function} newFunc the func to replace the prop with
 * @param {function} onCb
 * @param {function} offCb
 */
function toggleMemberProp(propName, systemSwitchName, newFunc = () => {}, onCb = () => {}, offCb = () => {}) {
	$gameParty.members().forEach((member) => {
		if (!member[`prev${propName}`]) {
			member[`prev${propName}`] = member[propName];
			member[propName] = () => {
				const newFuncRet = newFunc(member);
				if (newFuncRet) return newFuncRet;
				return member[`prev${propName}`]();
			};
			$gameSystem[systemSwitchName] = true;
			onCb(member);
		} else {
			member[propName] = member[`prev${propName}`];
			member[`prev${propName}`] = undefined;
			$gameSystem[systemSwitchName] = false;
			offCb(member);
		}
	});
}

function toggleGodMode() {
	toggleMemberProp('param', 'godMode', () => 10000, (member) => member.recoverAll(), (member) => member.recoverAll());
}

/**
 * @description toggle on/off party health loss
 */
function toggleHunger() {
	toggleMemberProp('changeExp', 'hungerDisabled', (member) => member.expForLevel());
}

/**
 * @description toggle on/off health loss for party
 */
function toggleHealthLoss() {
	toggleMemberProp('setHp', 'healthDisabled', (member) => member.mhp);
}

/**
 * @description toggle on/off mana loss for party
 */
function toggleManaLoss() {
	toggleMemberProp('setMp', 'manaDisabled', (member) => member.mmp);
}

/**
 * @description toggle on/off force dash for party
 */
function toggleForceDash() {
	if (!$gamePlayer.prevSpeed) {
		$gamePlayer.prevSpeed = $gamePlayer.realMoveSpeed;
		$gamePlayer.realMoveSpeed = () => 5;
		$gameSystem.forceDash = true;
		$gameSystem.hyperSpeed = false;
	} else {
		$gamePlayer.realMoveSpeed = $gamePlayer.prevSpeed;
		$gamePlayer.prevSpeed = undefined;
		$gameSystem.forceDash = false;
		$gameSystem.hyperSpeed = false;
	}
}

/**
 * @description toggle on/off force dash for party
 */
function toggleHyperSpeed() {
	if (!$gamePlayer.prevSpeed) {
		$gamePlayer.prevSpeed = $gamePlayer.realMoveSpeed;
		$gamePlayer.realMoveSpeed = () => 10;
		$gameSystem.hyperSpeed = true;
		$gameSystem.forceDash = false;
	} else {
		$gamePlayer.realMoveSpeed = $gamePlayer.prevSpeed;
		$gamePlayer.prevSpeed = undefined;
		$gameSystem.hyperSpeed = false;
		$gameSystem.forceDash = false;
	}
}

/**
 * @description toggle on/off toggleFreeExtraTurn for party
 */
function toggleFreeExtraTurn() {
	// eslint-disable-next-line consistent-return
	toggleMemberProp('param', 'freeExtraTurn', (id) => {
		if (id === 6) { // agi index
			return 100;
		}
	});
}

// on load
MATTIE.devTools.once = false;
MATTIE.devTools.prevonMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function () {
	if (!MATTIE.devTools.once) {
		if ($gameSystem.godMode) {
			toggleGodMode();
		}
		MATTIE.devTools.once = true;
	}

	MATTIE.devTools.prevonMapLoaded.call(this);
};

function toggleTas() {
	if (!$gameSystem.tas) {
		enableTas();
	} else {
		disableTas();
	}
}
