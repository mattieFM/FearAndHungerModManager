/** @namespace MATTIE.tpAPI an api containing all tps for funger 1 and 2 */
MATTIE.tpAPI = {};

/**
 * @description tp the player to a location
 * @param {int} id mapid
 * @param {int} x x cord
 * @param {int} y y cord
 * @param {bool} goto whether the screen should change to the game map or not
 */
MATTIE.tpAPI.genericTp = function (id, x, y, goto = true) {
	if (goto) { SceneManager.goto(Scene_Map); }
	// teleport the player to the fortress
	$gamePlayer.reserveTransfer(id, x, y, 0, 2);
	setTimeout(() => {
		$gamePlayer.performTransfer();
	}, 500);
};

/**
 * @description teleport to the fortress spawn
 */
MATTIE.tpAPI.fortressSpawn = function () {
	this.genericTp(MATTIE.static.maps.fortress, 14, 9);
};

/**
 * @description teleport to the level one entrance of the current variant
 */
MATTIE.tpAPI.levelOneEntrance = function () {
	switch (MATTIE.util.getMapVariant(0)) {
	case 'a':
		this.genericTp(MATTIE.static.maps.levelOneEntranceA, 27, 67);
		break;
	case 'b':
		this.genericTp(MATTIE.static.maps.levelOneEntranceB, 26, 68);
		break;
	case 'c':
		this.genericTp(MATTIE.static.maps.levelOneEntranceC, 26, 68);
		break;
	default:
		break;
	}
};

/**
 * @description teleport to the level one inner hall of the current variant
 */
MATTIE.tpAPI.levelOneInnerHall = function () {
	switch (MATTIE.util.getMapVariant(2)) {
	case 'a':
		this.genericTp(MATTIE.static.maps.levelOneInnerHallA, 36, 64);
		break;
	case 'b':
		this.genericTp(MATTIE.static.maps.levelOneInnerHallB, 26, 65);
		break;
	case 'c':
		this.genericTp(MATTIE.static.maps.levelOneInnerHallC, 27, 65);
		break;
	default:
		break;
	}
};

/**
 * @description teleport to the level one backyard
 */
MATTIE.tpAPI.levelOneBackyard = function () {
	this.genericTp(MATTIE.static.maps.levelOneBackyard, 28, 53);
};

/**
 * @description teleport to the bunnymasks in level one backyard
 */
MATTIE.tpAPI.levelOneBunnyMasks = function () {
	this.genericTp(MATTIE.static.maps.levelOneBackyard, 14, 10);
};

/**
 * @description teleport to the level 2 bloodpit of the current variant
 */
MATTIE.tpAPI.levelTwoBloodPit = function () {
	this.genericTp(MATTIE.static.maps.levelTwoBloodPitA, 33, 36);
};

/**
 * @description teleport to the level 3 prisons of the current variant
 */
MATTIE.tpAPI.levelThreePrisons = function () {
	switch (MATTIE.util.getMapVariant(5)) {
	case 'a':
		this.genericTp(MATTIE.static.maps.levelThreePrisonsA, 5, 35);
		break;
	case 'b':
		this.genericTp(MATTIE.static.maps.levelOneInnerHallB, 4, 38);
		break;
	case 'c':
		this.genericTp(MATTIE.static.maps.levelOneInnerHallC, 3, 33);
		break;
	default:
		break;
	}
};

/**
 * @description teleport to the level 5 thickets of the current variant next to the eastern sword
 */
MATTIE.tpAPI.levelFiveThickets = function () {
	switch (MATTIE.util.getMapVariant(13)) {
	case 'a':
		this.genericTp(MATTIE.static.maps.levelFiveThicketsA, 4, 24);
		break;
	case 'b':
		this.genericTp(MATTIE.static.maps.levelFiveThicketsB, 14, 22);
		break;
	case 'c':
		this.genericTp(MATTIE.static.maps.levelFiveThicketsC, 14, 22);
		break;
	default:
		break;
	}
};

/**
 * @description teleport to the level 7 location of legard
 */
MATTIE.tpAPI.levelSevenLegard = function () {
	this.genericTp(MATTIE.static.maps.levelSevenDungeons, 59, 20);
};

/**
 * @description teleport to the level 6 cave village
 */
MATTIE.tpAPI.levelSixCaveVillage = function () {
	this.genericTp(MATTIE.static.maps.levelSixMines, 60, 48);
};

