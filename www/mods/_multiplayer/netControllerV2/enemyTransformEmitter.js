
var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.multiplayer.enemyCommandEmitter = MATTIE.multiplayer.enemyCommandEmitter || {}

// Enemy Transform emitter
MATTIE.multiplayer.enemyCommandEmitter.command336 = Game_Interpreter.prototype.command336;
Game_Interpreter.prototype.command336 = function() {
    let val = MATTIE.multiplayer.enemyCommandEmitter.command336.call(this);
    let enemyIndex = this._params[0];
    let transformIndex = this._params[1];
    MATTIE.multiplayer.getCurrentNetController().emitTransformEvent(enemyIndex, transformIndex);
    return val;
};


// Enemy Appear emitter
MATTIE.multiplayer.enemyCommandEmitter.command335 = Game_Interpreter.prototype.command335;
Game_Interpreter.prototype.command335 = function() {
    let val = MATTIE.multiplayer.enemyCommandEmitter.command335.call(this);
    let eventId = this._params[0];
    MATTIE.multiplayer.getCurrentNetController().emitAppearEnemyEvent(eventId);
    return val;
};

// Change Enemy State
MATTIE.multiplayer.enemyCommandEmitter.command333 = Game_Interpreter.prototype.command333;
Game_Interpreter.prototype.command333 = function() {
    let val = MATTIE.multiplayer.enemyCommandEmitter.command333.call(this);
    let enemyIndex =this._params[0]; //int
    let addingState = this._params[1]==0; //bool is this adding or removing
    let stateID = this._params[2]; //int
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
        $gameTroop.makeUniqueNames();
    }.bind(this));
}

/**
 * @description appear an enemy
 * @param {*} index index of the enemy to appear
 */
MATTIE.multiplayer.enemyCommandEmitter.appearEnemy = function(index){
    Game_Interpreter.prototype.iterateEnemyIndex(index, function(enemy) {
        enemy.appear();
        $gameTroop.makeUniqueNames();
    }.bind(this));
    return true;
}


MATTIE.multiplayer.enemyCommandEmitter.stateChange = function(enemyIndex, addState, stateId){
    Game_Interpreter.prototype.iterateEnemyIndex(enemyIndex, function(enemy) {
        var alreadyDead = enemy.isDead();
        if (addState) {
            enemy.addState(stateId);
        } else {
            enemy.removeState(stateId);
        }
        if (enemy.isDead() && !alreadyDead) {
            enemy.performCollapse();
        }
        enemy.clearResult();
    }.bind(this));
}

