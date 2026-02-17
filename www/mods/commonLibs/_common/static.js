var MATTIE_ModManager = MATTIE_ModManager || {};

/**
 * @namespace MATTIE.static
 * @description This namespace contains all game specific values IE: if you need crow mauler's id it should be here.
 * This also allows us to update values that are present in both 1 & 2 to their correct values
 */
MATTIE.static = MATTIE.static || {};

/**
 * @namespace MATTIE.static.items
 * @description This name space contains all static item values
 */
MATTIE.static.items = MATTIE.static.items || {};

/**
 * @namespace MATTIE.static.actors
 * @description This name space contains all static actor values
 */
MATTIE.static.actors = MATTIE.static.actors || {};

/**
 * @namespace MATTIE.static.skills
 * @description This name space contains all static skills values
 */
MATTIE.static.skills = MATTIE.static.skills || {};

/**
 * @namespace MATTIE.static.states
 * @description This name space contains all static state values
 */
MATTIE.static.states = MATTIE.static.states || {};

/**
 * @namespace MATTIE.static.rpg
 * @description This name space contains very few rpgmaker constants
 * @deprecated create a types declaration later when we have a chance
 */
MATTIE.static.rpg = MATTIE.static.rpg || {};

/**
 * @namespace MATTIE.static.commonEvents
 * @description contains common event info
 */
MATTIE.static.commonEvents = MATTIE.static.commonEvents || {};

/** @description common event id for small food */
MATTIE.static.commonEvents.smallFood = 31;

/** @description common event id for Mediumm food */
MATTIE.static.commonEvents.medFood = 32;

/** @description common event id for Mediumm food */
MATTIE.static.commonEvents.largeFood = 33;

/** @description an array containing all common event food ids */
MATTIE.static.commonEvents.foods = [MATTIE.static.commonEvents.smallFood, MATTIE.static.commonEvents.medFood, MATTIE.static.commonEvents.largeFood];

/**
 * @namespace MATTIE.static.variable
 * @description contains game variables
 */
MATTIE.static.variable = MATTIE.static.variable || {};

/**
 * @namespace MATTIE.static.switch
 * @description contains game switches
 */
MATTIE.static.switch = MATTIE.static.switch || {};

/** @description the switch for terror and starvation dif */
MATTIE.static.switch.STARVATION = 3153;

/**
 * @namespace MATTIE.static.commands
 * @description contains rpgmaker command codes
 * @deprecated build a types declaration later
 */
MATTIE.static.commands = MATTIE.static.commands || {};

/**
 * @namespace MATTIE.static.maps
 * @description contains map info
 */
MATTIE.static.maps = MATTIE.static.maps || {};

/**
 * @namespace MATTIE.static.events
 * @description contains events info
 */
MATTIE.static.events = MATTIE.static.events || {};

/**
 * @namespace MATTIE.static.events.images
 * @description contains images info
 */
MATTIE.static.events.images = MATTIE.static.events.images || {};

// commandIds
MATTIE.static.commands.transferId = 201;
MATTIE.static.commands.battleProcessingId = 301;
MATTIE.static.commands.ifWin = 601;
MATTIE.static.commands.selfSwitch = 123;
MATTIE.static.commands.commonEventid = 117;
/** @description the id of the show choices command */
MATTIE.static.commands.showChoices = 102;
/** @description the id of the comment command */
MATTIE.static.commands.commentId = 108;
/** @description the id of the when command */
MATTIE.static.commands.when = 402;
/** @description the id of the script command */
MATTIE.static.commands.script = 355;
// maps

MATTIE.static.maps.menuMaps = [];
/** @description maps that the player will get fully stuck on if they enter */
MATTIE.static.maps.blockingMaps = [];
MATTIE.static.maps.charCreationMap = 0;
MATTIE.static.maps.startMap = 0;
MATTIE.static.maps.fortress = 74;
MATTIE.static.maps.levelOneEntranceA = 1;
MATTIE.static.maps.levelOneEntranceB = 29;
MATTIE.static.maps.levelOneEntranceC = 51;
MATTIE.static.maps.levelOneInnerHallA = 3;
MATTIE.static.maps.levelOneInnerHallB = 31;
MATTIE.static.maps.levelOneInnerHallC = 53;
MATTIE.static.maps.levelOneBackyard = 9;
MATTIE.static.maps.levelTwoBloodPitA = 5;
MATTIE.static.maps.levelThreePrisonsA = 6;
MATTIE.static.maps.levelThreePrisonsB = 37;
MATTIE.static.maps.levelThreePrisonsC = 59;
MATTIE.static.maps.levelFiveThicketsC = 68;
MATTIE.static.maps.levelFiveThicketsB = 46;
MATTIE.static.maps.levelFiveThicketsA = 21;
MATTIE.static.maps.levelSevenDungeons = 24;
MATTIE.static.maps.levelSixMines = 16;
MATTIE.static.maps.villageHutsInsides = 22;
MATTIE.static.maps.levelFiveMinesA = 11;
MATTIE.static.maps.levelFiveMinesB = 39;
MATTIE.static.maps.levelFiveMinesC = 184;

MATTIE.static.maps.termina = {
	oldHouse: 11,
	start: 10,
	charCreation: 3,
	introTrain: 19,
	introMoonScene: 8,
	path1: 4,
	outskirts1: 15,
	outskirtPath: 114,
	abandonedHouse: 5,
	cottage: 13,
	trainCabins: 14,
	oldTown1: 16,
	oldTown2: 9,
	oldTown3: 41,
	prehevil: {
		staircase: 36,
		east: 37,
		central: 38,
		west: 39,
		west2: 156,
		backAlleys: 55,
		backAlleys2: 79,
		northWest: 57,
		shoppingStreet: 58,
		templeSite: 59,
		mausoleumAlley: 80,
		eastOutskirts: 138,
		alleyway: 177,
	},
	church: 44,
	churchLevel2: 51,
	churchPassageway: 81,
	confessional: 109,
	school: 77,
	school2: 87,
	schoolyard: 88,
	schoolBasement: 108,
	riverside: 40,
	lake: 42,
	devilsIsland: 112,
	forest: 23,
	deepWoods: 64,
	deeperWoods: 65,
	deepestWoods: 113,
	hiddenWoods: 145,
	cavern: 92,
	tunnel7: 24,
	tunnel6: 104,
	tunnel5: 50,
	tunnel4: 167,
	tunnel1Entrance: 115,
	tunnel1: 116,
	tunnel0Entrance: 125,
	tunnel0Level1: 127,
	tunnel0Level2: 134,
	tunnel0Level3: 137,
	tunnel0Level4: 136,
	sewers1: 78,
	sewers2: 98,
	sewers3: 101,
	sewers4: 106,
	sewersEntrance: 123,
	sewagePlant: 96,
	mayorsManor: 20,
	manorBasement: 103,
	twoStoryHouse: 21,
	restaurant: 53,
	bookStore: 54,
	museum: 84,
	museumBallroom: 117,
	speakeasy: 105,
	renkaCafe: 56,
	clothingStore: 66,
	departmentStore: 83,
	occultStore: 89,
	newsAgency: 131,
	oldHotel: 94,
	apartments1F: 69,
	apartmentsBasement: 70,
	apartments2F: 71,
	apartments3F: 75,
	apartmentsSmall: 95,
	hexen: 31,
	moonTower: 32,
	hollowTower: 119,
	hollowTower2: 120,
	otherside: 82,
	otherside2: 148,
	workshop: 17,
	crypt: 170,
	ruinedCity: 60,
	grandHallFinal: 139,
	splashScreen: 72,
	dayChange: 129,
	endings: 151,
}

// items
MATTIE.static.items.emptyScroll = null;
MATTIE.static.items.icons = {};
MATTIE.static.items.icons.bookIcon = 0;
/** @description the id of an item that cannot be obtained, default flashlight */
MATTIE.static.items.unobtainable = 6;

MATTIE.static.troops = MATTIE.static.troops || {};

// skills
MATTIE.static.skills.bloodportal = null;
MATTIE.static.skills.hurting = null;
MATTIE.static.skills.bloodGolem = null;
MATTIE.static.skills.greaterBloodGolem = null;
MATTIE.static.skills.healingWhispers = null;
MATTIE.static.skills.run = null;
MATTIE.static.skills.enGarde = null;

// RPGMaker Constants
MATTIE.static.rpg.battleProcessingId = 301;

/** @description a dict of command ids */
MATTIE.static.rpg.commands = {
	setMovementRoute: 205,
};

// Variableids
/** @description a list of sync variables for multiplayer */
MATTIE.static.variable.syncedVars = [];

/** @description a list of ignored variables for multiplayer */
MATTIE.static.variable.ignoredVars = [];

/** @description a list of secondary synced variables for multiplayer (less prio) */
MATTIE.static.variable.secondarySyncedVars = [];

/** @description a list of all variables that govern god affinity */
MATTIE.static.variable.godAffinityAndPrayerVars = [];
/** @description the id of the grogoroth affinity var */
MATTIE.static.variable.groGorothAffinity = 162;

/** @description the id of the sylvian affinity var */
MATTIE.static.variable.groSylvianAffinity = 163;

/** @description the id of the all mer affinity var */
MATTIE.static.variable.allMerAffinity = 164;

/** @description the id of the all mer affinity var */
MATTIE.static.variable.godOfTheDepthsAffinity = 165;

/** @description used by the cheat menu to teleport to key points */
MATTIE.static.teleports = [];
// switchids
MATTIE.static.switch.ignoredSwitches = [];
/** @description an array that contains all switches a user might want to change mid game */
MATTIE.static.switch.cheatSwitches = [];
/** @description an array that contains all switches for player limbs */
MATTIE.static.switch.characterLimbs = [];
MATTIE.static.switch.logical = [];
MATTIE.static.switch.kill = [];
MATTIE.static.switch.syncedSwitches = [];
MATTIE.static.switch.godAffinitySwitches = [];

/** @description the id of phase step switch */
MATTIE.static.switch.phaseStep = 2844;
/** @description true if the player has been to the mines or thicket */
MATTIE.static.switch.crowMaulerCanSpawn = 0;
/** @description true if the crow mauler is dead */
MATTIE.static.switch.crowMaulerDead = 0;
/** @description true if crow mauler is disabled */
MATTIE.static.switch.crowMaulerDisabled = 0;

/** @description the switch that handles most coin flip instant kill / grab attack */
MATTIE.static.switch.neckBreak = 16;

/** @description the switch tht handles en garde extra turn */
MATTIE.static.switch.backstab = 1045;

MATTIE.static.switch.justGuard = 1281;

/** @description the switch that handles changing enemy health in harder mods */
MATTIE.static.switch.toughEnemyMode = 3155;
/** @description the switch for when the player is talking */
MATTIE.static.switch.talk = 52;

/** @description the switch that holds whether the torch timer is active or not */
MATTIE.static.switch.torchTimer = 3151;

// selfSwitch ids
MATTIE.static.switch.syncedSelfSwitches = [];
MATTIE.static.switch.ignoredSelfSwitches = [];

/** @description the switch for trepidation and famine difficulty */
MATTIE.static.switch.taf = 3118;

// states
/** this is the state that governs "death" in combat */
MATTIE.static.states.knockout = 0;
/** @description block teh enemy from acting for one round */
MATTIE.static.states.cantDoShitOnce = 36;

/** @description block teh enemy from acting for every round */
MATTIE.static.states.cantDoShit = 13;

/** @description state that makes host not die */
MATTIE.static.states.resistDeath = 91;

/** @description state for leg loss */
MATTIE.static.states.legCut = 14;

/** @description state for arm loss */
MATTIE.static.states.armCut = 3;

