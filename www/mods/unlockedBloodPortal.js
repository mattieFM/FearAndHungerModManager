/*:
* @plugindesc V0
* a test mod for fear and hunger
* @author Mattie
* 
* mods define their 
*/
var MATTIE = MATTIE || {};

(()=>{
    Input.addKeyBind('b', ()=>{
        $gameTemp.reserveCommonEvent(152);
    })
    Input.addKeyBind('p', ()=>{
        console.log(StorageManager.load(5))
    })
    Input.addKeyBind('l', ()=>{
        Game_Interpreter.prototype.command352();
    })

    
})();


