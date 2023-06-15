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

let eventAndSwitchEmitterInit = function () {
    MATTIE.RPG.sceneMapOnStartEvent = Game_Player.prototype.startMapEvent;
    Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
    if (!$gameMap.isEventRunning()) {
        $gameMap.eventsXy(x, y).forEach(function(event) {
            if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
                if(MATTIE.multiplayer.devTools.eventLogger)console.info(`Event Code: ${event.eventId()} triggered`)
                if(MATTIE.multiplayer.devTools.eventLogger)console.info(`Event List: ${JSON.stringify(event.list())} triggered`)
                event.start();
            }
        });
        }
        

    }


    MATTIE.RPG.gameSwitchSetVal = Game_Switches.prototype.setValue;

    Game_Switches.prototype.setValue = function(id,val,skipEvent=false) {
        let i = id;
        MATTIE.RPG.gameSwitchSetVal.call(this,id,val);
        if(i !== 719 && i !== 729 && i !== 695 && i !== 247 && i !== 2434 && i !== 107 && i !== 106 && i !== 200 && i !== 246 && i !== 816)
            if(!skipEvent)
            if(MATTIE.multiplayer.devTools.eventLogger){
                let obj = {}
                obj.i = i;
                obj.b = val;
                obj.s = false;
                let netController = MATTIE.multiplayer.getCurrentNetController();
                netController.emitSwitchEvent(obj);
                console.log(`Game Switch ${i} set to ${val}`)
        }
    }

    // Control Self Switch
    Game_Interpreter.prototype.command123 = function(shouldSkip=false) {
        if (this._eventId > 0) {
            var key = [this._mapId, this._eventId, this._params[0]];
            $gameSelfSwitches.setValue(key, this._params[1] === 0);
            if(MATTIE.multiplayer.devTools.eventLogger && !shouldSkip){
                let obj = {}
                obj.i = key;
                obj.b =this._params[1] === 0;
                obj.s = true;
                let netController = MATTIE.multiplayer.getCurrentNetController();
                netController.emitSwitchEvent(obj);
                console.log(`Game Self Switch ${key} set to ${this._params[1] === 0}`)
            }
        }
        return true;
};
}

//override the on map event start event


//commands to ignore 
// if(methodName !== "command111" && methodName !== "command411" && methodName !== "command122" && methodName !== "command356" && methodName !== "command230" && methodName !== "command108" && methodName !== "command313" && methodName !== "command121" && methodName !== "command355" && methodName !== "command117" && methodName !== "command205" && methodName !== "command322" && methodName !== "command205" && methodName !== "command322"  && methodName !== "command223"  && methodName !== "command250"  && methodName !== "command312"  && methodName !== "command315")
//             console.log(methodName)

// // If Win
// Game_Interpreter.prototype.command601 = function() {
//     if (this._branch[this._indent] !== 0) {
//         this.skipBranch();
//     }
//     return true;
// };

// // If Escape
// Game_Interpreter.prototype.command602 = function() {
//     if (this._branch[this._indent] !== 1) {
//         this.skipBranch();
//     }
//     return true;
// };

// // If Lose
// Game_Interpreter.prototype.command603 = function() {
//     if (this._branch[this._indent] !== 2) {
//         this.skipBranch();
//     }
//     return true;
// };

// // Common Event
// Game_Interpreter.prototype.command117 = function() {
//     var commonEvent = $dataCommonEvents[this._params[0]];
//     if (commonEvent) {
//         var eventId = this.isOnCurrentMap() ? this._eventId : 0;
//         this.setupChild(commonEvent.list, eventId);
//     }
//     return true;
// };



// // Control Variables
// Game_Interpreter.prototype.command122 = function() {
//     var value = 0;
//     switch (this._params[3]) { // Operand
//         case 0: // Constant
//             value = this._params[4];
//             break;
//         case 1: // Variable
//             value = $gameVariables.value(this._params[4]);
//             break;
//         case 2: // Random
//             value = this._params[5] - this._params[4] + 1;
//             for (var i = this._params[0]; i <= this._params[1]; i++) {
//                 this.operateVariable(i, this._params[2], this._params[4] + Math.randomInt(value));
//             }
//             return true;
//             break;
//         case 3: // Game Data
//             value = this.gameDataOperand(this._params[4], this._params[5], this._params[6]);
//             break;
//         case 4: // Script
//             value = eval(this._params[4]);
//             break;
//     }
//     for (var i = this._params[0]; i <= this._params[1]; i++) {
//         this.operateVariable(i, this._params[2], value);
//     }
//     return true;
// };




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

//game switches 
Game_Interpreter.prototype.command121 = function() {
    for (var i = this._params[0]; i <= this._params[1]; i++) {
        $gameSwitches.setValue(i, this._params[2] === 0,this._isParallel);
    }
    return true;
};

MATTIE.RPG.Game_InterpreterInitFunc = Game_Interpreter.prototype.initialize;
Game_Interpreter.prototype.initialize = function(depth) {
    MATTIE.RPG.Game_InterpreterInitFunc.call(this, depth)
    this._isParallel = false;
};

eventAndSwitchEmitterInit();