/** @description state for bleeding */
MATTIE.static.states.bleeding = 5;
// troopids
MATTIE.static.troops.crowMauler = 51;
MATTIE.static.troops.salmonSnakeId = 50;
MATTIE.static.troops.blackWitchId = 96;
MATTIE.static.troops.caveMotherId = 19;
MATTIE.static.troops.harvestManId = 55;
MATTIE.static.troops.bodySnatcherId = 160;
MATTIE.static.troops.redManId = 74;
MATTIE.static.troops.greaterBlightId = 191;
MATTIE.static.troops.blightId = 185;
MATTIE.static.troops.moldedId = 178;
MATTIE.static.troops.torturerId = 17;
MATTIE.static.troops.nightLurch = 149;
MATTIE.static.troops.infectedNightLurch = 187;
MATTIE.static.troops.greaterMumbler = 193;
MATTIE.static.troops.moonlessGaurdId = 117;
MATTIE.static.troops.isayahId = 138;
MATTIE.static.troops.seymor = 205;
MATTIE.static.troops.ironShakespeareId = 57;
MATTIE.static.troops.knightSpectorId = 22;
MATTIE.static.troops.gauntKnightId = 140;
MATTIE.static.troops.assassinSpectreId = 56;
MATTIE.static.troops.darceId = 119;
MATTIE.static.troops.enkiId = 69;
MATTIE.static.troops.caharaId = 67;
MATTIE.static.troops.ragnId = 120;
MATTIE.static.troops.oldKnightId = 21;
MATTIE.static.troops.whiteAngelId = 100;
MATTIE.static.troops.doubleHeadedCrowId = 135;
MATTIE.static.troops.butterFlyId = 9;
MATTIE.static.troops.tripleCrow = 27;
MATTIE.static.troops.crowMaulerId = 51;
MATTIE.static.troops.secretId = 0; // enki marraige
MATTIE.static.troops.namelessId = 97;
MATTIE.static.troops.oldGuardianId = 101;
MATTIE.static.troops.lizardMageId = 214;
MATTIE.static.troops.skinGrannyId = 109;
MATTIE.static.troops.fancoisId = 115;
MATTIE.static.troops.chambaraId = 75;
MATTIE.static.troops.valteilId = 110;
MATTIE.static.troops.gorothId = 169;
MATTIE.static.troops.sylvianId = 210;
MATTIE.static.troops.griffithId = 126;
MATTIE.static.troops.GOFAHID = 130;

// actors
/** @description the actor id of blood golem */
MATTIE.static.actors.bloodGolemId = 10; // blood golem id is 10 in both 1 and 2
MATTIE.static.actors.mercenaryId = 0;
MATTIE.static.actors.moonlessId = 7;
MATTIE.static.actors.girlId = 0;
MATTIE.static.actors.knightId = 0;
MATTIE.static.actors.darkPriestId = 0;
MATTIE.static.actors.outlanderId = 0;
MATTIE.static.actors.leGardeId = 0;
MATTIE.static.actors.demonKidId = 0;
MATTIE.static.actors.marriageId = 0;
MATTIE.static.actors.abominableMarriage = 0;
MATTIE.static.actors.nashrahId = 0;
MATTIE.static.actors.emptyActorSlotId = 0;

// events
MATTIE.static.events.crowMauler = null;

// images
MATTIE.static.events.images.shiny = {};
MATTIE.static.events.images.coin = MATTIE.static.events.images.shiny;

// skills
MATTIE.static.skills.bloodportal = $dataSkills[148];
MATTIE.static.skills.hurting = $dataSkills[12];
MATTIE.static.skills.bloodGolem = $dataSkills[51];
MATTIE.static.skills.greaterBloodGolem = $dataSkills[103];
MATTIE.static.skills.healingWhispers = $dataSkills[151];
MATTIE.static.skills.run = $dataSkills[40];
MATTIE.static.skills.enGarde = $dataSkills[146];

// common events
MATTIE.static.commonEvents.bloodportal = $dataCommonEvents[152];
MATTIE.static.commonEvents.credits = $dataCommonEvents[310];

/** @description loot table event for scrolls */
MATTIE.static.commonEvents.randomScroll = 149;

/** @description loot table event for rare books? */
MATTIE.static.commonEvents.randomRareBook = 178;

/** @description loot table event for minor books? */
MATTIE.static.commonEvents.randomMinorBook = 179;

/** @description loot table event for Great items (just soul stone? */
MATTIE.static.commonEvents.randomGreatItem = 200;

/** @description loot table event for weapons items */
MATTIE.static.commonEvents.randomWeapon = 238;

/** @description loot table event for minor weapons items */
MATTIE.static.commonEvents.randomMinorWeapon = 239;

/** @description loot table event for likely dungoen knights */
MATTIE.static.commonEvents.randomNightItems = 250;

/** @description loot table event for minor items */
MATTIE.static.commonEvents.randomMinorItems = 23;

/** @description loot table event for minor books */
MATTIE.static.commonEvents.randomMinorBook = 25;

/** @description loot table event for rare books */
MATTIE.static.commonEvents.randomRareBook = 26;

/** @description loot table event for blood magic books */
MATTIE.static.commonEvents.randomBloodBook = 29;

/** @description loot table event for food */
MATTIE.static.commonEvents.randomFood = 52;

/** @description loot table event for rare items */
MATTIE.static.commonEvents.randomRareItem = 58;

/** @description loot table event for the achemilias */
MATTIE.static.commonEvents.randomAlchemy = 68;

/** @description loot table event for good armor */
MATTIE.static.commonEvents.randomGoodArmor = 141;

/**
 * @description an array of all common event loot tables
 */
MATTIE.static.commonEvents.lootTables = [];

MATTIE.static.events.crowMauler = (() => MATTIE.eventAPI.getEventOnMap(287, 11));

// states
MATTIE.static.states.knockout = 0;
MATTIE.static.states.blind = 49;

// Functions
/** @description check if the player is on a menu map */
MATTIE.static.maps.onMenuMap = () => MATTIE.static.maps.menuMaps.includes($gameMap.mapId());
MATTIE.static.maps.onStartMap = () => MATTIE.static.maps.startMap == $gameMap.mapId();
MATTIE.static.maps.onCharCreateMap = () => MATTIE.static.maps.charCreationMap == $gameMap.mapId();
// Update Function

