var MATTIE = MATTIE || {};
MATTIE.troopAPI = MATTIE.troopAPI || {};
MATTIE.troopAPI.config = MATTIE.troopAPI.config || {};


//--------------------------------------
//Game_Troop overrides
//--------------------------------------


//override initialization and setup methods
MATTIE_RPG.TroopApi_Game_Troop_Initialize = Game_Troop.prototype.initialize;
Game_Troop.prototype.initialize = function() {
    MATTIE_RPG.TroopApi_Game_Troop_Initialize.call(this);
    /** @type {MATTIE.troopAPI.runtimeTroop[]} an array of all additional troops */
    this._additionalTroops = [];
};
MATTIE_RPG.TroopApi_Game_Troop_Setup = Game_Troop.prototype.setup;
Game_Troop.prototype.setup = function(troopId){
    MATTIE_RPG.TroopApi_Game_Troop_Setup.call(this,troopId)
    /** @type {MATTIE.troopAPI.runtimeTroop[]} an array of all additional troops */
    this._additionalTroops = [];
}

/** 
 * @description a method to return the members of this troop without adding any additional members from other troops that my be present 
 * @returns {Game_Enemy[]} an array of all game enemies in this troop
 * 
*/
Game_Troop.prototype.baseMembers = function(){
    return this._enemies;
}

/** 
 * @description override the members function to include all additional members of troops that may be present
 * @returns {Game_Enemy[]} an array of all game enemies present in this combat
 * 
 * */
Game_Troop.prototype.members = function(){
    let members = this._enemies;
    for (let index = 0; index < this._additionalTroops.length; index++) {
        const additionalTroop = this._additionalTroops[index];
        members = members.concat(additionalTroop.baseMembers());
    }
    return members;
}

/** 
 * @description add a troop to this object's additional troops array  
 * @param {MATTIE.troopAPI.runtimeTroop} troop the troop to add 
 * 
*/
Game_Troop.prototype.addRunTimeTroop = function(troop){
    this._additionalTroops.push(troop);
}

/**
 * @description override the setup battle event to also setup battle events of all additional troops
 */
MATTIE_RPG.TroopApi_Game_Troop_Setup_Battle_Event = Game_Troop.prototype.setupBattleEvent;
Game_Troop.prototype.setupBattleEvent = function() {
    MATTIE_RPG.TroopApi_Game_Troop_Setup_Battle_Event.call(this);
    for (let index = 0; index < this._additionalTroops.length; index++) {
        const additionalTroop = this._additionalTroops[index];
        additionalTroop.setupBattleEvent();
    }
}


/**
 * @description override the setup battle event to also setup battle events of all additional troops
 */
MATTIE_RPG.TroopApi_Game_Troop_UpdateInterpreter = Game_Troop.prototype.updateInterpreter;
Game_Troop.prototype.updateInterpreter = function() {
    MATTIE_RPG.TroopApi_Game_Troop_UpdateInterpreter.call(this);
    for (let index = 0; index < this._additionalTroops.length; index++) {
        const additionalTroop = this._additionalTroops[index];
        additionalTroop.updateInterpreter();
    }
}

/** @description  the game troops function to check conditionals */
MATTIE_RPG.TroopApi_Game_Troop_Meets_Conditions = Game_Troop.prototype.meetsConditions;
/** @description the game troops function to check conditionals, override the c.enemy valid to use proper troop */
Game_Troop.prototype.meetsConditions = function(page) {
    
    var c = page.conditions;
    let cEnemyValid = c.enemyValid;
    if (c.enemyValid) {
        var enemy = this.baseMembers()[c.enemyIndex];
        if (!enemy || enemy.hpRate() * 100 > c.enemyHp) {
            return false;
        }
        c.enemyValid = false;
    }
    
    let returnVal = MATTIE_RPG.TroopApi_Game_Troop_Meets_Conditions.call(this,page);
    c.enemyValid = cEnemyValid;
    return returnVal;
};


//--------------------------------------
//Run Time Troop Class
//--------------------------------------

MATTIE.troopAPI.runtimeTroop = function() {
    this.initialize.apply(this, arguments);
}

MATTIE.troopAPI.runtimeTroop.prototype = Object.create(Game_Troop.prototype);
MATTIE.troopAPI.runtimeTroop.prototype.constructor = MATTIE.troopAPI.runtimeTroop;

MATTIE.troopAPI.runtimeTroop.prototype.initialize = function(troopId){
    Game_Troop.prototype.initialize.call(this);
    
    this.setup(troopId);
    this._interpreter.setTroop(this);
    /** @description an array of the sprites of the enemies in this troop */
    this._sprites = [];
    
    /** 
     * @description the current battle spriteset
     * @type {Spriteset_Battle} 
     * 
    */
    this.spriteSet = SceneManager._scene._spriteset;
}

MATTIE.troopAPI.runtimeTroop.prototype.sprites = function(){
    return this._sprites;
}

MATTIE.troopAPI.runtimeTroop.prototype.addSpritesToCurrentBattleSet = function(){
    let members = this.baseMembers()
    console.log(members)
    for (let index = 0; index < members.length; index++) {
        console.log("tried to add")
        console.log( this.spriteSet)
        /** @type {Game_Enemy} */
        const gameEnemy = members[index];
        this.spriteSet.addAdditionalEnemy(gameEnemy);
        this._sprites.push(gameEnemy);
        this.spriteSet.visualSort();
        
    }
}

MATTIE.troopAPI.runtimeTroop.prototype.setupBattleEvent = function() {
    Game_Troop.prototype.setupBattleEvent.call(this);
    //this._interpreter.setTroop(this);
};

