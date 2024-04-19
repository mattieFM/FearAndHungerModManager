/* eslint-disable max-classes-per-file */
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
	ITEM: 'Item',
	ARMOR: 'Armor',
	WEAPON: 'Weapon',

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

/**
 * @description set a callback to be called when this item is equipped
 * @param {function} cb a callback taking the Game_Actor object that has equipped this item
 * */
Game_Item.prototype.setEquipCb = function (cb) {
	this.equipCb = cb;
};

/**
 *  @description set a callback to be called when this item is unequipped
 * @param {function} cb a callback taking the Game_Actor object that has unequipped this item
 *  */
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
 * Updated to allow meta tags for callbacks ie <equipCb:console.log("I was equipped")>
 * @param {int} slotId
 * @param {rm.types.Item} item
 */
Game_Actor.prototype.changeEquip = function (slotId, item) {
	if (item) if (item.equipCb) item.equipCb(this);
	if (item) if (item._meta.equipCb) eval(item._meta.equipCb);
	const otherItem = this.equips()[slotId];
	console.log(otherItem);
	if (otherItem) { if (otherItem.unequipCb) otherItem.unequipCb(this); }
	if (otherItem) { if (otherItem._meta.unequipCb)eval(otherItem._meta.unequipCb); }
	if (item) if (item._meta.equipCb) eval(item._meta.equipCb);
	MATTIE_RPG.Game_Actor_changeEquip.call(this, slotId, item);
};

// this is called anytime any battler uses a action/skill/...etc...
MATTIE.itemAPI.apply = Game_Battler.prototype.useItem;
Game_Battler.prototype.useItem = function (item) {
	MATTIE.itemAPI.apply.call(this, item);
	if (item.cb) item.cb();
};

MATTIE.itemAPI.RunTimeItems = [];

/**
 *
 * @param {*} name name of the book
 * @param {*} desc description
 * @param {*} iconName the name of the icon in the system folder
 * @param {*} bookOpenText the text to display when the book is red
 * @param {*} spawn whether to spawn the book or not
 * @returns the book obj
 */
MATTIE.itemAPI.quickBook = function (name, desc, iconName, bookOpenText, spawn = true) {
	const book = new MATTIE.itemAPI.RunTimeItem();
	book.setIconIndex(new MATTIE.itemAPI.RuntimeIcon(iconName));
	book.setName(name);
	book.setDescription(desc);
	book.setItemType(2); // set book
	book.setCallback(() => {
		SceneManager.goto(Scene_Map);
		setTimeout(() => {
			MATTIE.fxAPI.showImage('book_base', 1, 0, 0);
			MATTIE.msgAPI.displayMsg(`<WordWrap>${bookOpenText}`, 1, 1);

			const int = setInterval(() => {
				if (!$gameMessage.isBusy()) {
					clearInterval(int);
					MATTIE.fxAPI.deleteImage(1);
				}
			}, 100);
		}, 1000);
	});
	if (spawn) { book.spawn(); }
	return book;
};

