var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};

MATTIE.multiplayer.Conversations = function () {
	this.firstContact = true;
	this.targetName = '';
	this.targetPeerId = null;
	/** @type {PlayerModel} */
	this.target = null;
};

MATTIE.multiplayer.Conversations.prototype.greetings = [
	'Hello there',
	'The Dungeons of Fear and hunger truly are beautiful today',

];
/**
 * @description the main talk option that handles all conversation
 * @param {int} localId the id of the local player
 * @param {PlayerModel} target the id of the target player
 */
MATTIE.multiplayer.Conversations.prototype.talk = function (localId, target) {
	this.targetName = target.name;
	this.targetPeerId = target.peerId;
	this.target = target;
	if (this.firstContact) {
		this.firstContactMsg();
	} else {
		this.talkOptions();
	}
};

/**
 * @description a function to either try to resurrect the player or say they are not dead
 */
MATTIE.multiplayer.Conversations.prototype.resurrect = function () {
	if (this.target.canResurrect()) {
		setTimeout(() => {
			// eslint-disable-next-line no-nested-ternary
			const msg = MATTIE.multiplayer.config.scaling.resurrectionActorCost
				? 'An Unknown God demands a sacrifice and a soul.'
				: MATTIE.multiplayer.config.scaling.resurrectionItemCost
					? 'An Unknown God demands a soul in return'
					: 'An Unknown God seems to offer some kindness, perhaps in another world, you showed it kindness.';

			MATTIE.msgAPI.showChoices(['Continue', 'Cancel'], 1, 1, (n) => {
				if (n == 0) {
					if (MATTIE.multiplayer.config.scaling.resurrectionCost()) {
						this.target.resurrect();
						this.nameSpeak('An Unknown God', 'I bring life');
					} else if (MATTIE.multiplayer.config.scaling.resurrectionActorCost) {
						this.nameSpeak('An Unknown God', 'Life is not cheep, do not take it lightly');
					} else if (MATTIE.multiplayer.config.scaling.resurrectionItemCost) {
						this.nameSpeak('An Unknown God', 'Life is not cheep, a soul for a soul');
					}
				}
			}, msg);
		}, 100);
	} else {
		this.speak('I am not dead.');
	}
};
/**
 * @description form a marriage with the target player or display they are not willing if they don't concent
 * @param {*} otherPlayerIsWilling whether the other player concents or not.
 */
MATTIE.multiplayer.Conversations.prototype.marry = function (otherPlayerIsWilling) {
	if (otherPlayerIsWilling) {
		MATTIE.fxAPI.hidePlayer(8000);
		MATTIE.fxAPI.lockPlayer(8000);
		MATTIE.eventAPI.marriageAPI.displayMarriage($gameParty.leader().actorId(), this.target.$gamePlayer.actorId, true, $gamePlayer.x, $gamePlayer.y);
	} else {
		MATTIE.msgAPI.displayMsg(`${this.targetName} is NOT willing.`);
	}
};

MATTIE.multiplayer.Conversations.prototype.speak = function (msg) {
	setTimeout(() => {
		MATTIE.msgAPI.displayMsgWithTitle(this.targetName, msg);
	}, 100);
};

MATTIE.multiplayer.Conversations.prototype.nameSpeak = function (name, msg) {
	setTimeout(() => {
		MATTIE.msgAPI.displayMsgWithTitle(name, msg);
	}, 100);
};
/**
 * @description the cb of the main talk options
 * @param {*} n index that was chosen
 */
MATTIE.multiplayer.Conversations.prototype.talkOptionsCb = function (n) {
	switch (n) {
	case 0: // Talk
		this.greeting();
		break;
	case 1: // Trade
		SceneManager.push(Scene_Menu);
		SceneManager.push(MATTIE.scenes.Scene_DropItem);
		break;
	case 2: // Resurrect
		this.resurrect();
		break;
	case 3: // Attack
		this.nameSpeak('Mattie', 'You try to attack');
		MATTIE.multiplayer.pvp.PvpController.emitCombatStartWith(this.targetPeerId);
		MATTIE.multiplayer.pvp.PvpController.startCombatWith(this.targetPeerId);
		break;
	case 4: // Show Love
		// trigger net event for proccessing marriage concent
		// eslint-disable-next-line no-case-declarations
		const otherPlayerIsWilling = true;
		this.marry(otherPlayerIsWilling);
		break;
	case 5: // cancel
		break;
	default:
		break;
	}
};
/**
 * @description display the main choices
 */
MATTIE.multiplayer.Conversations.prototype.talkOptions = function () {
	MATTIE.msgAPI.showChoices(
		[
			'Talk',
			'Trade',
			'Resurrect',
			'Attack',
			'Show Love',
			'Cancel',
		],
		0,
		5,
		(n) => this.talkOptionsCb(n),
		`You talk to ${this.targetName}`,
	);
};

MATTIE.multiplayer.Conversations.prototype.firstContactMsg = function () {
	MATTIE.msgAPI.displayMsgWithTitle(this.targetName, 'Hello there');
	this.firstContact = false;
};

MATTIE.multiplayer.Conversations.prototype.greeting = function () {
	MATTIE.msgAPI.displayMsgWithTitle(this.targetName, 'Hello there');
};
