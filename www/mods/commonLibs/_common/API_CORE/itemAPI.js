var MATTIE_ModManager = MATTIE_ModManager || {};
/**
 * @namespace MATTIE.itemAPI
 * @description The api for interacting with items
 */
MATTIE.itemAPI = MATTIE.itemAPI || {};

MATTIE.static = MATTIE.static || {};

const EffectCodes = {
	RECOVER_HP: 11,
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
	SPECIAL_ESCAPE: 0,
};

const ITEM_TYPES = {
	ITEM: 'item',
	ARMOR: 'armor',
	WEAPON: 'weapon',

};

/**
 *
 * @param {EffectCodes} code what type of effect is this? refer to game action effects
 * @param {int} dataId the dataid, mostly used for status effects and common events
 * @param {int} scalar multiplicitive value?
 * @param {int} value addative value?
 */
DataManager.buildEffect = function (code, dataId, scalar, value) {
	const effect = {};
	effect.code = code;
	effect.dataId = dataId;
	effect.value1 = scalar;
	effect.value2 = value;
	return effect;
};

DataManager.buildCommonEventEffect = function (commonEventId) {
	return DataManager.buildEffect(EffectCodes.COMMON_EVENT, commonEventId, 0, 0);
};

/**
 * @description change the activation condition of an item
 * @param {*} x
 * 0: always
 * 1: in battle
 * 2: in menu
 * 3: never
 */
DataManager.changeActivationCondition = function (obj, x) {
	obj.occasion = x;
};

/**
 * @description call a callback when the item is consumed
 * @param {*} id the item id
 * @param {*} cb the function to call when the item is consumed
 */
DataManager.setCallbackOnItem = function (id, cb) {
	$dataItems[id].hasCallback = true;
	$dataItems[id].cb = cb;
};

/**
 * @description set the callback that should be called when this item is equipped
 * @param {*} id the item id
 * @param {*} cb the function to call when the item is equipped
 */
DataManager.setOnEquipCallback = function (id, cb) {
	$dataItems[id].hasCallback = true;
	$dataItems[id].equipCb = cb;
};

/**
 * @description set the callback that should be called when this item is unequipped
 * @param {*} id the item id
 * @param {*} cb the function to call when the item is un equipped
 */
DataManager.setOnUnequipCallback = function (id, cb) {
	$dataItems[id].hasCallback = true;
	$dataItems[id].unequipCb = cb;
};

/**
 * @description call a callback when the item is consumed
 * @param {*} id the item id
 * @param {*} cb the function to call when the item is consumed
 */
DataManager.setCallbackOnObj = function (obj, cb) {
	obj.hasCallback = true;
	obj.cb = cb;
};

/**
 * @description clear all effects of the item, basically make it do nothing when used
 * @param {*} id the item id
 */
DataManager.disableBaseItem = function (id) {
	$dataItems[id].disableBase = true; // this is my var to know if base is diabled
	$dataItems[id].effects = []; // this is what stops the item effects
	$dataItems[id].repeats = 0; // probs not needed
};

DataManager.clearEffects = function (obj) {
	obj.effect = [];
};

/**
 * @description add an effect to an item
 * @param {*} id the id of the item
 * @param {*} effect the effect to add
 */
DataManager.addItemEffect = function (id, effect) {
	$dataItems[id].effects.push(effect);
};

/**
 * @description add an effect to an item
 * @param {*} id the id of the item
 * @param {*} effect the effect to add
 */
DataManager.addEffect = function (obj, effect) {
	obj.effects.push(effect);
};
MATTIE.itemAPI.object = Game_Item.prototype.object;
Game_Item.prototype.object = function () {
	return MATTIE.itemAPI.object.call(this);
	// else return null;
};

MATTIE.itemAPI.setObject = Game_Item.prototype.setObject;
Game_Item.prototype.setObject = function (item) {
	MATTIE.itemAPI.setObject.call(this, item);
	if (item) {
		if (item.hasCallback) {
			this.setCb(item.cb);
			this.setEquipCb(item.equipCb);
			this.setUnequipCb(item.unequipCb);
		}
		this.disableBase = item.disableBase;
	}
};

