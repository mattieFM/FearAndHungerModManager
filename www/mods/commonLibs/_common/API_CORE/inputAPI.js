var MATTIE = MATTIE || {};
// an api for some input related tasks
/**
 * @namespace MATTIE.infoAPI
 */

MATTIE.inputAPI = {};
/** @description the threshold (in milliseconds) for input to not be held for onLongNoInput to be called */
MATTIE.inputAPI.thresholdForNotInputtingRecently = 500;

/**
 * @description meant to be overridden by other mods. called when no input is held for half a second
 */
Input.onLongNoInput = function () {
	this.hasNotInputtedRecently = true;
};

/**
 * @description add a callback to occur when onlongnoInput is triggered
 */
MATTIE.inputAPI.onLongNoInput = function (cb) {
	const prevFunc = Input.onLongNoInput;
	Input.onLongNoInput = function () {
		prevFunc.call(this);
		cb();
	};
};

// override the update method to check and call on long no input
MATTIE_RPG.Input_Update = Input.update;
Input.update = function () {
	MATTIE_RPG.Input_Update.call(this);
	if (Date.now() - this._date >= MATTIE.inputAPI.thresholdForNotInputtingRecently && !Input.isPressed(this._latestButton)) {
		if (!this.hasNotInputtedRecently) { this.onLongNoInput(); }
	} else {
		this.hasNotInputtedRecently = false;
	}
};

// override the clear method to update hasNotInputtedRecently
MATTIE_RPG.Input_Clear = Input.clear;
Input.clear = function () {
	MATTIE_RPG.Input_Clear.call(this);
	this.hasNotInputtedRecently = false;
};
