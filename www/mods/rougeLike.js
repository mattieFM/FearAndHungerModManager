/* consistent-return: 0 */
const enabled = true;

const baseFuncSceneCreate = Scene_Map.prototype.create;
Scene_Map.prototype.create = function () {
	if (enabled) {
		Scene_Base.prototype.create.call(this);
		this._transfer = $gamePlayer.isTransferring();
		var mapId = this._transfer ? $gamePlayer.newMapId() : $gameMap.mapId();
		DataManager.loadRougeMapData();
	}
	return baseFuncSceneCreate.call(this);
};

const datamanagermakeempty = DataManager.makeEmptyMap;
DataManager.makeEmptyMap = function () {
	datamanagermakeempty.call(this);
	$dataMap.note = '';
};

DataManager.loadRougeMapData = function (mapId) {
	if (mapId > 0) {
		var filename = 'Map%1.json'.format(mapId.padZero(3));
		this._mapLoader = ResourceHandler.createLoader(`data/${filename}`, this.loadDataFile.bind(this, '$dataMap', filename));
		this.loadDataFile('$dataMap', filename);
	} else {
		this.makeEmptyMap();
	}
};
