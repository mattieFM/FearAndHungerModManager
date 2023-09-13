var MATTIE = MATTIE || {};
var MATTIE_RPG = MATTIE_RPG || {};
MATTIE.betterCrowMauler = MATTIE.betterCrowMauler || {};

if(!MATTIE_ModManager.modManager.checkMod("multiplayer"))
MATTIE.betterCrowMauler.crowCont = new MATTIE.betterCrowMauler.crowController();
Input.addKeyBind("x",()=>{
    MATTIE.betterCrowMauler.crowCont.enter();
},"spawn crow",-2);

Input.addKeyBind("c",()=>{
    MATTIE.betterCrowMauler.crowCont.despawn();
},"despawn crow",-2);