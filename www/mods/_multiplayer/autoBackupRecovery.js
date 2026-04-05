/**
 * @description Recovery UI for the auto-backup system.
 * Provides a scene accessible from the multiplayer main menu to browse and restore battle backups.
 */
var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.scenes = MATTIE.scenes || {};
MATTIE.windows = MATTIE.windows || {};

(function () {
	var autoBackup = MATTIE.multiplayer.autoBackup;

	// =========================================================================
	// Window_BackupSlotList - Selects which save slot to browse backups for
	// =========================================================================

	function Window_BackupSlotList() {
		this.initialize.apply(this, arguments);
	}

	Window_BackupSlotList.prototype = Object.create(Window_Command.prototype);
	Window_BackupSlotList.prototype.constructor = Window_BackupSlotList;

	Window_BackupSlotList.prototype.initialize = function (x, y) {
		Window_Command.prototype.initialize.call(this, x, y);
	};

	Window_BackupSlotList.prototype.windowWidth = function () {
		return 300;
	};

	Window_BackupSlotList.prototype.numVisibleRows = function () {
		return 12;
	};

	Window_BackupSlotList.prototype.makeCommandList = function () {
		var slots = autoBackup.listBackupSlots();
		for (var i = 0; i < slots.length; i++) {
			this.addCommand(`Save Slot ${slots[i]}`, `slot_${slots[i]}`, true, slots[i]);
		}
		if (slots.length === 0) {
			this.addCommand('(No backups found)', 'none', false);
		}
	};

	// =========================================================================
	// Window_BackupFileList - Lists backup files for the selected save slot
	// =========================================================================

	function Window_BackupFileList() {
		this.initialize.apply(this, arguments);
	}

	Window_BackupFileList.prototype = Object.create(Window_Command.prototype);
	Window_BackupFileList.prototype.constructor = Window_BackupFileList;

	Window_BackupFileList.prototype.initialize = function (x, y) {
		this._savefileId = null;
		this._backups = [];
		Window_Command.prototype.initialize.call(this, x, y);
	};

	Window_BackupFileList.prototype.windowWidth = function () {
		return Graphics.boxWidth - 300;
	};

	Window_BackupFileList.prototype.numVisibleRows = function () {
		return 12;
	};

	Window_BackupFileList.prototype.setSavefileId = function (savefileId) {
		if (this._savefileId !== savefileId) {
			this._savefileId = savefileId;
			this.refresh();
			this.select(0);
		}
	};

	Window_BackupFileList.prototype.refresh = function () {
		this.clearCommandList();
		this.makeCommandList();
		this.createContents();
		Window_Command.prototype.refresh.call(this);
	};

	Window_BackupFileList.prototype.makeCommandList = function () {
		this._backups = [];
		if (!this._savefileId) {
			this.addCommand('(Select a save slot)', 'none', false);
			return;
		}

		var backups = autoBackup.listBackups(this._savefileId);
		this._backups = backups;

		if (backups.length === 0) {
			this.addCommand('(No backups for this slot)', 'none', false);
			return;
		}

		for (var i = 0; i < backups.length; i++) {
			var parsed = autoBackup.parseBackupFilename(backups[i].filename);
			this.addCommand(parsed.displayName, `backup_${i}`, true, i);
		}
	};

	Window_BackupFileList.prototype.getSelectedBackup = function () {
		var data = this.currentData();
		if (!data || data.ext === null || data.ext === undefined) return null;
		return this._backups[data.ext] || null;
	};

	// =========================================================================
	// Window_BackupConfirm - Confirmation dialog before restoring
	// =========================================================================

	function Window_BackupConfirm() {
		this.initialize.apply(this, arguments);
	}

	Window_BackupConfirm.prototype = Object.create(Window_Command.prototype);
	Window_BackupConfirm.prototype.constructor = Window_BackupConfirm;

	Window_BackupConfirm.prototype.initialize = function () {
		var x = (Graphics.boxWidth - this.windowWidth()) / 2;
		var y = (Graphics.boxHeight - this.windowHeight()) / 2;
		Window_Command.prototype.initialize.call(this, x, y);
		this.openness = 0;
		this.deactivate();
		this._fileName = '';
		this._slotId = null;
	};

	Window_BackupConfirm.prototype.windowWidth = function () {
		return 500;
	};

	Window_BackupConfirm.prototype.numVisibleRows = function () {
		return 3;
	};

	// Push the selectable commands down by one row so the info text has its own row above them
	Window_BackupConfirm.prototype.itemRect = function (index) {
		var rect = Window_Command.prototype.itemRect.call(this, index);
		rect.y += this.lineHeight();
		return rect;
	};

	Window_BackupConfirm.prototype.makeCommandList = function () {
		this.addCommand('Restore this backup', 'confirm', true);
		this.addCommand('Cancel', 'cancel', true);
	};

	Window_BackupConfirm.prototype.setInfo = function (slotId, fileName) {
		this._slotId = slotId;
		this._fileName = fileName;
	};

	Window_BackupConfirm.prototype.refresh = function () {
		this.createContents();
		Window_Command.prototype.refresh.call(this);
		// Draw info text in the top row (above the command buttons)
		this.changeTextColor(this.normalColor());
		var text = `Restore to Save Slot ${this._slotId || '?'}?`;
		this.drawText(text, 0, 0, this.contentsWidth(), 'center');
	};

	// =========================================================================
	// Scene_RecoverAutoBackup - Main recovery scene
	// =========================================================================

	MATTIE.scenes.RecoverAutoBackup = function () {
		this.initialize.apply(this, arguments);
	};

	MATTIE.scenes.RecoverAutoBackup.prototype = Object.create(Scene_Base.prototype);
	MATTIE.scenes.RecoverAutoBackup.prototype.constructor = MATTIE.scenes.RecoverAutoBackup;

	MATTIE.scenes.RecoverAutoBackup.prototype.initialize = function () {
		Scene_Base.prototype.initialize.call(this);
	};

	MATTIE.scenes.RecoverAutoBackup.prototype.create = function () {
		Scene_Base.prototype.create.call(this);
		this.createBackground();
		this.createWindowLayer();
		this.createTitleWindow();
		this.createSlotWindow();
		this.createFileWindow();
		this.createConfirmWindow();
	};

	MATTIE.scenes.RecoverAutoBackup.prototype.createBackground = function () {
		this._backSprite1 = new Sprite(ImageManager.loadTitle1($dataSystem.title1Name));
		this._backSprite2 = new Sprite(ImageManager.loadBitmap('mods/_multiplayer/', 'multiPlayerMenu', 0, true, true));
		this.addChild(this._backSprite1);
		this.addChild(this._backSprite2);
	};

	MATTIE.scenes.RecoverAutoBackup.prototype.createTitleWindow = function () {
		var h = this.fittingHeight(1);
		this._titleWindow = new Window_Base(0, 0, Graphics.boxWidth, h);
		this._titleWindow.changeTextColor(this._titleWindow.normalColor());
		this._titleWindow.drawText('Recover Auto Backup', 0, 0, Graphics.boxWidth - 36, 'center');
		this.addWindow(this._titleWindow);
	};

	MATTIE.scenes.RecoverAutoBackup.prototype.fittingHeight = function (numLines) {
		return Window_Base.prototype.fittingHeight(numLines);
	};

	MATTIE.scenes.RecoverAutoBackup.prototype.createSlotWindow = function () {
		var topY = this.fittingHeight(1);
		this._slotWindow = new Window_BackupSlotList(0, topY);
		this._slotWindow.setHandler('ok', this.onSlotOk.bind(this));
		this._slotWindow.setHandler('cancel', this.onSlotCancel.bind(this));
		this.addWindow(this._slotWindow);
	};

	MATTIE.scenes.RecoverAutoBackup.prototype.createFileWindow = function () {
		var topY = this.fittingHeight(1);
		this._fileWindow = new Window_BackupFileList(300, topY);
		this._fileWindow.setHandler('ok', this.onFileOk.bind(this));
		this._fileWindow.setHandler('cancel', this.onFileCancel.bind(this));
		this._fileWindow.deactivate();
		this.addWindow(this._fileWindow);
	};

	MATTIE.scenes.RecoverAutoBackup.prototype.createConfirmWindow = function () {
		this._confirmWindow = new Window_BackupConfirm();
		this._confirmWindow.setHandler('confirm', this.onConfirmOk.bind(this));
		this._confirmWindow.setHandler('cancel', this.onConfirmCancel.bind(this));
		this.addWindow(this._confirmWindow);
	};

	// --- Handlers ---

	MATTIE.scenes.RecoverAutoBackup.prototype.onSlotOk = function () {
		var data = this._slotWindow.currentData();
		if (!data || !data.ext) {
			this._slotWindow.activate();
			return;
		}
		var savefileId = data.ext;
		this._fileWindow.setSavefileId(savefileId);
		this._fileWindow.activate();
		this._fileWindow.select(0);
	};

	MATTIE.scenes.RecoverAutoBackup.prototype.onSlotCancel = function () {
		SceneManager.pop();
	};

	MATTIE.scenes.RecoverAutoBackup.prototype.onFileOk = function () {
		var backup = this._fileWindow.getSelectedBackup();
		if (!backup) {
			this._fileWindow.activate();
			return;
		}
		var savefileId = this._slotWindow.currentData().ext;
		var parsed = autoBackup.parseBackupFilename(backup.filename);

		this._pendingRestore = {
			savefileId,
			fullPath: backup.fullPath,
		};

		this._confirmWindow.setInfo(savefileId, parsed.displayName);
		this._confirmWindow.refresh();
		this._confirmWindow.open();
		this._confirmWindow.activate();
		this._confirmWindow.select(0);
	};

	MATTIE.scenes.RecoverAutoBackup.prototype.onFileCancel = function () {
		this._fileWindow.deactivate();
		this._slotWindow.activate();
	};

	MATTIE.scenes.RecoverAutoBackup.prototype.onConfirmOk = function () {
		if (this._pendingRestore) {
			var success = autoBackup.restoreBackup(
				this._pendingRestore.savefileId,
				this._pendingRestore.fullPath,
			);
			this._pendingRestore = null;

			this._confirmWindow.close();
			this._confirmWindow.deactivate();

			if (success) {
				// Show a brief success message by reusing the title window
				this._titleWindow.contents.clear();
				this._titleWindow.changeTextColor('#00ff00');
				this._titleWindow.drawText(
					'Backup restored successfully! Load the save to continue.',
					0,
					0,
					Graphics.boxWidth - 36,
					'center',
				);
			} else {
				this._titleWindow.contents.clear();
				this._titleWindow.changeTextColor('#ff0000');
				this._titleWindow.drawText(
					'Failed to restore backup.',
					0,
					0,
					Graphics.boxWidth - 36,
					'center',
				);
			}
			this._fileWindow.activate();
		}
	};

	MATTIE.scenes.RecoverAutoBackup.prototype.onConfirmCancel = function () {
		this._confirmWindow.close();
		this._confirmWindow.deactivate();
		this._pendingRestore = null;
		this._fileWindow.activate();
	};
}());
