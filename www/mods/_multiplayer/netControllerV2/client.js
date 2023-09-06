//@using peerJs from /dist/peerjs.min.js
var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}

class ClientController extends BaseNetController {
    constructor(){
        super();
        /** the client's peer */
        this.self;

        /** the id of the client's peer */
        this.peerId;

        /** the id of the host's peer */
        this.hostId;

        /** the connection to the host */
        this.conn;

        /** the player on the local machine */
        this.player = new PlayerModel("MattieClient",4)

        /**
         *  players not on the local machine 
         *  dictionary with keys equal to the client's peer id
         * */
        this.netPlayers = {};
    }

    open(){
        this.initEmitterOverrides(); //override stuff for interceptors
        this.setIsClient();
        this.self = new Peer();
        this.self.on('open', ()=>{
            this.peerId = this.self.id;
            this.player.setPeerId(this.peerId)
            console.info(`Client opened at: ${this.peerId}`)
            console.info(`Attempting to connect to host at: ${this.hostId}`)
            MATTIE.multiplayer.clientController.connect();
        })
    }

    connect(hostId=this.hostId){
        this.conn = this.self.connect(hostId);
            this.conn.on("open", () => {
                console.info(`Client Connected to the host`)
                this.sendPlayerInfo();
            })

            this.conn.on("data", (data) => {
                if(!this.self.disconnected)
                this.onData(data,this.conn);
            })
    }

    /**
     * @description a function that will preprocess the data for onData.
     * this adds the field .id equal to the host's id or the sender id
     * @param data the data that was sent
     * @param conn the connection that is sending the data
     */
    preprocessData(data, conn){
        if(!data.id) data.id = conn.peer;
        return data;
    }

    // /**
    //  * @description send a json object to the main connection. Since this is the client this will just send to host.
    //  * @param {*} obj the object to send
    //  */
    // sendViaMainRoute(obj){
    //     this.sendHost(obj);
    // }

    sendHost(data){
        this.conn.send(data);
    }

    /**
     * @param {*} startGame unused var
     * @emits startGame;
     */
    onStartGameData(startGame){
        this.emit('startGame')
        this.started = true;
    }

    /** 
     * send's the user's player info to the host
     * used to initialize them as a player
     */
    sendPlayerInfo(){
        let obj = {};
        obj.playerInfo = this.player.getCoreData();
        this.sendViaMainRoute(obj);
    }
    

}

//ignore this does nothing, just to get intellisense working. solely used to import into the types file for dev.
try {
    module.exports.ClientController = ClientController;
} catch (error) {
    module = {}
    module.exports = {}
}
module.exports.ClientController = ClientController;
