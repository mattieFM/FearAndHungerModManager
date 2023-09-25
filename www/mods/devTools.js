

var MATTIE = MATTIE || {};

MATTIE.devTools = MATTIE.devTools || {};
//
(()=>{

    Input.addKeyBind('', ()=>{
        SceneManager.push(MATTIE.scenes.Scene_Dev);
    }, "CHEAT", 1, "p", "p")

    Input.addKeyBind('', ()=>{
        SceneManager.push(Scene_Debug);
    }, "DEBUG (DEV)", -2)

    Input.addKeyBind('', ()=>{
        SceneManager.push(MATTIE.scenes.Scene_Dev);
    }, "DEV MENU (DEV)", -2)



    

    Input.addKeyBind('', ()=>{
        SceneManager.onError(new Error("hiya im an error"))
    }, "THROW ERROR (DEV)", -2)

    Input.addKeyBind('', ()=>{
        console.log("here")
        $gameSystem.enableMenu();
        $gameScreen.clearPictures();
    }, "clear images (DEV)", -2)
    
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