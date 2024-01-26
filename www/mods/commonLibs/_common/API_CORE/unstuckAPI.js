/**
 * @namespace MATTIE.unstuckAPI
 * @description The api that handles everything related to providing ways to get unstuck in the event of errors
 * One of the biggest features is the ability to switch any currently running attorn events to be parallel instead.
 */
MATTIE.unstuckAPI = MATTIE.unstuckAPI || {};

/**
 *  @description whether player free move is toggled on or off. that is whether players can move regardless of msgbox and such
 * 	Multiplayer will turn this on by default
 * */
MATTIE.unstuckAPI.playerFreeMove = false;

/**
 *  @description whether once every time an area loads unstuck will run
 * */
MATTIE.unstuckAPI.autoUnstuckOn = false;

/**
 * @description convert all currently running autorun events to parallel events --there by breaking out of any blocking loop
 * @param {int} repairInMs if provided after this many milliseconds, revert the changes made, repairing the map to its original state.
 * @param {boolean} sequential whether to move all of these to be parallel sequentially on the same interpreter (usually a good idea)
 */
MATTIE.unstuckAPI.convertRunningAutorunToParallel = function (repairInMs = -1, sequential = true) {
	const autoRunEvents = MATTIE.util.getAllAutoRunEvents();

	const interpreter = new Game_Interpreter();
	interpreter.setup($gameMap._interpreter._list, $gameMap._interpreter._eventId); // transfer list from main interpreter to secondary
	const pages = [];
	for (let index = 0; index < autoRunEvents.length; index++) {
		const event = autoRunEvents[index];
		event._trigger = 4; // set to parallel
		event._starting = false;
		event.sequential = sequential;

		// set the page's trigger and create an interpreter for it since it is now parellel and needs one
		if (event.page()) {
			if (event.page().trigger === 3) {
				event.page().trigger = 4;
				pages.push(event.page());
				event._interpreter = sequential ? interpreter : new Game_Interpreter(); // give us a new interpreter for the parellel event
			}
		}
		event.refresh();
	}

	if (repairInMs > 0) { // if we should repair or not
		setTimeout(() => {
			// cleanup everything done above
			for (let index = 0; index < autoRunEvents.length; index++) {
				const event = autoRunEvents[index];

				if (event.page()) { if (event.page().trigger === 4) event._trigger = 3; } else { event._trigger = null; } // this is likely unneeded
				event._starting = false;
				event._interpreter = null;
				event.refresh();
			}
			pages.forEach((page) => {
				page.trigger = 3;
			});
		}, repairInMs);
	}

	// clear our main interpreter
	$gameMap._interpreter.clear();
	$gameMap._interpreter._list = null;
};

/**
 * @deprecated
 * @description convert all currently running autorun events to non-blocking autorun events, that is make them run on a different interpreter than the
 * main map interpreter
 * @param {int} repairInMs if provided after this many milliseconds, revert the changes made, repairing the map to its original state.
 * @param {Game_Interpreter} interpreter the interpreter to run these events on
 */
MATTIE.unstuckAPI.convertRunningAutorunToNonBlockingAutorun = function (repairInMs = -1, interpreter = new Game_Interpreter()) {
	const autoRunEvents = MATTIE.util.getAllAutoRunEvents();

	// override the update interpreter method to also update our secondary interpreter
	const oldUpdate = Game_Map.prototype.updateInterpreter;
	Game_Map.prototype.updateInterpreter = function () {
		oldUpdate.call(this);
		this.updateSecondary(interpreter);
	};

	const pages = [];
	for (let index = 0; index < autoRunEvents.length; index++) {
		const event = autoRunEvents[index];

		event._starting = false; // restart event
		event.secondaryInterpreter = interpreter; // setup our other interpreter
		event.refresh();
	}

	if (repairInMs > 0) { // if we should repair or not
		setTimeout(() => {
			// cleanup everything done above
			for (let index = 0; index < autoRunEvents.length; index++) {
				const event = autoRunEvents[index];
				event._starting = true;
				event.secondaryInterpreter = null;
				event.refresh();
			}

			// cleanup our override
			Game_Map.prototype.updateInterpreter = function () {
				oldUpdate.call(this);
			};
		}, repairInMs);
	}

	$gameMap._interpreter.clear(); // clear the main map interpreter to exit any current blocking commands
	$gameMap._interpreter._list = null;
};

/**
 * @description A method that will try everything I can think of to get you unstuck, this might break some stuff, but it should get you unstuck
 * @param {num} t the number of milli seconds before reverting parellel events back to autorun
 */
MATTIE.unstuckAPI.unstuck = function (t = 20000) {
	this.convertRunningAutorunToParallel(t);

	// make sure player is visible, can move and can open menu and save
	MATTIE.fxAPI.showPlayer();
	MATTIE.fxAPI.unlockPlayer();

	// clear images on screen
	$gameScreen.clearPictures();
};

/**
 * @description toggle on or off permanent unstuck, not the best solution either, but decent enough
 * @param {bool} bool; whether to turn it on or off
 */
