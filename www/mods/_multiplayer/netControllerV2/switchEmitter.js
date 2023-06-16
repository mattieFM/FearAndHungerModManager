
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



    MATTIE.RPG.gameSwitchSetVal = Game_Switches.prototype.setValue;

    Game_Switches.prototype.setValue = function(id,val,skipEvent=false) {
        let i = id;
        MATTIE.RPG.gameSwitchSetVal.call(this,id,val);
        if(i !== 719 && i !== 729 && i !== 695 && i !== 247 && i !== 2434 && i !== 107 && i !== 106 && i !== 200 && i !== 246 && i !== 816)
            if(!skipEvent){
                let obj = {}
                obj.i = i;
                obj.b = val;
                obj.s = false;
                let netController = MATTIE.multiplayer.getCurrentNetController();
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
                netController.emitSwitchEvent(obj);
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