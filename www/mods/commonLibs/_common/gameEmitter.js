var EventEmitter = require('events');

/**
 * @class
 * @description This class hooks onto a ton of game events to give an event-base programming approach via event handlers and subscription models
 * @emits torchActivate the event on a player activating a torch
 * @todo finish this class, right now it does nothing I think
*/

class GameEmitter extends EventEmitter {
	constructor(gameVersion) {
		super();
		/** @description the version of funger that this emitter */
		this.version = gameVersion;
	}

	/** @emits torchActivate */
	emitTorch() {
		this.emit('torchActivate');
	}
}

//--------------------------------------
// Engine overrides
//--------------------------------------

//--------------------------------------
// -Torch Emitter-
//--------------------------------------

MATTIE.gameEmitter = new GameEmitter();
