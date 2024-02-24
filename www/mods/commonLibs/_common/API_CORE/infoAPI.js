// an api for getting general info
/**
 * @namespace MATTIE.infoAPI
 */

MATTIE.infoAPI = {};

/**
 * @description Get the current name of the location.
 * @returns the display name of the map the player is currently on.
 */
MATTIE.infoAPI.getCurrentLocationName = function () {
	const mapId = $gameMap.mapId();
	const mapData = MATTIE.DataManager.getMapData(mapId);
	let mapName
	if(mapData) mapName = mapData.displayName;
	else mapName = "No Map"
	return mapName;
};

/**
 * @description Get the current name of the leader of the party
 * @returns the charecter name of the leader of the party
 */
MATTIE.infoAPI.getPlayerCharecter = function () {
	const actor = $gameParty.leader()._characterName;
	return actor;
};

/**
 * @description Get the current actorid of the leader of the party
 * @returns the actor id of the leader of the party
 */
MATTIE.infoAPI.getPlayerActorId = function () {
	const actorid = $gameParty.leader().actorId();
	return actorid;
};


/**
 * @description Get the current actorid of the leader of the party
 * @returns the actor id of the leader of the party
 */
MATTIE.infoAPI.getPlayerActorId = function () {
	const actorid = $gameParty.leader().actorId();
	return actorid;
};

/**
 * @description check if the player is in a menu currently
 */
MATTIE.infoAPI.isInMenu = function () {
	const onMenuMap = MATTIE.static.maps.onMenuMap();
	const menuScenes = [Scene_Boot, Scene_Title, Scene_Equip, Scene_Item, Scene_KeyConfig, Scene_Status, Scene_Skill, Scene_MenuBase, Scene_Menu];
	const currentScene = SceneManager._scene;
	let onMenuScene = false;
	menuScenes.forEach((scene)=>{
		if(currentScene instanceof scene) onMenuScene = true
	})

	return onMenuMap || onMenuScene;
};

