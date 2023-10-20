var MATTIE_RPG = MATTIE_RPG || {};

MATTIE.betterCrowMauler = MATTIE.betterCrowMauler || {};
/**
 *  @description the number of milliseconds util it is checked if crow mauler can spawn
 *  @default 10000
 * */
MATTIE.betterCrowMauler.spawnInterval = 10000;
/**
 *  @description the chance that crow mauler will spawn every interval
 *  @default .03
 * */
MATTIE.betterCrowMauler.spawnChance = 0.03;

/**
 *  @description the chance that crow mauler will follow you into the next room
 *  @default .15
 * */
MATTIE.betterCrowMauler.followChance = 0.15;

/**
 *  @description the chance that crow mauler will despawn when you leave a room
 *  @default .15
 * */
MATTIE.betterCrowMauler.despawnChance = 0.15;

/**
 * @description the chance of crow mauler entering someones battle
 * @default .005
 */
MATTIE.betterCrowMauler.combatEnterChance = 0.005;

/**
 * @description the min amount of time that must pass before crow can spawn in ms
 * @default 100 sec
 *
*/
MATTIE.betterCrowMauler.timeToSpawnMin = 0;

MATTIE.betterCrowMauler.timeToSpawnMax = 10000000;
MATTIE.betterCrowMauler.timeScaler = (t) => (0.2 + (10 * (t / MATTIE.betterCrowMauler.timeToSpawnMax)));

/** @description a scaler to scale the crow's spawn chance by */
MATTIE.betterCrowMauler.scaler = 1;

/**
 * @author Mattie_FM
 */