MATTIE.static.update = function () {
	MATTIE.global.checkGameVersion(); // make sure version is valid

	// eslint-disable-next-line no-constant-condition
	if (MATTIE.global.isFunger()) { // for now just use funger 1 vars regardless
		if (!MATTIE.DataManager.global.get('correctVersion')) {
			if (confirm('The mod loader thinks you are running fear and hunger 1.'
			+ 'If this is correct click okay to hide this prompt.'))MATTIE.DataManager.global.set('correctVersion', true);
		}
		// static values specific to funger 1

		MATTIE.static.commonEvents.lootTables = [];

		MATTIE.static.teleports = [
			{
				id: 0, name: 'Spawn', cmd: () => MATTIE.tpAPI.fortressSpawn(), bool: () => true, btn: true,
			},
			{
				id: 1, name: 'Level 1 - Dungeon Entrance', cmd: () => MATTIE.tpAPI.levelOneEntrance(), bool: () => true, btn: true,
			},
			{
				id: 2, name: 'Level 1 - Inner Halls', cmd: () => MATTIE.tpAPI.levelOneInnerHall(), bool: () => true, btn: true,
			},
			{
				id: 3, name: 'Level 2 - Blood Pit', cmd: () => MATTIE.tpAPI.levelTwoBloodPit(), bool: () => true, btn: true,
			},
			{
				id: 4, name: 'Level 3 - Prisons', cmd: () => MATTIE.tpAPI.levelThreePrisons(), bool: () => true, btn: true,
			},
			{
				id: 5, name: 'Level 5 - Mines', cmd: () => MATTIE.tpAPI.levelFiveMines(), bool: () => true, btn: true,
			},
			{
				id: 6, name: 'Level 5 - Thickets', cmd: () => MATTIE.tpAPI.levelFiveThickets(), bool: () => true, btn: true,
			},
			{
				id: 7, name: 'Level 6 - Cave Dweller Village', cmd: () => MATTIE.tpAPI.levelSixCaveVillage(), bool: () => true, btn: true,
			},
			{
				id: 8, name: 'Level 6 - Cube Of The Depths', cmd: () => MATTIE.tpAPI.levelSixCaveVillageCOD(), bool: () => true, btn: true,
			},
			{
				id: 9, name: 'Level 6 - Dar\'ce', cmd: () => MATTIE.tpAPI.levelSixCaveVillageDarkie(), bool: () => true, btn: true,
			},
			{
				id: 10, name: 'Level 7 - LeGarde', cmd: () => MATTIE.tpAPI.levelSevenLegard(), bool: () => true, btn: true,
			},

		];

		// cheat menu switches
		MATTIE.static.switch.characterLimbs = [
			'696-699', // moonless dismemberment
			'270-272', // also moonless dismemberment, likely one of these is enemy moonless
			'36-39', // mercenary dismemberment
			'248-251', // knight dismemberment
			'252-255', // enki dismemberment
			'256-259', // outlander dismemberment
			'261-264', // legard dismemberment
			'376-379', // blood golem dismemberment
			'381-384', // demon kid dismemberment
			'385-388', // marrige dismemberment
			'390-393', // fusion dismemberment
			'841-852', // skelleton dismemberment
		];

		/** @description a set of switches for the cheat menu covering game logic */
		MATTIE.static.switch.logical = [
			{ id: 198, name: 'Cahara sacrifice TTOT' },
			{ id: 3115, name: 'Finish Trotur Quest' },
			{ id: 2190, name: 'HARD MODE' },
			{ id: 3155, name: 'HARD ENEMY MODE' },
			{ id: 81, name: 'Girl Freed' },
			{ id: 117, name: 'Elevator' },
			{ id: 786, name: 'Crow Can Spawn' },
			{ id: 1560, name: 'Gauntlet Entrance Open' },
		];

		MATTIE.static.switch.characterLimbs = MATTIE.static.rangeParser(MATTIE.static.switch.characterLimbs);

		MATTIE.static.switch.crowMaulerCanSpawn = 786;
		MATTIE.static.switch.crowMaulerDead = 771;

		MATTIE.static.switch.crowMaulerDisabled = 2953;

		MATTIE.static.switch.legardAliveSwitch = 1016;

		// actors
		MATTIE.static.actors.emptyActorSlotId = 15;
		MATTIE.static.actors.mercenaryId = 1;
		MATTIE.static.actors.girlId = 2;
		MATTIE.static.actors.knightId = 3;
		MATTIE.static.actors.darkPriestId = 4;
		MATTIE.static.actors.outlanderId = 5;
		MATTIE.static.actors.leGardeId = 6;
		MATTIE.static.actors.demonKidId = 8;
		MATTIE.static.actors.marriageId = 9;
		MATTIE.static.actors.abominableMarriage = 11;
		MATTIE.static.actors.nashrahId = 14;

		// maps

		MATTIE.static.maps.menuMaps = [
			10, // start
			2, // char creation
			72,
			73, // fortress intro
			86, // fortress ending
			130, // dungoen knights
			61, // unused hexen map
			64, // unused test map
			170,
			161, // dungeon menu
			33,
			181,

		];

		MATTIE.static.blockingMaps = [
			132,
			122,
			131,
			153,
			160,
			185,
			40,
			10,
			86,
			139,
			129,
			147,
			98,
			14,
			130,
			88,
			89,
			62,
			15,
			137,
			66,
			124,
			156,
			64,
			161,
			1,
			162,
			104,
			170,
			168,
			138,
			137,
			54,
			32,
			7,
			9,
			13,
			25,
			140,
			152,
			144,
			28,
			12,
			186,
			163,
			159,
			91,
			15,
			50,
			72,
			94,

		];

		MATTIE.static.dungeonKnights = [
			161,
			158,
			165,
			166,
			167,
			162,
			168,
			169,
			176,
			177,
			170,
			171,
			172,

			174,
			175,
			178,
			179,
			173,
			180,
			181,

		];
		MATTIE.static.maps.charCreationMap = 2;
		MATTIE.static.maps.startMap = 10;

		MATTIE.static.maps.menuMaps = MATTIE.static.rangeParser(MATTIE.static.maps.menuMaps);

		// items
		MATTIE.static.items.emptyScroll = $dataItems[88];
		MATTIE.static.items.silverCoin = $dataItems[59];
		MATTIE.static.items.icons.bookIcon = 121;

		// selfSwitch ids
		MATTIE.static.switch.syncedSelfSwitches = [
			// self switches for temple of torment
			// [mapid, eventid, letter]
			[85, 54, 'A'],
			[85, 46, 'A'],
			[85, 47, 'A'],
			[85, 48, 'A'],
		];
		MATTIE.static.switch.syncedSelfSwitches = MATTIE.static.switch.syncedSelfSwitches.map((arr) => JSON.stringify(arr));

		MATTIE.static.switch.ignoredSelfSwitches = [
			// hexen control vars
			[53, 280, 'A'],
			[39, 332, 'A'],
			// char creation menu switches
			[10, 1, 'A'],
		];
		MATTIE.static.switch.ignoredSelfSwitches = MATTIE.static.switch.ignoredSelfSwitches.map((arr) => JSON.stringify(arr));

		// switches
		MATTIE.static.switch.ignoredSwitches = [
			//-------------------------------------------------------
			//          Char Switches
			//-------------------------------------------------------
			'242-246', // the switches that tell the game what char you are playing as\
			380, // fusion select
			375, // marrige select
			'661-664', // inital chars
			'721-724', // moonless piss level

			//-------------------------------------------------------
			//          Status Switches
			//-------------------------------------------------------
			// -- dismemberment switches --
			'696-700', // moonless dismemberment
			'270-273', // also moonless dismemberment, likely one of these is enemy moonless
			'36-39', // mercenary dismemberment
			'248-251', // knight dismemberment
			'252-255', // enki dismemberment
			'256-259', // outlander dismemberment
			'261-264', // legard dismemberment
			'376-379', // blood golem dismemberment
			'381-384', // demon kid dismemberment
			'385-388', // marrige dismemberment
			'390-393', // fusion dismemberment
			'841-852', // skelleton dismemberment
			'1824-1827', // darce dismemberment

			'3228-3239', // marriage dismemberment 2?
			'3241-3245', // rag dismemberment 2?

			// -- torch switches
			'3181-3186', // torches

			// -- state switches --
			15, // Anal Bleed
			20, // Anal Bleed Grand Switch
			'265-269', // Main Char anal bleed switches
			389, // marrige anal bleed
			394, // fusion anal bleed
			814, // paranoia small
			815, // rapanoia
			816, // blindness
			'817-829', // not crippled switches
			'1541-1544', // grave_merc, grave_outlander?
			'1728-1746', // curse
			'1810-1812', // fire, burning, death.
			'2939-2943', // the girl beaten... ragn beaten... ?
			'3569-3578', // demon kid sword.... goul_wait...?

			//-------------------------------------------------------
			//          location switches (IE: switches that keep track of where the player is)
			//-------------------------------------------------------
			'701-719', // player current location switches IE: where is the player currently.
			'183-188',
			'1063-1104', // patch switches
			'1481-1513', // mehabre locations
			'1550-1553', // more mehbare
			'2317-2320', // location_tombs achient
			'2425-2430', // achient tombs directions, left! middle! right!
			2592, // void location

			//-------------------------------------------------------
			//          Overworld switches (A bit general of a catagory, but think stuff like arrows, traps etc...)
			//-------------------------------------------------------
			// 59, //"arrow1" has to do with arrow traps, might need to be disabled, but I think it should be forwarded.
			// loot needs vars:
			'2064-2067',
			3154,

			3175,
			// --fear
			271, // something with fear
			'830-837', // fear_floor switches
			862, // hallucinations
			863, // fear reset switch
			901, // hallucinations 2 (me no know)
			'3246-3248', // fear_effect1-3
			'3249-3258', // more fear, fear_girl... fear_darce.
			'3521-3526', // fear_once?

			342, // yellow mage hurting zone
			343, // more yellow mage
			'399-405', // show love vars
			410, // cannot use bow
			471, // merc show love
			583, // bugs
			'585-603', // more bugs
			'606-611', // more bugs
			'2230-2233', // more bugs

			// -- gauntlet trap switches --
			'1214-1241', // gauntlet spikes. We do not need the spikes to be synced between clients
			1241, // gauntlet spike trap
			'1244-1256', // spike rows
			'1261-1269', // swinging axes
			'3001-3047', // gaultet ball and gass
			// --mahabre
			'1321-1326', // flame traps

			'2593-2594', // void logic
			2588, // hiding switch

			3508, // stepped on trap? probably handles rusty nail

			3539, // sleeping cooldown

			//-------------------------------------------------------
			//          Skill Switches
			//-------------------------------------------------------
			52, // talk skill?
			260, // suicide learned
			341, // necromancy available
			729, // lockpicking available
			731, // marksmanship available
			766, // devour available
			584, // mastery over insects
			801, // demon seed learned
			802, // greater blood magic learned
			803, // blood sacrifice available
			864, // greater_necromancy ok
			'1041-1045', // backstab/engurd stuff
			1167, // blood portal learned
			'1185-1209', // most of the skills.
			1211, // skill fast stance
			2251, // bow ok
			2250, // dash ok
			'2844-2845', // phase step

			//-------------------------------------------------------
			//          Menu Switches
			//-------------------------------------------------------
			242, // knight select
			243, // dark preist select
			246, // merc select
			244, // out lander select

			'5-8', // probably char creation switches
			'213-214', // more menus
			'295-296', // intro
			411, // scene skip allowed
			952,
			1210, // hexen cursor
			1212, // hexen cursor
			1213, // hexen cursor
			'2521-2530', // char select "CAHARA SELCECT"... "NILVAN_SELECT" I think these are dungeon knights
			3520, // filter effects

			//-------------------------------------------------------
			//          Item Switches
			//-------------------------------------------------------
			31, // wether the player has the necronomicon
			799, // pasages of mahabre got
			1059, // cube of the depths switch, (we want there to be multiple)
			1530, // cube cooldown?
			1997, // can use cube
			2519, // purified eastern sword event.
			120, // multiple copies of mockup book.

			//-------------------------------------------------------
			//          Coin Flip Attack Switches (switches that control coin flip attack,
			//          we will not forward these as that would make coin flip attacks happen twice).
			//-------------------------------------------------------
			'16-17', // guard tackle and neck break
			66, // priest chanting
			69, // ghoul1 tackle

			//--------------------------------------------------------------------------
			//          Weird Switches (That probably should be ignored)
			//--------------------------------------------------------------------------
			1996, // not in use switch, seems to handle some autorun blocking events
			41, // "disabled" switch. This has something to do with movement speed so it should not be forwarded
			80, // "Wizard Summon" something with nzashra probably?
			126, // "Shielding1"
			813, // "DONT ACTIVATE" with a name like that im not forwarding this switch XDD
			953, // "not used"
			'986-994', // wierd Cahara stuff
			2481, // "Curse_game_is_on!"  dont know what it does so we will ignore it

			//--------------------------------------------------------------------------
			//          Logical Switches
			//--------------------------------------------------------------------------
			79, // handles some logic regarding starting the game and char selection
			'201-202', // handles suicide
			'213-214', // handles some intro stuff
			299, // while bow in use?
			660, // demon kid give to pocket cat
			695, // demon kid growing
			3350, // NO_DECREASING, this blocks stats from lowering?
			'1181-1184', // souls should not be shared

			//--------------------------------------------------------------------------
			//          Ending Switches
			//--------------------------------------------------------------------------

			'1837-1840', // sitting on throne
			'1886-1892', // ending vars, share gosple and D, C, B, A
			2249,
			// "2648-2656", //legard rebirth
			2662, // endingS_here we come!
			'2751-2752',
			2981, // bad ending 2
			2748, // no legard var

			//--------------------------------------------------------------------------
			//          Battle Logic Switches
			//--------------------------------------------------------------------------
			'215-216', // run and steal skill triggers?
			200, // handles skill battle combat logic
			'373-374', // blood golem in party
			874, // counter magic
			1000, // YOU CAN ESCAPE, not sure but probs something with combat
			1025, // leg sweep (not sure if battle or skill)
			1281, // GAURD_BATTLE? not sure what this does, I think it has to do with gaurding but it might be about gaurds.
			2482, // purifying talisman
			'3130-3138', // silvian seizure, not sure?

			//--------------------------------------------------------------------------
			//          armor / outfit Switches
			//--------------------------------------------------------------------------
			212, // no outfit check
			247, // priest robe switch
			298, // call outfit check
			2434, // lord of flies outfit
			2980, // penance armor
			'3081-3085', // penance_1-5?
			3107, // penance1_6?
			3109, // assist_penance?

			//--------------------------------------------------------------------------
			//          Event Switches / Blocking Switches
			//--------------------------------------------------------------------------
			2187, // throne scene --autorun
			'2970-2972', // rat buckman scene
			800, // return from mehabre after using passages
			41, // disabled //unable to move --quit breathing
			127, // "PrisonRape" probably handles the guard rape scene, so shouldn't be forwarded
			'136-138', // "MercTorture" probably handles torturer capturing merc.
			229, // "LoveCornerMercenary" not sure, but sounds like it might be blocking
			'286-294', // other char love corner and torture switches
			684, // stop sound switch
			794, // harvestman rape
			805, // mahabre scene
			1060, // "Flesh embrace" sounds like an event that might be blocking
			'1289-1300', // amputation event, sawing off.
			'1327-1330', // merc amputation event, sawing off.
			'1331-1394', // most amputation events, sawing off.
			1564, // cage scene
			1566, // snatch (lord of flies?)
			1617, // passageway scene
			'2490-2494', // burning event
			// 2512, //blight event
			2532, // chara burning event
			2588, // hiding event
			2831, // darce burning?
			2837, // enki burning?
			2839, // ragn burning?
			// 2901, //dogs?
			1044, // backstab scene

			// with new event handling we actually want to send this
			// 2961, // turture scene 1 (called on first encounter with turturer)

			'2967-2969', // turture hiding/ambush event
			'3261-3272', // fear talk events?
			'3281-3291', // more fear scenes?
			'3301-3347', // Captain_Spot1... Cahara_Spot1... more fear scenes?
			1815, // fracioua domination scene
			'3463-3479', // misasma scenes
			'3481-3503', // more misasma scenes
			979, // enki attacking. (autorun event when enki attack)
			338, // night lerch leap
			118, // elevator fall scene auto run swithc
			116, // above ^^
			724, // moonless joining
			// fallscenes
			'2341-2342',
			2828,
			'3024-3025',
			105,
			111,
			412,
			413,

			1016, // auto run legard reqruit scene
			2946, // outlander finds legard scene
			987, // auto run cahara prision scene

			1016, // auto run legard reqruit scene
			2946, // outlander finds legard scene
			987, // auto run cahara prision scene

			//---------------------------------
			// Coin Events
			//---------------------------------
			'2727-2732',
			2957,
			3145,

			// sleep / surprise event
			3540, // sleep event
			// "3541-3548", //surprise events

			// legacy --blocked by original code, reason unknown. looks fine, just outfits and stuff
			729,
			815,
			814,
			695,
			247,
			2434,
			107,
			106,
			200,
			246,
			816,
			// sleep / surprise event
			3540, // sleep event
			// "3541-3548", //surprise events

			// legacy --blocked by original code, reason unknown. looks fine, just outfits and stuff
			729,
			815,
			814,
			695,
			247,
			2434,
			107,
			106,
			200,
			246,
			816,

			// cave in vars
			3142, // cave in main

			'3151-3152', // torch

		];
		MATTIE.static.switch.ignoredSwitches = MATTIE.static.rangeParser(MATTIE.static.switch.ignoredSwitches);
		MATTIE.static.switch.syncedSwitches = [
			// buckman ratted finished IE: buckman rat quest has given reward.
			147,

			// skelleton switches
			902, // thicket skeleton
			885, // basement skeleton
			884, // basement skeleton
			'897-898', // prison skelton

			2982, // sync buckman marriage

			// this will cause some weirdness but also will make sure there is only one copy of them
			'657-658', // merc or outlander in party

			//--------------------------
			// switch vars
			//--------------------------
			1270, // mahbre door 1
			117, // elevator lever

			2536, // vines 2
			2930, // elite guard rand2
			2930, // elite guard rand3
			2931, // elite guard rand3
			2956, // rope mines

			1563, // random hole 2
			1564, // random hole 3

			1518, // black witch rand 2

			2199, // cave dweller massacre 2

			2229, // unknown, "chase_random"

			// difficulty sync
			// terror and starvation vars
			3480,
			3153,
			3452,
			3154,
			3155,
			// hardmode vars
			2190, // hardmode var
			// 2751 //enki_s

			// schoolgirl vars
			2533, // dungeon knights main var

			// fucking rat randoms
			3505,
			3506,
			3507,

			// wall randoms? I think crowmauler vars mabye
			3392,
			3393,

			// blood portal vars
			'1157-1166',
			1168,
			2444,
			2456,
			2455,
			'2056-2061',
			2045,

			// crow mauler
			786, // crow activated
			'767-789', // the rest of crow mauler vars
			167, // pocket cat girl
			660, // pocket cat demon kid

			'685-686', // darce_scene
			687, // darce in party
			688, // darce dead
			992, // chara party
			991, // cahara party2
			'1842-1843', // legard ending
			'1845-1847', // legard ending
			'1848-1849', // gauntlet door2-3

			// temple of torment
			'981-985', // on chains var

			// blight
			2512,
			2657,
			2658,
			2830,

			// dream vars
			1773, // brothel scene finished
			1767, // enki scene finished
			1776, // outlander scene finished
			1780, // outlander scene 2 finished
			// 1779, //outlander scene2_2

			// door switches
			58,
			116,
			647,
			659,
			806,
			1030,
			1243,
			'1270-1273',
			1534,
			1538,
			1548,
			1642,
			1643,
			1759,
			1763,
			'1848-1849',
			1947,
			'2353-2356',
			2368,
			2380,
			2381,
			'2470-2472',
			'2516-2517',
			2724,
			2726,
			'2767-2770',
			2842,
			2897,
			3549,

			// enemy overworld alive states
			23, // gaurd1
			'67-68', // priest 1 and 2
			'103-104', // hydra
			146, // torture dead
			'302-306', // gnome dead
			652, // salmon snake dead
			793, // harvestman1 dead
			1024, // redman dead
			1581, // harvestman2 dead
			1586, // scarab1
			1590, // scarab2
			1594, // scarab3
			2237, // harvestman3 dead
			2238, // scarab4 dead
			'2665-2673', // gnome 7-15 dead
			2978, // semor dead
			2979, // semor dead2
			2874, // elite gaurd 2
			2867, // elite guard 1
			2211, // guard 6
			2218, // guard 7
			2205, // guard 5
			2016, // guard 5 again
			1872, // guard 4
			1866, // guard 3
			1860, // guard 2
			1854, // guard 1

			1006, // ensure there is only one copy of legard

		];
		// vars
		MATTIE.static.switch.syncedSwitches = MATTIE.static.rangeParser(MATTIE.static.switch.syncedSwitches);

		MATTIE.static.variable.secondarySyncedVars = [
			// these are vars that will be synced based on a cooldown when the map is loaded.
			// put anything in here that need to be synced, but not imidietly. things like enemy death, lever states etc...

			// main random vars, mostly for the floors and big stuff
			68,
			69,
			20,
			21,
			26,
			31,
			32,
			61,
			82,
			78,
			76,
			97,
			77,
			46,
			4,
			'121-136',
			// secondary random vars, less important, but still needed.
			315, // vines
			350, // basement rand
			260, // cave dweller massacre
			208, // black witch rand
			209, // random hole

			354, // elite guard rand

			// darce random
			83, // darce variable

			// enki random
			84, // enki variable

			// outlander random
			85, // outlander variable

			// merc random
			86, // merc variable

			//---------------------------
			// timer vars
			//---------------------------
			'155-157',
			'281-283', // buckman timer
		];
		MATTIE.static.variable.secondarySyncedVars = MATTIE.static.rangeParser(MATTIE.static.variable.secondarySyncedVars);
		MATTIE.static.variable.syncedVars = [
			// these are vars that will always be synced
			// these ignore silenced interpreters, so be very careful adding something.
			// if something is changed constantly in here it will be forwarded along net, and take up a lot of bandwidth.

			//---------------------------
			// temple of torment vars
			//---------------------------
			151,
			152,
			153, // conciousness

			//---------------------------
			// tomb of the gods vars
			//---------------------------
			'284-299',

			//---------------------------
			// portal vars
			//---------------------------
			161,

		];

		MATTIE.static.variable.syncedVars = MATTIE.static.rangeParser(MATTIE.static.variable.syncedVars);
		MATTIE.static.switch.godAffinitySwitches = [
			//---------------------------
			// God Affinities
			//---------------------------
			3509, // orgy
			'2169-2172', // allmer and sylvian and grogorth god statue controll switches
			1397, // sylvian god statue
			1396, // goroth statue
			2043,
			2042,
			'406-408', // ritual circle 1 prayer switches
			409, // ritual circle 1 exhausted
			'479-481', // ritual circle 2 prayer switches
			476, // ritual circle 2 exhausted
			'488-490', // ritual circle 3 prayer switches
			486, // ritual circle 3 exhausted
			'2053-2055', // ritual circle 4 prayer switches
			2046, // ritual circle 4 exhausted
			'2452-2454', // ritual circle 5 prayer switches
			2445, // ritual circle 5 exhausted
		];
		MATTIE.static.variable.godAffinityAndPrayerVars = [
			//---------------------------
			// God Affinities
			//---------------------------
			33, // orgy var (love corner)
			'35-38', // GOD Vars... GROGAROTH_VAR
			79, // god of the depths var 2
			'162-165', // more affinities... Afinity_God
		];

		//
		MATTIE.static.switch.godAffinitySwitches = MATTIE.static.rangeParser(MATTIE.static.switch.godAffinitySwitches);
		MATTIE.static.variable.godAffinityAndPrayerVars = MATTIE.static.rangeParser(MATTIE.static.variable.godAffinityAndPrayerVars);
		MATTIE.static.variable.ignoredVars = [ // ignored vars\
			14,
			'357-359', // coin choice
			12,
			11,
			4,
			30, // player_mp
			'22-23', // arrow var
			1, // Lightswitch
			2, // daynightsave
			'5-8', // charHp, Char x, Char y
			9, // menu
			10, // daynight cycle
			13, // class_select
			14, // coinflip
			'15-16', // random items
			'17-18', // bleeding
			19, // battle turn
			27, // HUNGER
			33, // love corner
			34, // party size

			'41-51', // MONSTER POS vars? not sure. I think the code that handles monsters moving should override these anyways.
			'56-57',
			'72-75', // MONSTER POS VARS
			'92-95', // More pos
			'159-160', // more pos
			'256-259',
			'321-332', // more pos
			'351-352', // more pos
			'351-395', // rolling (probably the poorly animated 3d boulders)

			58, // night lerch leap.

			'62-65', // Dungeon Knights Affection
			70, // dungoen knights merc affection
			'87-88', // dungeon knights more affection
			'303-313', // more affection
			'334-343', // more affection

			90, // demon baby growing

			67, // char name

			96, // silver coins?

			'102-103', // mapID, mapX, mapY

			'107-119', // crippled vars
			'137-150', // hunger and paranoia
			158, // player mp fear

			//---------------------------
			// menu vars
			//---------------------------
			'166-167', // hexen

			254, // cube cooldown
			'357-359', // coin flip vars
			253, // mapid2
			396, // battleturns2
			405, // sleeping_bed
			406, // partymember

			//---------------------------
			// trap vars
			//---------------------------
			'168-203', // spikes
			'212-227', // fire

			'204-206', // sawing_off

			'230-250', // infection vars

			255, // char hp check

			'261-278', // curse vars

			// timers
			'155-157', // main timers
			'281-283', // buckman

			399,
			400,
			398, // torch timer
			403, // torch2
			302, // blight random timer

			'99-100', // crow
			'52-55', // bear trap
		];

		MATTIE.static.variable.ignoredVars = MATTIE.static.rangeParser(MATTIE.static.variable.ignoredVars);

		if (MATTIE.multiplayer) {
			if (MATTIE.multiplayer.params) {
				if (MATTIE.multiplayer.params.sharedAffinity) {
					MATTIE.static.switch.syncedSwitches = MATTIE.static.switch.syncedSwitches.concat(MATTIE.static.switch.godAffinitySwitches);
					MATTIE.static.variable.syncedVars = MATTIE.static.variable.syncedVars.concat(MATTIE.static.variable.godAffinityAndPrayerVars);
				} else {
					MATTIE.static.switch.ignoredSwitches = MATTIE.static.switch.ignoredSwitches.concat(MATTIE.static.switch.godAffinitySwitches);
					MATTIE.static.variable.ignoredVars = MATTIE.static.variable.ignoredVars.concat(MATTIE.static.variable.godAffinityAndPrayerVars);
				}
			}
		}
		// events

		// event images
		MATTIE.static.events.images.shiny = () => MapEvent.generateImage(0, '!Flame', 6, 0, 0); // the shiny coin incon
		MATTIE.static.events.images.coin = MATTIE.static.events.images.shiny;
	} else if (MATTIE.global.isTermina()) {
		if (!MATTIE.DataManager.global.get('correctVersion')) {
			if (confirm('The mod loader thinks you are running fear and hunger 2'
			+ '--Termina. If this is correct click okay to hide this prompt.'))MATTIE.DataManager.global.set('correctVersion', true);
		}
		console.log('termina');
		// static values specific to funger 2
		// switches

		MATTIE.static.teleports = [
			{
				id: 0, name: 'Old House', cmd: () => MATTIE.tpAPI.terminaOldHouse(), bool: () => true, btn: true,
			},
			{
				id: 1, name: 'Train Cabins', cmd: () => MATTIE.tpAPI.terminaTrainCabins(), bool: () => true, btn: true,
			},
			{
				id: 2, name: 'Outskirts', cmd: () => MATTIE.tpAPI.terminaOutskirts(), bool: () => true, btn: true,
			},
			{
				id: 3, name: 'Old Town', cmd: () => MATTIE.tpAPI.terminaOldTown(), bool: () => true, btn: true,
			},
			{
				id: 4, name: 'Central Prehevil', cmd: () => MATTIE.tpAPI.terminaPrehevil(), bool: () => true, btn: true,
			},
			{
				id: 5, name: 'Prehevil East - Church', cmd: () => MATTIE.tpAPI.terminaPrehEast(), bool: () => true, btn: true,
			},
			{
				id: 6, name: 'Prehevil West - School', cmd: () => MATTIE.tpAPI.terminaPrehWest(), bool: () => true, btn: true,
			},
			{
				id: 7, name: 'Deep Woods', cmd: () => MATTIE.tpAPI.terminaDeepWoods(), bool: () => true, btn: true,
			},
			{
				id: 8, name: 'Riverside / Lake', cmd: () => MATTIE.tpAPI.terminaRiverside(), bool: () => true, btn: true,
			},
			{
				id: 9, name: 'Mayor\'s Manor', cmd: () => MATTIE.tpAPI.terminaMayorsManor(), bool: () => true, btn: true,
			},
			{
				id: 10, name: 'Tunnel 7', cmd: () => MATTIE.tpAPI.terminaTunnel7(), bool: () => true, btn: true,
			},
			{
				id: 11, name: 'Tunnel 0', cmd: () => MATTIE.tpAPI.terminaTunnel0(), bool: () => true, btn: true,
			},
			{
				id: 12, name: 'Sewers', cmd: () => MATTIE.tpAPI.terminaSewers(), bool: () => true, btn: true,
			},
			{
				id: 13, name: 'Hollow Tower', cmd: () => MATTIE.tpAPI.terminaHollowTower(), bool: () => true, btn: true,
			},
			{
				id: 14, name: 'Speakeasy', cmd: () => MATTIE.tpAPI.terminaSpeakeasy(), bool: () => true, btn: true,
			},
			{
				id: 15, name: 'Hexen Village', cmd: () => MATTIE.tpAPI.terminaHexen(), bool: () => true, btn: true,
			},
		];

		MATTIE.static.switch.ignoredSwitches = [
			//-------------------------------------------------------
			//          Character Selection / Class Switches
			//-------------------------------------------------------
			'2-15', // menus, lights, heroin use
			'239-240', // MALE_CLASS, FEMALE_CLASS
			'2401-2414', // NAMES_SELECT (YELLOW_MAGE, BOTANIST, THUG, etc.)
			2420, // HEXEN_GFX
			'661-664', // INITIAL_MERCENARY/KNIGHT/DARKPRIEST/OUTLANDER

			//-------------------------------------------------------
			//          Intro / System / Global Meta
			//-------------------------------------------------------
			'213-214', // INTRO_playing, INTRO_enter_name (also in 212-217)
			'295-297', // INTRO, Introchoose, player_arrow
			411, // INTRO_SKIPPING IS OKAY
			'2843-2858', // INTRO1-5, SHADOWS, STRONG_STATIC
			'2859-2860', // Perkele_talking, Grand_hall_trigger
			'2861-2863', // Sleep1-3
			2880, // Intro_reila
			'2881-2884', // Intro_reila2-5
			2885, // SMALL_STATIC
			2918, // DEMO_DONE
			2919, // Wake_up
			1540, // <Global Meta>Movies_enabled
			2245, // <Global Meta>double_tap_run
			3353, // <Global Meta>First_time_switch
			3397, // <Global Meta>Message_sounds
			3398, // SYSTEM_MESSAGE_BACKGROUND
			3399, // FiltersSet
			3400, // <Global Meta>Filter Effects
			'3679-3680', // <Global Meta>Static Effects/Set

			//-------------------------------------------------------
			//          Area / Location Tracking
			//-------------------------------------------------------
			'1601-1613', // AREA_TRAIN through AREA_CHURCH_BASEMENT
			'4317-4321', // IN_THE_BASEMENT, UPSTAIRS, HOUSE1, HOUSE1_BASEMENT, RESTAURANT_BASEMENT

			//-------------------------------------------------------
			//          Movement / Facing / Action Switches
			//-------------------------------------------------------
			203, // CLIMBING
			'215-216', // Run!, Steal! (also in 212-217 below)
			241, // coming_UP_LADDERS
			410, // CANNOTUSE_BOW!
			'2243-2244', // run_meter_cooldown, run_meter_disappear
			'2250-2251', // dash_ok, GUN_OK
			2259, // AMMO_HUD_OFF
			3259, // AMMO_HUD_OFF (duplicate)
			4139, // ButtonDown
			4140, // Engarde
			4180, // En_Garde_cooldown
			4820, // run_exhaust

			//-------------------------------------------------------
			//          Menu / UI Switches
			//-------------------------------------------------------
			'45-51', // janitor sawing cut scene (SAWING_janitor1-7)
			'96-97', // Janitor_scene/notice
			'181-194', // lights (light15-16, door2_1-4, Mayor switches)
			'195-196', // elevator1/2
			'201-202', // SUICIDE, suicide_inprocess
			'210-211', // light3_3, light4_4
			'212-217', // NO_OUTFITCHECK, INTRO_playing/enter_name, Run!, Steal!, Bonesaw_CRACK
			'299-301', // Player_whileBow_used, player_arrow2, bearTREP
			4708, // skip_day_text
			4712, // day_change_text
			4750, // map_locations_ON
			4815, // failsafe_switch

			//-------------------------------------------------------
			//          Difficulty / Game Mode
			//-------------------------------------------------------
			667, // NOT_Hard_Mode
			1413, // ENDING_A_HARD
			1414, // ENDING_B_HARD
			2190, // !!_HARD_MODE_!!
			'4818-4819', // EASY_MODE, HARD_MODE

			//-------------------------------------------------------
			//          Dismemberment / Limbs / Sawing
			//-------------------------------------------------------
			'2069-2078', // journalist arms and god affinities
			'1298-1300', // SSAWING_OFF 1-3
			'1327-1330', // sawing
			'1333-1334', // sawing
			'1335-1398', // sawing (Merc/Outlander/Skeleton/Ghoul/etc.)
			'287-294', // Journalist/Botanist_sawing

			//-------------------------------------------------------
			//          Status Effect Switches
			//-------------------------------------------------------
			25, // ROT
			28, // DEMONSEED_AVAILABLE
			'29-30', // ENEMY_ATTENTION1, ENEMY_HURT
			66, // Smoke_TREP
			100, // WORKSHOP
			101, // hangingDARKNESS
			105, // Black_vomit
			154, // IKI_TURSO
			'268-269', // struggling_tied_up, Struggling
			371, // FEAR_EFFECT
			491, // demonseedAVAILABLE
			559, // Grasp_of_a_giant
			'677-678', // Child_of_light, Child_of_darkness
			695, // DEMONBABY_GROWING
			'814-816', // Small_PARANOIA, RAPANOIA, BLINDNESS
			837, // FEAR_EFFECT
			862, // HALLUCINATIONS
			863, // FEAR_EFFECT_RESET
			901, // HALLUCINATIONS2
			972, // First time in dark
			1172, // Black_vomit
			1292, // MOONSCORCHED
			2062, // Blind_for_the_first_time
			'2081-2082', // pistol/rifle_for_the_first_time
			2103, // PLANTING_FLOWERS
			2166, // PICTURE_fade_in
			2895, // IKI_TURSO2
			3276, // SATURATION_CHANGE
			4600, // Medicinal!
			4840, // SCORCHED_EARTH!
			4990, // monster_nausea

			//-------------------------------------------------------
			//          Crippled Switches
			//-------------------------------------------------------
			'817-835', // NOTCRIPPLED (Merc/Girl/Occultist/Doctor/etc.)

			//-------------------------------------------------------
			//          Battle Logic Switches
			//-------------------------------------------------------
			1, // Disable npc
			52, // TALK
			79, // START
			200, // SKILLS_BATTLE
			'1456-1457', // single_attack, double_attack
			'1483-1485', // ENEMIES_ACTIVE, ENEMIES_ACTIVE2, ENEMIES_GETUP
			1281, // GUARD_BATTLE
			2225, // CHARACTERS_HOSTILE
			4665, // monster_first_turn_has_gone
			'4666-4671', // monster_arm1-6
			'4672-4673', // cocoon_considering, calling_little

			//-------------------------------------------------------
			//          Armor / Outfit Switches
			//-------------------------------------------------------
			106, // GHOUL_OUTFIT
			107, // GUARD_OUTFIT
			298, // CALL_OUTFITCHECK
			657, // sergal_mask
			'2269-2272', // og_filters, OUTSIDE, INSIDE, Set_filters

			//-------------------------------------------------------
			//          Skill Switches
			//-------------------------------------------------------
			260, // SuicideLEARNED
			729, // LockpickingAVAILABLE
			'731-733', // Marksmanship/Executioner/GunslingerAVAILABLE
			766, // DevourAVAILABLE
			801, // DemonSeedLEARNED
			802, // GREATERBloodMagicAVAILABLE
			803, // BloodsacrificeAVAILABLE
			864, // Greater_NecromancyOK?
			871, // Counter-magicAVAILABLE
			874, // Counter-magic
			1025, // LEG SWEEP
			1045, // BACKSTAB
			'1041-1044', // Backstab_weaponOK/player_backstab
			1061, // new god rising
			1098, // shield_bash
			1167, // PORTAL_LEARNED
			'1185-1211', // SKILL_Lockpicking through HEXEN_CURSOR, SKILL_fast_stance
			'1221-1241', // SKILL_rot through various skills
			1248,
			1250,
			1253,
			'1267-1268',
			'1448-1455', // text/SKILL lunar_storm, lunar_meteorite, moth_swarm, red_arc
			'1541-1552', // SKILL/text medicinal, analyze, wrench_toss, short_circuit, trapcraft, weaponcraft
			'1923-2045', // text/SKILL gun_proficiency through heart_flower (massive skill block)
			'2079-2099', // SKILL/text Perfect_guard through blood_spear_return
			'2201-2214', // text/SKILL defence_plus through poison_tip
			2399, // ATTACKED_wheelchair
			2411, // CANT_LEARN
			2766, // Escape_plan!
			2787, // marcoh speech/skill

			//-------------------------------------------------------
			//          Necromancy State
			//-------------------------------------------------------
			340, // Necromancy_noMP
			341, // NECROMANCY_available
			'781-795', // Necromancy1-15
			'3240-3241', // necromancy_Done/1

			//-------------------------------------------------------
			//          Item / Equip Switches
			//-------------------------------------------------------
			'2064-2067', // needs_cloth_fragment/white_vial crafting
			'2252-2254', // RIFLE/SHOTGUN/PISTOL_EQUIPPED
			2750, // wheelchair
			2899, // gasoline1
			2924, // SWITCH_TO_KNIFE
			3272, // NEED_Cloth!

			//-------------------------------------------------------
			//          Withdrawal / Drug Switches
			//-------------------------------------------------------
			420, // withdrawals
			'876-879', // Yellow_Mage/Journalist/Thug/Botanist_HEROIN
			'3186-3187', // Doctor/Mechanic_HEROIN

			//-------------------------------------------------------
			//          Party Member State
			//-------------------------------------------------------
			'4761-4768', // levi/marina/daan/abella/osaa/olivia/karin/marcoh_in_party
			'4781-4796', // going_crazy / going_crazy2 for all party members
			812, // PARTY_TALK
			813, // DON'T ACTIVATE!
			1498, // RIDING_STAIRS

			//-------------------------------------------------------
			//          Max HP Tracking (per player)
			//-------------------------------------------------------
			'2781-2782', // Mercenary_MaxHP1/2
			'4501-4526', // Thug/Journalist/Botanist/Occultist/etc. MaxHP
			'4531-4548', // Villager1/2/3 MaxHP

			//-------------------------------------------------------
			//          Soul Tracking (per player)
			//-------------------------------------------------------
			'493-500', // botanist/exsoldier/Occultist/doctor/mechanic/journalist/fighter/yellow_mage_SOUL
			'734-739', // apprentice/hunter/chef/mobster/salaryman/lieutenant_SOUL
			1121, // Moonless_soul
			'1154-1155', // skeleton1/2_soul
			'1181-1184', // Domination/Endless/tormented/Enlightened_soul
			'1257-1261', // DEMON_KID/LEGARDE/Moonless/Girl_soul

			//-------------------------------------------------------
			//          Char Mentioned / God Affinities
			//-------------------------------------------------------
			'1486-1498', // character god affinities (Merc/Occultist/etc.)
			'1521-1529', // Doctor/Mechanic god affinities
			'601-610', // Merc/Occultist/ghoul/kalev god affinity gro/rher
			'4081-4099', // thug/botanist/doctor/mechanic god affinities

			//-------------------------------------------------------
			//          Blood Golem / Fusion / Marriage
			//-------------------------------------------------------
			'373-379', // Blood_golem/Blood_golemINPARTY/dismemberment
			380, // FUSION_SELECT
			375, // MARRIAGE_SELECT

			//-------------------------------------------------------
			//          Sacrifice Circle / Gods / Rituals
			//-------------------------------------------------------
			'396-397', // Sacrificecircle_moonless/demonkid
			'406-409', // RitualCircle1 prayers/exhausted
			'472-490', // sacrifice/ritual circle 2/3 variants
			588, // talk_scene_done
			625, // FIRST_TALK
			'641-651', // execution1-7
			694, // tv_flash2
			'856-858', // SKELETON_KILLED/BODY
			1062, // NEWGOD_TAINTED
			'1401-1406', // Ritual1 statues/prayers
			'1415-1420', // Ritual circles sacrificed/on
			'1421-1427', // SIGIL_GRO_GOROTH/SYLVIAN/ALLL-MER/etc.
			'1533-1538', // SKILL/ritual
			'1561-1563', // Ritual0_gro_goroth/alll_mer/moon
			'2047-2055', // RitualCircle4 variants
			2360, // no_other_gods
			'2445-2455', // RitualCircle5 variants
			'3141-3163', // bloodportal_open, ritual_book variants
			'3178-3180', // Ritual_church2/church
			'3201-3203', // Ritual2_gro_goroth/moon/alllmer
			'3218-3220', // Ritual_church_alllmer/moon/gro_goroth
			'3817-3823', // confessional/sins/absolved
			'3911-3916', // confessional_killed, lusted, with_a_friend, forbidden_love
			'3997-3999', // alll-mer_condemns, dishonest, confessional_DONE
			'4021-4046', // Ritual2/0/1 vinushka/fear_hunger/sylvian, ritual4 variants

			//-------------------------------------------------------
			//          Fear Statues / Ritual Locations
			//-------------------------------------------------------
			'4821-4848', // fear_statue1-6, circle/crack variants
			'4861-4866', // Ritual_speakeasy variants

			//-------------------------------------------------------
			//          New Gods
			//-------------------------------------------------------
			'761-765', // newgod4-8
			'1046-1066', // newgod_circle/rising/type variants

			//-------------------------------------------------------
			//          Endings
			//-------------------------------------------------------
			1413, // ENDING_A_HARD
			1414, // ENDING_B_HARD
			'1428-1442', // <Global Meta> ENDING per character
			'1889-1892', // !!_ENDING_D/C/B/A
			1900, // won_the_game
			2249, // !!_ENDING_S

			//-------------------------------------------------------
			//          Carving Flags
			//-------------------------------------------------------
			'611-615', // Mercenary/Occultist/Kalev/Ghoul1/Ghoul2_CARVING
			'668-675', // Villager/Ghoul3/Journalist/Thug/Botanist/Yellow_CARVING
			'1135-1136', // Mechanic/Doctor_CARVING

			//-------------------------------------------------------
			//          Love / Relationship
			//-------------------------------------------------------
			229, // LoveCornerMercenary
			'399-405', // LOVE_captain_knight through LOVE_marriage_mercenary
			440, // LoveCornerMarriage
			471, // LOVE_darkpriest_merce
			4000, // partner

			//-------------------------------------------------------
			//          Portals (per player learned/activated state)
			//-------------------------------------------------------
			// "1157-1178", // Portal activation states
			// 1219, // PORTAL6_ON
			// "2056-2061", // Portal4 variants
			// 2444, // PORTAL5_ON

			//-------------------------------------------------------
			//          Hangman Minigame (per player)
			//-------------------------------------------------------
			'1881-1888', // hangman1-6, letterG/O, HANGMAN_OVER
			'1898-1899', // hangman6/7
			'2976-2980', // Arms_cut, hangman_FALL variants

			//-------------------------------------------------------
			//          Tower Mechanisms (view scenes, per player)
			//-------------------------------------------------------
			'4181-4194', // tower_door1-7, tower_rise1-3, tower_rising, tower_sounds_OFF, tower_gfx

			//-------------------------------------------------------
			//          Blocking Cutscenes / Events
			//-------------------------------------------------------
			'433-439', // BigboyON, Pig_execution, eaten, eating, go
			447, // Pig_scene2
			462, // pig2_eating
			463, // SLEEPING
			540, // Big_boy_execution
			560, // Big_boy_attack
			'573-580', // front_leg, hind_leg, platoon, surprise
			'583-589', // redhair1, blonde1, botanist scenes, talk_scene_done
			'658-660', // chandelier7, chandelier_on, tv_flash
			'743-749', // Waves1-7
			'839-840', // henryk/tanaka_comes_to_club
			'952-953', // ENDING_SCENE, NOT USED
			980, // Marina_orphanage_scene
			997, // Resting
			'1114-1119', // kaiser/heavy_trooper poses/gone
			'1150-1156', // tormented_one events, ATTACKED_ON_TRAIN
			'1179-1180', // ATTACKED_ON_TRAIN/2
			1220, // text_unknown
			1256, // Trapped_OVER
			'1269-1270', // woodsman_rope variants
			'1319-1320', // shopping_layered/2
			'1595-1596', // dark_priest_scene
			'1597-1598', // RUN_AWAY
			1599, // flute1
			1600, // tv_off
			1699, // different_static
			'1748-1752', // Bartender1-5 drinks
			'2319-2326', // ladder1-8
			'2341-2344', // fallscene1/2, toilet1, food_storage_found
			'2346-2351', // Mechanism_used, MECHANISM1-6
			2570, // Ouija_board_active
			2746, // DAY_BREAK
			2828, // Fall_scene3
			2878, // Coming_back_from_hexen / Mayor_done
			'2888-2890', // Falling1-3
			2891, // Olivia_talk
			2894, // no_more_talking
			2900, // GotNO_offering
			'3001-3003', // kaiser_scene/shot, heavy_trooper_shoot
			3030, // execution_start
			'3031-3048', // black_kalev_eating scenes
			'3050-3081', // red_shadow events, chain events
			3082, // day_text
			'3083-3086', // dark_priest1-4
			3093, // day_change
			'3097-3099', // NEEDLES tunnel scenes
			3131, // Analyze!
			3135, // Tower_view_scene
			'3226-3235', // Needles_scene/mechanic scenes
			'3237-3238', // reported_the_man, going_up
			'3265-3266', // REMOVE/NO_ASSISTS
			3297, // first_talk_moon_tower
			'3301-3310', // swing1-4, swings_active, TV_SCENE1, club/cafe_layered_gfx
			3320, // tv_watched
			'3341-3392', // umbrella descent/falling variants (full range)
			'3414-3430', // coming_from_up, levi/caligura/pocketcat scenes
			'3476-3505', // levi/caligura scenes
			3508, // SUSPICIONS1
			3535, // soldier1_shooting
			'3539-3541', // sniper_scene/danger/cooldown
			'3542-3550', // weeping_scope
			'3565-3567', // shot_sounds1-3
			'3576-3585', // weeping_scope locations
			'3597-3598', // weeping_scope in_alt/killed_alt
			'3660-3678', // bartender/marina/church scenes
			'3881-3893', // bellend_jump/shadow/surprise
			3905, // BELLENDS_UNLEASHED
			'3921-3929', // bellend2_jump variants, shadow2
			'4010-4013', // arrive, first_time_travelled, return, ladders
			4056, // NOT_IN_USE
			4061, // Gasoline2
			'4062-4064', // elevator2_active, generator2_active, short_circuit_door_tunnel1
			4078, // WHEELCHAIR_IN_USE
			4093, // NOT_IN_USE
			'4176-4179', // arm_tense, tongue_out, stitches_activate
			4187, // giant_elevator_moving
			4230, // RELEASE_GFX
			'4251-4260', // august scenes
			'4440-4441', // hide_kaiser_pav_scene, vault
			'4551-4564', // caligura_monster variants
			'4565-4572', // monster_spot1-8
			'4573-4584', // august going/gone, temple_scene, valkyrie active/flight
			'4587-4605', // giant animations/scenes/active/killed
			'4625-4644', // umbrella4 variants
			'4645-4649', // crows_shoo1-4, crows_backalleys3
			'4650-4654', // giant_persuade, rage
			4681, // soldiers_activate
			'4696-4699', // valkyrie_flight_island, greatsword/yggaegetsu/chac_chac_glass
			'4748-4751', // judgement_moving/appear, map_locations, mechanical_dance_appear
			'4752-4758', // Pocketdaan_appear, pocketcat scenes, dark_priest3, dysmorphia_flower
			'4797-4808', // samarie/pocketcat_OG_killed, horse, platoon, temple positions
			'4872-4906', // domek scenes
			'4914-4924', // caligura creeping/killed scenes

			//-------------------------------------------------------
			//          Filter / Visual Effect Switches
			//-------------------------------------------------------
			1667, // school_layered_gfx
			1688, // north_west_layered_gfx
			'1696-1699', // shopping_layered3-5, different_static
			'2269-2272', // og_filters, OUTSIDE, INSIDE, Set_filters
			3278, // shopping_layered_gfx
			3279, // mannequin_toggle
			3280, // statue_layered_gfx
			'3308-3310', // club/cafe_layered_gfx
			3371, // apartment_layered_gfx
			4009, // island_layered_gfx
			4459, // light_switches_first
			'4461-4464', // tunnel0 monitor/layered_gfx

			//-------------------------------------------------------
			//          Misc / Weird Switches
			//-------------------------------------------------------
			41, // disabled
			80, // wizard_summon
			'81-86', // Making_cube1-5, Making_cube_scene
			228, // black_kalev_switch
			880, // perkele_wing
			1880, // burn

		];

		MATTIE.static.switch.ignoredSwitches = MATTIE.static.rangeParser(MATTIE.static.switch.ignoredSwitches);

		//-------------------------------------------------------
		//          Teleports (for debug menu & multiplayer TP)
		//-------------------------------------------------------
		MATTIE.static.teleports = [
			{
				id: 0, name: 'Old House (Start)', cmd: () => MATTIE.tpAPI.terminaOldHouse(), bool: () => true, btn: true,
			},
			{
				id: 1, name: 'Train Cabins', cmd: () => MATTIE.tpAPI.terminaTrainCabins(), bool: () => true, btn: true,
			},
			{
				id: 2, name: 'Outskirts', cmd: () => MATTIE.tpAPI.terminaOutskirts(), bool: () => true, btn: true,
			},
			{
				id: 3, name: 'Old Town', cmd: () => MATTIE.tpAPI.terminaOldTown(), bool: () => true, btn: true,
			},
			{
				id: 4, name: 'Prehevil - Central', cmd: () => MATTIE.tpAPI.terminaPrehevil(), bool: () => true, btn: true,
			},
			{
				id: 5, name: 'Prehevil - East (Church)', cmd: () => MATTIE.tpAPI.terminaPrehEast(), bool: () => true, btn: true,
			},
			{
				id: 6, name: 'Prehevil - West (School)', cmd: () => MATTIE.tpAPI.terminaPrehWest(), bool: () => true, btn: true,
			},
			{
				id: 7, name: 'Deep Woods', cmd: () => MATTIE.tpAPI.terminaDeepWoods(), bool: () => true, btn: true,
			},
			{
				id: 8, name: 'Riverside / Lake', cmd: () => MATTIE.tpAPI.terminaRiverside(), bool: () => true, btn: true,
			},
			{
				id: 9, name: "Mayor's Manor", cmd: () => MATTIE.tpAPI.terminaMayorsManor(), bool: () => true, btn: true,
			},
			{
				id: 10, name: 'Tunnel 7', cmd: () => MATTIE.tpAPI.terminaTunnel7(), bool: () => true, btn: true,
			},
			{
				id: 11, name: 'Tunnel 0 Entrance', cmd: () => MATTIE.tpAPI.terminaTunnel0(), bool: () => true, btn: true,
			},
			{
				id: 12, name: 'Sewers', cmd: () => MATTIE.tpAPI.terminaSewers(), bool: () => true, btn: true,
			},
			{
				id: 13, name: 'Hollow Tower', cmd: () => MATTIE.tpAPI.terminaHollowTower(), bool: () => true, btn: true,
			},
			{
				id: 14, name: 'Speakeasy', cmd: () => MATTIE.tpAPI.terminaSpeakeasy(), bool: () => true, btn: true,
			},
			{
				id: 15, name: 'Hexen', cmd: () => MATTIE.tpAPI.terminaHexen(), bool: () => true, btn: true,
			},
		];

		//-------------------------------------------------------
		//          Actor IDs
		//-------------------------------------------------------
		MATTIE.static.actors.emptyActorSlotId = 23; // empty "character" slot
		MATTIE.static.actors.mercenaryId = 1; // Levi (uses %mercenary sprite)
		MATTIE.static.actors.girlId = 3; // Marina (uses %occultist sprite)
		MATTIE.static.actors.knightId = 4; // Daan
		MATTIE.static.actors.darkPriestId = 6; // O'saa
		MATTIE.static.actors.outlanderId = 5; // Abella
		MATTIE.static.actors.leGardeId = 13; // Marcoh
		MATTIE.static.actors.demonKidId = 8; // Kid Demon
		MATTIE.static.actors.marriageId = 9; // Marriage
		MATTIE.static.actors.abominableMarriage = 11; // Marriage (abominable)
		MATTIE.static.actors.nashrahId = 14; // Karin

		// Termina-specific actor IDs
		MATTIE.static.actors.leviId = 1;
		MATTIE.static.actors.marinaId = 3;
		MATTIE.static.actors.daanId = 4;
		MATTIE.static.actors.abellaId = 5;
		MATTIE.static.actors.osaaId = 6;
		MATTIE.static.actors.blackKalevId = 7;
		MATTIE.static.actors.marcohId = 13;
		MATTIE.static.actors.karinId = 14;
		MATTIE.static.actors.oliviaId = 15;

		//-------------------------------------------------------
		//          Map IDs
		//-------------------------------------------------------
		MATTIE.static.maps.charCreationMap = 3; // Character_creation
		MATTIE.static.maps.startMap = 155; // start_the_game

		MATTIE.static.maps.menuMaps = [
			10, // start
			3, // Character_creation
			72, // Splash_Screen
			8, // Intro_Moon_scene
			19, // Intro_Train_cabins
			35, // start_screen
			129, // day_change
			132, // pocketcat_scene
			133, // character_check
			141, // transform
			151, // endings
			152, // fall_scene
			154, // ending1
			155, // start_the_game
			161, // head_count
			162, // final_falling
			163, // ending1_free
		];

		MATTIE.static.blockingMaps = [
			10, // start
			3, // Character_creation
			72, // Splash_Screen
			8, // Intro_Moon_scene
			19, // Intro_Train_cabins
			35, // start_screen
			6, // testmap
			7, // MAP007
			12, // MAP012
			43, // test
			61, // Lake_test
			62, // tv_set
			63, // club_test
			102, // prehevil_view
			129, // day_change
			132, // pocketcat_scene
			133, // character_check
			141, // transform
			151, // endings
			152, // fall_scene
			154, // ending1
			155, // start_the_game
			161, // head_count
			162, // final_falling
			163, // ending1_free
			178, // Otherside_test
		];

		MATTIE.static.maps.menuMaps = MATTIE.static.rangeParser(MATTIE.static.maps.menuMaps);

		//-------------------------------------------------------
		//          Character Limb Switches
		//-------------------------------------------------------
		MATTIE.static.switch.characterLimbs = [
			'252-255', // doctor arms/legs
			'256-259', // mechanic arms/legs
		];
		MATTIE.static.switch.characterLimbs = MATTIE.static.rangeParser(MATTIE.static.switch.characterLimbs);

		//-------------------------------------------------------
		//          Logical / Cheat Switches
		//-------------------------------------------------------
		MATTIE.static.switch.logical = [
			{ id: 2190, name: 'HARD MODE' },
			{ id: 4818, name: 'EASY MODE' },
			{ id: 4819, name: 'HARD MODE (new)' },
			{ id: 667, name: 'NOT Hard Mode' },
			{ id: 1900, name: 'Won The Game' },
			{ id: 1507, name: 'TIME UP' },
			{ id: 2751, name: 'KILLED EVERYONE' },
			{ id: 3273, name: 'SACRIFICE ALL' },
		];

		//-------------------------------------------------------
		//          Items
		//-------------------------------------------------------
		MATTIE.static.items.emptyScroll = $dataItems[88];
		MATTIE.static.items.silverCoin = $dataItems[206]; // Silver shilling
		MATTIE.static.items.icons.bookIcon = 261; // Book of enlightenment icon

		//-------------------------------------------------------
		//          Self Switch Sync IDs (for multiplayer)
		//-------------------------------------------------------
		MATTIE.static.switch.syncedSelfSwitches = [];
		MATTIE.static.switch.syncedSelfSwitches = MATTIE.static.switch.syncedSelfSwitches.map((arr) => JSON.stringify(arr));

		MATTIE.static.switch.ignoredSelfSwitches = [
			// char creation menu switches
			[10, 1, 'A'],
		];
		MATTIE.static.switch.ignoredSelfSwitches = MATTIE.static.switch.ignoredSelfSwitches.map((arr) => JSON.stringify(arr));

		//-------------------------------------------------------
		//          Synced Switches (multiplayer state propagation)
		//-------------------------------------------------------
		MATTIE.static.switch.syncedSwitches = [
			//---------------------------
			// difficulty sync
			//---------------------------
			2190, // !!_HARD_MODE_!!
			4818, // EASY_MODE
			4819, // HARD_MODE

			//---------------------------
			// day progression (must be synced)
			//---------------------------
			'1501-1520', // DAY times
			3082, // day_text
			3093, // day_change

			//---------------------------
			// blood portal vars
			//---------------------------
			'3141-3163', // bloodportal_open and variants
			'3242-3246', // bloodportal_c_3
			'4867-4871', // bloodportal_sp1

			//---------------------------
			// door switches (shared world state)
			//---------------------------
			58, // 2door_2
			67, // Train_door1
			'74-78', // door1_1-4, chains_opened
			104, // Basement_Opened
			'190-193', // door2_1-4
			'221-227', // door3_1-4, Hatch_open, Elevator_door_crash
			350, // GATE_chains1
			'591-593', // door3_1-3
			600, // door_upstaris_open
			624, // doorway_door
			1169, // door_downstairs
			1461, // church_keys_found
			'1635-1637', // school_door1-3
			'1661-1673', // door_school variants
			'1681-1687', // main_doors variants
			'1741-1746', // gate_passage_open1-6
			'1761-1767', // doorway1-7
			'1791-1800', // door_school2 variants
			'1874-1875', // main_doors_school6/7
			'2261-2268', // door/gate apartment5-6
			'2274-2276', // old_hotel_doors, sewer_gate
			'2361-2396', // gate_passage2-4, gate_main
			'2661-2669', // Wall2_1-8, short_circuit_door2
			'2932-2967', // celldoor, gate_open, elevator_door
			3049, // cabin_door1
			'3132-3134', // gate1_1-3
			'3254-3256', // restaurant_door1-3
			3260, // short_circuit_door1
			3263, // short_circuit_door2
			'3311-3318', // toilet_door variants
			'3323-3325', // gate_church1-3
			'3334-3340', // door_apartment variants
			'3354-3368', // door_apartment7-13
			'3375-3378', // gate_apartment1-4
			3393, // sewer_gate2
			3420, // sewer_lid3
			'3455-3456', // door1/2
			'3454-3461', // tunnel6_gate variants
			3475, // doors_locked
			'3581-3593', // door_alt, school2_door
			'3709-3714', // schooldoor_basement1-4
			'3717-3719', // door_school1-3
			4064, // short_circuit_door_tunnel1
			4075, // tunnel1_door
			4079, // Museum_maindoors
			'4145-4146', // short_circuit/door tunnel1
			4158, // tunnel1_door
			4160, // apartment_door1
			'4333-4334', // apartment_door2/3
			4437, // sewer_entrance_door
			'4441-4458', // vault_door1-18
			'4737-4739', // news_agency_door1-3
			'4745-4746', // news_agency_doors

			//---------------------------
			// lighting / candle switches (shared world)
			//---------------------------
			2, // Light on
			9, // light1
			'121-140', // Candle1-20
			'701-720', // Candle21-41, Bonfire30, bloodportals
			'1641-1660', // Candle42-61
			'4101-4120', // candle62-82
			'4774-4780', // butterfly_light, candles
			'4849-4860', // candle83-84, light85-94

			//---------------------------
			// container / shelf switches (items already taken)
			//---------------------------
			31, // necronomicon_got
			'32-35', // bookshelf4, chest1, table1, crate1
			60, // shelf2
			'68-70', // Luggage1-3
			'150-153', // Crates1-4_town
			189, // bookshelf6
			'208-209', // books1, mockupshelf2
			'452-460', // crate/chest variants
			'581-582', // cupboard1/2
			590, // bookshelf_basement
			'616-623', // termina_bookshelf variants
			'679-680', // crate1, barrel1
			'866-867', // basement/fortress_crate1
			1000, // shoe_shop_layered
			'1689-1696', // north_west_crates, trash
			'1798-1799', // school_shelf1/2
			1820, // diary_pick
			'1864-1873', // locker1-10
			'2234-2235', // food_crates_mayor1/2
			'2358-2359', // shelves_basement1/2
			2398, // shelves_basement3
			'2601-2617', // crates_sewer1-7
			2875, // Pile_of_crates2
			'2920-2922', // bookshelf2, abandoned_house_bookshelf, fridge3
			'2925-2930', // crates_south/center
			'2936-2954', // church_crates, gate variants
			'2972-2974', // old_town3_crates
			3005, // old_town3_crates3
			3009, // church_crates3
			'3010-3011', // snail1, town_crate69
			'3106-3130', // tunnel_shelf/restaurant/wine/crates
			'3181-3185', // bookstore_shelf1-5
			'3257-3258', // tunnel_shelf
			'3261-3262', // tunnel7_shelf1/2
			'3445-3453', // tunnel6_shelf1-7
			3462, // tunnel5_shelf
			'3712-3722', // basement_shelf variants
			3937, // crates_center4
			'4065-4074', // t1_locker1-10
			'4076-4077', // tunnel1/2_shelf
			'4121-4122', // tunnel1_shelf2
			'4147-4153', // tunnel1_shelf3
			'4156-4157', // tunnel1_locker
			4325, // small_apartment_fridge1
			'4351-4352', // sewers4_crates
			'4430-4436', // sewer4_crates/entrance_shelf
			'4438-4439', // storage_crates
			4465, // tunnel0_shelf1
			'4493-4496', // t0_locker1-4
			'4585-4586', // crates_tunnel0
			'4606-4610', // tunnel0_shelf variants

			//---------------------------
			// elevator / mechanism state
			//---------------------------
			'195-199', // elevator1/2, elevator_active, generator_active, Gasoline1
			'652-654', // Tunnel4_UPLINK/monitor
			'2327-2329', // control_panel1-3
			'2345-2351', // Mechanism_used/1-6
			3004, // Elevator_activated
			3101, // elevator2
			'4123-4138', // Tunnel elevator, UPLINK, machines

			//---------------------------
			// wall / barrier switches
			//---------------------------
			'421-432', // Wall1-11, Wallcrash

			//---------------------------
			// character kill / body flags (world state)
			//---------------------------
			'230-238', // butterflykill through GERINGOBODY
			'274-284', // MERCENARYKILLED through Yellow_MageBODY
			395, // KIDDEMONKILLED
			398, // KIDDEMONBODY
			742, // MoonlessKILLED
			'853-861', // SKELETON_KILLED/BODY
			3096, // SALARYMAN_DEAD
			'4466-4477', // Thug/Journalist/Botanist/Villager BODY/KILLED
			'4527-4550', // Villager arm/leg/BODY/KILLED
			875, // Big_boy_dead

			//---------------------------
			// NPC character events / story state (world state)
			//---------------------------
			// these are key NPC progression states that all players should see
			'2906-2912', // levi1-7
			'2913-2917', // Marina1-5
			'2608-2609', // marina_nod
			469, // marina_joined_manor
			470, // marina_joined_streets
			655, // Marina_DEAD_BOOK_STORE
			'2672-2674', // marcoh introduced
			'2703-2710', // tanaka scenes
			'2724-2728', // pav scenes

			//---------------------------
			// tower location flags
			//---------------------------
			'561-571', // Tower locations

			//---------------------------
			// Machina puzzle state
			//---------------------------
			'1296-1297', // Gear1_1/2
			'1301-1318', // Machina1/2/3_A-F

			//---------------------------
			// misc world state
			//---------------------------
			'3348-3352', // floor_crash1-5
			3369, // down_in_the_well
			3370, // master_key_got
			2330, // box_moved
			4350, // box_pushed
			2255, // Shop_open
			2606, // box_set
			3200, // old_town2_house_locked
			'3277-3280', // fence_Change, shopping/mannequin/statue_layered
			3319, // box_water
			'3321-3322', // Inquisitor bell
			'3394-3396', // rat1/2, rats_on_the_move
			'1768-1770', // rats_on_the_move 1-3
			'4700-4706', // alarm_system, shutter, alarm_light, alarm_done
			'4721-4735', // bucket/chair/doll puzzles
			'4741-4744', // doll puzzles

			//---------------------------
			// pig / execution scenes (shared)
			//---------------------------
			'433-439', // BigboyON, Pig_execution
			'641-651', // execution events

			//---------------------------
			// boat state
			//---------------------------
			'3281-3296', // boat1-3 variants

			//---------------------------
			// misc NPC alive / world flags
			//---------------------------
			120, // Mayor_dead
			265, // cocoon1
			'218-220', // black_kalev_recruit/gone/later
			339, // black_kalev_join
			868, // Skeleton1_STOLENALREADY
		];
		MATTIE.static.switch.syncedSwitches = MATTIE.static.rangeParser(MATTIE.static.switch.syncedSwitches);

		//-------------------------------------------------------
		//          God Affinity Switches & Vars
		//-------------------------------------------------------
		MATTIE.static.switch.godAffinitySwitches = [
			'2169-2172', // gro-goroth/sylvian/alll-mer prayed
			1397, // Sylvian_statue
			1396, // Gro-goroth_statue
			2043, // (affinity)
			2042, // (affinity)
			'406-408', // RitualCircle1 prayers
			409, // RitualCircle1 exhausted
			'479-481', // RitualCircle2 prayers
			476, // RitualCircle2 exhausted
			'488-490', // RitualCircle3 prayers
			486, // RitualCircle3 exhausted
			'2053-2055', // RitualCircle4 prayers
			2046, // RitualCircle4 exhausted
			'2452-2454', // RitualCircle5 prayers
			2445, // RitualCircle5 exhausted
			3509, // orgy
			2747, // Alll-mer_affinity_gained
		];
		MATTIE.static.variable.godAffinityAndPrayerVars = [
			33, // LoveCorner
			'35-38', // GOD vars (GRO-GOROTH, SYLVIAN, Alll-MER, GOD_DEPTHS)
			79, // GodOfTheDepths_var
			'162-165', // Affinity_Gro-goroth/Sylvian/Alll-mer/depths
		];
		MATTIE.static.switch.godAffinitySwitches = MATTIE.static.rangeParser(MATTIE.static.switch.godAffinitySwitches);
		MATTIE.static.variable.godAffinityAndPrayerVars = MATTIE.static.rangeParser(MATTIE.static.variable.godAffinityAndPrayerVars);

		//-------------------------------------------------------
		//          Ignored Variables (client-side only)
		//-------------------------------------------------------
		MATTIE.static.variable.ignoredVars = [
			1, // Lightswitch
			2, // DaynightSave
			'5-8', // charHP, charMaxHP, char x, char y
			9, // MENU_position
			10, // Daynight cycle
			11, // hours
			12, // seconds
			13, // class_select
			14, // coin_flip
			'15-16', // random_item, random_parallel
			'17-18', // bleeding, anal_bleeding
			19, // battleturns
			27, // HUNGER
			30, // PLAYER_MP
			34, // PartySize
			'39-40', // arrow_playerX/Y
			'41-51', // monster pos vars
			'52-55', // bearTrap vars
			'56-57', // monster5X/Y
			58, // Lurch_leap_var
			59, // COIN_PICK
			60, // beartrap_GOT
			61, // FOG_ZOOM
			62, // FOG_TRANSPARENCY
			'63-64', // CharacterX_2, CharacterY_2
			65, // Attack_RANDOM
			66, // Ghoul
			67, // CharacterNAME
			'70-75', // AFFECTION_mercenary, fear_corner, monster pos
			80, // coin_flip2
			81, // Pocketcat

			// map / location tracking
			91, // MapID
			'92-95', // MapX, MapY, monster pos
			'102-103', // MapID, MapX

			// crippled vars (per player)
			'107-119', // MERC through GHOUL3_Crippled
			120, // Bear_trap_random

			// hunger vars (per player)
			'137-150', // Paranoia_ran, HUNGER per character

			// consciousness / HP
			'151-153', // Primarypain, Secondarypain, Consciousness

			// heroin/withdrawal (per player)
			'158-159', // Mercenary_heroin/withdrawal
			'170-171', // (FH1 equiv)

			// map passage
			207, // MAPID_passage

			// fire traps (per player position)
			'212-227', // fire1-8 X/Y vars

			// infection vars (per player)
			'230-250', // infection arm/leg all characters

			// ammo (per player)
			'252-254', // AMMO_VARIABLE, AMMO_ONES, AMMO_TENS
			255, // CharacterHP_check

			// monster position vars
			'256-259', // monster11-12 X/Y
			'321-332', // monster13-18 X/Y

			// affliction (per player)
			'261-266', // Fear/Alll-mer/Rher/sylvian/vinushka/grogoroth_affliction

			// affection (per player)
			'303-313', // char affections (Day_1 overlap, Cahara through Chambara)
			'334-343', // Occultist/yellowmage/rifleman shot pos, Nashrah/Chambara, pocketcat

			// search/loot vars
			351, // Searching_crate
			352, // Searching_barrel
			354, // Searching_urn
			356, // Searching_trash
			'357-359', // searching/random vars

			// game timer / torch (per player)
			'155-157', // GAME_TIMER 1-3
			158, // PlayerMP_fear

			// shooting vars (per player)
			'176-180', // PISTOL/RIFLE/SHOTGUN_SHOOTING, MP, Gun_type

			// party member (client-side tracking)
			'396-397', // HEAD_TOTAL/TEMP
			'398-402', // Zoom, statue pos
			'403-410', // floor pos vars, Party_Member

			// coin flip (per player)
			353, // COIN_VARIABLE

			// sawing (per player)
			204, // SAWING_OFF
			205, // SAWING_SKELETON
			206, // SAWING_GHOUL
			1031, // SAWING_VILLAGER

			// enemy positioning / NPC waiting (local)
			'159-160', // Monster10X/Y
			172, // Floor_creak_random
			173, // Cube_stacks
			174, // pendulum_variable
			175, // voices_random

			// present tracking
			'586-594', // marina_got_out through levi_piano

			// club bunk (per player)
			545, // club_bunk

			// grab / tied up (per player)
			'721-740', // grabbed_by, assist, smoking, tied_up, already_came, visit, shadow

			// logic (per player)
			1016, // secondary_battleturn
			1017, // logic_secondform

			// final scenes (per player)
			'1021-1029', // karin/abella/levi/daan/marcoh/marina/osaa/olivia/kalev_final_scene

			// god affinity per character (per player)
			'1032-1061', // ghoul/villager god affinities

			// speaking/conversation state (per player)
			'777-795', // talking, first_time, around, not_around, etc.

			// misc per-player vars
			400, // SYSTEM_MENU_BACKGROUND
			425, // random_yell
			426, // letterD
			435, // left_souls
			436, // right_souls
			439, // sparkle_random
			481, // nevertouched
			484, // toilet_jump
			498, // sewer_system_curser
			525, // hole1
			526, // washing_machine
			527, // letter_Ouija
			606, // hurting_var

			// map-specific position/state (local)
			'630-633', // jump var X/Y
			650, // box_push1
			692, // monster_arms

			// heartbeat (local effect)
			800, // heartbeat
			990, // adrenaline_rush

			// school bed (per player)
			'909-921', // school_bed1-12

			// lighting (per player)
			970, // lighting_set
			871, // white_layer_gfx
		];
		MATTIE.static.variable.ignoredVars = MATTIE.static.rangeParser(MATTIE.static.variable.ignoredVars);

		if (MATTIE.multiplayer) {
			if (MATTIE.multiplayer.params) {
				if (MATTIE.multiplayer.params.sharedAffinity) {
					MATTIE.static.switch.syncedSwitches = MATTIE.static.switch.syncedSwitches.concat(MATTIE.static.switch.godAffinitySwitches);
					MATTIE.static.variable.syncedVars = MATTIE.static.variable.syncedVars.concat(MATTIE.static.variable.godAffinityAndPrayerVars);
				} else {
					MATTIE.static.switch.ignoredSwitches = MATTIE.static.switch.ignoredSwitches.concat(MATTIE.static.switch.godAffinitySwitches);
					MATTIE.static.variable.ignoredVars = MATTIE.static.variable.ignoredVars.concat(MATTIE.static.variable.godAffinityAndPrayerVars);
				}
			}
		}

		// event images
		MATTIE.static.events.images.shiny = () => MapEvent.generateImage(0, '!Flame', 6, 0, 0);
		MATTIE.static.events.images.coin = MATTIE.static.events.images.shiny;

		MATTIE.static.variable.secondarySyncedVars = [
			// these are vars that will be synced based on a cooldown when the map is loaded.
			// put anything in here that needs to be synced, but not immediately.
			// things like random map variants, enemy spawn randoms, NPC location randoms etc...

			//---------------------------
			// map / level random vars
			//---------------------------
			897, // murders_random
			775, // random_window_shadow
			776, // random_window_shadow2
			1287, // beekeeper_random
			1290, // statue_var
			2463, // hard_mode_random

			//---------------------------
			// enemy / NPC random vars
			//---------------------------
			374, // bobby_random
			381, // needles_random
			383, // ATTENTION_random
			386, // kalev_random
			412, // pillarman_random
			413, // pillarman_ab
			685, // caligura_monster_variable
			693, // soldier_variable
			2058, // rher_random
			2060, // moonless_random
			2064, // blue_vial_random
			2189, // run_away_switch_random
			2365, // ambush_random_northwest
			2380, // ambush_random
			2613, // gull_random
			2615, // death_mask_variable
			2796, // chaugnar_random

			//---------------------------
			// ambush location vars
			//---------------------------
			2362, // enemy_ambush_northwest
			2374, // enemy_ambush_west
			2375, // enemy_ambush_backalleys
			2376, // enemy_ambush_backalleys2
			2377, // enemy_ambush_staircase
			2378, // enemy_ambush_ruined_city
			2379, // enemy_ambush_school

			//---------------------------
			// character location / state vars
			//---------------------------
			696, // LOCATION_VAR
			697, // osaa_location_change
			698, // domek_dead
			'761-774', // character dead states (daan_dead through tanaka_dead)

			//---------------------------
			// spirit board / ghost randoms
			//---------------------------
			898, // spirit_board_ghost
			1119, // spirit_board_ghost2
			1123, // spirit_board_ghost3
			1128, // spirit_board_ghost4

			//---------------------------
			// NPC position / join vars
			//---------------------------
			411, // Party_Member
			389, // SPAWN_ID
			390, // SPAWN_X
			391, // SPAWN_Y
			'2121-2135', // character in_party vars (levi through villager3)
			554, // Marcoh_Tanaka_training
			555, // Marcoh_Tanaka_training2

			//---------------------------
			// enemy overworld HP vars (need sync so enemies stay dead)
			//---------------------------
			181, // Woodsman1_HP
			'182-184', // Villager1-3_HP
			185, // Vile1_HP
			186, // Villager4_HP
			188, // Villager5_HP
			200, // Villager6_HP
			'361-370', // moonscorched1-3_HP, moonscorched2_1-5_HP, moonscorched3_1-2_HP
			371, // moonscorched4_HP
			'372-380', // crimson_father1-3_HP, bobby1-5_HP
			382, // tormented_on_HP
			384, // rifleman3_HP
			385, // villager7_HP
			414, // Bellend1_HP
			415, // Infantry1_HP
			416, // Inquisitor1_HP
			'417-418', // fecal_hound1-2_HP
			419, // sew_job1_HP
			'421-434', // fallen_cherub1-14_HP
			496, // neighbour2_HP
			'499-524', // crimson_father4-7_HP, pillarman4_HP, various HPs
			'530-532', // ratkin1_HP, rat_lady1/2_HP
			'536-537', // half_cocooned_HPs
			538, // infantry2_HP
			'541-543', // Henryk_HP, Abella_HP (these are NPC HPs that matter)
			'546-553', // Marcoh through Pav HPs
			556, // Giant_HP
			557, // Judgement_HP
			558, // Mechanical_dance_HP
			'562-571', // Daan through levi HPs
			'572-573', // half_cocooned3_HP
			'577-582', // inquisitor2-3_HP, sew_job2-3_HP
			'595-604', // fallen_cherub12-15_HP, priest3_HP
			608, // yellow_mage_HP
			609, // rifleman4_HP
			611, // mastermind_HP
			'614-642', // bellend2-12_HP, stitches_HP, living_flesh_HP
			'648-660', // half_cocooned4_HP, moonscorched6-12_HP
			700, // samarie_HP
			'701-714', // owl_cultist1-3_HP, fecal_hound3_1-2_HP, headless3-4_HP

			//---------------------------
			// loot / container search vars
			//---------------------------
			353, // COIN_VARIABLE
			355, // shilling_variable
			'1700-1701', // shilling_count (both instances)

			//---------------------------
			// misc sync vars
			//---------------------------
			1456, // half_cocooned6_random
			1478, // radio_random
			2454, // centaur_voice_random
			2668, // pinecone_variable
		];
		MATTIE.static.variable.secondarySyncedVars = MATTIE.static.rangeParser(MATTIE.static.variable.secondarySyncedVars);

		MATTIE.static.variable.syncedVars = [
			// these are vars that will always be synced
			// these ignore silenced interpreters, so be very careful adding something.
			// if something is changed constantly in here it will be forwarded along net, and take up a lot of bandwidth.

			//---------------------------
			// clock puzzle vars (must be identical)
			//---------------------------
			1466, // clock_puzzle
			1467, // pointer_minutes
			1468, // pointer_hours
			1469, // pointer_moon
			'1470-1472', // pointer moves
			1473, // clock_cursor

			//---------------------------
			// eye of rher vars
			//---------------------------
			2197, // EYE_OF_RHER_ACTIVE
			2198, // EYE_OF_RHER
			2199, // eye_of_rher_variable

			//---------------------------
			// elevator / generator state
			//---------------------------
			889, // generator_active
			890, // elevator_active
			891, // short_circuit_door1
			2025, // elevator1
			2026, // elevator2
			2027, // elevator2_traverse
			2028, // elevator_crypt
			2029, // elevator_church

			//---------------------------
			// tunnel door vars
			//---------------------------
			863, // tunnel0_door
			864, // tunnel0_door_activate
			1350, // tunnel7_door_unlocked
			1351, // courtyard_door_unlocked

			//---------------------------
			// death mask on/off state
			//---------------------------
			'2281-2286', // death_mask1-6_ON

			//---------------------------
			// ritual location vars
			//---------------------------
			'941-957', // ritual_manor and ritual_church god variants

			//---------------------------
			// sewer state vars
			//---------------------------
			2240, // sewer_lid_west
			2287, // sewer_winch
			2288, // sewer_winch2
		];
		MATTIE.static.variable.syncedVars = MATTIE.static.rangeParser(MATTIE.static.variable.syncedVars);

		// skills
		MATTIE.static.skills.hurting = $dataSkills[12];

		// items
		MATTIE.static.items.emptyScroll = $dataItems[88];
	}
	// static values shared between both games
};

/**
 * @description this function takes an array of ints and strings, the strings must be in the format "int-int" as a range of ints,
 * this function then changes those strings of ranges into the ints themselves and returns the value.
 * @returns array
 */
MATTIE.static.rangeParser = function (array) {
	const newArr = [];
	for (let i = 0; i < array.length; i++) {
		const element = array[i];
		if (typeof element === typeof 'string') {
			const splitRange = element.split('-');
			const min = parseInt(splitRange[0], 10);
			const max = parseInt(splitRange[1], 10);
			for (let j = min; j <= max; j++) {
				newArr.push(j);
			}
		} else {
			newArr.push(element);
		}
	}
	return newArr;
};
