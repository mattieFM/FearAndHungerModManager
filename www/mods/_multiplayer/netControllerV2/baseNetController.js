/* eslint-disable no-shadow */

/**
 * @typedef {Object.<string,number>} dict
 */
var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.multiplayer.emittedInit = false;
MATTIE.multiplayer.hasLoadedVars = false;

MATTIE.multiplayer.varSyncRequested = false;

MATTIE.multiplayer.maxPacketsPerSecond = 1500; // I dont know if this is useful
MATTIE.multiplayer.packetsThisSecond = 0;

setInterval(() => {
	MATTIE.multiplayer.packetsThisSecond = 0;
}, 1000);

var EventEmitter = require('events');

/**
 * @description the net controller class this handles all net traffic for the multiplayer mod.
 * it is made to send and receive json packets, that contain as many or as few commands as we want,
 * for instance, a packet could contain a move cmd, or a mov cmd and a bunch
 * of others.
 * @class
 */
class BaseNetController extends EventEmitter {
	constructor() {
		super();
		/** the player on the local machine
		 *  @type {PlayerModel}
		*/
		this.player = null;
		/** @description the id of this peer */
		this.peerId = null;
		/** @description has the game started? */
		this.started = false;
		/** @description list of player models */
		this.players = {};
		/** @type {PlayerModel[]} */
		this.netPlayers = {};

		this.transferRetries = 0;
		this.maxTransferRetries = 10;

		this.canTryToReconnect = false;
	}

	/**
	 * @description a method ment to be overriden by client and host
	 */
	connect(id) {

	}

	/**
	 * @deprecated dont use this
	 * @description if the user's accept button is a letter then when they hit accept for the connection code then it will
	 * append the letter aswell which will mess up the code.
	 */
	acceptBtnTypedConnectionFix() {
		const okayKeys = [];
		const objKeys = Object.keys(Input.keyMapper);

		// for all keyCodes in the key mapper.
		objKeys.forEach((objKey) => {
			// if a keyCode is mapped to the game command 'ok' -> ok is the accept/submit command
			if (Input.keyMapper[objKey] === 'ok') {
				// convert the keycode to a char and check if the char is alphanumeric
				const asciiKey = String.fromCharCode(objKey);
				if (asciiKey.match(/^[0-9a-z]+$/gi)) { okayKeys.push(asciiKey); }
			}
		});

		// if the hostId ends with any of the accept keys, remove it and try to connect again.
		let endsWithBadVar = false;
		okayKeys.forEach((okayLetterKey) => {
			if (this.hostId.toLowerCase().endsWith(okayLetterKey.toLowerCase())) endsWithBadVar = true;
		});

		let tempHost;
		if (endsWithBadVar) {
			tempHost = this.hostId.slice(0, -1);
			this.connect(tempHost, false);
		}
	}

	disconnectAllConns() {
		this.canTryToReconnect = true;
		if (this.self) {
			this.self.disconnect();
		}

		if (this.conn) {
			this.conn.close();
		}
	}

	reconnectAllConns() {
		if (this.self) {
			if (!this.self.disconnected) { this.self.reconnect(); }
		}
		this.setIsClient();
	}

	resetNet() {
		this.clearPeerId();
		this.clearControlVars();
		this.destroyAllConns();
	}

	destroyAllConns() {
		if (this.self) {
			this.self.destroy();
		}
		if (this.conn) {
			this.conn.destroy();
		}
	}

	clearPeerId() {
		this.peerId = null;
	}

	clearControlVars() {
		this.started = false;
		this.players = {};
		/** @type {Object.<string,PlayerModel>} */
		this.netPlayers = {};
		MATTIE.multiplayer.isClient = false;
		MATTIE.multiplayer.isHost = false;
		MATTIE.multiplayer.isActive = false;
	}

	setIsHost() {
		MATTIE.multiplayer.isActive = true;
		MATTIE.multiplayer.isClient = false;
		MATTIE.multiplayer.isHost = true;
	}

	setIsClient() {
		MATTIE.multiplayer.isActive = true;
		MATTIE.multiplayer.isHost = false;
		MATTIE.multiplayer.isClient = true;
	}

	/**
     * @description que a json object to be sent to the main connection.
     * For host this will send to all, for client this will send to host.
     * this is left blank intentionally as it is overridden by host and client
     * @param {*} obj the object to send
     */
	sendViaMainRoute(obj, excludedIds = []) {
		// MATTIE.multiplayer.packetsThisSecond++;
		// if(MATTIE.multiplayer.packetsThisSecond >= MATTIE.multiplayer.maxPacketsPerSecond){

		// }else{
		this.send(obj, excludedIds);
		// }
	}

	send(obj, excludedIds = []) {
		if (MATTIE.multiplayer.isClient) {
			this.sendHost(obj);
		} else if (MATTIE.multiplayer.isHost) {
			this.sendAll(obj, excludedIds);
		}
	}

	/**
     * @description a function that will preprocess the data for onData, before it is read/
     * this is overridden by host and client
     * @param data the data that was sent
     * @param conn the connection that is sending the data
     */
	preprocessData(data, conn) {

	}

	/**
     * @description the main controller receiving data
     * @param data the data obj
     * @param conn the connection object
     */
	onData(data, conn) {
		console.log(data);
		data = this.preprocessData(data, conn);
		const id = data.id;
		if (data.move) {
			this.onMoveData(data.move, id);
			return; // move data is sent by itself always
		}
		if (data.updateNetPlayers && MATTIE.multiplayer.isClient) { // only used by client
			this.onUpdateNetPlayersData(data.updateNetPlayers, data.id);
		}
		if (data.playerInfo && MATTIE.multiplayer.isHost) { // only used by host
			this.onPlayerInfoData(data.playerInfo);
		}
		if (data.startGame && MATTIE.multiplayer.isClient) { // only used by client
			this.onStartGameData(data.startGame);
		}
		if (data.syncedVars && MATTIE.multiplayer.isClient) { // used only by client
			this.onUpdateSyncedVarsData(data.syncedVars);
		}
		if (data.syncedSwitches) {
			this.onUpdateSyncedSwitchData(data.syncedSwitches);
		}
		if (data.requestedVarSync && MATTIE.multiplayer.isHost) { // used only by host
			this.emitUpdateSyncedVars();
		}
		if (data.transfer) {
			this.onTransferData(data.transfer, id);
		}
		if (data.ctrlSwitch) {
			if (SceneManager._scene.isActive() && MATTIE.multiplayer.varSyncer.syncedOnce) { this.onCtrlSwitchData(data.ctrlSwitch, id); }
		}
		if (data.cmd) {
			if (SceneManager._scene.isActive() && MATTIE.multiplayer.varSyncer.syncedOnce) { this.onCmdEventData(data.cmd, data.id); }
		}
		if (data.event) {
			if (SceneManager._scene.isActive() && MATTIE.multiplayer.varSyncer.syncedOnce) { this.onEventMoveEventData(data.event); }
		}
		if (data.battleStart) {
			this.onBattleStartData(data.battleStart, id);
		}
		if (data.battleEnd) {
			this.onBattleEndData(data.battleEnd, id);
		}
		if (data.ready) {
			this.onReadyData(data.ready, id);
		}
		if (data.turnEnd) {
			this.onTurnEndData(data.turnEnd, id);
		}
		if (data.equipChange) {
			this.onEquipmentChangeData(data.equipChange, id);
		}
		if (data.spawnEvent) {
			this.onEventSpawn(data.spawnEvent, data.id);
		}
		if (data.transformEnemy) {
			this.onTransformEventData(data.transformEnemy, data.id);
		}
		if (data.appearEnemy) {
			this.onAppearEnemyEventData(data.appearEnemy, data.id);
		}
		if (data.enemyState) {
			this.onEnemyStateEventData(data.enemyState, data.id);
		}
		if (data.saveEvent) {
			this.onSaveEventData();
		}
		if (data.spectate) {
			this.onSpectateEventData(data.spectate, data.id);
		}
		if (data.runTimeTroopSpawn) {
			this.onRuntimeTroopEvent(data.runTimeTroopSpawn, data.id);
		}
		if (data.pvpEvent) {
			this.onPvpEventData(data.pvpEvent, data.id);
		}
		if (data.transparentEvent) {
			this.onSetTransparentEventData(data.transparentEvent, data.id);
		}
		if (data.setCharImgEvent) {
			this.onSetCharacterImageEventData(data.setCharImgEvent, data.id);
		}
		if (data.dashEvent) {
			this.onDashEventData(data.dashEvent, data.id);
		}
		if (data.moveSpeedEvent) {
			this.onSpeedEventData(data.moveSpeedEvent, data.id);
		}
		if (data.marriageReq) {
			this.onMarriageRequestData(data.marriageReq, data.id);
		}
		if (data.marriageResponse) {
			this.onMarriageResponseData(data.marriageResponse, data.id);
		}
		if (data.saveEventLocationEvent) {
			this.onSaveEventLocationEventData(data.saveEventLocationEvent, data.id);
		}
	}

