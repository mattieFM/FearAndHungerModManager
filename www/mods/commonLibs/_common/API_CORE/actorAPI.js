/* eslint-disable no-unused-expressions */
/* eslint-disable max-classes-per-file */

/**
 * @namespace MATTIE.actorAPI
 * @description The main API the modding engine uses to perform any actions regarding actors
 */
MATTIE.actorAPI = MATTIE.actorAPI || {};

/**
 * @description force the first actor in the battlemembers function to always be i
 * @param {int} i actorid
 */
MATTIE.actorAPI.forceMainChar = function (i) {
	const lastBattleMembers = Game_Party.prototype.battleMembers;
	Game_Party.prototype.battleMembers = function () {
		const val = lastBattleMembers.call(this);
		val[0] = $gameActors.actor(i);

		return val;
	};
};

/**
 *  @description A class that wraps data actor information allowing easy creation of data actors.
 * */
MATTIE.actorAPI.Data_Actor_Wrapper = class {
	constructor(params) {
		/**
         * @description the actual data actors data for this wrapper
         * @type {MATTIE.actorAPI.Data_Actor}
         */
		this._data = this.buildDefaultDataActor();

		/**
         * @description an array of skills to teach to the actor once created
         */
		this.skills = [];
	}

	/**
     * @param {boolean} shouldSet, whether to set this._data to the result
     * @returns {MATTIE.actorAPI.Data_Actor} with default values
     */
	buildDefaultDataActor(shouldSet = true) {
		/** @type {MATTIE.actorAPI.Data_Actor} */
		const dataActor = new MATTIE.actorAPI.Data_Actor();
		dataActor.battlerName = '';
		dataActor.characterName = '';
		dataActor.characterIndex = 0;
		dataActor.classId = 1;
		dataActor.equips = [];
		dataActor.faceIndex = 0;
		dataActor.faceName = '';
		dataActor.traits = [];
		dataActor.initialLevel = 2;
		dataActor.maxLevel = 99;
		dataActor.name = '';
		dataActor.note = '';
		dataActor.profile = '';
		if (shouldSet) this._data = dataActor;
		return dataActor;
	}

	/**
     * @param {rm.types.Actor} actor
     * @param {boolean} shouldSet, whether to set this._data to the result
     * @returns {MATTIE.actorAPI.Data_Actor} with default values
     */
	buildDataActorFromExistingActor(actor, shouldSet = true) {
		/** @type {MATTIE.actorAPI.Data_Actor} */
		const dataActor = new MATTIE.actorAPI.Data_Actor();
		dataActor.battlerName = actor.battlerName;
		dataActor.characterName = actor.characterName;
		dataActor.characterIndex = actor.characterIndex;
		dataActor.classId = actor.classId;
		dataActor.equips = actor.equips;
		dataActor.faceIndex = actor.faceIndex;
		dataActor.faceName = actor.faceName;
		dataActor.traits = actor.traits;
		dataActor.initialLevel = actor.initialLevel;
		dataActor.maxLevel = actor.maxLevel;
		dataActor.name = actor.name;
		dataActor.nickname = actor.nickname;
		dataActor.note = actor.note;
		dataActor.profile = actor.profile;

		if (shouldSet) this._data = dataActor;
		return dataActor;
	}

	/**
     * @description create a data actor from game event and game troop
     * @param {rm.types.Event} gameEvent
     * @param {rm.types.Troop} gameTroop
     * @param {boolean} shouldSet, whether to set this._data to the result
     */
	buildDataActorFromEventAndTroop(gameEvent, gameTroop, page = 0) {
		this.buildDataActorFromExistingActor($dataActors[1]);
		const { members } = gameTroop;
		const traits = [];
		let note = '';
		members.forEach((member) => {
			const enemy = $dataEnemies[member.enemyId];
			if (enemy.traits) {
				if (enemy.traits.length > 0) traits.concat(enemy.traits);
			}
			if (enemy.note)note = enemy.note;
			enemy.actions.forEach((action) => {
				this.skills.push(action.skillId);
			});
		});

		this._data.characterName = gameEvent.pages[page].image.characterName;
		this._data.characterIndex = gameEvent.pages[page].image.characterIndex;
		this._data.traits = traits;
		this._data.name = gameTroop.name;
		this._data.nickname = '';
		this._data.note = note;

		return this._data;
	}

	/**
     * @description gets the traits of the first data actor and assumes these are default
     * @returns the default traits for a dataActor
     */
	getDefaultTraits() {
		const fearAndHunger1 = $dataActors[1].traits;
		if (MATTIE.global.version === 1) return fearAndHunger1;
		return [];
	}

	/**
     * @description gets the equip of the first data actor and assumes these are default
     * @returns the default equip for a dataActor
     */
	getDefaultEquip() {
		const fearAndHunger1 = $dataActors[1].equips;
		if (MATTIE.global.version === 1) return fearAndHunger1;
		return [];
	}

	/**
     * @description add this dataActor to the list of $dataActors
     */
	create() {
		const dataClass = new MATTIE.actorAPI.Data_Class();
		this.skills.forEach((skillId) => {
			dataClass.addDefaultLearning(skillId);
		});
		dataClass.data.name = this._data.name;
		dataClass.data.note = this._data.note;
		dataClass.create();
		this._data.classId = dataClass.data.id;
		this._data.id = $dataActors.length;

		if (Yanfly) {
			this._data.plusParams = [0, 0, 0, 0, 0, 0, 0, 0];
			this._data.rateParams = [1, 1, 1, 1, 1, 1, 1, 1];
			this._data.flatParams = [0, 0, 0, 0, 0, 0, 0, 0];
			this._data.maxParams = [];
			this._data.minParams = [];
			// DataManager.processBPCNotetags1([this._data]);
		}

		$dataActors[$dataActors.length] = this._data;
		$gameActors.actor($dataActors.length - 1);
	}

	/** @description replace the actor at this index with this actor */
	replace(i) {
		$dataActors[i] = this._data;
		console.log($dataActors[i]);
		$gameActors._data[i] = false;
		console.log($gameActors._data[i]);
		$gameActors.actor(i);
	}
};

