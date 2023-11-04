/** @namespace MATTIE.TaF.items the namespace containing all items added by these difficulties  */

MATTIE.TaF.items = {};

MATTIE.TaF.items.honey = new MATTIE.itemAPI.RunTimeItem();
MATTIE.TaF.items.honey.setName('Jar of honey');
MATTIE.TaF.items.honey.setDescription('Preserved Honey, might attract bears.');
MATTIE.TaF.items.honey.setConsumable(true);
MATTIE.TaF.items.honey.setIconIndex(new MATTIE.itemAPI.RuntimeIcon('honey'));
MATTIE.TaF.items.honey.setCallback(() => {
	SceneManager.goto(Scene_Map);
	setTimeout(() => {
		MATTIE.msgAPI.showChoices(['Eat the honey', 'Offer the honey'], 1, 1, (n) => {
			switch (n) {
			case 0:
				$gameTemp.reserveCommonEvent(MATTIE.static.commonEvents.largeFood);
				MATTIE.msgAPI.displayMsg('<WordWrap>As you eat the honey you are overcome by dread, you feel the presence of a terrifying being near by.');
				break;

			case 1:
				if ($gameSystem.sillyMode) {
					MATTIE.TaF.honeyBar.setHoney(MATTIE.TaF.honeyBar.maxHoney());
					MATTIE.TaF.honey = MATTIE.TaF.honeyBar.currentHoney();
					MATTIE.msgAPI.displayMsg('<WordWrap>A great beast appears and consumes your honey.');
					MATTIE.TaF.honeyBar.refresh();
					setTimeout(() => {
						MATTIE.TaF.honeyBar.refresh();
					}, 500);
				} else {
					MATTIE.msgAPI.displayMsg('<WordWrap>You offer up the honey, but no one comes.');
					$gameParty.gainItem(MATTIE.TaF.items.honey._data, 1);
				}
				break;
			}
		});
	}, 500);
});

MATTIE.TaF.items.honey.spawn();
MATTIE.miscAPI.addToDropTable(MATTIE.TaF.items.honey, MATTIE.static.commonEvents.randomFood, 0.05);

MATTIE.TaF.items.effigyOfAlmer = new MATTIE.itemAPI.RunTimeItem();
MATTIE.TaF.items.effigyOfAlmer.setName('Effigy of Allmer');
MATTIE.TaF.items.effigyOfAlmer.setDescription(`<WordWrap>
A lump of flesh sculpted into a human figure bound to a cross.
 Used for various rituals of Allmer and some spells, it reads of decay.
 `);
MATTIE.TaF.items.effigyOfAlmer.setConsumable(true);
MATTIE.TaF.items.effigyOfAlmer.setIconIndex(new MATTIE.itemAPI.RuntimeIcon('allmerTotem'));
MATTIE.TaF.items.effigyOfAlmer.setCallback(() => {
	SceneManager.goto(Scene_Map);
	$gameMessage.disableChoice(0, !$gameParty.leader().hasSkill(MATTIE.static.skills.bloodportal.id));
	setTimeout(() => {
		MATTIE.msgAPI.showChoices(['Spawn Blood Portal', 'Examine', 'Destroy', 'Leave'], 0, 0, (n) => {
			switch (n) {
			case 0:
				MATTIE.TaF.spawnBloodPortal();
				break;
			case 2:
				// eslint-disable-next-line max-len
				MATTIE.msgAPI.displayMsg('<WordWrap> You crush the effigy, the bone crumbles easily enough, and the rotting flesh quickly falls apart, your hands are left coated with a thick grime of fleshy residue.');
				MATTIE.msgAPI.footerMsg('Your affinity with Allmer decreases.');
				$gameVariables.setValue(
					MATTIE.static.variable.allMerAffinity,
					MATTIE.util.clamp(
						$gameVariables.value(MATTIE.static.variable.allMerAffinity) - 1,
						0,
						3,
					),
				);
				break;
			case 1:
				// eslint-disable-next-line max-len
				MATTIE.msgAPI.displayMsg('<WordWrap> You examine the effigy closer. The closer your look the more it becomes clear that the "wood" is bone that has been carved and painted to resemble wood.');
			// fall through to default since this does not use the item
			default:
				MATTIE.TaF.items.effigyOfAlmer.gainThisItem(1, false);
				break;
			}
		}, 'What do you do with the effigy?');
	}, 500);
});
MATTIE.TaF.items.effigyOfAlmer.spawn();
MATTIE.miscAPI.addToDropTable(MATTIE.TaF.items.effigyOfAlmer, MATTIE.static.commonEvents.randomRareItem, 0.05);
