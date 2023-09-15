var MATTIE = MATTIE || {};
MATTIE.menus = MATTIE.menus || {};
MATTIE.windows = MATTIE.windows || {};
MATTIE.scenes = MATTIE.scenes || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};

/** go to the item cheat menu scene */
MATTIE.menus.toItemCheatMenu = function(){
    SceneManager.push(MATTIE.scenes.Scene_DevItems);
}


/**
 * // Scene_DevItems
 * @description a scene to spawn in items for dev
 * @extends Scene_Item
 */
MATTIE.scenes.Scene_DevItems = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.scenes.Scene_DevItems.prototype = Object.create(Scene_Item.prototype);
MATTIE.scenes.Scene_DevItems.prototype.constructor = MATTIE.scenes.Scene_DevItems;

MATTIE.scenes.Scene_DevItems.prototype.initialize = function() {
    Scene_Item.prototype.initialize.call(this);
    this.lastItem = null;
    
};

//override to use our cheatItemWin instead of the default window
MATTIE.scenes.Scene_DevItems.prototype.createItemWindow = function() {
    var wy = this._categoryWindow.y + this._categoryWindow.height;
    var wh = Graphics.boxHeight - wy;
    this._itemWindow = new MATTIE.windows.Window_CheatItem(0, wy, Graphics.boxWidth, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
    this._categoryWindow.setItemWindow(this._itemWindow);
};

//override on categoryOk to work properly
MATTIE.scenes.Scene_DevItems.prototype.onCategoryOk = function() {
    this._itemWindow.activate();
    var index = this._itemWindow._data.indexOf(this.lastItem);
    this._itemWindow.select(index >= 0 ? index : 0);
};

//override the on item function to give the player that item instead of using it.
MATTIE.scenes.Scene_DevItems.prototype.onItemOk = function() {
    $gameParty.gainItem(this.item(), 1, false);
    this.lastItem = this.item();
    this._itemWindow.activate();
    this._itemWindow.refresh();
};

MATTIE.scenes.Scene_DevItems.prototype.onItemCancel = function(){
    this._categoryWindow.activate();
}




/**
 * Window_CheatItem
 * @description a window that displays all items in the game, intended to be used for the cheat menu
 * @extends Window_ItemList
 */
MATTIE.windows.Window_CheatItem = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.windows.Window_CheatItem.prototype = Object.create(Window_ItemList.prototype);
MATTIE.windows.Window_CheatItem.prototype.constructor = MATTIE.windows.Window_CheatItem;

MATTIE.windows.Window_CheatItem.prototype.initialize = function(x, y, width, height) {
    Window_ItemList.prototype.initialize.call(this, x, y, width, height);
};
MATTIE.windows.Window_CheatItem.allItems = function(){
    return $dataItems.concat($dataArmors).concat($dataWeapons);
}

MATTIE.windows.Window_CheatItem.prototype.isCurrentItemEnabled = function() {
    return true;
};

MATTIE.windows.Window_CheatItem.prototype.isEnabled = function(item) {
    return true;
};

MATTIE.windows.Window_CheatItem.prototype.setCategory = function(category) {
    if (this._category !== category) {
        this._category = category;
        this.refresh();
    }
};

MATTIE.windows.Window_CheatItem.prototype.makeItemList = function() {
    let allItems = MATTIE.windows.Window_CheatItem.allItems();
    this._data = allItems.filter(function(item) {
        return this.includes(item);
    }, this);
    if (this.includes(null)) {
        this._data.push(null);
    }
};



/**
 * // Scene_OneUseCheat
 * A scene to spawn in one item and then close
 * @extends MATTIE.scenes.Scene_DevItems
 */
MATTIE.scenes.Scene_OneUseCheat = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.scenes.Scene_OneUseCheat.prototype = Object.create(MATTIE.scenes.Scene_DevItems.prototype);
MATTIE.scenes.Scene_OneUseCheat.prototype.constructor = MATTIE.scenes.Scene_OneUseCheat;

MATTIE.scenes.Scene_OneUseCheat.prototype.initialize = function() {
    MATTIE.scenes.Scene_DevItems.prototype.initialize.call(this);
};

//override the on item ok function to give the item then return to the previous scene closing the cheat menu.
MATTIE.scenes.Scene_OneUseCheat.prototype.onItemOk = function() {
    MATTIE.scenes.Scene_DevItems.prototype.onItemOk.call(this);
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

//a poorly written function that gives a typing affect to the text. deleting till the current text matches then typing the rest.
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

MATTIE.scenes.emptyScroll.prototype = Object.create(MATTIE.scenes.Scene_OneUseCheat.prototype);
MATTIE.scenes.emptyScroll.prototype.constructor = MATTIE.scenes.emptyScroll;

MATTIE.scenes.emptyScroll.prototype.initialize = function() {
    MATTIE.scenes.Scene_OneUseCheat.prototype.initialize.call(this);
};

MATTIE.scenes.emptyScroll.prototype.create = function() {
     MATTIE.scenes.Scene_OneUseCheat.prototype.create.call(this);
};

MATTIE.scenes.emptyScroll.prototype.createHelpWindow = function() {
    this._helpWindow = new MATTIE.windows.emptyScrollHelpWindow(1);
    this._helpWindow.setText("O Lord, Give, ");
    this.addWindow(this._helpWindow);
    this._helpWindow.refresh();
};




/**
 * Scene_CheatSkill
 * A scene that extends the skill scene intended for dev work / cheating
 * @extends Scene_Skill
 */
MATTIE.scenes.Scene_DevSkill = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.scenes.Scene_DevSkill.prototype = Object.create(Scene_Skill.prototype);
MATTIE.scenes.Scene_DevSkill.prototype.constructor = MATTIE.scenes.Scene_DevSkill;

MATTIE.scenes.Scene_DevSkill.prototype.initialize = function() {
    Scene_Skill.prototype.initialize.call(this);
};


//override skills display window creation to use our window
MATTIE.scenes.Scene_DevSkill.prototype.createItemWindow = function() {
    var wx = 0;
    var wy = this._statusWindow.y + this._statusWindow.height;
    var ww = Graphics.boxWidth;
    var wh = Graphics.boxHeight - wy;
    this._itemWindow = new MATTIE.windows.Window_DevSkillList(wx, wy, ww, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this._skillTypeWindow.setSkillWindow(this._itemWindow);
    this.addWindow(this._itemWindow);
};

//override. This is the function that actually uses the skill, cus skills are "items"
//we want to always select an actor to teach the skill to
MATTIE.scenes.Scene_DevSkill.prototype.determineItem = function() {
    var action = new Game_Action(this.user());
    var item = this.item();
    action.setItemObject(item);
    this.showSubWindow(this._actorWindow);
    this._actorWindow.selectForItem(this.item());
};


MATTIE.scenes.Scene_DevSkill.prototype.onActorOk = function() {
    /** @type {Game_Actor} */
    let actor = this.user();
    actor.learnSkill(this.item().id);
    this.hideSubWindow(this._actorWindow);
    this._itemWindow.activate();
};

/**
 * Window_DevSkillList
 * @description a window that displays all skills in the game, intended for dev use.
 * @extends Window_SkillList
 */
MATTIE.windows.Window_DevSkillList = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.windows.Window_DevSkillList.prototype = Object.create(Window_SkillList.prototype);
MATTIE.windows.Window_DevSkillList.prototype.constructor = MATTIE.windows.Window_DevSkillList;

MATTIE.windows.Window_DevSkillList.prototype.initialize = function(x, y, width, height) {
    Window_SkillList.prototype.initialize.call(this, x, y, width, height);
    this.setActor($gameParty.leader());
    this.refresh()
};
//override to return all skills. We return the skills with icons first
MATTIE.windows.Window_DevSkillList.prototype.makeItemList = function() {
    let allSkills = $dataSkills.filter((skill) => skill!=null);
    let skillsWithIcons = allSkills.filter((skill) => skill.iconIndex != 0);
    let skillsWithoutIcons = allSkills.filter((skill) => skill.iconIndex == 0);
    //skillsWithIcons = skillsWithIcons.sort((skill1,skill2)=>(skill1.mpCost < skill2.mpCost)? 1 : (skill1.mpCost < skill2.mpCost)? -1: 0 ) //then sort by mp cost;
    let orderedSkills = skillsWithIcons.concat(skillsWithoutIcons);
    this._data = orderedSkills;
};
//by default this function checks against the actor to get the cost, we need to check against the skill's data instead
MATTIE.windows.Window_DevSkillList.prototype.drawSkillCost = function(skill, x, y, width) {
    if (skill.tpCost > 0) {
        this.changeTextColor(this.tpCostColor());
        this.drawText(skill.tpCost, x, y, width, 'right');
    } else if (skill.mpCost > 0) {
        this.changeTextColor(this.mpCostColor());
        this.drawText(skill.mpCost, x, y, width, 'right');
    }
};
//we wand all skills to be enabled
Window_SkillList.prototype.isEnabled = function(item) {
    return true;
};




/**
 * Scene_DevActors
 * @description a scene to spawn in or remove actors
 * @extends Scene_MenuBase
 */
MATTIE.scenes.Scene_DevActors = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.scenes.Scene_DevActors.prototype = Object.create(Scene_MenuBase.prototype);
MATTIE.scenes.Scene_DevActors.prototype.constructor = MATTIE.scenes.Scene_DevActors;

MATTIE.scenes.Scene_DevActors.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

MATTIE.scenes.Scene_DevActors.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    for (let index = 0; index < $dataActors.length; index++) {
        $gameActors.actor(index);
    }
    this._actorWindow = new MATTIE.windows.Window_AllStatus(0,0);
    this._actorWindow.loadImages();
    this._actorWindow.reserveFaceImages()
    this._actorWindow.setFormationMode(false);
    this._actorWindow.selectLast();
    this._actorWindow.activate();
    this._actorWindow.refresh();
    this.addWindow(this._actorWindow);
    this._actorWindow.setHandler("cancel", ()=>{SceneManager.pop()})
    this._actorWindow.setHandler("ok", MATTIE.scenes.Scene_DevActors.prototype.onActorOk.bind(this))
};

MATTIE.scenes.Scene_DevActors.prototype.onActorOk = function(){
    let actor = $gameActors.actor(this._actorWindow.index());
    if($gameParty.allMembers().includes(actor)){
        $gameParty.removeActor(actor._actorId)
    }else{
        if(actor.hp <= 0){//resurrect actor if dead
            actor.setHp(1);
            actor.revive();
        }
        $gameParty.addActor(actor._actorId);
    }
    this._actorWindow.activate();
    this._actorWindow.refresh();
}

/**
 * Scene_ForceActors
 * @description a scene to change what actor you are
 * @extends Scene_DevActors
 */
MATTIE.scenes.Scene_ForceActors = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.scenes.Scene_ForceActors.prototype = Object.create(MATTIE.scenes.Scene_DevActors.prototype);
MATTIE.scenes.Scene_ForceActors.prototype.constructor = MATTIE.scenes.Scene_ForceActors;

MATTIE.scenes.Scene_ForceActors.prototype.initialize = function() {
    MATTIE.scenes.Scene_DevActors.prototype.initialize.call(this);
};

MATTIE.scenes.Scene_ForceActors.prototype.onActorOk = function(){
    let actor = $gameActors.actor(this._actorWindow.index());
    if(actor) MATTIE.actorAPI.changeMainChar(actor._actorId);
    this._actorWindow.activate();
    this._actorWindow.refresh();
}

/**
 * Window_AllStatus
 * @description a window that displays all actors
 * @extends Window_MenuStatus
 */
MATTIE.windows.Window_AllStatus = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.windows.Window_AllStatus.prototype = Object.create(Window_MenuStatus.prototype);
MATTIE.windows.Window_AllStatus.prototype.constructor = MATTIE.windows.Window_AllStatus;

MATTIE.windows.Window_AllStatus.prototype.initialize = function(x,y) {
    Window_MenuStatus.prototype.initialize.call(this,x,y);
    this.last = 0;
    this.refresh();
};


MATTIE.windows.Window_AllStatus.prototype.maxItems = function() {
    return $dataActors.length;
};

MATTIE.windows.Window_AllStatus.prototype.drawItemImage = function(index) {
    var actor = $gameActors.actor(index) || $gameActors.actor(15);
    var rect = this.itemRect(index);
    this.changePaintOpacity(actor.isBattleMember());
    this.drawActorFace(actor, rect.x + 1, rect.y + 1, Window_Base._faceWidth, Window_Base._faceHeight);
    this.changePaintOpacity(true);
};

MATTIE.windows.Window_AllStatus.prototype.drawItemStatus = function(index) {
    var actor = $gameActors.actor(index) || $gameActors.actor(15);
    var rect = this.itemRect(index);
    var x = rect.x + 162;
    var y = rect.y + rect.height / 2 - this.lineHeight() * 1.5;
    var width = rect.width - x - this.textPadding();
    this.drawActorSimpleStatus(actor, x, y, width);
};

MATTIE.windows.Window_AllStatus.prototype.processOk = function() {
    Window_Selectable.prototype.processOk.call(this);
    this.last = this.index();
};

MATTIE.windows.Window_AllStatus.prototype.isCurrentItemEnabled = function() {
    if (this._formationMode) {
        var actor = $gameActors.actor(this.index()) || $gameActors.actor(15);
        return actor && actor.isFormationChangeOk();
    } else {
        return true;
    }
};

MATTIE.windows.Window_AllStatus.prototype.selectLast = function() {
    this.select(this.last || 0);
};

MATTIE.windows.Window_AllStatus.prototype.loadImages = function() {
    $gameActors._data.forEach(function(actor) {
        if(actor)
        ImageManager.reserveFace(actor.faceName());
    }, this);
};

MATTIE.windows.Window_AllStatus.prototype.drawActorName = function(actor, x, y, width) {
    width = width || 168;
    this.changeTextColor(this.hpColor(actor));
    this.drawText(actor.name(), x-100, y+200, width);
};

MATTIE.windows.Window_AllStatus.prototype.reserveFaceImages = function() {
    $gameActors._data.forEach(function(actor) {
        if(actor)
        ImageManager.reserveFace(actor.faceName());
    }, this);
};