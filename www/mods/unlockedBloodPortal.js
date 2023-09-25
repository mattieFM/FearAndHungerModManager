/*:
* @plugindesc V0
* a test mod for fear and hunger
* @author Mattie
* 
* mods define their 
*/
var MATTIE = MATTIE || {};

(()=>{
    Input.addKeyBind('', ()=>{
        $gameTemp.reserveCommonEvent(152);
    }, "Blood Portal", 1);

    DataManager.changeActivationCondition(MATTIE.static.skills.bloodportal,2);
    DataManager.clearEffects(MATTIE.static.skills.bloodportal);
    DataManager.addEffect(MATTIE.static.skills.bloodportal,DataManager.buildCommonEventEffect(MATTIE.static.commonEvents.bloodportal.id));
})();


