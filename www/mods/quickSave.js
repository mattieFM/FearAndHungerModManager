var MATTIE = MATTIE || {};
MATTIE.quickSaves = MATTIE.quickSaves || {};

MATTIE.quickSaves.quickSaveId = 9998;
function initQuickSave() {
	Input.addKeyBind('', () => {
		$gameSystem.onBeforeSave();
		DataManager.saveGame(MATTIE.quickSaves.quickSaveId, true);
	}, 'Quick Save', 1, 187, 187);

	Input.addKeyBind('', () => {
		MATTIE.menus.loadGameAndGoTo(MATTIE.quickSaves.quickSaveId);
	}, 'Quick Load', 1, 189, 189);

	Input.addKeyBind('', () => {
		Game_Interpreter.prototype.command352();
	}, 'Save', 1, 'i', 'i');

	Input.addKeyBind('', () => {
		SceneManager.push(Scene_Load);
	}, 'Load', 1, 'u', 'u');

	// maxSavefiles
}
initQuickSave();
