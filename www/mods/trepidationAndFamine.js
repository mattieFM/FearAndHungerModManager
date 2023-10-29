/* eslint-disable max-len */
// this is the mod that contains all difficulty related things

$gameSystem.sillyMode = false;
$gameSystem.tfMode = false;
$gameSystem.aiMode = false;
$gameSystem.xtMode = false;
$gameSystem.suMode = false;

const bible = MATTIE.itemAPI.quickBook(
	'The Holy Bible',
	'<WordWrap> The inspired word..... Chapter IV, Verse I: "thou shalt not staple squirrels."',
	'book',
	// eslint-disable-next-line max-len
	'1In the beginning God created the heavens and the earth. 2And the earth was waste and void; and darkness was upon the face of the deep: and the Spirit of God moved upon the face of the waters. 3And God said, Let there be light: and there was light. 4And God saw the light, that it was good: and God divided the light from the darkness. 5And God called the light Day, and the darkness he called Night. And there was evening and there was morning, one day. 6And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters. 7And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so. 8And God called the firmament Heaven. And there was evening and there was morning, a second day. 9And God said, Let the waters under the heavens be gathered together unto one place, and let the dry land appear: and it was so. 10And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good. 11And God said, Let the earth put forth grass, herbs yielding seed, and fruit-trees bearing fruit after their kind, wherein is the seed thereof, upon the earth: and it was so. 12And the earth brought forth grass, herbs yielding seed after their kind, and trees bearing fruit, wherein is the seed thereof, after their kind: and God saw that it was good. 13And there was evening and there was morning, a third day. 14And God said, Let there be lights in the firmament of heaven to divide the day from the night; and let them be for signs, and for seasons, and for days and years: 15and let them be for lights in the firmament of heaven to give light upon the earth: and it was so. 16And God made the two great lights; the greater light to rule the day, and the lesser light to rule the night: he made the stars also. 17And God set them in the firmament of heaven to give light upon the earth, 18and to rule over the day and over the night, and to divide the light from the darkness: and God saw that it was good. 19And there was evening and there was morning, a fourth day. 20And God said, Let the waters swarm with swarms of living creatures, and let birds fly above the earth in the open firmament of heaven. 21And God created the great sea-monsters, and every living creature that moveth, wherewith the waters swarmed, after their kind, and every winged bird after its kind: and God saw that it was good. 22And God blessed them, saying, Be fruitful, and multiply, and fill the waters in the seas, and let birds multiply on the earth. 23And there was evening and there was morning, a fifth day. 24And God said, Let the earth bring forth living creatures after their kind, cattle, and creeping things, and beasts of the earth after their kind: and it was so. 25And God made the beasts of the earth after their kind, and the cattle after their kind, and everything that creepeth upon the ground after its kind: and God saw that it was good. 26And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the birds of the heavens, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth. 27And God created man in his own image, in the image of God created he him; male and female created he them. 28And God blessed them: and God said unto them, Be fruitful, and multiply, and replenish the earth, and subdue it; and have dominion over the fish of the sea, and over the birds of the heavens, and over every living thing that moveth upon the earth. 29And God said, Behold, I have given you every herb yielding seed, which is upon the face of all the earth, and every tree, in which is the fruit of a tree yielding seed; to you it shall be for food: 30and to every beast of the earth, and to every bird of the heavens, and to everything that creepeth upon the earth, wherein there is life, I have given every green herb for food: and it was so. 31And God saw everything that he had made, and, behold, it was very good. And there was evening and there was morning, the sixth day.',
);

