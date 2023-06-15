/**
 * @using peerJs from /dist/peerjs.min.js
 */

var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.multiplayer.isActive = true;
MATTIE.multiplayer.isClient = false;
MATTIE.multiplayer.isHost = false;
MATTIE.multiplayer.isDev = true;
MATTIE.multiplayer.devTools = {};
MATTIE.multiplayer.devTools.shouldTint = true;
MATTIE.multiplayer.devTools.eventLogger = true;

MATTIE.multiplayer.devTools.randBetween = function(min, max) {
    return min + Math.floor(Math.random() * (max-min+1))
}

MATTIE.multiplayer.devTools.getTint = function() {
    let min = 180;
    let max = 255;
    let r = min
    let g = min
    let b = min
    let str = '0x'
    r =  MATTIE.multiplayer.devTools.randBetween(min,max);
    g = MATTIE.multiplayer.devTools.randBetween(min,max)
    b = MATTIE.multiplayer.devTools.randBetween(min,max)
    str += r.toString(16)
    str += g.toString(16)
    str += b.toString(16)
    return str
}


/** @type {HostController} */
MATTIE.multiplayer.hostController = new HostController();
/** @type {ClientController} */
MATTIE.multiplayer.clientController = new ClientController();

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
    SceneManager.goto(Scene_Load)
}

MATTIE.multiplayer.getCurrentNetController = ()=>{
    if(MATTIE.multiplayer.isClient) return MATTIE.multiplayer.clientController;
    if(MATTIE.multiplayer.isHost) return MATTIE.multiplayer.hostController;
}


(()=>{
    //MATTIE.menus.multiplayer.openHost();
    //MATTIE.menus.toMainMenu();
    MATTIE.menus.mainMenu.addBtnToMainMenu("Multiplayer","multiplayer", MATTIE.menus.multiplayer.openMultiplayer.bind(this))
    
    console.log("Multiplayer Init")
    var client;
    var conn;
    
    if(MATTIE.multiplayer.isDev){
//     Input.addKeyBind('i', ()=>{
//         console.log("-- Forced Client connection script --")
//         netController.hostId = netController.host.id
//         client = netController.openClientPeer();
//         netController.clientName = "client2"
//         netController.name = "client2"
//     })

//     Input.addKeyBind('u', ()=>{
//         console.log("-- Forced Host open script --")
//         netController.hostName = "host"
//         netController.name = "host"
//         host = netController.openHostPeer();

//     })


        //phase dev tool (but like actually not broken)
    Input.addKeyBind('v', ()=>{
        let amount = 1;
        let d = $gamePlayer.direction();

        let x= $gamePlayer.x;
        let y= $gamePlayer.y;
        switch (d) {
            case 8: //up
                    y-=amount
                break;

            case 6: //right
                x+=amount
            break;

            case 4: //left
                x-=amount
            break;
            case 2: //down
                 y+=amount
            break;
        
            default:
                break;
        }
       $gamePlayer.reserveTransfer($gameMap.mapId(), x, y, d, 2)
    })

    Input.addKeyBind('y', ()=>{
        $gameMap.events()[16].start();

    })

    Input.addKeyBind('i', ()=>{
        let res = window.prompt("enter id,val of the switch you would like to change")
        let arr = res.split(',');
        $gameSwitches.setValue(arr[0],arr[1])
        $gameMap.events()[16].start();

    })
}





})();
