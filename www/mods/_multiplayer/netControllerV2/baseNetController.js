var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};

MATTIE.multiplayer.emittedInit = false;
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

        this.canTryToReconnect = false;
    }

    
    disconnectAllConns(){
        this.canTryToReconnect = true;
        if(this.self){
            this.self.disconnect();
        }
        // if(this.conn){
        //     this.conn.disconnect();
        // }
    }

    reconnectAllConns(){
        if(this.self){
            this.self.reconnect();
        }
        this.setIsClient();
        // if(this.conn){
        //     this.conn.reconnect();
        // }
    }

    resetNet(){
        this.clearPeerId();
        this.clearControlVars();
        this.destroyAllConns();
    }

    destroyAllConns(){
        if(this.self){
            this.self.destroy();
        }
        if(this.conn){
            this.conn.destroy();
        }
    }

    clearPeerId(){
        this.peerId = null;
    }

    clearControlVars(){
        MATTIE.multiplayer.isClient = false;
        MATTIE.multiplayer.isHost = false;
        MATTIE.multiplayer.isActive = false;
    }

    setIsHost(){
        MATTIE.multiplayer.isActive = true;
        MATTIE.multiplayer.isClient = false;
        MATTIE.multiplayer.isHost = true;
    }

    setIsClient(){
        MATTIE.multiplayer.isActive = true;
        MATTIE.multiplayer.isHost = false;
        MATTIE.multiplayer.isClient = true;
    }

    /**
     * @description send a json object to the main connection.
     * For host this will send to all, for client this will send to host.
     * this is left blank intentionally as it is overridden by host and client
     * @param {*} obj the object to send
     */
    sendViaMainRoute(obj){

    }

    /**
     * @description a function that will preprocess the data for onData, before it is read/
     * this is overridden by host and client
     * @param data the data that was sent
     * @param conn the connection that is sending the data
     */
    preprocessData(data, conn){
        
    }

    /**
     * @description the main controller receiving data
     * @param data the data obj
     * @param conn the connection object
     */
    onData(data, conn){
        data = this.preprocessData(data,conn);
        let id = data.id;
        if(data.updateNetPlayers){//only used by client
            this.onUpdateNetPlayersData(data.updateNetPlayers);
        }
        if(data.playerInfo && MATTIE.multiplayer.isHost){ //only used by host
            this.onPlayerInfoData(data.playerInfo);
        }
        if(data.startGame){ //only used by client
            this.onStartGameData(data.startGame)
        }
        if(data.syncedVars){ //used only by client
            this.onUpdateSyncedVarsData(data.syncedVars);
        }
        if(data.syncedSwitches){
            this.onUpdateSyncedSwitchData(data.syncedSwitches);
        }
        if(data.requestedVarSync){ //used only by host 
            this.emitUpdateSyncedVars();
        }
        if(data.move){
            this.onMoveData(data.move, id);
        }
        if(data.transfer){
            this.onTransferData(data.transfer,id)
        }
        if(data.ctrlSwitch){
            if(SceneManager._scene.isActive())
            this.onCtrlSwitchData(data.ctrlSwitch, id)
        }
        if(data.cmd) {
            if(SceneManager._scene.isActive())
            this.onCmdEventData(data.cmd,data.id)
        }
        if(data.event){
            if(SceneManager._scene.isActive())
            this.onEventMoveEventData(data.event)
        }
        if(data.battleStart){
            this.onBattleStartData(data.battleStart, id);
        }
        if(data.battleEnd){
            this.onBattleEndData(data.battleEnd, id);
        }
        if(data.ready){
            this.onReadyData(data.ready, id);
        }

        if(data.turnEnd){
            this.onTurnEndData(data.turnEnd, id);
        }
        if(data.equipChange){
            this.onEquipmentChangeData(data.equipChange,id);
        }
        if(data.spawnEvent){
            this.onEventSpawn(data.spawnEvent,data.id);
        }
        if(data.transformEnemy){
            this.onTransformEventData(data.transformEnemy,data.id);
        }
        if(data.appearEnemy){
            this.onAppearEnemyEventData(data.appearEnemy,data.id);
        }
        if(data.enemyState){
            this.onEnemyStateEventData(data.enemyState,data.id)
        }
        if(data.saveEvent){
            this.onSaveEventData();
        }
    }

    //-----------------------------------------------------
    //Turn End Event
    //-----------------------------------------------------

    /**
     * 
     * @description emit the turnend event, sending data to connected peers.
     * @param enemyHps {int[]} an array of ints corrispoding to the enemy hps
     *  @param enemyHps {int[][]} an array of arrays of ints which are the state ids of the enemies
     * @emits turnend
     */
    emitTurnEndEvent(enemyHps,enemyStates,actorData){
        var obj = {};
        obj.turnEnd = {};
        obj.turnEnd.enemyHps = enemyHps;
        obj.turnEnd.enemyStates = enemyStates;
        obj.turnEnd.actorData = actorData;
        console.log(obj)
        this.emit("turnend")
        this.sendViaMainRoute(obj);
    }

    /**
     * 
     * @param {*} data the turnEnd obj, for now just contains an array of enemy healths
     */
    onTurnEndData(data, id){
        if($gameTroop.getIdsInCombatWithExSelf().includes(id)){
            let enemyHealthArr = data.enemyHps;
            let actorDataArr = data.actorData;
            let actorHealthArr = actorDataArr.map(data=>data.hp);
            let enemyStatesArr = data.enemyStates;
            this.syncActorData(actorDataArr, id)
            this.syncEnemyHealths(enemyHealthArr);
            this.syncEnemyStates(enemyStatesArr);
            setTimeout(() => {
                BattleManager.doneSyncing(); //done syncing  
            }, MATTIE.multiplayer.combatEmitter.minSyncTime);
            
        }   
    }

    syncActorData(actorDataArr, partyId){
        
        let party = this.netPlayers[partyId].battleMembers();
        for (let index = 0; index < actorDataArr.length; index++) {
            /**@type {Game_Actor} */
            let actor = party[index]
            const actorData = actorDataArr[index];
            const newActorHealth = actorData.hp;
            const newActorMana = actorData.mp;
            if(actor.hp > newActorHealth){
                actor.performDamage();
            }
            actor.setHp(newActorHealth)
            actor.setMp(newActorMana)
        }
    }

    syncEnemyStates(enemyStatesArr){
        for (let index = 0; index < $gameTroop._enemies.length; index++) {
            const enemy = $gameTroop._enemies[index];
            let netStates = enemyStatesArr[index];
                netStates.forEach(state => {
                    if(!enemy.isStateAffected(state)){
                        $gameTroop._enemies[index].addState(state);
                    }
                });
           
        }
    }

    syncEnemyHealths(enemyHealthArr){
        for (let index = 0; index < $gameTroop._enemies.length; index++) {
            const enemy = $gameTroop._enemies[index];
            if(enemy){
                let orgHp = enemy._hp;
                $gameTroop._enemies[index].setHp(Math.min(enemy._hp,enemyHealthArr[index]));
                if(orgHp > 0 && enemy._hp <= 0) {
                    let ids = $gameTroop.getIdsInCombatWithExSelf();
                    if(ids){
                        if(ids.length > 0){
                            this.netPlayers[ids[parseInt(Math.random()*ids.length)]].battleMembers()[0].performAttack();
                        }
                    }
                    
                    enemy.addState(enemy.deathStateId());
                    enemy.performCollapse();
                    enemy.hide();
                }
            }
            

           
        }
    }

    //-----------------------------------------------------
    //Ready Event
    //-----------------------------------------------------


    /**
     * @description trigger the ready event. This event is called when a player enters the ready state in combat.
     * @param {Game_Action[]} an array of the actions that the player has entered.
     * @emits ready
     */
    emitReadyEvent(actions){
        this.emit("ready")
        var obj = {};
        obj.ready = {};
        obj.ready.val = true;
        obj.ready.actions = actions;
        obj.ready.isExtraTurn = Galv.EXTURN.active;
        $gameTroop.setReadyIfExists(MATTIE.multiplayer.getCurrentNetController().peerId,1);  //set the player as ready in combat arr
        this.sendViaMainRoute(obj)
    }

    /**
     * @description trigger the unready event. This event is called when a player exits the ready state in combat.
     * @emits unready
     */
    emitUnreadyEvent(){
        this.emit("unready")
        var obj = {};
        obj.ready = {};
        obj.ready.val = false;
        obj.ready.isExtraTurn = Galv.EXTURN.active;
        $gameTroop.setReadyIfExists(MATTIE.multiplayer.getCurrentNetController().peerId,0); //set the player as unready in combat arr
        this.sendViaMainRoute(obj)
    }

    /**
     * @description handles logic for readying and unreadying in combat. 
     * @param {*} readyObj the net obj for the ready event
     * @param {*} senderId the sender's id
     */
    onReadyData(readyObj, senderId){
        let val = readyObj.val;
        let isExtraTurn = readyObj.isExtraTurn;
        let id = senderId;
        if(MATTIE.multiplayer.currentBattleEvent){
            MATTIE.multiplayer.currentBattleEvent.setReadyIfExists(id,val); //set the player as unready in combat arr @legacy
            $gameTroop.setReadyIfExists(id,val,isExtraTurn); //set the player as unready in combat arr <- this one is actually used
            if(val===false)console.log("net unready recived")
        }
            

        if(readyObj.actions){
            let actions = JSON.parse(readyObj.actions);
            actions.forEach(action => {
                if(action){
                    /** @type {Game_Actor} */
                    let actor = this.netPlayers[senderId].$netActors.baseActor(action._subjectActorId);
                    if(action.netPartyId){
                        if(action.netPartyId != this.peerId){
                            action.forcedTargets = [];
                            let targetedNetParty = this.netPlayers[action.netPartyId].battleMembers()
                            action.forcedTargets.push(targetedNetParty[action._targetIndex])
                            action._netTarget = action.netPartyId;
                        }
                    }
                    actor.partyIndex = ()=>this.netPlayers[senderId].battleMembers().indexOf(actor); //set the party index function
                    actor.setCurrentAction(action);
                    BattleManager.addNetActionBattler(actor,isExtraTurn);
                }
                
            });
        }
        
        
        
    }


    //-----------------------------------------------------
    //Move Event
    //-----------------------------------------------------

    /** 
     * @descriptiona function to emit the move event for the client
     * @emits moveEvent
     * @param {number} direction see below:
     * 8: up
     * 6: left
     * 4: right
     * 2: down
     */
    emitMoveEvent(direction,x=undefined,y=undefined,transfer=false) {
        this.emit("moveEvent",direction,x,y,transfer);
        let obj = {};
        obj.move = {};
        obj.move.d = direction;
        if(x){
            obj.move.x = x;
            obj.move.y = y;
        }
        if(transfer){
            obj.move.t=true
        }
        this.sendViaMainRoute(obj)
    }

    /**
     *  triggers when the receiving movement data from a netPlayer
     * @param {*} moveData up/down/left/right as num 8 6 4 2
     * @param {*} id the peer id of the player who moved
     */
    onMoveData(moveData,id){
        this.moveNetPlayer(moveData,id);
    }

    /**
     * @description move a net player 1 tile
     * @param {*} moveData which direction on the key pad the player pressed, up/down/left/right as a number 8/6/4/2
     * @param {*} id the id of the peer who's player moved
     */
    moveNetPlayer(moveData,id){
        if(this.netPlayers[id].map ===$gameMap.mapId()){//only call if on same map
            if(moveData.x){
                let dist =Math.sqrt((moveData.x - $gamePlayer._x)**2 + (moveData.y -$gamePlayer._y)**2);
                if(moveData.t){
                    moveData.map = $gameMap.mapId();
                    this.transferNetPlayer(moveData,id,false);
                }else{
                    
                    if(dist > 4){
                        moveData.map = $gameMap.mapId();
                        this.transferNetPlayer(moveData,id,false);
                    }else if (dist > 2){
                        this.netPlayers[id].$gamePlayer._x = moveData.x;
                        this.netPlayers[id].$gamePlayer._y = moveData.y;
                    }
                    
                }
            }else{
                try {
                    this.netPlayers[id].$gamePlayer.moveOneTile(moveData.d)
                } catch (error) {
                    console.warn('something went wrong when moving the character' + error)
                }
            }
        } else{ //if player not on map update pos ONLY
            if(moveData.x){ 
                this.netPlayers[id].$gamePlayer._x = moveData.x; //update pos only
                this.netPlayers[id].$gamePlayer._y = moveData.y; //update pos only
            }
        }
        
        
        
    }


    //-----------------------------------------------------
    //Transfer Event
    //-----------------------------------------------------

    /** a function to emit the move event for the client
     * @emits transferEvent
     * @param {number} direction see below:
     * 8: up
     * 6: left
     * 4: right
     * 2: down
     */
    emitTransferEvent(transferObj) {
        this.emit("transferEvent",transferObj);
        this.sendViaMainRoute(transferObj)
    }

    /**
     *  triggers when the receiving transfer data from a netPlayer
     * @param {*} transData x,y,map
     * @param {*} id the peer id of the player who moved
     */
    onTransferData(transData,id){
        this.transferNetPlayer(transData,id);
    }


         /**
     * @description transfer a net player to a location
     * @param {*} transData x,y,map
     * @param {*} id the id of the peer who's player moved
     */
         transferNetPlayer(transData,id,shouldSync=true){
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
                        this.netPlayers[id].$gamePlayer.performTransfer(shouldSync); 
                    } catch (error) {
                        console.warn('player was not on the map when transfer was called')
                    }
    
                } catch (error) {
                    console.warn('createSprites was called not on scene_map:')
                    this.transferRetries++;
                    setTimeout(() => {
                        this.transferNetPlayer(transData,id,shouldSync)
                    }, 500);
                }
                
                
            } catch (error) {
                console.warn('something went wrong when transferring the character:' + error)
            }
        }else{
            this.transferRetries=0;
        }
            
        }




    //-----------------------------------------------------
    //Battle Start Event
    //-----------------------------------------------------

    /**
     * @description send the battle start event to connections
     * @param {*} eventId the id of the event tile the battle was triggered from 
     * @param {*} mapId the id of the map that that tile is on
     * @param {*} troopId the troop id that the player is now incombat with
     */
    emitBattleStartEvent(eventId,mapId,troopId){
        var obj = {};
        obj.battleStart = {};
        obj.battleStart.eventId = eventId;
        obj.battleStart.mapId = mapId;
        obj.battleStart.troopId = troopId;
        MATTIE.multiplayer.currentBattleEnemy = obj.battleStart;
        MATTIE.multiplayer.currentBattleEvent = $gameMap.event(eventId);
        this.emit("battleStartEvent", obj);
        this.sendViaMainRoute(obj);
        this.emitChangeInBattlersEvent(this.formatChangeInBattleObj(obj.eventId,obj.mapid,this.peerId));
        $gameMap.event(obj.battleStart.eventId).addIdToCombatArr(this.peerId)
        this.battleStartAddCombatant(obj.battleStart.troopId, this.peerId);
        MATTIE.emitTransfer(); //emit transfer event to make sure player is positioned correctly on other players screens
       
    }

    onBattleStartData(battleStartObj, id){ //take the battleStartObj and set that enemy as "in combat" with id
        this.battleStartAddCombatant(battleStartObj.troopId,id);

        //handle all logic needed for the event tile 
        if(battleStartObj.mapId == $gameMap.mapId()){//event tile tracking can only be done on same screen
            if(MATTIE.multiplayer.devTools.battleLogger) console.info("net event battle start --on enemy host");
            var event = $gameMap.event(battleStartObj.eventId);
            event.addIdToCombatArr(id);
            event.lock();
        }    
        this.emitChangeInBattlersEvent(this.formatChangeInBattleObj(battleStartObj.eventId,battleStartObj.mapid,id));
}

    /** called whenever anyone enters or leaves a battle, contains the id of the player and the battle */
    emitChangeInBattlersEvent(obj){
        this.emit("battleChange",obj)
    }

    formatChangeInBattleObj(eventid,mapid,peerid){
        var obj = {};
        obj.eventId = eventid;
        obj.mapId = mapid;
        obj.peerId = peerid;
        return obj;
    }

    /**
     * @description removes a combatant to the gameTroop's combat arr. This matches based on name and id, this is to help with some of the spegetti that the dev does with battle events
     * @param {*} troopId  
     * @param {*} id 
     */
    battleEndRemoveCombatant(troopId,id){
        
        let troopName = $dataTroops[troopId].name;
        
        $dataTroops.forEach(element => {
            if(element){
                if(element.name === troopName){
                    if(element._combatants){
                        delete element._combatants[id];
                    }
                }
        }
        });
        
        $gameTroop.removeIdFromCombatArr(id);
        if($dataTroops[troopId]._combatants){
            delete $dataTroops[troopId]._combatants[id];
        }
    }

     /**
     * @description adds a combatant to the gameTroop's combat arr. This matches based on name and id, this is to help with some of the spegetti that the dev does with battle events
     * @param {*} troopId  
     * @param {*} id 
     */
    battleStartAddCombatant(troopId,id){
        let troopName = $dataTroops[troopId].name;
        $dataTroops.forEach(element => {
            if(element){
                if(element.name === troopName){
                    if(element._combatants){
                        element._combatants[id] = {};
                        element._combatants[id].bool = 0
                        element._combatants[id].isExtraTurn = 0
                    }else{
                        element._combatants = {};
                        element._combatants[id] = {};
                        element._combatants[id].bool = 0
                        element._combatants[id].isExtraTurn = 0
                    }
                }
        }

        });

        if($gameTroop.name == troopName){
            $gameTroop.addIdToCombatArr(id)
        }

        if($gameTroop._troopId == troopId){
            $gameTroop.addIdToCombatArr(id)
        } else { 
            if($dataTroops[troopId]._combatants){
                $dataTroops[troopId]._combatants[id] = {};
                $dataTroops[troopId]._combatants[id].bool = 0
                $dataTroops[troopId]._combatants[id].isExtraTurn = 0
            }else{
                $dataTroops[troopId]._combatants = {};
                $dataTroops[troopId]._combatants[id] = {};
                $dataTroops[troopId]._combatants[id].bool = 0
                $dataTroops[troopId]._combatants[id].isExtraTurn = 0
            }
        }
    }



    //-----------------------------------------------------
    //Battle End Event
    //-----------------------------------------------------

    /**
     * a function to emit the battle end event
     * @param {int} troopId the id of the troop
     * @param {obj} enemy the net obj for an enemy
     */
    emitBattleEndEvent(troopId, enemy){
        var obj = {};
        obj.battleEnd = enemy;
        obj.battleEnd.troopId = troopId;
        this.emit("battleEndEvent", obj);
        this.emitChangeInBattlersEvent(this.formatChangeInBattleObj(obj.eventId,obj.mapid,this.peerId));
        $gameMap.event(obj.battleEnd.eventId).removeIdFromCombatArr(this.peerId);
        this.battleEndRemoveCombatant(obj.battleEnd.troopId,this.peerId);
        
        this.sendViaMainRoute(obj);
    }

    onBattleEndData(battleEndObj, id){ //take the battleEndObj and set that enemy as "out of combat" with id
        this.battleEndRemoveCombatant(battleEndObj.troopId, id);

        //handle all logic needed for the event tile 
            if(battleEndObj.mapId == $gameMap.mapId()){//event tile tracking can only be done on same screen
                if(MATTIE.multiplayer.devTools.enemyHostLogger) console.debug("net event battle end --on enemy host");
                console.debug("net player left event");
                var event = $gameMap.event(battleEndObj.eventId);
                event.removeIdFromCombatArr(id);
                
                if(!event.inCombat()) setTimeout(() => event.unlock(), MATTIE.multiplayer.runTime);
                else event.lock();
            }    
            this.emitChangeInBattlersEvent(this.formatChangeInBattleObj(battleEndObj.eventId,battleEndObj.mapid,id));
    }


    //-----------------------------------------------------
    //Update Net Players Event
    //-----------------------------------------------------

    /** 
     * handle when the host sends an updated list of netplayers
     * @emits updateNetPlayers
     */
    onUpdateNetPlayersData(netPlayers){
        console.log("update net players")
        this.updateNetPlayers(netPlayers)
        this.updateNetPlayerFollowers(netPlayers);
        this.emit('updateNetPlayers', netPlayers);
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
            if(netPlayer) netPlayer.setFollowers(playerInfo.followerIds);
        }else{
            for(key in playerInfo){
                let player = playerInfo[key];
                let netPlayer = this.netPlayers[player.peerId];
                if(netPlayer) netPlayer.setFollowers(player.followerIds)
            }
        }
        
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
        if(!this.netPlayers[peerId].$gamePlayer){
            this.netPlayers[peerId].initSecondaryGamePlayer();
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
            this.sendViaMainRoute(obj);
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
    


    //-----------------------------------------------------
    // Control Switch Event
    //-----------------------------------------------------
    
    
    /** @emits ctrlSwitch */
    emitSwitchEvent(ctrlSwitch){
        let obj = {};
        obj.ctrlSwitch = ctrlSwitch
        this.sendViaMainRoute(obj)
        this.emit("ctrlSwitch", obj)
    }

    
    onCtrlSwitchData(ctrlSwitch,id){
        if(MATTIE.multiplayer.devTools.eventLogger)console.debug("on ctrl switch data")
        let index = ctrlSwitch.i;
        let val = ctrlSwitch.b;
        let s = ctrlSwitch.s;
        if(MATTIE.multiplayer.devTools.eventLogger){console.debug(index,val);}
        if(s==0){
            $gameSwitches.setValue(index, val, true);
        } else if(s==1) {
            if(MATTIE.multiplayer.varSyncer.syncedOnce) //self switches only update if vars are synced, this fixes menus.
            $gameSelfSwitches.setValue(index, val, true);
        } else if(s==2) {
            if(MATTIE.multiplayer.devTools.varLogger)
            console.log("NetPlayer Set " + index + " to " + val)
            $gameVariables.setValue(index, val, true);
        }
    }

    //-----------------------------------------------------
    // Update Random Vars Event
    //-----------------------------------------------------

    /**
     * @hostOnly this should only be used by the host
     * @description send the local synced vars to connection
     * @param {{id:val}[]} syncedVars an array of key pair values of variables
     * @emits randomVars
     */
    emitUpdateSyncedVars(){
        console.log("host var sync sent")
        let obj = {};
        obj.syncedVars = {};
        obj.syncedSwitches = {};
        MATTIE.static.variable.syncedVars.forEach(id=>{
            obj.syncedVars[id] = $gameVariables.value(id);
        })

        MATTIE.static.variable.secondarySyncedVars.forEach(id=>{
            obj.syncedVars[id] = $gameVariables.value(id);
        })

        MATTIE.static.switch.syncedSwitches.forEach(id=>{
            obj.syncedSwitches[id] = $gameSwitches.value(id);
        })
        this.sendViaMainRoute(obj)
        this.emit("randomVars", obj)
    }

    /**
     * @description used by the client to request vars to be synced
     * @emits requestedVarSync
     */
    emitRequestedVarSync(){
        console.log("client  var sync requested")
        let obj = {};
        obj.requestedVarSync = 1;
        this.sendViaMainRoute(obj);
        this.emit("requestedVarSync")

    }

    /**
     * @description process the data for synced var updates
     * @param {{id:val}[]} syncedVars an array of key pair values
     */
    onUpdateSyncedVarsData(syncedVars){
        console.log("client vars synced")
        Object.keys(syncedVars).forEach(id=>{
            let val = syncedVars[id];
            $gameVariables.setValue(id,val,true); //last var as true to skip net broadcast
        })
    }

     /**
     * @description process the data for synced var updates
     * @param {{id:val}[]} syncedSwitch an array of key pair values
     */
     onUpdateSyncedSwitchData(syncedSwitch){
        console.log("client vars synced")
        Object.keys(syncedSwitch).forEach(id=>{
            let val = syncedSwitch[id];
            $gameSwitches.setValue(id,val,true); //last var as true to skip net broadcast
        })
    }

    //-----------------------------------------------------
    // Command Event
    //-----------------------------------------------------

    /** @emits commandEvent */
    emitCommandEvent(cmd){
        let obj = {};
        obj.cmd = cmd;
        this.sendViaMainRoute(obj);
        this.emit("commandEvent", cmd)
    }


    /** the cmd object */
    onCmdEventData(cmd, peerId){
        try {
            if(MATTIE.multiplayer.devTools.cmdLogger)
            console.debug(`${cmd.code} called in data event`)
            /** @type {Game_Event} */
            const event = $gameMap.event(cmd.eventId);
            if(event._interpreter)
            event._interpreter.executeCommand(cmd);
            else{
                $gameMap._interpreter.executeCommandFromParam(cmd);
            } 
        } catch (error) {
            
        } 
    }

    //-----------------------------------------------------
    // Equipment Change Event
    //-----------------------------------------------------
    /**
     * @description emits the event for changing equipment
     * @emits equipChange 
     * */
    emitEquipmentChange(actorId,itemSlot,itemId){
        let obj = {};
        obj.equipChange = {};
        obj.equipChange.actorId = actorId;
        obj.equipChange.itemSlot = itemSlot;
        obj.equipChange.itemId = itemId;
        this.sendViaMainRoute(obj);
        this.emit("equipChange", obj)
    }

    /**
     * @description updates the given net party's actor's equipment
     * @param {*} equipChangeObj the net obj for equip change
     */
    onEquipmentChangeData(equipChangeObj, id){
        console.log('equip chane data')
        let actorId = equipChangeObj.actorId;
        let itemSlot = equipChangeObj.itemSlot;
        let itemId = equipChangeObj.itemId;
        console.log(this.netPlayers[id].$netActors.length());
        let actor =this.netPlayers[id].$netActors.baseActor(actorId);
        if(actor){
            if(itemSlot === 0){
                actor.forceChangeEquip(itemSlot,$dataWeapons[itemId],true);
            }else{
                actor.forceChangeEquip(itemSlot,$dataArmors[itemId],true);
            }
        }
        
        
    }

    //-----------------------------------------------------
    // Spawned events (handles item drops and any event spawned at run time)
    //-----------------------------------------------------

    /**
     * @emits spawnEvent
     * @param {*} data data of the event
     */
    emitEventSpawn(data){
        let obj = {};
        obj.spawnEvent = data;
        this.sendViaMainRoute(obj);
        this.emit("spawnEvent", obj)
    }


    
    /**
     * 
     * @param {*} data event net obj
     * @param id unused
     */
    onEventSpawn(data,id){
        let event = new MapEvent();
        event.data = data;
        try {
            event.spawn(data.x,data.y, true);
        } catch (error) {
            // setTimeout(() => {
            //     this.onEventSpawn(data,id)
            // }, 1000);
        }
        
    }

    //-----------------------------------------------------
    //Transform Event
    //-----------------------------------------------------

    /**
     * @description emit the transform enemy event
     * @emits transformEnemy
     * @param {*} enemyIndex the index of the enemy to transform
     * @param {*} transformIndex the transform index
     */
    emitTransformEvent(enemyIndex,transformIndex){
        let obj = {};
        obj.transformEnemy = {};
        obj.transformEnemy.enemyIndex = enemyIndex;
        obj.transformEnemy.transformIndex = transformIndex
        this.sendViaMainRoute(obj);
        this.emit("transformEnemy");
    }

    /**
     * @description transform an enemy based on net event
     * @param {*} enemyTransformObj the net obj for enemy transform
     * @param {*} id sender id, make sure local player is in combat with this troop before doing anything
     */
    onTransformEventData(enemyTransformObj,id){
        if($gameTroop.getIdsInCombatWithExSelf().includes(id)){
            let enemyIndex = enemyTransformObj.enemyIndex;
            let transformIndex = enemyTransformObj.transformIndex;
            MATTIE.multiplayer.enemyCommandEmitter.transformEnemy(enemyIndex, transformIndex);
        }
    }

    //-----------------------------------------------------
    //Enemy Appear Event
    //-----------------------------------------------------

    /**
     * @description emit the transform enemy event
     * @emits appearEnemy
     * @param {*} enemyIndex the index of the enemy to appear
     */
    emitAppearEnemyEvent(enemyIndex){
        let obj = {};
        obj.appearEnemy = {};
        obj.appearEnemy.enemyIndex = enemyIndex;
        this.sendViaMainRoute(obj);
        this.emit("appearEnemy");
    }

    /**
     * @description appear an enemy based on net event
     * @param {*} enemyAppearObj the net obj for enemy transform
     * @param {*} id sender id, make sure local player is in combat with this troop before doing anything
     */
    onAppearEnemyEventData(enemyAppearObj,id){
        if($gameTroop.getIdsInCombatWithExSelf().includes(id)){
            let enemyIndex = enemyAppearObj.enemyIndex;
            MATTIE.multiplayer.enemyCommandEmitter.appearEnemy(enemyIndex);
        }
    }

    //-----------------------------------------------------
    //Enemy Add State Event
    //-----------------------------------------------------

    /**
     * @description emit the state enemy event
     * @emits enemyState
     * @param {int} enemyIndex the index of the enemy to appear
     * @param {bool} addState add or remove the state
     * @param {int} stateId the state id
     */
    emitEnemyStateEvent(enemyIndex, addState,stateId ){
        let obj = {};
        obj.enemyState = {};
        obj.enemyState.enemyIndex = enemyIndex;
        obj.enemyState.addState = addState;
        obj.enemyState.stateId = stateId;
        this.sendViaMainRoute(obj);
        this.emit("enemyState");
    }

    /**
     * @description change enemy state based on net eobj
     * @param {*} enemyStateObj the net obj for enemy state event
     * @param {*} id sender id, make sure local player is in combat with this troop before doing anything
     */
    onEnemyStateEventData(enemyStateObj,id){
        if($gameTroop.getIdsInCombatWithExSelf().includes(id)){
            let enemyIndex = enemyStateObj.enemyIndex;
            let addState = enemyStateObj.addState;
            let stateId = enemyStateObj.stateId;
            MATTIE.multiplayer.enemyCommandEmitter.stateChange(enemyIndex, addState, stateId)
        }
    }

    //-----------------------------------------------------
    // Save Event
    //-----------------------------------------------------

    /**
     * @description used for syncing saves
     * @emits saveEvent
     */
    emitSaveEvent(){
        if(MATTIE.multiplayer.params.syncSaves){
            let obj = {};
            obj.saveEvent = 1;
            this.emit("saveEvent");
            this.sendViaMainRoute(obj)
        }
    }

    /**
     * @description open save menu
     */
    onSaveEventData(){
        let prevFunc = Scene_Save.prototype.helpWindowText;
        Scene_Save.prototype.helpWindowText = () => "An ally trigged a save. Please choose a slot to save."
        Game_Interpreter.prototype.command352();
        setTimeout(() => { 
            //we are changing the getter for a few seconds just to retrive a string once and then go back to normal
            //this is easier than properly extending.
            Scene_Save.prototype.helpWindowText = prevFunc;
        }, 2000);
    }


    //-----------------------------------------------------
    // MISC
    //-----------------------------------------------------


    initEmitterOverrides(){
        if(MATTIE.multiplayer.isActive && !MATTIE.multiplayer.emittedInit ){
            MATTIE.multiplayer.emittedInit = true;
            MATTIE.multiplayer.gamePlayer.override.call(this);
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

