var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.multiplayer.pvp = MATTIE.multiplayer.pvp || {};
/** @description a dictionary with actor id mapped to troopid if there is one applicable */
MATTIE.multiplayer.pvp.supportedActors = {};
MATTIE.multiplayer.pvp.supportedActors[MATTIE.static.actors.mercenaryId] = 67;
MATTIE.multiplayer.pvp.supportedActors[MATTIE.static.actors.knightId] = 119;
MATTIE.multiplayer.pvp.supportedActors[MATTIE.static.actors.darkPriestId] = 69;
MATTIE.multiplayer.pvp.supportedActors[MATTIE.static.actors.outlanderId] = 120;


MATTIE.multiplayer.pvp.inPVP = false;

MATTIE.multiplayer.pvp.PvpController = function () {
    throw new Error('This is a static class');
}

/** @description emit the event to start combat with an id */
MATTIE.multiplayer.pvp.PvpController.emitCombatStartWith = function (id) {
    let netCont = MATTIE.multiplayer.getCurrentNetController();
    netCont.emitPvpEvent(id);
}

/** @description locally start the combat with the player */
MATTIE.multiplayer.pvp.PvpController.startCombatWith = function(id){
    
    let netCont = MATTIE.multiplayer.getCurrentNetController();
   
    MATTIE.multiplayer.pvp.PvpController.setupCombat(netCont.netPlayers[id].memberIds());
    $gameTroop.addIdToCombatArr(netCont.peerId);
    $gameTroop.addIdToCombatArr(id)
    this.onCombatantJoin(netCont.peerId, id);
    MATTIE.multiplayer.pvp.inPVP = true;
    netCont.emitChangeInBattlersEvent({});
    
    
}

/**
 * @description handle events that need to run when a combatant join
 * @param {*} id the peer id of the combatant that join the combat
 */
MATTIE.multiplayer.pvp.PvpController.onCombatantJoin = function(aggressorId, targetId){
    
    let netCont = MATTIE.multiplayer.getCurrentNetController();
    if(netCont.netPlayers[aggressorId]) netCont.netPlayers[aggressorId].addIdToPvp(targetId);
    else netCont.player.addIdToPvp(targetId);
    netCont.netPlayers[targetId].addIdToPvp(aggressorId);
    if(targetId == netCont.peerId || netCont.player.pvpCombatArr.includes(targetId)) 
    {

        //if local player is in the fight with the target or is the target add to combat
        $gameTroop.addIdToCombatArr(aggressorId);
        netCont.player.addIdToPvp(aggressorId);
    } else if(aggressorId == netCont.peerId){
        $gameTroop.addIdToCombatArr(targetId);
        netCont.player.addIdToPvp(targetId);
    }
    netCont.emitChangeInBattlersEvent({});

    
}

/**
 * @description handle events that need to run when a combatant leaves
 * @param {*} id the peer id of the combatant that leaves the combat
 */
MATTIE.multiplayer.pvp.PvpController.onCombatantLeave = function(aggressorId, targetId){
    let netCont = MATTIE.multiplayer.getCurrentNetController();
    if(netCont.netPlayers[aggressorId]) netCont.netPlayers[aggressorId].removeIdFromPvp(targetId);
    else netCont.player.removeIdFromPvp(targetId);
    netCont.netPlayers[targetId].removeIdFromPvp(aggressorId);
    $gameTroop.removeIdFromCombatArr(id);
    netCont.emitChangeInBattlersEvent({});
}

/** @description called when the local player leaves combat */
MATTIE.multiplayer.pvp.PvpController.onSelfLeave = function(){
    
    for (let index = 0; index < netCont.player.pvpCombatArr.length; index++) {
        const element = netCont.player.pvpCombatArr[index];
        $gameTroop.removeIdFromCombatArr(element);
        
    }
    netCont.player.clearPvpArr();
    $gameTroop.removeIdFromCombatArr(netCont.peerId);
    MATTIE.multiplayer.pvp.inPVP = false;
    netCont.emitChangeInBattlersEvent({});
}



/** @description map a actor to a troop id if one exist, else return null */
MATTIE.multiplayer.pvp.PvpController.mapActorToTroop = function(actorId){
    let supportedIds = Object.keys(MATTIE.multiplayer.pvp.supportedActors);
    if(supportedIds.includes(actorId) || supportedIds.includes(actorId.toString())) return MATTIE.multiplayer.pvp.supportedActors[actorId];
    return null;
}

/** @description map troop to an actor if one exists, else return null */
MATTIE.multiplayer.pvp.PvpController.mapTroopToActor = function(troopId){
    let supportedIds = Object.values(MATTIE.multiplayer.pvp.supportedActors);
    let stringIds = [];
    supportedIds.forEach(id=>stringIds.push(id.toString()))
    if(supportedIds.includes(troopId) || supportedIds.includes(troopId.toString()) || stringIds.includes(troopId.toString())){

        return Object.keys(MATTIE.multiplayer.pvp.supportedActors)[stringIds.indexOf(troopId.toString())];
    }
    return null;
}

/**
 * @description setup combat with a set of actors
 * @param {int[]} actorIds an array of actor ids for the combat
 */
MATTIE.multiplayer.pvp.PvpController.setupCombat = function(actorIds){
    console.log(actorIds);
    let troops = [];
    let supportedIds = Object.keys(MATTIE.multiplayer.pvp.supportedActors);
    console.log(supportedIds);
    for (let index = 0; index < actorIds.length; index++) {
        let troopId = this.mapActorToTroop(actorIds[index])
        if(troopId) troops.push(troopId);
    }

    $gameTroop.setupMultiCombat(troops, ()=>{
        //alert("on end")
        console.log("on end");
    },()=>{
        console.log($gameTroop.members())
        $gameTroop.members().forEach(enemy=>{
            /** @type {rm.types.Enemy} */
            let clonedDataEnemy = JsonEx.makeDeepCopy(enemy.enemy());
            clonedDataEnemy.actions = []; //clear all actions so that it can't do shit
            enemy.enemy = function(){
                return clonedDataEnemy;
            }
            if(enemy.name().includes("head") || enemy.name().includes("torso")){
                enemy.addState(MATTIE.static.states.resistDeath) //make torso and head invincible
            } else{
                enemy.setHp(30); //all limbs die in one hit
            }
            enemy.addState(MATTIE.static.states.cantDoShit)
        })  
        $gameTroop.clearAllPages();
    })
}


setTimeout(() => {
    //setup on self leave to call properly
    MATTIE.multiplayer.BattleController.addListener("battleEnd", ()=>MATTIE.multiplayer.pvp.PvpController.onSelfLeave)
}, 5000);

