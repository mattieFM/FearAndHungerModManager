var MATTIE = MATTIE || {};
MATTIE.static = MATTIE.static || {};

DataManager.changeActivationCondition(MATTIE.static.skills.hurting, 0);
DataManager.setCallbackOnObj(MATTIE.static.skills.hurting, () => {
	const x = $gamePlayer._x;
	const y = $gamePlayer._y;
	let dist = Infinity;
	/** @type {Game_Event} */
	let closest = null;
	$gameMap.events().forEach((event) => {
		if (event.page()) {
			if (event.page().list) {
				const isEnemy = event.page().list.some((entry) => entry.code == MATTIE.static.rpg.battleProcessingId);
				if (isEnemy) {
					const thisDist = Math.sqrt((event._x - x) ** 2 + (event._y - y) ** 2);
					if (thisDist < dist) {
						dist = thisDist;
						closest = event;
					}
				}
			}
		}
	});

	function getFirstBattleEvent() {
		const { list } = closest.page();
		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			if (element.code == MATTIE.static.rpg.battleProcessingId) return element;
		}
		return null;
	}
	const battleEvent = getFirstBattleEvent();
	const gameTroop = $dataTroops[battleEvent.parameters[1]];
	gameTroop.members[parseInt(Math.random() * gameTroop.members.length, 10)].hidden = true;
});
