var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};

MATTIE.multiplayer.createGameObj = DataManager.createGameObjects;
DataManager.createGameObjects = function () {
	MATTIE.multiplayer.createGameObj.call(this);
	$netActors = new MATTIE.multiplayer.NetActors();
	try {
		MATTIE.multiplayer.getCurrentNetController().player.$gamePlayer = $gamePlayer;
	} catch (error) {
		console.log('could not create local player');
	}
};

MATTIE.multiplayer.extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function (contents) {
	MATTIE.multiplayer.extractSaveContents.call(this, contents);
	try {
		MATTIE.multiplayer.getCurrentNetController().player.$gamePlayer = $gamePlayer;
	} catch (error) {
		console.log('could not create local player');
	}
};
/** a simple class containing the game actor and the assosiated dataActor id (for clean up) */
MATTIE.multiplayer.NetActor = function () {
	this.initialize.apply(this, arguments);
};
MATTIE.multiplayer.NetActor.prototype.initialize = function (gameActor, dataActorId, baseActorId, netId) {
	this.gameActor = gameActor;
	this.gameActor.isNetActor = true;
	this.gameActor.netID = netId;
	this.dataActorId = dataActorId;
	this.baseActorId = baseActorId;
};

/** the wrapper class of an array of net actors */
MATTIE.multiplayer.NetActors = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.multiplayer.NetActors.prototype.initialize = function () {
	this._data = [];
};

MATTIE.multiplayer.NetActors.prototype.setPeerId = function (id) {
	this.peerId = id;
};

/**
 * @description perform a deep copy of the dataActor and create a new net actor from this
 * @param {*} baseActorId the id of the base game actor to copy data from
 */
MATTIE.multiplayer.NetActors.prototype.createNewNetActor = function (baseActorId) {
	if (!this.bloodGolemInited) {
		this.bloodGolemInited = true;
		this.createNewNetActor(MATTIE.static.actors.bloodGolemId);
	}// all parties have blood golem just to make stuff easier
	const newDataActor = JsonEx.makeDeepCopy($dataActors[baseActorId]);
	$dataActors.push(newDataActor);
	const dataActorId = $dataActors.length - 1;
	$dataActors[dataActorId].peerId = this.peerId;
	const newNetActor = new MATTIE.multiplayer.NetActor(new Game_Actor(dataActorId), dataActorId, baseActorId, this.peerId);
	$gameActors.actor(dataActorId).peerId = this.peerId;
	newNetActor.peerId = this.peerId;
	console.log(newNetActor.peerId);
	this._data.push(newNetActor);
};

/**
 * @description get the game actor of a net actor id
 * @param {*} netActorId the net actor id to find
 * @returns {Game_Actor}
 */
MATTIE.multiplayer.NetActors.prototype.actor = function (netActorId) {
	const data = this._data[netActorId];
	if (data) return data.gameActor;
	return null;
};

/**
 * @description get the game actor of a net actor
 * @param {*} netActorId the if of the base Actor to find
 * @returns {Game_Actor}
 */
MATTIE.multiplayer.NetActors.prototype.baseActor = function (baseActorId) {
	let actor = null;
	for (let index = 0; index < this._data.length; index++) {
		const element = this._data[index];
		if (element.baseActorId == baseActorId) {
			actor = element.gameActor;
			return actor;
		}
	}

	return null;
};

/**
 * @description get the game actor of a net actor
 * @param {*} netActorId the if of the data Actor to find
 * @returns {Game_Actor}
 */
MATTIE.multiplayer.NetActors.prototype.dataActor = function (baseActorId) {
	for (let index = 0; index < this._data.length; index++) {
		const element = this._data[index];
		if (element.dataActorId == baseActorId) {
			actor = element.gameActor;
			return actor;
		}
	}
	return null;
};

MATTIE.multiplayer.NetActors.prototype.netActor = function (id) {
	for (let index = 0; index < this._data.length; index++) {
		const element = this._data[index];
		if (element.dataActorId == id) {
			actor = element;
			return actor;
		}
	}
	return null;
};

MATTIE.multiplayer.NetActors.prototype.length = function () {
	return this._data.length;
};

/**
 * @description remove a net actor from $netActors and remove associated dataActor
 * @param {*} netActorId the id of the net actor to remove from the array of net actors
 */
MATTIE.multiplayer.NetActors.prototype.removeNetActor = function (netActorId) {
	this.removeNetDataActor(netActorId);
	this._data[netActorId] = null;
};

/**
 * @description remove the data actor from $dataActors
 * @param {*} netActorId the id of the net actor
 */
MATTIE.multiplayer.NetActors.prototype.removeNetDataActor = function (netActorId) {
	const dataActorId = this._data[netActorId].dataActorId;
	$dataActors[dataActorId] = null;
};
