//@using peerJs from /dist/peerjs.min.js
var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
var EventEmitter = require("events");
const { hostname } = require("os");

/** @global */
class HostController extends EventEmitter{
    constructor(){
        /** the host's peer */
        this.self;

        /** the id of the host's peer */
        this.peerId;

        /** all connections to the host's peer */
        this.connections = [];

        /** the player on the local machine */
        this.player = new PlayerModel("Mattie",3)

        /**
         *  players not on the local machine 
         *  dictionary with keys equal to the client's peer id
         * */
        this.netPlayers = {};
        
    }

    open(){
        this.self = Peer();
        this.self.on('open', () => {
            console.info(`host opened at: ${this.self.id}`)
            this.peerId = this.self.id;
            this.player.setPeerId(this.peerId);
        })

        this.self.on('connection', (conn) => {
            console.info(`Client connected to host:`);
            console.info(`client at: ${conn.peer}`);

            this.handleConnection(conn);

            conn.on('data', (data) => {
                this.onData(data);
            })
        })
    }

    
    onData(data){
        if(data.playerInfo){
            this.onPlayerInfo(data.playerInfo);
        }
    }

    /** 
     * processes playerinfo and then emits the 'playerInfo' event 
     * @emits playerInfo
     * */
    onPlayerInfo(playerInfo){
        this.initializeNetPlayer(playerInfo)
        this.distributeNetPlayersToClients();
        this.emit('playerInfo', playerInfo);
    }

    handleConnection(conn){
        let id = conn.peer; //get the id of the peer that is on the other side of the connection
        this.connections.push(new ConnectionModel(conn));
    }

    /** send an updated list of all net players to the client.
     *  The host needs to be included in this list and the client the information is being sent to needs to be excluded from this list
     */
    distributeNetPlayersToClients(){
        this.connections.forEach(conn => {
            let peerId = conn.peer; //get the id of the peer on the other end of the connection.
            let newNetPlayers = this.createOutGoingNetPlayers(peerId);
            let obj = {};
                obj.updateNetPlayers = newNetPlayers;
            conn.send(obj);
        })
    }

    /** 
     * assembles the proper list of netPlayers with host included and recipient excluded 
     * @param recipientId the id of the recipient's peer
     * */
    createOutGoingNetPlayers(recipientId){
        let dict = {}
        for(key in this.netPlayers){
            if(key != recipientId){
                dict[key] = this.netPlayers[key] //add all but the recipient
            }
        }

        dict[this.peerId] = this.player; //add host
        return dict
    }

    /** add a new player to the list of netPlayers. */
    initializeNetPlayer(playerInfo){
        let name = playerInfo.name;
        let peerId = playerInfo.peerId;
        let actorId = playerInfo.actorId;
        this.netPlayers[peerId] = new PlayerModel(name,actorId);
    }



}