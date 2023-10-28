// this is the mod that contains all difficulty related things

MATTIE.menus.difficultyMenu.addDifficultyChoice(
	'Trepidation & Famine',
	`Do not fear the dark, fear what is in the dark. Fear your hunger, lest you go mad. Enemies roam in groups. 
Nowhere is safe. All characters spawn with random custom debuffs. New books, items and bosses. (see config if u care). 
(T&S ruleset also applies)`,

	() => { MATTIE.TaF.enableTF(); },
);
MATTIE.menus.difficultyMenu.addDifficultyChoice(
	'Abhorrence & Inanition',
	`All characters spawn with multiple custom major debuffs. You are known to all, you are hated by all, even the gods. 
Darkness roams, Run, lest they infest you. Attacks cost stamina. Pray the sandman only brings you sleep.
 (T&F ruleset also applies)`,

	() => { MATTIE.TaF.enableAI(); },
);

let name = 'Unknown & Hidden';

let desc = 'Beat Abhorrence & Inanition to unlock this difficulty';
if (MATTIE.DataManager.global.get('BeatenAandI')) {
	name = 'Extinction & Termination';
	desc = `The god s hatred of you knows no bounds. You are an affront to life itself and must be made extinct.
(All ruleset except for silly mode & solo apply)`;
}

MATTIE.menus.difficultyMenu.addDifficultyChoice(
	name,
	desc,

	() => { MATTIE.TaF.enableET(); },
);
MATTIE.menus.difficultyMenu.addDifficultyChoice(
	'Speed & Unforgiving Decay',
	`Time is Difficulty. You are prey, the hunt is on. Watch your step, for time devours all, kings, kingdoms and dungeons alike.
 Take nothing for granted, for all was once dust and will be dust once more.
    `,
	() => { MATTIE.TaF.enableSU(); },
);

MATTIE.menus.difficultyMenu.addDifficultyChoice(
	'Frivolous & Humorous',
	`Face off against a unknown being with the great arcane might to morph reality as though it were clay (console commands). 
An unknown deity of trickery and tomfoolery shall be as annoying as possible as you try to beat the game.
    `,
	() => { MATTIE.TaF.enableSillyMode(); },
	'╭∩╮ʕ•ᴥ•ʔ╭∩╮ (silly mode)',
);

/**
 * @description enable silly difficulty
 */
MATTIE.TaF.enableSillyMode = function () {
	$gameSystem.sillyMode = true;
	MATTIE.msgAPI.footerMsg('May your fear be hungry');
	MATTIE.msgAPI.footerMsg('May your hunger be fearful');
	MATTIE.msgAPI.footerMsg('May your sill be y');
	MATTIE.msgAPI.footerMsg('╭∩╮ʕ•ᴥ•ʔ╭∩╮');
	MATTIE.msgAPI.footerMsg('L');
};

/**
 * @description Enable Trepidation & Famine difficulty
 */
MATTIE.TaF.enableTF = function () {
	$gameSwitches.setValue(MATTIE.static.switch.STARVATION, true);
	$gameSystem.tfMode = true;
};

/**
 * @description Enable Abhorrence & Inanition difficulty
 */
MATTIE.TaF.enableAI = function () {
	this.enableTF();
	$gameSystem.aiMode = true;
};

/**
 * @description Enable Extinction & Termination difficulty
 */
MATTIE.TaF.enableET = function () {
	this.enableAI();
	$gameSystem.xtMode = true;
};

/**
 * @description Enable Speed & Unforgiving Decay difficulty
 */
MATTIE.TaF.enableSU = function () {
	$gameSystem.suMode = true;
};

/**
 * @description the tick for terror and starvation difficulty
 */
MATTIE.TaF.tfTick = function () {
	//
};

/**
 * @description the tick for Abhorrence & Inanition difficulty
 */
MATTIE.TaF.aiTick = function () {
	//
};

/**
 * @description the tick for Extinction & Termination difficulty
 */
MATTIE.TaF.etTick = function () {
	//
};

/**
 * @description the tick for Speed & Unforgiving Decay difficulty
 */
MATTIE.TaF.suTick = function () {
	//
};

