//a class to override the base Game_Player to emit their inputs for multiplayer
var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.multiplayer.gamePlayer = MATTIE.multiplayer.gamePlayer || {};



MATTIE.multiplayer.gamePlayer.override = function() {
    console.info('--emitter overrides initialized--')
    MATTIE.multiplayer.gamePlayer.executeMove = Game_Player.prototype.executeMove;
    Game_Player.prototype.executeMove = function (direction) {
        MATTIE.multiplayer.gamePlayer.executeMove.call(this, direction);
        if(MATTIE.multiplayer.isClient){
            MATTIE.multiplayer.clientController.emitMoveEvent(direction);
        } else if(MATTIE.multiplayer.isHost){
            MATTIE.multiplayer.hostController.emitMoveEvent(direction);
        }
    }


    MATTIE.RPG.SceneMap_MainUpdate = Scene_Map.prototype.updateMain;
    Scene_Map.prototype.updateMain = function () {
        MATTIE.RPG.SceneMap_MainUpdate.call(this)
        let netController = MATTIE.multiplayer.getCurrentNetController();
            for(key in netController.netPlayers){
                let netPlayer = netController.netPlayers[key];
                let localPlayer = netPlayer.$gamePlayer;
                if(localPlayer){
                    localPlayer.update(SceneManager._scene.isActive());
                }
        }
    }
}

