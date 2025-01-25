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
		if(!MATTIE.DataManager.global.get("correctVersion"))if(confirm('The mod loader thinks you are running fear and hunger 1. If this is correct click okay to hide this prompt.'))MATTIE.DataManager.global.set("correctVersion",true)
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
		if(!MATTIE.DataManager.global.get("correctVersion"))if(confirm('The mod loader thinks you are running fear and hunger 2 --Termina. If this is correct click okay to hide this prompt.'))MATTIE.DataManager.global.set("correctVersion",true)
		console.log('termina');
		// static values specific to funger 2
		// switches

		MATTIE.static.switch.ignoredSwitches = [
			// --limbs
			'2069-2078', // journalist arms
			// sawing off
			'1327-1330',
			'1333-1334',
			'1335-1398',

			// char mentioned
			'1486-1498',
			'1521-1529',

			// --Area--
			'1601-1613', // area_names
			'4317-4320',

			// --menus
			'2401-2414', // NAMES_SELECT
			2420, // hexxen_gfk
			'2843-2858', // intros
			3400, // filter effects
			3397, // message?
			'3679-3680', // global meta

			203, // climbing
			410, // cannot use bow
			'2-15', // menus and lights
			'45-51', // janitor sawing cut scene
			'96-97', // janitor cut scene
			'181-194', // lights
			'195-196', // elevator
			'201-202', // suicide
			'210-211', // lights
			'212-217', // misc
			229, // love corner merc
			241, // coming up ladder
			260, // suicide skill learned
			'287-294', // sawing
			'295-297', // intro stuff
			'299-301', // misc
			340, // necromancy no mp
			371, // fear
			'373-379', // blood golam stuff
			380, // fusion
			410, // cannot use bow
			411, // intro

			// ronteal?
			'414-418',

			// withdrawl
			420,
			'876-878', // heroin
			'3186-3187', // doctor and mechanic heroin

			// blocking cutscenes
			437, // pigs eating
			447, // pig scene 2
			462, // pig eating 2
			463, // sleeping
			540,
			'743-749',
			'839-840', // talking
			'952-953',
			972, // first time in dark
			980, // marina orphanage scene
			997, // resting
			'1298-1300',
			'1595-1596', // dark preist scenes
			'1597-1598', // run away
			1599, // flute1
			'2319-2326', // ladders
			'4010-4013', // misc arrive, travel, ladders
			'2346-2351', // mechanisms
			4056,
			4061,
			'4062-4064',
			4078,
			4139,
			4140,
			4180, // engarde
			4187, // tounge out
			'4251-4260',

			// non blocking but might be bad
			'1748-1752', // bar tender drinks
			'2716-2723', // tanaka scenes
			2723, // pav scene
			'2725-2729', // pav
			2740,
			2739,
			'2741-2743',
			'2861-2863', // sleep
			2878, // coming back from hexen
			'2888-2890', // falling
			2891, // olivia talk
			2894, // no more talking
			2900, // got no offering
			'3031-3048', // eating
			'3097-3099', // needles scene
			3131, // anallyze!
			3135, // tower view scene
			'3381-3392', // umbrella decenbt
			'3226-3235', // mechanic scenes
			'3542-3550',
			'3881-3886', // bellend jump
			4000, // partner
			'4625-4644', // umbrella
			// "4821-4849",

			/// -in party
			'4761-4768', // in party

			// --skills--
			729, // lockpicking
			'731-733', // skills avalible
			766, // devour
			801, // demon seed learned
			802, // greater blood magic
			803, // blood sacrivice
			864, // greater necromancy ok?
			871, // counter magic
			1025, // leg sweep
			1045, // backstab
			'1041-1044', // backstab misc
			1061, // new god rising
			1167, // learned portal
			'1185-1211', // a lot of skills
			'1223-1241',
			1248,
			1250,
			1253,
			'1267-1268',
			'1448-1455',
			'1541-1552',
			'1923-2045', // so very many skills
			'2079-2099', // skils
			'2201-2214',
			2399, // attacked wheelchair
			2766,
			2787,

			// --crafting maybe drop chance--
			'2064-2067', // maybe needs?

			// --equips--
			'2252-2254', // gun equiped
			2750, // wheelchair
			2899, // gasoline1
			2924, // knife

			// --effects---
			'814-816', // parania, blindness and rapanoia
			837, // fear effect
			862, // hallucinations
			901, // hallucinations
			2062, // blind for first time
			3276,

			// cipple
			'817-835',

			// sacrifice circle / gods
			'396-397',
			'472-490', // a lot more sacrifice
			588, // talk scene
			625, // first talk
			'641-651', // execution
			694,
			'856-858', // skelleton
			1062, // ritual new gods
			'1401-1406', // ritual1
			'1415-1420',
			'1421-1427', // sigils
			'1533-1538',
			'1561-1563', // ritual0
			'2047-2055', // circle4
			2360, // no other gods
			'2445-2455', // circle5
			'3178-3180', // ritual church2
			'3218-3220', // church
			'3817-3823', // sins/confession
			'3998-3999',

			// -- endings --
			// 1413 ending a hard
			// 1414 ending b hard
			'1428-1442',
			'1889-1892', // endings b c n and a
			1900, // won the game

			// portal
			// "1157-1166"
			// 1168
			// 1178
			// 1173
			// 1219
			// 2056-2060
			// 3146-3160

			// carving
			'611-615', // carving
			'668-675',
			'1135-1136',

			// love
			'399-405',
			440,

			// affinity
			'406-409',

		];

		MATTIE.static.switch.ignoredSwitches = MATTIE.static.rangeParser(MATTIE.static.switch.ignoredSwitches);

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
