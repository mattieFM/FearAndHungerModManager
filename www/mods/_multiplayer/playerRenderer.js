var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};

MATTIE.RPG = MATTIE.RPG || {};

//todo:documentation and make stuff pretty


MATTIE.multiplayer.Secondary_Player =  function () {
    this.initialize.apply(this, arguments);
}

MATTIE.multiplayer.Secondary_Player.prototype = Object.create(Game_Player.prototype);
MATTIE.multiplayer.Secondary_Player.prototype.constructor = MATTIE.multiplayer.Secondary_Player;

MATTIE.RPG.gamePlayerUpdate = Game_Player.prototype.update;
MATTIE.multiplayer.Secondary_Player.prototype.update = function () {
    MATTIE.RPG.gamePlayerUpdate.call(this);
    console.log("hiya")
}

MATTIE.RPG.spriteSetMap_CreateChars =Spriteset_Map.prototype.createCharacters;
Spriteset_Map.prototype.createCharacters = function() {
    this.playersSprites = [];
    MATTIE.RPG.spriteSetMap_CreateChars.call(this);
    let mattieI = 0;
    for(key in MATTIE.multiplayer.netController.connections){
        const conn = MATTIE.multiplayer.netController.connections[key];
        let player = conn.name;
        conn.$gamePlayer = new MATTIE.multiplayer.Secondary_Player();
        let p2 = conn.$gamePlayer;

        //TODO: figure out what the fuck this shit does we need it. but idk
        p2.reserveTransfer($gameMap.mapId(), $gamePlayer.x,$gamePlayer.y); 
        
        p2.x = $gamePlayer.x;
        p2.y = $gamePlayer.y;
        mattieI++;
        setTimeout(() => {
            p2.name = player;
            p2.setTransparent(false);
            p2.refresh();
            p2.update(true)
            p2.performTransfer()
            p2.update(true);
            p2.refresh();
        }, 2000);
        
        this.playersSprites.push(new Sprite_Character(p2));
    }
    
    this._characterSprites.concat(this.playersSprites)

    
    for (var i = 0; i < this.playersSprites.length; i++) {
        this._tilemap.addChild(this.playersSprites[i]);
    }
};

MATTIE.RPG.processMoveCommand = Game_Character.prototype.processMoveCommand;
//todo: cheat a little and tp the players every now and again to account for them getting slightly off due to move speed acceleration from frame changes.
//so send x and y sometimes or mabye on a different event or just a time to fix any slight offsets.
Game_Character.prototype.processMoveCommand = function(command) {
    MATTIE.RPG.processMoveCommand.call(this, command);
    console.log(command.code)
    if(command.code){
        let obj = {};
        obj.move = {};
        obj.move.command = command.code;
        netController.clientToHost.send(obj);
    }
    
}

MATTIE.RPG.SceneMap_MainUpdate = Scene_Map.prototype.updateMain;

Scene_Map.prototype.updateMain = function () {
    MATTIE.RPG.SceneMap_MainUpdate.call(this)
    for(key in MATTIE.multiplayer.netController.connections){
        let conn = MATTIE.multiplayer.netController.connections[key];
        let player = conn.$gamePlayer;
        player.update();
    }
}


// Game_Player.prototype.update = function(){
//     MATTIE.RPG.gamePlayerUpdate.call(this);
//     // for(key in MATTIE.multiplayer.netController.connections){
//     //     let conn = MATTIE.multiplayer.netController.connections[key];
//     //     let player = conn.$gamePlayer;
//     //     player.update();
//     // }
// }

// MATTIE.RPG.moveByInput = Game_Player.prototype.moveByInput;
// Game_Player.prototype.moveByInput = function() {
//     if (!this.isMoving() && this.canMove()) {
//         var direction = this.getInputDirection();
        
//         if (direction > 0) {
//             $gameTemp.clearDestination();
//         } else if ($gameTemp.isDestinationValid()){
//             var x = $gameTemp.destinationX();
//             var y = $gameTemp.destinationY();
//             direction = this.findDirectionTo(x, y);
//         }
//         if (direction > 0) {
//             var obj = {};
//             obj.move = direction;
//             netController.clientToHost.send(obj);
//             this.executeMove(direction);
//         }
//     }
// };


// MATTIE.RPG.inputUpdate = Input.update;
// Input.update = function () {
//     try {
//         MATTIE.RPG.inputUpdate.call(this);
//         let obj = {};
//         obj.move = {};
//         obj.move.x = $gamePlayer.x;
//         obj.move.y = $gamePlayer.y;
//         //netController.clientToHost.send(obj);
//     } catch (error) {
        
//     }
    
// }