	//-----------------------------------------------------
	// Turn End Event
	//-----------------------------------------------------

	/**
     *
     * @description emit the turnend event, sending data to connected peers.
     * @param enemyHps {int[]} an array of ints corrispoding to the enemy hps
     *  @param enemyHps {int[][]} an array of arrays of ints which are the state ids of the enemies
     * @emits turnend
     */
	emitTurnEndEvent(enemyHps, enemyStates, actorData) {
		var obj = {};
		obj.turnEnd = {};
		obj.turnEnd.enemyHps = enemyHps;
		obj.turnEnd.enemyStates = enemyStates;
		obj.turnEnd.actorData = actorData;
		console.log(obj);
		this.emit('turnend');
		this.sendViaMainRoute(obj);
	}

	/**
     *
     * @param {*} data the turnEnd obj, for now just contains an array of enemy healths
     */
	onTurnEndData(data, id) {
		if ($gameTroop.getIdsInCombatWithExSelf().includes(id)) {
			const enemyHealthArr = data.enemyHps;
			const actorDataArr = data.actorData;
			const actorHealthArr = actorDataArr.map((data) => data.hp);
			const enemyStatesArr = data.enemyStates;
			if (actorDataArr) { this.syncActorData(actorDataArr, id); }
			if (enemyHealthArr) { this.syncEnemyHealths(enemyHealthArr); }
			if (enemyStatesArr) { this.syncEnemyStates(enemyStatesArr); }
			setTimeout(() => {
				BattleManager.doneSyncing(); // done syncing
			}, MATTIE.multiplayer.combatEmitter.minSyncTime);
		}
	}

	syncActorData(actorDataArr, partyId) {
		const party = this.netPlayers[partyId].battleMembers();
		for (let index = 0; index < actorDataArr.length; index++) {
			/** @type {Game_Actor} */
			const actor = party[index];
			const actorData = actorDataArr[index];
			const newActorHealth = actorData.hp;
			const newActorMana = actorData.mp;
			if (actor.hp > newActorHealth) {
				// actor.performDamage();
				// this.performCosmeticDamageAnimation($gameTroop.members()[0], [actor], 1);
			}
			actor.setHp(newActorHealth);
			actor.setMp(newActorMana);
		}

		// handle despawning chars for pvp
		if (MATTIE.multiplayer.pvp.inPVP) {
			// despawn dead chars
			Object.keys(this.netPlayers).forEach((key) => {
			/** @type {PlayerModel} */
				const player = this.netPlayers[key];
				player.battleMembers().forEach((member) => {
					console.log(member);
					if (member.isDead()) {
						const netActor = player.$netActors.netActor(member.actorId());
						const troopId = MATTIE.multiplayer.pvp.PvpController.mapActorToTroop(
							netActor.baseActorId || member.actorId(),
						); // get the troop for this actor
						const troop = $gameTroop._additionalTroops[troopId];
						console.log(troop);
						console.log(member.actorId());
						if (troop) { troop.despawn(); }
					}
				});
			});
		}
	}

	syncEnemyStates(enemyStatesArr) {
		for (let index = 0; index < $gameTroop.members().length; index++) {
			const enemy = $gameTroop.members()[index];
			const netStates = enemyStatesArr[index];
			if (netStates) {
				for (let j = 0; j < netStates.length; j++) {
					const state = netStates[j];
					if (!enemy.isStateAffected(state)) {
						enemy.addState(state);
					}
				}
			}
		}
	}

	syncEnemyHealths(enemyHealthArr) {
		for (let index = 0; index < $gameTroop.members().length; index++) {
			const enemy = $gameTroop.members()[index];
			if (enemy) {
				const orgHp = enemy.hp;
				enemy.setHp(Math.min(orgHp, enemyHealthArr[index]));
				if (orgHp > 0 && enemy.hp <= 0 && !enemy.hasState(enemy.deathStateId())) {
					enemy.addState(enemy.deathStateId());
					enemy.performCollapse();
					enemy.hide();
				}
			}
		}
	}

	//-----------------------------------------------------
	// Ready Event
	//-----------------------------------------------------

	/**
     * @description trigger the ready event. This event is called when a player enters the ready state in combat.
     * @param {Game_Action[]} an array of the actions that the player has entered.
     * @emits ready
     */
	emitReadyEvent(actions) {
		this.emit('ready');
		var obj = {};
		obj.ready = {};
		obj.ready.val = true;
		obj.ready.actions = actions;
		obj.ready.isExtraTurn = Galv.EXTURN.active;
		$gameTroop.setReadyIfExists(MATTIE.multiplayer.getCurrentNetController().peerId, 1); // set the player as ready in combat arr
		this.sendViaMainRoute(obj);
	}

	/**
     * @description trigger the unready event. This event is called when a player exits the ready state in combat.
     * @emits unready
     */
	emitUnreadyEvent() {
		this.emit('unready');
		var obj = {};
		obj.ready = {};
		obj.ready.val = false;
		obj.ready.isExtraTurn = Galv.EXTURN.active;
		$gameTroop.setReadyIfExists(MATTIE.multiplayer.getCurrentNetController().peerId, 0); // set the player as unready in combat arr
		this.sendViaMainRoute(obj);
	}

	/**
     * @description handles logic for readying and unreadying in combat.
     * @param {*} readyObj the net obj for the ready event
     * @param {*} senderId the sender's id
     */
	onReadyData(readyObj, senderId) {
		const val = readyObj.val;
		const isExtraTurn = readyObj.isExtraTurn;
		const id = senderId;
		if (MATTIE.multiplayer.currentBattleEvent) {
			if (MATTIE.multiplayer.currentBattleEvent.setReadyIfExists) {
				MATTIE.multiplayer.currentBattleEvent.setReadyIfExists(id, val); // set the player as unready in combat arr @legacy
				if (val === false)console.log('net unready recived');
			}
		}
		$gameTroop.setReadyIfExists(id, val, isExtraTurn); // set the player as unready in combat arr <- this one is actually used

		if ($gameTroop.getIdsInCombatWithExSelf().includes(id)) { // only setup net actions if we are in combat with that troop
			if (readyObj.actions) {
				const actions = JSON.parse(readyObj.actions);
				actions.forEach((action) => {
					let shouldAddAction = true;
					if (action) {
						let partyAction = false;
						if (action._item._dataClass === 'skill') {
							const tempAction = new Game_Action($gameActors.actor(1), 0);
							tempAction.setSkill(action._item._itemId);
							tempAction.isForAll();
							partyAction = tempAction.isForAll();
						}
						// wether the action is targeting all members of the party

						/** @type {PlayerModel} */
						const netPlayer = this.netPlayers[senderId];
						/** @type {Game_Actor} */
						const actor = netPlayer.$netActors.baseActor(action._subjectActorId);

						if (action.netPartyId) {
							if (!partyAction) {
								action.forcedTargets = [];
								// eslint-disable-next-line no-nested-ternary
								const targetedNetParty = action.netPartyId != this.peerId
									? this.netPlayers[action.netPartyId].battleMembers()
									: action.netPartyId == this.peerId
										? $gameParty.battleMembers()
										: null;
								if (targetedNetParty) action.forcedTargets.push(targetedNetParty[action._targetIndex]);
								action._netTarget = action.netPartyId;
							} else {
								if (!MATTIE.multiplayer.config.scaling.partyActionsTargetAll) {
									if (action.netPartyId != this.peerId) shouldAddAction = false;
								}
								MATTIE.multiplayer.BattleController.onPartyActionTargetingNet(action);
							}
						}
						if (shouldAddAction) {
							console.log(action);
							if (actor == null) {
								if (action._subjectActorId <= 0) {
									// is enemy action
									console.log($gameTroop.members()[action._subjectEnemyIndex]);
									console.log($gameTroop.members()[action._subjectEnemyIndex]);

									this.processNormalEnemyAction($gameTroop.members()[action._subjectEnemyIndex], action, isExtraTurn, senderId);
								} else {
									// is  bad data
								}
							} else if (!MATTIE.multiplayer.pvp.inPVP) {
								this.processNormalAction(actor, action, isExtraTurn, senderId);
							} else {
								this.processPvpAction(actor, action, isExtraTurn, senderId);
							}
						}
					}
				});
			}
		}
	}

	/**
     * @description add a action to a net battler when not in pvp
     * @param {Game_Actor} actor actor that these actions are for
     * @param {Game_Action} action the action itself
     * @param {bool} isExtraTurn whether this is an extra turn
     * @param {UUID} senderId id of the net user that sent these actions
     */
	processNormalAction(actor, action, isExtraTurn, senderId) {
		actor.partyIndex = () => this.netPlayers[senderId].battleMembers().indexOf(actor); // set the party index function
		actor.setCurrentAction(action);
		BattleManager.addNetActionBattler(actor, isExtraTurn);
	}

