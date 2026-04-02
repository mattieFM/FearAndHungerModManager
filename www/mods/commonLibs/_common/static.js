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
// Game-specific map constants are defined in their respective game modules
// (fearAndHunger1.js, termina.js) and applied via MATTIE.static._applyGameModule().

MATTIE.static.maps.menuMaps = [];
/** @description maps that the player will get fully stuck on if they enter */
MATTIE.static.maps.blockingMaps = [];
MATTIE.static.maps.charCreationMap = 0;
MATTIE.static.maps.startMap = 0;

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
// troopids — populated by the active game module via MATTIE.static._applyGameModule()

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

// skills — populated by the active game module via MATTIE.static._applyGameModule()

// common events — populated by the active game module via MATTIE.static._applyGameModule()

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

	// Use a registered game module if one matches. Falls back to inline code below.
	if (typeof MATTIE.static._selectGameModule === 'function') {
		const module = MATTIE.static._selectGameModule();
		if (module) {
			MATTIE.static._applyGameModule(module);
			return;
		}
	}

	// Inline game-specific fallback was removed.
	// Game data is now applied via registered game modules (game-modules/ directory).
	// See: www/mods/commonLibs/_common/static_legacy.js for the old inline code.
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
