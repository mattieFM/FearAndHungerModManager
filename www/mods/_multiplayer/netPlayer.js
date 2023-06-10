class netPlayer {
    constructor(id,name) {
        this.id = id;
        this.name = name;
        this.x =$gamePlayer.x;
        this.y =$gamePlayer.y;
        this.$gamePlayer;
        this.map = 0;
    }

    setX(x){
        this.x=x;
    }

    setY(y){
        this.y=y;
    }

    setMap(map){
        this.map = map;
    }
}