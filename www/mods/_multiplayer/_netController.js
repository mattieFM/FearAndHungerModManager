//@using peerJs from /dist/peerjs.min.js

var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
var EventEmitter = require("events");

class _NetController extends EventEmitter {
    constructor() {
        super();
        this.host;
        this.connections = []
    }

    /** open a peer with a auto generated id */
    openPeer(){
        return new Peer();
    }

    /** open a peer with host logic */
    openHostPeer(){
        
        var host = this.openPeer();
        this.host = host;
        host.on("open", (id)=>{
            console.log(`Host Id: ${id}`)
        })

        host.on("connection", (conn)=>{
            conn.on('data', (data)=>{
                this.connections.push(conn);
                this.processData(data);
            })
         })
        return host;
    }

    /** open a peer with client logic */
    openClientPeer(){
        var client = this.openPeer();
        return client;
    }

    processData(data){
        var json;
        if(typeof data === 'object'){
            json = data
        }else{
            json = JSON.parse(data);
        }
        if(json.connected){
             this.emit("connect",json.connected)
        }
    }
}

export default _NetController




