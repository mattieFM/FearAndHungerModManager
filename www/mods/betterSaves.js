/*:
* @plugindesc V0
* a test mod for fear and hunger
* @author Mattie
*
* mods define their
*/

MATTIE.saves = MATTIE.saves || {};
MATTIE.saves.suspendedRunId = 9998;
MATTIE.betterSaves = {};

(() => {
	const betterSavesName = 'betterSaves';

	MATTIE.betterSaves.offload = function () {
		MATTIE.DataManager.global.set('migratedSaves', false);
		console.log('offload');
	};

	MATTIE_ModManager.modManager.addOffloadScriptToMod(betterSavesName, MATTIE.betterSaves.offload);

	MATTIE.saves.createCommandWindow = Scene_GameEnd.prototype.createCommandWindow;
	Scene_GameEnd.prototype.createCommandWindow = function () {
		MATTIE.saves.createCommandWindow.call(this);
		this._commandWindow.setHandler('suspend', (() => {
			MATTIE.saves.suspendRun();
			this.commandToTitle();
		}));
	};

	MATTIE.saves.makeCommandList = Window_GameEnd.prototype.makeCommandList;
	Window_GameEnd.prototype.makeCommandList = function () {
		MATTIE.saves.makeCommandList.call(this);
		this.addCommand('Save And Quit', 'suspend');
	};

	MATTIE.saves.continueFromSuspendedRun = function () {
		MATTIE.menus.loadGameAndGoTo(MATTIE.saves.suspendedRunId);
		MATTIE.saves.deleteSuspendedRun();
	};

	MATTIE.saves.deleteSuspendedRun = function () {
		StorageManager.saveToLocalFile(MATTIE.saves.suspendedRunId, {});
		const globalInfo = DataManager.loadGlobalInfo();
		globalInfo[MATTIE.saves.suspendedRunId] = null;
		DataManager.saveGlobalInfo(globalInfo);
	};
	MATTIE.saves.suspendRun = function () {
		DataManager.saveGame(MATTIE.saves.suspendedRunId, true);
	};
	MATTIE.saves.suspendedRunExists = function () {
		const global = DataManager.loadGlobalInfo();
		console.log(global[MATTIE.saves.suspendedRunId]);
		if (global[MATTIE.saves.suspendedRunId]) return true;
		return false;
	};

	Input.addKeyBind('', () => {
		MATTIE.saves.suspendRun();
	}, 'SuspendRun', 1);

	updateOldSaves(); // update old saves on init
	MATTIE.menus.mainMenu.addBtnToMainMenu(
		'Continue Suspended Run',
		'suspendedRunContinue',
		MATTIE.saves.continueFromSuspendedRun.bind(this),
		() => MATTIE.saves.suspendedRunExists(),
	);

	const params = PluginManager.parameters(betterSavesName);

	DataManager.maxSavefiles = function () {
		return params.maxSaves;
	};

	function updateOldSaves() {
		if (!MATTIE.DataManager.global.get('migratedSaves')) {
			MATTIE.saves.savedLatest = DataManager.latestSavefileId();
			const globalInfo = DataManager.loadGlobalInfo();
			const maxSaves = DataManager.maxSavefiles();
			for (let index = 1; index < maxSaves; index++) {
				if (globalInfo[index]) {
					if (!globalInfo[index].name) {
						console.info(`BETTERSAVES: Migrated save: ${index}`);
						const saveData = MATTIE.DataManager.loadAndReturnSave(index);
						if (saveData) {
							const diff = MATTIE.GameInfo.getDifficulty(saveData.$gameSwitches);
							const name = JSON.stringify($gameParty.leader().name);

							globalInfo[index].difficulty = diff;
							if (name) globalInfo[index].name = name.replace('"', '').replace('"', '');
							else globalInfo[index].name = '';
						}
					}
				}
				DataManager.saveGlobalInfo(globalInfo);
				MATTIE.DataManager.loadAndReturnSave(MATTIE.saves.savedLatest);
			}
			MATTIE.DataManager.global.set('migratedSaves', true);
		}
	}

	MATTIE.Scene_Save_prototype_init = Scene_Save.prototype.initialize;
	Scene_Save.prototype.initialize = function () {
		MATTIE.Scene_Save_prototype_init.call(this);
	};

	MATTIE.Scene_Load_prototype_init = Scene_Load.prototype.initialize;
	Scene_Load.prototype.initialize = function () {
		MATTIE.Scene_Load_prototype_init.call(this);
	};
	Window_SavefileList.prototype.drawGameTitle = function (info, x, y, width, rect) {
		if (info.difficulty && info.name) {
			this.drawText(info.difficulty, x, y + rect.height - 37, width - 125, 'right');
			this.drawText(`-${info.name}`, x - 110, y, width, 'left');
		} else if (info.title) {
			this.drawText(`${info.title} - legacy save`, x, y + rect.height - 35, width);
		}
	};

	Window_SavefileList.prototype.drawContents = function (info, rect, valid) {
		const bottom = rect.y + rect.height;
		if (rect.width >= 420) {
			if (valid) {
				this.drawPartyCharacters(info, rect.x + 220, MATTIE.global.isTermina() ? rect.y : bottom - 4);
			}
			this.drawGameTitle(info, rect.x + 192, rect.y, rect.width - 192, rect);
		}
		const lineHeight = this.lineHeight();
		const y2 = bottom - lineHeight;
		if (y2 >= lineHeight) {
			this.drawPlaytime(info, rect.x, y2, rect.width);
		}
	};

	MATTIE.DataManager_MakeSaveFileInfo = DataManager.makeSavefileInfo;
	DataManager.makeSavefileInfo = function (noTimeStamp = false) {
		const oldData = MATTIE.DataManager_MakeSaveFileInfo.call(this, noTimeStamp);
		const newData = {
			...oldData,
			name: MATTIE.GameInfo.getCharName(),
			difficulty: MATTIE.GameInfo.getDifficulty(),

		};
		return newData;
	};
})();
