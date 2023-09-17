var MATTIE = MATTIE || {};
MATTIE.bossRush =  MATTIE.bossRush || {};


(()=>{
    let fileName = "IconSet";
    let bossRushName = 'bossRushOfTheEndless'
    const params = PluginManager.parameters(bossRushName);

    
    MATTIE.bossRush.onLoad = function(){
        if(!MATTIE.DataManager.global.get("bossRushInstalled")){
        
            MATTIE.DataManager.addFileToImgFolder("/img/system/","/system/",fileName,"_"+fileName)
            MATTIE.DataManager.addFileToImgFolder("/mods/_bossRushOfTheEndless/images/","/system/",fileName)
            MATTIE.DataManager.global.set("bossRushInstalled", true)
            alert("boss rush mod installed --game will need to be reloaded");
            MATTIE_ModManager.modManager.reloadGame();
            
        }
    }
    

    MATTIE.bossRush.offload = function(){
        MATTIE.DataManager.global.set("bossRushInstalled", false);
        MATTIE.DataManager.addFileToImgFolder("/img/system/","/system/","_"+fileName,fileName)
        alert ("boss rush mod uninstalled")
    }

    MATTIE_ModManager.modManager.addOffloadScriptToMod(bossRushName,MATTIE.bossRush.offload);
    MATTIE_ModManager.modManager.addOnloadScriptToMod(bossRushName,MATTIE.bossRush.onLoad);
    MATTIE.bossRush.onLoad();
    

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

    MATTIE.bossRush.currentFightIndex = 0;

    /** @description the method to handle the boss rush functionality */
    function rush(){
        if(MATTIE.bossRush.currentFightIndex < MATTIE.bossRush.fights.length && !$gameParty.leader().isDead() && !(SceneManager._scene instanceof Scene_Gameover)){
            startNextFight(()=>{
                SceneManager.goto(Scene_Map);
                setTimeout(() => {
                    MATTIE.msgAPI.showChoices(["Continue Reading"],0,0,()=>{
                        rush();  
                    },getPageDescription(MATTIE.bossRush.currentFightIndex),[getPageDescription(MATTIE.bossRush.currentFightIndex)])
            }, 1000)});
        }
        
    }


    function startNextFight(cb = ()=>{}){
        startFight(MATTIE.bossRush.currentFightIndex,cb);
        MATTIE.bossRush.currentFightIndex++;
    }
    

    /**
     * @description start a fight at x index in the arr and call a callback when fight ends
     * @param {*} x the index of the fight to start
     * @param {*} cb the callback to call when the fight ends
     */
    function startFight(x,cb=()=>{}){
        BattleManager.setCantStartInputting(true);

        if($gameParty.leader().hasSkill(MATTIE.static.skills.enGarde.id)){
            $gameSwitches.setValue(MATTIE.static.switch.backstab,true);
        }
        let roundIds = MATTIE.bossRush.fights[x];
        let first = 142
        BattleManager.setup(first, false, true);
        BattleManager.setEventCallback(function(n) {
            cb();
        }.bind(this));
        $gamePlayer.makeEncounterCount();
        SceneManager.push(Scene_Battle);

        setTimeout(() => {
            /** @type {Game_Enemy} */
            let spider = $gameTroop.baseMembers()[0]


            spider.performDamage();
            spider.die();
            
            spider.hide();
            if($gameParty.leader().hasSkill(MATTIE.static.skills.enGarde.id)){
                $gameSwitches.setValue(MATTIE.static.switch.backstab,true);
            }
                for (let index = 0; index < roundIds.length; index++) {
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
                setTimeout(() => {
                   BattleManager.setCantStartInputting(false);
                }, 500);
                
                

        }, 3000);
        
        
    }


    function onCraftProtoBook (){
        MATTIE.bossRush.currentFightIndex = 0;
        SceneManager.goto(Scene_Map);
        setTimeout(() => {
            $gameParty.loseItem(protoBookOfFears._data,1,false);;
            
            MATTIE.fxAPI.startScreenShake(5,5,150)
            MATTIE.fxAPI.setupTint(155,155,155, 0, 150);
            MATTIE.msgAPI.displayMsg("The book begins to distort as the ink touches its page.")
            MATTIE.msgAPI.displayMsg("The droplets of ink on the page start to coalesce... The beads")
            MATTIE.msgAPI.displayMsg("of ink morph into darkened, inky spiders and their malformed")
            MATTIE.msgAPI.displayMsg("legs weave a new book from their treads.")
            MATTIE.msgAPI.displayMsg("You just wrote this book, yet not a word of it is your own. \n\n\n\nYou feel a strong compulsion to read the book.\n\n\n")
            MATTIE.msgAPI.displayMsg("The compulsion to read the book is so strong you question if it is \nyour own or rather the will of something far greater than you.")

            $gameParty.gainItem(bookOfPrimalFears._data,1,false)
        }, 500);
    }

    function onUseBook (){
        SceneManager.goto(Scene_Map);
        setTimeout(() => {
            MATTIE.msgAPI.showChoices(["Read a page","Read The Whole Book","Gouge Out Your Eyes"],1,2,(i)=>{
                switch (i) {
                    case 0: //read one page
                        startNextFight();
                        MATTIE.bossRush.currentFightIndex++;
                        break;
                    case 1: //read every page
                        rush();
                    break;
                    default:
                        $gameParty.leader().addState(MATTIE.static.states.blind)
                        MATTIE.msgAPI.footerMsg("You vision fades as you claw out your eyes... It is a dark world now")
                }
            },"",[
                getPageDescription(MATTIE.bossRush.currentFightIndex),
                "It is as though an otherworldly entity wants you \nto read every page, to drink up your fear and feast \nupon it, Give into it's desire?",
                "You cannot look away, you cannot simply avert \nyour gaze, you NEED to read it... or you need\nto be incapable of ever reading it\n"]) 
        }, 500);
    }
    

    function getPageDescription(index){
        let pageDescriptions = [
            
        ]
        let format = (title,msg)=>MATTIE.msgAPI.formatMsgAndTitle(title,msg);
        
        pageDescriptions.push(format("Page Title: The End","Also called Death, Terminus, The Termination of \nAll Life, The Coming End That Waits For All\nAnd Cannot Be Ignored.\n"))
        pageDescriptions.push(format("Page Title: The Eye","Also called Beholding, The Ceaseless Watcher, \nIt Knows You, The Great Eye that watches all who \nlinger in terror and gorges itself on the sufferings"))
        pageDescriptions.push(format("Page Title: The Desolation","Also called The Lightless Flame, \nThe Torturing Flame, The Devastation, \nThe Blackened Earth, The Ravening Burn, Asag."))
        pageDescriptions.push(format("Page Title: The Dark","Also called Mr. Pitch, The Forever Blind.The \nprimal fear of the dark, of what lies beyond that \nwe cannot see, and the creatures hiding from view."))
        pageDescriptions.push(format("Page Title: The Corruption","Also called Filth, The Crawling Rot, Flesh Hive. \nThe fear of corruption, disease, filth. Fear of the \nfeelings of disgust,", ))
        pageDescriptions.push(format("Page Title: The Flesh","Also called Viscera.Born from the fear held by \nanimals bred for meat and in the human \nrealisation that we are just animated meat and bones."))
        pageDescriptions.push(format("Page Title: The Hunt","Also called The Everchase.The animalistic fear \nof being chased or hunted; the primal \nfear of being prey."))
        pageDescriptions.push(format("Page Title: The Lonely","Also called Forsaken, The One Alone.\nThe fear of isolation, of being completely cut off \nand alone or disconnected from the rest of society."))
        pageDescriptions.push(format("Page Title: The Slaughter","The fear of pure, unpredictable, unmotivated \nviolence. The fear of pain coming at sudden, \nrandom moments."))
        pageDescriptions.push(format("Page Title: The Spiral","Also called Es Mentiras (It Is Lies), \nThe Twisting Deceit, It Is Not What It Is.\nThe fear of madness."))
        pageDescriptions.push(format("Page Title: The Stranger","Also called I Do Not Know You.The fear of\nthe unknown, the uncanny, the unfamiliar. \nThe creeping sense that something is wrong"))
        pageDescriptions.push(format("Page Title: The Vast","Also called The Falling Titan."))
        pageDescriptions.push(format("Page Title: The Web","Also called The Spider, The Great Spider, \nMother of Puppets, The Mother, The Spinner \nof Schemes, The Hidden Machination."))
        pageDescriptions.push(format("Page Title: The Buried","Also called the Centre, Choke, Too Close, I Cannot \nBreathe, Forever Deep Below Creation. A fear of \nsmall spaces, suffocating, drowning, being buried.\n"))
        pageDescriptions.push(format("Page Title: The Extinction","Also called The Terrible Change, The Future \nWithout Us, The World Is Always Ending. "))
        return pageDescriptions[index]; 
    }

    let protoBookOfFears = new MATTIE.items.runTimeItem()
    protoBookOfFears.addRecipe([11,87,98],98);
    protoBookOfFears.setIconIndex(13);
    protoBookOfFears.setName("Book of Primal Fears");
    protoBookOfFears.setDescription("A book containing 12 pages, each describing a primal fear. \nThe book bears the mark of Gol Goroth, and has a certain weight to it.")
    protoBookOfFears.setItemType(2); //set book
    protoBookOfFears.setCraftingCallback(onCraftProtoBook);
    protoBookOfFears.spawn();


    let bookOfPrimalFears = new MATTIE.items.runTimeItem();
    bookOfPrimalFears.setIconIndex(12);
    bookOfPrimalFears.setName("The Dread Powers");
    bookOfPrimalFears.setDescription("A book containing 12 pages. \nThe book appears to be woven from spider silk.")
    bookOfPrimalFears.setItemType(2); //set book
    bookOfPrimalFears.setCallback(onUseBook);    
    bookOfPrimalFears.spawn();

    let  = new MATTIE.items.runTimeItem();



})()