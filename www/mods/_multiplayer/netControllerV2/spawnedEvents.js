var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.multiplayer.spawnedEvents = MATTIE.multiplayer.spawnedEvents || {};
MATTIE.multiplayer.spawnedEvents.spawn = MapEvent.prototype.spawn;
MapEvent.prototype.spawn = function (x, y, ignore = false) {
	MATTIE.multiplayer.spawnedEvents.spawn.call(this, x, y);
	if (!ignore) MATTIE.multiplayer.getCurrentNetController().emitEventSpawn(this.data);
};