MATTIE.betterCrowMauler.CrowController = class {
	constructor(params) {
		setTimeout(() => {
			this.disableBaseCrowMauler();
		}, 5000);

		this.timeElapsed = 0;

		/** @description whether this instance of the controller has spawned a crow mauler on this level */
		this.hasSpawned = false;

		/** @description whether a crow mauler has forced its way into this combat */
		this.inBattle = false;

		/** @description whether this instance of the controller's crow mauler is on screen or not  */
		this.onScreen = false;

		/** @description the id of the mapId crow mauler was spawned in last */
		this.mapId = 0;
		/**
		 * @description The current crow obj if spawned
		 * @type {MapEvent}
		 * */
		this.self = new MapEvent();
		this.self.setPersist(true);

		const prevFunc = Game_Player.prototype.performTransfer;
		const that = this;
		Game_Player.prototype.performTransfer = function () {
			prevFunc.call(this);
			that.onEnterRoom();
			this.inBattle = false;
		};

		setInterval(() => {
			this.timeElapsed += MATTIE.betterCrowMauler.spawnInterval;
			if (this.crowCanSpawn()) {
				if ((!MATTIE.static.maps.onMenuMap())) { this.spawnTick(); }
				this.battleSpawnTick();
			}
		}, MATTIE.betterCrowMauler.spawnInterval);
	}

	/** @description whether this instance's crow mauler is dead */
	isDead() {
		const bool = this.self.checkSelfSwitch('A');
		console.log(`isdead: ${bool}`);
		return bool || !this.crowCanSpawn();
	}

	/** @description a function to return the scaler, meat to be overridden if other mods need to change this */
	getScaling() {
		return MATTIE.betterCrowMauler.scaler * MATTIE.betterCrowMauler.timeScaler(this.timeElapsed);
	}

	/**
	 * @description disable crow mauler
	 * @todo make sure this works properly
	 */
	disableBaseCrowMauler() {
		$gameSwitches.setValue(MATTIE.static.switch.crowMaulerDisabled, true);
	}

	/**
	 * @description the function called every x ms to check if crow mauler should spawn
	 */
	spawnTick() {
		if (!this.onScreen && !this.hasSpawned && !this.isDead() && !$gameParty.inBattle() && SceneManager._scene instanceof Scene_Map) this.update();
	}

	/**
	 * @description the function called every x ms to check if crow mauler should invade
	 */
	battleSpawnTick() {
		if (!this.isDead() && $gameParty.inBattle() && this.shouldEnterCombat() && !this.inBattle) {
			MATTIE.msgAPI.footerMsg('A terrifying presence has entered the room...');
			MATTIE.msgAPI.footerMsg('A terrifying presence is getting closer');

			setTimeout(() => {
				MATTIE.msgAPI.footerMsg('A terrifying presence is behind you');

				setTimeout(() => {
					this.invadeBattle();
				}, 35000);
			}, 5000);
		}
	}

	/**
	 * @description have crow mauler invade the current battle
	 * @param {*} net multiplayer only (fix this later)
	 */
	invadeBattle(net = false) {
		if ($gameParty.inBattle()) {
			this.inBattle = true;
			const additionalTroop = new MATTIE.troopAPI.RuntimeTroop(MATTIE.static.troops.crowMauler, 500, 0);
			additionalTroop.spawn(net);
		}
	}

	/**
	 * @description checks if crow mauler can spawn
	 * @returns {boolean}
	 */
	crowCanSpawn() {
		return $gameSwitches.value(MATTIE.static.switch.crowMaulerCanSpawn)
		&& !$gameSwitches.value(MATTIE.static.switch.crowMaulerDead)
		&& this.timeElapsed >= MATTIE.betterCrowMauler.timeToSpawnMin;
	}

	/**
	 * @description get all possible entry or exit event tiles in the room
	 * @returns an array of every event that has an active transfer event in its list
	 */
	getAllTransferPointsOnMap() {
		let arr = [];
		if ($gameMap) {
			arr = $gameMap.events().filter((event) => {
				if (event.event()) {
					return event.event().pages.some((page) => {
						if (page) {
							const list = page.list.map((cmd) => cmd.code);
							const commonEvents = page.list.filter((cmd) => cmd.code === MATTIE.static.commands.commonEventid);
							const hasPhaseStep = page.list.some((cmd) => (cmd.code == 121 && cmd.parameters[0] == MATTIE.static.switch.phaseStep));
							console.log(`PhaseStep${hasPhaseStep}`);
							if (hasPhaseStep) return false;
							if (commonEvents.length > 0) {
								return list.includes(MATTIE.static.commands.transferId)
							&& !list.includes(MATTIE.static.commands.battleProcessingId)
							&& commonEvents.filter((cmd) => cmd.parameters[0] === 104).length > 0; // has room change common event
							}
						}
						return false;
					});
				}
				return false;
			});
		}

		return arr;
	}

	/**
	 * @description find the closest spawn point to a provided x and y
	 * @param {int} x;
	 * @param {int} y;
	 * @returns {Game_Event} the closest possible spawn point to the players current x and y
	 */
	findClosestSpawnPoint(x, y) {
		const spawnPoints = this.getAllTransferPointsOnMap();
		let closest = spawnPoints[0];
		if (!closest) closest = { x: 0, y: 0 };
		if (!closest.x) closest = { x: 0, y: 0 };
		if (closest) {
			let dist = MATTIE.util.getDist(x, closest.x, y, closest.y);
			for (let index = 1; index < spawnPoints.length; index++) {
			/** @type {Game_Event} */
				const element = spawnPoints[index];
				const thisDist = MATTIE.util.getDist(x, element.x, y, element.y);
				if (thisDist < dist) {
					for (let x1 = -2; x1 < 2; x1++) {
						for (let y1 = -2; y1 < 2; y1++) {
							if (MATTIE.isPassableAnyDir(element)) {
								dist = thisDist;
								closest = element;
							}
						}
					}
				}
			}
		}
		return closest;
	}

	findNearestPassablePoint(X, Y, centerX, centerY, dist = 5) {
		const max = (Math.max(X, Y) ** 2);

		let x = 0;
		let y = 0;
		let dx = 0;
		let t = 0;
		let dy = -1;
		for (let index = 0; index < max; index++) {
			// console.log(index);
			if ((-X / 2 < x <= X / 2) && (-Y / 2 < y <= Y / 2)) {
				const obj = {};
				obj.x = x + centerX;
				obj.y = y + centerY;
				if (MATTIE.isPassableAnyDir(obj)) return obj;
			}
			if (x == y || (x < 0 && x == -y) || (x > 0 && x == 1 - y)) {
				t = dx;
				dx = -dy;
				dy = t;
			}
			x += dx;
			y += dy;
		}
		return { x: X, y: Y };
	}

	/**
	 * @description create a new MapEvent for crow mauler. Does not spawn the event.
	 * @returns {MapEvent}
	 */
	createCrowObj() {
		const event = MATTIE.eventAPI.createEnemyFromExisting(53, 207, 2, 9);
		return event;
	}

	/**
	 * @description crow mauler enter the room
	 */
	enter() {
		MATTIE.msgAPI.footerMsg('A terrifying presence has entered the room...');
		this.spawn();
	}

	/**
	 * @description spawn the crow mauler event removing the previous one if it exists
	 */
	spawn() {
		this.timeElapsed = 0;
		console.log('Here');
		if (!this.hasSpawned && !this.isDead() && !$gameParty.inBattle()) {
			console.log('Here2');
			this.onScreen = true;
			const s = this.findClosestSpawnPoint($gamePlayer.x, $gamePlayer.y);
			const spot = this.findNearestPassablePoint(15, 15, s.x, s.y);
			console.log(s);
			console.log(spot);
			if (spot) {
				this.self = this.createCrowObj();
				this.self.spawn(spot.x, spot.y);
				console.log(`x${spot.x}\ny${spot.y}`);
				this.mapId = $gameMap.mapId();
				this.hasSpawned = true;
			}
		}
	}

	/**
	 * @description crow mauler follow player from last room to this room
	 */
	follow() {
		setTimeout(() => {
			MATTIE.msgAPI.footerMsg('A terrifying presence has followed you into the room...');
		}, 4000);
		setTimeout(() => {
			this.spawn();
		}, 6000);
	}

	/**
	 * @description checks if the crow mauler can follow the player, if the crow mauler was in the last room and rand chance.
	 *
	 */
	canFollow() {
		return MATTIE.util.randChance(MATTIE.betterCrowMauler.followChance * this.getScaling()) && (this.mapId === $gameMap.lastMapId());
	}

	/**
	 * @description checks a random chance to see if the crow should despawn
	 *
	 * */
	shouldDespawn() {
		return !this.isDead() && MATTIE.util.randChance(MATTIE.betterCrowMauler.despawnChance);
	}

	/**
	 * @description checks a random chance to see if the crow should appear in combat
	 *
	 * */

	shouldEnterCombat() {
		return !this.isDead() && !this.inBattle && !this.onScreen && MATTIE.util.randChance(MATTIE.betterCrowMauler.combatEnterChance * this.getScaling());
	}

	/**
	 * @description remove the current crow mauler event from the world
	 */
	despawn() {
		if (!this.isDead()) {
			this.self.removeThisEvent();
			this.hasSpawned = false;
		}
	}

	/**
	 * @description the function called to handle spawning logic every time the player enters a new room
	 */
	onEnterRoom() {
		this.inBattle = false;
		if ($gameMap.mapId() != this.mapId) this.onScreen = false;
		if (!this.isDead() && !this.onScreen) {
			if (this.canFollow() && this.crowCanSpawn()) {
				this.despawn();
				this.follow();
			} else if (this.shouldDespawn()) {
				this.despawn();
			}
		}
	}

	/**
	 * @description the update method used to spawn crow mauler
	 */
	update() {
		console.log('updated');
		if (MATTIE.util.randChance(MATTIE.betterCrowMauler.spawnChance * this.getScaling())) {
			console.log('entered');
			this.enter();
		}
	}
};

