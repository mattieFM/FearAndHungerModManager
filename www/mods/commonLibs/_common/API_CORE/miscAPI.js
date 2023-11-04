/** @namespace MATTIE.miscAPI the namespace containing all misc stuff */
MATTIE.miscAPI = {};

/**
 * @description lose all food items
 */
MATTIE.miscAPI.stealAllFood = function () {
	$gameParty.items().forEach((item) => {
		const isFood = item.effects.some((effect) => effect.code === Game_Action.EFFECT_COMMON_EVENT
            && MATTIE.static.commonEvents.foods.includes(effect.dataId));
		if (isFood) {
			$gameParty.loseItem(item, 100);
		}
	});
};

/**
 * @description lose random item
 * @returns the item the player lost
 */
MATTIE.miscAPI.loseRandomItem = function () {
	const items = $gameParty.items();
	const item = items[MATTIE.util.randBetween(0, items.length - 1)];
	$gameParty.loseItem(item, 1);
	return item;
};

/**
 * @description trip and fall dropping a bunch of your items on the ground
 */
MATTIE.miscAPI.tripAndFall = function (max = 10) {
	MATTIE.msgAPI.footerMsg('You trip and fall XD, you drop some of your items on the ground.');
	MATTIE.fxAPI.startScreenShake(10, 10, 25);
	const times = MATTIE.util.randBetween(1, max);
	const leader = $gameParty.leader();
	const prevIndex = leader.characterIndex;
	leader.characterIndex = () => 4;
	// leader.setCharacterImage(leader._characterName, 4);
	for (let index = 0; index < times; index++) {
		const item = MATTIE.miscAPI.loseRandomItem();
		if (item) {
			const event = MATTIE.eventAPI.addItemDropToCurrentMap(new Game_Item(item), false);
			event.spawn($gamePlayer.x + MATTIE.util.randBetween(-1, 1), $gamePlayer.y + MATTIE.util.randBetween(-1, 1));
		}
	}

	setTimeout(() => {
		leader.characterIndex = prevIndex;
	}, 800);
};

/**
 *
 * @param {Game_Character} point
 * @param {int} min the min nubmer of bear traps
 * @param {int} max the max number of bear traps
 */
MATTIE.miscAPI.spawnBearTrapsAround = function (point, min = 1, max = 8) {
	const numberOfTraps = MATTIE.util.randBetween(min, max);
	for (let index = 0; index < numberOfTraps; index++) {
		const bearTrap = new MapEvent().copyActionsFromEventOnMap(342, 148);
		bearTrap.setPersist(true);
		bearTrap.data.pages[0].conditions = bearTrap.setDefaultConditions();
		bearTrap.spawn(point.x + MATTIE.util.randBetween(-3, 3), point.y + MATTIE.util.randBetween(-3, 3));
	}
};

/**
 *
 * @param {Game_Character} point
 * @param {int} min the min nubmer of bear traps
 * @param {int} max the max number of bear traps
 */
MATTIE.miscAPI.spawnRustyNailsAround = function (point, min = 1, max = 8) {
	MATTIE.fxAPI.startScreenShake(100, 100, 25);
	const numberOfTraps = MATTIE.util.randBetween(min, max);
	for (let index = 0; index < numberOfTraps; index++) {
		const bearTrap = new MapEvent().copyActionsFromEventOnMap(322, 1);
		bearTrap.setPersist(true);
		bearTrap.data.pages[0].conditions = bearTrap.setDefaultConditions();
		bearTrap.spawn(point.x + MATTIE.util.randBetween(-3, 3), point.y + MATTIE.util.randBetween(-3, 3));
	}
};

/**
 *
 * @param {Game_Character} point
 * @param {int} min the min nubmer of ghouls traps
 * @param {int} max the max number of ghouls traps
 */
