var MATTIE = MATTIE || {};
MATTIE.multiplayer.switchEmitter = {};
MATTIE.multiplayer.switchEmitter.config = {};
MATTIE.multiplayer.switchEmitter.config.maxCps = 0.5;
// the number of seconds an switch can fire above the max cps before getting silenced
MATTIE.multiplayer.switchEmitter.config.switchTolerance = 12;
// same as above but for self switches
MATTIE.multiplayer.switchEmitter.config.selfSwitchTolerance = 12;
// same as above but for vars
MATTIE.multiplayer.switchEmitter.config.varTolerance = 12;

/**
 *
 * @param {*} toleranceMax max calls in the cps limit before silence will fall. (not when the question is asked)
 */
MATTIE.multiplayer.switchEmitter.parallelSetter = function (toleranceMax) {
	if (this != $gameMap._interpreter) {
		if (!this._isParallel) {
			if (!this.lastTime) this.lastTime = Date.now();
			const secSinceLast = ((Date.now() - this.lastTime) / 1000);
			// if command triggers more per second than our limit assume it is a parallel event
			if (secSinceLast < MATTIE.multiplayer.switchEmitter.config.maxCps) {
				if (this.tolerance) { this.tolerance++; } else { this.tolerance = 1; }

				if (this.tolerance > toleranceMax) {
					this._isParallel = true;
					console.info('a game interpreter was silenced');
				}

				// if it hasnt fired in a long time reset the count
			} else if (secSinceLast > MATTIE.multiplayer.switchEmitter.config.maxCps * 3) {
				this.tolerance = 0;
			}
		}
	}
};

