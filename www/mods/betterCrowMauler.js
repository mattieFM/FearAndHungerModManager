var MATTIE = MATTIE || {};
var MATTIE_RPG = MATTIE_RPG || {};
MATTIE.betterCrowMauler = MATTIE.betterCrowMauler || {};

let crowCont = new MATTIE.betterCrowMauler.crowController();
Input.addKeyBind("x",()=>{
    console.log("here")
    crowCont.enter();
},"spawn crow",-2);