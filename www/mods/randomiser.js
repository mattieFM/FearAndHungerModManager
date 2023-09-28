var MATTIE = MATTIE || {};
MATTIE.randomiser = MATTIE.randomiser || {};
MATTIE.static = MATTIE.static || {};

function randomise() {
	const i = 0;
	const battleEvents = [];
	for (let index = 0; index < $dataMapInfos.length; index++) {
		const mapInfo = $dataMapInfos[index];
		if (mapInfo.id) {
			DataManager.loadMapData(mapInfo.id);
		}
	}
}