/**
 * @description the tick for silly mode difficulty
 */
MATTIE.TaF.sillyTick = function () {
	if (!this.sillyTickFirst) {
		this.sillyTickFirst = true;
		const prev = Game_Troop.prototype.setup;
		this.undoSillyOverrides = () => {
			Game_Troop.prototype.setup = prev;
		};
		let calledRecently = false;
		Game_Troop.prototype.setup = function (troopId, xOffset = 0, yOffset = 0, cb = () => {}) {
			MATTIE.troopAPI.config.shouldSort = false;
			if (!calledRecently) {
				if (typeof troopId != 'object') troopId = [troopId, 15];
				else troopId.push(15);
				calledRecently = true;
				setTimeout(() => {
					calledRecently = false;
					MATTIE.troopAPI.config.shouldSort = true;
				}, 10000);
			}

			prev.call(this, troopId, xOffset, yOffset, cb);
		};
	}

	MATTIE.msgAPI.footerMsg('╭∩╮ʕ•ᴥ•ʔ╭∩╮');

	if (!$gameParty.inBattle() && SceneManager._scene instanceof Scene_Map) { // overworld trolls
		if (this.tick & 1100 == 0) {
			if (MATTIE.util.randChance(0.2)) {
				MATTIE.miscAPI.spawnBearTrapsAround($gamePlayer, 8, 14);
			} else if (MATTIE.util.randChance(0.6)) {
				MATTIE.miscAPI.spawnRustyNailsAround($gamePlayer, 15, 26);
			} else {
				MATTIE.miscAPI.spawnGhoulsAround($gamePlayer, 2, 4);
			}
		}

		if (this.tick % 50 == 0) {
			if (MATTIE.util.randChance(0.2)) {
				const anims = [140, 7, 8, 12, 23, 33, 34, 44, 71, 124, 136, 136, 153, 157, 176, 181, 184, 190, 210];
				$gamePlayer.requestAnimation(anims[MATTIE.util.randBetween(0, anims.length - 1)]);
			} else if (MATTIE.util.randChance(0.1)) {
				const anims = [282, 298];

				const members = $gameParty.members();
				const index = MATTIE.util.randBetween(0, members.length - 1);
				const actor = members[index];
				const follower = $gamePlayer.follower(index - 1);
				if (follower) {
					follower.requestAnimation(anims[MATTIE.util.randBetween(0, anims.length - 1)]);
					follower.requestAnimation(1);
				} else {
					$gamePlayer.requestAnimation(anims[MATTIE.util.randBetween(0, anims.length - 1)]);
				}
				actor.setHp(actor.hp - 5);
			}
		}

		if (this.tick % 435 == 0) {
			if (MATTIE.util.randChance(0.5)) {
				MATTIE.msgAPI.displayMsg('I flipped your controls');
				MATTIE.fxAPI.startScreenShake(100, 1, 100);
				MATTIE.miscAPI.flipControls();
			}
		}

		// visual trolls
		if (this.tick % 75 == 0) { // very constant
			if (MATTIE.util.randChance(0.2)) {
				MATTIE.msgAPI.displayMsg('Hah, I hope you like closing messages');
			} else if (MATTIE.util.randChance(0.1)) {
				MATTIE.msgAPI.displayMsg('RED MODE');
				MATTIE.fxAPI.setupTint(155, 0, 0, 0, 500);
			} else if (MATTIE.util.randChance(0.13)) {
				MATTIE.msgAPI.displayMsg('GREEN MODE');
				MATTIE.fxAPI.setupTint(0, 155, 0, 0, 500);
			} else if (MATTIE.util.randChance(0.26)) {
				MATTIE.msgAPI.displayMsg('BLUE MODE (FOREVER)');
				MATTIE.fxAPI.setupTint(0, 0, 155, 0, 5000);
			} else if (MATTIE.util.randChance(0.19)) {
				MATTIE.fxAPI.startScreenShake(100, 1, 100);
			} else if (MATTIE.util.randChance(0.11)) {
				MATTIE.msgAPI.displayMsg('BLUE MODE');
				MATTIE.fxAPI.setupTint(0, 0, 155, 0, 500);
			} else if (MATTIE.util.randChance(0.21)) {
				for (let index = 0; index < 50; index++) {
					MATTIE.msgAPI.displayMsg('Hah, I hope you like closing messages');
				}
			} else if (MATTIE.util.randChance(0.75)) {
				MATTIE.msgAPI.displayMsg('I drew you a doggie.');
				MATTIE.fxAPI.showImage('doggie' + `${MATTIE.util.randBetween(1, 2)}`, 10, 0, 0);
				setTimeout(() => {
					MATTIE.fxAPI.deleteImage(10);
				}, 25000);
			} else {
				MATTIE.msgAPI.displayMsg('╭∩╮ʕ•ᴥ•ʔ╭∩╮');
				if (MATTIE.util.randChance(0.5)) {
					MATTIE.miscAPI.tripAndFall(1);
				} else {
					MATTIE.miscAPI.spawnBearTrapsAround($gamePlayer, 1, 3);
				}
			}
		}

		// minor trolls
		if (this.tick % 500 == 0) { // every 500 ticks (100 seconds)
			if (MATTIE.util.randChance(0.5)) {
				MATTIE.msgAPI.footerMsg('I stole all money btw.');
				$gameParty.loseItem(MATTIE.static.items.silverCoin, 10);
			} else if (MATTIE.util.randChance(0.25)) {
				MATTIE.msgAPI.footerMsg('Hey shanty.....');
				MATTIE.msgAPI.footerMsg('I stole all your food');
				MATTIE.miscAPI.stealAllFood();
			} else {
				MATTIE.miscAPI.spawnBearTrapsAround($gamePlayer, 1, 3);
			}
		}
		if (this.tick % 50 === 0) {
			if (!this.green && !this.purple && MATTIE.util.randChance(0.03)) {
				this.purple = true;
				MATTIE.msgAPI.footerMsg('Fuck you, you\'re purple now');
				MATTIE.fxAPI.addLightObject(() => $gamePlayer, () => MATTIE.util.hasTorchActive(), 50, 250, '#f20aa9', 'black');
			} else if (!this.green && !this.purple && MATTIE.util.randChance(0.04)) {
				this.green = true;
				MATTIE.msgAPI.footerMsg('Fuck you, you\'re green now');
				MATTIE.fxAPI.addLightObject(() => $gamePlayer, () => MATTIE.util.hasTorchActive(), 50, 250, '#2fff00', 'black');
			}
		}
		if (this.tick % 400 == 0) {
			if (MATTIE.util.randChance(0.4)) {
				// trip and drop a few items
				MATTIE.miscAPI.tripAndFall(7);
			} else if (MATTIE.util.randChance(0.75)) {
				MATTIE.miscAPI.spawnRustyNailsAround($gamePlayer, 2, 2);
			} else if (MATTIE.util.randChance(0.76)) {
				MATTIE.miscAPI.spawnRustyNailsAround($gamePlayer, 15, 26);
			} else {
				MATTIE.miscAPI.spawnGhoulsAround($gamePlayer, 8, 16);
			}
		}
		if (this.tick % 350 == 0) {
			if (MATTIE.util.randChance(0.04)) {
				// trip and drop so many items
				MATTIE.miscAPI.tripAndFall(75);
			} else if (MATTIE.util.randChance(0.43)) {
				MATTIE.miscAPI.spawnGhoulsAround($gamePlayer, 1, 1);
			} else if (MATTIE.util.randChance(0.23)) {
				MATTIE.miscAPI.spawnGaurdsAround($gamePlayer, 1, 1);
			}
		}

		if (this.tick % 200 == 0) {
			if (MATTIE.util.randChance(0.05)) {
				MATTIE.msgAPI.footerMsg('I fucked up your god affinity');
				const vars = MATTIE.static.variable.godAffinityAndPrayerVars;
				vars.forEach((v) => {
					const value = MATTIE.util.clamp(($gameVariables.value(v) - MATTIE.util.randBetween(0, 1)), 0, 4);
					$gameVariables.setValue(v, value);
				});
			}
		}

		// major trolls
		if (this.tick % 1000 == 0) { // every 200 seconds
			if (MATTIE.util.randChance(0.50)) { // 25% chance
				MATTIE.msgAPI.footerMsg('Hey girly.....');
				MATTIE.msgAPI.footerMsg('Im going to spawn bear traps around you soon.');
				setTimeout(() => {
					MATTIE.miscAPI.spawnBearTrapsAround($gamePlayer, 1, MATTIE.util.randBetween(7, 20));
				}, MATTIE.util.randBetween(5000, 25000));
			} else if (MATTIE.util.randChance(0.55)) {
				MATTIE.msgAPI.footerMsg('Hey burlycop.....');
				MATTIE.msgAPI.footerMsg('I think you need to slow down for a while');
				MATTIE.msgAPI.displayMsg('!!!!SLOW DOWN!!!!', 1, 1);
				const lastSpeed = $gamePlayer.realMoveSpeed;
				$gamePlayer.realMoveSpeed = () => 1;
				setTimeout(() => {
					$gamePlayer.realMoveSpeed = lastSpeed;
				}, MATTIE.util.randBetween(10000, 50000));
			} else {
				MATTIE.miscAPI.spawnBearTrapsAround($gamePlayer, 1, 1);
			}
		}

		if (this.tick % 700 == 0) {
			if (MATTIE.util.randChance(0.15)) { // spawn moonless
				MATTIE.msgAPI.displayMsg('I brought you a doggo', 1, 1);
				MATTIE.miscAPI.spawnMoonless($gamePlayer);
			} else if (MATTIE.util.randChance(0.75)) { // spawn moonless
				MATTIE.msgAPI.showChoices(
					['she fear on my hung till I unger', 'she ung on my fear till i fun', '/kill @e[type=entity]', 'I want a gift'],
					0,
					1,
					(n) => {
						switch (n) {
						case 0:
							MATTIE.fxAPI.showImage('endingsS_mercenary', 10, 0, 0);
							setTimeout(() => {
								MATTIE.fxAPI.deleteImage(10);
							}, 5000);
							break;
						case 1:
							MATTIE.fxAPI.showImage('endingsS_knight', 10, 0, 0);
							setTimeout(() => {
								MATTIE.fxAPI.deleteImage(10);
							}, 5000);
							break;
						case 2:
							MATTIE.msgAPI.displayMsg('okay I mean you asked for it');
							$gameParty.removeActor($gameParty.leader().actorId());
							break;
						case 3:
							MATTIE.msgAPI.displayMsg('Okay I took all your food and gifted it to a puppy.');
							MATTIE.miscAPI.stealAllFood();
							$gameParty.addActor(MATTIE.static.actors.moonlessId);
							break;
						}
					},
				);
			}
		}
	}
};

