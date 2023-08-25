var MATTIE = MATTIE || {};
MATTIE.static = MATTIE.static || {};



DataManager.changeActivationCondition(MATTIE.static.skills.hurting,0);
DataManager.setCallbackOnObj(MATTIE.static.skills.hurting, ()=>{
    let x = $gamePlayer._x;
    let y = $gamePlayer._y;
    let dist = Infinity;
    /** @type {Game_Event} */
    let closest = null;
    $gameMap.events().forEach((event)=>{
        if(event.page())
        if(event.page().list){
            let isEnemy = event.page().list.some(entry=>{
                return entry.code == MATTIE.static.rpg.battleProcessingId
            });
            console.log(isEnemy);
            if(isEnemy){
                let thisDist = Math.sqrt((event._x - x)**2 + (event._y - y)**2);
                if(thisDist < dist){
                    dist = thisDist;
                    closest = event;
                }
            }
            
        }
    })
    
    function getFirstBattleEvent() {
        let list = closest.page().list;
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if(element.code == MATTIE.static.rpg.battleProcessingId) return element
            
        } 
    }
    let battleEvent = getFirstBattleEvent();
    console.log(battleEvent);
    console.log(battleEvent.parameters[1]);
    let gameTroop = $dataTroops[battleEvent.parameters[1]];
      /**@type {Game_Enemy} */
    let enemies = [];
    gameTroop.members.forEach(function(member) {
        if ($dataEnemies[member.enemyId]) {
            var enemyId = member.enemyId;
            var enemy = new Game_Enemy(enemyId, x, y);
            enemies.push(enemy);
            enemy.die();
            enemy.addState($dataStates[11]);
            console.log(enemy.enemy());
            //this does work to find the right enemy, but wtf do I do form here.
            //somehow we need to affect the troop and make the troop dead, but I don't know how that works
        }
    }, this);

  
    //enemies[Math.random() * enemies.length].setHp(0)
    console.log(gameTroop);
});