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
MATTIE.eventAPI.command123 = Game_Interpreter.prototype.command123;
Game_Interpreter.prototype.command123 = function() {
    let val = MATTIE.eventAPI.command123.call(this);
    MATTIE.eventAPI.dataEvents[this._eventId] = $dataMap.events[this._eventId];
    return val;
};

MATTIE.eventAPI.orgEvent = Game_Event.prototype.event;
Game_Event.prototype.event = function() {
    let val = MATTIE.eventAPI.orgEvent.call(this);
    if(!val){
        val = MATTIE.eventAPI.dataEvents[this._eventId];
    }
    return val;
};
// MATTIE.eventAPI.orgSetEventup = Game_Map.prototype.setupEvents;
// Game_Map.prototype.setupEvents = function() {
//     MATTIE.eventAPI.orgSetEventup.call(this);
//     Object.keys(MATTIE.eventAPI.dataEvents).forEach(id => {
//         let element = MATTIE.eventAPI.dataEvents[id];
//         if(element.mapId === $gameMap.mapId()){
//             this._events.push(element);
//             var event = this.createGameEvent();
//             var sprite = this.createCharacterSprite(event);
//             this.addSpriteToTilemap(sprite);
//         }
//     });
   
//     this.refreshTileEvents();
// };


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