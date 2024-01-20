/** ========================================================================
 * MOD DESCRIPTION
 * This is a tutorial mod to help get people fermiliarized with the modding api and modding rpgmaker and funger
 * This mod's goal is the make it such that when the player equips gaunt armor they will take the sprite of the gaunt knight.
 *
 *========================================================================* */

// this imports the main package of the modding api.
var MATTIE = MATTIE || {};

// thus you can use MATTIE.itemAPI.createCostume, etc... or any other method within that obj

/**
 * @description this initializes the mod.
 * note this goofy syntax is the same as function initalize but has a few benifts as it obscures scope such that you dont accidently
 * declare global vars without intending to.
 */
(() => {
// our code goes here

	// somewhere in the code there should exist a variable controlling charecter sprite
	// we need to change it to be $seril2 when the charecter wears the armor.
	// and then change it back when they take it off.
	// var charecterSprite = "$mercenary";
	// charecterSprite = "$seril2";

	// tihs adds the item "gaunt helm" as a costume to the game, you can explore the function it is calling to know more.
	// to see this in game enable the dev tools mod and then spawn in this item (it is a peice of armor not a helmet despite its name)
	MATTIE.itemAPI.createCostume('$seril2', 1, 'Gaunt Helm', 12, 2, [3]);

	// this variable below is the dataObject represetning serils' helm
	const serilArmor = $dataArmors[34];
	// this var is the game_item representing serilsArmor
	const serilGameObj = new Game_Item(serilArmor);

	// Work with the provided code within the itemAPI,
	// the code wich allows callbacks to be performed on items upon equip and unequip.
	// that code is within the item api around line 450

	// example of how callbacks could be used for equiping and uneqipping.
	// serilGameObj.setEquipCallback(renderSerilsArmor);
	// serilGameObj.setUnequipCallback(takeOffArmorSprite);

	// Note that the above wont work as setEquipCallback is not a method of the class game_item which serilGameObj is an instance of.
	// but it is somewhat what it will look like.

	// for a reference on how to change char sprites review the code inside of costumes.js or in bbgirlmod.js
	// (the mod that makes chars naked when they take off their armor)

	// costumes.js is almost identical to what you will be doing although you will need to adapt its create costume method to edit an existing item with the
	// same functionality as the costume

	// note that the DataManager.setCallback function (might not be the exact name is likely what you need to use).
	// note that DataManager is a static class so it does not need to be instaniated and just works without the new keyword.

	// see easyEmpty scroll for a simple example of overridding an item's default behaviour and an example of callbacks.

	// the method below is a good start of how you would change sprites
	// $gameActors.actor(0).forceCharName("$seril2");
	// this would force the main chars sprite to always be seril
	// $gameParty.leader().forceCharName('$seril2');
	// this would force the actor with id 4 to always look like seril
	// $gameActors.actor(4).forceCharName('$seril2');

	// the above will not work well sense it runs right as the game opens rather than once the player starts a game.
	// you would need to extend the onmapload function to handle this properly but that is pretty complicated and not what you want to do anyways.
	// so for sake of testing it easily I have just made it trigger after 30 seconds

	// this would force the actor with id 4 to always look like seril

	// the below code will set the main char 4 to look like seril after 30 sec
	setTimeout(() => {
		// this would force the main chars sprite to always be seril
		$gameParty.leader().forceCharName('$seril2');
		$gameActors.actor(4).forceCharName('$seril2');
	}, 30000);

	// then after 60 seconds turn them back to normal
	setTimeout(() => {
		// by passing undefined to the function we undo what we did in the lines above within the 30000 delay block
		$gameParty.leader().forceCharName(undefined);
		$gameActors.actor(4).forceCharName(undefined);

		// note that undefined is different than NULL
	}, 60000);
})();

/** ========================================================================
 * !                              WARNING
 *   The below code should be added to and properly implemented within the actorAPI
 * for the time being I have copied it below from the other mod that uses it for your convinence.
 * Feel free to use it here.
 *
 *
 *
 *========================================================================* */

// ignore this line, its bad code copied from somewhere else, it should be named apropriately as to what it is
MATTIE.prevFun5325c = Game_Actor.prototype.characterName;

/**
 * @description force the
 * @param {*} name a string of the name of the sprite IE: "$seril2" for gaunt armor
 */
Game_Actor.prototype.forceCharName = function (name) {
	this.forcedName = name;
	$dataActors[this.actorId()]._forcedName = name;
};
/**
 * @description override the charecter name function to allow us to force the sprite to be whatever we want.
 * This is a slightly different approach than how the cosutmes.js file handles it, neither is better, choose whichever makes more sense
 * @returns the name of the char's sprite
 */
Game_Actor.prototype.characterName = function () {
	const name = this.forcedName || $dataActors[this.actorId()]._forcedName;
	if (name) {
		this.forcedName = name;
		return this.forcedName;
	}
	return MATTIE.prevFun5325c.call(this);
};

/**
 * dont worry about this much. its just to get the above things to work a little better
 */
Object.defineProperty(Game_Actor.prototype, 'forcedName', {
	get() {
		return this._forcedName;
	},
	set(val) {
		this._forcedName = val;
	},
});