	/**
	 * @description add a action to an enemy
	 * @param {Game_Enemy} enemy actor that these actions are for
	 * @param {Game_Action} action the action itself
	 * @param {bool} isExtraTurn whether this is an extra turn
	 * @param {UUID} senderId id of the net user that sent these actions
	 */
	processNormalEnemyAction(enemy, action, isExtraTurn, senderId) {
		action._netTarget = senderId;

		enemy.setCurrentAction(action);
		BattleManager.addNetActionBattler(enemy, isExtraTurn);
		$gameTroop.members()[action._subjectEnemyIndex]._actions.forEach((act) => { act.subject = () => $gameTroop.members()[action._subjectEnemyIndex]; });

		/** @type {Game_Action} */
		const gameAction = enemy._actions[enemy._actions.length - 1];
		enemy._actions[enemy._actions.length - 1].cb = () => {
			if (action.targetResults) {
				if (Object.keys(action.targetResults).some((key) => action.targetResults[key].dmg > 0)) {
					enemy.requestEffect('whiten');
					gameAction.makeTargets().forEach((target) => {
						if (target instanceof Game_Actor) {
							/** @type {Game_Actor} */
							const battler = MATTIE.multiplayer.getCurrentNetController().netPlayers[senderId].$netActors.baseActor(target.actorId());
							if (battler) {
								$gameParty.leader().actorId();

								if (gameAction.item()) {
									const animId = gameAction.item().animationId;
									console.log(battler);
									setTimeout(() => {
										battler.startAnimation(animId);
										setTimeout(() => {
											battler.performDamage();
										}, 1200);
									}, 1500);
								}
							}
						}
					});
				}
			}
		};
	}

	/**
     * @description handle pvp action
     * @param {Game_Actor} actor actor that these actions are for
     * @param {Game_Action} action the action itself
     * @param {bool} isExtraTurn whether this is an extra turn
     * @param {UUID} senderId id of the net user that sent these actions
     */
	processPvpAction(actor, action, isExtraTurn, senderId) {
		let targetActor = $gameActors.actor(action.targetActorId);
		let legCut = false;
		let armCut = false;
		/** @type {Game_Enemy} */

		const originalTargetName = action.targetName;
		action.forcedTargets = [];
		const netActor = this.netPlayers[senderId].$netActors.netActor(actor.actorId());
		const troopId = MATTIE.multiplayer.pvp.PvpController.mapActorToTroop(netActor.baseActorId || actor.actorId()); // get the troop for this actor
		// const originalTarget = $dataTroops[troopId].members.find((member) => $dataEnemies[member.enemyId].name.includes(originalTargetName))
		// || $dataEnemies[$dataTroops[troopId].members[2].enemyId];
		if (troopId) {
			let targetActorIndex = 0;
			/** @type {Game_Enemy} */
			const i = 2;
			const enemies = $gameTroop._additionalTroops[troopId].baseMembers();
			let battler = enemies[i]; // just grab the first member for now
			for (let i = 2; battler.isDead() && i < enemies.length; i++) battler = enemies[i];
			actor.partyIndex = () => this.netPlayers[senderId].battleMembers().indexOf(actor); // just say thye go first for now to test
			action._netTarget = false;

			if (targetActor) {
				// handle replacements
			// that is leader can only be killed if all members have been killed first
				if ($gameParty.leader().actorId() === targetActor.actorId() && $gameParty.battleMembers().length > 1) {
					const battlers = $gameParty.battleMembers();
					const oldTarget = targetActor;
					targetActor = battlers[MATTIE.util.randBetween(1, battlers.length - 1)] || battlers[0];
					console.log(targetActor);
					action.cb = () => {
						BattleManager._logWindow.displaySubstitute(targetActor, oldTarget);
						MATTIE.msgAPI.footerMsg('Your loyal followers protect you!');
					};
				}

				battler.setCurrentAction(action);
				// change the damage formula to be raw damage stat.
				/** @type {rm.types.Item} */
				const clonedItem = JsonEx.makeDeepCopy(battler._actions[battler._actions.length - 1].item());
				clonedItem.damage.formula = 'a.atk';

				battler._actions[battler._actions.length - 1].item = function () {
					return clonedItem;
				};

				targetActorIndex = $gameParty._actors.indexOf(parseInt(targetActor.actorId(), 10));

				battler._actions[battler._actions.length - 1]._netTarget = false;
				battler._actions[battler._actions.length - 1].setSubject(battler);
				battler._actions[battler._actions.length - 1].setTarget(targetActorIndex);

				Object.keys(action.targetResults).forEach((key) => {
					const actor = targetActor;
					// handle damage
					if (originalTargetName.toLowerCase().includes('arm') && action.isKillingBlow) {
						armCut = true;
						battler.enemy().params[2] = 1;
						targetActor.addState(MATTIE.static.states.armCut);
					} else if (originalTargetName.toLowerCase().includes('leg') && action.isKillingBlow) {
						legCut = true;
						battler.enemy().params[2] = 1;
						targetActor.addState(MATTIE.static.states.legCut);
					} else {
						battler.enemy().params[2] = 0;
					}

					if (actor) {
						action.targetResults[battler._actions[battler._actions.length - 1]
							.makeTargetResultsId(actor, this.netPlayers[senderId].peerId)] = action.targetResults[key];
						action.targetResults[battler._actions[battler._actions.length - 1]
							.makeTargetResultsId(actor)] = action.targetResults[key];
					}
				});

				if (armCut || legCut) {
				/** @type {rm.types.Effect} */
					const effect = {};
					effect.code = 21;
					effect.dataId = MATTIE.static.states.bleeding;
					effect.value1 = 1;
					effect.value2 = 0;
					battler._actions[battler._actions.length - 1].item().effects.push(effect);
					effect.code = 21;
					effect.dataId = 3;
					effect.value1 = 1;
					effect.value2 = 0;
					battler._actions[battler._actions.length - 1].item().effects.push(effect);
					effect.code = 44;
					effect.dataId = 240;
					effect.value1 = 1;
					effect.value2 = 0;
					battler._actions[battler._actions.length - 1].item().effects.push(effect);
				}

				battler._actions[battler._actions.length - 1].loadRng(action.targetResults);
			}

			battler.partyIndex = () => action.userBattlerIndex + 1;
			BattleManager.addNetActionBattler(battler, isExtraTurn);
		}
	}

	//-----------------------------------------------------
	// Move Event
	//-----------------------------------------------------

	/**
     * @descriptiona function to emit the move event for the client
     * @emits moveEvent
     * @param {number} direction see below:
     * 8: up
     * 6: left
     * 4: right
     * 2: down
     */
	emitMoveEvent(direction, x = undefined, y = undefined, transfer = false) {
		if (!MATTIE.static.maps.onMenuMap()) { // only fire move event if not in menu
			this.emit('moveEvent', direction, x, y, transfer);
			const obj = {};
			obj.move = {};
			obj.move.d = direction;
			if (x) {
				obj.move.x = x;
				obj.move.y = y;
			}
			if (transfer) {
				obj.move.t = true;
			}
			this.sendViaMainRoute(obj);
		}
	}

	/**
     *  triggers when the receiving movement data from a netPlayer
     * @param {*} moveData up/down/left/right as num 8 6 4 2
     * @param {*} id the peer id of the player who moved
     */
	onMoveData(moveData, id) {
		if (this.netPlayers[id].isMarried) {
			MATTIE.marriageAPI.handleMove.call(this, moveData, id);
		} else {
			this.moveNetPlayer(moveData, id);
		}
	}

	/**
	 * @description smoothly move a net player to a location
	 * @param {*} numSteps number of steps to take
	 * @param {*} player the game char to move
	 * @param {*} delayPerStep the delay between each step
	 * @param {*} location {x:x, y:y} the location obj
	 */
	smoothMoveNetPlayer(numSteps, player, location, delayPerStep = 150) {
		for (let index = 0; index < numSteps; index++) {
			setTimeout(() => {
				try {
					if (SceneManager._scene instanceof Scene_Map) { player.moveTowardCharacter(location); }
				} catch (error) {
					console.warn('player smooth move being bad');
				}
			}, delayPerStep * index);
		}
	}

