var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.RPG = MATTIE.RPG || {};

MATTIE.multiplayer.moveStraight = Game_CharacterBase.prototype.moveStraight;
Game_CharacterBase.prototype.moveStraight = function(d,callAnyways=false) {
    
    if(this instanceof Game_Event){
        if(MATTIE.multiplayer.isEnemyHost || callAnyways) MATTIE.multiplayer.moveStraight.call(this, d);
        if(MATTIE.multiplayer.isEnemyHost && !callAnyways){
            if(MATTIE.multiplayer.devTools.moveLogger){
            console.log("move straight: " + d)
            console.log("event id: " + this.eventId())
            }
            let obj = {};
        
            obj.id = this.eventId();
            obj.x = this._x;
            obj.y = this._y;
            obj.realX = this._realX;
            obj.realY = this._realY;
            obj.d = d;
            //if this thing is not handled somewhere else
            if(MATTIE.multiplayer.devTools.cmdLogger)
            console.log(`Game_Event ${obj.id} has moved with data: ${JSON.stringify(obj)}`)
            let netController = MATTIE.multiplayer.getCurrentNetController();
            netController.emitEventMoveEvent(obj)
        }

    } else {
        MATTIE.multiplayer.moveStraight.call(this, d);
    }
};

// MATTIE.RPG.processMoveCommand = Game_Character.prototype.processMoveCommand;
// Game_Event.prototype.processMoveCommand = function (target) {
//     if((MATTIE.multiplayer.isHost || !MATTIE.multiplayer.isActive) && !this.isCollidedWithPlayerCharacters(this.x,this.y))
//     MATTIE.RPG.processMoveCommand.call(this,target);
// }


// MATTIE.RPG.gameCharSetup = Game_Character.prototype.processMoveCommand;
// Game_Event.prototype.processMoveCommand = function () {

// }

// MATTIE.RPG.forceMoveRoute = Game_Character.prototype.forceMoveRoute;
// Game_Character.prototype.forceMoveRoute = function (moveRoute) {
//     MATTIE.RPG.forceMoveRoute.call(this,moveRoute);
//     if(!(this instanceof Game_Player))
//     if(!(this instanceof Game_Follower))
//     if(!(this instanceof MATTIE.multiplayer.NetFollower))
//     if(!(this instanceof MATTIE.multiplayer.Secondary_Player)){
//         console.log(moveRoute)
//     }
    
// }



// MATTIE.RPG.processMoveCommand = Game_Character.prototype.processMoveCommand;
// Game_Event.prototype.processMoveCommand = function (target,shouldCall=true, shouldCall2=true) {
//     if(shouldCall2)
//     MATTIE.RPG.processMoveCommand.call(this,target);
    
//     if(!(this instanceof Game_Player))
//     if(!(this instanceof Game_Follower))
//     if(!(this instanceof MATTIE.multiplayer.NetFollower))
//     if(!(this instanceof MATTIE.multiplayer.Secondary_Player)){
//         //if(!this.lastTargetCode){this.lastTargetCode=-1}
//         if(shouldCall){
//             target.id = this.eventId();
//             target.x = this._x;
//             target.y = this._y;
//             target.realX = this._realX;
//             target.realY = this._realY;
//             //if this thing is not handled somewhere else
//             if(MATTIE.multiplayer.devTools.cmdLogger)
//             console.log(`Game_Event ${target.id} has moved with data: ${JSON.stringify(target)}`)
//             let netController = MATTIE.multiplayer.getCurrentNetController();
//             netController.emitEventMoveEvent(target)
//         }
        
//         //this.lastTargetCode = target.code;
//     }

    
// }


// //move towards nearest player
// Game_Character.prototype.moveTowardPlayer = function() {
//     console.log("towards player")
//     this.moveTowardCharacter(MATTIE.multiplayer.getNearestPlayer(this._x,this._y));
// };

// //move towards nearest player
// Game_Character.prototype.moveAwayFromPlayer = function() {
//     console.log("away from player")
//     this.moveAwayFromCharacter(MATTIE.multiplayer.getNearestPlayer(this._x,this._y));
// };