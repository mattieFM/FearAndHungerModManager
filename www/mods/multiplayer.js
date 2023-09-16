//ran level vars are 121-136.

/**
 * @using peerJs from /dist/peerjs.min.js
 */
//
var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.multiplayer.crowController = null;
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.multiplayer.isActive = true;
MATTIE.multiplayer.isClient = false;
MATTIE.multiplayer.isHost = false;
MATTIE.multiplayer.isEnemyHost = false;
MATTIE.multiplayer.isDev = MATTIE.isDev;
MATTIE.multiplayer.devTools = {};
MATTIE.multiplayer.devTools.shouldTint = false;
MATTIE.multiplayer.devTools.eventLogger = false;
MATTIE.multiplayer.devTools.varLogger = false;
MATTIE.multiplayer.devTools.cmdLogger = false;
MATTIE.multiplayer.devTools.moveLogger = false;
MATTIE.multiplayer.devTools.enemyMoveLogger = false;
MATTIE.multiplayer.devTools.battleLogger = false;
MATTIE.multiplayer.devTools.inBattleLogger = false;
MATTIE.multiplayer.devTools.enemyHostLogger = false;
MATTIE.multiplayer.devTools.dataLogger = false
MATTIE.multiplayer.devTools.consistentTint = "0x2bf0ec"; //set to null to enable random tints

MATTIE.multiplayer.runTime = 2000; //ms till enemy can move after combat. Note this time starts while menus are closing so it needs to be higher than one would think.
MATTIE.multiplayer.hasImmunityToBattles = false;
MATTIE.multiplayer.currentBattleEnemy = {};
MATTIE.multiplayer.currentBattleEvent;
MATTIE.multiplayer.inBattle = false;

//spectating var
MATTIE.multiplayer.isSpectator = false;

MATTIE.multiplayer._interpreter = new Game_Interpreter();
MATTIE.multiplayer.params = PluginManager.parameters('multiplayer');
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
    SceneManager.goto(MATTIE.scenes.multiplayer.startGame)
}

MATTIE.multiplayer.getCurrentNetController = ()=>{
    if(MATTIE.multiplayer.isClient) return MATTIE.multiplayer.clientController;
    if(MATTIE.multiplayer.isHost) return MATTIE.multiplayer.hostController;
}

(()=>{
    MATTIE.menus.mainMenu.addBtnToMainMenu("Multiplayer","multiplayer", MATTIE.menus.multiplayer.openMultiplayer.bind(this))
    MATTIE.menus.mainMenu.addBtnToMainMenu("Rejoin","Rejoin", MATTIE.menus.multiplayer.openGame, MATTIE.multiplayer.getCurrentNetController()?MATTIE.multiplayer.getCurrentNetController().isClient:false)
    MATTIE.menus.mainMenu.addBtnToMainMenu("Disable Multiplayer","Disable_Multiplayer", (()=>{
        MATTIE_ModManager.modManager.switchStatusOfMod("multiplayer");
        MATTIE_ModManager.modManager.reloadGame();
    }
    ).bind(this))
    //multiplayer mod breaks solo play, so we remove these buttons
    MATTIE.menus.mainMenu.removeBtnFromMainMenu("Continue","continue");
    MATTIE.menus.mainMenu.removeBtnFromMainMenu("New Game","newgame");
    MATTIE.menus.mainMenu.removeBtnFromMainMenu("Continue Suspended Run","suspend");
    console.log("Multiplayer Init")

    

    setTimeout(async () => {
        //create ghost char
        MATTIE.static.actors.ghost = new MATTIE.actorAPI.Data_Actor_Wrapper();
        MATTIE.static.actors.ghost.buildDataActorFromEventAndTroop(await MATTIE.eventAPI.getEventOnMap(185,20), $dataTroops[174], 7) //add miner ghost as actor
        MATTIE.static.actors.ghost.create();  

        
    }, 1000);
    

    MATTIE.static.update();    
    if(MATTIE.global.isFunger()) MATTIE.betterCrowMauler.betterCrowMaulerInit();   //setup crow mauler if not termina
})();


