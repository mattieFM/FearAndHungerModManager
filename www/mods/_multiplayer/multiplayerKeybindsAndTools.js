var MATTIE = MATTIE || {};
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