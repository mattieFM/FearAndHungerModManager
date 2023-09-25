var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}



MATTIE.multiplayer.conversations = function (){
    this.firstContact = true;
    this.targetName = ""
    this.targetPeerId = null;
    /**@type {PlayerModel} */
    this.target = null
}

MATTIE.multiplayer.conversations.prototype.greetings = [
    "Hello there",
    "The Dungeons of Fear and hunger truly are beautiful today"

]
/**
 * @description the main talk option that handles all conversation
 * @param {int} localId the id of the local player
 * @param {PlayerModel} target the id of the target player
 */
MATTIE.multiplayer.conversations.prototype.talk = function(localId,target){
    this.targetName = target.name;
    this.targetPeerId = target.peerId;
    this.target = target;
    if(this.firstContact){
        this.firstContactMsg();
    }else{
        this.talkOptions();
    }
    
}

/**
 * @description a function to either try to resurrect the player or say they are not dead
 */
MATTIE.multiplayer.conversations.prototype.resurrect = function(){
    if(this.target.canResurrect()){
            setTimeout(() => {
                let msg = MATTIE.multiplayer.scaling.resurrectionActorCost? "An Unknown God demands a sacrifice and a soul." : MATTIE.multiplayer.scaling.resurrectionItemCost ? "An Unknown God demands a soul in return" : "An Unknown God seems to offer some kindness, perhaps in another world, you showed it kindness."

                MATTIE.msgAPI.showChoices(["Continue", "Cancel"],1,1,(n)=>{
                    if(n==0){
                        if(MATTIE.multiplayer.scaling.resurrectionCost()) {
                            this.target.resurrect();
                            this.nameSpeak("An Unknown God","I bring life"); 
                        }
                        else{
                            if(MATTIE.multiplayer.scaling.resurrectionActorCost)
                            this.nameSpeak("An Unknown God","Life is not cheep, do not take it lightly");
                            else if(MATTIE.multiplayer.scaling.resurrectionItemCost)
                            this.nameSpeak("An Unknown God","Life is not cheep, a soul for a soul")
                        }
                    }
                }, msg)
            }, 100);
        
    }else{
        this.speak("I am not dead.")
        
    }
}

MATTIE.multiplayer.conversations.prototype.speak = function(msg){
    setTimeout(() => {
        MATTIE.msgAPI.displayMsgWithTitle(this.targetName,msg)
    }, 100);
}


MATTIE.multiplayer.conversations.prototype.nameSpeak = function(name,msg){
    setTimeout(() => {
        MATTIE.msgAPI.displayMsgWithTitle(name,msg)
    }, 100);
}
/**
 * @description the cb of the main talk options
 * @param {*} n index that was chosen
 */
MATTIE.multiplayer.conversations.prototype.talkOptionsCb = function(n){
    switch (n) {
        case 0: //Talk
            this.greeting();
            break;
        case 1: //Trade
            this.nameSpeak("Mattie", "That feature isn't implemented. You can drop items to trade.")
            break;
        case 2: //Resurrect
            this.resurrect();
            break;
        case 3: //Attack
            this.nameSpeak("Mattie", "You try to attack");
            MATTIE.multiplayer.pvp.PvpController.emitCombatStartWith(this.targetPeerId);
            MATTIE.multiplayer.pvp.PvpController.startCombatWith(this.targetPeerId);
            break;
        case 4: //Show Love
            this.nameSpeak("Mattie", "That feature isn't implemented. You can drop items to trade.")
            break;
        case 5: //cancel
            break;
        default:
            break;
    }
}
/**
 * @description display the main choices
 */
MATTIE.multiplayer.conversations.prototype.talkOptions = function(){
    MATTIE.msgAPI.showChoices(
        [
            "Talk",
            "Trade",
            "Resurrect",
            "Attack",
            "Show Love",
            "Cancel"
        ],
    0,
    5,
    (n)=>this.talkOptionsCb(n)
    ,"You talk to " + this.targetName)
}


MATTIE.multiplayer.conversations.prototype.firstContactMsg = function(){
    MATTIE.msgAPI.displayMsgWithTitle(this.targetName,"Hello there")
    this.firstContact = false;
}

MATTIE.multiplayer.conversations.prototype.greeting = function(){
    MATTIE.msgAPI.displayMsgWithTitle(this.targetName,"Hello there")
}