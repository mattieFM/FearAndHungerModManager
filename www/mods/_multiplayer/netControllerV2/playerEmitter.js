//a class to override the base Game_Player to emit their inputs for multiplayer
var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.multiplayer.gamePlayer = MATTIE.multiplayer.gamePlayer || {};
MATTIE.RPG = MATTIE.RPG || {};


/**
 * 
 * override all uneccacary methods making them emit events for multiplayer support
 */

//every x moves send player x and y to move
MATTIE.multiplayer.selfMoveCount = 0;
MATTIE.multiplayer.selfMax = 15;
//every x moves send player x and y to transfer
MATTIE.multiplayer.selfTransMoveCount = 0;
MATTIE.multiplayer.selfTransMax = 100;


MATTIE.multiplayer.gamePlayer.override = function() {
    console.info('--emitter overrides initialized--')

    //override the execute move command
    MATTIE.multiplayer.gamePlayer.executeMove = Game_Player.prototype.executeMove;
    Game_Player.prototype.executeMove = function (direction) {
        MATTIE.multiplayer.gamePlayer.executeMove.call(this, direction);
        var netController = MATTIE.multiplayer.getCurrentNetController();
        let args = [direction];
        if(MATTIE.multiplayer.selfMoveCount >= MATTIE.multiplayer.selfMax){
            args.push(this.x)
            args.push(this.y)
            MATTIE.multiplayer.selfMoveCount=0;
        }
        if(MATTIE.multiplayer.selfTransMoveCount >= MATTIE.multiplayer.selfTransMax){
            args.push(this.x)
            args.push(this.y)
            args.push(1);
            MATTIE.multiplayer.selfTransMoveCount=0;
        }
        netController.emitMoveEvent(...args);
        MATTIE.multiplayer.selfMoveCount++;
        MATTIE.multiplayer.selfTransMoveCount++;
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
        MATTIE.multiplayer._interpreter.update();
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

    //override the function that triggers when the scene map is fully loaded
    MATTIE.RPG.sceneMapOnLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function () {
        //console.log("map loaded")
        MATTIE.RPG.sceneMapOnLoaded .call(this);
        if(MATTIE.multiplayer.isActive){
            MATTIE.multiplayer.renderer.currentTransferObj = {};
            MATTIE.multiplayer.renderer.currentTransferObj.transfer = {};
            MATTIE.multiplayer.renderer.currentTransferObj.transfer.x = $gamePlayer.x;
            MATTIE.multiplayer.renderer.currentTransferObj.transfer.y = $gamePlayer.y;
            MATTIE.multiplayer.renderer.currentTransferObj.transfer.map = $gameMap.mapId();
            let netController = MATTIE.multiplayer.getCurrentNetController();

            //handle setting the proper actor id when the player loads into a map 
            //this does also allow the main actor changing if we want
            netController.updatePlayerInfo();
            netController.emitTransferEvent( MATTIE.multiplayer.renderer.currentTransferObj)
            MATTIE.multiplayer.setEnemyHost();
        
        }
    }


    //extend the follower change command to emit the event we need
    MATTIE.RPG.partyChangeCommand = Game_Interpreter.prototype.command129;
    Game_Interpreter.prototype.command129 = function (){
            var actor = $gameActors.actor(this._params[0]);
            let returnVal = MATTIE.RPG.partyChangeCommand.call(this);
            if(actor){
                console.info("follower change event")
                MATTIE.multiplayer.getCurrentNetController().updatePlayerInfo();
            }
            return returnVal;
      
        
       
    }



}






