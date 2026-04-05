/**
 * @description Auto-backup system that creates save snapshots before and after each battle encounter.
 * Stores up to 50 rolling backups per save slot in save/autobackups/file{id}/
 * Filenames: "{timestamp} - before enemy - {troopName}.rpgsave" / "{timestamp} - after enemy - {troopName}.rpgsave"
 */
var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.multiplayer.autoBackup = MATTIE.multiplayer.autoBackup || {};

(function () {
	var autoBackup = MATTIE.multiplayer.autoBackup;
	var fs = require('fs');
	var path = require('path');

	autoBackup.MAX_BACKUPS = 50;

	/**
	 * Get the base save directory (same as StorageManager)
	 */
	autoBackup.getSaveDir = function () {
		var base = path.dirname(process.mainModule.filename);
		return path.join(base, 'save');
	};

	/**
	 * Get the autobackup directory for a specific save slot, creating it if needed.
	 * Does NOT use {recursive:true} since older Node.js (bundled with NW.js) does not support it.
	 * @param {number} savefileId
	 * @returns {string} full path to backup directory
	 */
	autoBackup.getBackupDir = function (savefileId) {
		var autobackupsDir = path.join(this.getSaveDir(), 'autobackups');
		var slotDir = path.join(autobackupsDir, `file${savefileId}`);
		if (!fs.existsSync(autobackupsDir)) {
			fs.mkdirSync(autobackupsDir);
		}
		if (!fs.existsSync(slotDir)) {
			fs.mkdirSync(slotDir);
		}
		return slotDir;
	};

	/**
	 * Sanitize a string for use in filenames - remove invalid filesystem characters
	 * @param {string} name
	 * @returns {string}
	 */
	autoBackup.sanitizeFilename = function (name) {
		if (!name) return 'unknown';
		return name.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, ' ').trim() || 'unknown';
	};

	/**
	 * Generate a timestamp string for filename ordering
	 * @returns {string} e.g. "20260404_153022_123"
	 */
	autoBackup.getTimestamp = function () {
		var d = new Date();
		var pad = function (n, len) { return String(n).padStart(len || 2, '0'); };
		return `${pad(d.getFullYear(), 4) + pad(d.getMonth() + 1) + pad(d.getDate())
		}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())
		}_${pad(d.getMilliseconds(), 3)}`;
	};

	/**
	 * Get the current active save file ID, or null if none
	 * @returns {number|null}
	 */
	autoBackup.getCurrentSavefileId = function () {
		try {
			if (DataManager._lastAccessedId && DataManager._lastAccessedId > 0) {
				return DataManager._lastAccessedId;
			}
		} catch (e) { console.log(e); }
		return null;
	};

	/**
	 * Create a backup of the current game state
	 * @param {string} prefix - "before enemy" or "after enemy"
	 * @param {string} troopName - the troop/enemy name
	 */
	autoBackup.createBackup = function (prefix, troopName) {
		try {
			var savefileId = this.getCurrentSavefileId();
			if (!savefileId) return;
			if (!$gameSystem || !$gameParty) return;

			var safeName = this.sanitizeFilename(troopName);
			var timestamp = this.getTimestamp();
			var filename = `${timestamp} - ${prefix} - ${safeName}.rpgsave`;
			var dir = this.getBackupDir(savefileId);
			var filePath = path.join(dir, filename);

			// Serialize game state using the same pipeline as normal saves
			var contents = DataManager.makeSaveContents();
			var json = JsonEx.stringify(contents);
			var data = LZString.compressToBase64(json);

			fs.writeFileSync(filePath, data);

			// Enforce the backup limit
			this.enforceLimit(savefileId);

			console.log(`[AutoBackup] Created: ${filename}`);
		} catch (e) {
			console.error('[AutoBackup] Failed to create backup:', e);
		}
	};

	/**
	 * Enforce the maximum backup count for a save slot, deleting oldest files
	 * @param {number} savefileId
	 */
	autoBackup.enforceLimit = function (savefileId) {
		try {
			var dir = this.getBackupDir(savefileId);
			var files = fs.readdirSync(dir)
				.filter((f) => f.endsWith('.rpgsave'))
				.sort(); // timestamp prefix ensures chronological sort

			while (files.length > this.MAX_BACKUPS) {
				var oldest = files.shift();
				var oldPath = path.join(dir, oldest);
				fs.unlinkSync(oldPath);
				console.log(`[AutoBackup] Pruned old backup: ${oldest}`);
			}
		} catch (e) {
			console.error('[AutoBackup] Failed to enforce limit:', e);
		}
	};

	/**
	 * List all backup files for a save slot, newest first.
	 * Does NOT create the directory - returns empty array if it does not exist.
	 * @param {number} savefileId
	 * @returns {Array<{filename: string, fullPath: string}>}
	 */
	autoBackup.listBackups = function (savefileId) {
		try {
			var dir = path.join(this.getSaveDir(), 'autobackups', `file${savefileId}`);
			if (!fs.existsSync(dir)) return [];
			var files = fs.readdirSync(dir)
				.filter((f) => f.endsWith('.rpgsave'))
				.sort()
				.reverse(); // newest first
			return files.map((f) => ({ filename: f, fullPath: path.join(dir, f) }));
		} catch (e) {
			return [];
		}
	};

	/**
	 * List all save slot IDs that have backup folders with at least one backup
	 * @returns {number[]}
	 */
	autoBackup.listBackupSlots = function () {
		var baseDir = path.join(this.getSaveDir(), 'autobackups');
		if (!fs.existsSync(baseDir)) return [];
		try {
			return fs.readdirSync(baseDir)
				.filter((d) => d.startsWith('file'))
				.map((d) => parseInt(d.replace('file', ''), 10))
				.filter((id) => !isNaN(id) && id > 0)
				.filter((id) => {
					// Only include slots that actually have backup files
					var slotDir = path.join(baseDir, `file${id}`);
					try {
						return fs.readdirSync(slotDir).some((f) => f.endsWith('.rpgsave'));
					} catch (e) { return false; }
				})
				.sort((a, b) => a - b);
		} catch (e) {
			return [];
		}
	};

	/**
	 * Restore a backup file as the active save for a given slot
	 * @param {number} savefileId
	 * @param {string} backupFilePath - full path to the backup .rpgsave file
	 * @returns {boolean} true if successful
	 */
	autoBackup.restoreBackup = function (savefileId, backupFilePath) {
		try {
			if (!fs.existsSync(backupFilePath)) {
				console.error('[AutoBackup] Backup file not found:', backupFilePath);
				return false;
			}
			var data = fs.readFileSync(backupFilePath, { encoding: 'utf8' });

			// Write to the normal save location
			var saveDir = StorageManager.localFileDirectoryPath();
			if (!fs.existsSync(saveDir)) {
				fs.mkdirSync(saveDir);
			}
			var targetPath = StorageManager.localFilePath(savefileId);
			fs.writeFileSync(targetPath, data);

			console.log(`[AutoBackup] Restored backup to save slot ${savefileId} from: ${backupFilePath}`);
			return true;
		} catch (e) {
			console.error('[AutoBackup] Failed to restore backup:', e);
			return false;
		}
	};

	/**
	 * Parse a backup filename into its display components
	 * @param {string} filename
	 * @returns {{timestamp: string, prefix: string, troopName: string, displayName: string}}
	 */
	autoBackup.parseBackupFilename = function (filename) {
		// Format: "20260404_153022_123 - before enemy - Troop Name.rpgsave"
		var base = filename.replace('.rpgsave', '');
		var parts = base.split(' - ');
		var timestamp = parts[0] || '';
		var prefix = parts[1] || '';
		var troopName = parts.slice(2).join(' - ') || '';

		// Format timestamp for display: "2026/04/04 15:30:22"
		var displayTime = timestamp;
		var match = timestamp.match(/^(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/);
		if (match) {
			displayTime = `${match[1]}/${match[2]}/${match[3]} ${
				match[4]}:${match[5]}:${match[6]}`;
		}

		return {
			timestamp,
			prefix,
			troopName,
			displayName: `${displayTime} - ${prefix} - ${troopName}`,
		};
	};

	// =========================================================================
	// Battle Hooks
	// =========================================================================

	/**
	 * Hook into BattleManager.setup to create "before enemy" backup
	 */
	var _BattleManager_setup = BattleManager.setup;
	BattleManager.setup = function (troopId, canEscape, canLose) {
		_BattleManager_setup.call(this, troopId, canEscape, canLose);
		try {
			var troopName = $gameTroop.troop() ? $gameTroop.troop().name : 'Unknown';
			autoBackup.createBackup('before enemy', troopName);
		} catch (e) {
			console.error('[AutoBackup] Error in BattleManager.setup hook:', e);
		}
	};

	/**
	 * Hook into BattleManager.endBattle to create "after enemy" backup
	 */
	var _BattleManager_endBattle = BattleManager.endBattle;
	BattleManager.endBattle = function (result) {
		_BattleManager_endBattle.call(this, result);
		try {
			var troopName = $gameTroop.troop() ? $gameTroop.troop().name : 'Unknown';
			autoBackup.createBackup('after enemy', troopName);
		} catch (e) {
			console.error('[AutoBackup] Error in BattleManager.endBattle hook:', e);
		}
	};
}());
