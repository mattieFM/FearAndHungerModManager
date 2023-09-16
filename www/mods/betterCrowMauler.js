var MATTIE = MATTIE || {};
var MATTIE_RPG = MATTIE_RPG || {};
MATTIE.betterCrowMauler = MATTIE.betterCrowMauler || {};

//the multiplayer mod automatically uses better crow mauler so we don't want to double up if both are used
if(!MATTIE_ModManager.modManager.checkMod("multiplayer")) MATTIE.betterCrowMauler.betterCrowMaulerInit();


//----------------------------------------------------------------------
// Key Binds
//----------------------------------------------------------------------
Input.addKeyBind("x",()=>{
    MATTIE.betterCrowMauler.crowCont.enter();
},"spawn crow (DEV)",-2);

Input.addKeyBind("c",()=>{
    MATTIE.betterCrowMauler.crowCont.despawn();
},"despawn crow (DEV)",-2);

Input.addKeyBind("r",()=>{
    let additionalTroop = new MATTIE.troopAPI.runtimeTroop(109, 0, 0)
    additionalTroop.setSwitchValue(1807,false)
    additionalTroop.spawn();
    
    let additionalTroop2 = new MATTIE.troopAPI.runtimeTroop(110, 0, 0)
    additionalTroop2.spawn();
    let additionalTroop3 = new MATTIE.troopAPI.runtimeTroop(115, 0, 0)
    additionalTroop3.spawn();
},"Okay I Pull Up (DEV)",-2);
