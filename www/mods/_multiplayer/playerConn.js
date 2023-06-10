class PlayerConnection {
    constructor(conn) {
        /** @type {peerJs connection} */
        this.conn = conn;
        this.id = this.conn.peer;
        this.name = undefined;

    }

    setName(name){
        this.name = name;
    }
}