/** @description an object that models a DataClass */
MATTIE.actorAPI.Data_Class = class {
	constructor() {
		/** @type {rm.types.Actor} */
		this.data = {};

		/**
         * @description the xp curve of this class
         * @type {int}
         * */
		this.data.expParams = this.defaultExpParam();
		/**
         * @description an array of the traits of this class
         * @type {rm.types.Trait[]}
         */
		this.data.traits = this.defaultTraits();

		/**
         * @description an array of skill ids to learn and the levels
         * @type {rm.types.ClassLearning[]}
         */
		this.data.learnings = this.defaultLearnings();

		/**
         * @description the name of the class
         * @type {string}
         */
		this.data.name = this.defaultName();

		/**
         * @description the note of the class
         * @type {string}
         */
		this.data.note = this.defaultNote();

		/**
         * @description A massive array of ints
         * @type {int[]}
         */
		this.data.params = this.defaultParams();

		/**
         * @description the id of the class
         * defined in the create method
         */
		this.data.id;
	}

	/**
	 * @description add a skill to the array of default known skills IE: lvl 1 available skills
	 * @param {int} skillId the id of the skill to add
	 */
	addDefaultLearning(skillId) {
		/** @type {rm.types.ClassLearning} */
		const learning = {};
		learning.level = 1;
		learning.skillId = skillId;
		learning.note = '';

		this.data.learnings.push(learning);
	}

	/** @returns a deepcopy of the expParams of the first actor */
	defaultExpParam() {
		return JsonEx.makeDeepCopy($dataClasses[1].expParams);
	}

	/** @returns a deepcopy of the traits of the first actor */
	defaultTraits() {
		return JsonEx.makeDeepCopy($dataClasses[1].traits);
	}

	/** @returns a deepcopy of the learnings of the first actor */
	defaultLearnings() {
		return JsonEx.makeDeepCopy($dataClasses[1].learnings);
	}

	/** @returns a deepcopy of the name of the first actor */
	defaultName() {
		return JsonEx.makeDeepCopy($dataClasses[1].name);
	}

	/** @returns a deepcopy of the note of the first actor */
	defaultNote() {
		return JsonEx.makeDeepCopy($dataClasses[1].note);
	}

	/** @returns a deepcopy of the params of the first actor */
	defaultParams() {
		return JsonEx.makeDeepCopy($dataClasses[1].params);
	}

	/**
	 * @description add this data class to the global runtime array of data classes $dataClasses
	 * @returns null
	 */
	create() {
		this.data.id = $dataClasses.length;
		if (Yanfly) {
			this.data.plusParams = [0, 0, 0, 0, 0, 0, 0, 0];
			this.data.rateParams = [1, 1, 1, 1, 1, 1, 1, 1];
			this.data.flatParams = [0, 0, 0, 0, 0, 0, 0, 0];
			this.data.maxParams = [];
			this.data.minParams = [];
			// DataManager.processBPCNotetags1([this._data]);
		}
		$dataClasses[$dataClasses.length] = this.data;
	}
};