const squirrelBook = MATTIE.itemAPI.quickBook(
	'Book Of The Grove',
	'<WordWrap> The inspired word..... Chapter IV, Verse I: "thou shalt not staple squirrels."',
	'book',
	// eslint-disable-next-line max-len
	`
BOOK OF THE GROVE
\n\n
Chapter IV Verse I\n
Sayeth The Goat of the Wood, "thou shalt not staple squirrels."\n
\n\n
Chapter IV, Verse II\n
For the bushy tail is righteous in the All-Mother's sight, and the chattering voice divine.  Should that which is divine be adhered to that which is not divine?  By no means!\n
\n\n
Chapter IV, Verse III\n
Rather, like the righteous squirrel, the wise man stores his nuts for the proper time, but the faithless man has no nuts to store.\n
\n\n
Chapter IV, Verse IV\n
In this way the squirrel is good, and the lobster is bad.  Wherefore squirrels may die so that squirrels may live, just as lobsters live so that lobsters may die.\n
\n\n
Chapter IV, Verse V\n
And I say unto you... in those final days the groves will bend in agonized worship, and the nutless man will be judged with his own industrial penetration and godless adhesion.  So the stapler will become the stapled.\n
	`,
);

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
	`Face of against this girl -> ʕ•ᴥ•ʔ She is a bear, and she has many traps. Feed her honey to lessen her wrath. If not fed honey she will start to become more aggressive.
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
	MATTIE.msgAPI.footerMsg('╭∩╮t╭∩╮');
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

MATTIE.TaF.setHoney = function (x) {
	this.honey = x;
	this.honeyBar.setHoney(x);
};

/**
 * @description the tick for silly mode difficulty
 */
MATTIE.TaF.sillyTick = function () {
	const that = this;
	if (!this.sillyTickFirst) {
		this.subtick1 = 0;
		this.subtick2 = 0;
		this.honeyAdditor = 0;
		this.honeyScaler = 1;
		this.honey = 80;
		const orgCreate = Scene_Map.prototype.createAllWindows;
		Scene_Map.prototype.createAllWindows = function () {
			orgCreate.call(this);
			const honeyBar = new Window_Honey(10, that.honey, ((bar) => {
				that.honey = bar.currentHoney();
				that.honeyScaler = MATTIE.util.clamp(bar.currentHoney() / bar.maxHoney(), 0.1, 1);
				that.honeyAdditor = Math.ceil(MATTIE.util.lerp(5, 0, that.honeyScaler));
			}));
			that.honeyBar = honeyBar;
			this.addWindow(honeyBar);
		};

		const prev117 = Game_Interpreter.prototype.command117;
		Game_Interpreter.prototype.command117 = function () {
			if (this._params[0] === MATTIE.static.commonEvents.randomFood && MATTIE.util.randChance(0.05)) {
				MATTIE.TaF.items.honey.gainThisItem();
			} else {
				var commonEvent = $dataCommonEvents[this._params[0]];
				if (commonEvent) {
					var eventId = this.isOnCurrentMap() ? this._eventId : 0;
					this.setupChild(commonEvent.list, eventId);
				}
			}

			return true;
		};

		this.sillyTickFirst = true;
		const prev = Game_Troop.prototype.setup;
		this.undoSillyOverrides = () => {
			Game_Troop.prototype.setup = prev;
			Game_Interpreter.prototype.command117 = prev117;
		};
		let calledRecently = false;
		Game_Troop.prototype.setup = function (troopId, xOffset = 0, yOffset = 0, cb = () => {}) {
			MATTIE.troopAPI.config.shouldSort = false;
			if (!calledRecently) {
				setTimeout(() => {
					const rand = Math.random();
					if (rand < 0.25) {
						MATTIE.msgAPI.footerMsg('Get Gnomed idot.', true);
						new MATTIE.troopAPI.RuntimeTroop(15, 0, 0).spawn();
					} else if (rand < 0.5) {
						MATTIE.msgAPI.footerMsg('AHHHhhhh  Spiders! (scary)', true);
						new MATTIE.troopAPI.RuntimeTroop(142, -150, 0).spawn();
						new MATTIE.troopAPI.RuntimeTroop(142, 150, 0).spawn();
						new MATTIE.troopAPI.RuntimeTroop(142, -50, 0).spawn();
					} else if (rand < 0.75) {
						MATTIE.msgAPI.footerMsg('whoops how did those get here?', true);
						new MATTIE.troopAPI.RuntimeTroop(212, 0, 0).spawn();
					} else if (rand < 0.80) {
						MATTIE.msgAPI.footerMsg('I brought you some dogs.', true);
						new MATTIE.troopAPI.RuntimeTroop(199, 0, 0).spawn();
					} else if (rand < 0.81) {
						MATTIE.msgAPI.footerMsg('Give me honey. NOW!!!', true);
						new MATTIE.troopAPI.RuntimeTroop(159, 0, 0).spawn();
					}
				}, 1000);
				calledRecently = true;
				setTimeout(() => {
					calledRecently = false;
				}, 10000);
			}

			prev.call(this, troopId, xOffset, yOffset, cb);
		};
	}

	this.subtick1++;
	this.subtick2++;
	MATTIE.msgAPI.footerMsg('╭∩╮ʕ•ᴥ•ʔ╭∩╮');
	if (!$gameParty.inBattle() && SceneManager._scene instanceof Scene_Map && !MATTIE.static.maps.onMenuMap()) { // overworld trolls
		if ((this.subtick1 > Math.ceil(200 * this.honeyScaler)) || this.minorTroll) { // once per 40 sec
			this.subtick1 = 0;
			this.minorTroll = false;
			const rand = Math.random();
			// 10 options
			if (rand < 0.1) {
				$gameSystem.redMode = true;
				MATTIE.msgAPI.footerMsg('Be very scared of red mode if your honey is low.', true);
				MATTIE.msgAPI.displayMsg('RED MODE');
				for (let index = 0; index < 1 + this.honeyAdditor; index++) {
					setTimeout(() => {
						this.minorTroll = true;
						MATTIE.TaF.sillyTick();
					}, 10000 + index * 1000);
				}

				setTimeout(() => {
					this.minorTroll = true;
					MATTIE.TaF.sillyTick();
					$gameSystem.redMode = false;
				}, 30000);
				MATTIE.fxAPI.setupTint(255, 0, 0, 0, 500);
			} else if (rand < 0.2) {
				$gameSystem.greenMode = true;
				MATTIE.msgAPI.footerMsg('Enemies are faster during green mode', true);
				MATTIE.msgAPI.displayMsg('GREEN MODE');
				$gameMap.events().forEach((event) => {
					if (!this.lastMoveSpeed) { this.lastMoveSpeed = event.realMoveSpeed; }
					event.realMoveSpeed = () => 5 + this.honeyAdditor;
				});
				setTimeout(() => {
					$gameSystem.greenMode = false;
					$gameMap.events().forEach((event) => {
						if (typeof this.lastMoveSpeed === 'function') { event.realMoveSpeed = this.lastMoveSpeed; }
						this.lastMoveSpeed = undefined;
					});
				}, 30000);
				MATTIE.fxAPI.setupTint(0, 255, 0, 0, 500);
			} else if (rand < 0.3) {
				$gameSystem.blueMode = true;
				MATTIE.msgAPI.footerMsg('Your followers hate blue mode', true);
				MATTIE.msgAPI.displayMsg('BLUE MODE');
				MATTIE.miscAPI.invertFollowerDirections(30000);
				setTimeout(() => {
					$gameSystem.blueMode = false;
				}, 30000);
				MATTIE.fxAPI.setupTint(0, 0, 255, 0, 500);
			} else if (rand < 0.4) {
				MATTIE.msgAPI.displayMsg('woohooohoohoooooohoohohooo');
				MATTIE.fxAPI.startScreenShake(100, 1, 100);
			} else if (rand < 0.5) {
				MATTIE.msgAPI.footerMsg('BOO! (bet I scared you)', true);
				MATTIE.miscAPI.invertFollowerDirections(3000);
				MATTIE.miscAPI.spawnBearTrapsAround($gamePlayer, 2 + this.honeyAdditor, 4 + this.honeyAdditor);
				MATTIE.fxAPI.startScreenShake(1, 100, 100);
			} else if (rand < 0.6) {
				MATTIE.msgAPI.displayMsg('I drew you a doggie.');
				MATTIE.fxAPI.showImage('doggie' + `${MATTIE.util.randBetween(1, 2)}`, 10, 0, 0);
				setTimeout(() => {
					const int = setInterval(() => {
						if (SceneManager._scene instanceof Scene_Map) {
							MATTIE.fxAPI.deleteImage(10);
							clearInterval(int);
						}
					}, 500);
				}, 25000);
			} else if (rand < 0.7) {
				if (!this.green && !this.purple && MATTIE.util.randChance(0.5)) {
					this.purple = true;
					MATTIE.msgAPI.footerMsg('Fuck you, purple torches FOREVER', true);
					MATTIE.fxAPI.addLightObject(() => $gamePlayer, () => MATTIE.util.hasTorchActive(), 50, 250, '#f20aa9', 'black');
				} else if (!this.green && !this.purple) {
					this.green = true;
					MATTIE.msgAPI.footerMsg('Fuck you, green torch time', true);
					MATTIE.fxAPI.addLightObject(() => $gamePlayer, () => MATTIE.util.hasTorchActive(), 50, 250, '#2fff00', 'black');
				}
			} else if (rand < 0.8) {
				for (let index = 0; index < MATTIE.util.randBetween(2 + this.honeyAdditor, 15 + this.honeyAdditor); index++) {
					MATTIE.msgAPI.displayMsg('Hah, I hope you like closing messages');
				}
			} else if (rand < 0.9) {
				if (MATTIE.util.randChance(0.5 - this.honeyAdditor / 10)) {
					const anims = [140, 7, 8, 12, 23, 33, 34, 44, 71, 124, 136, 136, 153, 157, 176, 181, 184, 190, 210];
					$gamePlayer.requestAnimation(anims[MATTIE.util.randBetween(0, anims.length - 1)]);
					MATTIE.msgAPI.footerMsg('A spooky ghost attacks you with magic.', true);
				} else {
					const members = $gameParty.members();
					const index = MATTIE.util.randBetween(0, members.length - 1);
					const actor = members[index];
					const follower = $gamePlayer.follower(index - 1);
					if (follower) {
						follower.requestAnimation(298);
					} else {
						$gamePlayer.requestAnimation(298);
					}
					actor.setHp(MATTIE.util.clamp(actor.hp - (actor.hp / 2), 1, actor.mmp));
					MATTIE.msgAPI.footerMsg(`Ahh shit I dropped a rock on ${actor.name()}, better heal them.`, true);
				}
			} else {
				MATTIE.msgAPI.displayMsg('I flipped your controls');
				MATTIE.fxAPI.startScreenShake(100, 1, 100 + this.honeyAdditor * 10);
				MATTIE.miscAPI.flipControls();
				setTimeout(() => {
					setTimeout(() => {
						MATTIE.msgAPI.displayMsg('Okay fine ill flip them back');
						MATTIE.miscAPI.flipControls();
					}, 10000);

					MATTIE.fxAPI.startScreenShake(100, 1, 100 + this.honeyAdditor * 10);
				}, 2500 + this.honeyAdditor * 1000);
			}
		}

		if (this.subtick2 > Math.ceil(500 * this.honeyScaler)) { // once per 100 sec
			this.subtick2 = 0;
			const rand = Math.random();
			if (rand < 0.1) {
				MATTIE.msgAPI.footerMsg('I heard there are bears here. Lemme help you', true);
				setTimeout(() => {
					MATTIE.miscAPI.spawnBearTrapsAround($gamePlayer, 8 + this.honeyAdditor, 14 + this.honeyAdditor);
				}, 15000);
			} else if (rand < 0.2) {
				MATTIE.msgAPI.footerMsg('I heard you needed some nails', true);
				setTimeout(() => {
					MATTIE.miscAPI.spawnRustyNailsAround($gamePlayer, 2 + this.honeyAdditor, 5 + this.honeyAdditor);
				}, 500);
			} else if (rand < 0.3) {
				MATTIE.miscAPI.tripAndFall(5 + this.honeyAdditor * 2);
			} else if (rand < 0.4) {
				MATTIE.miscAPI.tripAndFall(1 + this.honeyAdditor);
			} else if (rand < 0.5) {
				MATTIE.msgAPI.displayMsg('I think you need to slow down and smell the roses. <3', 1, 1);
				const lastSpeed = $gamePlayer.realMoveSpeed;
				$gamePlayer.realMoveSpeed = () => 1;
				setTimeout(() => {
					$gamePlayer.realMoveSpeed = lastSpeed;
				}, MATTIE.util.randBetween(5000 + this.honeyAdditor * 1000, 15000 + this.honeyAdditor * 1000));
			} else if (rand < 0.6) {
				MATTIE.msgAPI.footerMsg('Hey girly.....', true);
				MATTIE.msgAPI.footerMsg('Im going to spawn bear traps around you soon.');
				setTimeout(() => {
					MATTIE.miscAPI.spawnBearTrapsAround($gamePlayer, 1, MATTIE.util.randBetween(7 + this.honeyAdditor, 20 + this.honeyAdditor * 2));
				}, MATTIE.util.randBetween(5000, 25000));
			} else if (rand < 0.7) {
				MATTIE.msgAPI.footerMsg('I fucked up your god affinity', true);
				const vars = MATTIE.static.variable.godAffinityAndPrayerVars;
				vars.forEach((v) => {
					const value = MATTIE.util.clamp(($gameVariables.value(v) - MATTIE.util.randBetween(0, 1 + this.honeyAdditor)), 0, 4);
					$gameVariables.setValue(v, value);
				});
			} else if (rand < 0.8) {
				MATTIE.msgAPI.displayMsg('Okay I took all your food and gifted it to a puppy.\n\n\n');
				MATTIE.miscAPI.stealAllFood();
				MATTIE.msgAPI.displayMsg('The puppy joins your party');
				$gameParty.addActor(MATTIE.static.actors.moonlessId);
				$gameActors.actor(MATTIE.static.actors.moonlessId).name = () => 'puppy';
			} else if (rand < 0.9) {
				MATTIE.msgAPI.showChoices(
					['she fear on my hung till I unger', 'she ung on my fear till i fun', '/kill @e[type=entity]', 'I want a gift'],
					0,
					1,
					(n) => {
						switch (n) {
						case 0:
							MATTIE.fxAPI.showImage('endingsS_mercenary', 10, 0, 0);
							MATTIE.msgAPI.displayMsg('YOU WIN: S ENDING MERC\'IE');
							setTimeout(() => {
								MATTIE.msgAPI.displayMsg('JK idot');
								MATTIE.fxAPI.deleteImage(10);
							}, 5000);
							break;
						case 1:
							MATTIE.msgAPI.displayMsg('S ENDING: dark\'e');
							MATTIE.fxAPI.showImage('endingsS_knight', 10, 0, 0);
							setTimeout(() => {
								MATTIE.msgAPI.displayMsg('JK idot');
								MATTIE.fxAPI.deleteImage(10);
							}, 5000);
							break;
						case 2:
							setTimeout(() => {
								MATTIE.msgAPI.displayMsg('okay I mean you asked for it');
							}, 500);

							if ($gameParty.aliveMembers().length > 1) { $gameParty.removeActor($gameParty.leader().actorId()); }
							break;
						case 3:
							SceneManager.goto(Scene_Map);
							setTimeout(() => {
								MATTIE.msgAPI.displayMsg('Okay I took all your food and gifted it to a puppy.');
								MATTIE.miscAPI.stealAllFood();
							}, 500);

							break;
						}
					},
				);
			} else {
				MATTIE.msgAPI.displayMsg('╭∩╮ʕ•ᴥ•ʔ╭∩╮');
				if (MATTIE.util.randChance(0.5)) {
					MATTIE.miscAPI.tripAndFall(9 + this.honeyAdditor * 3);
				} else {
					MATTIE.miscAPI.spawnBearTrapsAround($gamePlayer, 1, 3 + this.honeyAdditor * 4);
				}
			}
		}

		if (this.tick % 720 == 0) { // once per 2.3 min

		}

		if (this.tick % 1732 == 0) { // once per 6 min
			MATTIE.msgAPI.showChoices(
				['Heal all', 'Restore all limbs', 'go directly to hell', 'restore all mana', 'nah im good', 'nah im good ty <3'],
				0,
				0,
				(n) => {
					switch (n) {
					case 0:
						MATTIE.msgAPI.displayMsg('Sure thing shawty <3');
						$gameParty.members().forEach((actor) => {
							actor.recoverAll();
						});
						MATTIE.miscAPI.spawnGhoulsAround($gamePlayer, 4, 8);
						break;
					case 1:
						setTimeout(() => {
							MATTIE.msgAPI.showChoices(['Yes', 'No'], 0, 0, (p) => {
								if (p == 0) {
									$gameParty.members().forEach((actor) => {
										actor.recoverAll();
									});

									MATTIE.static.switch.characterLimbs.forEach((s) => {
										$gameSwitches.setValue(s, 0);
									});

									setTimeout(() => {
										for (let index = 0; index < 10; index++) {
											MATTIE.miscAPI.loseRandomItem();
										}

										MATTIE.miscAPI.tripAndFall(100);
										setTimeout(() => {
											MATTIE.miscAPI.spawnGhoulsAround($gamePlayer, 4, 8);
										}, 5000);
									}, 5000);
								}
							}, 'Okay, but it will cost you.\n You will be cursed with misfortune for the next 10 sec.');
						}, 500);

						break;
					case 2:
						setTimeout(() => {
							MATTIE.msgAPI.showChoices(
								['Judeo-Christian', 'Mormon', 'Gnostic', 'Buddist', 'Hindu', 'Taoist', 'Catholic Fan Fictions'],
								0,
								0,
								(m) => {
									switch (m) {
									case 0:
									case 1:
									case 2:
									case 3:
									case 4:
									case 5:
										setTimeout(() => {
											MATTIE.msgAPI.displayMsg('I see you chose the correct choice\nYou find a "Book Of the Grove"');
											$gameParty.gainItem(squirrelBook._data, 1);
										}, 500);

										break;
									case 6:
										setTimeout(() => {
											MATTIE.msgAPI.showChoices(
												['Virgil', 'Dante', 'Cs Lewis', 'Tolkien'],
												0,
												0,
												(o) => {
													setTimeout(() => {
														MATTIE.msgAPI.displayMsg('Im done writing this bit.\nYou find a "Holy Bible"');
														$gameParty.gainItem(bible._data, 1);
													}, 500);
												},
												'Okay but a lot of ppl wrote catholic fan fiction.',
											);
										}, 500);

										break;
									}
								},
								'Okay but which one?',

							);
						}, 500);

						MATTIE.miscAPI.spawnBearTrapsAround($gamePlayer, 16, 124);
						break;

					case 3:
						MATTIE.msgAPI.displayMsg('Done :)');
						$gameParty.members().forEach((actor) => {
							actor.setMp(actor.mmp);
						});
						break;
					case 4:
						MATTIE.msgAPI.displayMsg('RUDE!!!!!!');
						$gameParty.members().forEach((actor) => {
							actor.setMp(5);
						});
						MATTIE.miscAPI.spawnBearTrapsAround($gamePlayer, 1, 24);
						MATTIE.miscAPI.spawnRustyNailsAround($gamePlayer, 1, 24);
						MATTIE.msgAPI.footerMsg('You did not say thanks!!!!!! No mind for you go insane loser.', true);
						break;
					case 5:
						MATTIE.msgAPI.displayMsg('Okay cya ltr <3');
						$gameParty.members().forEach((actor) => {
							actor.recoverAll();
						});
						break;
					}
				},
			);
		}
	}

	if (!$gameParty.inBattle() && SceneManager._scene instanceof Scene_Map && false) { // overworld trolls
		if (this.tick & 1100 == 0) {
			if (MATTIE.util.randChance(0.2)) {
				MATTIE.miscAPI.spawnBearTrapsAround($gamePlayer, 8, 14);
			} else if (MATTIE.util.randChance(0.6)) {
				MATTIE.miscAPI.spawnRustyNailsAround($gamePlayer, 15, 26);
			} else {
				MATTIE.miscAPI.spawnGhoulsAround($gamePlayer, 2, 4);
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
				MATTIE.miscAPI.spawnBearTrapsAround($gamePlayer, 2, 4);
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
	MATTIE.TaF.addedHoneyBar = false;
	MATTIE.TaF.sillyTickFirst = false;
	if (MATTIE.TaF.undoSillyOverrides) { MATTIE.TaF.undoSillyOverrides(); }
};
