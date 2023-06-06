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

    Window_SavefileList.prototype.drawGameTitle = function(info, x, y, width, rect) {
        if (info.difficulty && info.name) {
            this.drawText(info.difficulty, x, y+rect.height-70, width, "right");
            this.drawText(info.name, x, y, width, "right");
        } else if (info.title){
            // const index =Math.round(rect.height/y);
            // let saveData = JSON.parse(StorageManager.load(index));
            // let diff = "Fear & Hunger"
            // if(MATTIE.GameInfo.isHardMode(saveData.switches)){
            //     diff = "Hard Mode"
            // }else if (MATTIE.GameInfo.isTerrorAndStarvation(saveData.switches)){
            //     diff = "Terror & Starvation"
            // }try {
            //     let name = JSON.stringify(saveData.actors._data['@a'][saveData.party._menuActorId+1]._name);
            //     console.log(`name:${name}\ndiff:${diff}`)
                this.drawText(info.title + " - legacy save", x, y+rect.height-35, width);
        //     }
           
        //     catch (error) {
        //         console.log(error)
        //     }
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

