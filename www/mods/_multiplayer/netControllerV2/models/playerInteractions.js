var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}



MATTIE.multiplayer.conversations = function (){
    this.firstContact = true;
    this.targetName = ""
    this.targetPeerId = null;
    /**@type {PlayerModel} */
    this.target = null
}

MATTIE.multiplayer.conversations.prototype.greeetings = [
    "Hello there",
    "The Dungeons of Fear and hunger truly are beautiful today",

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
                            setTimeout(() => {
                                MATTIE.msgAPI.displayMsgWithTitle("An Unknown God","I bring life"); 
                            }, 100);
                        }
                        else{ setTimeout(() => {
                            if(MATTIE.multiplayer.scaling.resurrectionActorCost)
                            MATTIE.msgAPI.displayMsgWithTitle("An Unknown God","Life is not cheep, do not take it lightly");
                            else if(MATTIE.multiplayer.scaling.resurrectionItemCost)
                            MATTIE.msgAPI.displayMsgWithTitle("An Unknown God","Life is not cheep, a soul for a soul")
                        }, 100);}
                    }
                }, msg)
            }, 100);
        
    }else{
        setTimeout(() => {
            MATTIE.msgAPI.displayMsgWithTitle(this.targetName,"I am not dead.")
        }, 100);
        
    }
}

/**
 * @description the cb of the main talk options
 * @param {*} n index that was chosen
 */
MATTIE.multiplayer.conversations.prototype.talkOptionsCb = function(n){
    switch (n) {
        case 0: //Talk
            MATTIE.msgAPI.displayMsgWithTitle(this.targetName,"That feature isn't implemented.")
            break;
        case 1: //Trade
            MATTIE.msgAPI.displayMsgWithTitle(this.targetName,"That feature isn't implemented.")
            break;
        case 2: //Resurrect
            this.resurrect();
            break;
        case 3: //Attack
            MATTIE.msgAPI.displayMsgWithTitle(this.targetName,"That feature isn't implemented.")
            break;
        case 3: //Cancel
        
            break;
        default:
            MATTIE.msgAPI.displayMsgWithTitle(this.targetName,"That feature isn't implemented.")
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
            "Cancel"
        ],
    0,
    4,
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