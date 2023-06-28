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
MATTIE.multiplayer.isEnemyHost = false;
MATTIE.multiplayer.isDev = true;
MATTIE.multiplayer.devTools = {};
MATTIE.multiplayer.devTools.shouldTint = true;
MATTIE.multiplayer.devTools.eventLogger = false;
MATTIE.multiplayer.devTools.varLogger = false;
MATTIE.multiplayer.devTools.cmdLogger = false;
MATTIE.multiplayer.devTools.moveLogger = false;
MATTIE.multiplayer.devTools.enemyHostLogger = true;

MATTIE.multiplayer._interpreter = new Game_Interpreter();

let lastmsg = Date.now();
MATTIE.multiplayer.devTools.slowLog = function(data){
    if(Math.abs(lastmsg - Date.now()) > 500 ){ 
        console.log(data);
        lastmsg= Date.now();
    }
    
}
MATTIE.multiplayer.setEnemyHost = function (){
    if($gameMap.mapId() !== MATTIE.multiplayer.lastEnemyHostMapId){
        let netController = MATTIE.multiplayer.getCurrentNetController();
        var shouldBeHost = true;
        for(key in netController.netPlayers){
            let player = netController.netPlayers[key];
            if(player.map === $gameMap.mapId()){
                shouldBeHost = false;
            }
        }
        MATTIE.multiplayer.isEnemyHost = shouldBeHost;
        if(MATTIE.multiplayer.devTools.enemyHostLogger)console.log("is enemy host? "+ MATTIE.multiplayer.isEnemyHost);
    }
    MATTIE.multiplayer.lastEnemyHostMapId = $gameMap.mapId();
}

MATTIE.multiplayer.updateEnemyHost = function (){
    if(!MATTIE.multiplayer.isEnemyHost){
        let netController = MATTIE.multiplayer.getCurrentNetController();
        var shouldBeHost = true;
        for(key in netController.netPlayers){
            let player = netController.netPlayers[key];
            if(player.map === $gameMap.mapId()){
                shouldBeHost = false;
            }
        }
        MATTIE.multiplayer.isEnemyHost = shouldBeHost;
        if(MATTIE.multiplayer.devTools.enemyHostLogger)console.log("is enemy host? "+ MATTIE.multiplayer.isEnemyHost)
    }
    
}

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
        console.info(`forcibly set ${arr[0]} to ${arr[1]}`)
        $gameSwitches.setValue(parseInt(arr[0]),parseInt(arr[1]),false)
        //$gameMap.events()[16].start();

    })

    Input.addKeyBind('o', ()=>{
        let res = window.prompt("enter id,val of the var you would like to change")
        let arr = res.split(',');
        console.info(`forcibly set ${arr[0]} to ${arr[1]}`)
        $gameVariables.setValue(parseInt(arr[0]),parseInt(arr[1]))
        //$gameMap.events()[16].start();

    })

    Input.addKeyBind('p', ()=>{
        let res = window.prompt("enter id,x,y of the event you would like to move")
        let arr = res.split(',');
        
        
        let event = $gameMap.event(arr[0]);
       
        try {
            let x = parseInt(arr[1]);
            let y = parseInt(arr[2]);
            event.x = x;
            event.y = y;
            event._x = x;
            event._y = y;
            console.info(`forcibly moved event:ID:${arr[0]} to x:${arr[1]}y:${arr[2]}`)
        } catch (error) {
            event[arr[1]] = arr[2];
            console.info(`forcibly set event:ID:${arr[0]} prop: ${arr[1]} to ${arr[2]}`)
        }
       
        
        

    })
}





})();
