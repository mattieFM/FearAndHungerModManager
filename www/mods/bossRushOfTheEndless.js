var MATTIE = MATTIE || {};
MATTIE.bossRush =  MATTIE.bossRush || {};


(()=>{
    let fileName = "IconSet";
    let bossRushName = 'bossRushOfTheEndless'
    const params = PluginManager.parameters(bossRushName);

    
    MATTIE.bossRush.onLoad = function(){
        if(!MATTIE.DataManager.global.get("bossRushInstalled")){
        
            MATTIE.DataManager.addFileToImgFolder("/img/system/","/system/",fileName,"_"+fileName)
            MATTIE.DataManager.addFileToImgFolder("/mods/_bossRushOfTheEndless/images/","/pictures/","endingBook.png")
            MATTIE.DataManager.addFileToImgFolder("/mods/_bossRushOfTheEndless/images/","/pictures/","endingF.png")
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
        [MATTIE.static.troops.torturerId, MATTIE.static.troops.moonlessGaurdId],
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
        if(!$gameParty.leader().isDead() && !(SceneManager._scene instanceof Scene_Gameover)){
            startNextFight(()=>{
                $gameMessage.clear();
                SceneManager.goto(Scene_Map);
                $gameMessage.clear();
                setTimeout(() => {
                    MATTIE.msgAPI.showChoices(["Continue Reading"],0,0,()=>{
                        rush();  
                    },getPageDescription(MATTIE.bossRush.currentFightIndex))
            }, 1000)});
        } 
    }



    function startNextFight(cb = ()=>{}){
        if(MATTIE.bossRush.currentFightIndex < MATTIE.bossRush.fights.length){
            startFight(MATTIE.bossRush.currentFightIndex, cb);
            MATTIE.bossRush.currentFightIndex++;
        } else {
            win()
        }
        
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
                   BattleManager.setEventCallback(function(n) {
                    cb();
                    }.bind(this));
                }, 500);
                
                

        }, 3000);
        
        
    }

    function falseGodEnding(){
        $gameSystem.disableMenu();
                        MATTIE.fxAPI.deleteImage(1);
                        MATTIE.fxAPI.showImage("ending",1,0,0);
                        setTimeout(() => {
                            MATTIE.msgAPI.displayMsg("You defeated Le'garde, the prophesied one with delusions",1,1);
                            MATTIE.msgAPI.displayMsg("of creating a new era with his godhood.\n\n",1,1);
                            MATTIE.msgAPI.displayMsg("You faced down the new gods.\n\n\n",1,1);
                            MATTIE.msgAPI.displayMsg("You glimpsed the birth of a new god, and survived...\n\n\n",1,1);
                            MATTIE.msgAPI.displayMsg("You witnessed the traces of multiple old gods",1,1);
                            MATTIE.msgAPI.displayMsg("and fought against them vigorously.\n\n",1,1);
                            MATTIE.msgAPI.displayMsg("After your victory and escape from the dungeons,",1,1);
                            MATTIE.msgAPI.displayMsg("you can't help but wonder what was on the next page of",1,1);
                            MATTIE.msgAPI.displayMsg("that book. Somehow without knowing what is on it, your",1,1);
                            MATTIE.msgAPI.displayMsg("quest to rid this world of evil feels incomplete.",1,1);
                            MATTIE.msgAPI.displayMsg("You spend the rest of your days hunting down all the macabre",1,1);
                            MATTIE.msgAPI.displayMsg("beasts that hide in the shadows.\n\n",1,1); 
                            MATTIE.msgAPI.displayMsg("The beasts would come to know your name.\n\n\n",1,1); 
                            MATTIE.msgAPI.displayMsg("The gods would come to forget it.\n\n\n",1,1); 
                            let int = setInterval(() => {
                                if(!$gameMessage.isBusy()){
                                    clearInterval(int);
                                    MATTIE.fxAPI.showImage("endingF",2,0,0);
                                    setTimeout(() => {
                                        $gameSystem.enableMenu();
                                        MATTIE.msgAPI.showChoices(["View Credits","Return to main menu"],0,0,(n)=>{
                                            switch (n) {
                                                case value:
                                                    $gameTemp.reserveCommonEvent(MATTIE.static.commonEvents.credits.id);
                                                    break;
                                            
                                                default:
                                                    SceneManager.goto(Scene_Gameover);
                                                    break;
                                            }
                                        })
                                        
                                       
                                    }, 5000);
                                }
                                
                            }, 100);
                        }, 500);
    }

    function onUseVictoryBook(){
        SceneManager.goto(Scene_Map);
        setTimeout(() => {
            MATTIE.fxAPI.showImage("endingBook",1,0,0);
            MATTIE.msgAPI.displayMsg("The book reads as follows:\n\n\n",1,1);
            MATTIE.msgAPI.displayMsg("You never escaped the dungeons...",1,1);
            MATTIE.msgAPI.displayMsg("Your efforts would go unsung, but your part in the greater",1,1);
            MATTIE.msgAPI.displayMsg("scheme of things was vital nevertheless",1,1);
            MATTIE.msgAPI.displayMsg("You had a vital part in the birth of a new god.",1,1);
            MATTIE.msgAPI.displayMsg("One that is not a mere new god but ont that rivals the",1,1);
            MATTIE.msgAPI.displayMsg("older ones.\n\n",1,1);
            MATTIE.msgAPI.displayMsg("The farther you read... the more the text becomes distorted",1,1);
            MATTIE.msgAPI.displayMsg("and warped.",1,1);
            MATTIE.msgAPI.showChoices(["Continue Reading","Accept your Victory"],1,0,(n)=>{
                switch (n) {
                    case 0: //continue reading
                        setTimeout(() => {
                            
                            MATTIE.msgAPI.displayMsg("A new page weaves itself out of spider thread as\nyou turn the page.\n\n",1,1);
                            MATTIE.msgAPI.displayMsg(MATTIE.msgAPI.formatMsgAndTitle("Mother of Puppets","All that... And yet you still crave more?\n\n"),1,1);
                            MATTIE.msgAPI.displayMsg(MATTIE.msgAPI.formatMsgAndTitle("Mother of Puppets","Well then... I invite you into my web, shall we meet soon.\n\n"),1,1);
                            MATTIE.msgAPI.displayMsg("this ending is not done yet :) sending you to the other ending",1,1);
                            let int = setInterval(() => {
                                if(!$gameMessage.isBusy()){
                                    clearInterval(int);
                                    MATTIE.fxAPI.deleteImage(1);
                                    falseGodEnding();
                                }
                                
                            }, 100);
                        }, 1000);
                        
                        break;
                    case 1: //accept your victory
                        falseGodEnding();
                        
                        
                    break;
                
                    default:
                        break;
                }
                
            })
        }, 500);
        
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
    
    function win(){
        SceneManager.goto(Scene_Map)
        setTimeout(() => {
            $gameParty.loseItem(bookOfPrimalFears._data,1,false);;
            MATTIE.fxAPI.startScreenShake(5,5,150)
            MATTIE.fxAPI.setupTint(155,255,155, 0, 150);
            MATTIE.msgAPI.displayMsg("The book's ink comes alive once more, weaving a new book.")
            
            $gameParty.gainItem(rewardBook._data,1,false)
        }, 1500);
        
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
    protoBookOfFears.addRecipeUnlock(11);
    protoBookOfFears.addRecipeUnlock(87);
    protoBookOfFears.setIconIndex(13);
    protoBookOfFears.setName("Book of Primal Fears");
    protoBookOfFears.setDescription("A book containing 12 pages, each describing a primal fear. The \nbook bears the mark of Gol Goroth, and carries an unnatural weight")
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



    let rewardBook = new MATTIE.items.runTimeItem();
    rewardBook.setIconIndex(14);
    rewardBook.setName("Book of Futility");
    rewardBook.setDescription("A very old book, its cover displays a very faded\nsymbol of goroth, it contains one page.")
    rewardBook.setItemType(2); //set book
    rewardBook.setCallback(onUseVictoryBook);    
    rewardBook.spawn();

    let  = new MATTIE.items.runTimeItem();



})()