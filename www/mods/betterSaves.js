/*:
* @plugindesc V0
* a test mod for fear and hunger
* @author Mattie
* 
* mods define their 
*/
var MATTIE = MATTIE || {};

(()=>{
    const params = PluginManager.parameters('betterSaves');
    
    DataManager.maxSavefiles = function() {
        return params.maxSaves;
    };

    function updateOldSaves() {
        const globalInfo = DataManager.loadGlobalInfo();
        const maxSaves = DataManager.maxSavefiles();
        for (let index = 1; index < maxSaves; index++) {
            if(globalInfo[index])
            if(!globalInfo[index].name){
                console.log(index)
                let saveData = MATTIE.DataManager.loadAndReturnSave(index)
                let diff = MATTIE.GameInfo.getDifficulty(saveData.$gameSwitches);
                let name = JSON.stringify(saveData.$gameActors._data[saveData.$gameParty._actors[0]]._name);
                
                globalInfo[index].difficulty=diff;
                globalInfo[index].name=name.replace("\"","").replace("\"","");
            }
            DataManager.saveGlobalInfo(globalInfo);
            
        } 
    }

    MATTIE.Scene_Save_prototype_init = Scene_Save.prototype.initialize
    Scene_Save.prototype.initialize = function(){
        updateOldSaves();
        MATTIE.Scene_Save_prototype_init.call(this);  
    }

    MATTIE.Scene_Load_prototype_init = Scene_Load.prototype.initialize
    Scene_Load.prototype.initialize = function(){
        updateOldSaves();
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
    DataManager.makeSavefileInfo = function() {
        let oldData = MATTIE.DataManager_MakeSaveFileInfo.call(this);
        const newData = {
            ...oldData,
            "name":MATTIE.GameInfo.getCharName(),
            "difficulty": MATTIE.GameInfo.getDifficulty(),
            
        }
        return newData;
    };
})();

