var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
var EventEmitter = require("events");
class BaseNetController extends EventEmitter {
    constructor() {
        super();
        this.peerId;
        
        this.players = {};
        /** @type {[PlayerModel]} */
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
    emitMoveEvent(direction,x=undefined,y=undefined,transfer=false) {
        this.onMoveEvent(direction,x,y,transfer);
        this.emit("moveEvent",direction,x,y,transfer);
    }

    /** does nothing by defualt, overridden by both host and client */
    onMoveEvent(direction,x=undefined,y=undefined,transfer=false){

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
        if(moveData.x){
            if(moveData.t){
                moveData.map = $gameMap.mapId();
                this.transferNetPlayer(moveData,id);
            }else{
                this.netPlayers[id].$gamePlayer._x = moveData.x;
                this.netPlayers[id].$gamePlayer._y = moveData.y;
            }
            //moveData.map = $gameMap.mapId();
            
            //this.transferNetPlayer(moveData,id);
        }else{
            try {
                this.netPlayers[id].$gamePlayer.moveOneTile(moveData.d)
            } catch (error) {
                console.warn('something went wrong when moving the character' + error)
            }
        }
        
        
    }


    updatePlayerInfo(){
        var actor = $gameParty.leader();
        this.player.getFollowers();

        if(this.player.actorId !== actor.actorId())
        this.player.setActorId(actor.actorId());

        //update host/client about the new actor id /follower
        this.sendPlayerInfo();
    }

        /** @emits eventMoveEvent */
        emitEventMoveEvent(event){
            this.onEventMoveEvent(event);
            this.emit("eventMoveEvent")
        }
    
        onEventMoveEvent(event){
            let obj = {};
                obj.event = event;
            this.sendEventMoveEvent(obj);
        }

        onEventMoveEventData(eventData){
            /** @type {Game_Event} */
            let event = $gameMap.event(eventData.id);
            if(event){
                if(Math.abs(event._x - eventData.x) > 2 || Math.abs(event._y - eventData.y) > 2){
                    //event.processMoveCommand(eventData,false,true);
                    event.setTransparent(false)
                    event._x = eventData.x;
                    event._y = eventData.y;
                    event._realX = eventData.realX
                    event._realY = eventData.realY
                    event.update()
                } 
                event.moveStraight(eventData.d,true)
            }
            

            
           
        }

        sendEventMoveEvent(event){

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

    onCtrlSwitchData(ctrlSwitch,id){
        if(MATTIE.multiplayer.devTools.eventLogger)console.log("on ctrl switch data")
        let index = ctrlSwitch.i;
        let val = ctrlSwitch.b;
        let s = ctrlSwitch.s;
        if(MATTIE.multiplayer.devTools.eventLogger){console.log(index,val);}
        if(s==0){
            $gameSwitches.setValue(index, val, true);
        } else if(s==1) {
            $gameSelfSwitches.setValue(index, val);
        } else if(s==2) {
            $gameVariables.setValue(index, val,true);
        }
        //this.sendSwitchEvent(ctrlSwitch,[id]);
        //TODO: host forward on switch events to other clients

    }


    /** @emits commandEvent */
    emitCommandEvent(cmd){
        let obj = {};
        obj.cmd = cmd;
        this.onCommandEvent(obj)
        this.emit("commandEvent", cmd)
    }

    onCommandEvent(obj){
        this.sendCommandEvent(obj);
    }

    sendCommandEvent(obj){

    }

    /** the cmd object */
    onCmdEventData(cmd, peerId){
        //if(MATTIE.multiplayer.devTools.cmdLogger)
        console.log(`${cmd.code} called in data event`)
        /** @type {Game_Event} */
        const event = $gameMap.event(cmd.eventId);
        if(event._interpreter)
        event._interpreter.executeCommand(cmd);
        else{
            $gameMap._interpreter.executeCommandFromParam(cmd);
        }

        //TODO: host forward on event data events to other clients
        
    }


    /** @emits ctrlSwitch */
    emitSwitchEvent(ctrlSwitch){
        let obj = {};
        obj.ctrlSwitch = ctrlSwitch
        this.onSwitchEvent(obj)
        this.emit("ctrlSwitch", obj)
    }

    onSwitchEvent(obj){
        this.sendSwitchEvent(obj);
    }

    sendSwitchEvent(obj){

    }
}

//ignore this does nothing, just to get intellisense working. solely used to import into the types file for dev.
try {
    module.exports.BaseNetController = BaseNetController;
} catch (error) {
    module = {}
    module.exports = {}
}


MATTIE.multiplayer.createGameObj = DataManager.createGameObjects;
DataManager.createGameObjects = function(){
    MATTIE.multiplayer.createGameObj.call(this);
    try {
        MATTIE.multiplayer.getCurrentNetController().player.$gamePlayer = $gamePlayer;
    } catch (error) {
        
    }
    
}

MATTIE.multiplayer.extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    MATTIE.multiplayer.extractSaveContents.call(this,contents);
    try {
        MATTIE.multiplayer.getCurrentNetController().player.$gamePlayer = $gamePlayer;
    } catch (error) {
        
    }
}









module.exports.BaseNetController = BaseNetController;


