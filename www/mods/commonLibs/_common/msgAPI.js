var MATTIE = MATTIE || {};
MATTIE.msgAPI = MATTIE.msgAPI || {};

//check DreamX exists for compatibility reasons
var DreamX = DreamX || false;


/**
 * @description display a msg in the way funger handles speech
 * @param {string} title the title/char name to display in darkened text
 * @param {string} msg the string msg
 */
MATTIE.msgAPI.displayMsgWithTitle = function(title,msg){
    MATTIE.msgAPI.displayMsg(MATTIE.msgAPI.formatMsgAndTitle(title,msg));
}

/**
 * s
 * @param {*} msg string msg
 * @param {int} background optional
 * Sets the background of the message window;
 * options are 0 (fully opaque), 1 (transparent), 2 (invisible background).
 * The default is 0.
 * @param {int} pos
 * Sets the position of the message window;
 * 0 is top
 * 1 is middle
 * default is 2.
 */
MATTIE.msgAPI.displayMsg = function(msg, background=2, pos=2){
    $gameMessage.setBackground(background);
    $gameMessage.setPositionType(pos);
    $gameMessage.add(msg);
}

/**@description format a string into the form title msg, as though speaking */
MATTIE.msgAPI.formatMsgAndTitle = function(title,msg){
    return `\\c[7]${title}\\c[0]\n${msg}`
}


/**
 * @param {*} choices array of string msgs
 * @param {*} defaultChoice what index does the user start on
 * @param {*} cancelChoice which index cancels the menu
 * @param {*} cb a function that takes the index response of the use
 * @param {string} msgs displays at the bottom of the screen
 * @param {any[]|string} helps displays at top of screen
 */
MATTIE.msgAPI.showChoices = function(choices, defaultChoice, cancelChoice, cb, msg=null, msgs=[], helps=[]){

        let helpsArr = [];
        if(typeof helpsArr != typeof "string"){
            helpsArr = helps
        }else{
            choices.forEach(()=>helpsArr.push(helps))
        }

        MATTIE.msgAPI._dreamXCompat(helpsArr);
        MATTIE.msgAPI._dreamXCompat(helpsArr,msgs);
        
        if(msg!=null) $gameMessage.add(msg);
        $gameMessage.setChoices(choices, defaultChoice, cancelChoice);
        $gameMessage.setChoiceCallback(function(n) {
            cb(n);
        }.bind(this));
}

/**
 * @description add compatibility for dreamX choice help plugin
 */
MATTIE.msgAPI._dreamXCompat = function(helpsArr,msgs){
    if(DreamX)
        if(DreamX.ChoiceHelp){
            $gameMessage.setChoiceHelps(helpsArr);
            $gameMessage.setChoiceMessages(msgs);
            $gameMessage.setChoiceFaces([]);
        }
    }


/**
 * @description show a msg at the footer of the screen, using the gab text plugin
 * @param {string} msg message to display
 * @param {int} ms the milliseconds till the event is hidden
 */
MATTIE.msgAPI.footerMsg = function(msg){
    if(typeof msg === typeof "string") msg = [msg]; //add msg to an array if it is a string
    Game_Interpreter.prototype.setGabText(msg);
    Game_Interpreter.prototype.showGab();
}   




//=============================================================================
// Gab Plugin Message Extension
//=============================================================================


//=============================================================================
// Scene_Base
//=============================================================================

MATTIE.msgAPI.Scene_Title_Create = Scene_Title.prototype.create;
Scene_Title.prototype.create = function() {
    MATTIE.msgAPI.Scene_Title_Create.call(this);
    this.createGabWindow(false);
};