/* eslint-disable no-unused-expressions */
var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
/**
 *  @description This contains all config for the multiplayer mod, configs are split into categories below under the tab titled "name spaces"
 *  @namespace MATTIE.multiplayer.config
 *  */
MATTIE.multiplayer.config = MATTIE.multiplayer.config || {};

/**
 * @namespace MATTIE.multiplayer.config.scaling
 * @description The namespace containing all configurable options for multiplayer scaling / balancing. <br>
 * While this is intended to let you customize the difficulty to your taste you can also just crank the values super high / low and do silly things
 * */
MATTIE.multiplayer.config.scaling = MATTIE.multiplayer.config.scaling || {};

//---------------------------------------------------------
// Enemy Scaling
//---------------------------------------------------------

/**
 * @default 1
 * @configurable
 * @description The scaler for when enemies will attack in combat. IE: the higher this number is the later in combat enemies will act.
 * */
MATTIE.multiplayer.config.scaling.enemyBattleIndexScaler;

Object.defineProperties(MATTIE.multiplayer.config.scaling, {
	enemyBattleIndexScaler: {
		get: () => MATTIE.configGet('enemyBattleIndexScaler', 1),
		set: (value) => { MATTIE.configSet('enemyBattleIndexScaler', value); },
	},
});

/**
 * @description The formula for where the enemies attack in combat, by default,
 * after one party could've attacked it is the enemies turn, then the rest of the players
 * !!DANGER!! don't touch this unless you know what you are doing.
 * @param {Game_Battler} battler
 */
MATTIE.multiplayer.config.scaling.enemyBattleIndex = (battler) => (
	battler.forcedIndex || (
		($gameParty.maxBattleMembers() / $gameTroop.totalCombatants())) * (battler.agi / 10) * MATTIE.multiplayer.config.scaling.enemyBattleIndexScaler
);

//---------------------------------------------------------
// Healing Whispers Scaling
//---------------------------------------------------------

/**
 * @default true.
 * @description whether or not healing whispers gets scaled
 */
MATTIE.multiplayer.config.scaling.shouldScaleHealingWhispers;

/**
 * @description this number is divided by the number of players in the current combat when calculating healing whispers scaling.
 * IE: when 1 player is in combat 1/1 =1 so healing whispers will be normal
 * IE: when 2 players are in combat 1/2 = .5 so healing whispers will deal .5 healing to all 8 players
 * @default 1
 */
MATTIE.multiplayer.config.scaling.healingWhispersScaler;
/**
 * @description whether party actions, like healing whispers target all parties.
 * @default true, there are other scalers that nerf these abilities to make this fair
 */
MATTIE.multiplayer.config.scaling.partyActionsTargetAll;

Object.defineProperties(MATTIE.multiplayer.config.scaling, {

	shouldScaleHealingWhispers: {
		get: () => MATTIE.configGet('shouldScaleHealingWhispers', true),
		set: (value) => { MATTIE.configSet('shouldScaleHealingWhispers', value); },
	},

	healingWhispersScaler: {
		get: () => MATTIE.configGet('healingWhispersScaler', 1),
		set: (value) => { MATTIE.configSet('healingWhispersScaler', value); },
	},

	partyActionsTargetAll: {
		get: () => MATTIE.configGet('partyActionsTargetAll', true),
		set: (value) => { MATTIE.configSet('partyActionsTargetAll', value); },
	},
});

/**
 * @description the function to scale healing whispers.
 * !!Danger!! don't edit this unless you know what you are doing.
 */
MATTIE.multiplayer.config.scaling.getHealingWhispersScaler = () => (MATTIE.multiplayer.config.scaling.healingWhispersScaler / $gameTroop.totalCombatants());

//---------------------------------------------------------
// Resurrection Cost
//---------------------------------------------------------

/**
 * @description whether resurrecting an ally has a cost
 * @default true
 */
MATTIE.multiplayer.config.scaling.resurrectionHasCost;

/**
 * @description whether resurrecting an allies requires necromancy
 * @default false //not implemented yet
 */
MATTIE.multiplayer.config.scaling.resurrectionNeedsNecromancy;

/**
 * @description whether resurrecting an ally requires sacrificing an actor/party member
 * @default false
 */
MATTIE.multiplayer.config.scaling.resurrectionActorCost;

