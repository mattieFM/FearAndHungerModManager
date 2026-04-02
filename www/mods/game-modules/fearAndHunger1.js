/**
 * @file fearAndHunger1.js
 * @description Game Module — Fear & Hunger 1
 *
 * Provides all game-specific static data for Fear & Hunger 1 (the original dungeon game).
 * This module is selected when MATTIE.global.isFunger() returns true.
 *
 * Data extracted from static.js isFunger() branch (lines 503-1448).
 */

MATTIE.static.registerGameModule({
	id: 'fearandhunger1',
	name: 'Fear & Hunger',
	versionMatch: function () { return MATTIE.global.isFunger(); },

	// ─── Dependencies ──────────────────────────────────────────────────────────
	// These commonLib scripts are loaded by _gameModuleLoader before applying this
	// module (see Phase 9). Listed here for documentation even before Phase 9 lands.
	dependencies: [
		'_common/betterCrowMauler',
		'_common/API_CORE/heSoBBGirlAPI',
		'_common/commonitems/costumes',
	],

	// ─── Maps ─────────────────────────────────────────────────────────────────
	maps: {
		// Dungeon level map IDs — Fear & Hunger 1
		fortress: 74,
		levelOneEntranceA: 1,
		levelOneEntranceB: 29,
		levelOneEntranceC: 51,
		levelOneInnerHallA: 3,
		levelOneInnerHallB: 31,
		levelOneInnerHallC: 53,
		levelOneBackyard: 9,
		levelTwoBloodPitA: 5,
		levelThreePrisonsA: 6,
		levelThreePrisonsB: 37,
		levelThreePrisonsC: 59,
		levelFiveThicketsC: 68,
		levelFiveThicketsB: 46,
		levelFiveThicketsA: 21,
		levelSevenDungeons: 24,
		levelSixMines: 16,
		villageHutsInsides: 22,
		levelFiveMinesA: 11,
		levelFiveMinesB: 39,
		levelFiveMinesC: 184,

		charCreationMap: 2,
		startMap: 10,

		menuMaps: [
			10, // start
			2, // char creation
			72,
			73, // fortress intro
			86, // fortress ending
			130, // dungeon knights
			61, // unused hexen map
			64, // unused test map
			170,
			161, // dungeon menu
			33,
			181,
		],

		blockingMaps: [
			132, 122, 131, 153, 160, 185, 40, 10, 86, 139, 129, 147,
			98, 14, 130, 88, 89, 62, 15, 137, 66, 124, 156, 64, 161,
			1, 162, 104, 170, 168, 138, 137, 54, 32, 7, 9, 13, 25,
			140, 152, 144, 28, 12, 186, 163, 159, 91, 15, 50, 72, 94,
		],

		dungeonKnights: [
			161, 158, 165, 166, 167, 162, 168, 169, 176, 177,
			170, 171, 172, 174, 175, 178, 179, 173, 180, 181,
		],
	},

	// ─── Actors ───────────────────────────────────────────────────────────────
	actors: {
		emptyActorSlotId: 15,
		mercenaryId: 1,
		girlId: 2,
		knightId: 3,
		darkPriestId: 4,
		outlanderId: 5,
		leGardeId: 6,
		demonKidId: 8,
		marriageId: 9,
		abominableMarriage: 11,
		nashrahId: 14,
	},

	// ─── Teleports ────────────────────────────────────────────────────────────
	// cmd closures reference MATTIE.tpAPI.* functions registered in hooks.onStaticUpdate
	teleports: [
		{ id: 0, name: 'Spawn', cmd: () => MATTIE.tpAPI.fortressSpawn(), bool: () => true, btn: true },
		{ id: 1, name: 'Level 1 - Dungeon Entrance', cmd: () => MATTIE.tpAPI.levelOneEntrance(), bool: () => true, btn: true },
		{ id: 2, name: 'Level 1 - Inner Halls', cmd: () => MATTIE.tpAPI.levelOneInnerHall(), bool: () => true, btn: true },
		{ id: 3, name: 'Level 2 - Blood Pit', cmd: () => MATTIE.tpAPI.levelTwoBloodPit(), bool: () => true, btn: true },
		{ id: 4, name: 'Level 3 - Prisons', cmd: () => MATTIE.tpAPI.levelThreePrisons(), bool: () => true, btn: true },
		{ id: 5, name: 'Level 5 - Mines', cmd: () => MATTIE.tpAPI.levelFiveMines(), bool: () => true, btn: true },
		{ id: 6, name: 'Level 5 - Thickets', cmd: () => MATTIE.tpAPI.levelFiveThickets(), bool: () => true, btn: true },
		{ id: 7, name: 'Level 6 - Cave Dweller Village', cmd: () => MATTIE.tpAPI.levelSixCaveVillage(), bool: () => true, btn: true },
		{ id: 8, name: 'Level 6 - Cube Of The Depths', cmd: () => MATTIE.tpAPI.levelSixCaveVillageCOD(), bool: () => true, btn: true },
		{ id: 9, name: "Level 6 - Dar'ce", cmd: () => MATTIE.tpAPI.levelSixCaveVillageDarkie(), bool: () => true, btn: true },
		{ id: 10, name: 'Level 7 - LeGarde', cmd: () => MATTIE.tpAPI.levelSevenLegard(), bool: () => true, btn: true },
	],

	// ─── Switches ─────────────────────────────────────────────────────────────
	switches: {
		// Scalar IDs
		hardMode: 2190,
		starvation: 3153,
		crowMaulerCanSpawn: 786,
		crowMaulerDead: 771,
		crowMaulerDisabled: 2953,
		legardAliveSwitch: 1016,

		characterLimbs: [
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
		],

		logical: [
			{ id: 198, name: 'Cahara sacrifice TTOT' },
			{ id: 3115, name: 'Finish Trotur Quest' },
			{ id: 2190, name: 'HARD MODE' },
			{ id: 3155, name: 'HARD ENEMY MODE' },
			{ id: 81, name: 'Girl Freed' },
			{ id: 117, name: 'Elevator' },
			{ id: 786, name: 'Crow Can Spawn' },
			{ id: 1560, name: 'Gauntlet Entrance Open' },
		],

		syncedSelfSwitches: [
			// self switches for temple of torment [mapid, eventid, letter]
			[85, 54, 'A'],
			[85, 46, 'A'],
			[85, 47, 'A'],
			[85, 48, 'A'],
		],

		ignoredSelfSwitches: [
			// hexen control vars
			[53, 280, 'A'],
			[39, 332, 'A'],
			// char creation menu switches
			[10, 1, 'A'],
		],

		ignoredSwitches: [
			//-------------------------------------------------------
			//          Char Switches
			//-------------------------------------------------------
			'242-246', // the switches that tell the game what char you are playing as
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
			//          Coin Flip Attack Switches
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
		],

		syncedSwitches: [
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
		],

		godAffinitySwitches: [
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
		],
	},

	// ─── Variables ────────────────────────────────────────────────────────────
	variables: {
		secondarySynced: [
			// these are vars that will be synced based on a cooldown when the map is loaded.
			// put anything in here that need to be synced, but not imidietly. things like enemy death, lever states etc...

			// main random vars, mostly for the floors and big stuff
			68, 69, 20, 21, 26, 31, 32, 61, 82, 78, 76, 97, 77, 46, 4,
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
		],

		synced: [
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
		],

		godAffinityAndPrayerVars: [
			//---------------------------
			// God Affinities
			//---------------------------
			33, // orgy var (love corner)
			'35-38', // GOD Vars... GROGAROTH_VAR
			79, // god of the depths var 2
			'162-165', // more affinities... Afinity_God
		],

		ignored: [
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
		],
	},

	// ─── States ───────────────────────────────────────────────────────────────
	// These match the top-level defaults in static.js (F&H1 values)
	states: {
		knockout: 0,
		blind: 49,
		cantDoShitOnce: 36,
		cantDoShit: 13,
		resistDeath: 91,
		legCut: 14,
		armCut: 3,
		bleeding: 5,
	},

	// ─── Troops ───────────────────────────────────────────────────────────────
	// F&H1 troop IDs (currently set as top-level defaults in static.js)
	troops: {
		crowMauler: 51,
		salmonSnakeId: 50,
		blackWitchId: 96,
		caveMotherId: 19,
		harvestManId: 55,
		bodySnatcherId: 160,
		redManId: 74,
		greaterBlightId: 191,
		blightId: 185,
		moldedId: 178,
		torturerId: 17,
		nightLurch: 149,
		infectedNightLurch: 187,
		greaterMumbler: 193,
		moonlessGaurdId: 117,
		isayahId: 138,
		seymor: 205,
		ironShakespeareId: 57,
		knightSpectorId: 22,
		gauntKnightId: 140,
		assassinSpectreId: 56,
		darceId: 119,
		enkiId: 69,
		caharaId: 67,
		ragnId: 120,
		oldKnightId: 21,
		whiteAngelId: 100,
		doubleHeadedCrowId: 135,
		butterFlyId: 9,
		tripleCrow: 27,
		crowMaulerId: 51,
		secretId: 0, // enki marraige
		namelessId: 97,
		oldGuardianId: 101,
		lizardMageId: 214,
		skinGrannyId: 109,
		fancoisId: 115,
		chambaraId: 75,
		valteilId: 110,
		gorothId: 169,
		sylvianId: 210,
		griffithId: 126,
		GOFAHID: 130,
	},

	// ─── Items ────────────────────────────────────────────────────────────────
	// Function called after $dataItems is loaded
	items: function () {
		return {
			emptyScroll: $dataItems[88],
			silverCoin: $dataItems[59],
			icons: { bookIcon: 121 },
		};
	},

	// ─── Skills ───────────────────────────────────────────────────────────────
	// Function called after $dataSkills is loaded
	skills: function () {
		return {
			bloodportal: $dataSkills[148],
			hurting: $dataSkills[12],
			bloodGolem: $dataSkills[51],
			greaterBloodGolem: $dataSkills[103],
			healingWhispers: $dataSkills[151],
			run: $dataSkills[40],
			enGarde: $dataSkills[146],
		};
	},

	// ─── Common Events ────────────────────────────────────────────────────────
	commonEvents: function () {
		return {
			// Food IDs (confirmed different per game)
			smallFood: 31,
			medFood: 32,
			largeFood: 33,
			foods: [31, 32, 33],

			// F&H1 specific common events
			bloodportal: $dataCommonEvents[152],
			credits: $dataCommonEvents[310],
			randomScroll: 149,
			randomRareBook: 178,
			randomMinorBook: 179,
			randomGreatItem: 200,
			randomWeapon: 238,
			randomMinorWeapon: 239,
			randomNightItems: 250,
			randomMinorItems: 23,
			randomMinorBook: 25,
			randomRareBook: 26,
			randomBloodBook: 29,
			randomFood: 52,
			randomRareItem: 58,
			randomAlchemy: 68,
			randomGoodArmor: 141,
			lootTables: [],
		};
	},

	// ─── Events ───────────────────────────────────────────────────────────────
	events: {
		crowMauler: () => MATTIE.eventAPI.getEventOnMap(287, 11),
		images: {
			shiny: () => MapEvent.generateImage(0, '!Flame', 6, 0, 0), // the shiny coin icon
			get coin() { return MATTIE.static.events.images.shiny; },
		},
	},

	// ─── Multiplayer ──────────────────────────────────────────────────────────
	multiplayer: {
		// Ghost actor source: miner on map 185, event 20, troop 174 index 7
		ghost: { mapId: 185, eventId: 20, troopId: 174, troopIndex: 7 },

		// PvP: actor ID → troop ID mapping for battle conversion
		pvpActorTroopMap: {
			1: 67, // mercenary  → cahara troop
			3: 119, // knight     → darce troop
			4: 69, // dark priest → enki troop
			5: 120, // outlander  → ragn troop
		},

		gameOverText: {
			death: 'the dungeons of fear and hunger',
			place: 'these dungeons',
			spectate: 'Your body was claimed by the dungeons, but your soul\n roams freely, may you live again.',
			rebirth: 'The dungeons distort and warp everything that you are, \neverything that you were ceases to be. Now, be born anew.',
		},

		// Spawn teleport for keybind tool (multiplayerKeybindsAndTools.js)
		spawnMap: { mapId: 74, x: 15, y: 11 },

		// Character portrait face names for multiplayer char creation renderer
		charPortraitMap: {
			1: 'intro_cahara1',
			2: 'intro_girl1',
			3: 'intro_knight1',
			4: 'intro_darkpriest1',
			5: 'intro_outlander1',
			6: 'intro_legarde1',
		},
	},

	// ─── Features ─────────────────────────────────────────────────────────────
	features: {
		hasCrowMauler: true,
		hasLighting: true,
	},

	// ─── Compatibility ────────────────────────────────────────────────────────
	compat: {
		blockedMods: [],
		ignoredPlugins: [],
		menuIconMap: null, // F&H1 uses default RPG Maker menu icons
	},

	// ─── Hooks ────────────────────────────────────────────────────────────────
	hooks: {
		onStaticUpdate: function () {
			// Version confirmation dialog
			if (!MATTIE.DataManager.global.get('correctVersion')) {
				if (confirm('The mod loader thinks you are running fear and hunger 1.'
				+ 'If this is correct click okay to hide this prompt.')) {
					MATTIE.DataManager.global.set('correctVersion', true);
				}
			}

			// ── Register F&H1 teleport functions on MATTIE.tpAPI ────────────────
			// These are moved here from teleportsAPI.js (Phase 7 of the refactor).
			// They already exist in teleportsAPI.js for backward compat during transition.

			MATTIE.tpAPI.fortressSpawn = function () {
				this.genericTp(MATTIE.static.maps.fortress, 14, 9);
			};

			MATTIE.tpAPI.levelOneEntrance = function () {
				switch (MATTIE.util.getMapVariant(0)) {
				case 'a': this.genericTp(MATTIE.static.maps.levelOneEntranceA, 27, 67); break;
				case 'b': this.genericTp(MATTIE.static.maps.levelOneEntranceB, 26, 68); break;
				case 'c': this.genericTp(MATTIE.static.maps.levelOneEntranceC, 26, 68); break;
				default: break;
				}
			};

			MATTIE.tpAPI.levelOneInnerHall = function () {
				switch (MATTIE.util.getMapVariant(2)) {
				case 'a': this.genericTp(MATTIE.static.maps.levelOneInnerHallA, 36, 64); break;
				case 'b': this.genericTp(MATTIE.static.maps.levelOneInnerHallB, 26, 65); break;
				case 'c': this.genericTp(MATTIE.static.maps.levelOneInnerHallC, 27, 65); break;
				default: break;
				}
			};

			MATTIE.tpAPI.levelOneBackyard = function () {
				this.genericTp(MATTIE.static.maps.levelOneBackyard, 28, 53);
			};

			MATTIE.tpAPI.levelOneBunnyMasks = function () {
				this.genericTp(MATTIE.static.maps.levelOneBackyard, 14, 10);
			};

			MATTIE.tpAPI.levelTwoBloodPit = function () {
				this.genericTp(MATTIE.static.maps.levelTwoBloodPitA, 33, 36);
			};

			MATTIE.tpAPI.levelThreePrisons = function () {
				switch (MATTIE.util.getMapVariant(5)) {
				case 'a': this.genericTp(MATTIE.static.maps.levelThreePrisonsA, 5, 35); break;
				case 'b': this.genericTp(MATTIE.static.maps.levelOneInnerHallB, 4, 38); break;
				case 'c': this.genericTp(MATTIE.static.maps.levelOneInnerHallC, 3, 33); break;
				default: break;
				}
			};

			MATTIE.tpAPI.levelFiveThickets = function () {
				switch (MATTIE.util.getMapVariant(13)) {
				case 'a': this.genericTp(MATTIE.static.maps.levelFiveThicketsA, 4, 24); break;
				case 'b': this.genericTp(MATTIE.static.maps.levelFiveThicketsB, 14, 22); break;
				case 'c': this.genericTp(MATTIE.static.maps.levelFiveThicketsC, 14, 22); break;
				default: break;
				}
			};

			MATTIE.tpAPI.levelSevenLegard = function () {
				this.genericTp(MATTIE.static.maps.levelSevenDungeons, 59, 20);
			};

			MATTIE.tpAPI.levelSixCaveVillage = function () {
				this.genericTp(MATTIE.static.maps.levelSixMines, 60, 48);
			};

			MATTIE.tpAPI.levelSixCaveVillageCOD = function () {
				this.genericTp(MATTIE.static.maps.villageHutsInsides, 55, 28);
			};

			MATTIE.tpAPI.levelSixCaveVillageDarkie = function () {
				this.genericTp(MATTIE.static.maps.levelSixMines, 17, 29);
			};

			MATTIE.tpAPI.levelFiveMines = function () {
				switch (MATTIE.util.getMapVariant()) {
				case 'a': this.genericTp(MATTIE.static.maps.levelFiveMinesA, 20, 65); break;
				case 'b': this.genericTp(MATTIE.static.maps.levelFiveMinesB, 17, 80); break;
				case 'c': this.genericTp(MATTIE.static.maps.levelFiveMinesC, 52, 85); break;
				default: break;
				}
			};
		},
	},
});
