/**
 * @using peerJs from /dist/peerjs.min.js
 */

var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.multiplayer.active = true;

/** @type {NetController} */
MATTIE.multiplayer.netController = new NetController();
var netController = MATTIE.multiplayer.netController;

MATTIE.menus.multiplayer.openHost = () => {
    SceneManager.goto(MATTIE.scenes.multiplayer.host)
}

MATTIE.menus.multiplayer.openJoin = () => {
    SceneManager.goto(MATTIE.scenes.multiplayer.join)
}

MATTIE.menus.multiplayer.openMultiplayer = () => {
    SceneManager.goto(MATTIE.scenes.multiplayer.main)
}

MATTIE.menus.multiplayer.openLobby = () => {
    SceneManager.goto(MATTIE.scenes.multiplayer.lobby)
}

MATTIE.menus.multiplayer.openGame = () => {
    SceneManager.goto(Scene_Load);
}


(()=>{
    //MATTIE.menus.multiplayer.openHost();
    //MATTIE.menus.toMainMenu();
    MATTIE.menus.mainMenu.addBtnToMainMenu("Multiplayer","multiplayer", MATTIE.menus.multiplayer.openMultiplayer.bind(this))
    
    console.log("Multiplayer Init")
    var client;
    var conn;
    

    Input.addKeyBind('i', ()=>{
        console.log("-- Forced Client connection script --")
        netController.hostId = netController.host.id
        client = netController.openClientPeer();
        netController.clientName = "client2"
        netController.name = "client2"
        
        
    })

    Input.addKeyBind('u', ()=>{
        let obj = {}
        obj.move = {};
        obj.move.x = -1;
        obj.move.y = -1;
        netController.clientToHost.send(obj)
    })





})();
