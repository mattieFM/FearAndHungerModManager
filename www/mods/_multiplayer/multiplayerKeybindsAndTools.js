var MATTIE = MATTIE || {};
MATTIE.actorAPI = MATTIE.actorAPI || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.multiplayer.keybinds = MATTIE.multiplayer.keybinds || {}
MATTIE.multiplayer.keybinds.currentIndex = 0;


Input.addKeyBind('n', ()=>{
    let netPlayers = MATTIE.multiplayer.getCurrentNetController().netPlayers;
    let netPlayerIds = Object.keys(netPlayers)
    

    if(MATTIE.multiplayer.keybinds.currentIndex < netPlayerIds.length-1){ //handle incrementing / looping
        MATTIE.multiplayer.keybinds.currentIndex++;
    }else{
        MATTIE.multiplayer.keybinds.currentIndex = 0
    }

    let playerId = netPlayerIds[MATTIE.multiplayer.keybinds.currentIndex];

    console.log(playerId);
    console.log(netPlayers);
    let player = netPlayers[playerId];
    let mapId = player.$gamePlayer._newMapId != 0 ? player.$gamePlayer._newMapId : player.map;
    let x = player.$gamePlayer.x;
    let y = player.$gamePlayer.y;
    $gamePlayer.reserveTransfer(mapId,x,y, 0, 2);
    setTimeout(() => {
        $gamePlayer.performTransfer();
    }, 100);
    

}, "TP", 0)

let curMapID = 1;
Input.addKeyBind('q', ()=>{
    $gamePlayer.reserveTransfer(curMapID,5,5);
    curMapID++;

}, "GO NEXT MAP", -2);


Input.addKeyBind('v', async ()=>{
    let torturer = new MATTIE.actorAPI.Data_Actor_Wrapper();
    torturer.buildDataActorFromEventAndTroop(await MATTIE.eventAPI.getEventOnMap(132,3), $dataTroops[17])//add turturer as actor
    torturer.create();
    let priest3 = new MATTIE.actorAPI.Data_Actor_Wrapper();
    priest3.buildDataActorFromEventAndTroop(await MATTIE.eventAPI.getEventOnMap(26,3), $dataTroops[10])//add priest3 as actor
    priest3.create();

    let crowMauler = new MATTIE.actorAPI.Data_Actor_Wrapper();
    crowMauler.buildDataActorFromEventAndTroop(await MATTIE.eventAPI.getEventOnMap(173,24), $dataTroops[51])//add crow mauler as actor
    crowMauler.create();

    let Merc = new MATTIE.actorAPI.Data_Actor_Wrapper();
    Merc.buildDataActorFromExistingActor($dataActors[1])
    Merc.create();

}, "addActor",-2)


Input.addKeyBind('z', async ()=>{
    SceneManager.goto(Scene_Gameover)

}, "die",-2)