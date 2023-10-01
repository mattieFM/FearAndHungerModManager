var MATTIE = MATTIE || {};
MATTIE.multiplayer.charCreationRenderer = MATTIE.multiplayer.charCreationRenderer || {};

MATTIE.multiplayer.charCreationRenderer.mapIdToDisplayName = {
	1: 'intro_cahara1',
	2: 'intro_girl1',
	3: 'intro_knight1',
	4: 'intro_enki1',
	5: 'intro_outlander1',
	6: 'intro_legarde1',
	7: 'intro_moonless1',
	8: 'intro_kid1',
	9: 'intro_marriage1',
	11: 'intro_fusion1',
	16: 'intro_ghoul1',
	17: 'intro_ghoul1',
	18: 'intro_ghoul1',
	19: 'intro_skeleton1',
	20: 'intro_skeleton1',
	21: 'intro_skeleton1',
};

MATTIE.multiplayer.charCreationRenderer.rendered = false;
/** @description render portraits of all net players on the screen */
MATTIE.multiplayer.charCreationRenderer.renderNetPlayerPortraitsOnScreen = function () {
	setTimeout(() => {
		MATTIE.multiplayer.charCreationRenderer.rendered = true;
		const netCont = MATTIE.multiplayer.getCurrentNetController();
		let i = 10;
		let x = 1;
		let yInc = 0;
		for (const key in netCont.netPlayers) {
			if (key) {
				/** @type {PlayerModel} */
				const player = netCont.netPlayers[key];
				const ids = player.memberIds();

				// eslint-disable-next-line no-loop-func
				ids.forEach((id) => {
					if (MATTIE.multiplayer.charCreationRenderer.mapIdToDisplayName[id]) {
						const xVal = 250 + ((x * 100) * (i % 2 == 0 ? 1 : -1));
						const yVal = 200 + yInc;
						MATTIE.fxAPI.showImage(MATTIE.multiplayer.charCreationRenderer.mapIdToDisplayName[id], i, xVal, yVal);
						i++;
						x += 1 * (i % 2 == 0 ? 1 : 0);
						yInc += 25 * (i % 2 == 0 ? 1 : 0);
					}
				});
			}
		}
		setTimeout(() => {
			for (let index = 10; index <= i; index++) {
				$gameScreen.erasePicture(index);
			}
		}, 60000);
	}, 5000);
};

MATTIE.multiplayer.charCreationRenderer.onMapLoad = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function () {
	if (!MATTIE.multiplayer.varSyncer.syncedOnce) {
		if (MATTIE.static.maps.onStartMap()) MATTIE.multiplayer.charCreationRenderer.renderNetPlayerPortraitsOnScreen();
	}
	MATTIE.multiplayer.charCreationRenderer.onMapLoad.call(this);
};
