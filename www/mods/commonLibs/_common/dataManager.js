var MATTIE = MATTIE || {};
MATTIE.DataManager = MATTIE.DataManager || {};
MATTIE.DataManager.dataPath = "/modData/";



//--------------------------------------------------------------
//Mod data
//--------------------------------------------------------------
MATTIE.DataManager.global = function () {
    throw new Error('This is a static class');
}

MATTIE.DataManager.global.fileName = "modDataGlobal.json";

MATTIE.DataManager.global.data = {

    "isDev":false



}; //default data



/** @returns the path of the modData folder*/
MATTIE.DataManager.localFileDirectoryPath = function() {
    var path = require('path');

    var base = path.dirname(process.mainModule.filename);
    return path.join(base, MATTIE.DataManager.dataPath);
};

/** @description creates a modData folder if one does not exist */
MATTIE.DataManager.createDir = function(){
    let fs = require('fs');
    let path = MATTIE.DataManager.localFileDirectoryPath();
    if(!fs.existsSync(path)){
        fs.mkdir(path);
    }
}

MATTIE.DataManager.global.loadGlobalData = function(){
    let fs = require('fs');
    let path = MATTIE.DataManager.localFileDirectoryPath();
    MATTIE.DataManager.global.data = JSON.parse(fs.readFileSync(path+MATTIE.DataManager.global.fileName,{ encoding: 'utf8', flag: 'r' }));
    MATTIE.DataManager.onLoad();
}

MATTIE.DataManager.global.hasLoadedGlobalData = function(){
    return MATTIE.DataManager.global.data ? true: false
}

/**@description creates global data if it does not exist */
MATTIE.DataManager.global.createGlobalData = function(){
    let fs = require('fs');
    let path = MATTIE.DataManager.localFileDirectoryPath();
    MATTIE.DataManager.createDir();
    if(!fs.existsSync(path+MATTIE.DataManager.global.fileName)){
        fs.writeFileSync(path+MATTIE.DataManager.global.fileName,JSON.stringify({}));
    }   
   
}

MATTIE.DataManager.global.set = function(key,val){
    let fs = require('fs');
    let path = MATTIE.DataManager.localFileDirectoryPath();
    let name = path+MATTIE.DataManager.global.fileName;
    console.log(name);
    MATTIE.DataManager.global.data[key] = val;
    fs.writeFileSync(name, JSON.stringify(MATTIE.DataManager.global.data));
}

MATTIE.DataManager.global.get = function(key){
    return MATTIE.DataManager.global.data[key];
}


MATTIE.DataManager.init = function(){
    MATTIE.DataManager.global.createGlobalData();
    MATTIE.DataManager.global.loadGlobalData();
}



MATTIE.DataManager.onLoad = function(){
    MATTIE.isDev = MATTIE.DataManager.global.get("isDev")
    MATTIE.multiplayer.isDev = MATTIE.DataManager.global.get("isDev")
}

MATTIE.DataManager.addToOnLoad = function(cb){
    let prevFunc = MATTIE.DataManager.onLoad
    MATTIE.DataManager.onLoad = function(){
        prevFunc.call(this);
        cb();
    }
}




//--------------------------------------------------------------
//game data
//--------------------------------------------------------------


/**
 * @description load a save as an object to acsess information from it but not load it 
 * @param {JSON} contents a parsed json of the save you are loading
 * @returns an object of the save's game data
 */
MATTIE.DataManager.extractAndReturnSaveContents = function(contents) {
    var data={};
    data.$gameSystem        = contents.system;
    data.$gameScreen        = contents.screen;
    data.$gameTimer         = contents.timer;
    data.$gameSwitches      = contents.switches;
    data.$gameVariables     = contents.variables;
    data.$gameSelfSwitches  = contents.selfSwitches;
    data.$gameActors        = contents.actors;
    data.$gameParty         = contents.party;
    data.$gameMap           = contents.map;
    data.$gamePlayer        = contents.player;
    return data;
};
/**
 * @description turn an object of save data into the format used to save the game
 * @param {Object} data save data for a game parsed as an object
 */
MATTIE.DataManager.makeSaveContentsFromParam = function(data){
        // A save data does not contain $gameTemp, $gameMessage, and $gameTroop.
        var contents = {};
        contents.system       = data.$gameSystem;
        contents.screen       = data.$gameScreen;
        contents.timer        = data.$gameTimer;
        contents.switches     = data.$gameSwitches;
        contents.variables    = data.$gameVariables;
        contents.selfSwitches = data.$gameSelfSwitches;
        contents.actors       = data.$gameActors;
        contents.party        = data.$gameParty;
        contents.map          = data.$gameMap;
        contents.player       = data.$gamePlayer;
        return contents;
}
/**
 * @description get full game data of a save as an object.
 * @param {integer} index the index of the save slot you want to load
 * @returns full game data of that save
 */
MATTIE.DataManager.loadAndReturnSave = function(index){
    try {
        var saveJson = StorageManager.load(index)
        var saveData = MATTIE.DataManager.extractAndReturnSaveContents(JsonEx.parse(saveJson)); 
        return saveData;
    } catch (error) {
        return null
    }
    
    
}
/**
 * @description make save file info from param
 * @returns save file info
 */
MATTIE.DataManager.makeSavefileInfo = function(data) {
    var info = {};
    info.globalId   = DataManager._globalId;
    info.title      = $gameSystem.gameTitle;
    info.characters = data.$gameParty.charactersForSavefile();
    info.faces      = data.$gameParty.facesForSavefile();
    info.playtime   = data.$gameSystem.playtimeText();
    info.timestamp  = Date.now();
    return info;
};

MATTIE.DataManager.saveGameFromObj = function (savefileId,obj) {
        var json = JsonEx.stringify(MATTIE.DataManager.makeSaveContentsFromParam(obj));
        if (json.length >= 200000) {
            console.warn('Save data too big!');
        }
        StorageManager.save(savefileId, json);
        DataManager._lastAccessedId = savefileId;
        var globalInfo = DataManager.loadGlobalInfo() || [];
        globalInfo[savefileId] = MATTIE.DataManager.makeSavefileInfo(obj);
        DataManager.saveGlobalInfo(globalInfo);
        return true;
}




MATTIE.DataManager.init();
