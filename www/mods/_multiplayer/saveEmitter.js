var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.multiplayer.saveEmitter = MATTIE.multiplayer.saveEmitter || {};

MATTIE.multiplayer.saveEmitter.saveGame = DataManager.saveGame;
DataManager.saveGame = function (savefileId, noTimeStamp = false, ignoreEmit = false) {
	const returnVal = MATTIE.multiplayer.saveEmitter.saveGame.call(this, savefileId, noTimeStamp);
	if (!ignoreEmit) {
		const net = MATTIE.multiplayer.getCurrentNetController();
		if (net) net.emitSaveEvent();
	}
	return returnVal;
};
