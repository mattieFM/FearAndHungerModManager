//a class to override the base Game_Player to emit their inputs for multiplayer
var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.multiplayer.gamePlayer = MATTIE.multiplayer.gamePlayer || {};
MATTIE.RPG = MATTIE.RPG || {};


/**
 * 
 * override all uneccacary methods making them emit events for multiplayer support
 */
MATTIE.multiplayer.gamePlayer.override = function() {
    console.info('--emitter overrides initialized--')

    //override the execute move command
    MATTIE.multiplayer.gamePlayer.executeMove = Game_Player.prototype.executeMove;
    Game_Player.prototype.executeMove = function (direction) {
        MATTIE.multiplayer.gamePlayer.executeMove.call(this, direction);
        if(MATTIE.multiplayer.isClient){
            MATTIE.multiplayer.clientController.emitMoveEvent(direction);
        } else if(MATTIE.multiplayer.isHost){
            MATTIE.multiplayer.hostController.emitMoveEvent(direction);
        }
    }


    //override the update main command to make all netPlayers update at the same time as though they were Game_Player
    MATTIE.RPG.SceneMap_MainUpdate = Scene_Map.prototype.updateMain;
    Scene_Map.prototype.updateMain = function () {
        MATTIE.RPG.SceneMap_MainUpdate.call(this)
        let netController = MATTIE.multiplayer.getCurrentNetController();
            for(key in netController.netPlayers){
                let netPlayer = netController.netPlayers[key];
                let localPlayer = netPlayer.$gamePlayer;
                if(localPlayer){
                    localPlayer.update(SceneManager._scene.isActive());
                }
        }
    }


    //create an objet to sure transfer data
    MATTIE.multiplayer.renderer.currentTransferObj = {};
    
    //override reserve transfer to also store its data in our obj
    MATTIE.RPG.reserveTransfer = Game_Player.prototype.reserveTransfer;
    Game_Player.prototype.reserveTransfer = function(mapId, x, y, d, fadeType){
        MATTIE.RPG.reserveTransfer.call(this, mapId, x, y, d, fadeType);
        if(MATTIE.multiplayer.isActive){
                MATTIE.multiplayer.renderer.currentTransferObj = {};
                MATTIE.multiplayer.renderer.currentTransferObj.transfer = {};
                MATTIE.multiplayer.renderer.currentTransferObj.transfer.x = x;
                MATTIE.multiplayer.renderer.currentTransferObj.transfer.y = y;
                MATTIE.multiplayer.renderer.currentTransferObj.transfer.map = mapId;
        }
    }

    //override performTransfer to emit events with the data we stored
    MATTIE.RPG.performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function(){
        MATTIE.RPG.performTransfer.call(this);
        if(MATTIE.multiplayer.isActive){
            let netController = MATTIE.multiplayer.getCurrentNetController();
            netController.emitTransferEvent(MATTIE.multiplayer.renderer.currentTransferObj)
        }
        
    }

    //override the function that triggers when the scene map is fully loaded
    MATTIE.RPG.sceneMapOnLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function () {
        MATTIE.RPG.sceneMapOnLoaded .call(this);
        if(MATTIE.multiplayer.isActive){
            MATTIE.multiplayer.renderer.currentTransferObj = {};
            MATTIE.multiplayer.renderer.currentTransferObj.transfer = {};
            MATTIE.multiplayer.renderer.currentTransferObj.transfer.x = $gamePlayer.x;
            MATTIE.multiplayer.renderer.currentTransferObj.transfer.y = $gamePlayer.y;
            MATTIE.multiplayer.renderer.currentTransferObj.transfer.map = $gameMap.mapId();
            let netController = MATTIE.multiplayer.getCurrentNetController();

            //handle setting the proper actor id when the player loads into a map 
            //this does also allow the main actor changing if we want
            netController.updatePlayerInfo();
            



            netController.emitTransferEvent( MATTIE.multiplayer.renderer.currentTransferObj)
        }
    }


    //extend the follower change command to emit the event we need
    MATTIE.RPG.partyChangeCommand = Game_Interpreter.prototype.command129;
    Game_Interpreter.prototype.command129 = function (){
            let returnVal = MATTIE.RPG.partyChangeCommand.call(this);
            console.info("follower change event")
            MATTIE.multiplayer.getCurrentNetController().updatePlayerInfo();
            return returnVal;
      
        
       
    }


}






Game_Event.prototype.setupPageSettings = function() {
    var page = this.page();
    var image = page.image;
    if (image.tileId > 0) {
        this.setTileImage(image.tileId);
    } else {
        this.setImage(image.characterName, image.characterIndex);
    }
    if (this._originalDirection !== image.direction) {
        this._originalDirection = image.direction;
        this._prelockDirection = 0;
        this.setDirectionFix(false);
        this.setDirection(image.direction);
    }
    if (this._originalPattern !== image.pattern) {
        this._originalPattern = image.pattern;
        this.setPattern(image.pattern);
    }
    this.setMoveSpeed(page.moveSpeed);
    this.setMoveFrequency(page.moveFrequency);
    this.setPriorityType(page.priorityType);
    this.setWalkAnime(page.walkAnime);
    this.setStepAnime(page.stepAnime);
    this.setDirectionFix(page.directionFix);
    this.setThrough(page.through);
    this.setMoveRoute(page.moveRoute);
    this._moveType = page.moveType;
    this._trigger = page.trigger;
    if (this._trigger === 4) { //trigger 4 is parallel execution mode which will constantly span these events
        this._interpreter = new Game_Interpreter();
        this._interpreter._isParallel = true;
    } else {
        this._interpreter = null;
    }
};

