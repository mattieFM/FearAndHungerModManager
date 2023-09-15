
var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.multiplayer.enemyCommandEmitter = MATTIE.multiplayer.enemyCommandEmitter || {}

// Enemy Transform emitter
MATTIE.multiplayer.enemyCommandEmitter.command336 = Game_Interpreter.prototype.command336;
Game_Interpreter.prototype.command336 = function() {
    let enemyIndex = this.getTroop().convertLocalIndexToGlobal(this._params[0]); //int
    let transformIndex = this._params[1];
    let val = MATTIE.multiplayer.enemyCommandEmitter.command336.call(this);
    MATTIE.multiplayer.getCurrentNetController().emitTransformEvent(enemyIndex, transformIndex);
    return val;
};


// Enemy Appear emitter
MATTIE.multiplayer.enemyCommandEmitter.command335 = Game_Interpreter.prototype.command335;
Game_Interpreter.prototype.command335 = function() {
    let eventId = this.getTroop().convertLocalIndexToGlobal(this._params[0]); //int
    let val = MATTIE.multiplayer.enemyCommandEmitter.command335.call(this);
    MATTIE.multiplayer.getCurrentNetController().emitAppearEnemyEvent(eventId);
    return val;
};

// Change Enemy State
MATTIE.multiplayer.enemyCommandEmitter.command333 = Game_Interpreter.prototype.command333
Game_Interpreter.prototype.command333 = function() {
    let enemyIndex = this.getTroop().convertLocalIndexToGlobal(this._params[0]); //int
    let addingState = (this._params[1] === 0); //bool is this adding or removing
    let stateID = this._params[2]; //int
    let val = MATTIE.multiplayer.enemyCommandEmitter.command333.call(this);
    
    MATTIE.multiplayer.getCurrentNetController().emitEnemyStateEvent(enemyIndex, addingState, stateID);
    return val;
};

/**
 * @description transform an enemy
 * @param {*} index index of target enemy
 * @param {*} transformIndex the transform id for it to become
 */
MATTIE.multiplayer.enemyCommandEmitter.transformEnemy = function(index,transformIndex){
    Game_Interpreter.prototype.iterateEnemyIndex(index, function(enemy) {
        enemy.transform(transformIndex);
        this.getTroop().makeUniqueNames();
    }.bind(Game_Interpreter.prototype));
}

/**
 * @description appear an enemy
 * @param {*} index index of the enemy to appear
 */
MATTIE.multiplayer.enemyCommandEmitter.appearEnemy = function(index){
    Game_Interpreter.prototype.iterateEnemyIndex(index, function(enemy) {
        enemy.appear();
        this.getTroop().makeUniqueNames();
    }.bind(Game_Interpreter.prototype));
    return true;
}


MATTIE.multiplayer.enemyCommandEmitter.stateChange = function(enemyIndex, addState, stateId){
    Game_Interpreter.prototype.iterateEnemyIndex(enemyIndex, function(enemy) {
        var alreadyDead = enemy.isDead();
        if (addState) {
            enemy.addState(stateId,true);
        } else {
            enemy.removeState(stateId);
        }
        if (enemy.isDead() && !alreadyDead) {
            enemy.performCollapse();
        }
        enemy.clearResult();
    }.bind(this));
}


//---------------------------------------------
//Game_Battle AddState
//---------------------------------------------

//ensure death states are synced immediately
MATTIE.multiplayer.enemyCommandEmitter.addState = Game_Battler.prototype.addState;
Game_Battler.prototype.addState = function(stateId,ignore=false) {
    MATTIE.multiplayer.enemyCommandEmitter.addState.call(this,stateId);
    if(!ignore)
    if(stateId === Game_Battler.prototype.deathStateId()){
        let enemyIndex = $gameTroop.members().indexOf(this);
        if(enemyIndex > 0){
            let addingState = true; 
            let stateID = Game_Battler.prototype.deathStateId()
            MATTIE.multiplayer.getCurrentNetController().emitEnemyStateEvent(enemyIndex, addingState, stateID);
        }
       
    } //else if (stateId === MATTIE.static.states.resistDeath){ //try 
    //     let enemyIndex = $gameTroop.members().indexOf(this);
    //     if(enemyIndex > 0){
    //         let addingState = true; 
    //         let stateID = Game_Battler.prototype.deathStateId()
    //         MATTIE.multiplayer.getCurrentNetController().emitEnemyStateEvent(enemyIndex, addingState, stateID);
    //     }
    // }
};
