var MATTIE = MATTIE || {};
MATTIE.eventAPI = MATTIE.eventAPI || {};
MATTIE.eventAPI.dataEvents = MATTIE.eventAPI.dataEvents || {};
MATTIE.eventAPI.blankEvent = {}
/**
 * 
 * @param {Game_Item} item 
 */
MATTIE.eventAPI.addItemDropToCurrentMap = function(item){
    var event = new MapEvent();
    let itemObj = item.object();
    event.addPage();
    event.data.pages[1].conditions.selfSwitchValid=true;
    event.setImage(0, MATTIE.static.events.images.shiny);
    event.addCommand(0,101,["", 0, 0, 2]);
    event.addCommand(0,401,["There is something shining here...."]);
    event.addCommand(0,101,["", 0, 0, 2]);
    event.addCommand(0,401,["You find... A " + itemObj.name]);
    if(item.isArmor()) event.addCommand(0,128,[itemObj.id,0,0,1]); //give armor
    else if (item.isWeapon()) event.addCommand(0,127,[itemObj.id,0,0,1]); //give weapon
    else event.addCommand(0,126,[itemObj.id,0,0,1]); //give item
    event.addCommand(0,123,["A",0])//set self switch

    event.spawn($gamePlayer.x,$gamePlayer.y);  
}

/**
 * @description create a blank event
 * @returns the id of the event
 */
MATTIE.eventAPI.createBlankEvent = function(){
    var event = new MapEvent();
    event.spawn(1,1);
    return event.data.id;
}

MATTIE.eventAPI.createDataEvent = function(id,name,note,pages,x,y){
    let obj = {}
    obj.id = id;
    obj.name = name;
    obj.note = note;
    obj.pages = pages;
    obj.x = x;
    obj.y = y;
    return obj;
}

MATTIE.eventAPI.orgEvent = Game_Event.prototype.event;
Game_Event.prototype.event = function() {
    let val = MATTIE.eventAPI.orgEvent.call(this);
    if(MATTIE.eventAPI.dataEvents[this._eventId]){
        val = MATTIE.eventAPI.dataEvents[this._eventId];
    } 
    if(!val) val = MATTIE.eventAPI.dataEvents[this._eventId];
    return val;
};

MATTIE.eventAPI.updatePosOfRunTimeEvents = function (){
    let keys = Object.keys(MATTIE.eventAPI.dataEvents);
    for (let index = 0; index < keys.length; index++) {
        /** @type {rm.types.Event} */
        let eventId =keys[index];
        if(MATTIE.eventAPI.dataEvents[eventId]){
            MATTIE.eventAPI.dataEvents[eventId] = $dataMap.events[eventId] ? $dataMap.events[eventId] : MATTIE.eventAPI.dataEvents[eventId];
            let event = $gameMap.event(eventId);
            if(event){
                MATTIE.eventAPI.dataEvents[eventId].x = event.x;
            MATTIE.eventAPI.dataEvents[eventId].y = event.y;
            }
            
        }
        

    }
}

   

MATTIE.eventAPI.updateRunTimeEvents = function(){
    let keys = Object.keys(MATTIE.eventAPI.dataEvents);
    for (let index = 0; index < keys.length; index++) {
        /** @type {rm.types.Event} */
        const dataEvent = MATTIE.eventAPI.dataEvents[keys[index]];
        if(dataEvent.mapId === $gameMap.mapId()){
            if(!$dataMap.events[dataEvent.id]) {
                $dataMap.events[dataEvent.id] = dataEvent;
                let mapEvent = new MapEvent();
                mapEvent.data = dataEvent;
                mapEvent.refresh();
            }
            
                
        }
    }
    $gameMap.refreshTileEvents();
}

MATTIE.eventAPI.ReserveTrasnferOrg = Game_Player.prototype.reserveTransfer;
Game_Player.prototype.reserveTransfer = function(mapId, x, y, d, fadeType){
    MATTIE.eventAPI.ReserveTrasnferOrg.call(this,mapId, x, y, d, fadeType)
    MATTIE.eventAPI.updatePosOfRunTimeEvents();
}

MATTIE.eventAPI.orgSetEventup = Game_Map.prototype.setupEvents;
Game_Map.prototype.setupEvents = function() {
    MATTIE.eventAPI.orgSetEventup.call(this);
    
    MATTIE.eventAPI.updateRunTimeEvents();
    
};


/**
 * @description get a Game event obj from id and map id
 * @param {int} id event id 
 * @param {int} mapId mapid
 * @returns {rm.types.Event} 
 */
MATTIE.eventAPI.getEventOnMap = function(id,mapId){
    return new Promise((res)=>{
        var url = 'data/Map%1.json'.format(mapId.padZero(3));
        var xhr = new XMLHttpRequest();

        xhr.open('GET', url, false);
        xhr.overrideMimeType('application/json');

        xhr.onload = function() {
            if (xhr.status < 400) {
                var mapData = JSON.parse(xhr.responseText);

                if (! (id in mapData.events)){
                    console.error('Error getting event data. Check to make sure an event with that specific id exists on the map.');
                    res(null);
                }
                else {
                    res(mapData.events[id])
                }
                    
            }
        }.bind(this);

        xhr.onerror = function() {
            console.error('Error getting map data. Check to make sure a map with that specific id exists.');
            res(null);
        };

        xhr.send();
    })
    
}

/**
 * @description create an enemy from an existing enemy handling death with a self switch
 * the self switch "A" will be used for the death page
 * the self switch "B" is used to signal if the player is in combat with it or not
 * @param {*} mapId the map of the original enemy
 * @param {*} eventId the id of the original enemy
 * @param {*} alivePageId the alive page of the original enemy
 * @param {*} deadPageId the dead page of the original enemy
 */
MATTIE.eventAPI.createEnemyFromExisting = function(mapId, eventId, alivePageId, deadPageId){
    let enemy = new MapEvent();
    var baseEnemy = new MapEvent();
    baseEnemy.copyActionsFromEventOnMap(eventId,mapId) //create copy of crow mauler obj
    let alivePage = baseEnemy.data.pages[alivePageId];
    let deadPage  = baseEnemy.data.pages[deadPageId];

    enemy.data.pages[0] = alivePage;

    //set up changing self switch on victory
    let indexOfIfWinCmd = enemy.indexOfCommandOnPage(0, MATTIE.static.commands.ifWin);
    let indent = alivePage.list[alivePage.list.length-1].indent+1
    enemy.addCommandAfterIndex(0,indexOfIfWinCmd, enemy.createCommand(MATTIE.static.commands.selfSwitch,["A",0],indent))

    enemy.addPage();
    //set up conditions for death page
    enemy.data.pages[1] = deadPage;
    enemy.data.pages[1].conditions = enemy.setDefaultConditions();
    enemy.data.pages[1].conditions.selfSwitchValid=true;

    enemy.setPersist(true);
    return enemy;
}


MATTIE.eventAPI.removePersistingEvent = function(eventId) {
    delete MATTIE.eventAPI.dataEvents[eventId];
}