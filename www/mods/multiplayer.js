/**
 * @using peerJs from /dist/peerjs.min.js
 */

var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};

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
    console.log("here")
    SceneManager.goto(MATTIE.scenes.multiplayer.lobby)
}


(()=>{
    //MATTIE.menus.multiplayer.openHost();
    //MATTIE.menus.toMainMenu();
    MATTIE.menus.mainMenu.addBtnToMainMenu("Multiplayer","multiplayer", MATTIE.menus.multiplayer.openMultiplayer.bind(this))
    
    console.log("Multiplayer Init")
    var client;
    var conn;
    

    Input.addKeyBind('i', ()=>{
        client = netController.openClientPeer();
        console.log("client connecting")
        client.on("open",()=>{
            conn = client.connect(netController.host.id);
        })
        
       
    })

    Input.addKeyBind('p', ()=>{
        console.log("clientTriggered")
        conn.send({"connected":"casca"})
    })

    Input.addKeyBind('u', ()=>{
        console.log(MATTIE.multiplayer.netController.connections)
    })





})();