/** @param {*} cb the callback to call */
Game_Item.prototype.setCb = function (cb) {
	this.cb = cb;
};

/** @param {*} cb the callback to call when equipped */
Game_Item.prototype.setEquipCb = function (cb) {
	this.equipCb = cb;
};

/** @param {*} cb the callback to call when unequipped */
Game_Item.prototype.setUnequipCb = function (cb) {
	this.unequipCb = cb;
};

/** @description clear all callbacks on this item */
Game_Item.prototype.clearCbs = function () {
	this.cb = null;
	this.unequipCb = null;
	this.equipCb = null;
};

Game_Item.prototype.getCb = function () {
	return this.cb;
};

Game_Item.prototype.useItem = function () {
	if (this.cb) this.cb();
};

Game_Item.prototype.onEquip = function () {
	if (this.equipCb) this.equipCb();
};

/** @description the base chance equip method */
MATTIE_RPG.Game_Actor_changeEquip = Game_Actor.prototype.changeEquip;
/**
 * @description the overridden change equip method to also call out callbacks on equip/unequip
 * @param {int} slotId
 * @param {rm.types.Item} item
 */
Game_Actor.prototype.changeEquip = function (slotId, item) {
	if (item.equipCb) item.equipCb();
	const otherItem = this.equips()[slotId];
	console.log(otherItem);
	if (otherItem) { if (otherItem.unequipCb) otherItem.unequipCb(); }
	MATTIE_RPG.Game_Actor_changeEquip.call(this, slotId, item);
};

// this is called anytime any battler uses a action/skill/...etc...
MATTIE.itemAPI.apply = Game_Battler.prototype.useItem;
Game_Battler.prototype.useItem = function (item) {
	MATTIE.itemAPI.apply.call(this, item);
	if (item.cb) item.cb();
};

MATTIE.itemAPI.RunTimeItems = [];

