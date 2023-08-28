/*:
* @plugindesc V0
* a test mod for fear and hunger
* @author Mattie
* 
* mods define their 
*/
var MATTIE = MATTIE || {};
MATTIE.saves = MATTIE.saves || {};
MATTIE.saves.suspendedRunId = 9998;



(()=>{
    MATTIE.saves.createCommandWindow = Scene_GameEnd.prototype.createCommandWindow;
    Scene_GameEnd.prototype.createCommandWindow = function() {
        MATTIE.saves.createCommandWindow.call(this);
        this._commandWindow.setHandler('suspend', (()=>{
            MATTIE.saves.suspendRun();
            this.commandToTitle();
        
        }).bind(this));
    };

    MATTIE.saves.makeCommandList = Window_GameEnd.prototype.makeCommandList;
    Window_GameEnd.prototype.makeCommandList = function() {
        MATTIE.saves.makeCommandList.call(this);
        this.addCommand("Save And Quit", 'suspend');
    };

    MATTIE.saves.continueFromSuspendedRun = function (){
        MATTIE.menus.loadGameAndGoTo(MATTIE.saves.suspendedRunId);
        MATTIE.saves.deleteSuspendedRun();
    }
    
    MATTIE.saves.deleteSuspendedRun = function(){
        StorageManager.saveToLocalFile(MATTIE.saves.suspendedRunId, {});
        let globalInfo = DataManager.loadGlobalInfo();
        globalInfo[MATTIE.saves.suspendedRunId] = null;
        DataManager.saveGlobalInfo(globalInfo);
    }
    MATTIE.saves.suspendRun = function (){
        DataManager.saveGame(MATTIE.saves.suspendedRunId,true);
    }
    MATTIE.saves.suspendedRunExists = function (){
        let global = DataManager.loadGlobalInfo();
        console.log(global[MATTIE.saves.suspendedRunId])
        if(global[MATTIE.saves.suspendedRunId]) return true
        return false
    }

    Input.addKeyBind('q', ()=>{
        MATTIE.saves.suspendRun();
    }, "SuspendRun",1)
    

    updateOldSaves(); //update old saves on init
    MATTIE.menus.mainMenu.addBtnToMainMenu("Continue Suspended Run","suspendedRunContinue", MATTIE.saves.continueFromSuspendedRun.bind(this), ()=>MATTIE.saves.suspendedRunExists())

    const params = PluginManager.parameters('betterSaves');
    
    DataManager.maxSavefiles = function() {
        return params.maxSaves;
    };

    function updateOldSaves() {
        MATTIE.saves.savedLatest = DataManager.latestSavefileId(); 
        const globalInfo = DataManager.loadGlobalInfo();
        const maxSaves = DataManager.maxSavefiles();
        for (var index = 1; index < maxSaves; index++) {
            if(globalInfo[index])
            if(!globalInfo[index].name){
                console.info("BETTERSAVES: Migrated save: " + index)
                var saveData = MATTIE.DataManager.loadAndReturnSave(index)
                if(saveData){
                    var diff = MATTIE.GameInfo.getDifficulty(saveData.$gameSwitches);
                    var name = JSON.stringify(saveData.$gameActors._data[saveData.$gameParty._actors[0]]._name);
                    
                    globalInfo[index].difficulty=diff;
                    globalInfo[index].name=name.replace("\"","").replace("\"","");
                }
                
            }
            DataManager.saveGlobalInfo(globalInfo);
            MATTIE.DataManager.loadAndReturnSave(MATTIE.saves.savedLatest);
        } 
    }

    MATTIE.Scene_Save_prototype_init = Scene_Save.prototype.initialize
    Scene_Save.prototype.initialize = function(){
        MATTIE.Scene_Save_prototype_init.call(this);  
    }

    MATTIE.Scene_Load_prototype_init = Scene_Load.prototype.initialize
    Scene_Load.prototype.initialize = function(){
        MATTIE.Scene_Load_prototype_init.call(this);  
    }
    Window_SavefileList.prototype.drawGameTitle = function(info, x, y, width, rect) {
        if (info.difficulty && info.name) {
            this.drawText(info.difficulty, x, y+rect.height-37, width-125, "right");
            this.drawText("-" + info.name, x-110, y, width, "left");
        } else if (info.title){
            this.drawText(info.title + " - legacy save", x, y+rect.height-35, width);
       }
        
    };
    
    Window_SavefileList.prototype.drawContents = function(info, rect, valid) {
        var bottom = rect.y + rect.height;
        if (rect.width >= 420) {
            if (valid) {
                this.drawPartyCharacters(info, rect.x + 220, bottom - 4);
            }
            this.drawGameTitle(info, rect.x + 192, rect.y, rect.width - 192, rect);
        }
        var lineHeight = this.lineHeight();
        var y2 = bottom - lineHeight;
        if (y2 >= lineHeight) {
            this.drawPlaytime(info, rect.x, y2, rect.width);
        }
    };
    
    MATTIE.DataManager_MakeSaveFileInfo = DataManager.makeSavefileInfo;
    DataManager.makeSavefileInfo = function(noTimeStamp = false) {
        var oldData = MATTIE.DataManager_MakeSaveFileInfo.call(this, noTimeStamp);
        const newData = {
            ...oldData,
            "name":MATTIE.GameInfo.getCharName(),
            "difficulty": MATTIE.GameInfo.getDifficulty(),
            
        }
        return newData;
    };
})();

