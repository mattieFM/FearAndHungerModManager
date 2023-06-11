var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}

var EventEmitter = require("events");
class BaseNetController extends EventEmitter {
    constructor() {
        super();
        this.peerId;
        this.players = {};
        this.netPlayers = {};
    }

    /** a function to emit the move event for the client
     * @emits moveEvent
     * @param {number} direction see below:
     * 8: up
     * 6: left
     * 4: right
     * 2: down
     */
    emitMoveEvent(direction) {
        this.onMoveEvent(direction);
        this.emit("moveEvent",direction);
    }

    /** does nothing by defualt, overridden by both host and client */
    onMoveEvent(direction){

    }

    /** add a new player to the list of netPlayers. */
    initializeNetPlayer(playerInfo){
        let name = playerInfo.name;
        let peerId = playerInfo.peerId;
        let actorId = playerInfo.actorId;
        this.netPlayers[peerId] = new PlayerModel(name,actorId);
        this.netPlayers[peerId].setPeerId(peerId);
    }


    initEmitterOverrides(){
        if(MATTIE.multiplayer.isActive){
            MATTIE.multiplayer.gamePlayer.override.call(this);
        }
    }

    /**
     * @description move a net player 1 tile
     * @param {*} moveData which direction on the key pad the player pressed, up/down/left/right as a number 8/6/4/2
     * @param {*} id the id of the peer who's player moved
     */
    moveNetPlayer(moveData,id){
        this.netPlayers[id].$gamePlayer.moveOneTile(moveData)
    }
}

//ignore this does nothing, just to get intellisense working. solely used to import into the types file for dev.
try {
    module.exports.BaseNetController = BaseNetController;
} catch (error) {
    module = {}
    module.exports = {}
}
module.exports.BaseNetController = BaseNetController;