/**
 * @description the number of actors that must be sacrificed.
 * @default 1
 */
MATTIE.multiplayer.config.scaling.actorCost;

/**
 * @description whether resurrecting an ally has an item cost
 * @default true
 */
MATTIE.multiplayer.config.scaling.resurrectionItemCost;

/**
 * @description the item id of the item that will be consumed to revive someone
 * @default 116, lesser soul
 */
MATTIE.multiplayer.config.scaling.resurrectionItemId;

/**
 * @description the number of the resurrection item that is needed to revive a player (if one is needed)
 * @default 1
 * */
MATTIE.multiplayer.config.scaling.resurrectionItemAmount;

/**
 * @description whether enemy hp should be scaled default should be true, but currently false due to bug
 * @default true
 */
MATTIE.multiplayer.config.scaling.scaleHp;

/**
 * @description this is multiplied by the max hp of all enemies
 * @default 1
 */
MATTIE.multiplayer.config.scaling.hpScaler;

/**
 * @description when there are more than one player in combat with an enemy,
 * the number of players is divided by this number then the enemies' health is multiplied by this.
 * @default 1.2
 */
MATTIE.multiplayer.config.scaling.hpPlayerDivisor;

Object.defineProperties(MATTIE.multiplayer.config.scaling, {

	resurrectionHasCost: {
		get: () => MATTIE.configGet('resurrectionHasCost', true),
		set: (value) => { MATTIE.configSet('resurrectionHasCost', value); },
	},

	resurrectionNeedsNecromancy: {
		get: () => MATTIE.configGet('resurrectionNeedsNecromancy', false),
		set: (value) => { MATTIE.configSet('resurrectionNeedsNecromancy', value); },
	},

	resurrectionActorCost: {
		get: () => MATTIE.configGet('resurrectionActorCost', false),
		set: (value) => { MATTIE.configSet('resurrectionActorCost', value); },
	},

	actorCost: {
		get: () => MATTIE.configGet('actorCost', true),
		set: (value) => { MATTIE.configSet('actorCost', value); },
	},

	resurrectionItemCost: {
		get: () => MATTIE.configGet('resurrectionItemCost', true),
		set: (value) => { MATTIE.configSet('resurrectionItemCost', value); },
	},

	resurrectionItemId: {
		get: () => MATTIE.configGet('resurrectionItemId', 116),
		set: (value) => { MATTIE.configSet('resurrectionItemId', value); },
	},

	resurrectionItemAmount: {
		get: () => MATTIE.configGet('resurrectionItemAmount', 1),
		set: (value) => { MATTIE.configSet('resurrectionItemAmount', value); },
	},

	scaleHp: {
		get: () => MATTIE.configGet('scaleHp', true),
		set: (value) => { MATTIE.configSet('scaleHp', value); },
	},

	hpScaler: {
		get: () => MATTIE.configGet('hpScaler', 1),
		set: (value) => { MATTIE.configSet('hpScaler', value); },
	},

	hpPlayerDivisor: {
		get: () => MATTIE.configGet('hpPlayerDivisor', 1.2),
		set: (value) => { MATTIE.configSet('hpPlayerDivisor', value); },
	},
});

/**
 * @description the function to handle resurrection cost
 * !!Danger!! only edit this if you know what you are doing.
 * @returns {boolean}
 */
MATTIE.multiplayer.config.scaling.resurrectionCost = () => {
	if (!MATTIE.multiplayer.config.scaling.resurrectionHasCost) return true;
	const item = $dataItems[MATTIE.multiplayer.config.scaling.resurrectionItemId];
	const itemsNum = $gameParty.numItems(item);
	let hasCost = true;

	if (MATTIE.multiplayer.config.scaling.resurrectionItemCost) {
		if (itemsNum < MATTIE.multiplayer.config.scaling.resurrectionItemAmount) {
			hasCost = false;
		}
	}

	if (MATTIE.multiplayer.config.scaling.resurrectionActorCost) {
		if ($gameParty.battleMembers().length - 1 < MATTIE.multiplayer.config.scaling.actorCost) {
			hasCost = false;
		}
	}

	if (!hasCost) return false;
	if (MATTIE.multiplayer.config.scaling.resurrectionActorCost) {
		for (let index = 1; index < MATTIE.multiplayer.config.scaling.actorCost + 1; index++) {
			const element = $gameParty.battleMembers()[index];
			$gameParty.removeActor(element.actorId());
		}
	}
	if (MATTIE.multiplayer.config.scaling.resurrectionItemCost) $gameParty.loseItem(item, MATTIE.multiplayer.config.scaling.resurrectionItemAmount);

	return true;
};

