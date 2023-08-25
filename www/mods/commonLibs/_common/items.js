var MATTIE_ModManager = MATTIE_ModManager || {};
var MATTIE = MATTIE || {};
MATTIE.items = MATTIE.items  || {};
MATTIE.global = MATTIE.global || {};
MATTIE.static = MATTIE.static || {};

const EffectCodes = {
    RECOVER_HP:  11,
    RECOVER_MP: 12,
    GAIN_TP: 13,
    ADD_STATE: 21,
    REMOVE_STATE: 22,
    ADD_BUFF: 31,
    ADD_DEBUFF: 32,
    REMOVE_BUFF: 33,
    REMOVE_DEBUFF: 34,
    SPECIAL: 41,
    GROW: 42,
    LEARN_SKILL: 43,
    COMMON_EVENT: 44,
    SPECIAL_ESCAPE:  0,  
}


/**
 * 
 * @param {EffectCodes} code what type of effect is this? refer to game action effects 
 * @param {int} dataId the dataid, mostly used for status effects and common events
 * @param {int} scalar multiplicitive value?
 * @param {int} value addative value?
 */
DataManager.buildEffect = function(code,dataId,scalar,value){
    let effect = {};
    effect.code = code;
    effect.dataId = dataId;
    effect.value1 = scalar;
    effect.value2 = value;
    return effect
}

DataManager.buildCommonEventEffect = function(commonEventId){
    return DataManager.buildEffect(EffectCodes.COMMON_EVENT, commonEventId, 0, 0)
}

/**
 * @description change the activation condition of an item
 * @param {*} x 
 * 0: always
 * 1: in battle
 * 2: in menu
 * 3: never
 */
DataManager.changeActivationCondition = function(obj,x) {
    obj.occasion = x;
}

/**
 * @description call a callback when the item is consumed
 * @param {*} id the item id
 * @param {*} cb the function to call when the item is consumed
 */
DataManager.setCallbackOnItem = function(id,cb) {
    $dataItems[id].hasCallback = true;
    $dataItems[id].cb = cb;
}

/**
 * @description call a callback when the item is consumed
 * @param {*} id the item id
 * @param {*} cb the function to call when the item is consumed
 */
DataManager.setCallbackOnObj = function(obj,cb) {
    obj.hasCallback = true;
    obj.cb = cb;
}

/**
 * @description clear all effects of the item, basically make it do nothing when used
 * @param {*} id the item id
 */
DataManager.disableBaseItem = function(id) {
    $dataItems[id].disableBase = true; //this is my var to know if base is diabled
    $dataItems[id].effects = []; //this is what stops the item effects
    $dataItems[id].repeats = 0; //probs not needed
}

DataManager.clearEffects = function(obj){
    obj.effect = [];
}

/**
 * @description add an effect to an item
 * @param {*} id the id of the item
 * @param {*} effect the effect to add
 */
DataManager.addItemEffect = function(id,effect) {
    $dataItems[id].effects.push(effect);
}

/**
 * @description add an effect to an item
 * @param {*} id the id of the item
 * @param {*} effect the effect to add
 */
DataManager.addEffect = function(obj,effect) {
    obj.effects.push(effect);
}
MATTIE.items.object = Game_Item.prototype.object;
Game_Item.prototype.object = function() {
    return MATTIE.items.object.call(this);
    //else return null;
};

MATTIE.items.setObject = Game_Item.prototype.setObject;
Game_Item.prototype.setObject = function(item) {
    MATTIE.items.setObject.call(this,item);
    if(item){
        if(item.hasCallback){
            this.setCb(item.cb)
        }
        this.disableBase = item.disableBase;
    }
    

};

/** @param {*} cb the callback to call*/
Game_Item.prototype.setCb = function(cb) {
    this.cb = cb;
};

Game_Item.prototype.clearCb = function() {
    this.cb = null;
};

Game_Item.prototype.getCb = function() {
    return this.cb;
};

Game_Item.prototype.useItem = function() {
    if(this.cb)this.cb();
};

//this is called anytime any battler uses a action/skill/...etc...
MATTIE.items.apply = Game_Battler.prototype.useItem ;
Game_Battler.prototype.useItem  = function(item) {
    MATTIE.items.apply.call(this,item);
    if(item.cb) item.cb();
};
