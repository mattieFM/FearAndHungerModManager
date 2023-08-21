var MATTIE = MATTIE || {};
MATTIE.menus = MATTIE.menus || {};
MATTIE.windows = MATTIE.windows || {};
MATTIE.scenes = MATTIE.scenes || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};


/** return to main menu */
MATTIE.menus.toMainMenu = function(){
    SceneManager.goto(Scene_Title);
}

/** go to mod scene */
MATTIE.menus.toModMenu = function(){
    SceneManager.push(MATTIE.scenes.modLoader);
}

/** go to load scene */
MATTIE.menus.toLoadMenu = function(){
    SceneManager.goto(Scene_Load);
}

/** go to new game menu */
MATTIE.menus.toNewMenu = function(){
    DataManager.setupNewGame();
    SceneManager.goto(Scene_Map);
}


