var MATTIE = MATTIE || {};
var MATTIE_RPG = MATTIE_RPG || {};
MATTIE.betterCrowMauler = MATTIE.betterCrowMauler || {};

let crowCont = new MATTIE.betterCrowMauler.crowController();
Input.addKeyBind("x",()=>{
    console.log("tried to spawn")
    crowCont.enter();
},"spawn crow",-2);

Input.addKeyBind("c",()=>{
    crowCont.despawn();
},"despawn crow",-2);