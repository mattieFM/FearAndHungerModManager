var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}

/** the commands that should be sent over the net controller */
MATTIE.multiplayer.enabledNetCommands = [
    205, //set movement route
    //117, //common events. We will likely need to do more than just forward this. probs some filtering and stuff
    601, //battle win //send
    602, //battle escape //send?
    603, //battle loss //interpret
    313, //change state //interpret
    331, //change enemy hp //send?
    //set event location
    333, //change enemy state //send?
    334, //enemy recover all //send?
    335, //enemy appear //send?
    336, //enemy transform //send?
    353, //game over //interpret
    //355, //scripts //interpret?
    //356, //plugin commands //interpret?

]


MATTIE.RPG.Game_InterpreterExecuteCommand = Game_Interpreter.prototype.executeCommand;

Game_Interpreter.prototype.executeCommand = function () {
    let cmd = this.currentCommand();
    
    let returnVal = MATTIE.RPG.Game_InterpreterExecuteCommand.call(this);
    if(cmd){
        cmd.eventId = this.eventId();
        if(cmd.code)
        if(MATTIE.multiplayer.enabledNetCommands.includes(cmd.code)){
            if(MATTIE.multiplayer.devTools.cmdLogger) MATTIE.multiplayer.devTools.slowLog(cmd);
            const netController = MATTIE.multiplayer.getCurrentNetController();
            switch (cmd.code) {
                
                case 205: //set movement route
                    if(cmd.parameters[0] >= 0) { //not targeting $gamePlayer
                        console.log(this.eventId())
                        console.log(`set movement route emitted`);
                        if(MATTIE.multiplayer.isActive)
                        netController.emitCommandEvent(cmd)
                    }
                    break;
            
                default:
                    break;
            }
            
        
        }
    }
    
    return returnVal;
}


MATTIE.multiplayer.runGameCmd = function(cmd){
    if (MATTIE.multiplayer._interpreter) {
        if (!MATTIE.multiplayer._interpreter.isRunning()) {
            MATTIE.multiplayer._interpreter.setup(this.list(), this._eventId);
        }
        MATTIE.multiplayer._interpreter.update();
    }
}

Game_Interpreter.prototype.executeCommandFromParam = function(cmd) {
    console.log(cmd)
    this._x = cmd.x;
    this._y = cmd.y;
    this._realX = cmd.realX
    this._realY = cmd.realY
    let params = cmd.parameters;
    $gameMap.refreshIfNeeded();
    
    let _character = $gameMap.event(params[0])
    this._character = _character;
    console.log(_character)
    if (_character) {
        _character.forceMoveRoute(params[1]);
        if (params[1].wait) {
            this.setWaitMode('route');
        }
    }
    return true;
};

