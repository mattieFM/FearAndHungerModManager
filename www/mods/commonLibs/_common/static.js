var MATTIE_ModManager = MATTIE_ModManager || {};
var MATTIE = MATTIE || {};
MATTIE.global = MATTIE.global || {};
MATTIE.static = MATTIE.static || {};
MATTIE.static.items = MATTIE.static.items || {};
MATTIE.static.skills = MATTIE.static.skills || {};
MATTIE.static.states = MATTIE.static.states || {};
MATTIE.static.rpg = MATTIE.static.rpg || {};
MATTIE.static.commonEvents = MATTIE.static.commonEvents || {};
MATTIE.static.variable = MATTIE.static.variable || {};
MATTIE.static.switch = MATTIE.static.switch || {};

MATTIE.static.maps = MATTIE.static.maps || {};
MATTIE.static.events = MATTIE.static.events || {};
MATTIE.static.events.images = MATTIE.static.events.images || {};
//maps

MATTIE.static.maps.menuMaps = [];
//items
MATTIE.static.items.emptyScroll = null;


//skills
MATTIE.static.skills.bloodportal = null;
MATTIE.static.skills.hurting = null;


//RPGMaker Constants
MATTIE.static.rpg.battleProcessingId = 301;

//Variableids
MATTIE.static.variable.syncedVars = [];
MATTIE.static.variable.ignoredVars = [];
MATTIE.static.variable.secondarySyncedVars = [];
MATTIE.static.variable.godAffinityAndPrayerVars = [];

//switchids
MATTIE.static.switch.ignoredSwitches = [];
MATTIE.static.switch.syncedSwitches = [];

//states
/** this is the state that governs "death" in combat */
MATTIE.static.states.knockout = 0;


//events

//images
MATTIE.static.events.images.shiny = {};
MATTIE.static.events.images.coin = MATTIE.static.events.images.shiny;

