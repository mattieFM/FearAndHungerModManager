var i = 1;
Input.addKeyBind('1', ()=>{
    
    let lastBattleMembers = Game_Party.prototype.battleMembers;
    Game_Party.prototype.battleMembers = function() {
        let val = lastBattleMembers.call(this);
        val[0]= $gameActors.actor(i)
        val[1]= $gameActors.actor(i)
        val[2]= $gameActors.actor(i)
        val[3]= $gameActors.actor(i)
        
        return val;
    };
    i++;
}, "change actor");