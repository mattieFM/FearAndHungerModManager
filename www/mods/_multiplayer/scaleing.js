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