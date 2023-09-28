//= ============================================================================
// EventWrapper.js
//= ============================================================================

/*:
 * @plugindesc A simple wrapper for creating and handling events in your plugins. Press Help to see usage info.
 * @author Alphaxaon
 *
 * @help // Create a new event
 * var event = new MapEvent();
 *
 * // Copy actions from another event with the specified id
 * event.copyActionsFromEvent(1);
 *
 * // Copy actions from another event that exists on the map with the specified id
 * event.copyActionsFromEventOnMap(1, 4);
 *
 * // Copy actions from a Common Event with the specified id
 * event.copyActionsFromCommonEvent(1);
 *
 * // Spawn the event at the specified coordinates
 * event.spawn(11, 7);
 */

var MATTIE = MATTIE || {};
MATTIE.eventAPI = MATTIE.eventAPI || {};
MATTIE.eventAPI.dataEvents = MATTIE.eventAPI.dataEvents || {};
let val = 999;
class MapEvent {
	/**
     * The constructor for a new map event.
     */
	constructor() {
		const id = this.setId();

		this.data = {
			id,
			name: `EV${id.padZero(3)}`,
			note: '',
			pages: [],
			x: 0,
			y: 0,
			meta: {},
			mapId: $gameMap.mapId(),
			persist: true,
		};

		this.addPage();
	}

	/**
     * Automatically set the id for the event.
     */
	setId() {
		val++;
		if ($dataMap) {
			if ($dataMap.events) {
				let openIndex = $dataMap.events.length + Object.keys(MATTIE.eventAPI.dataEvents).length - 2;
				do {
					openIndex++;
				} while ($gameMap.event(openIndex));

				val = openIndex;
			}
		}
		return val;
	}

	setPersist(bool) {
		this.data.persist = bool;
	}

	/**
     * Add a new page for the event's actions.
     */
	addPage() {
		this.data.pages.push({
			conditions: this.setDefaultConditions(),
			directionFix: true,
			image: MapEvent.setDefaultImage(),
			list: [],
			moveFrequency: 3,
			moveRoute: this.setDefaultMoveRoute(),
			moveSpeed: 3,
			moveType: 0,
			priorityType: 0,
			stepAnime: true, // this makes most things animate
			through: false,
			trigger: 0,
			walkAnime: true,
		});
	}

	/**
     * Set the default event conditions for a page of actions.
     */
	setDefaultConditions() {
		return {
			actorId: 1,
			actorValid: false,
			itemId: 1,
			itemValid: false,
			selfSwitchCh: 'A',
			selfSwitchValid: false,
			switch1Id: 1,
			switch1Valid: false,
			switch2Id: 1,
			switch2Valid: false,
			switch3Id: 1,
			switch3Valid: false,
			switch4Id: 1,
			switch4Valid: false,
			variableValue: 0,
		};
	}

	/**
     * Set the default event image for a page of actions.
     */
	static setDefaultImage() {
		return this.generateImage(0, '', 2, 0, 0);
	}

	/**
     *
     * @param {*} index the index of the char, 3 cols per index
     * @param {*} name the name of the char sheet to use
     * @param {*} dir the dir they are facing, 2,4,6,8
     * @param {*} pattern
     * @param {*} tile tile id not sure
     * @returns obj
     */
	static generateImage(index, name, dir, pattern, tile) {
		return {
			characterIndex: index,
			characterName: name,
			direction: dir,
			pattern,
			tileId: tile,
		};
	}

	/**
     * @description change the image of a page
     * @param {*} pageId
     * @param {*} imageObj
     */
	setImage(pageId, imageObj) {
		this.data.pages[pageId].image = imageObj;
	}

	/**
     *
     * @param {*} pageId
     * @param {*} command
     * @param {*} parameters
     */
	addCommand(pageId, command, parameters, indent = 0) {
		this.data.pages[pageId].list.push(this.createCommand(command, parameters, indent));
	}

	/**
     * @description create a command obj from these params
     * @param {*} command the command code
     * @param {*} parameters array of params
     * @param {*} indent optional
     * @returns {rm.types.Event}
     */
	createCommand(command, parameters, indent = 0) {
		const cmd = {};
		cmd.code = command;
		cmd.parameters = parameters;
		cmd.indent = indent;
		cmd.eventId = this.data.id;
		return cmd;
	}

	/**
     * Set the default move route for a page of actions.
     */
	setDefaultMoveRoute() {
		return {
			list: [
				{
					code: 0,
					parameters: [],
				},
			],
			repeat: true,
			skippable: false,
			wait: false,
		};
	}

	/**
     * Set the name of the event.
     *
     * @param name (string)
     */
	setName(name) {
		this.data.name = name;
	}

	/**
     * Set the note of the event.
     *
     * @param note (string)
     */
	setNote(note) {
		this.data.note = note;
	}

	/**
     * Set the map coordinates of the event.
     *
     * @param x (int)
     * @param y (int)
     */
	setPosition(x, y) {
		this.data.x = x;
		this.data.y = y;
	}

	/**
     * Get the last Event object stored in $dataMap.
     */
	getLastEvent() {
		return $dataMap.events[$dataMap.events.length - 1];
	}