MATTIE.troopAPI.runtimeTroop.prototype.spawn = function(){
    if($gameParty.inBattle()){ //check if the game party is in battler
        if($gameTroop){ //check if there is a current troop
            this.setupBattleEvent(); //setup battle event 
            $gameTroop.addRunTimeTroop(this); //pass this runtime troop to the active troop
            this.addSpritesToCurrentBattleSet();
            this._interpreter.setTroop(this);
        }

    }
}

//--------------------------------------
//game interpreter overrides 
//--------------------------------------

/** 
 * @description set the target troop of this interpreter 
 * if this is not set the game interpreter will target $gameTroop instead
 * @param {Game_Troop} gameTroop
 * */
Game_Interpreter.prototype.setTroop = function(gameTroop){
    console.log("set troop" + gameTroop);
    this.$gameTroop = gameTroop
}

/**
 * @description get the game troop of this interpreter or global if not set
 * @returns {Game_Troop} the normal game troop or the current game troop
 */
Game_Interpreter.prototype.getTroop = function(){
    console.log(this.$gameTroop? "exists":"does not exist");
    return this.$gameTroop || $gameTroop;
}

/**
 *  @description iterate enemy index of local troop only 
 * 
 * */
Game_Interpreter.prototype.iterateEnemyIndex = function(param, callback) {
    console.log(this);
    if (param < 0) {
        this.getTroop().baseMembers().forEach(callback);
    } else {
        var enemy = this.getTroop().baseMembers()[param];
        if (enemy) {
            callback(enemy);
        }
    }
};

/*** @description the game interpreter's conditional branch*/
MATTIE_RPG.TroopApi_Game_Interpreter_Command111 = Game_Interpreter.prototype.command111;
/**
 * @description the game interpreters conditional branch
 * we are overriding the enemy case to use the proper troop and leaving the rest the same
 * @returns {boolean} sucsess
 */
Game_Interpreter.prototype.command111 = function (){
    switch(this._params[0]){
        case 5:  // Enemy
            var enemy = this.getTroop().baseMembers()[this._params[1]];
            if (enemy) {
                switch (this._params[2]) {
                    case 0:  // Appeared
                        result = enemy.isAlive();
                        break;
                    case 1:  // State
                        result = enemy.isStateAffected(this._params[3]);
                        break;
                }
            }
            this._branch[this._indent] = result;
            if (this._branch[this._indent] === false) {
                this.skipBranch();
            }
            return true;
            break;
        default:
            return MATTIE_RPG.TroopApi_Game_Interpreter_Command111.call(this);
            break;
    }
    return MATTIE_RPG.TroopApi_Game_Interpreter_Command111.call(this);
    
}

/**
 * @description the enemy appear command, overridden to use correct troop
 * @returns {boolean} was operation successful (always true)
 */
Game_Interpreter.prototype.command335 = function() {
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        enemy.appear();
        this.getTroop().makeUniqueNames();
    }.bind(this));
    return true;
};

/**
 * @description the enemy transform command, overridden to use correct troop
 * @returns {boolean} was operation successful (always true)
 */
Game_Interpreter.prototype.command336 = function() {
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        enemy.transform(this._params[1]);
        this.getTroop().makeUniqueNames();
    }.bind(this));
    return true;
};



/** 
 * @description controls the padding on the left and right of the screen
 * @default .1, 10% on both sides so 20%
 */
MATTIE.troopAPI.config.screenWidthPadding = .1; 
/**
 * @description add an additional enemy to the battle enemies sprites at runtime
 * @param {Game_Enemy} gameEnemy 
 * @returns {Sprite} pixi sprite of the new enemy
 */
Spriteset_Battle.prototype.addAdditionalEnemy = function(gameEnemy) {
    if(!this.additionalEnemySprites) this.additionalEnemySprites = [];
    var sprite =  new Sprite_Enemy(gameEnemy)
    this._battleField.addChild(sprite);
    this.additionalEnemySprites.push(sprite);
    
    return sprite;
};

/**
 * @description try to space out the additional enemies as much as possible
 */
Spriteset_Battle.prototype.refreshSpacing = function(shouldAffectBase = false) {
    let dict = this.additionalEnemyTroops;
    if(shouldAffectBase)
    dict[-1] = this._enemySprites;

    let keys = Object.keys(dict);
    let minX = -(Graphics.width/8)
    let maxX = (Graphics.width/8)
    let v = maxX-minX;
    let bestX = (index=>{
        let t = index/(keys.length-1);
        let x = (minX + v*t); //parametric form in 1d
        return x;
    })
    
    for (let index = 0; index < keys.length; index++) {
        const enemyList = dict[keys[index]]; //a list of sprites
        let xOffset = bestX(index);
        console.log(xOffset)
        
        enemyList.forEach(sprite => {
            if(sprite){
                sprite.x = sprite.x+ xOffset;
                console.log(sprite.x);
                sprite.setHome(sprite.x,Graphics.height/2);
            }
            
        });
        
    }
    
    
    
}


/**
 * @description sort the layers 
 */
Spriteset_Battle.prototype.visualSort = function() {
    let list = this._enemySprites.concat(this.additionalEnemySprites).sort(this.compareEnemySprite.bind(this));
    for (let index = 0; index < list.length; index++) {
        const sprite = list[index];
        this._battleField.removeChild(sprite);
    }
    
    
    for (let index = 0; index < list.length; index++) {
        const sprite = list[index];
        this._battleField.addChild(sprite);
        
    }
}