

var MATTIE = MATTIE || {};

MATTIE.devTools = MATTIE.devTools || {};
//
(()=>{
    Input.addKeyBind('-', ()=>{
        MATTIE.devTools.switchCheatScene();
    }, "CHEAT", 1)

    Input.addKeyBind(';', ()=>{
        SceneManager.push(Scene_Debug);
    }, "DEBUG", -2)

    Input.addKeyBind('m', ()=>{
        SceneManager.push(MATTIE.scenes.Scene_Dev);
    }, "DEV MENU", -2)



    

    Input.addKeyBind('2', ()=>{
        SceneManager.onError(new Error("hiya im an error"))
    }, "THROW ERROR", -2)
    
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
    }, "PHASE", 1)
})();

MATTIE.devTools.switchCheatScene = function(){
    if(SceneManager._scene instanceof MATTIE.scenes.Scene_DevItems){
        SceneManager.pop();
    }else{
        MATTIE.devTools.lastScene = SceneManager._scene;
        SceneManager.push(MATTIE.scenes.Scene_DevItems);
    }

    
}