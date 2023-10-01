var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.multiplayer.runTimeTroopEmitter = MATTIE.multiplayer.runTimeTroopEmitter || {};
MATTIE.multiplayer.runTimeTroopEmitter.spawn = MATTIE.troopAPI.RuntimeTroop.prototype.spawn;
MATTIE.troopAPI.RuntimeTroop.prototype.spawn = function (ignore = false) {
	MATTIE.multiplayer.runTimeTroopEmitter.spawn.call(this);
	if (!ignore) MATTIE.multiplayer.getCurrentNetController().emitRuntimeTroopEvent(this._troopId);
};
