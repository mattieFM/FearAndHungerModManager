/**
 * @namespace MATTIE.eventAPI
 * @description The main API the modding engine uses to perform any actions regarding events
 * This api is mostly for runtime events, if you want to add new compile time events look at loading data assets.
 */
MATTIE.eventAPI = MATTIE.eventAPI || {};
MATTIE.eventAPI.dataEvents = MATTIE.eventAPI.dataEvents || {};
MATTIE.eventAPI.blankEvent = {};
/**
 *
 * @param {Game_Item} item
 */
MATTIE.eventAPI.addItemDropToCurrentMap = function (item, spawn = true) {
	const event = new MapEvent();
	const itemObj = item.object();
	event.addPage();
	event.data.pages[1].conditions.selfSwitchValid = true;
	event.setImage(0, MATTIE.static.events.images.shiny());
	event.addText(0, 'There is something shining here....');
	event.addText(0, `You find... A ${itemObj.name}`);
	if (item.isArmor()) event.addCommand(0, 128, [itemObj.id, 0, 0, 1]); // give armor
	else if (item.isWeapon()) event.addCommand(0, 127, [itemObj.id, 0, 0, 1]); // give weapon
	else event.addCommand(0, 126, [itemObj.id, 0, 0, 1]); // give item
	event.addCommand(0, 123, ['A', 0]);// set self switch
	event.setPersist(true);
	if (spawn) { event.spawn($gamePlayer.x, $gamePlayer.y); }
	return event;
};

/**
 * @description create a blank event
 * @returns the id of the event
 */
MATTIE.eventAPI.createBlankEvent = function () {
	const event = new MapEvent();
	event.spawn(1, 1);
	return event.data.id;
};

MATTIE.eventAPI.createDataEvent = function (id, name, note, pages, x, y) {
	const obj = {};
	obj.id = id;
	obj.name = name;
	obj.note = note;
	obj.pages = pages;
	obj.x = x;
	obj.y = y;
	return obj;
};

MATTIE.eventAPI.orgEvent = Game_Event.prototype.event;
Game_Event.prototype.event = function () {
	let val = MATTIE.eventAPI.orgEvent.call(this);
	if (MATTIE.eventAPI.dataEvents[this._eventId]) {
		val = MATTIE.eventAPI.dataEvents[this._eventId];
	}
	if (!val) val = MATTIE.eventAPI.dataEvents[this._eventId];
	return val;
};

MATTIE.eventAPI.updatePosOfRunTimeEvents = function () {
	const keys = Object.keys(MATTIE.eventAPI.dataEvents);
	for (let index = 0; index < keys.length; index++) {
		/** @type {rm.types.Event} */
		const eventId = keys[index];
		const dataEvent = MATTIE.eventAPI.dataEvents[keys[index]];
		if (dataEvent) {
			if (dataEvent.mapId === $gameMap.mapId() && dataEvent.persist) {
				MATTIE.eventAPI.dataEvents[eventId] = $dataMap.events[eventId] ? $dataMap.events[eventId] : MATTIE.eventAPI.dataEvents[eventId];
				const event = $gameMap.event(eventId);
				if (event) {
					MATTIE.eventAPI.dataEvents[eventId].x = event.x;
					MATTIE.eventAPI.dataEvents[eventId].y = event.y;
				}
			}
		}
	}
};

