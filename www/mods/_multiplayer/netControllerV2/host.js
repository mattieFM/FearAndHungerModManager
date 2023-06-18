//@using peerJs from /dist/peerjs.min.js
var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
/** @global */
class HostController extends BaseNetController {
    constructor(){
        super();
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
        this.initEmitterOverrides(); //override stuff for interceptors
        MATTIE.multiplayer.isHost = true;
        MATTIE.multiplayer.isActive = true;
        this.self = new Peer();
        this.self.on('open', () => {
            console.info(`host opened at: ${this.self.id}`)
            this.peerId = this.self.id;
            this.player.setPeerId(this.peerId);
            setTimeout(() => {
                this.emit('playerInfo', this.player.getCoreData()); //emit playerInfo event with self slightly after open to render host in lobby
            }, 500);
            
        })

        this.self.on('connection', (conn) => {
            console.info(`Client connected to host at: ${conn.peer}`);

            this.handleConnection(conn);

            conn.on('data', (data) => {
                this.onData(data,conn);
            })
        })
    }
 
    onData(data,conn){
        console.log(data);
        data.id = conn.peer; //set the id of the data to the id of the peer on the other side of this connection
        if(data.playerInfo){
            this.onPlayerInfo(data.playerInfo);
        }
        if(data.move){
            this.distributeMoveDataToClients(data.move,data.id)
            this.onMoveData(data.move,data.id)
        }
        if(data.transfer){
            this.distributeTransferDataToClients(data.transfer,data.id)
            this.onTransferData(data.transfer,data.id)
        }
        if(data.ctrlSwitch) {
            if(SceneManager._scene.isActive())
            this.onCtrlSwitchData(data.ctrlSwitch,data.id)
        }
        if(data.cmd) {
            if(SceneManager._scene.isActive())
            this.onCmdEventData(data.cmd,data.id)
        }
    }

    /** 
     * send's a switch event to all clients
     */
    sendSwitchEvent(obj){
        this.sendAll(obj);
    }

    sendAll(data, excluded= []){
        this.connections.forEach(conn=>{
            if(!excluded.includes(conn.peer)) //if the id of the peer is excluded don't send
            conn.send(data);
        })
    }

    /** send all connections the startGame command */
    startGame(){
        let obj = {};
        obj.startGame = "y"
        this.sendAll(obj);
    }

    /** 
     * processes playerinfo and then emits the 'playerInfo' event 
     * @emits playerInfo
     * */
    onPlayerInfo(playerInfo){
        console.log(playerInfo)
        this.updateNetPlayer(playerInfo)
        this.distributeNetPlayersToClients();
        this.updateNetPlayerFollowers(playerInfo);
        this.emit('playerInfo', playerInfo);
    }

    handleConnection(conn){
        let id = conn.peer; //get the id of the peer that is on the other side of the connection
        this.connections.push(conn);
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

    /** alias of distributeNetPlayersToClients used for updating players when this one changes */
    sendPlayerInfo(){
        this.distributeNetPlayersToClients()
    }

    

    /** 
     * assembles the proper list of netPlayers with host included and recipient excluded 
     * @param recipientId the id of the recipient's peer
     * */
    createOutGoingNetPlayers(recipientId){
        let dict = {}
        for(key in this.netPlayers){
            if(key != recipientId){
                dict[key] = this.netPlayers[key].getCoreData(); //add all but the recipient
            }
        }

        dict[this.peerId] = this.player.getCoreData(); //add host
        return dict
    }


    /**
     * sends the move data of a move event to all clients who need to know
     * @param {*} moveData up/down/left/right as num 8 6 4 2
     * @param {*} id the peer id of the player who moved
     */
    distributeMoveDataToClients(moveData,id){
        this.sendAll(this.generateMoveDataForClients(moveData,id),[id])
    }

    /**
     * sends the move data of a move event to all clients who need to know
     * @param {*} moveData up/down/left/right as num 8 6 4 2
     * @param {*} id the peer id of the player who moved
     */
    distributeTransferDataToClients(transData,id){
        this.sendAll(this.generateTransDataForClients(transData,id),[id])
    }

    /**
     * generates an movedata obj in the format client needs
     * @param {number} moveData win4 move data
     * @param {Peerid} id the id of the peer this data applies to
     * @returns moveData obj for clients
     */
    generateMoveDataForClients(moveData,id){
        let obj = {};
            obj.move = {};
            obj.move.d = moveData;
            obj.move.id = id;
        return obj;
    }
    /**
     * generates an transData obj in the format client needs
     * @param {obj} transData win4 move data
     * @param {Peerid} id the id of the peer this data applies to
     * @returns transData obj for clients
     */
    generateTransDataForClients(transData,id){
        let obj = {};
            obj.transfer = {};
            obj.transfer.data = {};
            obj.transfer.data.transfer = transData;
            obj.transfer.id = id;
        return obj;
    }

    /**
     * called through baseNetController and playerEmitter.
     * sends data to the clients when the host moves
     * @param {number} direction 2 / 4 / 6 / 8 representing down right left up
     */
    onMoveEvent(direction){
        this.sendAll(this.generateMoveDataForClients(direction, this.peerId)) //this data is the host moving so we need the host's id here
    }

    /**
     * called through baseNetController and playerEmitter.
     * sends data to the clients when the host transfers
     * @param {Object} an obj with 3 members, x, y and map all numbers
     */
    onTransferEvent(transferObj){
        let obj = {};
            obj.transfer = {};
            obj.transfer.data = transferObj;
            obj.transfer.id = this.peerId;
        this.sendAll(obj) //this data is the host moving so we need the host's id here
    }




}



//ignore this does nothing, just to get intellisense working. solely used to import into the types file for dev.
try {
    module.exports.HostController = HostController;
} catch (error) {
    module = {}
    module.exports = {}
}
module.exports.HostController = HostController;
