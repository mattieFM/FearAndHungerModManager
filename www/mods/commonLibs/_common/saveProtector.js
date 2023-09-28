var MATTIE = MATTIE || {};
var MATTIE_ModManager = MATTIE_ModManager || {};

StorageManager.localFileDirectoryPath = function () {
	const path = require('path');

	const base = path.dirname(process.mainModule.filename);
	if (MATTIE_ModManager.modManager) {
		if (
			(!MATTIE_ModManager.modManager.checkSaveDanger() || MATTIE_ModManager.modManager.checkForceVanillaSaves())
         && !MATTIE_ModManager.modManager.checkForceModdedSaves()
		) {
			return path.join(base, 'save/');
		}
		return path.join(base, 'moddedSaves/');
	}
	return base;
};