const eventAndSwitchEmitterInit = function () {
	// --dont call send parralell events --
	Game_Event.prototype.setupPageSettings = function () {
		var page = this.page();
		var image = page.image;
		if (image.tileId > 0) {
			this.setTileImage(image.tileId);
		} else {
			this.setImage(image.characterName, image.characterIndex);
		}
		if (this._originalDirection !== image.direction) {
			this._originalDirection = image.direction;
			this._prelockDirection = 0;
			this.setDirectionFix(false);
			this.setDirection(image.direction);
		}
		if (this._originalPattern !== image.pattern) {
			this._originalPattern = image.pattern;
			this.setPattern(image.pattern);
		}
		this.setMoveSpeed(page.moveSpeed);
		this.setMoveFrequency(page.moveFrequency);
		this.setPriorityType(page.priorityType);
		this.setWalkAnime(page.walkAnime);
		this.setStepAnime(page.stepAnime);
		this.setDirectionFix(page.directionFix);
		this.setThrough(page.through);
		this.setMoveRoute(page.moveRoute);
		this._moveType = page.moveType;
		this._trigger = page.trigger;
		if (this._trigger === 4) { // trigger 4 is parallel execution mode which will constantly span these events
			// console.log("is parallel")
			this._interpreter = new Game_Interpreter();
			this._interpreter._isParallel = true;
			// setTimeout(() => {
			//     if(this._interpreter) this._interpreter._isParallel = true;
			// }, 1000);
		} else {
			this._interpreter = null;
		}
	};

	Game_CommonEvent.prototype.refresh = function () {
		if (this.isActive()) {
			if (!this._interpreter) {
				this._interpreter = new Game_Interpreter();
				this._interpreter._isParallel = true;
			}
		} else {
			this._interpreter = null;
		}
	};

	// override the set var switch command making it work for both saves from my mod and saves from base game.
	// bassically just silence anything that is sending too much data assuming it is a parellel event
	Game_Interpreter.prototype.command121 = function () {
		MATTIE.multiplayer.switchEmitter.parallelSetter.call(this, MATTIE.multiplayer.switchEmitter.config.switchTolerance);

		for (var i = this._params[0]; i <= this._params[1]; i++) {
			$gameSwitches.setValue(i, this._params[2] === 0, false, this._isParallel);
		}

		return true;
	};

	MATTIE.RPG.Game_InterpreterInitFunc = Game_Interpreter.prototype.initialize;
	Game_Interpreter.prototype.initialize = function (depth) {
		MATTIE.RPG.Game_InterpreterInitFunc.call(this, depth);
	};

	// -- end dont call send parralell events --

	MATTIE.RPG.gameSwitchSetVal = Game_Switches.prototype.setValue;

	Game_Switches.prototype.setValue = function (id, val, skipEvent = false, silenced = false) {
		const i = id;
		MATTIE.RPG.gameSwitchSetVal.call(this, id, val);
		if (!silenced) if (MATTIE.multiplayer.devTools.eventLogger) console.log(`Game Switch ${i} set to ${val}`);
		if (!MATTIE.static.switch.ignoredSwitches.includes(id)) {
			if (!skipEvent) {
				if (!silenced || MATTIE.static.switch.syncedSwitches.includes(id)) {
					const obj = {};
					obj.i = i;
					obj.b = val;
					obj.s = 0;
					const netController = MATTIE.multiplayer.getCurrentNetController();
					if (netController) { if (MATTIE.multiplayer.isActive) netController.emitSwitchEvent(obj); }
				}
			}
		}
	};

	MATTIE_RPG.command123 = Game_Interpreter.prototype.command123;
	// self switch cmd
	Game_Interpreter.prototype.command123 = function () {
		MATTIE.multiplayer.switchEmitter.parallelSetter.call(this, MATTIE.multiplayer.switchEmitter.config.selfSwitchTolerance);

		MATTIE_RPG.command123.call(this);
		const key = $gameSelfSwitches.formatKey(this._mapId, this._eventId, this._params[0]);
		const stringKey = JSON.stringify(key);
		if (!MATTIE.static.switch.ignoredSelfSwitches.includes(stringKey)) {
			if (!this._isParallel || MATTIE.static.switch.syncedSelfSwitches.includes(stringKey)) { // MATTIE.static.switch.syncedSelfSwitches.includes(key)
				const obj = {};
				obj.i = key;
				obj.b = val;
				obj.s = 1;
				const netController = MATTIE.multiplayer.getCurrentNetController();
				if (netController) { if (MATTIE.multiplayer.isActive) netController.emitSwitchEvent(obj); }
				if (MATTIE.multiplayer.devTools.eventLogger) console.log(`Game Self Switch ${key} set to ${this._params[1] === 0}`);
			}
		}

		return true;
	};

	// // Control Self Switch]
	// MATTIE_RPG.cmdSelfSwitch = Game_SelfSwitches.prototype.setValue;
	// Game_SelfSwitches.prototype.setValue = function(key, val, shouldSkip=false, silenced = false){
	//     let returnVal =  MATTIE_RPG.cmdSelfSwitch.call(this, key, val);
	//     let stringKey = JSON.stringify(key);
	//     if(!shouldSkip)

	//     return returnVal;
	// }

	Game_Interpreter.prototype.operateVariable = function (variableId, operationType, value) {
		MATTIE.multiplayer.switchEmitter.parallelSetter.call(this, MATTIE.multiplayer.switchEmitter.config.varTolerance);
		try {
			var oldValue = $gameVariables.value(variableId);
			switch (operationType) {
			case 0: // Set
				$gameVariables.setValue(variableId, oldValue = value, false, this._isParallel);
				break;
			case 1: // Add
				$gameVariables.setValue(variableId, oldValue + value, false, this._isParallel);
				break;
			case 2: // Sub
				$gameVariables.setValue(variableId, oldValue - value, false, this._isParallel);
				break;
			case 3: // Mul
				$gameVariables.setValue(variableId, oldValue * value, false, this._isParallel);
				break;
			case 4: // Div
				$gameVariables.setValue(variableId, oldValue / value, false, this._isParallel);
				break;
			case 5: // Mod
				$gameVariables.setValue(variableId, oldValue % value, false, this._isParallel);
				break;
			}
		} catch (e) {
			$gameVariables.setValue(variableId, 0, false, this._isParallel);
		}
	};

	MATTIE.RPG.gameVarSetVal = Game_Variables.prototype.setValue;
	Game_Variables.prototype.setValue = function (id, val, shouldSkip = false, silenced = false) {
		MATTIE.RPG.gameVarSetVal.call(this, id, val);
		if (MATTIE.multiplayer.isActive) {
			if (!MATTIE.static.variable.ignoredVars.includes(id)) { // party size check //game timer //fear check
				if (!shouldSkip) {
					if (!silenced || MATTIE.static.variable.syncedVars.includes(id)) { // if interpreteer is siclenced, but var is included
						const obj = {};
						obj.i = id;
						obj.b = val;
						obj.s = 2;
						const netController = MATTIE.multiplayer.getCurrentNetController();
						if (netController) { if (MATTIE.multiplayer.isActive) netController.emitSwitchEvent(obj); }
						// if(MATTIE.multiplayer.devTools.varLogger)
						//console.log(`Game var ${id} set to ${val} silenced=${silenced},included=${MATTIE.static.variable.syncedVars.includes(id)}`);
					}
				}
			}
		}
	};
};

eventAndSwitchEmitterInit();