MATTIE.eventAPI.setupRunTimeDataEvents = function () {
	for (let index = 0; index < keys.length; index++) {
		/** @type {rm.types.Event} */
		const dataEvent = MATTIE.eventAPI.dataEvents[keys[index]];
		if (dataEvent.mapId === $gameMap.mapId() && dataEvent.persist) {
			console.log(dataEvent);
			$dataMap.events[dataEvent.id] = dataEvent;
			const mapEvent = new MapEvent();
			mapEvent.data = dataEvent;
			mapEvent.createGameEvent();
			if (!$dataMap.events[dataEvent.id]) $dataMap.events[dataEvent.id] = undefined;
		}
	}
};
MATTIE.eventAPI.setupRunTimeGameEvents = function () {
	const keys = Object.keys(MATTIE.eventAPI.dataEvents);
	for (let index = 0; index < keys.length; index++) {
		/** @type {rm.types.Event} */
		const dataEvent = MATTIE.eventAPI.dataEvents[keys[index]];
		if (dataEvent.mapId === $gameMap.mapId() && dataEvent.persist) {
			if (!$dataMap.events[dataEvent.id]) {
				console.log(dataEvent);
				$dataMap.events[dataEvent.id] = dataEvent;
				const mapEvent = new MapEvent();
				mapEvent.data = dataEvent;
				mapEvent.refresh();
				if (!$dataMap.events[dataEvent.id]) $dataMap.events[dataEvent.id] = undefined;
			}
		}
	}
	$gameMap.refreshTileEvents();
};

MATTIE.eventAPI.ReserveTrasnferOrg = Game_Player.prototype.reserveTransfer;
Game_Player.prototype.reserveTransfer = function (mapId, x, y, d, fadeType) {
	MATTIE.eventAPI.ReserveTrasnferOrg.call(this, mapId, x, y, d, fadeType);
	MATTIE.eventAPI.updatePosOfRunTimeEvents();
};

MATTIE.eventAPI.DataManager_loadMapData = DataManager.loadMapData;
DataManager.loadMapData = function (mapId) {
	MATTIE.eventAPI.DataManager_loadMapData.call(this, mapId);
	MATTIE.eventAPI.setupRunTimeDataEvents();
};

MATTIE.eventAPI.orgSetEventup = Game_Map.prototype.setupEvents;
Game_Map.prototype.setupEvents = function () {
	MATTIE.eventAPI.orgSetEventup.call(this);

	MATTIE.eventAPI.setupRunTimeGameEvents();
};

/**
 * @description get a Game event obj from id and map id
 * @param {int} id event id
 * @param {int} mapId mapid
 * @returns {rm.types.Event}
 */
MATTIE.eventAPI.getEventOnMap = function (id, mapId, maxTime = 1000) {
	return new Promise((res) => {
		setTimeout(() => {
			res();
		}, maxTime);
		const url = 'data/Map%1.json'.format(mapId.padZero(3));
		const xhr = new XMLHttpRequest();

		xhr.open('GET', url, false);
		xhr.overrideMimeType('application/json');

		xhr.onload = function () {
			if (xhr.status < 400) {
				const mapData = JSON.parse(xhr.responseText);

				if (!(id in mapData.events)) {
					console.error('Error getting event data. Check to make sure an event with that specific id exists on the map.');
					res(null);
				} else {
					res(mapData.events[id]);
				}
			}
		};

		xhr.onerror = function () {
			console.error('Error getting map data. Check to make sure a map with that specific id exists.');
			res(null);
		};

		xhr.send();
	});
};

/**
 * @description create an enemy from an existing enemy handling death with a self switch
 * the self switch "A" will be used for the death page
 * the self switch "B" is used to signal if the player is in combat with it or not
 * @param {*} mapId the map of the original enemy
 * @param {*} eventId the id of the original enemy
 * @param {*} alivePageId the alive page of the original enemy
 * @param {*} deadPageId the dead page of the original enemy
 */
MATTIE.eventAPI.createEnemyFromExisting = function (mapId, eventId, alivePageId, deadPageId) {
	const enemy = new MapEvent();
	const baseEnemy = new MapEvent();
	baseEnemy.copyActionsFromEventOnMap(eventId, mapId); // create copy of crow mauler obj
	const alivePage = baseEnemy.data.pages[alivePageId];
	const deadPage = baseEnemy.data.pages[deadPageId];

	enemy.data.pages[0] = alivePage;
	enemy.data.pages[0].conditions = enemy.setDefaultConditions();
	// set up changing self switch on victory
	const indexOfIfWinCmd = enemy.indexOfCommandOnPage(0, MATTIE.static.commands.ifWin);
	const indent = alivePage.list[alivePage.list.length - 1].indent + 1;
	enemy.addCommandAfterIndex(0, indexOfIfWinCmd, enemy.createCommand(MATTIE.static.commands.selfSwitch, ['A', 0], indent));

	enemy.addPage();
	// set up conditions for death page
	enemy.data.pages[1] = deadPage;
	enemy.data.pages[1].conditions = enemy.setDefaultConditions();
	enemy.data.pages[1].conditions.selfSwitchValid = true;
	enemy.setPersist(true);
	return enemy;
};

