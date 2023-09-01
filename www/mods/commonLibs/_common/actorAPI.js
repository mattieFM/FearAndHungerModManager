var MATTIE = MATTIE || {};
MATTIE.actorAPI = MATTIE.actorAPI || {};

MATTIE.actorAPI.changeMainChar = function(i){
    let lastBattleMembers = Game_Party.prototype.battleMembers;
    Game_Party.prototype.battleMembers = function() {
        let val = lastBattleMembers.call(this);
        val[0]= $gameActors.actor(i)
        
        return val;
    };
}

// MATTIE.actorAPI.createNewActorFromTroop(troop){
//     let actor = new Game_Actor()
// }