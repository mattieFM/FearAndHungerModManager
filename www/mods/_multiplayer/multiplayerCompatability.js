(() => {
	// fully override wait mode to make it not get stuck on some thing
	// Game_Interpreter.prototype.updateWaitMode = function () {
	// 	var waiting = false;
	// 	switch (this._waitMode) {
	// 	// disable messgae waiting
	// 	// case 'message':
	// 	// 	waiting = $gameMessage.isBusy();
	// 	// 	break;
	// 	case 'transfer':
	// 		waiting = $gamePlayer.isTransferring();
	// 		break;
	// 	case 'scroll':
	// 		waiting = $gameMap.isScrolling();
	// 		break;
	// 	case 'route':
	// 		waiting = this._character.isMoveRouteForcing();
	// 		break;
	// 	case 'animation':
	// 		waiting = this._character.isAnimationPlaying();
	// 		break;

	// 	case 'action':
	// 		waiting = BattleManager.isActionForced();
	// 		break;

	// 	case 'video':
	// 		waiting = Graphics.isVideoPlaying();
	// 		break;
	// 	case 'image':
	// 		waiting = !ImageManager.isReady();
	// 		break;
	// 	}
	// 	if (!waiting) {
	// 		this._waitMode = '';
	// 	}
	// 	return waiting;
	// };

	// // set a limit for how long a move route can force
	// Game_Character.prototype.isMoveRouteForcing = function () {
	// 	return this._moveRouteForcing;
	// };

	// override the canMove method to allow the player to always move if they are holding shift
	const Player_CanMove = Game_Player.prototype.canMove;
	Game_Player.prototype.canMove = function () {
		return Player_CanMove.call(this) || Input._currentState.shift;
	};
})();
