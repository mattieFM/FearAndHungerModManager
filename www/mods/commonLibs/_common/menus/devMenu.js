MATTIE.devTools = MATTIE.devTools || {};
MATTIE.menus = MATTIE.menus || {};
MATTIE.windows = MATTIE.windows || {};
MATTIE.scenes = MATTIE.scenes || {};

// Text Manager definitions
TextManager.ItemCheatTab = 'Items';
MATTIE.CmdManager.ItemCheatTab = 'MATTIE_ITEM_CHEAT';
TextManager.SkillCheatTab = 'Skills';
MATTIE.CmdManager.SkillCheatTab = 'MATTIE_Skill_CHEAT';
TextManager.ActorCheatTab = 'Actors';
MATTIE.CmdManager.ActorCheatTab = 'MATTIE_ACTORS_CHEAT';
TextManager.debugCheatTab = 'Debug';
MATTIE.CmdManager.debugCheatTab = 'MATTIE_DEBUG_CHEAT';
TextManager.miscCheatTab = 'Misc';
MATTIE.CmdManager.miscCheatTab = 'MATTIE_MISC_CHEAT';
TextManager.test = 'Test';
MATTIE.CmdManager.test = 'test';

// Scene_Dev_Menu
//
// The scene class of the dev menu screen

MATTIE.scenes.Scene_Dev = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.scenes.Scene_Dev.prototype = Object.create(Scene_Menu.prototype);
MATTIE.scenes.Scene_Dev.prototype.constructor = MATTIE.scenes.Scene_Dev;

MATTIE.scenes.Scene_Dev.prototype.initialize = function () {
	Scene_Menu.prototype.initialize.call(this);
};

MATTIE.scenes.Scene_Dev.prototype.create = function () {
	Scene_MenuBase.prototype.create.call(this);
	this.createCommandWindow();
	this.createGoldWindow();
	this.createStatusWindow();
};
// override the create command window to create a new set of tabs for the menu.
MATTIE.scenes.Scene_Dev.prototype.createCommandWindow = function () {
	this._commandWindow = new MATTIE.windows.Window_DevMenuCommand();
	this._commandWindow.setHandler(MATTIE.CmdManager.ItemCheatTab, MATTIE.scenes.Scene_Dev.prototype.onItemCheatTab.bind(this));
	this._commandWindow.setHandler(MATTIE.CmdManager.SkillCheatTab, MATTIE.scenes.Scene_Dev.prototype.onSkillCheatTab.bind(this));
	this._commandWindow.setHandler(MATTIE.CmdManager.ActorCheatTab, MATTIE.scenes.Scene_Dev.prototype.onActorCheatTab.bind(this));
	this._commandWindow.setHandler(MATTIE.CmdManager.debugCheatTab, MATTIE.scenes.Scene_Dev.prototype.onDebugCheatTab.bind(this));
	this._commandWindow.setHandler(MATTIE.CmdManager.miscCheatTab, MATTIE.scenes.Scene_Dev.prototype.onMiscCheatTab.bind(this));
	this._commandWindow.setHandler('cancel', () => SceneManager.pop());
	this.addWindow(this._commandWindow);
};

// --tab on call functions --
MATTIE.scenes.Scene_Dev.prototype.onItemCheatTab = function () {
	SceneManager.push(MATTIE.scenes.Scene_DevItems);
};
MATTIE.scenes.Scene_Dev.prototype.onSkillCheatTab = function () {
	SceneManager.push(MATTIE.scenes.Scene_DevSkill);
};

MATTIE.scenes.Scene_Dev.prototype.onDebugCheatTab = function () {
	SceneManager.push(Scene_Debug);
};

MATTIE.scenes.Scene_Dev.prototype.onMiscCheatTab = function () {
	SceneManager.push(MATTIE.scenes.Scene_Misc);
};

MATTIE.scenes.Scene_Dev.prototype.onActorCheatTab = function () {
	SceneManager.push(MATTIE.scenes.Scene_DevActors);
};

MATTIE.scenes.Scene_Dev.prototype.onChangeMainActorCheatTab = function () {
	SceneManager.push(MATTIE.scenes.Scene_ForceActors);
};

// Window_DevMenuCommand
//
// The window for selecting a command on the dev menu screen.

MATTIE.windows.Window_DevMenuCommand = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.windows.Window_DevMenuCommand.prototype = Object.create(Window_MenuCommand.prototype);
MATTIE.windows.Window_DevMenuCommand.prototype.constructor = MATTIE.windows.Window_DevMenuCommand;

MATTIE.windows.Window_DevMenuCommand.prototype.initialize = function (x, y) {
	Window_MenuCommand.prototype.initialize.call(this, x, y);
};

// override the width
MATTIE.windows.Window_DevMenuCommand.prototype.windowWidth = function () {
	return 240;
};

MATTIE.windows.Window_DevMenuCommand.prototype.makeCommandList = function () {
	this.addCommand(TextManager.ItemCheatTab, MATTIE.CmdManager.ItemCheatTab, true);
	this.addCommand(TextManager.SkillCheatTab, MATTIE.CmdManager.SkillCheatTab, true);
	this.addCommand(TextManager.ActorCheatTab, MATTIE.CmdManager.ActorCheatTab, true);
	this.addCommand(TextManager.debugCheatTab, MATTIE.CmdManager.debugCheatTab, true);
	this.addCommand(TextManager.miscCheatTab, MATTIE.CmdManager.miscCheatTab, true);
};
