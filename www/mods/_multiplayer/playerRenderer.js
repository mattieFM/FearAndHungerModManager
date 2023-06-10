var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.multiplayer.renderer = MATTIE.multiplayer.renderer || {};
MATTIE.RPG = MATTIE.RPG || {};

//todo:documentation and make stuff pretty

/**
 * @description a class that represents any player that is not the one the user is actively controlling.
 * @extends Game_Player
 */
MATTIE.multiplayer.Secondary_Player =  function () {
    this.initialize.apply(this, arguments);
}

MATTIE.multiplayer.Secondary_Player.prototype = Object.create(Game_Player.prototype);
MATTIE.multiplayer.Secondary_Player.prototype.constructor = MATTIE.multiplayer.Secondary_Player;

MATTIE.multiplayer.Secondary_Player.prototype.initialize = function () {
    this.ctrlDir4 = 0; //start standing still
    Game_Player.prototype.initialize.call(this);
}

/** set the dir4 current control. dir4 is the direction on the arrow keys. */
MATTIE.multiplayer.Secondary_Player.prototype.setDir4 = function(dir4) {
    this.ctrlDir4 = dir4;
}

/** 
 * This function is how the movement controller determines if the player should move in a direction when a movement event is triggered.
 * Might need to be expanded in future to accommodate gamepads
 * @returns
 * 0 if not moving
 * 2 if down
 * 8 if up
 * 6 if right
 * 4 if left
 */
MATTIE.multiplayer.Secondary_Player.prototype.getInputDirection = function() {
    return this.ctrlDir4;
};




MATTIE.RPG.spriteSetMap_CreateChars = Spriteset_Map.prototype.createCharacters;
/** a function that handles overriding the player rendering settings to allow rendering of multiple PCs */
MATTIE.multiplayer.renderer.playerOverrides = function(){
    Spriteset_Map.prototype.createCharacters = function() {
        MATTIE.RPG.spriteSetMap_CreateChars.call(this);
        if(MATTIE.multiplayer.isActive) MATTIE.multiplayer.renderer._createSecondaryChars.call(this);
    };
}
/** render all secondary characters */
MATTIE.multiplayer.renderer._createSecondaryChars = function() {
    console.log('\n\n\n----enter-----\n\n\n')
    this.playersSprites = [];
        let mattieI = 0;
        for(key in MATTIE.multiplayer.netController.players){
            const netPlayer = MATTIE.multiplayer.netController.players[key];
            if(netPlayer.map === $gameMap.mapId()){//only render players on same map
                console.log('\n\n\n----id match-----\n\n\n')
                netPlayer.$gamePlayer = new MATTIE.multiplayer.Secondary_Player();
                let p2 = netPlayer.$gamePlayer;
                
                //TODO: figure out what the fuck this shit does we need it. but idk
                p2.reserveTransfer($gameMap.mapId(), $gamePlayer.x,$gamePlayer.y); 
                p2.performTransfer();
                p2.x = $gamePlayer.x;
                p2.y = $gamePlayer.y;
                mattieI++;
                p2.name = netPlayer.name;
                this.playersSprites.push(new Sprite_Character(p2));
                console.log('\n\n\n----idone-----\n\n\n');
            }
        }
        
        this._characterSprites.concat(this.playersSprites)

        
        for (var i = 0; i < this.playersSprites.length; i++) {
            this._tilemap.addChild(this.playersSprites[i]);
        }
}

/** override the process move function to send data to the host */
MATTIE.multiplayer.renderer.overrideProcessMove = function (){
    MATTIE.RPG.processMoveCommand = Game_Character.prototype.processMoveCommand;
    //todo: cheat a little and tp the players every now and again to account for them getting slightly off due to move speed acceleration from frame changes.
    //so send x and y sometimes or mabye on a different event or just a time to fix any slight offsets.
    Game_Character.prototype.processMoveCommand = function(command) {
        MATTIE.RPG.processMoveCommand.call(this, command);
        if(MATTIE.multiplayer.isClient && MATTIE.multiplayer.isActive){
            if(command.code){
                let obj = {};
                obj.move = {};
                obj.move.command = command.code;
                obj.move.dir4 = Input.dir4;
                if(command.code != 29){//either standing still or speed change I think?
                    netController.sendHost(obj);
                }
                
            }
        }
    }


    MATTIE.multiplayer.renderer.currentTransferObj = {};
    MATTIE.RPG.reserveTransfer = Game_Player.prototype.reserveTransfer;
    Game_Player.prototype.reserveTransfer = function(mapId, x, y, d, fadeType){
        MATTIE.RPG.reserveTransfer.call(this, mapId, x, y, d, fadeType);
        if(MATTIE.multiplayer.isClient && MATTIE.multiplayer.isActive){
            let obj = MATTIE.multiplayer.renderer.currentTransferObj;
                obj = {};
                obj.travel = {};
                obj.travel.cords = {};
                obj.travel.cords.x = x;
                obj.travel.cords.y = y;
                obj.travel.map = mapId;
        }
    }

    MATTIE.RPG.performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function(){
        MATTIE.RPG.performTransfer.call(this);
        if(MATTIE.multiplayer.isClient && MATTIE.multiplayer.isActive)
        MATTIE.multiplayer.netController.sendHost(MATTIE.multiplayer.renderer.currentTransferObj);
    }

    MATTIE.RPG.sceneMapOnLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function () {
        MATTIE.RPG.sceneMapOnLoaded .call(this);
        if(MATTIE.multiplayer.isClient && MATTIE.multiplayer.isActive){
            let obj = {};
                obj.travel = {};
                obj.travel.cords = {};
                obj.travel.cords.x = $gamePlayer.x;
                obj.travel.cords.y = $gamePlayer.x;
                obj.travel.map = $gameMap.mapId();
            MATTIE.multiplayer.netController.sendHost(obj);
        }
    }


    
}


/** override the update map main call to also update secondary players routinely */
MATTIE.multiplayer.renderer.overrideMapUpdateMain = function (){
    MATTIE.RPG.SceneMap_MainUpdate = Scene_Map.prototype.updateMain;
    Scene_Map.prototype.updateMain = function () {
        MATTIE.RPG.SceneMap_MainUpdate.call(this)
        if(MATTIE.multiplayer.isHost && MATTIE.multiplayer.isActive){
            for(key in MATTIE.multiplayer.netController.players){
                let netPlayer = MATTIE.multiplayer.netController.players[key];
                let localPlayer = netPlayer.$gamePlayer;
                if(localPlayer){
                    localPlayer.update();
                }
            }
        }
    }
}

MATTIE.multiplayer.renderer.initialize = function () {
    MATTIE.multiplayer.renderer.playerOverrides.call(this);
    MATTIE.multiplayer.renderer.overrideProcessMove.call(this);
    MATTIE.multiplayer.renderer.overrideMapUpdateMain.call(this);

}