MATTIE.miscAPI.spawnGhoulsAround = function (point, min = 1, max = 8) {
	MATTIE.fxAPI.startScreenShake(100, 100, 25);
	const numberOfTraps = MATTIE.util.randBetween(min, max);
	for (let index = 0; index < numberOfTraps; index++) {
		const bearTrap = MATTIE.eventAPI.createEnemyFromExisting(1, 95, 0, 7);
		bearTrap.setPersist(true);
		bearTrap.data.pages[0].conditions = bearTrap.setDefaultConditions();
		bearTrap.spawn(point.x + MATTIE.util.randBetween(-3, 3), point.y + MATTIE.util.randBetween(-3, 3));
	}
};

/**
 *
 * @param {Game_Character} point
 * @param {int} min the min nubmer of ghouls traps
 * @param {int} max the max number of ghouls traps
 */
MATTIE.miscAPI.spawnGaurdsAround = function (point, min = 1, max = 8) {
	MATTIE.fxAPI.startScreenShake(100, 100, 25);
	const numberOfTraps = MATTIE.util.randBetween(min, max);
	for (let index = 0; index < numberOfTraps; index++) {
		const bearTrap = MATTIE.eventAPI.createEnemyFromExisting(1, 100, 0, 7);
		bearTrap.setPersist(true);
		bearTrap.data.pages[0].conditions = bearTrap.setDefaultConditions();
		bearTrap.spawn(point.x + MATTIE.util.randBetween(-3, 3), point.y + MATTIE.util.randBetween(-3, 3));
	}
};

/**
 *  @description spawn moonless near a location
 *  @param {Game_Character} point the place to spawn moonless near
 */
MATTIE.miscAPI.spawnMoonless = function (point) {
	const dogoo = MATTIE.eventAPI.createEnemyFromExisting(8, 193, 0, 5);
	dogoo.setPersist(true);
	dogoo.spawn(point.x + MATTIE.util.randBetween(-3, 3), point.y + MATTIE.util.randBetween(-3, 3));
};

MATTIE.miscAPI.flipControls = function () {
	const keys = Object.keys(Input.keyMapper);
	const up = keys.filter((key) => Input.keyMapper[key] === 'up');
	const down = keys.filter((key) => Input.keyMapper[key] === 'down');
	const left = keys.filter((key) => Input.keyMapper[key] === 'left');
	const right = keys.filter((key) => Input.keyMapper[key] === 'right');

	for (let index = 0; index < up.length; index++) {
		const element = up[index];
		Input.keyMapper[element] = 'down';
	}

	for (let index = 0; index < down.length; index++) {
		const element = down[index];
		Input.keyMapper[element] = 'up';
	}

	for (let index = 0; index < left.length; index++) {
		const element = left[index];
		Input.keyMapper[element] = 'right';
	}

	for (let index = 0; index < right.length; index++) {
		const element = right[index];
		Input.keyMapper[element] = 'left';
	}
};

/**
 * @description make followers move opposite to how they should
 * @param {int} t number of ms till reverting this change
 */
MATTIE.miscAPI.invertFollowerDirections = function (t = 30000) {
	$gamePlayer.followers().forEach((follower) => {
		if (!follower.PrevMoveStraight) {
			follower.PrevMoveStraight = follower.moveStraight;
			follower.moveStraight = function (d) {
				dict = {
					2: 8,
					8: 2,
					4: 6,
					6: 4,
				};
				follower.PrevMoveStraight.call(this, dict[d]);
			};

			setTimeout(() => {
				if (typeof follower.PrevMoveStraight === 'function') { follower.moveStraight = follower.PrevMoveStraight; }
				follower.PrevMoveStraight = undefined;
			}, t);
		}
	});
};

/**
 * @description add an item to a drop table
 * @param {MATTIE.itemAPI.runtimeItem} item
 * @param {int} dropTable the id of the common event for the drop table
 * @param {int} chance the chance between 0 and 1
 */
MATTIE.miscAPI.addToDropTable = function (item, dropTable, chance) {
	const prev117 = Game_Interpreter.prototype.command117;
	Game_Interpreter.prototype.command117 = function () {
		if (this._params[0] === dropTable && MATTIE.util.randChance(chance)) {
			item.gainThisItem();
		} else {
			prev117.call(this);
		}

		return true;
	};
};