MATTIE.itemAPI.RunTimeItem = class {
	/**
	 * @description build a new item
	 * @param {ITEM_TYPES} type the type of the item, default item
	 */
	constructor(type = ITEM_TYPES.ITEM) {
		/** @type {ITEM_TYPES} */
		this.type = type;

		this.cb = () => {};

		/**
         * @description the actual data item of this class
         * @type {rm.types.Armor}
         * */
		this._data = this.buildDefaultParams();
		this.setId();
	}

	/**
     * @description create the default data item
     * @returns the default dataItem obj
     */
	buildDefaultParams() {
		let obj = {};
		if (this.type === ITEM_TYPES.ARMOR) {
			let i = 1;
			obj = $dataArmors[i];
			while (!obj) {
				obj = $dataArmors[++i];
			}
		}
		if (this.type === ITEM_TYPES.WEAPON) {
			let i = 1;
			obj = $dataWeapons[i];
			while (!obj) {
				obj = $dataWeapons[++i];
			}
		}

		obj.name = 'generic name';
		obj.animationId = 0;
		obj.consumable = 0;
		obj.damage = 1;
		obj.description = 'A generic Item';
		obj.effects = [];
		obj.hitType = 0;
		obj.iconIndex = 0;
		obj.itypeId = 1;
		obj.atypeId = 4;
		obj.etypeId = 4;
		obj.meta = '';
		obj.note = '';
		obj.occasion = 0;
		obj.price = 0;
		obj.repeats = 0;
		obj.scope = 0;
		obj.speed = 1;
		obj.successRate = 100;
		obj.tpGain = 0;
		return obj;
	}

	/** @description 1: normal, 2: book/key item */
	setItemType(type) {
		if (type > 0 && type < 2) { this._data.itypeId = type; }
	}

	/**
	 * @description set the type of this item, refer to enum above for types
	 * @param {ITEM_TYPES} type
	 */
	setType(type) {
		this.type = type;
	}

	/**
	 * @description set the category of the armor
	 * 3: accessory
	 * 4: torso
	 * 5: shield
	 * 6: head
	 * @param {rm.types.Armor} atype
	 */
	setEquipType(atype) {
		this._data.etypeId = atype;
		this._data.atypeId = atype;
	}

	setIconIndex(index) {
		this._data.iconIndex = index;
	}

	setId() {
		switch (this.type) {
		case ITEM_TYPES.ITEM:
			this._data.id = $dataItems.length;
			break;
		case ITEM_TYPES.ARMOR:
			this._data.id = $dataArmors.length;
			break;
		case ITEM_TYPES.WEAPON:
			this._data.id = $dataWeapons.length;
			break;

		default:
			this._data.id = $dataItems.length;
			break;
		}
	}

	/**
     * @description set the name of this item
     * @param {String} name the new name
     */
	setName(name) {
		this._data.name = name;
	}

	/**
     * @description set the desc of this item
     * @param {String} desc the new desc
     */
	setDescription(desc) {
		this._data.description = desc;
	}

	/**
     * @description set a callback to occur when this item is crafted
     * @param {Function} cb the callback to be called
     */
	setCraftingCallback(cb) {
		const openingTag = '<Custom Synthesis Effect>';
		const closingTag = '</Custom Synthesis Effect>';
		this._data.craftingCb = cb;
		const script = `$dataItems[${this._data.id}].craftingCb()`;
		this._data.customSynthEval = script;
	}

	/**
     * @description add a recipe to the current item
     * @param {id[]} itemIds array of items needed for this recipe
     * @param {id}unlockItemId, the item that will unlock the recipe for this item
     */
	addRecipe(itemIds, unlockItemId) {
		const openingTag = '<Synthesis Ingredients>\n';
		const closingTag = '</Synthesis Ingredients>\n';
		const items = itemIds.map((itemId) => (`item ${itemId}`)).join('\n');
		const recipeString = openingTag + items + closingTag;

		const recipeUnlock = `\n<Item Recipe: ${this._data.id}>\n`;
		$dataItems[unlockItemId].note += recipeUnlock;

		this.addRecipeUnlock(unlockItemId);
		DataManager.processISNotetags1([null, this._data], 0);

		this._data.note += recipeString;

		itemIds.map((itemId) => DataManager.addSynthesisIngredient(this._data, `item ${itemId}`));
	}

	addRecipeUnlock(unlockItemId) {
		const recipeUnlock = `\n<Item Recipe: ${this._data.id}>\n`;
		$dataItems[unlockItemId].note += recipeUnlock;
		DataManager.processISNotetags1([null, $dataItems[unlockItemId]], 0);
	}

	/** @description set a callback to be called when this item is used */
	setCallback(cb) {
		this.cb = cb;
		this._data.cb = cb;
	}

	/** @description set a callback to be called when this item is equipped */
	setEquipCallback(cb) {
		Game_Item.prototype.setEquipCb.call(this, cb);
		this._data.equipCb = cb;
	}

	/** @description set a callback to be called when this item is equipped */
	setUnequipCallback(cb) {
		Game_Item.prototype.setUnequipCb.call(this, cb);
		this._data.unequipCb = cb;
	}

	spawn() {
		MATTIE.itemAPI.RunTimeItems.push(this);
		switch (this.type) {
		case (ITEM_TYPES.ITEM):
			$dataItems[this._data.id] = this._data;
			DataManager.setCallbackOnItem(this._data.id, this.cb);
			break;
		case (ITEM_TYPES.ARMOR):
			$dataArmors[this._data.id] = this._data;
			break;
		case (ITEM_TYPES.WEAPON):
			$dataWeapons[this._data.id] = this._data;
			break;
		}

		if (DataManager.processItemCategoriesNotetags1) DataManager.processItemCategoriesNotetags1([null, this._data]); // termina compatability
	}
};
