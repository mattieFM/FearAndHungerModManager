var MATTIE_ModManager = MATTIE_ModManager || {};
var MATTIE = MATTIE || {};
MATTIE.global = MATTIE.global || {};
MATTIE.static = MATTIE.static || {};
MATTIE.static.items = MATTIE.static.items || {};
MATTIE.static.skills = MATTIE.static.skills || {};
MATTIE.static.states = MATTIE.static.states || {};
MATTIE.static.rpg = MATTIE.static.rpg || {};
MATTIE.static.commonEvents = MATTIE.static.commonEvents || {};



//items
MATTIE.static.items.emptyScroll = null;


//skills
MATTIE.static.skills.bloodportal = null;
MATTIE.static.skills.hurting = null;


//RPGMaker Constants
MATTIE.static.rpg.battleProcessingId = 301;


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
        

    }else if (MATTIE.global.version === 2){
        //static values specific to funger 2
    }   
    //static values shared between both games

}