MATTIE.tpAPI.terminaOldHouse = function () {
	this.genericTp(MATTIE.static.maps.termina.oldHouse, 22, 43);
};

/**
 * @description teleport to the Termina train cabins
 */
MATTIE.tpAPI.terminaTrainCabins = function () {
	this.genericTp(MATTIE.static.maps.termina.trainCabins, 6, 6);
};

/**
 * @description teleport to the Termina outskirts area
 */
MATTIE.tpAPI.terminaOutskirts = function () {
	this.genericTp(MATTIE.static.maps.termina.outskirts, 32, 30);
};

/**
 * @description teleport to Old Town in Termina
 */
MATTIE.tpAPI.terminaOldTown = function () {
	this.genericTp(MATTIE.static.maps.termina.oldTown, 25, 30);
};

/**
 * @description teleport to Prehevil central in Termina
 */
MATTIE.tpAPI.terminaPrehevil = function () {
	this.genericTp(MATTIE.static.maps.termina.prehevil, 20, 25);
};

/**
 * @description teleport to Prehevil East (Church area)
 */
MATTIE.tpAPI.terminaPrehEast = function () {
	this.genericTp(MATTIE.static.maps.termina.prehEast, 15, 20);
};

/**
 * @description teleport to Prehevil West (School area)
 */
MATTIE.tpAPI.terminaPrehWest = function () {
	this.genericTp(MATTIE.static.maps.termina.prehWest, 15, 20);
};

/**
 * @description teleport to the Deep Woods in Termina
 */
MATTIE.tpAPI.terminaDeepWoods = function () {
	this.genericTp(MATTIE.static.maps.termina.deepWoods, 15, 20);
};

/**
 * @description teleport to the Riverside / Lake area in Termina
 */
MATTIE.tpAPI.terminaRiverside = function () {
	this.genericTp(MATTIE.static.maps.termina.riverside, 20, 20);
};

/**
 * @description teleport to the Mayor's Manor in Termina
 */
MATTIE.tpAPI.terminaMayorsManor = function () {
	this.genericTp(MATTIE.static.maps.termina.mayorsManor, 10, 15);
};

/**
 * @description teleport to Tunnel 7 in Termina
 */
MATTIE.tpAPI.terminaTunnel7 = function () {
	this.genericTp(MATTIE.static.maps.termina.tunnel7, 10, 10);
};

/**
 * @description teleport to Tunnel 0 entrance in Termina
 */
MATTIE.tpAPI.terminaTunnel0 = function () {
	this.genericTp(MATTIE.static.maps.termina.tunnel0, 10, 10);
};

/**
 * @description teleport to the Sewers in Termina
 */
MATTIE.tpAPI.terminaSewers = function () {
	this.genericTp(MATTIE.static.maps.termina.sewers, 10, 10);
};

/**
 * @description teleport to the Hollow Tower in Termina
 */
MATTIE.tpAPI.terminaHollowTower = function () {
	this.genericTp(MATTIE.static.maps.termina.hollowTower, 10, 10);
};

/**
 * @description teleport to the Speakeasy bar in Termina
 */
MATTIE.tpAPI.terminaSpeakeasy = function () {
	this.genericTp(MATTIE.static.maps.termina.speakeasy, 10, 10);
};

/**
 * @description teleport to Hexen village in Termina
 */
MATTIE.tpAPI.terminaHexen = function () {
	this.genericTp(MATTIE.static.maps.termina.hexen, 15, 15);
};

/**
 * @description teleport to the level 6 cave village inside room cube of the depths
 */
MATTIE.tpAPI.levelSixCaveVillageCOD = function () {
	this.genericTp(MATTIE.static.maps.villageHutsInsides, 55, 28);
};

/**
 * @description teleport to the level 6 cave village where dark'ie is
 */
MATTIE.tpAPI.levelSixCaveVillageDarkie = function () {
	this.genericTp(MATTIE.static.maps.levelSixMines, 17, 29);
};

/**
 * @description teleport to the level 5 mines
 */
MATTIE.tpAPI.levelFiveMines = function () {
	switch (MATTIE.util.getMapVariant()) {
	case 'a':
		this.genericTp(MATTIE.static.maps.levelFiveMinesA, 20, 65);
		break;
	case 'b':
		this.genericTp(MATTIE.static.maps.levelFiveMinesB, 17, 80);
		break;
	case 'c':
		this.genericTp(MATTIE.static.maps.levelFiveMinesC, 52, 85);
		break;
	default:
		break;
	}
};
