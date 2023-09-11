//this file overrides the gameover scene to go to a different scene instead when it is navigated to.
//we are doing this rather than overriding the game over event, as the game over event is not used internally. 
var MATTIE = MATTIE || {};
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};

Scene_Gameover.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
    setTimeout(() => {
        SceneManager.goto(MATTIE.scenes.multiplayer.Scene_GameOver);
    }, 1000);
   
};