	/**
     * @description move a net player 1 tile
     * @param {*} moveData which direction on the key pad the player pressed, up/down/left/right as a number 8/6/4/2
     * @param {*} id the id of the peer who's player moved
     */
	moveNetPlayer(moveData, id) {
		if (this.netPlayers[id].map === $gameMap.mapId() && SceneManager._scene instanceof Scene_Map) {
			// only call if on same map and the local player is looking at scene_map IE: not in menu
			if (moveData.x) {
				const dist = Math.sqrt((moveData.x - $gamePlayer._x) ** 2 + (moveData.y - $gamePlayer._y) ** 2);
				if (moveData.t) {
					if (MATTIE.multiplayer.devTools.moveLogger)console.log('transfered char (due to request)');
					moveData.map = $gameMap.mapId();
					this.transferNetPlayer(moveData, id, false);
				} else if (dist > 10) {
					if (MATTIE.multiplayer.devTools.moveLogger)console.log('transfered char (due to dist)');
					moveData.map = $gameMap.mapId();
					this.transferNetPlayer(moveData, id, false);
				} else {
					if (MATTIE.multiplayer.devTools.moveLogger) console.log('tried to move char smoothly');
					const deltaX = moveData.x - this.netPlayers[id].$gamePlayer._x;
					const deltaY = moveData.y - this.netPlayers[id].$gamePlayer._y;
					const numSteps = Math.abs(deltaX) + Math.abs(deltaY);
					this.smoothMoveNetPlayer(numSteps, this.netPlayers[id].$gamePlayer, moveData, 75);
				}
			} else {
				try {
					this.netPlayers[id].$gamePlayer.moveOneTile(moveData.d);
				} catch (error) {
					if (MATTIE.multiplayer.devTools.moveLogger)console.warn(`something went wrong when moving the character${error}`);
				}
			}
		} else if (moveData.x) {
			// if player not on map or local player is in menu update pos ONLY
			this.netPlayers[id].$gamePlayer._x = moveData.x; // update pos only
			this.netPlayers[id].$gamePlayer._y = moveData.y; // update pos only
		}
	}

	//-----------------------------------------------------
	// Transfer Event
	//-----------------------------------------------------

	/** a function to emit the move event for the client
     * @emits transferEvent
     * @param {number} direction see below:
     * 8: up
     * 6: left
     * 4: right
     * 2: down
     */
	emitTransferEvent(transferObj) {
		this.emit('transferEvent', transferObj);
		this.sendViaMainRoute(transferObj);
	}

	/**
     *  triggers when the receiving transfer data from a netPlayer
     * @param {*} transData x,y,map
     * @param {*} id the peer id of the player who moved
     */
	onTransferData(transData, id) {
		this.transferNetPlayer(transData, id);
	}

	/**
     * @description transfer a net player to a location
     * @param {*} transData x,y,map
     * @param {*} id the id of the peer who's player moved
     */
	transferNetPlayer(transData, id, shouldSync = true) {
		const map = transData.map;
		this.netPlayers[id].setMap(map);

		// if not on the map try again later
		if (!(SceneManager._scene instanceof Scene_Map)) {
			// console.log('waiting to transfer');
			setTimeout(() => {
				// console.log('transfering');
				this.transferNetPlayer(transData, id, shouldSync);
			}, 1000);
			return;
		}

		// if on the correct scene
		if (this.transferRetries <= this.maxTransferRetries) {
			try {
				const x = transData.x;
				const y = transData.y;
				const map = transData.map;
				this.netPlayers[id].setMap(map);
				try {
					SceneManager._scene.updateCharacters();
					try {
						const deltaX = transData.x - this.netPlayers[id].$gamePlayer._x;
						const deltaY = transData.y - this.netPlayers[id].$gamePlayer._y;
						const numSteps = Math.abs(deltaX) + Math.abs(deltaY);
						let delay = 0;

						if (numSteps < 5) {
							const delayBetweenStep = 150;
							this.smoothMoveNetPlayer(numSteps, this.netPlayers[id].$gamePlayer, transData, delayBetweenStep);
							delay = numSteps * delayBetweenStep;
						}

						setTimeout(() => {
							this.netPlayers[id].$gamePlayer.reserveTransfer(map, x, y, 0, 0);
							this.netPlayers[id].$gamePlayer.performTransfer(shouldSync);
						}, delay);
					} catch (error) {
						console.warn('player was not on the map when transfer was called');
					}
				} catch (error) {
					console.warn('createSprites was called not on scene_map:');
					this.transferRetries++;
					setTimeout(() => {
						this.transferNetPlayer(transData, id, shouldSync);
					}, 500);
				}
			} catch (error) {
				console.warn(`something went wrong when transferring the character:${error}`);
			}
		} else {
			this.transferRetries = 0;
		}
	}

	//-----------------------------------------------------
	// Battle Start Event
	//-----------------------------------------------------

	/**
     * @description send the battle start event to connections
     * @param {*} eventId the id of the event tile the battle was triggered from
     * @param {*} mapId the id of the map that that tile is on
     * @param {*} troopId the troop id that the player is now incombat with
     */
	emitBattleStartEvent(eventId, mapId, troopId) {
		var obj = {};
		obj.battleStart = {};
		obj.battleStart.eventId = eventId;
		obj.battleStart.mapId = mapId;
		obj.battleStart.troopId = troopId;
		MATTIE.multiplayer.currentBattleEnemy = obj.battleStart;
		MATTIE.multiplayer.currentBattleEvent = $gameMap.event(eventId);
		this.emit('battleStartEvent', obj);
		this.sendViaMainRoute(obj);
		this.emitChangeInBattlersEvent(this.formatChangeInBattleObj(obj.eventId, obj.mapid, this.peerId));
		const event = $gameMap.event(obj.battleStart.eventId);
		if (event) event.addIdToCombatArr(this.peerId);
		this.battleStartAddCombatant(obj.battleStart.troopId, this.peerId);
		MATTIE.emitTransfer(); // emit transfer event to make sure player is positioned correctly on other players screens
	}

	onBattleStartData(battleStartObj, id) { // take the battleStartObj and set that enemy as "in combat" with id
		this.battleStartAddCombatant(battleStartObj.troopId, id);
		this.netPlayers[id].troopInCombatWith = battleStartObj.troopId;

		// handle all logic needed for the event tile
		if (battleStartObj.mapId == $gameMap.mapId()) { // event tile tracking can only be done on same screen
			if (MATTIE.multiplayer.devTools.battleLogger) console.info('net event battle start --on enemy host');
			var event = $gameMap.event(battleStartObj.eventId);
			event.addIdToCombatArr(id);
			event.lock();
			event._trueLock = true;
		}
		this.emitChangeInBattlersEvent(this.formatChangeInBattleObj(battleStartObj.eventId, battleStartObj.mapid, id));
	}

	/** called whenever anyone enters or leaves a battle, contains the id of the player and the battle */
	emitChangeInBattlersEvent(obj) {
		MATTIE.multiplayer.BattleController.emitNetBattlerRefresh();
		this.emit('battleChange', obj);
	}

	formatChangeInBattleObj(eventid, mapid, peerid) {
		var obj = {};
		obj.eventId = eventid;
		obj.mapId = mapid;
		obj.peerId = peerid;
		return obj;
	}

	/**
     * @description removes a combatant to the gameTroop's combat arr. This matches based on name and id,
     * this is to help with some of the spegetti that the dev does with battle events
     * @param {*} troopId
     * @param {*} id
     */
	battleEndRemoveCombatant(troopId, id) {
		if ($dataTroops[troopId]) {
			const troopName = $dataTroops[troopId].name;

			$dataTroops.forEach((element) => {
				if (element) {
					if (element.name === troopName) {
						if (element._combatants) {
							delete element._combatants[id];
						}
					}
				}
			});

			$gameTroop.removeIdFromCombatArr(id);
			if ($dataTroops[troopId]._combatants) {
				delete $dataTroops[troopId]._combatants[id];
			}
		}
	}

	/**
     * @description adds a combatant to the gameTroop's combat arr. This matches based on name and id, this is to help with some of the
     * spegetti that the dev does with battle events
     * @param {*} troopId
     * @param {*} id
     */
	battleStartAddCombatant(troopId, id) {
		const troopName = $dataTroops[troopId].name;
		$dataTroops.forEach((element) => {
			if (element) {
				if (element.name === troopName) {
					if (element._combatants) {
						element._combatants[id] = {};
						element._combatants[id].bool = 0;
						element._combatants[id].isExtraTurn = 0;
					} else {
						element._combatants = {};
						element._combatants[id] = {};
						element._combatants[id].bool = 0;
						element._combatants[id].isExtraTurn = 0;
					}
				}
			}
		});

		if ($gameTroop.name == troopName) {
			$gameTroop.addIdToCombatArr(id);
		}

		if ($gameTroop._troopId == troopId) {
			$gameTroop.addIdToCombatArr(id);
		} else if ($dataTroops[troopId]._combatants) {
			$dataTroops[troopId]._combatants[id] = {};
			$dataTroops[troopId]._combatants[id].bool = 0;
			$dataTroops[troopId]._combatants[id].isExtraTurn = 0;
		} else {
			$dataTroops[troopId]._combatants = {};
			$dataTroops[troopId]._combatants[id] = {};
			$dataTroops[troopId]._combatants[id].bool = 0;
			$dataTroops[troopId]._combatants[id].isExtraTurn = 0;
		}
	}

