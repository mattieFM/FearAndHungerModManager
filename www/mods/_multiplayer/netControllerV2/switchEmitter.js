var MATTIE = MATTIE || {};
MATTIE.multiplayer.switchEmitter = {};
MATTIE.multiplayer.switchEmitter.config = {};
MATTIE.multiplayer.switchEmitter.config.maxCps = .5;
//the number of seconds an switch can fire above the max cps before getting silenced
MATTIE.multiplayer.switchEmitter.config.tolerance = 6;




let eventAndSwitchEmitterInit = function () {
    // MATTIE.RPG.sceneMapOnStartEvent = Game_Player.prototype.startMapEvent;
    // Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
    // if (!$gameMap.isEventRunning()) {
    //     $gameMap.eventsXy(x, y).forEach(function(event) {
    //         if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
    //             if(MATTIE.multiplayer.devTools.eventLogger)console.info(`Event Code: ${event.eventId()} triggered`)
    //             if(MATTIE.multiplayer.devTools.eventLogger)console.info(`Event List: ${JSON.stringify(event.list())} triggered`)
    //             event.start();
    //         }
    //     });
    //     }
        

    // }


    // --dont call send parralell events --
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
            console.log("is parallel")
            this._interpreter = new Game_Interpreter();
            this._interpreter._isParallel = true;
        } else {
            this._interpreter = null;
        }
    };



    //override the set var switch command making it work for both saves from my mod and saves from base game. 
    // bassically just silence anything that is sending too much data assuming it is a parellel event
    Game_Interpreter.prototype.command121 = function() {
        if(this.lastTime && !this._isParallel){
            const secSinceLast = ((Date.now() - this.lastTime) / 1000);
            //if command triggers more per second than our limit assume it is a parallel event
            if(secSinceLast < MATTIE.multiplayer.switchEmitter.config.maxCps){
                if(this.tolerance){ this.tolerance++}
                else { this.tolerance = 1};
            
                if(this.tolerance > MATTIE.multiplayer.switchEmitter.config.tolerance){
                    this._isParallel = true;
                    console.info(`a game interpreter was silenced`)
                }
                
                //if it hasnt fired in a long time reset the count
            } else if(secSinceLast > MATTIE.multiplayer.switchEmitter.config.maxCps*3){
                this.tolerance = 0;
            }
    }
        
        for (var i = this._params[0]; i <= this._params[1]; i++) {
            $gameSwitches.setValue(i, this._params[2] === 0,this._isParallel);
        }
        if(!this._isParallel)
        this.lastTime = Date.now();
        return true;
    };
    
    MATTIE.RPG.Game_InterpreterInitFunc = Game_Interpreter.prototype.initialize;
    Game_Interpreter.prototype.initialize = function(depth) {
        MATTIE.RPG.Game_InterpreterInitFunc.call(this, depth)
        this._isParallel = false;
    };


    // -- end dont call send parralell events --







    MATTIE.RPG.gameSwitchSetVal = Game_Switches.prototype.setValue;

    Game_Switches.prototype.setValue = function(id,val,skipEvent=false) {
        let i = id;
        MATTIE.RPG.gameSwitchSetVal.call(this,id,val);
        if(i !== 719 && i !== 729 && i !==815 && i !==814 && i !== 695 && i !== 247 && i !== 2434 && i !== 107 && i !== 106 && i !== 200 && i !== 246 && i !== 816)   
            if(!skipEvent){
                let obj = {}
                obj.i = i;
                obj.b = val;
                obj.s = false;
                let netController = MATTIE.multiplayer.getCurrentNetController();
                if(MATTIE.multiplayer.isActive) 
                netController.emitSwitchEvent(obj);
                if(MATTIE.multiplayer.devTools.eventLogger) console.log(`Game Switch ${i} set to ${val}`);
            }
            
                
        
    }

    // Control Self Switch
    Game_Interpreter.prototype.command123 = function(shouldSkip=false) {
        if (this._eventId > 0) {
            var key = [this._mapId, this._eventId, this._params[0]];
            $gameSelfSwitches.setValue(key, this._params[1] === 0);
            if(!shouldSkip){
                let obj = {}
                obj.i = key;
                obj.b =this._params[1] === 0;
                obj.s = true;
                let netController = MATTIE.multiplayer.getCurrentNetController();
                if(MATTIE.multiplayer.isActive) 
                //netController.emitSwitchEvent(obj);
                if(MATTIE.multiplayer.devTools.eventLogger)
                console.log(`Game Self Switch ${key} set to ${this._params[1] === 0}`);
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
//game switches 


eventAndSwitchEmitterInit();