/**
 * @description the function to scale hp
 * @returns {number} the scaler for the enemies' hp
 * !!DANGER!! only edit this if you know what you are doing
 */
MATTIE.multiplayer.config.scaling.hpScaling = () => {
	if (!MATTIE.multiplayer.config.scaling.scaleHp) return MATTIE.multiplayer.config.scaling.hpScaler;
	const totalCombatants = $gameTroop.totalCombatants();
	const playerScaler = totalCombatants > 1 ? totalCombatants / MATTIE.multiplayer.config.scaling.hpPlayerDivisor : 1;
	return (playerScaler * MATTIE.multiplayer.config.scaling.hpScaler);
};

//---------------------------------------------------------
// MISC
//---------------------------------------------------------

/**
 * @description whether body blocking is enabled or not
 * @default false
 */
MATTIE.multiplayer.config.scaling.bodyBlocking;

Object.defineProperties(MATTIE.multiplayer.config.scaling, {

	bodyBlocking: {
		get: () => MATTIE.configGet('bodyBlocking', false),
		set: (value) => { MATTIE.configSet('bodyBlocking', value); },
	},
});

/** @description the base function to check the passage of the game map */
MATTIE.multiplayer.config.scaling.checkPassage = Game_Map.prototype.checkPassage;
/**
 * @description override the checkpassage function to turn on body blocking.
 * !!DANGER!! Only edit this if you know what you are doing
 * @param {number} x the x cord
 * @param {number} y the y cord
 * @param {number} bit idk
 * @returns {boolean} whether the map is passable at the point
 *
 */
Game_Map.prototype.checkPassage = function (x, y, bit) {
	const val = MATTIE.multiplayer.config.scaling.checkPassage.call(this, x, y, bit);
	if (MATTIE.multiplayer.config.scaling.bodyBlocking) {
		const netCont = MATTIE.multiplayer.getCurrentNetController();
		const playerIds = Object.keys(netCont.netPlayers);
		for (let index = 0; index < playerIds.length; index++) {
			/** @type {PlayerModel} */
			const netPlayer = netCont.netPlayers[playerIds[index]];
			if (netPlayer.$gamePlayer.x === x && netPlayer.$gamePlayer.y === y) return false;
		}
	}

	return val;
};

/**
 * @description override the game enemy setup function to mutliply the hp and mp by the scaler
 * !!DANGER!! don't edit this unless you know what your doing.
 */
MATTIE_RPG.Game_Enemy_Setup = Game_Enemy.prototype.setup;
Game_Enemy.prototype.setup = function (enemyId, x, y) {
	MATTIE_RPG.Game_Enemy_Setup.call(this, enemyId, x, y);

	const baseHp = this.mhp;
	const baseParam = this.param;
	console.log(this.mhp);

	this.param = function (paramId) {
		if (paramId === 0) {
			// max HP
			return baseHp * MATTIE.multiplayer.config.scaling.hpScaling();
		}
		return baseParam.call(this, paramId);
	};

	setTimeout(() => {
		console.log(this.mhp);
	}, 500);

	this.recoverAll();
};

//---------------------------------------------------------
// Client Side Configs
//---------------------------------------------------------

/**
 * @description whether the menu to display what party the player is currently viewing should display
 * @default true
 */
MATTIE.multiplayer.config.showViewingMenu;

/**
 * @description whether the menu to display number of allies in the current fight should display
 * @default true
 */
MATTIE.multiplayer.config.showAlliesMenu;

Object.defineProperties(MATTIE.multiplayer.config, {

	showViewingMenu: {
		get: () => MATTIE.configGet('showViewingMenu', true),
		set: (value) => { MATTIE.configSet('showViewingMenu', value); },
	},

	showAlliesMenu: {
		get: () => MATTIE.configGet('showAlliesMenu', true),
		set: (value) => { MATTIE.configSet('showAlliesMenu', value); },
	},
});
