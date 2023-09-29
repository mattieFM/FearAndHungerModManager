var MATTIE_ModManager = MATTIE_ModManager || {};

MATTIE.scenes = MATTIE.scenes || {};

MATTIE.static = MATTIE.static || {};
MATTIE.emptyScroll = MATTIE.emptyScroll || {};
console.log(MATTIE.modLoader._mods);

DataManager.disableBaseItem(MATTIE.static.items.emptyScroll.id);
DataManager.setCallbackOnItem(MATTIE.static.items.emptyScroll.id, () => {
	SceneManager.push(MATTIE.scenes.emptyScroll);
});
