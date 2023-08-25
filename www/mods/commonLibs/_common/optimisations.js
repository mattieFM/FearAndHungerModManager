
var MATTIE = MATTIE || {};
MATTIE.optimisations = MATTIE.optimisations || {};


//rewrite loadallsavefile images to only load up to the max number of saves
DataManager.loadAllSavefileImages = function() {
    var globalInfo = this.loadGlobalInfo();
    if (globalInfo) {
        for (var i = 1; i < DataManager.maxSavefiles(); i++) {
            if (this.isThisGameFile(i)) {
                var info = globalInfo[i];
                this.loadSavefileImages(info);
            }
        }
    }
};

MATTIE.optimisations.loadGlobalInfo = DataManager.loadGlobalInfo;
MATTIE.optimisations.lastGlobalInfo = null;
MATTIE.optimisations.lastGlobalInfoTime = 0;
MATTIE.optimisations.refreshTime = 500; //the number of milli seconds since the last time global info was acsessed to wait till reloading the data.
DataManager.loadGlobalInfo = function(forcedReload = false) {
    let currentTime = new Date().getTime();
    let val;
    if(forcedReload ||  currentTime > MATTIE.optimisations.lastGlobalInfoTime + MATTIE.optimisations.refreshTime){
         val = MATTIE.optimisations.loadGlobalInfo.call(this);
    }else{
        val = MATTIE.optimisations.lastGlobalInfo;
    }
    
    MATTIE.optimisations.lastGlobalInfo = val;
    MATTIE.optimisations.lastGlobalInfoTime = new Date().getTime();
    return val
};

DataManager.saveGame = function(savefileId, noTimeStamp=false) {
    console.log(noTimeStamp);
    try {
        StorageManager.backup(savefileId);
        return this.saveGameWithoutRescue(savefileId, noTimeStamp);
    } catch (e) {
        console.error(e);
        try {
            StorageManager.remove(savefileId);
            StorageManager.restoreBackup(savefileId);
        } catch (e2) {
        }
        return false;
    }
}
//
DataManager.saveGameWithoutRescue = function(savefileId, noTimeStamp=false) {
    console.log(noTimeStamp);
    var json = JsonEx.stringify(this.makeSaveContents());
    if (json.length >= 200000) {
        console.warn('Save data too big!');
    }
    StorageManager.save(savefileId, json);
    this._lastAccessedId = savefileId;
    var globalInfo = this.loadGlobalInfo() || [];
    console.log(noTimeStamp);
    globalInfo[savefileId] = this.makeSavefileInfo(noTimeStamp);
    this.saveGlobalInfo(globalInfo);
    return true;
};
MATTIE.optimisations.makeSavefileInfo = DataManager.makeSavefileInfo;
DataManager.makeSavefileInfo = function(noTimeStamp = false) {
    var info = MATTIE.optimisations.makeSavefileInfo.call(this);
    if(noTimeStamp) info.timestamp = 0;
    return info;
};

Scene_Save.prototype.firstSavefileIndex = function() {
    return DataManager.latestSavefileId();
};