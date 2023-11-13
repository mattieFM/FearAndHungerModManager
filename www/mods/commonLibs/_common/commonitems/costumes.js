// this file contains all the costumes

/** @namespace MATTIE.items a name space containing information about additional items  */
MATTIE.items = {};

/** @description a dict costume info */
MATTIE.items.costumes = {};

/**
 * @description if set to true all costumes will make you look exactly like the character instead of the custom costume sprites
 * @default false
 */
MATTIE.items.costumes.perfect = false;

/** @description a dict containing all the item objects for costumes */
MATTIE.items.costumes.items = {};

/**
 * @description a method that spawns all initialized costume objects into the game as real items
 */
MATTIE.items.spawnAllCostumes = function () {
	/** @description costume for the girl */
	MATTIE.items.costumes.items.girlCostume = MATTIE.itemAPI.createCostume(
		'$girl',
		0,
		'girl costume',
		new MATTIE.itemAPI.RuntimeIcon('girlCostume'),
		130,
		[130, 8, 45, 46],
		false,
	);

	MATTIE.items.costumes.items.girlCostume.setCraftingCallback(() => {
		SceneManager.goto(Scene_Map);
		setTimeout(() => {
			MATTIE.fxAPI.startScreenShake(1, 1, 10);
			// eslint-disable-next-line max-len
			MATTIE.msgAPI.displayMsg('You find yourself overcome with grief as you sow a child\'s soul\ninto fabric and deformed flesh. What have these dungeons done \nto you to make you willing to do such a thing, without reason.');
		}, 500);
	});

	const keys = Object.keys(MATTIE.items.costumes.items);
	keys.forEach((key) => {
		const costume = MATTIE.items.costumes.items[key];
		if (!costume.isSpawned) { costume.spawn(); }
	});
};
