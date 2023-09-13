var MATTIE = MATTIE || {};
MATTIE.troopAPI = MATTIE.troopAPI || {};
MATTIE.troopAPI.config = MATTIE.troopAPI.config || {};


//--------------------------------------
//Game_Troop overrides
//--------------------------------------


/** @description the base initalize method for a game troop */
MATTIE_RPG.TroopApi_Game_Troop_Initialize = Game_Troop.prototype.initialize;
/** @description the extended method for inializing a game troop, this also inializeds the .additionalTroops thing that we use later */
Game_Troop.prototype.initialize = function() {
    MATTIE_RPG.TroopApi_Game_Troop_Initialize.call(this);
    /** @type {MATTIE.troopAPI.runtimeTroop[]} an array of all additional troops */
    this._additionalTroops = {};
};

/** @description the base function to setup a game troop */
MATTIE_RPG.TroopApi_Game_Troop_Setup = Game_Troop.prototype.setup;
/**
 * @description the setup function for a game troop, extended to also support offset and additional troops
 * @param {int} troopId the troop id 
 * @param {int} xOffset default 0, offset the entire troop by this amount
 * @param {int} yOffset default 0, offset the entire troop by this amount
 */
Game_Troop.prototype.setup = function(troopId, xOffset =0, yOffset =0){
    MATTIE_RPG.TroopApi_Game_Troop_Setup.call(this,troopId)
    this._interpreter.setTroop(this);
    /** @type {MATTIE.troopAPI.runtimeTroop[]} an array of all additional troops */
    this._additionalTroops = {};
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
Game_Troop.prototype.members = function() {
    let members = this._enemies;
    this.forEachAdditionalTroop((additionalTroop)=>{
        members = members.concat(additionalTroop.baseMembers());
    });
    return members;
}

/** @description proform a callback on all additional troops */
Game_Troop.prototype.forEachAdditionalTroop = function(cb){
    let keys = Object.keys(this._additionalTroops)
    for (let index = 0; index < keys.length; index++) {
        const additionalTroop = this._additionalTroops[keys[index]];
        cb(additionalTroop);
    }
}

/** 
 * @description add a troop to this object's additional troops array  
 * @param {MATTIE.troopAPI.runtimeTroop} troop the troop to add 
 * 
*/
Game_Troop.prototype.addRunTimeTroop = function(troop){
    console.log(troop)
    this._additionalTroops[troop.getMId()] = troop;
    this.makeUniqueNames();
}

/** 
 * @description get the multiplayer troop id of this obj
 * @returns the id 
 * or -1 in the case that it is the global $gameTroop
 * or -2 if not defined and not the global game troop
 * 
*/
Game_Troop.prototype.getMId = function(){
    return this._MTroopId || !(this instanceof MATTIE.troopAPI.runtimeTroop) ? -1 : -2; 
}

/**
 * @description takes a local index for baseMembers() and transforms it into an index for members()
 * @param {*} index the local index of the enemy
 * @returns the new index or the old one if the new one is undefined
 */
Game_Troop.prototype.convertLocalIndexToGlobal = function(index){
    let newIndex = $gameTroop.members().indexOf(index);
    return newIndex > 0 ? newIndex : index;
}

/** @description the base function to setup the battle event of a game troop */
MATTIE_RPG.TroopApi_Game_Troop_Setup_Battle_Event = Game_Troop.prototype.setupBattleEvent;
/** 
 * @description override the setup battle event to also setup battle events of all additional troops
 */
Game_Troop.prototype.setupBattleEvent = function() {
    MATTIE_RPG.TroopApi_Game_Troop_Setup_Battle_Event.call(this);
    this.forEachAdditionalTroop((additionalTroop)=>{
        additionalTroop.setupBattleEvent();
    });
}



/** @description the base function to update the interpreter of a game troop */
MATTIE_RPG.TroopApi_Game_Troop_UpdateInterpreter = Game_Troop.prototype.updateInterpreter;
/**
 * @description override the update interpreter to also update battle events of all additional troops
 */
Game_Troop.prototype.updateInterpreter = function() {
    MATTIE_RPG.TroopApi_Game_Troop_UpdateInterpreter.call(this);
    for (let index = 0; index < this._additionalTroops.length; index++) {
        additionalTroop.updateInterpreter();
    }
}

/** @description  the game troops function to check conditionals */
MATTIE_RPG.TroopApi_Game_Troop_Meets_Conditions = Game_Troop.prototype.meetsConditions;
/** 
 * @description the game troops function to check conditionals, override the c.enemy valid to use proper troop 
 * @param {} page the page of the game troop, not the id
 */
Game_Troop.prototype.meetsConditions = function(page) {
    
    var c = page.conditions;
    if (c.enemyValid) {
        var enemy = this.baseMembers()[c.enemyIndex];
        if (!enemy || enemy.hpRate() * 100 > c.enemyHp) {
            return false;
        }
    }
    
    let returnVal = MATTIE_RPG.TroopApi_Game_Troop_Meets_Conditions.call(this,page);
    return returnVal;
};


//--------------------------------------
//Run Time Troop Class
//--------------------------------------

/** 
 * @description a class that handles adding troops to the current combat at runtime 
 * @param {int} troopId, the id of the troop this class represents
 * @param {int} xOffset, screen x offset for entire troop
 * @param {int} yOffset, screen y offset for entire troop
 * @returns {MATTIE.troopAPI.runtimeTroop}
 * */
MATTIE.troopAPI.runtimeTroop = function() {
    this.initialize.apply(this, arguments);
}

MATTIE.troopAPI.runtimeTroop.prototype = Object.create(Game_Troop.prototype);
MATTIE.troopAPI.runtimeTroop.prototype.constructor = MATTIE.troopAPI.runtimeTroop;

/** 
 * @description the initialize method for a runtime troop. This sets up all values we might need.
 * @param {int} troopId, the id of the troop this class represents
 * @param {int} xOffset, screen x offset for entire troop
 * @param {int} yOffset, screen y offset for entire troop
 * @returns {MATTIE.troopAPI.runtimeTroop}
 * */
MATTIE.troopAPI.runtimeTroop.prototype.initialize = function(troopId, xOffset=0, yOffset=0){
    Game_Troop.prototype.initialize.call(this);
    this._interpreter.setTroop(this);
    this.setup(troopId, xOffset, yOffset);
    this._interpreter.setTroop(this);
    /** @description an array of the sprites of the enemies in this troop */
    this._sprites = [];
    
    /** 
     * @description the current battle spriteset
     * @type {Spriteset_Battle} 
     * 
    */
    this.spriteSet = SceneManager._scene._spriteset;
    this.setupTroopId();
}

/**
 * @description get all sprites associated with this troop
 * @returns {Sprite_Enemy[]} a list of the enemy sprites
 */
MATTIE.troopAPI.runtimeTroop.prototype.sprites = function(){
    return this._sprites;
}

/** @description generate internal troop id for sorting */
MATTIE.troopAPI.runtimeTroop.prototype.setupTroopId = function(){
    let id = JSON.stringify(this._troopId);
    if(this.spriteSet.additionalEnemyTroops)
    while (Object.keys(this.spriteSet.additionalEnemyTroops).includes(id)) {
        id += "(1)";
    }
    this._MTroopId = id;
}


/**
 * @description add the sprites of this troop to the current battle sprite sheet
 */
MATTIE.troopAPI.runtimeTroop.prototype.addSpritesToCurrentBattleSet = function(){
    let members = this.baseMembers()
    for (let index = 0; index < members.length; index++) {
        /** @type {Sprite_Enemy} */
        const gameEnemy = members[index];
        this._sprites.push(this.spriteSet.addAdditionalEnemy(gameEnemy, this._MTroopId));
        this.spriteSet.visualSort();
    }
    this.spriteSet.refreshSpacing();  
}

/**
 * @description spawn the event into the actual game. Until this is called the event is meaningless
 * @returns {MATTIE.troopAPI.runtimeTroop} returns itself so that you can initialize and spawn in one line if you would like.
 */
MATTIE.troopAPI.runtimeTroop.prototype.spawn = function(){
    if($gameParty.inBattle()){ //check if the game party is in battler
        if($gameTroop){ //check if there is a current troop
            this.setupBattleEvent(); //setup battle event 
            $gameTroop.addRunTimeTroop(this); //pass this runtime troop to the active troop
            this.addSpritesToCurrentBattleSet();
            this._interpreter.setTroop(this);
        }

    }
    return this;
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
    this.$gameTroop = gameTroop
}

/**
 * @description get the game troop of this interpreter or global if not set
 * @returns {Game_Troop} the normal game troop or the current game troop
 */
Game_Interpreter.prototype.getTroop = function(){
    return this.$gameTroop || $gameTroop;
}

/**
 *  @description iterate enemy index of local troop only 
 *  @param {int} param apears to be enemy id
 *  @param {Function} callback, the call back to execute
 * */
Game_Interpreter.prototype.iterateEnemyIndex = function(param, callback) {
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





//--------------------------------------
// Spriteset_Battle
//--------------------------------------

//The code below needs some work --we need to allow auto placement and arrangement of battlers

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
Spriteset_Battle.prototype.addAdditionalEnemy = function(gameEnemy,troopId="defaultTroop") {
    if(!this.additionalEnemySprites) this.additionalEnemySprites = [];
    if(!this.additionalEnemyTroops) this.additionalEnemyTroops = {};
    var sprite =  new Sprite_Enemy(gameEnemy)
    this._battleField.addChild(sprite);
    this.additionalEnemySprites.push(sprite);
    if(!this.additionalEnemyTroops[troopId]) this.additionalEnemyTroops[troopId] = []
    this.additionalEnemyTroops[troopId].push(sprite);
    
    return sprite;
};

Spriteset_Battle.prototype.getAllBattlerSprites = function(){
    return (this._enemySprites.concat(this.additionalEnemySprites));
}

/**
 * @description try to space out the additional enemies as much as possible
 */
Spriteset_Battle.prototype.refreshSpacing = function(shouldAffectBase = true) {
    let dict = this.additionalEnemyTroops;
    if(shouldAffectBase)
    dict[-1] = this._enemySprites;

    let keys = Object.keys(dict);
    let minX = -(Graphics.width/3)
    let maxX = (Graphics.width/3)
    let v = maxX-minX;
    let bestX = (index=>{
        let t = index/(keys.length-1);
        let x = (minX + v*t); //parametric form in 1d
        return x;
    })
    
    for (let index = 0; index < keys.length; index++) {
        const enemyList = dict[keys[index]]; //a list of sprites
        let xOffset = bestX(index);
        
        /** @type {Sprite_Battler} */
        enemyList.forEach(sprite => {
            if(sprite){
                if(!sprite.baseX) sprite.baseX = sprite._homeX;
                if(!sprite.baseY) sprite.baseY = sprite._homeY;
                sprite.setHome((sprite.baseX+xOffset), sprite._homeY);
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