/**
 * @description a class that represents a single runtime item
 * @class
 */
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

		/** @description whether this item is spawned or not */
		this.isSpawned = false;
	}

	/**
	 * @description have the party gain this item and display the pickup message
	 * @param {int} x quantity to gain
	 * @param {boolean} display whether to display the pickup message or not
	 */
	gainThisItem(x = 1, display = true) {
		if (display) { MATTIE.msgAPI.displayMsg(`You find a \\c[2]${this._data.name}\\c[0]!`); }
		$gameParty.gainItem(this._data, x);
	}

	/**
	 * @description have the party lose this item
	 * @param {int} x quantity to lose
	 */
	loseThisItem(x = 1) {
		$gameParty.loseItem(this._data, x);
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
		obj = JsonEx.makeDeepCopy(obj);

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

	/**
	 * @description set whether this item is consumable or not
	 * @param {bool} bool true if consumable false if not
	 */
	setConsumable(bool) {
		this._data.consumable = bool;
	}

	/** @description 1: normal, 2: book/key item */
	setItemType(type) {
		if (type > 0 && type <= 2) { this._data.itypeId = type; } // in range (0-2]
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
			this.typeString = '$dataItems';
			break;
		case ITEM_TYPES.ARMOR:
			this._data.id = $dataArmors.length;
			this.typeString = '$dataArmors';
			break;
		case ITEM_TYPES.WEAPON:
			this._data.id = $dataWeapons.length;
			this.typeString = '$dataWeapons';
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
		const script = `${this.typeString}[${this._data.id}].craftingCb()`;
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

		const recipeUnlock = `\n<${this.type} Recipe: ${this._data.id}>\n`;
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

	/**
	 *  @description set a callback to be called when this item is equipped
	 *  @param {function} cb a callback taking the Game_Actor object that has equipped this item
	*/
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
		this.spawned = true;
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

/**
 *
 * @param {string} charName the name of the character spritesheet within www/img/characters that this is a costume of (do not include .png)
 * @param {int} startingIndex the index within that spritesheet IE: what portion of the sprite sheet to use if it contains multiple chars
 * (0 if only one char in the sheet)
 * @param {string} costumeName the name of the item
 * @param {int} costumeIconId the id of the icon that this costume should have.
 * @param {int} unlockItem the id of the item that should unlock the crafting recipe for this costume
 * @param {int[]} craftingItems an array of the items needed to craft this item
 * @param {boolean} spawn should this spawn the item or just return it so that you can modify it farther before spawning
 */
MATTIE.itemAPI.createCostume = function (
	charName,
	startingIndex,
	costumeName,
	costumeIconId,
	unlockItem = MATTIE.static.items.unobtainable,
	craftingItems = MATTIE.static.items.unobtainable,
	spawn = true,
) {
	const costume = new MATTIE.itemAPI.RunTimeItem(ITEM_TYPES.ARMOR);

	costume.setEquipCallback((actor) => {
		/** @type {Game_Actor} */
		const actor2 = actor;
		actor2.setCharacterImage(charName, startingIndex);
		actor2.baseCharNameFunc = actor2.characterName;
		actor2.characterName = () => charName;
	});
	costume.setUnequipCallback((actor) => {
		actor.characterName = actor.baseCharNameFunc;
		actor.baseCharNameFunc = null;
		actor.setCharacterImage(actor.characterName(), startingIndex);
	});
	costume.setName(costumeName);
	costume.setIconIndex(costumeIconId);
	costume.addRecipe(craftingItems, unlockItem);
	if (spawn) { costume.spawn(); }
	return costume;
};

/**
 * @description a class that allows loading an item icon IE a 96x96 img from system outside of the default iconset.png
 */
MATTIE.itemAPI.RuntimeIcon = class {
	constructor(file) {
		/** @description the name of the file within www/img/system excluding .png */
		this.file = file;

		// reserve the image so it loads right away
		setTimeout(() => {
			ImageManager.reserveSystem(this.file);
			ImageManager.loadSystem(this.file);
		}, 5000);
	}
};

/** @description the base draw icon method */
MATTIE_RPG.Window_Base_drawIcon = Window_Base.prototype.drawIcon;
/**
 * @description draw icon method overridden to check if icon index is a runtime icon and load the runtime icon accordingly.
 * */
Window_Base.prototype.drawIcon = function (iconIndex, x, y) {
	if (iconIndex instanceof MATTIE.itemAPI.RuntimeIcon) {
		/** @type {MATTIE.itemAPI.RuntimeIcon} */
		const runtimeIcon = iconIndex;

		var bitmap = ImageManager.loadSystem(runtimeIcon.file);
		console.log(bitmap);
		var pw = Window_Base._iconWidth;
		var ph = Window_Base._iconHeight;
		this.contents.blt(bitmap, 0, 0, pw, ph, x, y);
	} else {
		MATTIE_RPG.Window_Base_drawIcon.call(this, iconIndex, x, y);
	}
};

// override actions to have callbacks
MATTIE_RPG.GameActionApply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function (target) {
	MATTIE_RPG.GameActionApply.call(this, target);
	if (this.cb) this.cb();
};
