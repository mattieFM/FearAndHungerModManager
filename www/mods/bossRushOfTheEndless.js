var MATTIE = MATTIE || {};
MATTIE.bossRush =  MATTIE.bossRush || {};


(()=>{
    /** @description an array of the ids of fights */
    MATTIE.bossRush.fights = [
        [MATTIE.static.troops.salmonSnakeId, MATTIE.static.troops.blackWitchId],
        [MATTIE.static.troops.caveMotherId, MATTIE.static.troops.harvestManId, MATTIE.static.troops.bodySnatcherId],
        [MATTIE.static.troops.redManId, MATTIE.static.troops.greaterBlightId, MATTIE.static.troops.blightId, MATTIE.static.troops.moldedId],
        [MATTIE.static.troops.torturerId, MATTIE.static.troops.moonlessGaurdId,MATTIE.static.troops.bodySnatcherId],
        [MATTIE.static.troops.isayahId, MATTIE.static.troops.ironShakespeareId]
        [MATTIE.static.troops.knightSpectorId, MATTIE.static.troops.gauntKnightId,MATTIE.static.troops.oldKnightId],
        [MATTIE.static.troops.crowMaulerId, MATTIE.static.troops.doubleHeadedCrowId],
        [MATTIE.static.troops.namelessId,MATTIE.static.troops.oldGuardianId, MATTIE.static.troops.lizardMageId],
        [MATTIE.static.troops.skinGrannyId, MATTIE.static.troops.fancoisId, MATTIE.static.troops.chambaraId, MATTIE.static.troops.valteilId]
        [MATTIE.static.troops.gorothId, MATTIE.static.troops.sylvianId, MATTIE.static.troops.griffithId, MATTIE.static.troops.GOFAHID]
    ]

    function startFight(x){
        let roundIds = MATTIE.bossRush.fights[x];
        let first = roundIds[0];
        BattleManager.setup(first, false, true);
        BattleManager.setEventCallback(function(n) {
            alert("fight ended")
        }.bind(this));
        $gamePlayer.makeEncounterCount();
        SceneManager.push(Scene_Battle);

        let int = setInterval(() => {
            if(SceneManager._scene instanceof Scene_Battle){
                clearInterval(int);
                for (let index = 1; index < roundIds.length; index++) {
                    const additionalId = roundIds[index];
                    let additionalTroop = new MATTIE.troopAPI.runtimeTroop(additionalId);
                    switch (additionalId) {
                        case MATTIE.static.troops.skinGrannyId:
                            //skin granny needs this to be false for her to transform
                            additionalTroop.setSwitchValue(1807,false)
                            break;
                    
                        default:
                            break;
                    }
        
                    additionalTroop.spawn();
                }  
            }
        }, 50);
        
    }
    



    let bossRushName = 'bossRushOfTheEndless'
    const params = PluginManager.parameters(bossRushName);

    let item = new MATTIE.items.runTimeItem();
    item.addRecipe([11,87,98],98);
    item.setIconIndex(MATTIE.static.items.icons.bookIcon);
    item.setName("Book of Primal Fear");
    item.setDescription("The most primal fear --that which predates every other, that which must never be spoken lest its answer be known.")
    item.setCallback(()=>{
        alert("you used the book");
        startFight(1);
    })
    item.setCraftingCallback(()=>{
        alert("you crafted the book")
    })
    item.spawn();

})()