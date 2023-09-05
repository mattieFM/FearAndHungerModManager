var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.multiplayer.scaling = MATTIE.multiplayer.scaling || {}



/** 
 * @default 1. 
 * @description the higher this value the later in combat enemies will go.
 * */
MATTIE.multiplayer.scaling.enemyBattleIndexScaler = 1; 
/**
 * @description the formula for where the enemies attack in combat, by default, after one party could've attacked it is the enemies turn, then the rest of the players
 * @param {Game_Battler} battler 
 */
MATTIE.multiplayer.scaling.enemyBattleIndex = (battler)=>((($gameParty.maxBattleMembers() / $gameTroop.totalCombatants())) * (battler.agi/10) * MATTIE.multiplayer.scaling.enemyBattleIndexScaler);


/**
 * @default true.
 * @description whether or not healing whispers gets scaled 
 */
MATTIE.multiplayer.scaling.shouldScaleHealingWhispers = true;
MATTIE.multiplayer.scaling._shouldScaleHealingWhispers = true; //not used for anything right now

/**
 * @description the function to scale healing whispers.
 * @default 1 / number of combatants, so if there are 2 ppl fighting an enemy, this returns .5
 */
MATTIE.multiplayer.scaling.getHealingWhispersScaler = () => (1 / $gameTroop.totalCombatants())

/**
 * @default true, there are other scalers that nerf these abilities to make this fair
 * @description whether party actions, like healing whispers target all parties
 */
MATTIE.multiplayer.scaling.partyActionsTargetAll = true;