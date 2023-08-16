var MATTIE = MATTIE || {};
MATTIE.menus = MATTIE.menus || {};
MATTIE.windows = MATTIE.windows || {};
MATTIE.scenes = MATTIE.scenes || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};

/**
 * A scene to spawn in items
 * @extends Scene_Item
 */
MATTIE.scenes.cheatMenu = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.scenes.cheatMenu.prototype = Object.create(Scene_Item.prototype);
MATTIE.scenes.cheatMenu.prototype.constructor = MATTIE.scenes.cheatMenu;

MATTIE.scenes.cheatMenu.prototype.initialize = function() {
    Scene_Item.prototype.initialize.call(this);
    this.lastItem = null;
    
};


MATTIE.scenes.cheatMenu.prototype.createItemWindow = function() {
    var wy = this._categoryWindow.y + this._categoryWindow.height;
    var wh = Graphics.boxHeight - wy;
    this._itemWindow = new MATTIE.windows.cheatItemWin(0, wy, Graphics.boxWidth, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
    this._categoryWindow.setItemWindow(this._itemWindow);
};


MATTIE.scenes.cheatMenu.prototype.onCategoryOk = function() {
    this._itemWindow.activate();
    var index = this._itemWindow._data.indexOf(this.lastItem);
    this._itemWindow.select(index >= 0 ? index : 0);
};

MATTIE.scenes.cheatMenu.prototype.onItemOk = function() {
    $gameParty.gainItem(this.item(), 1, false);
    this.lastItem = this.item();
    this._itemWindow.activate();
    this._itemWindow.refresh();
};


MATTIE.windows.cheatItemWin = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.windows.cheatItemWin.prototype = Object.create(Window_ItemList.prototype);
MATTIE.windows.cheatItemWin.prototype.constructor = MATTIE.windows.cheatItemWin;

MATTIE.windows.cheatItemWin.prototype.initialize = function(x, y, width, height) {
    Window_ItemList.prototype.initialize.call(this, x, y, width, height);
};
MATTIE.windows.cheatItemWin.allItems = function(){
    return $dataItems.concat($dataArmors).concat($dataWeapons);
}

MATTIE.windows.cheatItemWin.prototype.isCurrentItemEnabled = function() {
    return true;
};

MATTIE.windows.cheatItemWin.prototype.isEnabled = function(item) {
    return true;
};

MATTIE.windows.cheatItemWin.prototype.setCategory = function(category) {
    if (this._category !== category) {
        this._category = category;
        this.refresh();
    }
};

MATTIE.windows.cheatItemWin.prototype.makeItemList = function() {
    let allItems = MATTIE.windows.cheatItemWin.allItems();
    this._data = allItems.filter(function(item) {
        return this.includes(item);
    }, this);
    if (this.includes(null)) {
        this._data.push(null);
    }
};