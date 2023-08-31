var MATTIE = MATTIE || {};
MATTIE.multiplayer.switchEmitter = {};
MATTIE.multiplayer.switchEmitter.config = {};
MATTIE.multiplayer.switchEmitter.config.maxCps = .5;
//the number of seconds an switch can fire above the max cps before getting silenced
MATTIE.multiplayer.switchEmitter.config.tolerance = 6;


MATTIE.multiplayer.ignoredVars = [
    1, //lightswitch
    2, //daynight save
    5, //hp
    6, //max hp
    9, //menu
    10, //daynight
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    27,
    30,
    34,
    35,
    36,
    37,
    38,
    59,
    62,
    63,
    64,
    65,
    66,
    67,
    70,
    71,
    80,
    83,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    96,
    101,
    102,
    103,
    104,
    106,107,108,
    109,
    110,
    11,
    112,
    113,
    114,
    115,
    116,
    117,
    118,
    119,
    120,
    138,
    136,
    138,
    139,
    140,
    141,
    142,
    143,
    144,
    145,
    146,
    147,
    148,
    149,
    150,
    151,152,
    153,155,156,157,158,162,163,165,166,167,204,205,206,207,230,231,229,232,233,234,235,236,237,238,239,240,
    241,242,243,244,245,246,247,248,249,250,261,255,261,262,263,264,265,266,267,268,269,270,271,172,273,274,275,276,277,278,280,
    304,305,306,307,308,309,310,311,312,313,314,314,334,335,336,337,338,339,340,341,342,343,344,345,346,347,348,349,350,
    357,358,359,398,399,400






    
]



let eventAndSwitchEmitterInit = function () {


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
            //console.log("is parallel")
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
        if(!MATTIE.static.switch.ignoredSwitches.includes(id))  
            if(!skipEvent){
                let obj = {}
                obj.i = i;
                obj.b = val;
                obj.s = 0;
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
                obj.s = 1;
                let netController = MATTIE.multiplayer.getCurrentNetController();
                if(MATTIE.multiplayer.isActive) 
                netController.emitSwitchEvent(obj);
                if(MATTIE.multiplayer.devTools.eventLogger)
                console.log(`Game Self Switch ${key} set to ${this._params[1] === 0}`);
            }
        }
        return true;
};

Game_Interpreter.prototype.operateVariable = function(variableId, operationType, value) {
    try {
        var oldValue = $gameVariables.value(variableId);
        switch (operationType) {
        case 0:  // Set
            $gameVariables.setValue(variableId, oldValue = value, this._isParallel);
            break;
        case 1:  // Add
            $gameVariables.setValue(variableId, oldValue + value, this._isParallel);
            break;
        case 2:  // Sub
            $gameVariables.setValue(variableId, oldValue - value, this._isParallel);
            break;
        case 3:  // Mul
            $gameVariables.setValue(variableId, oldValue * value, this._isParallel);
            break;
        case 4:  // Div
            $gameVariables.setValue(variableId, oldValue / value, this._isParallel);
            break;
        case 5:  // Mod
            $gameVariables.setValue(variableId, oldValue % value, this._isParallel);
            break;
        }
    } catch (e) {
        $gameVariables.setValue(variableId, 0);
    }
};


    MATTIE.RPG.gameVarSetVal = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function (id,val, shouldSkip=false) {
        MATTIE.RPG.gameVarSetVal.call(this,id,val)
        if(MATTIE.multiplayer.isActive) {
            if(!MATTIE.multiplayer.ignoredVars.includes(id) && !MATTIE.static.variable.ignoredVars.includes(id)){ //party size check //game timer //fear check
                if(!shouldSkip){
                    let obj = {}
                    obj.i = key;
                    obj.b =val;
                    obj.s = 2;
                    let netController = MATTIE.multiplayer.getCurrentNetController();
                    if(MATTIE.multiplayer.isActive) 
                    netController.emitSwitchEvent(obj);
                    
                    if(MATTIE.multiplayer.devTools.varLogger)
                    console.log(`Game var ${id} set to ${val}`);
                }
            
            }
            
        }
       
    }
}

eventAndSwitchEmitterInit();