MATTIE.static.update = function(){
    //common events
    MATTIE.static.commonEvents.bloodportal = null;

    if(MATTIE.global.version === 1){
        //static values specific to funger 1

        //maps
        
        MATTIE.static.maps.menuMaps = [
            10, //start
            2, //char creation
            72,
            73, //fortress intro
            86, //fortress ending
            130, //dungoen knights
            61, //unused hexen map
            64, //unused test map


        ]
        MATTIE.static.maps.menuMaps = MATTIE.static.rangeParser(MATTIE.static.maps.menuMaps);


        //items
        MATTIE.static.items.emptyScroll = $dataItems[88]




        //skills
        MATTIE.static.skills.bloodportal = $dataSkills[148];
        MATTIE.static.skills.hurting = $dataSkills[12];


        //common events
        MATTIE.static.commonEvents.bloodportal = $dataCommonEvents[152];


        //states
        MATTIE.static.states.knockout = 0;

        //switches
        MATTIE.static.switch.ignoredSwitches = [
            //-------------------------------------------------------
            //          Char Switches
            //-------------------------------------------------------
            "242-246", //the switches that tell the game what char you are playing as\
            380, //fusion select
            375, //marrige select
            "657-658", //merc or outlander in party
            "661-664", //inital chars
            "721-724", //moonless piss level
            



            //-------------------------------------------------------
            //          Status Switches
            //-------------------------------------------------------
            //-- dismemberment switches --
            "696-700", //moonless dismemberment
            "270-273", //also moonless dismemberment, likely one of these is enemy moonless
            "36-39",   //mercenary dismemberment
            "248-251", //knight dismemberment
            "252-255", //enki dismemberment
            "256-259", //outlander dismemberment
            "261-264", //legard dismemberment
            "376-379", //blood golem dismemberment
            "381-384", //demon kid dismemberment
            "385-388", //marrige dismemberment
            "390-393", //fusion dismemberment
            "841-852", //skelleton dismemberment
            "1824-1827", //darce dismemberment

            "3228-3239", //marriage dismemberment 2?
            "3241-3245", //rag dismemberment 2?


            //-- torch switches
            "3181-3186", //torches

            
            //-- state switches --
            15, //Anal Bleed
            20, //Anal Bleed Grand Switch
            "265-269", //Main Char anal bleed switches
            389, //marrige anal bleed
            394, //fusion anal bleed
            814, //paranoia small
            815, //rapanoia
            816, //blindness
            "817-829", //not crippled switches
            "1541-1544", //grave_merc, grave_outlander?
            "1728-1746", //curse
            "1810-1812", //fire, burning, death.
            "2939-2943", //the girl beaten... ragn beaten... ?
            "3569-3578", //demon kid sword.... goul_wait...?

            
            



            //-------------------------------------------------------
            //          location switches (IE: switches that keep track of where the player is)
            //-------------------------------------------------------
            "701-719", //player current location switches IE: where is the player currently.
            "183-188",
            "1063-1104", //patch switches
            "1481-1513", //mehabre locations
            "1550-1553", //more mehbare
            "2317-2320", //location_tombs achient
            "2425-2430", //achient tombs directions, left! middle! right!
            2592, //void location
         


            //-------------------------------------------------------
            //          Overworld switches (A bit general of a catagory, but think stuff like arrows, traps etc...)
            //-------------------------------------------------------
            //59, //"arrow1" has to do with arrow traps, might need to be disabled, but I think it should be forwarded.
           
            //--fear
            271, //something with fear
            "830-837", //fear_floor switches
            862, //hallucinations
            863, //fear reset switch
            901, //hallucinations 2 (me no know)
            "3246-3248", //fear_effect1-3
            "3249-3258", //more fear, fear_girl... fear_darce.
            "3521-3526", //fear_once?
            

            342, //yellow mage hurting zone
            "399-405", //show love vars
            410, //cannot use bow 
            471, //merc show love  
            583, //bugs
            "585-603", //more bugs
            "606-611", //more bugs
            "2230-2233", //more bugs
            
            
            //-- gauntlet trap switches --
            "1214-1241", //gauntlet spikes. We do not need the spikes to be synced between clients
            1241, //gauntlet spike trap
            "1244-1256", //spike rows
            "1261-1269", //swinging axes
            "3001-3047", //gaultet ball and gass
            //--mahabre
            "1321-1326", //flame traps

            "2593-2608", //void logic? not sure if this should be sent or not.
            "2615-1616", //void logic? not sure if this should be sent or not.
            3508, //stepped on trap? probably handles rusty nail

            3539, //sleeping cooldown
            


            


            //-------------------------------------------------------
            //          Skill Switches
            //-------------------------------------------------------
            52, //talk skill?
            260, //suicide learned 
            341, //necromancy available
            729, //lockpicking available
            731, //marksmanship available
            766, //devour available
            584, //mastery over insects
            801, //demon seed learned
            802, //greater blood magic learned
            803, //blood sacrifice available
            864, //greater_necromancy ok
            "1041-1045", //backstab/engurd stuff
            1167, //blood portal learned
            "1185-1209", //most of the skills.
            1211, //skill fast stance
            2251, //bow ok
            2250, //dash ok
            "2844-2845", //phase step
            
            



            

            //-------------------------------------------------------
            //          Menu Switches
            //-------------------------------------------------------
            "5-8", //probably char creation switches
            "213-214", //more menus
            "295-296", //intro
            411, //scene skip allowed
            952,
            1210, //hexen cursor
            "1212-1213", //hexen cursor
            "2521-2530", //char select "CAHARA SELCECT"... "NILVAN_SELECT" I think these are dungeon knights
            3520, //filter effects

            //-------------------------------------------------------
            //          Item Switches
            //-------------------------------------------------------
            31, //wether the player has the necronomicon 
            799, //pasages of mahabre got
            1059, //cube of the depths switch, (we want there to be multiple)
            1530, //cube cooldown?
            1997, //can use cube
            2519, //purified eastern sword event.

            //-------------------------------------------------------
            //          Coin Flip Attack Switches (switches that control coin flip attack, we will not forward these as that would make coin flip attacks happen twice).
            //-------------------------------------------------------
            "16-17", //guard tackle and neck break
            66, //priest chanting
            69, //ghoul1 tackle


            //--------------------------------------------------------------------------
            //          Weird Switches (That probably should be ignored)
            //--------------------------------------------------------------------------
            41, //"disabled" switch. This has something to do with movement speed so it should not be forwarded
            80, //"Wizard Summon" something with nzashra probably?
            126, //"Shielding1"
            813, //"DONT ACTIVATE" with a name like that im not forwarding this switch XDD
            953, //"not used" 
            "986-994", //wierd Cahara stuff
            2481, //"Curse_game_is_on!"  dont know what it does so we will ignore it

            //--------------------------------------------------------------------------
            //          Logical Switches
            //--------------------------------------------------------------------------
            79, //handles some logic regarding starting the game and char selection
            "201-202", //handles suicide
            "213-214", //handles some intro stuff
            299, //while bow in use? 
            660, //demon kid give to pocket cat
            695, //demon kid growing
            3350, //NO_DECREASING, this blocks stats from lowering?
            "1181-1184", //souls should not be shared

            //--------------------------------------------------------------------------
            //          Ending Switches
            //--------------------------------------------------------------------------

            "1837-1840", //sitting on throne
            "1886-1892", //ending vars, share gosple and D, C, B, A
            2249,
            //"2648-2656", //legard rebirth
            2662, //endingS_here we come!
            "2751-2752",
            2981, //bad ending 2


           
            

            //--------------------------------------------------------------------------
            //          Battle Logic Switches
            //--------------------------------------------------------------------------
            "215-216", //run and steal skill triggers?
            200, //handles skill battle combat logic
            "373-374", //blood golem in party
            874, //counter magic
            1000, //YOU CAN ESCAPE, not sure but probs something with combat
            1025, //leg sweep (not sure if battle or skill)
            1281, //GAURD_BATTLE? not sure what this does, I think it has to do with gaurding but it might be about gaurds.
            2482, //purifying talisman 
            "3130-3138", //silvian seizure, not sure?

            //--------------------------------------------------------------------------
            //          armor / outfit Switches
            //--------------------------------------------------------------------------
            212, //no outfit check
            247, //priest robe switch
            298, //call outfit check
            2434, //lord of flies outfit
            2980, //penance armor
            //"3081-3085", //penance_1-5?
            //3107, //penance1_6?
            //3109, //assist_penance?

            //--------------------------------------------------------------------------
            //          Event Switches / Blocking Switches
            //--------------------------------------------------------------------------
            127, //"PrisonRape" probably handles the guard rape scene, so shouldn't be forwarded
            "136-138", //"MercTorture" probably handles torturer capturing merc.
            229, //"LoveCornerMercenary" not sure, but sounds like it might be blocking
            "286-294", //other char love corner and torture switches
            684, //stop sound switch
            794, //harvestman rape
            805, //mahabre scene
            1060, //"Flesh embrace" sounds like an event that might be blocking
            "1289-1300", //amputation event, sawing off.
            "1327-1330", //merc amputation event, sawing off.
            "1331-1394", //most amputation events, sawing off.
            1564, //cage scene
            1566, //snatch (lord of flies?)
            1617, //passageway scene
            "2490-2494", //burning event
            2512, //blight event
            2532, //chara burning event
            2588, //hiding event
            2831, //darce burning? 
            2837, //enki burning?
            2839, //ragn burning?
            //2901, //dogs?
            "2968-2969", //turture hiding/ambush event
            "3261-3272", //fear talk events?
            "3281-3291", //more fear scenes?
            "3301-3347", //Captain_Spot1... Cahara_Spot1... more fear scenes?

            "3463-3479", //misasma scenes
            "3481-3503", //more misasma scenes

            //sleep / surprise event
            3540, //sleep event
            //"3541-3548", //surprise events
            




            //legacy --blocked by original code, reason unknown.
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
            816
           

        ]
        MATTIE.static.switch.ignoredSwitches = MATTIE.static.rangeParser(MATTIE.static.switch.ignoredSwitches)
        MATTIE.static.switch.syncedSwitches = [
            2536, //vines 2
            2930, //elite guard rand2
            2930, //elite guard rand3
            2931, //elite guard rand3

            
            1563, //random hole 2
            1564, //random hole 3

          
            1518, //black witch rand 2

           
            2199, //cave dweller massacre 2

            2229, //unknown, "chase_random"

            //difficulty sync
            //terror and starvation vars
            3480,
            3153,
            3452,
            3154,
            3155,
            //hardmode vars
            2190, //hardmode var
            //2751 //enki_s

            //schoolgirl vars
            2533, //dungeon knights main var
            

            //fucking rat randoms
            3505,
            3506,
            3507,

            //wall randoms? I think crowmauler vars mabye
            3392,
            3393,

            //blood portal vars
            "1157-1166",
            1168,

        ] 
        //vars
        MATTIE.static.switch.syncedSwitches = MATTIE.static.rangeParser(MATTIE.static.switch.syncedSwitches);

        MATTIE.static.variable.secondarySyncedVars = [
            //these are vars that will be synced based on a cooldown when the map is loaded.
            //put anything in here that need to be synced, but not imidietly. things like enemy death, lever states etc...


            //main random vars, mostly for the floors and big stuff
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
            "121-136",
            //secondary random vars, less important, but still needed.
            315,  //vines
            350, //basement rand
            260, //cave dweller massacre
            208, //black witch rand
            209, //random hole


            354,  //elite guard rand


            //darce random
            83, //darce variable

            //enki random
            84, //enki variable

            //outlander random
            85, //outlander variable

            //merc random
            86, //merc variable

            //---------------------------
            //timer vars
            //---------------------------
            "155-157",
            "281-283", //buckman timer
        ]
        MATTIE.static.variable.secondarySyncedVars = MATTIE.static.rangeParser(MATTIE.static.variable.secondarySyncedVars);
        MATTIE.static.variable.syncedVars = [
            //these are vars that will always be synced
            //these ignore silenced interpreters, so be very careful adding something.
            //if something is changed constantly in here it will be forwarded along net, and take up a lot of bandwidth.
           
            


            

            //---------------------------
            //temple of torment vars
            //---------------------------
            151,
            152,
            153, //conciousness

            //---------------------------
            //tomb of the gods vars
            //---------------------------
            "284-299",





            //---------------------------
            //portal vars
            //---------------------------
            161,
            


            


            


            



            
        ]

        MATTIE.static.variable.syncedVars = MATTIE.static.rangeParser(MATTIE.static.variable.syncedVars);
        MATTIE.static.variable.godAffinityAndPrayerVars = [
            //---------------------------
            //God Affinities
            //---------------------------
            "35-38", //GOD Vars... GROGAROTH_VAR
            79, //god of the depths var 2
            "162-165", //more affinities... Afinity_God
        ]

        MATTIE.static.variable.godAffinityAndPrayerVars = MATTIE.static.rangeParser(MATTIE.static.variable.godAffinityAndPrayerVars);
        MATTIE.static.variable.ignoredVars = [ //ignored vars
            

            1, //Lightswitch
            2, //daynightsave
            "5-8", //charHp, Char x, Char y
            9, //menu
            10, //daynight cycle
            13, //class_select
            14, //coinflip
            "15-16", //random items
            "17-18", //bleeding
            19, //battle turn
            27, //HUNGER
            33, //love corner
            34, //party size

            "41-51", //MONSTER POS vars? not sure. I think the code that handles monsters moving should override these anyways.
            "72-75", //MONSTER POS VARS
            "92-95", //More pos
            "159-160", //more pos
            "256-259",
            "321-332", //more pos
            "351-352", //more pos
            "351-395", //rolling (probably the poorly animated 3d boulders)

            58, //night lerch leap.

            "62-65", //Dungeon Knights Affection
            70, //dungoen knights merc affection
            "87-88", //dungeon knights more affection
            "303-313", //more affection
            "334-343", //more affection

            90, //demon baby growing

            67, //char name

            96,//silver coins?

            "102-103", //mapID, mapX, mapY


            "107-119", //crippled vars
            "137-150", //hunger and paranoia
            158, //player mp fear


            //---------------------------
            //menu vars
            //---------------------------
            "166-167",//hexen
            254, //cube cooldown
            "357-359", //coin flip vars
            253, //mapid2
            396, //battleturns2
            405, //sleeping_bed
            406, //partymember

            //---------------------------
            //trap vars
            //---------------------------
            "168-203", //spikes
            "212-227", //fire

            "204-206", //sawing_off


            "230-250", //infection vars


            255, //char hp check





            "261-278", //curse vars

            

            //timers
            399,    
            400,
            398, //torch timer
            403, //torch2
        ]

        MATTIE.static.variable.ignoredVars = MATTIE.static.rangeParser(MATTIE.static.variable.ignoredVars);



        
        if(MATTIE.multiplayer){
            if(MATTIE.multiplayer.params.sharedAffinity){
                MATTIE.static.variable.syncedVars = MATTIE.static.variable.syncedVars.concat(MATTIE.static.variable.godAffinityAndPrayerVars);
            }else{
                MATTIE.static.variable.ignoredVars = MATTIE.static.variable.ignoredVars.concat(MATTIE.static.variable.godAffinityAndPrayerVars);
            }
        }
        //events

        //event images
        MATTIE.static.events.images.shiny = MapEvent.generateImage(0,"!Flame",6,0,0); //the shiny coin incon
        MATTIE.static.events.images.coin =  MATTIE.static.events.images.shiny;

    }else if (MATTIE.global.version === 2){
        //static values specific to funger 2
    }   
    //static values shared between both games

}

/**
 * @description this function takes an array of ints and strings, the strings must be in the format "int-int" as a range of ints, 
 * this function then changes those strings of ranges into the ints themselves and returns the value.
 * @returns array 
 */
MATTIE.static.rangeParser = function(array){
    let newArr = [];
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if(typeof element === typeof "string"){
            let splitRange = element.split('-');
            let min = parseInt(splitRange[0]);
            let max = parseInt(splitRange[1]);
            for (let j = min; j <= max; j++) {
                newArr.push(j)
            }
        }else{
            newArr.push(element)
        }
        
    }
    return newArr;
}