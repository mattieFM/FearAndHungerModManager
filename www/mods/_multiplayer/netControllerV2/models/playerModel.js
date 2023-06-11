class PlayerModel {
    constructor(name,actorId) {
        this.name = name;
        this.actorId = actorId;
        this.peerId = undefined;
    }

    setPeerId(peerId){
        this.peerId = peerId;
    }
}