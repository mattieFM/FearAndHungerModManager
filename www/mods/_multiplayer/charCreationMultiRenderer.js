var MATTIE = MATTIE || {};
MATTIE.multiplayer.charCreationRenderer = MATTIE.multiplayer.charCreationRenderer || {};

// Portrait map populated from active game module via MATTIE.static._applyGameModule().
// Resolved lazily at render time so module application has completed.
MATTIE.multiplayer.charCreationRenderer.mapIdToDisplayName = {};

MATTIE.multiplayer.charCreationRenderer.getPortraitMap = function () {
	const mp = MATTIE.static._activeModule && MATTIE.static._activeModule.multiplayer;
	if (mp && mp.charPortraitMap) return mp.charPortraitMap;
	return MATTIE.multiplayer.charCreationRenderer.mapIdToDisplayName;
};

MATTIE.multiplayer.charCreationRenderer.rendered = false;
/** @description tracks which picture IDs are currently shown so they can be cleaned up */
MATTIE.multiplayer.charCreationRenderer._activePictureIds = [];

/** @description erase all portraits currently rendered on screen */
MATTIE.multiplayer.charCreationRenderer.clearPortraits = function () {
	const ids = MATTIE.multiplayer.charCreationRenderer._activePictureIds;
	for (let i = 0; i < ids.length; i++) {
		$gameScreen.erasePicture(ids[i]);
	}
	MATTIE.multiplayer.charCreationRenderer._activePictureIds = [];
	MATTIE.multiplayer.charCreationRenderer.rendered = false;
};

/** @description render portraits of all net players on the screen */
MATTIE.multiplayer.charCreationRenderer.renderNetPlayerPortraitsOnScreen = function () {
	// Clear any leftover portraits first
	MATTIE.multiplayer.charCreationRenderer.clearPortraits();

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
				const portraitMap = MATTIE.multiplayer.charCreationRenderer.getPortraitMap();
				ids.forEach((id) => {
					if (portraitMap[id]) {
						const xVal = 250 + ((x * 100) * (i % 2 == 0 ? 1 : -1));
						const yVal = 200 + yInc;
						MATTIE.fxAPI.showImage(portraitMap[id], i, xVal, yVal);
						MATTIE.multiplayer.charCreationRenderer._activePictureIds.push(i);
						i++;
						x += 1 * (i % 2 == 0 ? 1 : 0);
						yInc += 25 * (i % 2 == 0 ? 1 : 0);
					}
				});
			}
		}
	}, 5000);
};

MATTIE.multiplayer.charCreationRenderer.onMapLoad = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function () {
	// If we left the start map, clear any lingering portraits
	if (!MATTIE.static.maps.onStartMap() && MATTIE.multiplayer.charCreationRenderer.rendered) {
		MATTIE.multiplayer.charCreationRenderer.clearPortraits();
	}

	if (!MATTIE.multiplayer.varSyncer.syncedOnce) {
		if (MATTIE.static.maps.onStartMap()) MATTIE.multiplayer.charCreationRenderer.renderNetPlayerPortraitsOnScreen();
	}
	MATTIE.multiplayer.charCreationRenderer.onMapLoad.call(this);
};
