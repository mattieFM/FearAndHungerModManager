var MATTIE = MATTIE || {};
MATTIE.troopAPI = MATTIE.troopAPI || {};
MATTIE.troopAPI.config = MATTIE.troopAPI.config || {};

/** 
 * @description controls the padding on the left and right of the screen
 * @default .1, 10% on both sides so 20%
 */
MATTIE.troopAPI.config.screenWidthPadding = .1; 


MATTIE_RPG.Game_Troop_Setup = Game_Troop.prototype.setup;
Game_Troop.prototype.setup = function(troopId){
    MATTIE_RPG.Game_Troop_Setup.call(this, troopId)
}
/**
 * @description add an additional enemy to the current troop
 * @param {*} enemyId the id of the enemy to add
 * @param {*} x the screen x pos
 * @param {*} y the screen y pos
 */
Game_Troop.prototype.addAdditionalEnemy = function(enemyId,x,y){
    this._enemies.push(new Game_Enemy(enemyId,x,y))
    if(SceneManager._scene instanceof Scene_Battle){
        return SceneManager._scene._spriteset.addAdditionalEnemy(this._enemies[this._enemies.length-1]);
    }
}

MATTIE_RPG.TroopApi_Game_Troop_Setup = Game_Troop.prototype.setup;
Game_Troop.prototype.setup = function(troopId) {
    /** @description a dictionary of arrays of pixi sprites  */
    this.additionalEnemyTroops = {};
    /** @description an array of pixi sprites for each additional enemy added at runtime */
    this.additionalEnemySprites = [];
    MATTIE_RPG.TroopApi_Game_Troop_Setup.call(this,troopId);
    
};
/**
 * @description add all enemies of a troop to the combat
 * @param {int} enemyId the id of the troop to add
 * @param {int} xOffset the amount the x should be offset from its original pos
 * @param {int} yOffset the amount the y should be offset from its original pos
 * @param {int} layerPriority whether this should be infront of other enemies, -1 means always in front
 */
Game_Troop.prototype.addAdditionalTroop = function(troopId,xOffset=0,yOffset=0,layerPriority=null){
    if(SceneManager._scene instanceof Scene_Battle){
        let spriteSet = SceneManager._scene._spriteset;
        if(!spriteSet.additionalEnemyTroops) spriteSet.additionalEnemyTroops = {};
        let dictTroopId = troopId;
        while(spriteSet.additionalEnemyTroops[dictTroopId]){
            dictTroopId+="(1)"
        }
        spriteSet.additionalEnemyTroops[dictTroopId] = [];
        let troop = $dataTroops[troopId];
        let enemies = troop.members;
        for (let index = 0; index < enemies.length; index++) {
            const dataEnemy = enemies[index];
            let sprite = this.addAdditionalEnemy(dataEnemy.enemyId, dataEnemy.x+xOffset, dataEnemy.y+yOffset)
            spriteSet.additionalEnemyTroops[dictTroopId].push(sprite);
        }

        spriteSet.visualSort();
    }
}
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