Input.addKeyBind('y', () => {
	MATTIE.msgAPI.displayMsg('I flipped your controlls');
	MATTIE.miscAPI.flipControls();
}, 'trip and fall');

MATTIE.TaF.tick = 0;

/**
 * @description the tick for all difficulty this tick runs 5 times per second
 */
MATTIE.TaF.difficultyTick = function () {
	this.tick++;
	if ($gameSystem.tfMode) {
		this.tfTick();
	}
	if ($gameSystem.aiMode) {
		this.aiTick();
	}
	if ($gameSystem.etMode) {
		this.etTick();
	}
	if ($gameSystem.suMode) {
		this.suTick();
	}
	if ($gameSystem.sillyMode) {
		this.sillyTick();
	}
};

setInterval(() => {
	MATTIE.TaF.difficultyTick();
}, 200);

const prev = Scene_Gameover.prototype.initialize;
Scene_Gameover.prototype.initialize = function () {
	Scene_Base.prototype.initialize.call(this);
	$gameSystem.sillyMode = false;
	$gameSystem.tfMode = false;
	$gameSystem.aiMode = false;
	$gameSystem.xtMode = false;
	$gameSystem.suMode = false;
	if (MATTIE.TaF.undoSillyOverrides) { MATTIE.TaF.undoSillyOverrides(); }
};
