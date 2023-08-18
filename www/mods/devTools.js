

var MATTIE = MATTIE || {};
MATTIE.devTools = MATTIE.devTools || {};

(()=>{
    Input.addKeyBind('i', ()=>{
        MATTIE.devTools.switchCheatScene();
    })
    
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
})();





MATTIE.devTools.switchCheatScene = function(){
    if(SceneManager._scene instanceof MATTIE.scenes.cheatMenu){
        SceneManager.pop();
    }else{
        MATTIE.devTools.lastScene = SceneManager._scene;
        SceneManager.push(MATTIE.scenes.cheatMenu);
    }

    
}