/**
 * @description set up the crow mauler class and assign it to the variable we use
 */
MATTIE.betterCrowMauler.betterCrowMaulerInit = function () {
	const crowCont = new MATTIE.betterCrowMauler.CrowController();
	if (MATTIE.betterCrowMauler) { MATTIE.betterCrowMauler.crowCont = crowCont; }
};

/** @description cleanup the crow controller if it exists */
MATTIE.betterCrowMauler.betterCrowMaulerCleanup = function () {
	if (MATTIE.betterCrowMauler) { MATTIE.betterCrowMauler.crowCont = null; }
};

//--------------------------------------------------
// Multiplayer Compatibility
//--------------------------------------------------
MATTIE.betterCrowMauler.multiplayerCompatPRevFunc = MATTIE.betterCrowMauler.CrowController.prototype.getScaling;
if (MATTIE.multiplayer) {
	MATTIE.betterCrowMauler.CrowController.prototype.getScaling = function () {
		let val = (() => {
			if (MATTIE.multiplayer.getCurrentNetController) {
				const netCont = MATTIE.multiplayer.getCurrentNetController();
				return 1 / Object.keys(netCont.netPlayers).length * MATTIE.betterCrowMauler.multiplayerCompatPRevFunc.call(this);
			}

			return MATTIE.betterCrowMauler.scaler;
		})();
		if (val > 50) {
			val = 1;
		}
		return val;
	};
}
