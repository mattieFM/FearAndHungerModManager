var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};

var EventEmitter = require("events");


class BattleController extends EventEmitter {
    emitReadyEvent(actions){
        this.emit("ready")
        var obj = {};
        obj.ready = {};
        obj.ready.val = true;
        obj.ready.actions = actions;
        MATTIE.multiplayer.currentBattleEvent.setReadyIfExists(MATTIE.multiplayer.getCurrentNetController().peerId,1);
        MATTIE.multiplayer.getCurrentNetController().onReadyEvent(obj);
    }

    emitUnreadyEvent(){
        this.emit("unready")
        var obj = {};
        obj.ready = {};
        obj.ready.val = false;
        MATTIE.multiplayer.currentBattleEvent.setReadyIfExists( MATTIE.multiplayer.getCurrentNetController().peerId,0);
        MATTIE.multiplayer.getCurrentNetController().onReadyEvent(obj);
    }
}


MATTIE.multiplayer.BattleController = new BattleController();