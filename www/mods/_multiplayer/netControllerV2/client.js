//@using peerJs from /dist/peerjs.min.js
var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
var EventEmitter = require("events");
const { hostname } = require("os");

class ClientController extends EventEmitter {
    constructor(){
        /** the host's peer */
        this.self;

        /** the id of the host's peer */
        this.peerId;

        /** the connection to the host */
        this.conn;

        /** the player on the local machine */
        this.player = new PlayerModel("MattieClient",3)

        /**
         *  players not on the local machine 
         *  dictionary with keys equal to the client's peer id
         * */
        this.netPlayers = {};
    }

    open(){
        this.self = Peer();
        this.self.on('open', ()=>{
            this.peerId = this.self.id;
            this.player.setPeerId(this.peerId)
            console.info(`Client opened at: ${this.peerId}`)
        })

        this.self.on('data', (data) => {
            this.onData(data);
        })
    }

    connect(hostId){
        this.conn = client.connect(hostId);
            this.conn.on("open", () => {
                console.log(`Client Connected to the host`)
                this.sendPlayerInfo();
            })

            this.conn.on("data", (data) => {
                this.onData(data);
            })
    }

    onData(data){
        if(data.updateNetPlayers){
            this.onUpdateNetPlayers(data.updateNetPlayers);
        }
    }

    /** 
     * handle when the host sends an updated list of netplayers
     * @emits updateNetPlayers
     */
    onUpdateNetPlayers(netPlayers){
        for(key in netPlayers){
            let netPlayer = netPlayers[key];
            if(!this.netPlayers[key]) {
                this.netPlayers[key]=netPlayer; //if this player hasn't been defined yet initialize it.
            }else{
                this.netPlayers[key] = Object.assign(this.netPlayers[key], netPlayer) //replace any files that conflict with new data, otherwise keep old data.
            }
        }
        this.netPlayers = netPlayers;
        this.emit('updateNetPlayers', netPlayers);
    }

    /** 
     * send's the user's player info to the host
     * used to initialize them as a player
     */
    sendPlayerInfo(){
        let obj = {};
        obj.playerData = this.player;
        this.conn.send(obj);
    }


}