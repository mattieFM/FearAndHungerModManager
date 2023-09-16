var MATTIE_ModManager = MATTIE_ModManager || {};
var MATTIE = MATTIE || {};
MATTIE.items = MATTIE.items  || {};
MATTIE.global = MATTIE.global || {};
MATTIE.static = MATTIE.static || {};

var Yanfly = Yanfly || {};


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


MATTIE.items.runtimeItems = [];

MATTIE.items.runTimeItem = class {
    
    constructor(params) {
        /**
         * @description the actual data item of this class 
         * @type {rm.types.Item}
         * */
        this._data  = this.buildDefaultParams();
        this.setId();
        this.cb = ()=>{};
    }

    /**
     * @description create the default data item
     * @returns the default dataItem obj
     */
    buildDefaultParams (){
        let obj = {};
        obj.name = "generic name"
        obj.animationId = 0;
        obj.consumable = 0;
        obj.damage = 1;
        obj.description = "A generic Item";
        obj.effects = [];
        obj.hitType = 0;
        obj.iconIndex = 0;
        obj.itypeId = 1;
        obj.meta = "";
        obj.note = "";
        obj.occasion = 0;
        obj.price = 0;
        obj.repeats = 0;
        obj.scope = 0; 
        obj.speed = 1;
        obj.successRate = 100;
        obj.tpGain = 0;
        return obj;
        
    }

    setIconIndex(index){
        this._data.iconIndex = index;
    }

    setId(){
        this._data.id = $dataItems.length;
    }

    /**
     * @description set the name of this item
     * @param {String} name the new name
     */
    setName(name){
        this._data.name = name;
    }

     /**
     * @description set the desc of this item
     * @param {String} desc the new desc
     */
     setDescription(desc){
        this._data.description = desc;
    }

    /**
     * @description set a callback to occur when this item is crafted
     * @param {Function} cb the callback to be called 
     */
    setCraftingCallback(cb){
        let openingTag = "<Custom Synthesis Effect>";
        let closingTag = "</Custom Synthesis Effect>";
        this._data.craftingCb = cb;
        let script = `$dataItems[${this._data.id}].craftingCb()`
        this._data.customSynthEval = script;
    }

    /**
     * @description add a recipe to the current item
     * @param {id[]} itemIds array of items needed for this recipe
     * @param {id}unlockItemId, the item that will unlock the recipe for this item
     */
    addRecipe (itemIds,unlockItemId){
        let openingTag = "<Synthesis Ingredients>\n";
        let closingTag = "</Synthesis Ingredients>\n";
        let items = itemIds.map(itemId=>("item "+itemId)).join("\n");
        let recipeString = openingTag + items + closingTag;

        let recipeUnlock = `\n<Item Recipe: ${this._data.id}>\n`
        $dataItems[unlockItemId].note += recipeUnlock;

        DataManager.processISNotetags1([null,this._data,$dataItems[unlockItemId]],0)

        this._data.note += recipeString;

        

        
        itemIds.map(itemId=>DataManager.addSynthesisIngredient(this._data, "item "+itemId))
       
    }

    /** @description set a callback to be called when this item is used */
    setCallback(cb){
        this.cb = cb;
    }

    spawn (){
        MATTIE.items.runtimeItems.push(this);
        $dataItems[this._data.id] = this._data;
        DataManager.setCallbackOnItem(this._data.id,this.cb);
    }

    
}