	//-----------------------------------------------------
	// Battle End Event
	//-----------------------------------------------------

	/**
     * a function to emit the battle end event
     * @param {int} troopId the id of the troop
     * @param {obj} enemy the net obj for an enemy
     */
	emitBattleEndEvent(troopId, enemy) {
		var obj = {};
		obj.battleEnd = enemy;
		obj.battleEnd.troopId = troopId;
		this.emit('battleEndEvent', obj);
		this.emitChangeInBattlersEvent(this.formatChangeInBattleObj(obj.eventId, obj.mapid, this.peerId));
		if ($gameMap.event(obj.battleEnd.eventId))$gameMap.event(obj.battleEnd.eventId).removeIdFromCombatArr(this.peerId);
		this.battleEndRemoveCombatant(obj.battleEnd.troopId, this.peerId);

		this.sendViaMainRoute(obj);

		Object.keys(this.netPlayers).forEach((key) => {
			const netPlayer = this.netPlayers[key];
			netPlayer.clearBattleOnlyMembers();
		});
	}

	onBattleEndData(battleEndObj, id) { // take the battleEndObj and set that enemy as "out of combat" with id
		this.battleEndRemoveCombatant(battleEndObj.troopId, id);
		this.netPlayers[id].troopInCombatWith = null;

		// handle all logic needed for the event tile
		if (battleEndObj.mapId == $gameMap.mapId()) { // event tile tracking can only be done on same screen
			if (MATTIE.multiplayer.devTools.enemyHostLogger) console.debug('net event battle end --on enemy host');
			console.debug('net player left event');
			var event = $gameMap.event(battleEndObj.eventId);
			event.removeIdFromCombatArr(id);

			if (!event.inCombat()) {
				setTimeout(() => {
					event.unlock();
					event._trueLock = false;
				}, MATTIE.multiplayer.runTime);
			} else event.lock();
		}
		this.emitChangeInBattlersEvent(this.formatChangeInBattleObj(battleEndObj.eventId, battleEndObj.mapid, id));
	}

	//-----------------------------------------------------
	// Player Sync Event
	//-----------------------------------------------------

	// this is an event used to sync players on the same map making sure everyone renders in promptly

	// /**
	//  * @description used by the client to request a sync from the host
	//  * @clientOnly
	//  * @emits requestSyncEvent
	//  */
	// emitRequestSyncEvent(){
	//     let obj = {};
	//     obj.requestPlayerSync = {};
	//     obj.requestPlayerSync.mapId = $gameMap.mapId();
	//     this.emit("requestSyncEvent");
	// }

	// /**
	//  * @description when the host recives a request to sync player data do this
	//  * @param {Object} syncObj the net obj for requestPlayerSync event
	//  * @param {UUID} senderId the sender's id
	//  */
	// onRequestSyncEventData(syncObj, senderId){
	//     let senderMapId = syncObj.mapId;

	//     let playersOnMap = this.netPlayers.filter(player=>player.mapId===senderMapId);
	//     let obj = {};
	//     obj.playerSyncData = {};
	//     obj.playerSyncData.playersOnMap
	// }

	//-----------------------------------------------------
	// Update Net Players Event
	//-----------------------------------------------------

	/**
     * handle when the host sends an updated list of netplayers
     * @emits updateNetPlayers
     */
	onUpdateNetPlayersData(netPlayers, id) {
		this.updateNetPlayers(netPlayers);
		this.updateNetPlayerFollowers(netPlayers);
	}

	/** updates net players
     * @emits updateNetPlayers
     */
	updateNetPlayers(netPlayers) {
		const keys = Object.keys(netPlayers);
		for (let index = 0; index < keys.length; index++) {
			const key = keys[index];
			const netPlayer = netPlayers[key];
			if (!this.netPlayers[key]) {
				this.initializeNetPlayer(netPlayer); // if this player hasn't been defined yet initialize it.
			} else {
				// replace any files that conflict with new data, otherwise keep old data
				this.netPlayers[key] = Object.assign(this.netPlayers[key], netPlayer);
			}
		}
		this.emit('updateNetPlayers', netPlayers);
	}

	updateNetPlayer(playerInfo) {
		const obj = {};
		obj[playerInfo.peerId] = playerInfo;
		this.updateNetPlayers(obj);
		this.emit('updateNetPlayers', [obj]);
	}

	updateNetPlayerFollowers(playerInfo) {
		if (playerInfo.peerId) {
			const netPlayer = this.netPlayers[playerInfo.peerId];
			if (netPlayer) netPlayer.setFollowers(playerInfo.followerIds);
		} else {
			const keys = Object.keys(this.netPlayers);
			for (let index = 0; index < keys.length; index++) {
				const key = keys[index];
				const player = playerInfo[key];
				if (player) {
					const netPlayer = this.netPlayers[player.peerId];
					if (netPlayer) netPlayer.setFollowers(player.followerIds);
				}
			}
		}
	}

	/** add a new player to the list of netPlayers. */
	initializeNetPlayer(playerInfo) {
		const name = playerInfo.name;
		const peerId = playerInfo.peerId;
		const actorId = playerInfo.actorId;
		const followerIds = playerInfo.followerIds;
		this.netPlayers[peerId] = new PlayerModel(name, actorId);
		this.netPlayers[peerId].followerIds = followerIds;
		this.netPlayers[peerId].setPeerId(peerId);
		if (!this.netPlayers[peerId].$gamePlayer) {
			this.netPlayers[peerId].initSecondaryGamePlayer();
		}
	}

	updatePlayerInfo() {
		var actor = $gameParty.leader();
		if (this.player.actorId !== actor.actorId()) { this.player.setActorId(actor.actorId()); }

		// update host/client about the new actor id /follower
		this.sendPlayerInfo();
	}

	/** @emits eventMoveEvent */
	emitEventMoveEvent(event) {
		this.onEventMoveEvent(event);
		this.emit('eventMoveEvent');
	}

	onEventMoveEvent(event) {
		const obj = {};
		obj.event = event;
		this.sendViaMainRoute(obj);
	}

	onEventMoveEventData(eventData) {
		/** @type {Game_Event} */
		const mapId = eventData.mapId;
		const event = $gameMap.event(eventData.id);
		if (event) {
			if (mapId === $gameMap.mapId()) {
				if (Math.abs(event._x - eventData.x) > 2 || Math.abs(event._y - eventData.y) > 2) {
					// event.processMoveCommand(eventData,false,true);
					event.setTransparent(false);
					event._x = eventData.x;
					event._y = eventData.y;
					event._realX = eventData.realX;
					event._realY = eventData.realY;
					event.update();
				}
				event.moveStraight(eventData.d, true);
			}
		}
	}

	//-----------------------------------------------------
	// Control Switch Event
	//-----------------------------------------------------

	/** @emits ctrlSwitch */
	emitSwitchEvent(ctrlSwitch) {
		if (!MATTIE.static.maps.onMenuMap()) {
			// only send switches if not in a menu
			const obj = {};
			obj.ctrlSwitch = ctrlSwitch;
			this.sendViaMainRoute(obj);
			this.emit('ctrlSwitch', obj);
		}
	}

	onCtrlSwitchData(ctrlSwitch, id) {
		if (MATTIE.multiplayer.devTools.eventLogger)console.debug('on ctrl switch data');
		const index = ctrlSwitch.i;
		const val = ctrlSwitch.b;
		const s = ctrlSwitch.s;
		if (MATTIE.multiplayer.devTools.eventLogger) { console.debug(index, val); }
		if (s == 0) {
			$gameSwitches.setValue(index, val, true);
		} else if (s == 1) {
			if (MATTIE.multiplayer.varSyncer.syncedOnce) { // self switches only update if vars are synced, this fixes menus.
				$gameSelfSwitches.setValue(index, val, true);
			}
		} else if (s == 2) {
			if (MATTIE.multiplayer.devTools.varLogger) { console.log(`NetPlayer Set ${index} to ${val}`); }
			$gameVariables.setValue(index, val, true);
		}
	}

	//-----------------------------------------------------
	// Update Random Vars Event
	//-----------------------------------------------------

