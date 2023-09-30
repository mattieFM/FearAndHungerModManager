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
	const mapName = mapData.displayName;
	return mapName;
};
