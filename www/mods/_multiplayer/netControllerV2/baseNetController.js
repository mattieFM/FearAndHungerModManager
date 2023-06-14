var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}

var EventEmitter = require("events");
class BaseNetController extends EventEmitter {
    constructor() {
        super();
        this.peerId;
        this.players = {};
        this.netPlayers = {};

        this.transferRetries = 0;
        this.maxTransferRetries = 10;
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

    /**
     *  triggers when the receiving movement data from a netPlayer
     * @param {*} moveData up/down/left/right as num 8 6 4 2
     * @param {*} id the peer id of the player who moved
     */
    onMoveData(moveData,id){
        this.moveNetPlayer(moveData,id);
    }

    /** a function to emit the move event for the client
     * @emits transferEvent
     * @param {number} direction see below:
     * 8: up
     * 6: left
     * 4: right
     * 2: down
     */
    emitTransferEvent(transferObj) {
    this.onTransferEvent(transferObj);
    this.emit("transferEvent",transferObj);
    }

    /** does nothing by defualt, should be overridden by both host and client */
    onTransferEvent(transferObj){

    }

    /**
     *  triggers when the receiving transfer data from a netPlayer
     * @param {*} transData x,y,map
     * @param {*} id the peer id of the player who moved
     */
    onTransferData(transData,id){
        this.transferNetPlayer(transData,id);
    }

    /** add a new player to the list of netPlayers. */
    initializeNetPlayer(playerInfo){
        let name = playerInfo.name;
        let peerId = playerInfo.peerId;
        let actorId = playerInfo.actorId;
        let followerIds = playerInfo.followerIds;
        this.netPlayers[peerId] = new PlayerModel(name,actorId);
        this.netPlayers[peerId].followerIds = followerIds;
        this.netPlayers[peerId].setPeerId(peerId);
    }

    /** updates net players
     * @emits updateNetPlayers
     */
    updateNetPlayers(netPlayers){
        for(key in netPlayers){
            let netPlayer = netPlayers[key];
            if(!this.netPlayers[key]) {
                this.initializeNetPlayer(netPlayer); //if this player hasn't been defined yet initialize it.
            }else{
                this.netPlayers[key] = Object.assign(this.netPlayers[key], netPlayer) //replace any files that conflict with new data, otherwise keep old data.
            }
        }
    }

    updateNetPlayer(playerInfo){
        let obj = {};
        obj[playerInfo.peerId] = playerInfo;
        this.updateNetPlayers(obj)
    }

    updateNetPlayerFollowers(playerInfo){
        if(playerInfo.peerId){
            let netPlayer = this.netPlayers[playerInfo.peerId];
            if(netPlayer) netPlayer.setFollowers(playerInfo.followerIds)
        }else{
            for(key in playerInfo){
                let player = playerInfo[key];
                let netPlayer = this.netPlayers[player.peerId];
                if(netPlayer) netPlayer.setFollowers(player.followerIds)
            }
        }
        
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
        try {
            this.netPlayers[id].$gamePlayer.moveOneTile(moveData)
        } catch (error) {
            console.warn('something went wrong when moving the character' + error)
        }
        
    }


    updatePlayerInfo(){
        var actor = $gameParty.leader();
        this.player.getFollowers();

        if(this.player.actorId !== actor.actorId)
        this.player.setActorId(actor.actorId());

        //update host/client about the new actor id /follower
        this.sendPlayerInfo();
    }
    

     /**
     * @description transfer a net player to a location
     * @param {*} transData x,y,map
     * @param {*} id the id of the peer who's player moved
     */
     transferNetPlayer(transData,id){
        if(this.transferRetries <= this.maxTransferRetries){
        try {
            let x = transData.x;
            let y = transData.y;
            let map = transData.map;
            this.netPlayers[id].setMap(map);
            try {
                SceneManager._scene.updateCharacters();
                try {
                    this.netPlayers[id].$gamePlayer.reserveTransfer(map, x, y, 0, 0)
                    this.netPlayers[id].$gamePlayer.performTransfer(); 
                } catch (error) {
                    console.warn('player was not on the map when transfer was called')
                }

            } catch (error) {
                console.warn('createSprites was called not on scene_map:')
                this.transferRetries++;
                setTimeout(() => {
                    this.transferNetPlayer(transData,id)
                }, 500);
            }
            
            
        } catch (error) {
            console.warn('something went wrong when transferring the character:' + error)
        }
    }else{
        this.transferRetries=0;
    }
        
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