	/**
     * @hostOnly this should only be used by the host
     * @description send the local synced vars to connection
     * @emits randomVars
     */
	emitUpdateSyncedVars() {
		const obj = {};
		obj.syncedVars = {};
		obj.syncedSwitches = {};
		if (MATTIE.multiplayer.hasLoadedVars) {
			MATTIE.static.variable.syncedVars.forEach((id) => {
				obj.syncedVars[id] = $gameVariables.value(id);
			});

			MATTIE.static.variable.secondarySyncedVars.forEach((id) => {
				obj.syncedVars[id] = $gameVariables.value(id);
			});

			MATTIE.static.switch.syncedSwitches.forEach((id) => {
				obj.syncedSwitches[id] = $gameSwitches.value(id);
			});
			this.sendViaMainRoute(obj);
			this.emit('randomVars', obj);
			MATTIE.multiplayer.varSyncRequested = false;
		} else {
			setTimeout(() => {
				this.emitUpdateSyncedVars();
			}, 1000);
		}
	}

	/**
     * @description used by the client to request vars to be synced
     * @emits requestedVarSync
     */
	emitRequestedVarSync() {
		console.log('client  var sync requested');
		const obj = {};
		obj.requestedVarSync = 1;
		this.sendViaMainRoute(obj);
		this.emit('requestedVarSync');
	}

	/**
     * @description process the data for synced var updates
     * @param {dict[]} syncedVars an array of key pair values
     */
	onUpdateSyncedVarsData(syncedVars) {
		MATTIE.multiplayer.varSyncer.shouldSync = false;
		MATTIE.multiplayer.varSyncer.syncedOnce = true;
		Object.keys(syncedVars).forEach((id) => {
			const val = syncedVars[id];
			$gameVariables.setValue(id, val, true); // last var as true to skip net broadcast
		});
	}

	/**
     * @description process the data for synced var updates
     * @param {{dict[]} syncedSwitch an array of key pair values
     */
	onUpdateSyncedSwitchData(syncedSwitch) {
		MATTIE.multiplayer.varSyncer.shouldSync = false;
		MATTIE.multiplayer.varSyncer.syncedOnce = true;
		Object.keys(syncedSwitch).forEach((id) => {
			const val = syncedSwitch[id];
			$gameSwitches.setValue(id, val, true); // last var as true to skip net broadcast
		});
	}

	//-----------------------------------------------------
	// Command Event
	//-----------------------------------------------------

	/** @emits commandEvent */
	emitCommandEvent(cmd) {
		const obj = {};
		obj.cmd = cmd;
		this.sendViaMainRoute(obj);
		this.emit('commandEvent', cmd);
	}

