//@using peerJs from /dist/peerjs.min.js
var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
var EventEmitter = require("events");

/** @global */
class NetController extends EventEmitter {
    constructor() {
        super();
        this.self;
        this.host;
        this.hostId = undefined; //will be null if u are host
        this.name ="default"
        this.clientName = "";
        this.hostName = "";
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

    /** open a peer with a auto generated id */
    openPeer(){
        let peer = new Peer();
        this.self = peer;
        return peer;
    }

    /** open a peer with host logic */
    openHostPeer(){
        
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
                this.hostDataProcessor(data, conn);
            })
         })
        return host;
    }

    /** open a peer with client logic */
    openClientPeer(){
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
            
        })
        return client;
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
        }
        if(json.move){
            this.playerMovementEvent(json);
        }
    }

    playerMovementEvent(json){
        for(key in this.connections){
            console.log("player move event")
            if(this.connections[key].id===json.id){
                //this.connections[key].$gamePlayer._moveRouteIndex = json.move.command;
                this.connections[key].$gamePlayer.moveByInput(json.move)
                    
                
                
                //this.connections[key].$gamePlayer.reserveTransfer($dataSystem.startMapId, this.connections[key].$gamePlayer.x , this.connections[key].$gamePlayer.y);
                this.connections[key].$gamePlayer.update(true);
            }
        }
        
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

        if(json.startGame){
            this.emit("startGame")
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
            this.connections[id].setName(data.connected)
            let obj = {}
            obj.playerList = this.getPlayerList();
            this.sendAll(obj);
            this.emit("connect",data.connected) // emit the event
        }
    }


    getPlayerList(){
        for(key in this.connections){
            this.players.push(this.connections[key].name);
        }
        if(!this.players.includes(this.name)){
            players.push(this.hostName);
        }
        
        return this.players;
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