	/**
     * Create a new Game_Event object and store it in $gameMap.
     */
	createGameEvent() {
		console.log(MATTIE.eventAPI.dataEvents[this.data.id]);
		$dataMap.events[this.data.id] = MATTIE.eventAPI.dataEvents[this.data.id];
		$gameMap._events[this.data.id] = (new Game_Event($gameMap.mapId(), this.data.id));
		if (!$dataMap.events[this.data.id]) $dataMap.events[this.data.id] = undefined; // if data is null set it to undefined instead
		return $gameMap.event(this.data.id);
	}

	/**
     * Create a new Sprite_Character and store it in the current scene's Spriteset_Map.
     *
     * @param event (Game_Event)
     */
	createCharacterSprite(event) {
		SceneManager._scene._spriteset._characterSprites.push(new Sprite_Character(event));

		return SceneManager._scene._spriteset._characterSprites[SceneManager._scene._spriteset._characterSprites.length - 1];
	}

	/**
     * Add a sprite to the current scene's Tilemap.
     *
     * @param sprite (Sprite_Character)
     */
	addSpriteToTilemap(sprite) {
		SceneManager._scene._spriteset._tilemap.addChild(sprite);
	}

	/**
     * Copy actions from another event on the same map with the specified id.
     *
     * @param id (int)
     */
	copyActionsFromEvent(id) {
		this.data.pages = $dataMap.events[id].pages;
	}

	/**
     * Copy actions from another event on map with the specified id.
     *
     * @param id (int)
     * @param mapId (int)
     */
	copyActionsFromEventOnMap(id, mapId) {
		const url = 'data/Map%1.json'.format(mapId.padZero(3));
		const xhr = new XMLHttpRequest();

		xhr.open('GET', url, false);
		xhr.overrideMimeType('application/json');

		xhr.onload = function () {
			if (xhr.status < 400) {
				const mapData = JSON.parse(xhr.responseText);

				if (!(id in mapData.events)) {
					console.error('Error getting event data. Check to make sure an event with that specific id exists on the map.');
				} else {
					this.data.pages = mapData.events[id].pages;
				}
			}
		}.bind(this);

		xhr.onerror = function () {
			console.error('Error getting map data. Check to make sure a map with that specific id exists.');
		};

		xhr.send();
	}

	/**
     * Copy actions from a Common Event with the specified id.
     *
     * @param id (int)
     */
	copyActionsFromCommonEvent(id) {
		this.data.pages = [];
		this.addPage();

		this.data.pages[0].list = $dataCommonEvents[id].list;
	}

	/**
     * Place the event on the map at the specified coordinates.
     *
     * @param x (int)
     * @param y (int)
     */
	spawn(x, y) {
		MATTIE.eventAPI.dataEvents[this.data.id] = (this.data);
		if (this.data.mapId === $gameMap.mapId()) {
			this.setPosition(x, y);
			this.refresh();
			console.log('New event created!');
		}
	}

	removeThisEvent() {
		MATTIE.eventAPI.dataEvents[this.data.id] = undefined;
		delete MATTIE.eventAPI.dataEvents[this.data.id];
	}

	refresh() {
		try {
			const event = this.createGameEvent();
			const sprite = this.createCharacterSprite(event);
			this.addSpriteToTilemap(sprite);
		} catch (error) {
			console.error(error);
		}
	}

	/**
     * @description return an array of all command codes on page
     * @param {*} page page index
     */
	getListOfCommandCodesOnPage(page) {
		return this.data.pages[page].list.map((cmd) => cmd.code);
	}

	/**
     * @description returns the index of the first occurence of the command code on the page
     * @param {*} commandCode command code
     * @param {*} page page index
     */
	indexOfCommandOnPage(page, commandCode) {
		const list = this.getListOfCommandCodesOnPage(page);
		return list.indexOf(commandCode);
	}

	/**
     * @description add
     * @param {*} index the index in the list of commands to add this command after
     * @param {*} command the command obj to add
     * @param {int} pageIndex the page index of the page to add the command to
     */
	addCommandAfterIndex(pageIndex, index, command) {
		const page = this.data.pages[pageIndex];
		const secondHalf = page.list.slice(index + 2);
		page.list = page.list.slice(0, index + 1);
		page.list.push(command);
		page.list = page.list.concat(secondHalf);
		this.data.pages[pageIndex] = page;
	}

	/**
     * @description check a self switch of this event
     * @param {*} letter the letter of the self switch
     * @returns {boolean} whether the switch is true or false
     */
	checkSelfSwitch(letter) {
		return $gameSelfSwitches.value($gameSelfSwitches.formatKey(this.data.mapId, this.data.id, letter));
	}
}

/**
 * Hook into original functions.
 */
(function () {
	// Extend the clearTransferInfo function
	const { clearTransferInfo } = Game_Player.prototype;

	// When a transfer is complete and info is being cleared
	Game_Player.prototype.clearTransferInfo = function () {
		clearTransferInfo.call(this);

		// Get all existing event ids
		const eventIds = [];
		Object.keys(MATTIE.eventAPI.dataEvents).forEach((key) => {
			const event = MATTIE.eventAPI.dataEvents[key];
			if (event) eventIds.push(event.id);
		});
		$dataMap.events.forEach((object) => {
			if (object === null) { return; }

			eventIds.push(object.id);
		});

		// Clear self switches for non-existing events
		for (const key in $gameSelfSwitches._data) {
			if (key) {
				const ids = key.split(',');
				const mapId = Number(ids[0]);
				const eventId = Number(ids[1]);

				// if (mapId != $gameMap._mapId) { continue; }

				if (!eventIds.contains(eventId)) { delete $gameSelfSwitches._data[key]; }
			}
		}
	};
}());