	/** the cmd object */
	onCmdEventData(cmd, peerId) {
		try {
			$gameMap.refreshIfNeeded();
			const params = cmd.parameters;
			const _character = $gameMap.event(params[0] > 0 ? params[0] : cmd.eventId);
			console.log('character');
			console.log(_character);
			if (_character) {
				const moveRoute = params[1];
				const tempCanPass = _character.canPass;
				_character.canPass = () => true;
				_character._moveRouteForcing = true;
				_character.setTransparent(false);
				_character._moveRoute = _character._moveRoute || {
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

				const found = false;
				// whether the move is a duplicate
				const validMove = _character.getValidMove(moveRoute);

				// if (last20Steps[0].code === list[list.length - 1].code) {
				// 	console.log('valid by never finding start');
				// 	validMove = true;
				// }

				console.log(`validmove${validMove}`);

				if (validMove) {
					moveRoute.list.forEach((command) => {
						console.log(`moving with cmd;${command.code}`);
						_character.processMoveCommand(command, true);
					});
					_character.canPass = tempCanPass;
					_character._moveRouteForcing = false;
				}
			}
		} catch (error) {
			console.log(error);
		}
	}

	//-----------------------------------------------------
	// Equipment Change Event
	//-----------------------------------------------------
	/**
     * @description emits the event for changing equipment
     * @emits equipChange
     * */
	emitEquipmentChange(actorId, itemSlot, itemId) {
		const obj = {};
		obj.equipChange = {};
		obj.equipChange.actorId = actorId;
		obj.equipChange.itemSlot = itemSlot;
		obj.equipChange.itemId = itemId;
		this.sendViaMainRoute(obj);
		this.emit('equipChange', obj);
	}

	/**
     * @description updates the given net party's actor's equipment
     * @param {*} equipChangeObj the net obj for equip change
     */
	onEquipmentChangeData(equipChangeObj, id) {
		const actorId = equipChangeObj.actorId;
		const itemSlot = equipChangeObj.itemSlot;
		const itemId = equipChangeObj.itemId;
		const actor = this.netPlayers[id].$netActors.baseActor(actorId);
		if (actor) {
			if (itemSlot === 0) {
				actor.forceChangeEquip(itemSlot, $dataWeapons[itemId], true);
			} else {
				actor.forceChangeEquip(itemSlot, $dataArmors[itemId], true);
			}
		}
	}

	//-----------------------------------------------------
	// Marriage Event
	//-----------------------------------------------------
	/**
     * @description emits the event for changing equipment
     * @emits marriageReq
	 * @param targetIds an array of the peerIds of all persons (excluding host involved in this request)
	 * @param response whether this is emitting a response to the request
	 * @param responseBool whether this player says yes or no to the response
     * */
	emitMarriageRequest(targetIds, response = false, responseBool = false) {
		if (!(typeof targetIds == 'object')) targetIds = [targetIds];
		const obj = {};
		obj.marriageReq = {};
		obj.marriageReq.targetIds = targetIds;
		this.sendViaMainRoute(obj);
		this.emit('marriageReq', obj);
	}

	/**
     * @description process the data of a marriage request
     * @param {*} marriageReqObj the net obj for marriagereq change
     */
	onMarriageRequestData(marriageReqObj, id) {
		const targetIds = marriageReqObj.targetIds;
		const hostId = id;
		if (targetIds.includes(this.peerId)) {
			MATTIE.msgAPI.showChoices(['Yes', 'NO'], 0, 0, (n) => {
				// emit a marraige response to everyone, 0 is yes as shown above in the choices
				this.emitMarriageResponse(n == 0, hostId, targetIds);
			}, `show love to ${this.netPlayers[id].name}?`);
		}
	}

	/**
	 * @description send the marraige response to all clients
	 * @emits marriageResponse
	 * @param {boolean} consent whether the local player said yes or no
	 * @param {boolean} hostId the id of the person who initiated the marriage request
	 */
	emitMarriageResponse(consent, hostId, targetIds) {
		const obj = {};
		obj.marriageResponse = {};
		obj.marriageResponse.consent = consent;
		obj.marriageResponse.hostId = hostId;
		obj.marriageResponse.targetIds = targetIds;
		this.emit('marriageResponse', obj);

		this.sendViaMainRoute(obj);
		// lock player in place and make them invisible while it forms
		this.player.conversationModel.marry(consent, false);
		if (consent) {
			this.player.marriedTo = targetIds;
			this.player.marriedTo.push(hostId);
			this.player.marriageHost = hostId;
			this.player.isMarried = true;
			this.player.isMarriageHost = false;
			this.updatePlayerInfo();
		}
	}

	/**
	 * @description process a marriage response
	 */
	onMarriageResponseData(marriageResponse, id) {
		const sender = this.netPlayers[id];
		const consent = marriageResponse.consent;
		// the id of the person who initialized the marriage
		const hostId = marriageResponse.hostId;
		const targetIds = marriageResponse.targetIds;
		if (consent) {
			if (hostId === this.peerId) {
				// if this is the host
				this.player.isMarried = true;
				this.player.marriedTo = targetIds;
				this.player.marriedTo.push(hostId);
				this.player.marriageHost = hostId;
				this.player.isMarriageHost = true;
				this.updatePlayerInfo();

				// display marriage event
				this.player.conversationModel.target = sender;
				this.player.conversationModel.marry(consent, true);
			}
		}
	}

	//-----------------------------------------------------
	// Spawned events (handles item drops and any event spawned at run time)
	//-----------------------------------------------------

	/**
     * @emits spawnEvent
     * @param {*} data data of the event
     */
	emitEventSpawn(data) {
		const obj = {};
		obj.spawnEvent = data;
		this.sendViaMainRoute(obj);
		this.emit('spawnEvent', obj);
	}

	/**
     *
     * @param {*} data event net obj
     * @param id unused
     */
	onEventSpawn(data, id) {
		const event = new MapEvent();
		event.data = data;
		try {
			event.spawn(data.x, data.y, true);
		} catch (error) {
			// setTimeout(() => {
			//     this.onEventSpawn(data,id)
			// }, 1000);
		}
	}

	//-----------------------------------------------------
	// Transform Event
	//-----------------------------------------------------

	/**
     * @description emit the transform enemy event
     * @emits transformEnemy
     * @param {*} enemyIndex the index of the enemy to transform
     * @param {*} transformIndex the transform index
     */
	emitTransformEvent(enemyIndex, transformIndex) {
		const obj = {};
		obj.transformEnemy = {};
		obj.transformEnemy.enemyIndex = enemyIndex;
		obj.transformEnemy.transformIndex = transformIndex;
		this.sendViaMainRoute(obj);
		this.emit('transformEnemy');
	}

	/**
     * @description transform an enemy based on net event
     * @param {*} enemyTransformObj the net obj for enemy transform
     * @param {*} id sender id, make sure local player is in combat with this troop before doing anything
     */
	onTransformEventData(enemyTransformObj, id) {
		if ($gameTroop.getIdsInCombatWithExSelf().includes(id)) {
			const enemyIndex = enemyTransformObj.enemyIndex;
			const transformIndex = enemyTransformObj.transformIndex;
			MATTIE.multiplayer.enemyCommandEmitter.transformEnemy(enemyIndex, transformIndex);
		}
	}

	//-----------------------------------------------------
	// Enemy Appear Event
	//-----------------------------------------------------

	/**
     * @description emit the transform enemy event
     * @emits appearEnemy
     * @param {*} enemyIndex the index of the enemy to appear
     */
	emitAppearEnemyEvent(enemyIndex) {
		const obj = {};
		obj.appearEnemy = {};
		obj.appearEnemy.enemyIndex = enemyIndex;
		this.sendViaMainRoute(obj);
		this.emit('appearEnemy');
	}

	/**
     * @description appear an enemy based on net event
     * @param {*} enemyAppearObj the net obj for enemy transform
     * @param {*} id sender id, make sure local player is in combat with this troop before doing anything
     */
	onAppearEnemyEventData(enemyAppearObj, id) {
		if ($gameTroop.getIdsInCombatWithExSelf().includes(id)) {
			const enemyIndex = enemyAppearObj.enemyIndex;
			MATTIE.multiplayer.enemyCommandEmitter.appearEnemy(enemyIndex);
		}
	}

	//-----------------------------------------------------
	// Enemy Add State Event
	//-----------------------------------------------------

	/**
     * @description emit the state enemy event
     * @emits enemyState
     * @param {int} enemyIndex the index of the enemy to appear
     * @param {bool} addState add or remove the state
     * @param {int} stateId the state id
     */
	emitEnemyStateEvent(enemyIndex, addState, stateId) {
		const obj = {};
		obj.enemyState = {};
		obj.enemyState.enemyIndex = enemyIndex;
		obj.enemyState.addState = addState;
		obj.enemyState.stateId = stateId;
		this.sendViaMainRoute(obj);
		this.emit('enemyState');
	}

	/**
     * @description additional actions that the ned controller needs to perform on specific states triggered
     * @param {int} enemyIndex the enemyIndex
     * @param {int} stateId the stateid
     * @param {bool} add true if the state should be added or removed
     */
	stateSpecificActions(enemyIndex, stateId, add) {
		const enemy = $gameTroop.members()[enemyIndex];
		if (enemy) {
			if (add) {
				switch (stateId) {
				case Game_Battler.prototype.deathStateId():
					if (!enemy.hasState(Game_Battler.prototype.deathStateId())) this.performCosmeticAttack(enemy);
					break;

				default:
					break;
				}
			}
		}
	}

	/**
     * @description change enemy state based on net eobj
     * @param {*} enemyStateObj the net obj for enemy state event
     * @param {*} id sender id, make sure local player is in combat with this troop before doing anything
     */
	onEnemyStateEventData(enemyStateObj, id) {
		if ($gameTroop.getIdsInCombatWithExSelf().includes(id)) {
			const enemyIndex = enemyStateObj.enemyIndex;
			const addState = enemyStateObj.addState;
			const stateId = enemyStateObj.stateId;
			this.stateSpecificActions(enemyIndex, stateId, addState);
			MATTIE.multiplayer.enemyCommandEmitter.stateChange(enemyIndex, addState, stateId);
		}
	}

	//-----------------------------------------------------
	// Runtime troop spawn Event
	//-----------------------------------------------------
	/**
     * @description emit the runtime troop event
     * @emits runtimeTroopSpawn
     * @param {*} troopId the id of the troop being added
     */
	emitRuntimeTroopEvent(troopId) {
		const obj = {};
		obj.runTimeTroopSpawn = troopId;
		this.sendViaMainRoute(obj);
		this.emit('runtimeTroopSpawn');
	}

	/**
     * @description process the enemiesdata object and add a new run time troop to the current combat if in combat with same troop as sender
     * @param {MATTIE.troopAPI.runtimeTroop[]} enemiesData
     * @param {UUID} id the sender's id
     */
	onRuntimeTroopEvent(troopId, id) {
		if ($gameTroop.getIdsInCombatWithExSelf().includes(id)) {
			if (troopId === MATTIE.static.troops.crowMauler) {
				MATTIE.betterCrowMauler.crowCont.invadeBattle(true);
			}
		}
	}

	//-----------------------------------------------------
	// Save Event
	//-----------------------------------------------------

	/**
     * @description used for syncing saves
     * @emits saveEvent
     */
	emitSaveEvent() {
		if (MATTIE.multiplayer.hasLoadedVars) {
			if (MATTIE.multiplayer.params.syncSaves) {
				const obj = {};
				obj.saveEvent = 1;
				this.emit('saveEvent');
				this.sendViaMainRoute(obj);
			}
		}
	}

	/**
     * @description open save menu
     */
	onSaveEventData() {
		if (MATTIE.multiplayer.hasLoadedVars) {
			const prevFunc = Scene_Save.prototype.helpWindowText;
			Scene_Save.prototype.helpWindowText = () => 'An ally trigged a save. Please choose a slot to save.';
			Game_Interpreter.prototype.command352();

			const previousOnSaveFileOk = Scene_Save.prototype.onSavefileOk;
			Scene_Save.prototype.onSavefileOk = function () {
				Scene_File.prototype.onSavefileOk.call(this);
				$gameSystem.onBeforeSave();
				if (DataManager.saveGame(this.savefileId(), false, true)) {
					this.onSaveSuccess();
				} else {
					this.onSaveFailure();
				}
				Scene_Save.prototype.onSavefileOk = previousOnSaveFileOk;
			};

			setTimeout(() => {
				// we are changing the getter for a few seconds just to retrive a string once and then go back to normal
				// this is easier than properly extending.
				Scene_Save.prototype.helpWindowText = prevFunc;
			}, 2000);
		}
	}

	//-----------------------------------------------------
	// Spectate Event
	//-----------------------------------------------------

	/**
     * @description emit the spectate event
     * @emits spectate
     * @param {boolean} bool  true if spectating, false if nolonger spectating
     * @param {UUID} id, the id of the user that is changing specatting
     */
	emitSpectateEvent(bool, id) {
		const obj = {};
		obj.spectate = {};
		obj.spectate.val = bool;
		obj.spectate.id = id;
		this.sendViaMainRoute(obj);
	}

	/**
     *
     * @param {*} spectateObj the net spectate event,
     * @param {*} id the sender id
     */
	onSpectateEventData(spectateObj, id) {
		const bool = spectateObj.val;
		const spectatorId = spectateObj.id;
		if (spectatorId === this.peerId) {
			this.player.setSpectate(bool, true);
		} else {
			this.netPlayers[spectatorId].setSpectate(bool, true);
		}
	}

	//-----------------------------------------------------
	// Pvp Event
	//-----------------------------------------------------
	/**
     * @description emit the pvp event to trigger combat with a net player
     * @param {*} targetedPlayerId
     * @param {bool} bool whether this is starting or ending a fight
     * @emits "pvpEvent"
     */
	emitPvpEvent(targetedPlayerId, bool = true) {
		const obj = {};
		obj.pvpEvent = {};
		obj.pvpEvent.start = bool;
		obj.pvpEvent.targetedPlayer = targetedPlayerId;
		this.sendViaMainRoute(obj);
		this.emit('pvpEvent');
	}

	/** @description process the pvp data event from the client and start a combat if they are targeting this player */
	onPvpEventData(pvpData, senderId) {
		const targetedPlayer = pvpData.targetedPlayer;
		const start = pvpData.start; // whether this event is saying a player joined or left
		if (start) {
			if (this.peerId === targetedPlayer) {
				MATTIE.multiplayer.pvp.PvpController.startCombatWith(senderId);
			} else {
				MATTIE.multiplayer.pvp.PvpController.onCombatantJoin(senderId, targetedPlayer);
			}
		} else {
			MATTIE.multiplayer.pvp.PvpController.onCombatantLeave(senderId, targetedPlayer);
		}
	}

	//-----------------------------------------------------
	// Set Transparent event
	//-----------------------------------------------------

	/**
	 * @description emit the set transparent event to the connected peers
	 * @param {boolean} bool whether the player is transparent or visible
	 * @emits transparentEvent
	 */
	emitSetTransparentEvent(bool) {
		const obj = { transparentEvent: {} };
		obj.transparentEvent.val = bool;
		this.emit('transparentEvent');
		this.sendViaMainRoute(obj);
	}

	/**
	 * @description process and act upon the set transparent event when received.
	 * @param {Object} transparentEventData see emitSetTransparent event defined above for what this object looks like
	 * @param {UUID} id the id of the original sender
	 */
	onSetTransparentEventData(transparentEventData, id) {
		if (this.netPlayers[id]) { this.netPlayers[id].$gamePlayer.setTransparent(transparentEventData.val, true); }
	}

	//-----------------------------------------------------
	// Set CharecterImage event IE: outfit changes
	//-----------------------------------------------------

	/**
	 * @description emit the set charecter image event to the connected peers
	 * @param {string} characterName the name of the charsheet (the file within www/imgs/charecters excluding .png)
	 * @param {int} characterIndex the index within that sprite sheet
	 * @param {int} actorId the id of the actor this is occurring to
	 * @emits setCharImgEvent
	 */
	emitSetCharacterImageEvent(characterName, characterIndex, actorId) {
		const obj = { setCharImgEvent: {} };
		obj.setCharImgEvent.characterIndex = characterIndex;
		obj.setCharImgEvent.characterName = characterName;
		obj.setCharImgEvent.actorId = actorId;
		this.emit('setCharImgEvent');
		this.sendViaMainRoute(obj);
	}

	/**
	 * @description process and act upon the charecter image change event
	 * @param {Object} outfitChangeData the data object defined in the emitter above
	 * @param {UUID} id the id of the original sender
	 */
	onSetCharacterImageEventData(outfitChangeData, id) {
		console.log('outfit Aread');
		console.log(outfitChangeData);
		const charName = outfitChangeData.characterName;
		const charIndex = outfitChangeData.characterIndex;
		const actorId = outfitChangeData.actorId;

		const netPlayer = this.netPlayers[id];
		const netActors = netPlayer.$netActors;
		const actor = netActors.baseActor(actorId);

		console.log(netActors);
		console.log(actor);
		if (actor) {
			actor.setCharacterImage(charName, charIndex);
			actor.refresh(); // this likely does nothing, but its good practice to call here as the engine tends to do similarly
			netPlayer.$gamePlayer.refresh(); // this updates the actual display sprite
		}
		this.additionalOutfitActions(outfitChangeData, id);
	}

	/**
	 * @description additional actions separate to the actual forwarding of the outfit change event that also get run alongside it
	 * @param {Object} outfitChangeData the data object defined in the emitter above
	 * @param {UUID} id the id of the original sender
	 */
	additionalOutfitActions(outfitChangeData, id) {
		const charName = outfitChangeData.characterName;
		const charIndex = outfitChangeData.characterIndex;
		const actorId = outfitChangeData.actorId;
		const netPlayer = this.netPlayers[id];
		const netActors = netPlayer.$netActors;
		const actor = netActors.baseActor(actorId);

		// handle torch logic
		if (actorId === netPlayer.actorId) { // we only care about the main char for torches
			if (charName.toLowerCase().contains('torch')) {
				console.log('PLAYER HAS TORCH');
				netPlayer.$gamePlayer.setTorch(true);
			} else {
				console.log('PLAYER HAS NO TORCH :( *cries');
				netPlayer.$gamePlayer.setTorch(false);
			}
		}
	}

	//-----------------------------------------------------
	// Dash event
	//-----------------------------------------------------

	/**
	 * @description emit the dash event to clients
	 * @param {boolean} isDashing is this player dashing or not
	 * @emits dashEvent
	 */
	emitDashEvent(isDashing) {
		const obj = { dashEvent: { val: isDashing } };
		this.emit('dashEvent');
		this.sendViaMainRoute(obj);
	}

	/**
	 * @description process and perform actions when a dash event is received
	 * @param {Object} dashData the dash event net object defined in the method above
	 * @param {UUID} id the id of the original sender
	 */
	onDashEventData(dashData, id) {
		const isDashing = dashData.val;
		const gamePlayer = this.netPlayers[id].$gamePlayer;
		gamePlayer.isDashing = () => isDashing;
		gamePlayer._isDashing = isDashing;
	}

	//-----------------------------------------------------
	// Move speed change event
	//-----------------------------------------------------
	/**
	 * @description emit the event for a move speed change to clients
	 * @param {number} moveSpeed the new movespeed
	 * @emits "moveSpeedEvent"
	 */
	emitSpeedEvent(moveSpeed) {
		const obj = { moveSpeedEvent: { val: moveSpeed } };
		this.emit('moveSpeedEvent');
		this.sendViaMainRoute(obj);
	}

	/**
	 * @description process the move speed change event
	 * @param {Object} moveSpeedData see method above
	 * @param {Object} id the id of the original sender
	 */
	onSpeedEventData(moveSpeedData, id) {
		const newMoveSpeed = moveSpeedData.val;
		const gamePlayer = this.netPlayers[id].$gamePlayer;
		gamePlayer.setMoveSpeed(newMoveSpeed);
	}

	//-----------------------------------------------------
	// SaveEventLocationEvent (yanfly plugin handling)
	//-----------------------------------------------------

	/**
	 * @description send to all players the event location save event
	 * @param {int} mapId the id of the map
	 * @param {Game_Event} event the id of the event
	 * @emits saveEventLocationEvent
	 */
	emitSaveEventLocationEvent(mapId, event) {
		const obj = {};
		obj.saveEventLocationEvent = {};
		obj.saveEventLocationEvent.mapId = mapId;

		// since we dont wanna send a shit ton of data we will only send the parts of the event that we need to
		obj.saveEventLocationEvent.event = {};
		obj.saveEventLocationEvent.event.eventId = event.eventId();
		obj.saveEventLocationEvent.event.x = event.x;
		obj.saveEventLocationEvent.event.y = event.y;
		obj.saveEventLocationEvent.event.direction = event.direction();

		this.emit('saveEventLocationEvent');
		this.sendViaMainRoute(obj);
	}

	/**
	 * @description handle the event
	 * @param {*} saveEventLocationData an obj as structured in the method above
	 * @param {uuid} id the id of the original sender
	 */
	onSaveEventLocationEventData(saveEventLocationData, id) {
		const event = saveEventLocationData.event;
		const mapId = saveEventLocationData.mapId;

		// restructure our data so we can use it without editing yanfly's method
		const _eventId = event.eventId;
		event.eventId = () => _eventId;
		const _direction = event.direction;
		event.direction = () => _direction;

		$gameSystem.saveEventLocation(mapId, event, true);
	}

	//-----------------------------------------------------
	// MISC
	//-----------------------------------------------------

	/**
     * @description transfers all players on the current map to their locations on the current map
     */
	updatePlayersOnCurrentMap() {
		const keys = Object.keys(this.netPlayers);
		const idsOfPlayersOnSameMap = keys.filter((playerKey) => this.netPlayers[playerKey].isOnMap());
		for (let index = 0; index < idsOfPlayersOnSameMap.length; index++) {
			/** @type {PlayerModel} */
			const key = idsOfPlayersOnSameMap[index];
			const player = this.netPlayers[key];
			const transObj = {};
			transObj.x = player.$gamePlayer.x;
			transObj.y = player.$gamePlayer.y;
			transObj.map = player.map;
			this.transferNetPlayer(transObj, player.peerId);
		}
	}

	initEmitterOverrides() {
		if (MATTIE.multiplayer.isActive && !MATTIE.multiplayer.emittedInit) {
			MATTIE.multiplayer.emittedInit = true;
			MATTIE.multiplayer.gamePlayer.override.call(this);
		}
	}

	/**
     * @description perform a solely cosmetic attack
     * @param {Game_Battler} target
     */
	performCosmeticAttack(target = null) {
		return true;
		// eslint-disable-next-line no-unreachable
		const ids = $gameTroop.getIdsInCombatWithExSelf();
		if (ids) {
			if (ids.length > 0) {
				/** @type {Game_Actor} */
				const party = this.netPlayers[ids[MATTIE.util.randBetween(0, ids.length - 1)]].battleMembers();
				const subject = party[MATTIE.util.randBetween(0, party.length - 1)];

				subject.performAttack();
				if (target) {
					this.performCosmeticDamageAnimation(subject, [target], 1);
				}
			}
		}
	}

	/**
     * @description trigger a damage animation (purely cosmetic)
     * @param {Game_Battler} subject the subject performing the attack
     * @param {Game_Battler[]} targets the targets to display the animation on
     * @param {int} animId
     */
	performCosmeticDamageAnimation(subject, targets, animId) {
		BattleManager._logWindow.showAnimation(subject, targets, animId);
	}
}

// ignore this does nothing, just to get intellisense working. solely used to import into the types file for dev.
try {
	module.exports.BaseNetController = BaseNetController;
} catch (error) {
	// eslint-disable-next-line no-global-assign
	module = {};
	module.exports = {};
}

module.exports.BaseNetController = BaseNetController;
