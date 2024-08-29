/* consistent-return: 0 */
const enabled = true;

const baseFuncSceneCreate = Scene_Map.prototype.create;
Scene_Map.prototype.create = function () {
	if (enabled) {
		Scene_Base.prototype.create.call(this);
		this._transfer = $gamePlayer.isTransferring();
		var mapId = this._transfer ? $gamePlayer.newMapId() : $gameMap.mapId();
		DataManager.loadRougeMapData();
	} else {
		return baseFuncSceneCreate.call(this);
	}
};

const dataManagerMakeEmptyMap = DataManager.makeEmptyMap;
DataManager.makeEmptyMap = function () {
	dataManagerMakeEmptyMap.call(this);
	$dataMap.note = '';
};

DataManager.loadRougeMapData = function (mapId) {
	if (mapId > 0 && false) {
		var filename = 'Map%1.json'.format(mapId.padZero(3));
		this._mapLoader = ResourceHandler.createLoader(`data/${filename}`, this.loadDataFile.bind(this, '$dataMap', filename));
		this.loadDataFile('$dataMap', filename);
	} else {
		//this.makeEmptyMap();
		// $dataMap = new MATTIE.dataMapModel();
		let map = new RougeLikeMap(50,50);
		$dataMap = {};
		$dataMap.data = [1,1,1,1];
		$dataMap.events = [];
		$dataMap.width = 50;
		$dataMap.height = 50;
		$dataMap.scrollType = 0;
		$dataMap.tilesetId = 3;
		$dataMap.note = '';
		
		console.log(map.mapTiles.map(tile=>tile.tileId));
		map.pushToDataMap();
	}
};
