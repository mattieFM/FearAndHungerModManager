/**
 * @namespace MATTIE.bbgirlAPI
 * @description the api for all jokes and memes in the engine. Handles making Cahara naked, displaying dungeon knights avatars etc...
 */
MATTIE.bbgirlAPI = MATTIE.bbgirlAPI || {};

var Imported = Imported || {};

/**
 * @description bbgirl slay queen. Girl boss, pussy boss, girlqueen
 */
MATTIE.bbgirlAPI.yassify = function () {
	console.log('yassed');
	const yassssifyyDict = {
		Actor1: {
			0: 'portrarL_cahara',
			6: 'portraitL_enki',
			2: 'portraitR_darce',
			3: 'portraitR_girl',
			7: 'portraitL_ragn',
		},
		Actor2: {
			0: 'portraitL_legarde',

		},
		Actor3: {
			0: 'portraitL_nashrah',
		},
	};
	Window_MenuStatus.prototype.drawFace = function (faceName, faceIndex, x, y, width, height) {
		console.log(faceName);
		console.log(faceIndex);
		var width = this.bustWidth();

		let bustName = `${faceName}_${faceIndex + 1}`;
		const keys = Object.keys(yassssifyyDict);

		keys.forEach((key) => {
			if (faceName.includes(key)) {
				const portraitKeys = Object.keys(yassssifyyDict[key]);
				const portraits = yassssifyyDict[key];
				if (portraitKeys.includes(faceIndex.toString())) {
					bustName = portraits[faceIndex.toString()];
				}
			}
		});
		const bitmap = ImageManager.loadPicture(bustName);

		let ox = 0;
		let oy = 0;
		if (Galv.BM.offsets[bustName]) {
			ox = Galv.BM.offsets[bustName][0] || 0;
			oy = Galv.BM.offsets[bustName][1] || 0;
		}

		const sw = width;
		const sh = Galv.BM.bustHeight;
		const dx = x - 1;
		const dy = y + Galv.BM.bust;
		const sx = bitmap.width / 2 - width / 2 - ox;
		const sy = oy;
		this.contents.unlimitedBlt(bitmap, sx, sy, sw, sh, dx, dy);
	};
};
