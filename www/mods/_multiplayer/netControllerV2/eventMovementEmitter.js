var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.RPG = MATTIE.RPG || {};

// override the process move command function to record the last 20 commands
MATTIE.multiplayer.processMoveCmd = Game_Character.prototype.processMoveCommand;
Game_Character.prototype.processMoveCommand = function (command) {
	if (!this.last20Commands) this.last20Commands = [];
	if (this.last20Commands.length > 20) this.last20Commands.shift();
	this.last20Commands.push(command);
	MATTIE.multiplayer.processMoveCmd.call(this, command);
};

// override the force move route cmd to check if it hasnt alreay been run
MATTIE.multiplayer.forceMoveRoute = Game_Event.prototype.forceMoveRoute;
Game_Event.prototype.forceMoveRoute = function (moveRoute) {
	// console.log(moveRoute);
	if (this.getValidMove(moveRoute)) { MATTIE.multiplayer.forceMoveRoute.call(this, moveRoute); } else {
		this._moveRouteForcing = false;
	}

	// this will cause big mahabre lag
	// setTimeout(() => {
	// 	this._moveRouteForcing = false;
	// }, 15000);
};

/**
 * @description check if a move route has not already been performed
 * @param {*} moveRoute
 */
Game_Character.prototype.getValidMove = function (moveRoute) {
	//this might be causing mehabre lag
	if(Graphics._fpsMeter.fps < 30) return true;
	if (moveRoute.list.every((obj) => obj.code === 0)) return true;

	if (!this.last20Commands) this.last20Commands = [];
	const last20Steps = this.last20Commands;

	if (last20Steps.every((obj) => obj.code === 0)) return true;
	const list = moveRoute.list;

	if (!list) {
		return true;
	}

	let found = false;
	// whether the move is a duplicate
	let validMove = last20Steps.length <= 0;
	let shouldContinue = true;

	let foundOnce = false;
	// console.log(list);
	// console.log(last20Steps);
	for (let index = last20Steps.length - 1; index > 0 && !found; index--) {
		const element = last20Steps[index];
		// go from the back of the list to the front till we find a code identical to the last code of our list
		if (element.code
			=== list[list.length - 1].code) {
			found = true;
			foundOnce = true;

			let k = list.length - 1;
			const j = 0;
			const tolerance = 1;
			let misses = 0;
			let hits = 0;

			while (shouldContinue) {
				if (k <= 0 && hits >= list.length - 1) {
					shouldContinue = false;
					validMove = true;
					// console.log('valid by exasughtion');
				} else {
					const currentElement = list[k];
					const historicalElement = last20Steps[index];

					if (currentElement.code != historicalElement) {
						misses++;
						if (misses >= tolerance) {
							shouldContinue = false;
							found = false;
							misses = 0;
							hits = 0;
						}
					} else {
						hits++;
					}

					index--;
					k--;
				}
			}
			shouldContinue = true;
		}

		if (foundOnce && index <= 0) {
			validMove = true;
			// valid by never finding the start
			// console.log('valid by never finding the start');
		}
	}

	return validMove;
};

MATTIE.multiplayer.moveStraight = Game_CharacterBase.prototype.moveStraight;
Game_Event.prototype.moveStraight = function (d, callAnyways = false) {
	// console.log(`moved with${d}`);
	if (!MATTIE.multiplayer.inBattle) {
		if (MATTIE.multiplayer.isEnemyHost || callAnyways || this._moveRouteForcing) MATTIE.multiplayer.moveStraight.call(this, d);
		if (MATTIE.multiplayer.isEnemyHost && !callAnyways && !this._moveRouteForcing) { // dont send if move route forcing
			if (MATTIE.multiplayer.devTools.enemyMoveLogger) {
				console.debug(`move straight: ${d}`);
				console.debug(`event id: ${this.eventId()}`);
			}
			const obj = {};

			obj.mapId = this._mapId;
			obj.id = this.eventId();
			obj.x = this._x;
			obj.y = this._y;
			obj.realX = this._realX;
			obj.realY = this._realY;
			obj.d = d;
			// if this thing is not handled somewhere else
			if (MATTIE.multiplayer.devTools.cmdLogger) console.debug(`Game_Event ${obj.id} has moved with data: ${JSON.stringify(obj)}`);
			const netController = MATTIE.multiplayer.getCurrentNetController();
			netController.emitEventMoveEvent(obj);
		}
	}
};

MATTIE.multiplayer.Game_EventCanPass = Game_Event.prototype.canPass;
Game_Event.prototype.canPass = function (x, y, d) {
	var res = MATTIE.multiplayer.Game_EventCanPass.call(this, x, y, d);
	if (this._trueLock) return false;
	return res;
};

// override the near screen function to check if it is within 10 of any player
Game_CharacterBase.prototype.isNearTheScreen = function () {
	var nearestPlayer = MATTIE.multiplayer.getNearestPlayer(this.x, this.y);
	var dis = Math.abs(this.deltaXFrom(nearestPlayer.x));
	dis += Math.abs(this.deltaYFrom(nearestPlayer.y));
	return dis < 10;
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
