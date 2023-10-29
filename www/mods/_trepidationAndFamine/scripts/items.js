/** @namespace MATTIE.TaF.items the namespace containing all items added by these difficulties  */

MATTIE.TaF.items = {};

MATTIE.TaF.items.honey = new MATTIE.itemAPI.RunTimeItem();
MATTIE.TaF.items.honey.setName('Honey');
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
