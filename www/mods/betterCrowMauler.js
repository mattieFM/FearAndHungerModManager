var MATTIE_RPG = MATTIE_RPG || {};
MATTIE.betterCrowMauler = MATTIE.betterCrowMauler || {};

// the multiplayer mod automatically uses better crow mauler so we don't want to double up if both are used
if (!MATTIE_ModManager.modManager.checkMod('multiplayer')) MATTIE.betterCrowMauler.betterCrowMaulerInit();

//----------------------------------------------------------------------
// Key Binds
//----------------------------------------------------------------------
// Input.addKeyBind('', () => {
// 	MATTIE.betterCrowMauler.crowCont.enter();
// }, 'spawn crow (DEV)', -2);

// Input.addKeyBind('', () => {
// 	MATTIE.betterCrowMauler.crowCont.despawn();
// }, 'despawn crow (DEV)', -2);

// Input.addKeyBind('', () => {
// 	const additionalTroop = new MATTIE.troopAPI.RuntimeTroop(170, 0, 0);
// 	additionalTroop.spawn();

// 	const additionalTroop2 = new MATTIE.troopAPI.RuntimeTroop(210, 0, 0);
// 	additionalTroop2.spawn();
// 	const additionalTroop3 = new MATTIE.troopAPI.RuntimeTroop(130, 0, 0);
// 	additionalTroop3.spawn();
// }, 'Okay I Pull Up (DEV)', -2);
