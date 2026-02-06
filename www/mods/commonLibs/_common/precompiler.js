//------------------------------------------------
// PRECOMPILER.js
// this file handles optimizing some stuff to precompile logic for the interpreters
//------------------------------------------------

// precompiler 411 --logical jump
// and 355 --script

/**
 * @namespace MATTIE
 * @description A namespace used for the modding engine as a whole. Done to mimic the style of RPGMaker plugins.
*/
var MATTIE = MATTIE || {};

MATTIE.preCompiler = {} || MATTIE.preCompiler;
MATTIE.preCompiler.tempLoadName = '$mattieTempDataFileLoad';
/**
 * @description we override the load database function to update our game version dependant variables
 */
MATTIE.preCompiler.loadDatabase = DataManager.loadDatabase;
MATTIE.preCompiler.DataManagerOnLoad = DataManager.onLoad;
DataManager.onLoad = function (object) {
	if (object == $dataMap) {
		MATTIE.preCompiler.precompileDataMap();
	}
	if (object == $dataCommonEvents) {
		MATTIE.preCompiler.precompileCommonEvents();
	}

	MATTIE.preCompiler.DataManagerOnLoad.call(this, object);
};

MATTIE.preCompiler.precompilePage = function (page) {
	for (let index = 0; index < page.list.length; index++) {
		const command = page.list[index];
		command.script = false;

		switch (command.code) {
		case 355: // SCRIPT
			// Look ahead for continued lines (code 655)
			// eslint-disable-next-line no-case-declarations
			let script = `${command.parameters[0]}\n`;
			// eslint-disable-next-line no-case-declarations
			let j = index + 1;
			while (j < page.list.length && page.list[j].code === 655) {
				script += `${page.list[j].parameters[0]}\n`;
				j++;
			}

			// we pre compile our eval statements when loading the data map
			try {
				command.script = eval(`(__)=>{\n${script}\n}`);
			} catch (e) {
				console.error('Precompile Error (Script):', e);
				console.error('Script Content:', script);
			}
			break;

		case 411: // jump
		case 402: // when
		case 111: // Conditional Branch
		case 601: // win
		case 602: // escape
		case 603: // lose
			MATTIE.preCompiler.findJumpIndex(page.list, index);
			/* falls through */
		case 113:
		default:
			break;
		}
	}
};
// // Break Loop
// Game_Interpreter.prototype.command113 = function () {
//     var depth = 0;
//     while (this._index < this._list.length - 1) {
//         this._index++;
//         var command = this.currentCommand();

//         if (command.code === 112)
//             depth++;

//         if (command.code === 413 && command.indent < this._indent) {
//             if (depth > 0)
//                 depth--;
//             else
//                 break;
//         }
//     }
//     return true;
// };

// MATTIE.preCompiler.findBreakLoopJumpIndex = function(list, indexOfBreakLoop){
//     let index = indexOfBreakLoop;
// }

MATTIE.preCompiler.findJumpIndex = function (list, indexOfElse) {
	let index = indexOfElse;
	while (list[index + 1].indent > list[indexOfElse].indent) {
		index++;
	}
	list[indexOfElse].jumpToIndex = index;
};

MATTIE.preCompiler.precompileCommonEvents = function () {
	if (!$dataCommonEvents.precompiled) {
		$dataCommonEvents.forEach((event) => {
			if (event) MATTIE.preCompiler.precompilePage(event);
		});
	} else {
		console.log('TRIED TO PRECOMPILE ON ALREADY PRECOMPILED DATE MAP');
	}
};

MATTIE.preCompiler.precompileDataMap = function () {
	if (!$dataMap.precompiled) {
		$dataMap.events.forEach((event) => {
			if (event) {
				event.pages.forEach((page) => {
					MATTIE.preCompiler.precompilePage(page);
				});
			}
		});
	} else {
		console.log('TRIED TO PRECOMPILE ON ALREADY PRECOMPILED DATE MAP');
	}
};

MATTIE.preCompiler.Game_Actor_setCharacterImage = Game_Actor.prototype.setCharacterImage;
Game_Actor.prototype.setCharacterImage = function (characterName, characterIndex) {
	this._lastCharacterName = this.characterName();
	this._lastCharacterIndex = this.characterIndex();
	this._characterName = characterName;
	this._characterIndex = characterIndex;
};

MATTIE.preCompiler.Base_Game_Player_Refresh = Game_Player.prototype.refresh;
Game_Player.prototype.refresh = function () {
	// if(this.lastRefresh + 1000 > Date.now()) return;
	MATTIE.preCompiler.Base_Game_Player_Refresh.call(this);
	// this.lastRefresh = Date.now();
};

Game_Player.prototype.needsRefresh = function () {
	actorIds = $gameParty._actors;

	for (let index = 0; index < actorIds.length; index++) {
		const actorId = actorIds[index];
		const actor = $gameActors.actor(actorId);
		// console.log(`     name:${actor.characterName()}`)
		// console.log(`last name:${actor._lastCharacterName}`)
		// console.log(`last nam3:${actor._lastCharName}`)
		if (actor.characterName() != actor._lastCharacterName || actor.characterIndex() != actor._lastCharacterIndex) {
			return true;
		}
	}
	return false;
};

Game_Interpreter.prototype.callScriptWithfungerSpecificChangesToScripts = function () {
	arrayOfScriptsThatCauseSevereLag = [
		'$gamePlayer.refresh();',
	];
	if (arrayOfScriptsThatCauseSevereLag.some((disallowed) => this.currentCommand().parameters[0].includes(disallowed))) {
		// if the script might cause severe lag we will handle it in this block
		textScript = this.currentCommand().parameters[0];

		// handle each case
		if (textScript.includes(arrayOfScriptsThatCauseSevereLag[0])) { // "$gamePlayer.refresh();"
			// console.log($gamePlayer.needsRefresh());
			if ($gamePlayer.needsRefresh()) this.currentCommand().script();
		} else { // fallthrough to default
			this.currentCommand().script();
		}
	} else {
		// otherwise we can just call it
		this.currentCommand().script();
	}
};

MATTIE.preCompiler.Base_Game_Interpreter_Command355 = Game_Interpreter.prototype.command355;
Game_Interpreter.prototype.command355 = function () {
	let should_run_precompiled_eval = false;
	// console.log(`event:{${this.eventId()}} called from ${this}}}`)
	if (this.currentCommand().script) {
		should_run_precompiled_eval = true;
	}

	if (should_run_precompiled_eval) {
		// console.log("ran precompiled")
		// console.log(this.currentCommand().script)
		this.callScriptWithfungerSpecificChangesToScripts();

		//
	} else {
		// console.log("couldnt run precompiled")
		// MATTIE.preCompiler.Base_Game_Interpreter_Command355 .call(this)
	}

	return true;
};

Game_Interpreter.prototype.skipBranch = function () {
	if (this.currentCommand().jumpToIndex) {
		this._index = this.currentCommand().jumpToIndex;
		// console.log("precompiledJump");
	} else {
		while (this._list[this._index + 1].indent > this._indent) {
			this._index++;
		}
	}
};
