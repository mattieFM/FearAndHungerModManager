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

//items
MATTIE.static.items.emptyScroll = null;


//skills
MATTIE.static.skills.bloodportal = null;
MATTIE.static.skills.hurting = null;


//RPGMaker Constants
MATTIE.static.rpg.battleProcessingId = 301;

//Variableids
MATTIE.static.variable.syncedVars = [];

//switchids
MATTIE.static.variable.switch.ignoredSwitches = [];

//states
/** this is the state that governs "death" in combat */
MATTIE.static.states.knockout = 0;

MATTIE.static.update = function(){
    //common events
    MATTIE.static.commonEvents.bloodportal = null;

    if(MATTIE.global.version === 1){
        //static values specific to funger 1


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
        MATTIE.static.variable.switch.ignoredSwitches = [
            1189,
            1188, //sprint switch
            1211,

        ]

        //vars
        MATTIE.static.variable.syncedVars = [
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
            121,
            122,
            123,
            124,
            125,
            126,
            127,
            128,
            129,
            130,
            131,
            132,
            133,
            134,
            135,
            136,
            //secondary random vars, less important, but still needed.
            315,  //vines
            2536, //vines 2

            354,  //elite guard rand
            2930, //elite guard rand2
            2930, //elite guard rand3
            2931, //elite guard rand3

            209, //random hole
            1563, //random hole 2
            1564, //random hole 3

            350, //basement rand

            208, //black witch rand
            1518, //black witch rand 2

            260, //cave dweller massacre
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

            //darce random
            83, //darce variable

            //enki random
            84, //enki variable

            //outlander random
            85, //outlander variable

            //merc random
            86, //merc variable
            
            
            
        ]
        

    }else if (MATTIE.global.version === 2){
        //static values specific to funger 2
    }   
    //static values shared between both games

}
