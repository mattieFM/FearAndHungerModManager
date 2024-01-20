var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.multiplayer.enemyCommandEmitter = MATTIE.multiplayer.enemyCommandEmitter || {};

/** ==============================================
 * This file handles emitting net events for yanflys save event location plugin
 * In base RPGMaker you cannot have events move and save their positions as there is not really a world
 * yanfly adds this feature, and fear and hunger makes a lot of use of it. This is why sometimes things will move "offscreen"
 * and such. First and foremost this will resolve any bookshelf desync, but should likely fix a lot of other things too.
 *
 *=============================================* */

(() => {
	// becouse this method is called every tick that an obj is moving we are going to throttle It
	// to save some bandwith and try to only send the last few

	let callsFromLast3Seconds = [];

	// clear every 3 seconds
	setInterval(() => {
		// now lets parse the most recent unquie calls and send only them
		// most recent is at bottom of list

		const uniqueCalls = [];
		const uniqueIds = [];
		let size = 0;

		callsFromLast3Seconds.forEach((call) => {
			if (!uniqueIds.includes(call.event._eventId)) uniqueIds.push(call.event._eventId);
		});

		size = uniqueIds.length;

		let full = false;
		while (!full && uniqueIds.length > 0 && callsFromLast3Seconds.length > 0) {
			const element = callsFromLast3Seconds[callsFromLast3Seconds.length - 1];

			if (uniqueIds.includes(element.event._eventId)) {
				// remove it from the array we are looking through
				uniqueIds.splice(uniqueIds.indexOf(element.event._eventId), 1);
				uniqueCalls.push(element);
			}

			// remove the element from our calls
			callsFromLast3Seconds.pop();

			if (uniqueCalls.length == size) { full = true; }
		}

		uniqueCalls.forEach((call) => {
			MATTIE.multiplayer.getCurrentNetController().emitSaveEventLocationEvent(call.mapId, call.event);
		});

		// clear the arr
		callsFromLast3Seconds = [];
	}, 3000);
	const yanflySaveEventLocation = Game_System.prototype.saveEventLocation;
	// eslint-disable-next-line max-len
	/** @description override the base yanfly function to emit the event (this should resolve the issue with things moveing on one end off screen but not the other) */
	Game_System.prototype.saveEventLocation = function (mapId, event, dontEmit = false) {
		yanflySaveEventLocation.call(this, mapId, event);
		// if (mapId === 3) {
		// 	if ([119, 121, 123, 122, 124, 153].includes(event._eventId)) {
		if (!dontEmit) {
			callsFromLast3Seconds.push({ mapId, event });
		}
		// 	}
		// }
	};
})();