/**
 * @description a class to model a data actor json object
 */
MATTIE.actorAPI.Data_Actor = class {
	constructor(params) {
		/**
         * @description The file name of the actor's battler graphic.
         * @type {string}
         */
		this.battlerName;
		/**
         * @description The index (0..7) of the actor's walking graphic.
         * @type {int}
         */
		this.characterIndex;
		/**
         * @descriptionThe file name of the actor's walking graphic.
         * @type {string}
         */
		this.characterName;
		/**
         * @description The actor's class ID.
         * @type {int}
         */
		this.classId;
		/**
         * @description appears to be optional
         * @type {string}
         * */
		this.doc;
		/**
         * @description The actor's initial equipment. An array of weapon IDs or armor IDs with the following subscripts:
         * @type {number[]}
         */
		this.equips;
		/**
         * @description  The index (0..7) of the actor's face graphic.
         * @type {number}
         */
		this.faceIndex;
		/**
         * @description  The file name of the actor's face graphic.
         * @type {string}
         */
		this.faceName;
		/**
         * @description The ID.
         * @type {string}
         */
		this.id;
		/**
         *  @description The actor's initial level.
         *  @type {number}
         */
		this.initialLevel;
		/**
         * @description appears to be optional, uncertain of what this is
         * @type {boolean}
         */
		this.internal;
		/**
         * @description appears to be optional, uncertain of what this is
         * @type {string[]}
         */
		this.links;
		/**
         * @description The actor's max level
         * @type {number}
         */
		this.maxLevel;
		/**
         * @description The name.
         * @type {string}
         */
		this.name;
		/**
         * @description The actor's nickname.
         * @type {string}
         */
		this.nickname;
		/**
         * @description appears to be optional, uncertain of what this is
         * @type {string[]}
         */
		this.parameters;
		/**
         * @description The profile.
         * @type {string}
         */
		this.profile;
		/**
         * @description The array of Trait data.
         * @type {rm.types.Trait[]}
         */
		this.traits;
		/**
         * @description the note of this actor, some plugins might use this
         * @type {string}
         */
		this.note;

		/**
         * @description the id of this dataActor
         * @type {int}
         */
		this.id;
	}
};

/** @description store the last known leader in a variable so that we can revert changes */
MATTIE.actorAPI.lastLeader = null;

/**
 * @description swap out the party leader
 * @param {int} i, actor index
 */
MATTIE.actorAPI.changePartyLeader = function (i) {
	MATTIE.actorAPI.lastLeader = $gameParty.leader().actorId();
	MATTIE.actorAPI.changePartyMember(0, i);
};

/**
 * @description change a party member to a different actor at index
 * @param {*} partyMemberIndex index of actor to change
 * @param {*} i actor index
 */
MATTIE.actorAPI.changePartyMember = function (partyMemberIndex, i) {
	$gameParty._actors[partyMemberIndex] = i;
};
