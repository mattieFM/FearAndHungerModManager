//@using peerJs from /dist/peerjs.min.js
var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
var EventEmitter = require("events");
const { hostname } = require("os");

/** @global */
class NetController extends EventEmitter {
    constructor() {
        super();
        this.self;
        this.host;
        this.hostId = undefined; //will be null if u are host
        this.name ="default"
        this.clientName = "client";
        this.hostName = "host";
        this.client;
        this.clientToHost;
        this.players = [];
        /** @type {{{<String>name:PlayerConnection}} */
        this.connections = {};
    }

    /** send to all connections */
    sendAll(data) {
        for(key in this.connections){
            this.connections[key].conn.send(data);
        }
    }

    /** send to host from client */
    sendHost(data) {
        this.clientToHost.send(data)
    }

    /** open a peer with a auto generated id */
    openPeer(){
        let peer = new Peer();
        this.self = peer;
        return peer;
    }

    /** open a peer with host logic */
    openHostPeer(){
        MATTIE.multiplayer.isHost = true;
        var host = this.openPeer();
        this.host = host;
        host.on("open", (id)=>{
            console.log(`Host Open At: ${id}`)
        })

        host.on("connection", (conn) => {            
            this.handleConnection(conn);
            if(conn.peer === this.host.id){
                this.connections[this.host.id].name = this.name;
            }
            conn.on('data', (data) => {
                console.log(data)
                this.hostDataProcessor(data, conn);
            })
         })
        return host;
    }

    /** open a peer with client logic */
    openClientPeer(){
        MATTIE.multiplayer.isClient = true;
        var client = this.openPeer();
        this.client = client;
        client.on("open", (id)=>{
            console.log(`Client Open At: ${id}`)
            const conn = client.connect(this.hostId);
            this.clientToHost = conn;
            conn.on("open", () => {
                console.log(`Client Connected to a host`)
                conn.send({"connected":this.name})
                //this.handleConnection(conn)
            })
            conn.on("data", (data) => {
                this.clientDataProcessor(data);
            })

            if(json.move){
                this.playerMovementEvent(json);
            }

            if(json.travel){
                this.playerTravelEvent(json);
            }
            
        })
        return client;
    }

    triggerPlayerListEventHost(){
        this.emit("playerList",this.getPlayerList());
    }

    hostDataProcessor(data, conn){
        var json;
        if(typeof data === 'object'){
            json = data
        }else{
            json = JSON.parse(data);
        }

        json.id = conn.peer;
        if(json.connected){
            this.playerConnectionEvent(json)
            this.triggerPlayerListEventHost();
        }
        if(json.move){
            let obj = {};
            obj.move = json.move;
            this.sendAll(obj)
            this.playerMovementEvent(json);
        }
        if(json.travel){
            let obj = {};
            obj.travel = json.travel;
            this.sendAll(obj)
            this.playerTravelEvent(json);
        }
    }

    /**
     * proforma the call back only if the json.id matches a player.id
     * @param {json event obj} json 
     * @param {(player:Game_Player)=>{}} json 
     */
    onMatchingPlayer(json, cb){
        for(key in this.players){
            if(this.players[key].id === json.id){
                cb(key)
            }
        }
    }

    playerTravelEvent(json){
        this.onMatchingPlayer(json, (key)=>{
            let netPlayer = this.players[key];
            let x = json.travel.cords.x
            let y = json.travel.cords.y
            netPlayer.setX(x)
            netPlayer.setY(y)
            netPlayer.setMap(json.travel.map)
            try {
                SceneManager._scene.createSpriteset() //update rendered players after travel
                let player =this.players[key].$gamePlayer;
                console.log(this.players)
                player.setTransparent(false);
                player.reserveTransfer(json.travel.map, x, y, 0, 0)
                player.performTransfer();
                player.update();  
        
            } catch (error) {
                console.log(error)
            }
        })
    }

    playerMovementEvent(json){
        this.onMatchingPlayer(json,(key)=>{
            try { //for now we will just use a catch to fix this, might need to beef this up later
                const move = json.move;
                let player = this.players[key]
                if(player.$gamePlayer){
                    player.$gamePlayer.setDir4(move.dir4);
                    player.$gamePlayer.moveByInput(move.command)
                    player.$gamePlayer.update(true);
                }

                
            } catch (error) {
                console.log("A Client Loaded before the host")
            }
        })
    }

    clientDataProcessor(data){
        var json;
        if(typeof data === 'object'){
            json = data
        }else{
            json = JSON.parse(data);
        }
        if(json.playerList){
            this.emit("playerList",json.playerList)
        }
        if(json.gameStarted){
            this.emit("gameStarted",json.gameStarted)
        }
    }

    /**
     * @description handle the inital peer connection.
     * @param {*} conn the connection from peerjs
     */
    handleConnection(conn){
        let id = conn.peer;
        let obj = new PlayerConnection(conn)
        this.connections[id]=obj;
    }

    /**
     * @description the event that triggers once the client has connected and sent the connect event data package
     * @param {*} data the data sent by the client upon connection
     */
    playerConnectionEvent(data){
        let id = data.id;
        if(!this.connections[id].name){//only fire on first connection
            this.setupPlayers();
            this.connections[id].setName(data.connected)
            let obj = {}
            obj.playerList = this.getPlayerList();
            this.sendAll(obj);
            this.emit("connect",data.connected) // emit the event
        }
    }

    setupPlayers(){
        for(key in this.connections){
            let id = this.connections[key].id;
            let name = this.connections[key].name;
            if(!this.players[id])
            this.players[id] = new netPlayer(id,name)
        }

    }


    /** get and set playerlist, probs should be broken into 2 but its not taht important */
    getPlayerList(){
        let players = [];
        for(key in this.connections){
            let name = this.connections[key].name;
            players.push(name)
        }

        if(this.players.length > 1){
            for(key in this.players){
                if(this.players[key].name !== this.name){
                    players.push(this.name) //will not work locally //add self if not present
                }
            }
        }else{
            players.push(this.name)
        }
        return players;
    }
}


//ignore this does nothing, just to get intellisense working. solely used to import into the types file for dev.
try {
    module.exports.NetController = NetController;
} catch (error) {
    module = {}
    module.exports = {}
}
module.exports.NetController = NetController;
