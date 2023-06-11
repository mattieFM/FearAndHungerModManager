//a class to override the base Game_Player to emit their inputs for multiplayer
var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.multiplayer.gamePlayer = MATTIE.multiplayer.gamePlayer || {};


/**
 * 
 * override all uneccacary methods making them emit events for multiplayer support
 */
MATTIE.multiplayer.gamePlayer.override = function() {
    console.info('--emitter overrides initialized--')

    //override the execute move command
    MATTIE.multiplayer.gamePlayer.executeMove = Game_Player.prototype.executeMove;
    Game_Player.prototype.executeMove = function (direction) {
        MATTIE.multiplayer.gamePlayer.executeMove.call(this, direction);
        if(MATTIE.multiplayer.isClient){
            MATTIE.multiplayer.clientController.emitMoveEvent(direction);
        } else if(MATTIE.multiplayer.isHost){
            MATTIE.multiplayer.hostController.emitMoveEvent(direction);
        }
    }


    //override the update main command to make all netPlayers update at the same time as though they were Game_Player
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


    //create an objet to sure transfer data
    MATTIE.multiplayer.renderer.currentTransferObj = {};
    
    //override reserve transfer to also store its data in our obj
    MATTIE.RPG.reserveTransfer = Game_Player.prototype.reserveTransfer;
    Game_Player.prototype.reserveTransfer = function(mapId, x, y, d, fadeType){
        MATTIE.RPG.reserveTransfer.call(this, mapId, x, y, d, fadeType);
        if(MATTIE.multiplayer.isActive){
                MATTIE.multiplayer.renderer.currentTransferObj = {};
                MATTIE.multiplayer.renderer.currentTransferObj.transfer = {};
                MATTIE.multiplayer.renderer.currentTransferObj.transfer.x = x;
                MATTIE.multiplayer.renderer.currentTransferObj.transfer.y = y;
                MATTIE.multiplayer.renderer.currentTransferObj.transfer.map = mapId;
        }
    }

    //override performTransfer to emit events with the data we stored
    MATTIE.RPG.performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function(){
        MATTIE.RPG.performTransfer.call(this);
        if(MATTIE.multiplayer.isActive){
            let netController = MATTIE.multiplayer.getCurrentNetController();
            netController.emitTransferEvent(MATTIE.multiplayer.renderer.currentTransferObj)
        }
        
    }

    MATTIE.RPG.sceneMapOnLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function () {
        MATTIE.RPG.sceneMapOnLoaded .call(this);
        if(MATTIE.multiplayer.isActive){
            MATTIE.multiplayer.renderer.currentTransferObj = {};
            MATTIE.multiplayer.renderer.currentTransferObj.transfer = {};
            MATTIE.multiplayer.renderer.currentTransferObj.transfer.x = $gamePlayer.x;
            MATTIE.multiplayer.renderer.currentTransferObj.transfer.y = $gamePlayer.y;
            MATTIE.multiplayer.renderer.currentTransferObj.transfer.map = $gameMap.mapId();
            let netController = MATTIE.multiplayer.getCurrentNetController();
            netController.emitTransferEvent( MATTIE.multiplayer.renderer.currentTransferObj)
        }
    }
}

