/**
 * @description the main randomizer namespace for higher item counts mod
 * contains all methods used by the higher item counts mod
 * @namespace MATTIE.higherItemCounts
 * */
MATTIE.higherItemCounts = MATTIE.higherItemCounts || {};

/**
 * @description Contains all configuration settings for the higher item counts mod.
 * @namespace MATTIE.higherItemCounts.config
 * */
MATTIE.higherItemCounts.config = {};

/**
 * @description this is how much the original item limit will be multiplied by,
 *  for instance at 10 the item limit of 99 is multiplied by 10 and thus 990 is the new item limit
 * @default 10
 */
MATTIE.higherItemCounts.config.scaler = 10;

/*:
 * @target MV MZ
 * @plugindesc Set max inventory stack size to 9.
 * @author Caethyril
 * @url https://forums.rpgmakerweb.com/threads/160268/
 * @help Free to use and/or modify for any project, no credit required.
 */
// Override
Game_Party.prototype.maxItems = function (item) {
	return 100 * MATTIE.higherItemCounts.config.scaler; // originally 99
};
