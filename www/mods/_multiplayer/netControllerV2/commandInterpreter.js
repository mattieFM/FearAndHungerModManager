var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}

MATTIE.RPG.Game_InterpreterExecuteCommand = Game_Interpreter.prototype.executeCommand;
Game_Interpreter.prototype.executeCommand = function () {
    let cmd = this.currentCommand();
    let index = this._index;
    let returnVal = MATTIE.RPG.Game_InterpreterExecuteCommand.call(this);
    if(cmd){
         cmd.index = index;
        if(cmd.code)
        if(MATTIE.multiplayer.enabledNetCommands.includes(cmd.code)){
            if(MATTIE.multiplayer.cmdLogger) MATTIE.multiplayer.devTools.slowLog(cmd);
            const netController = MATTIE.multiplayer.getCurrentNetController();
            switch (cmd.code) {
                case 205: //set movement route
                    if(cmd.parameters[0] > 0) { //not targeting $gamePlayer
                        console.log(`set movement route emitted`)
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

Game_Interpreter.prototype.executeCommandFromParam = function(command) {
    if (command) {
        this._params = command.parameters;
        this._indent = command.indent;
        var methodName = 'command' + command.code;
        
        if (typeof this[methodName] === 'function') {
            if (!this[methodName]()) {
                return false;
            }
        }
        this._index++;
    } else {
        this.terminate();
    }
    return true;
};

/** the commands that should be sent over the net controller */
MATTIE.multiplayer.enabledNetCommands = [
    205, //set movement route
    //117, //common events. We will likely need to do more than just forward this. probs some filtering and stuff
    601, //battle win //send
    602, //battle escape //send?
    603, //battle loss //interpret
    313, //change state //interpret
    331, //change enemy hp //send?
    333, //change enemy state //send?
    334, //enemy recover all //send?
    335, //enemy appear //send?
    336, //enemy transform //send?
    353, //game over //interpret
    //355, //scripts //interpret?
    //356, //plugin commands //interpret?

]