MATTIE.unstuckAPI.togglePermanentUnstuck = function (bool) {
	MATTIE.unstuckAPI.autoUnstuckOn = bool;
	if (bool) {
		this.unstuck(-1);
		if (!this.previousLoadMethod) {
			this.previousLoadMethod = Scene_Map.prototype.onMapLoaded;
		}

		// define that to perserve scope into scene map func
		const that = this;
		Scene_Map.prototype.onMapLoaded = function () {
			that.previousLoadMethod.call(this);
			that.unstuck(-1);
		};
	} else if (this.previousLoadMethod) {
		Scene_Map.prototype.onMapLoaded = this.previousLoadMethod;
		this.previousLoadMethod = undefined;
	}
};
/**
 * @description allow all entities derived from players to move freely even durring cut scenes and msgs
 * this does not apply to choice msgs
 * @param {bool} bool on or off
 */
MATTIE.unstuckAPI.togglePlayerFreeMove = function (bool) {
	this.playerFreeMove = bool;
	const that = this;
	if (bool) {
		if (!this.prevPlayerCanMove) {
			this.prevPlayerCanMove = Game_Player.prototype.canMove;
			Game_Player.prototype.canMove = function () {
				return !$gameMessage.isChoice() || that.prevPlayerCanMove.call(this);
			};
		}
	} else if (this.prevPlayerCanMove) {
		Game_Player.prototype.canMove = this.prevPlayerCanMove;
	}
};

/**
 * @description an alias of MATTIE.unstuckAPI.unstuck meant for being called from console
 * @alias MATTIE.unstuckAPI.unstuck
 */
function unstuck() {
	MATTIE.unstuckAPI.unstuck();
}

//-----------------------------------------------
// Engine Overrides
//-----------------------------------------------

/**
 * @deprecated
 * @description override the setupstartingmap event to allow us to pass the interpreter we would like the event to run on through the event
 * @returns {boolean}
 */
Game_Map.prototype.setupStartingMapEventSecondaries = function () {
	var events = this.events();
	for (var i = 0; i < events.length; i++) {
		var event = events[i];
		if (event.isStarting()) {
			event.clearStartingFlag();
			const interpreter = event.secondaryInterpreter;
			if (interpreter) { interpreter.setup(event.list(), event.eventId()); }
			return true;
		}
	}
	return false;
};

/** @deprecated */
Game_Map.prototype.updateSecondary = function (interpreter) {
	for (;;) {
		interpreter.update();
		if (interpreter.isRunning()) {
			return;
		}
		if (interpreter.eventId() > 0) {
			this.unlockEvent(interpreter.eventId());
			interpreter.clear();
		}
		if (!this.setupStartingMapEventSecondaries()) {
			return;
		}
	}
};

/** @description the base game event start method */
MATTIE_RPG.Game_Event_start = Game_Event.prototype.start;
/**
 * @description override the start method to record when it started
 */
Game_Event.prototype.start = function () {
	MATTIE_RPG.Game_Event_start.call(this);
	this.lastRan = new Date().getTime();
};
/**
 * @description returns whether this event has ran within the last x milli seconds
 * @param {int} x how many miliseconds to check
 * @returns {boolean} whether the above statement is true or not
 *
 */
Game_Event.prototype.ranWithinSec = function (x) {
	if (this.lastRan) {
		return this.lastRan + x >= new Date().getTime();
	}
	return false;
};

/** @description the base updateParallel method */
MATTIE_RPG.Game_Event_updateParallel = Game_Event.prototype.updateParallel;
/**
 * @description override the update parallel method to refresh the event if it is a sequential parallel event.
 * We need to do this as parallel events trigger every frame but refresh does not trigger fast enough to keep up with those changes when we are dealing with
 * sequential parallel events
 * @override
 */
Game_Event.prototype.updateParallel = function () {
	if (this.sequential) this.refresh();
	MATTIE_RPG.Game_Event_updateParallel.call(this);
};

// hook onto on map loaded to update the setting of player free move
(() => {
	const onMapLoaded = Scene_Map.prototype.onMapLoaded;
	Scene_Map.prototype.onMapLoaded = function () {
		onMapLoaded.call(this);
		if(MATTIE.multiplayer){
			if(MATTIE.multiplayer.config)
			MATTIE.unstuckAPI.togglePlayerFreeMove(MATTIE.multiplayer.config.freeMove);
		}
		
	};
})();

// hook onto event start to check if it is auto run and make the player release their movement keys if it is
// (() => {
// 	let lastHitTouchEvent = 0;
// 	let lastMsg = 0;
// 	const start = Game_Event.prototype.start;
// 	Game_Event.prototype.start = function () {
// 		start.call(this);

// 		// if the player has recently triggered a touch event and an auto run event runs
// 		if (this._trigger === 3 && (Date.now() - lastHitTouchEvent < 200)) {
// 			// is auto run

// 			// release all keys
// 			Input._currentState = [];
// 		} else if (this._trigger === 1) {
// 			// player touch
// 			lastHitTouchEvent = Date.now();
// 		}
// 	};

// 	// override the message system to stop the player if its recent
// 	const add = Game_Message.prototype.add;
// 	Game_Message.prototype.add = function (text) {
// 		add.call(this, text);
// 		if (Date.now() - lastMsg > 5000) {
// 			// release all keys
// 			Input._currentState = [];
// 		}
// 		lastMsg = Date.now();
// 	};

// 	Game_Interpreter.prototype.command230 = function () {
// 		this.wait(this._params[0]);
// 		Input._currentState = [];
// 		return true;
// 	};
// })();
