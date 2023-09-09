var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.multiplayer.scaling = MATTIE.multiplayer.scaling || {}


//---------------------------------------------------------
// Enemy Scaling
//---------------------------------------------------------

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


//---------------------------------------------------------
// Healing Whispers Scaling
//---------------------------------------------------------

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




//---------------------------------------------------------
// Resurrection Cost
//---------------------------------------------------------
/**
 * @description whether resurrecting an ally has a cost
 * @default true
 */
MATTIE.multiplayer.scaling.resurrectionHasCost = true;

/**
 * @description whether resurrecting an allies requires necromancy
 * @default false //not implemented yet
 */
MATTIE.multiplayer.scaling.resurrectionNeedsNecromancy = false;

/**
 * @description whether resurrecting an ally requires sacrificing an actor
 * @default false
 */
MATTIE.multiplayer.scaling.resurrectionActorCost = false;

/**
 * @description whether resurrecting an ally has an item cost
 * @default true
 */
MATTIE.multiplayer.scaling.resurrectionItemCost = true;

/**
 * @description the number of actors that must be sacrificed.
 * @default 1
 */
MATTIE.multiplayer.scaling.actorCost = 1;

/**
 * @description the item id of the item that will be consumed to revive someone
 * @default 116, lesser soul
 */
MATTIE.multiplayer.scaling.resurrectionItemId = 116;

/** @description the number of that item that is needed */
MATTIE.multiplayer.scaling.resurrectionItemAmount = 1;

MATTIE.multiplayer.scaling.resurrectionCost = () =>{
    if(!MATTIE.multiplayer.scaling.resurrectionHasCost) return true;
    let item = $dataItems[MATTIE.multiplayer.scaling.resurrectionItemId];
    let itemsNum = $gameParty.numItems(item)
    let hasCost = true


    if(MATTIE.multiplayer.scaling.resurrectionItemCost)
    if(itemsNum < MATTIE.multiplayer.scaling.resurrectionItemAmount){
        hasCost = false
    }

    if(MATTIE.multiplayer.scaling.resurrectionActorCost)
    if($gameParty.battleMembers().length-1 < MATTIE.multiplayer.scaling.actorCost){
        hasCost = false
    }

    if(!hasCost) return false
    if(MATTIE.multiplayer.scaling.resurrectionActorCost)
    for (let index = 1; index < MATTIE.multiplayer.scaling.actorCost+1; index++) {
        const element = $gameParty.battleMembers()[index];
        $gameParty.removeActor(element.actorId());
    }
    if(MATTIE.multiplayer.scaling.resurrectionItemCost)
    $gameParty.loseItem(item,MATTIE.multiplayer.scaling.resurrectionItemAmount);

    return true
}


/**
 * @description this is multiplied by the max hp of all enemies
 * @default 1
 */
MATTIE.multiplayer.scaling.hpScaler = 1;

/**
 * @description when there are more than one player in combat with an enemy, the number of players is divided by this number then the health is multiplied by this.
 * @default 1
 */
MATTIE.multiplayer.scaling.hpPlayerDivisor = 1.5;

/**
 * @description the function to scale hp
 */
MATTIE.multiplayer.scaling.hpScaling = ()=>{
    let totalCombatants = $gameTroop.totalCombatants();
    let playerScaler = totalCombatants > 1 ? totalCombatants / MATTIE.multiplayer.scaling.hpPlayerDivisor : 1
    return (playerScaler * MATTIE.multiplayer.scaling.hpScaler)
    
};


/**
 * @description override the game enemy setup function to mutliply the hp and mp by the scaler
 */
MATTIE_RPG.Game_Enemy_Setup = Game_Enemy.prototype.setup;
Game_Enemy.prototype.setup = function(enemyId, x, y) {
    MATTIE_RPG.Game_Enemy_Setup.call(this,enemyId, x, y);
    this.mhp = this.mhp * MATTIE.multiplayer.scaling.hpScaling();
    this.mmp = this.mmp * MATTIE.multiplayer.scaling.hpScaling();
    this.recoverAll();
};