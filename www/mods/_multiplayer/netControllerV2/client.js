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
        MATTIE.multiplayer.isClient = true;
        MATTIE.multiplayer.isActive = true;
        this.self = new Peer();
        this.self.on('open', ()=>{
            this.peerId = this.self.id;
            this.player.setPeerId(this.peerId)
            console.info(`Client opened at: ${this.peerId}`)
            console.info(`Attempting to connect to host at: ${this.hostId}`)
            MATTIE.multiplayer.clientController.connect();
        })

        this.self.on('data', (data) => {
            this.onData(data);
        })
    }

    connect(hostId=this.hostId){
        this.conn = this.self.connect(hostId);
            this.conn.on("open", () => {
                console.info(`Client Connected to the host`)
                this.sendPlayerInfo();
            })

            this.conn.on("data", (data) => {
                this.onData(data);
            })
    }

    onData(data){
        if(MATTIE.multiplayer.devTools.dataLogger) console.info(data);
        if(data.updateNetPlayers){
            this.onUpdateNetPlayers(data.updateNetPlayers);
        }
        if(data.startGame){
            this.onStartGame(data.startGame)
        }
        if(data.move){
            let id = data.move.id;
            this.onMoveData(data.move, id);
        }
        if(data.transfer){
            let transfer = data.transfer.data.transfer;
            let id = data.transfer.id;
            this.onTransferData(transfer,id)
        }
        if(data.ctrlSwitch){
            if(SceneManager._scene.isActive())
            this.onCtrlSwitchData(data.ctrlSwitch,0)
        }
        if(data.event){
            if(SceneManager._scene.isActive())
            this.onEventMoveEventData(data.event)
        }
        if(data.battleStart){
            var id = data.id;
            this.onBattleStartData(data.battleStart, id);
        }
        if(data.battleEnd){
            this.onBattleEndData(data.battleEnd, id);
        }
        if(data.ready){
            let id = data.ready.id;
            this.onReadyData(data.ready, id);
        }

        if(data.turnEnd){
            this.onTurnEndData(data.turnEnd, data.id);
            //this.distributeTurnEndDataToClients();
        }
    }

    sendHost(data){
        this.conn.send(data);
    }

    /**
     * @param {*} startGame unused var
     * @emits startGame;
     */
    onStartGame(startGame){
        this.emit('startGame')
    }

    /** 
     * handle when the host sends an updated list of netplayers
     * @emits updateNetPlayers
     */
    onUpdateNetPlayers(netPlayers){
        this.updateNetPlayers(netPlayers)
        this.updateNetPlayerFollowers(netPlayers);
        this.emit('updateNetPlayers', netPlayers);
    }

    /** 
     * send's the user's player info to the host
     * used to initialize them as a player
     */
    sendPlayerInfo(){
        let obj = {};
        obj.playerInfo = this.player.getCoreData();
        this.sendHost(obj);
    }

    sendEventMoveEvent(obj){
        this.sendHost(obj);
    }

    /** 
     * send's a switch event to the host
     */
    sendSwitchEvent(obj){
        this.sendHost(obj);
    }

    /**
     * called through baseNetController and playerEmitter.
     * sends data to the host when the player moves
     * @param {number} direction 2 / 4 / 6 / 8 representing down right left up
     */
    onMoveEvent(direction,x=undefined,y=undefined,transfer=false){
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
        this.sendHost(obj)
    }

    onTurnEndEvent(obj){
        this.sendHost(obj);
    }

    /**
     * called through baseNetController and playerEmitter.
     * sends data to the clients when the host transfers
     * @param {Object} an obj with 3 members, x, y and map all numbers
     */
    onTransferEvent(transferObj){
        this.sendHost(transferObj)
    }

    sendCommandEvent(obj){
        this.sendHost(obj)
    }

    /** send the battle start event to the host */
    onBattleStartEvent(battleStartObj){
        this.sendHost(battleStartObj);
    }
    
    onBattleEndEvent(battleEndObj){
        this.sendHost(battleEndObj);
    }

    onReadyEvent(obj){
        this.sendHost(obj)
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