MATTIE.eventAPI.removePersistingEvent = function (eventId) {
	delete MATTIE.eventAPI.dataEvents[eventId];
};

MATTIE.eventAPI.marriageAPI = {};
/**
 * @description display sex between the two actors specified (will default to Cahara+Enki if a solution cannot be found)
 * @param {*} actorId1 the id of the first actor
 * @param {*} actorId2 the id of the second actor
 * @param {*} x the x pos on the map to display the sex
 * @param {*} y the y pos on the map to display the sex
 * @returns {MapEvent} the map event that was created
 */
MATTIE.eventAPI.marriageAPI.displaySex = function (actorId1, actorId2, x, y, spawn = true) {
	const marriage = new MapEvent();
	// marriage.setPersist(false);
	marriage.copyActionsFromEventOnMap(84, 1); // copy event from the first room ritual circle
	/** @description a dict mapping the actor index to the page index that the game uses for this marriage */

	// map all ghouls to be id 16
	const ghoulIds = [16, 17, 18];
	if (ghoulIds.includes(actorId1)) actorId1 = 16;
	if (ghoulIds.includes(actorId2)) actorId2 = 16;

	const mappings = [
		{
			id1: 1, id2: 16, pageIndex: 5, characterImage: '$love_mercenary_ghoul',
		}, // merc ghoul
		{
			id1: 3, id2: 16, pageIndex: 6, characterImage: '$love_knight_ghoul',
		}, // knight ghoul
		{
			id1: 4, id2: 16, pageIndex: 7, characterImage: '$love_darkpriest_ghoul',
		}, // priest ghoul
		{
			id1: 5, id2: 16, pageIndex: 8, characterImage: '$love_outlander_ghoul',
		}, // outlander ghoul
		{
			id1: 9, id2: 16, pageIndex: 10, characterImage: '$love_marriage_ghoul',
		}, // marriage ghoul

		{
			id1: 3, id2: 6, pageIndex: 11, characterImage: '$love_captain_knight',
		}, // knight legarde
		{
			id1: 1, id2: 3, pageIndex: 12, characterImage: MATTIE.util.randChance(0.5) ? '$love_knight_mercenary' : '$love_knight_mercenary_bottom',
		}, // knight merc
		{
			id1: 5, id2: 3, pageIndex: 13, characterImage: '$love_outlander_knight',
		}, // outlander knight
		{
			id1: 1, id2: 5, pageIndex: 14, characterImage: '$love_outlander_mercenary',
		}, // outlander merc
		{
			id1: 1, id2: 6, pageIndex: 15, characterImage: '$love_captain_mercenary',
		}, // legard merc

		{
			id1: 9, id2: 1, pageIndex: 16, characterImage: '$love_marriage_mercenary',
		}, // marriage merc
		{
			id1: 1, id2: 4, pageIndex: 17, characterImage: '$love_darkpriest_mercenary',
		}, // dark merc
		{
			id1: 1, id2: 1, pageIndex: 17, characterImage: '$love_mercenary_mercenary',
		}, // merc merc
		{
			id1: 4, id2: 4, pageIndex: 17, characterImage: '$love_darkpriest_darkpriest',
		}, // dark dark
		{
			id1: 3, id2: 3, pageIndex: 17, characterImage: '$love_knight_knight',
		}, // knight knight
		{
			id1: 5, id2: 5, pageIndex: 17, characterImage: '$love_outlander_outlander',
		}, // outlander outlander
		{
			id1: 4, id2: 3, pageIndex: 17, characterImage: '$love_knight_darkpriest',
		}, // knight darkpriest
	];

	const findMapping = function (id1, id2) {
		const defaultMapping = mappings[11];
		for (let index = 0; index < mappings.length; index++) {
			const element = mappings[index];
			if ((element.id1 == id1 && element.id2 == id2) || (element.id2 == id1 && element.id1 == id2)) {
				return element;
			}
		}
		return defaultMapping;
	};

	const mapping = findMapping(actorId1, actorId2);

	// set to only have the one page that we want
	marriage.data.pages = [marriage.data.pages[mapping.pageIndex]];
	marriage.setChar(0, mapping.characterImage);

	marriage.data.pages[0].conditions = marriage.setDefaultConditions();
	marriage.data.pages[0].trigger = 0;
	marriage.data.pages[0].list = [];
	marriage.data.pages[0].directionFix = true;
	marriage.addSpokenText(0, '[Intense Moaning]', `${$gameActors.actor(actorId1).name()} & ${$gameActors.actor(actorId2).name()}`);
	marriage.addText(0, 'Best not to interrupt them.');

	if (spawn) { marriage.spawn(x, y); }

	return marriage;
};

