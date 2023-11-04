/** @namespace MATTIE.preFabAPI a namespace containing all the code for prefabs */
MATTIE.preFabAPI = {};

/** @description the default prefabMapId, currently hardcoded we will need a more elegant way to do this later */
MATTIE.preFabAPI.prefabMapId = 33;

MATTIE.preFabAPI.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
	MATTIE.preFabAPI.Game_Interpreter_pluginCommand.call(this, command, args);
	if (command === 'Prefab') MATTIE.preFabAPI.loadPrefab($gameMap.event(this.eventId()), args);
};

/**
 * @description create a prefab given an event containing overrides and an object containing the map and the id of the event that is the prefab
 * @param {Game_Event} event
 * @param {number[]} args
 */
MATTIE.preFabAPI.loadPrefab = async function (event, args) {
	console.log('tried to load prefab');
	// the id of the event on the prefab map
	const prefabId = args[0];

	// if arg 1 is provided we will use that as the map id otherwise we will just use the default prefab map id
	const mapId = args[1] || this.prefabMapId;

	// handle strings later
	// let i = 1;
	// if (typeof prefabId === 'string') {
	// 	let ev = await MATTIE.eventAPI.getEventOnMap(i, mapId);
	// 	let found = false;
	// 	while (ev && !found) {
	// 		if (ev.name.toLowerCase().includes(prefabId.toLowerCase())) {
	// 			// eslint-disable-next-line no-await-in-loop
	// 			ev = await MATTIE.eventAPI.getEventOnMap(i, mapId);
	// 			found = true;
	// 		} else {
	// 			i++;
	// 		}
	// 	}
	// 	prefabId = (i);
	// }

	const preFabCopy = new MapEvent().copyActionsFromEventOnMap(prefabId, mapId);

	/** @description the pages of the event on the page that is instancing the prefab */
	if (event instanceof Game_Event) {
		const eventPages = event.event().pages;

		for (let index = 0; index < eventPages.length; index++) {
			const page = eventPages[index];

			const overrideCmds = page.list.filter(
				(cmd) => cmd.code === MATTIE.static.commands.commentId,
			)
				.filter((cmd) => cmd.parameters[0].includes('@Override'));
			if (overrideCmds.length > 0) {
				const cmd = overrideCmds[0];
				const commentArgs = cmd.parameters[0].split(' ');
				const startRange = commentArgs[0];
				const endRange = commentArgs[1];
				for (let i = startRange; i < endRange; i++) {
					/** @type {rm.types.EventPage} page of prefabCopy */
					const other = preFabCopy.data.pages[i];
					if (other) {
						// if this page exists in the prefab
						if (page.conditions != other.conditions && page.conditions != preFabCopy.setDefaultConditions()) {
							// if we have overrides in the conditions of this page
							other.conditions = page.conditions;
						}
						if (page.image != other.image && page.image != MapEvent.setDefaultImage()) {
							// if image has override
							other.image = page.image;
						}
						if (page.moveRoute != other.moveRoute && page.moveRoute != preFabCopy.setDefaultMoveRoute()) {
							// if moveRoute has override
							other.moveRoute = page.moveRoute;
						}
						if (page.priorityType != other.priorityType && page.priorityType != 0) {
							other.priorityType = page.priorityType;
						}
						if (page.trigger != other.trigger && page.trigger != 0) {
							other.trigger = page.trigger;
						}
					}
				}
			}
		}
	}

	preFabCopy.setPersist(true);
	preFabCopy.spawn(event.x, event.y);
};
