MATTIE.menus = MATTIE.menus || {};
MATTIE.windows = MATTIE.windows || {};
MATTIE.scenes = MATTIE.scenes || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};

/**
 * @namespace MATTIE.menus.mainMenu
 * @description methods related to main menu manipulation
 * */
MATTIE.menus.mainMenu = MATTIE.menus.mainMenu || {};

var MATTIE_RPG = MATTIE_RPG || {};
TextManager.Mods = 'Mods';
TextManager.Decrypt = 'Decrypt';

/**
 * @description removes a button from the main menu forcibly. That is to say this is able
 * to override other mods that add buttons to main menu, it will just disable the command from displaying period.
 * */
MATTIE.menus.mainMenu.removeBtnFromMainMenu = function (displayText, sym) {
	const prevFunc = Window_TitleCommand.prototype.addCommand;
	Window_TitleCommand.prototype.addCommand = function (name, symbol, enabled, ext) {
		if (name != displayText && symbol != sym) {
			prevFunc.call(this, name, symbol, enabled, ext);
		}
	};
};

/**
 * @description add a new button to the main menu
 * @param {string} displayText the text to display
 * @param {string} cmdText the string to name the command (must be unique)
 * @param {Function} cb the callback
 */

MATTIE.menus.mainMenu.addBtnToMainMenu = function (displayText, cmdText, cb, enabled = true) {
	cmdText = `MATTIEModManager${cmdText}`;

	const previousFunc = Scene_Title.prototype.createCommandWindow;

	Scene_Title.prototype.createCommandWindow = function () {
		previousFunc.call(this);
		this._commandWindow.setHandler(cmdText, (cb).bind(this));
	};
	const prevWindowTitle = Window_TitleCommand.prototype.makeCommandList;

	Window_TitleCommand.prototype.makeCommandList = function () {
		let bool = enabled;
		try {
			bool = enabled();
		} catch (error) {
			// throw error
		}
		prevWindowTitle.call(this);
		this.addCommand(displayText, cmdText, bool);
	};
};

/** @description a name space that contains things related to the difficulty select menu */
MATTIE.menus.difficultyMenu = {};

/**
 * @description add a new difficulty to the difficulty choice event on start map
 * @param {string} title the display name of this difficulty
 * @param {string} helpMsg the help message of this difficulty (what displays at the top of the screen)
 * @param {string} choiceMsg the message that displays at the bottom of the screen, think of this as the description of the difficulty
 */
MATTIE.menus.difficultyMenu.addDifficultyChoice = function (title, choiceMsg, cb = () => {}, helpMsg = 'Choose the game mode?') {
	const baseGameDifs = 3;
	this.index++;
	if (!this.index) this.index = 1;
	const index = this.index;
	const that = this;
	const prevFunc = Scene_Map.prototype.onMapLoaded;
	const once = false;
	Scene_Map.prototype.onMapLoaded = function () {
		prevFunc.call(this);
		if (MATTIE.static.maps.onStartMap()) {
			const event = new MapEvent();
			event.copyActionsFromEvent(1);

			/** @type {rm.types.Page} */
			const page = event.data.pages[4];

			if (page) {
				const list = page.list;
				const cmdCodes = list.map((cmd) => cmd.code);
				const indexOfChoiceCmd = cmdCodes.indexOf(MATTIE.static.commands.showChoices);

				const choicesCmd = list[indexOfChoiceCmd];
				if (indexOfChoiceCmd != -1) {
					choicesCmd.parameters[0].push(title);
				}

				const i = baseGameDifs + index;
				console.log(i);
				const indexOfLastCase = list.indexOf(
					list.filter((cmd) => cmd.code === MATTIE.static.commands.when).find((cmd) => cmd.parameters[0] === (i - 1)),
				);
				let indexOfZeroAfterLast = indexOfLastCase;
				while ((list[indexOfZeroAfterLast].code != 0 || list[indexOfZeroAfterLast].indent != list[indexOfLastCase].indent + 1)) {
					indexOfZeroAfterLast++;
				}

				console.log(indexOfLastCase);
				const whenCmd = { code: MATTIE.static.commands.when, indent: choicesCmd.indent, parameters: [i, title] };
				const commentChoiceHelp = { code: MATTIE.static.commands.commentId, indent: choicesCmd.indent + 1, parameters: [`ChoiceHelp ${helpMsg}`] };
				const commentChoiceMsg = {
					code: MATTIE.static.commands.commentId,
					indent: list[indexOfLastCase].indent + 1,
					parameters:
					[`ChoiceMessage <WordWrap> ${choiceMsg}`],
				};
				const cbName = `${title.trim().replace(/\s/g, '').replace('&', '')}CallBackOnChoice`;
				console.log(cbName);
				eval(`${cbName}=${cb}`);
				const scriptCmd = {
					code: MATTIE.static.commands.script,
					indent: list[indexOfLastCase].indent + 1,
					parameters:
					[`${cbName}();`],
				};

				const zero = {
					code: 0,
					indent: list[indexOfLastCase].indent + 1,
					parameters:
					[],
					// [`${title}CallBackOnChoice();`],
				};

				event.addCommandAfterIndex(4, indexOfZeroAfterLast, zero);
				event.addCommandAfterIndex(4, indexOfZeroAfterLast, scriptCmd);
				// event.addCommandAfterIndex(4, indexOfZeroAfterLast, commentChoiceMsg);
				// event.addCommandAfterIndex(4, indexOfZeroAfterLast, commentChoiceHelp);

				event.addCommandAfterIndex(4, indexOfZeroAfterLast, whenCmd);
				$dataMap.events[1].pages[4] = JsonEx.makeDeepCopy(event.data.pages[4]);
				console.log($dataMap.events[1].pages[4]);

				const int = setInterval(() => {
					if ($gameMessage.isChoice()) {
						$gameMessage._choiceMessages[i] = `<WordWrap>${choiceMsg}`;
						$gameMessage._choiceHelps[i] = `<WordWrap>${helpMsg}`;
						clearInterval(int);
					}
				}, 50);
			}
		}
	};
};
