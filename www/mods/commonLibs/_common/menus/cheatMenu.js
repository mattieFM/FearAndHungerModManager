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



/**
 * A scene to spawn in one item and then close
 * @extends MATTIE.scenes.cheatMenu
 */
MATTIE.scenes.oneUseCheatMenu = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.scenes.oneUseCheatMenu.prototype = Object.create(MATTIE.scenes.cheatMenu.prototype);
MATTIE.scenes.oneUseCheatMenu.prototype.constructor = MATTIE.scenes.oneUseCheatMenu;

MATTIE.scenes.oneUseCheatMenu.prototype.initialize = function() {
    MATTIE.scenes.cheatMenu.prototype.initialize.call(this);
};


MATTIE.scenes.oneUseCheatMenu.prototype.onItemOk = function() {
    MATTIE.scenes.cheatMenu.prototype.onItemOk.call(this);
    SceneManager.pop();
};



MATTIE.windows.emptyScrollHelpWindow  = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.windows.emptyScrollHelpWindow.prototype = Object.create(Window_Help.prototype);
MATTIE.windows.emptyScrollHelpWindow.prototype.constructor = MATTIE.windows.emptyScrollHelpWindow;

MATTIE.windows.emptyScrollHelpWindow.prototype.initialize = function(numLines) {
    Window_Help.prototype.initialize.call(this, numLines);
};

MATTIE.windows.emptyScrollHelpWindow.prototype.setText = function(text) {
    this.typingActions = [];
    if(this.interval) clearInterval(this.interval);
    if (this._text !== text) {
        let wantedText = "O Lord, Give, " + text;
        let keepDeleting = true;
        let doneTyping = false;
        let index = 0;
        let textLength = this._text.length-1;
        while (keepDeleting) {
            if(wantedText.startsWith(this._text.slice(0,textLength-index))){
                //start typing forwards
                keepDeleting = false;
            } 
            this.typingActions.push(this._text.slice(0,textLength-index) )
            if(index >= textLength) keepDeleting = false;
            index++;
        }
        var otherText = this._text.slice(0,textLength-index);
        index = otherText.length;//continue typing from where we know strings are same.
        
        while(!doneTyping){
           
            let char = wantedText[index]
           
            
            if(char){
                otherText += char
                this.typingActions.push(otherText);
                console
            }
            if(text === wantedText) doneTyping = true;
            if(index >= wantedText.length-1) doneTyping = true;
            index++;
        }
        console.log("done typing");

        index = 0;
        this.interval = setInterval(() => {
            if(index < this.typingActions.length && this._text != wantedText){
                const element = this.typingActions[index];
                this._text = element;
                this.refresh();
            } else {
                clearInterval(this.interval);
            }
            index++;
          
        }, 75);
        
        this.refresh();
        
    }
};

MATTIE.windows.emptyScrollHelpWindow.prototype.setItem = function(item) {
    this.setText(item ? item.name : 'O Lord, Give,');
};

/**
 * A scene to spawn in one item that an empty scroll can provide and then close
 * @extends MATTIE.scenes.emptyScroll
 */
MATTIE.scenes.emptyScroll = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.scenes.emptyScroll.prototype = Object.create(MATTIE.scenes.oneUseCheatMenu.prototype);
MATTIE.scenes.emptyScroll.prototype.constructor = MATTIE.scenes.emptyScroll;

MATTIE.scenes.emptyScroll.prototype.initialize = function() {
    MATTIE.scenes.oneUseCheatMenu.prototype.initialize.call(this);
};

MATTIE.scenes.emptyScroll.prototype.create = function() {
     MATTIE.scenes.oneUseCheatMenu.prototype.create.call(this);
};

MATTIE.scenes.emptyScroll.prototype.createHelpWindow = function() {
    this._helpWindow = new MATTIE.windows.emptyScrollHelpWindow(1);
    this._helpWindow.setText("O Lord, Give, ");
    this.addWindow(this._helpWindow);
    this._helpWindow.refresh();
};
