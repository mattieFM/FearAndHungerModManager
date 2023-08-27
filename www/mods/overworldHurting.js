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
                return entry.code == MATTIE.static.rpg.battleProcessingId;
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
    let gameTroop = $dataTroops[battleEvent.parameters[1]];
    gameTroop.members[parseInt(Math.random() * gameTroop.members.length)].hidden = true
});