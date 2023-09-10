var MATTIE = MATTIE || {};
var MATTIE_RPG = MATTIE_RPG || {};

MATTIE.betterCrowMauler = MATTIE.betterCrowMauler || {};
/**
 *  @description the number of milliseconds util it is checked if crow mauler can spawn 
 *  @default 10000
 * */
MATTIE.betterCrowMauler.spawnInterval = 10000;
/**
 *  @description the chance that crow mauler will spawn every interval 
 *  @default .05
 * */
MATTIE.betterCrowMauler.spawnChance = .05;

/**
 *  @description the chance that crow mauler will follow you into the next room
 *  @default .2
 * */
MATTIE.betterCrowMauler.followChance = .15;

/**
 *  @description the chance that crow mauler will despawn when you leave a room
 *  @default .05
 * */
MATTIE.betterCrowMauler.despawnChance = .15;

MATTIE.betterCrowMauler.crowController = function () {
    this.disableBaseCrowMauler();

    /** @description whether this instance of the controller has spawned a crow mauler on this level */
    this.hasSpawned = false;

    /** @description whether this instance of the controller's crow mauler is on screen or not  */
    this.onScreen = false;
    
    /** @description the id of the mapId crow mauler was spawned in last */
    this.mapId = 0;
    /** @type {MapEvent} The current crow obj if spawned*/
    this.self = new MapEvent();

    let prevFunc = Game_Player.prototype.performTransfer;
    let that = this;
    Game_Player.prototype.performTransfer = function() {
        prevFunc.call(this);
        that.onEnterRoom();
    }

    setInterval(() => {
        this.spawnTick();
    }, MATTIE.betterCrowMauler.spawnInterval);
}

/** @description whether this instance's crow mauler is dead */
MATTIE.betterCrowMauler.crowController.prototype.isDead = function(){
    let bool = this.self.checkSelfSwitch("A");
    console.log("isdead: "+bool);
    return bool;
}

/**
 * @description disable crow mauler
 * @todo make sure this works properly
 */
MATTIE.betterCrowMauler.crowController.prototype.disableBaseCrowMauler = function(){
    $gameSwitches.setValue(MATTIE.static.switch.crowMaulerDisabled,true);
}

/**
 * @description the function called every x ms to check if crow mauler should spawn
 */
MATTIE.betterCrowMauler.crowController.prototype.spawnTick = function(){
    if(!this.onScreen && !this.hasSpawned && !this.isDead() && !$gameParty.inBattle() && SceneManager._scene instanceof Scene_Map) this.update();
}


/**
 * @description checks if crow mauler can spawn
 * @returns {boolean}
 */
MATTIE.betterCrowMauler.crowController.prototype.crowCanSpawn = function(){
    return $gameSwitches.value(MATTIE.static.switch.crowMaulerCanSpawn) && !$gameSwitches.value(MATTIE.static.switch.crowMaulerDead);
}

/**
 * @description get all possible entry or exit event tiles in the room
 * @returns an array of every event that has an active transfer event in its list
 */
MATTIE.betterCrowMauler.crowController.prototype.getAllTransferPointsOnMap = function(){
    let arr = $gameMap.events().filter((event)=>{
        if(event.event()){
            let page = event.event().pages[event._pageIndex];
            if(page){
                return page.list.map(cmd=>cmd.code).includes(MATTIE.static.commands.transferId);
            }
            return false
        }
        
        
    })
    return arr
}

/**
 * @description find the closest spawn point to a provided x and y
 * @param {int} x;
 * @param {int} y;
 * @returns {Game_Event} the closest possible spawn point to the players current x and y
 */
MATTIE.betterCrowMauler.crowController.prototype.findClosestSpawnPoint = function(x,y){
    let spawnPoints = this.getAllTransferPointsOnMap();
    let closest = spawnPoints[0];
    if(closest){
        let dist = MATTIE.util.getDist(x,closest.x,y,closest.y);
        for (let index = 1; index < spawnPoints.length; index++) {
            /** @type {Game_Event} */
            const element = spawnPoints[index];
            let thisDist = MATTIE.util.getDist(x,element.x,y,element.y);
            if(thisDist < dist) {
                if(MATTIE.isPassableAnyDir(element)){
                    dist = thisDist;
                closest = element
                }
                
            }
        }
    }
    



    return closest;
}

MATTIE.betterCrowMauler.crowController.prototype.createCrowObj = function(){
    let event = MATTIE.eventAPI.createEnemyFromExisting(53,207,2,9);
    return event;
}

/**
 * @description crow mauler enter the room
 */
MATTIE.betterCrowMauler.crowController.prototype.enter = function(){
    MATTIE.msgAPI.footerMsg("A terrifying presence has entered the room...")
    this.spawn();
}

/**
 * @description spawn the crow mauler event removing the previous one if it exists
 */
MATTIE.betterCrowMauler.crowController.prototype.spawn = function(){
    console.log("spawned")
        if(!this.hasSpawned && !this.isDead() && !$gameParty.inBattle()){
            this.onScreen = true;
            console.log("spawned in if");
            let spot = this.findClosestSpawnPoint($gamePlayer.x, $gamePlayer.y);
            if(spot){
                this.self = this.createCrowObj();
                this.self.spawn(spot.x,spot.y);
            
                this.mapId = $gameMap.mapId();
                this.hasSpawned = true;
            }
           
        }
    
}


/**
 * @description crow mauler follow player from last room to this room
 */
MATTIE.betterCrowMauler.crowController.prototype.follow = function(){
    setTimeout(() => {
        MATTIE.msgAPI.footerMsg("A terrifying presence has followed you into the room...");
    },4000);
    setTimeout(() => 
    {
        this.spawn();
    }, 10000);
    
}

/** 
 * @description checks if the crow mauler can follow the player, if the crow mauler was in the last room and rand chance.
 * 
 * */
MATTIE.betterCrowMauler.crowController.prototype.canFollow = function(){
    return MATTIE.util.randChance(MATTIE.betterCrowMauler.followChance) && (this.mapId === $gameMap.lastMapId());
}


/** 
 * @description checks a random chance to see if the crow should despawn
 * 
 * */
MATTIE.betterCrowMauler.crowController.prototype.shouldDespawn = function(){
    return !this.isDead() && MATTIE.util.randChance(MATTIE.betterCrowMauler.despawnChance);
}



MATTIE.betterCrowMauler.crowController.prototype.despawn = function(){
    if(!this.isDead()){
        this.self.removeThisEvent();
        this.hasSpawned = false;
    }
    
}


MATTIE.betterCrowMauler.crowController.prototype.onEnterRoom = function(){
    if($gameMap.mapId() != this.mapId) this.onScreen = false;
    if(!this.isDead() && !this.onScreen){
        if(this.canFollow()){
            this.follow();
        } else if(this.shouldDespawn()){
            this.despawn();
        }
    }
   
}

MATTIE.betterCrowMauler.crowController.prototype.update = function(){
    console.log("updated")
    if(MATTIE.util.randChance(MATTIE.betterCrowMauler.spawnChance)){
        console.log("entered")
        this.enter();
    }
}