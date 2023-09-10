var MATTIE = MATTIE || {};
MATTIE.msgAPI = MATTIE.msgAPI || {};


/**
 * @description display a msg in the way funger handles speech
 * @param {string} title the title/char name to display in darkened text
 * @param {string} msg the string msg
 */
MATTIE.msgAPI.displayMsgWithTitle = function(title,msg){
        $gameMessage.add(`\\c[7]${title}\\c[0]\n${msg}`);
}

/**
 * @param {*} choices array of string msgs
 * @param {*} defaultChoice what index does the user start on
 * @param {*} cancelChoice which index cancels the menu
 * @param {*} cb a function that takes the index response of the use
 * @param {string} msgs displays at the bottom of the screen
 * @param {[] || string} helps displays at top of screen
 */
MATTIE.msgAPI.showChoices = function(choices, defaultChoice, cancelChoice, cb, msg, helps=[]){

        let helpsArr = [];
        if(typeof helpsArr != typeof "string"){
            helpsArr = helps
        }else{
            choices.forEach(()=>helpsArr.push(helps))
        }
        $gameMessage.setChoiceHelps(helpsArr);
        $gameMessage.setChoiceMessages([]);
        $gameMessage.setChoiceFaces([]);
        $gameMessage.add(msg);
        $gameMessage.setChoices(choices, defaultChoice, cancelChoice);
        $gameMessage.setChoiceCallback(function(n) {
            cb(n);
        }.bind(this));
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