/**
 * @description display a marriage (will default to Cahara+Enki if a solution cannot be found)
 * @param {int} actorId1 the id of the first actor
 * @param {int} actorId2 the id of the second actor
 * @param {bool} success whether the marriage is successful or failed
 * @param {int} x the x pos on the map to display the marriage
 * @param {int} y the y pos on the map to display the marriage
 * @returns {MapEvent} the map event that was created
 */
MATTIE.eventAPI.marriageAPI.displayMarriage = function (actorId1, actorId2, success, x, y, spawn = true) {
	// up is failed marriage
	// left starts to merge
	// right is sex
	// down is mostly merged
	const sexEvent = this.displaySex(actorId1, actorId2, x, y, false);

	sexEvent.data.pages[0].list = [];
	sexEvent.data.pages[0].trigger = 4;
	sexEvent.data.pages[0].directionFix = false;

	// failed marriage commands
	if (!success) {
		sexEvent.data.pages[1] = JsonEx.makeDeepCopy(sexEvent.data.pages[0]);
		sexEvent.addSpokenText(1, 'Whheeezee....', 'Amalgam of Flesh');
	} else {
		sexEvent.addPage();
	}

	sexEvent.data.pages[1].conditions = sexEvent.setDefaultConditions();
	sexEvent.data.pages[1].conditions.selfSwitchValid = true;
	sexEvent.data.pages[1].directionFix = true;
	sexEvent.data.pages[1].trigger = 0;

	// marriage commands
	sexEvent.addMoveRoute(0, Game_Character.ROUTE_TURN_RIGHT, true);
	sexEvent.addWait(0, 90);
	sexEvent.addTintScreen(0, MATTIE.fxAPI.formatTint(-155, -155, -155, 0), 40, true);
	sexEvent.addMoveRoute(0, Game_Character.ROUTE_TURN_LEFT, true);
	sexEvent.addWait(0, 90);
	sexEvent.addTintScreen(0, MATTIE.fxAPI.formatTint(-155, -155, -155, 0), 40, true);
	sexEvent.addMoveRoute(0, Game_Character.ROUTE_TURN_DOWN, true);
	sexEvent.addWait(0, 90);
	sexEvent.addTintScreen(0, MATTIE.fxAPI.formatTint(-255, -255, -255, 0), 70, true);
	if (!success) {
		sexEvent.addMoveRoute(0, Game_Character.ROUTE_TURN_UP, true);
	}
	sexEvent.addWait(0, 90);
	sexEvent.addTintScreen(0, MATTIE.fxAPI.formatTint(-255, -255, -255, 0), 70, false);
	sexEvent.addWait(0, 35);
	sexEvent.addCommand(0, 123, ['A', 0]); // set self switch

	sexEvent.setPersist(!success);
	if (spawn) { sexEvent.spawn(x, y); }
	return sexEvent;
};
