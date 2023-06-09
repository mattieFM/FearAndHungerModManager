class PlayerConnection {
    constructor(conn) {
        /** @type {peerJs connection} */
        this.conn = conn;
        this.name = undefined;
    }

    setName(name){
        this.name = name;
    }
}