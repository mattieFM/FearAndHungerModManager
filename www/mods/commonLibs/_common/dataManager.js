var MATTIE = MATTIE || {};
MATTIE.DataManager = MATTIE.DataManager || {};
MATTIE.DataManager.dataPath = "/modData/";
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.global = MATTIE.global || {};
let funger1IgnoredPlugins = ["TerraxLighting"];
let terminaIgnoredPlugins = [];
let ignoredPlugins = ["HIME_PreTitleEvents"];

MATTIE.ignoredPlugins = (()=>{
    if(MATTIE.global.isTermina()){
        return terminaIgnoredPlugins.concat(ignoredPlugins);
    } else if (MATTIE.global.isFunger()){
        return funger1IgnoredPlugins.concat(ignoredPlugins);
    }
    return [];
})

//----------------------------------------------
// Global Data
//----------------------------------------------
/** @description whether the version has been loaded and is valid */
MATTIE.global.hasLoadedOnce = false

/** @description returns if this is termina or not */
MATTIE.global.isTermina = ()=>(MATTIE.global.version===2);

/** @description returns if this is funger or not */
MATTIE.global.isFunger = ()=>(MATTIE.global.version===1);
MATTIE.global.requestedDataBaseLoad = false;
/** @description check the version of the game */
MATTIE.global.checkGameVersion = function(){
    return new Promise(res=>{
        if(!$dataSystem){
            if(MATTIE.DataManager){
                let dataVersion = MATTIE.DataManager.global.get('version');
                if(typeof dataVersion != 'undefined'){
                    MATTIE.global.version = dataVersion
                    MATTIE.global.hasLoadedOnce = true;
                    res(dataVersion);
                } else {
                    MATTIE.DataManager.loadFileXML("System.json",(data=>{
                        let version = data.gameTitle.toUpperCase().includes("TERMINA")? 2 : 1;
                        MATTIE.global.version = version
                        MATTIE.global.hasLoadedOnce = true;
                        MATTIE.DataManager.global.set('version',version)
                        res(version);
                    }));
                    
                }
                
            } else {
                //this should never occur,
                //but if it does we will just resolve with 1
                res(1);
            }
        }else{
            let version = $dataSystem.gameTitle.toUpperCase().includes("TERMINA")? 2 : 1;
            MATTIE.global.version = version
            MATTIE.global.hasLoadedOnce = true;
            res(version);
        }
    })
    
}

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

/** 
 * @description creates a modData folder if one does not exist 
 * or if a parm is passes it will create a specfic dir inside of the moddata folder
 * 
*/
MATTIE.DataManager.createDir = function(path=null){
    let fs = require('fs');
    if(path) path = MATTIE.DataManager.localFileDirectoryPath() + path;
    if(!path) path = MATTIE.DataManager.localFileDirectoryPath();
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
    MATTIE.DataManager.global.data[key] = val;
    fs.writeFileSync(name, JSON.stringify(MATTIE.DataManager.global.data));
}

MATTIE.DataManager.global.get = function(key){
    return MATTIE.DataManager.global.data[key];
}

/**
 * 
 * @param {*} orgFilePath the path to the file from www/ 
 * @param {*} destPath the path within the img folder
 * @param {*} name the name of the file
 */
MATTIE.DataManager.addFileToImgFolder = function(orgFilePath,destPath,name,name2=null){
    if(!name.endsWith(".png"))name +=".png"
    if(name2)if(!name2.endsWith(".png")) name2+=".png"
    let fs = require('fs');
    var path = require('path');
    let src = path.dirname(process.mainModule.filename);
    
    orgFilePath = src + orgFilePath + name;
    destinationPath = src +"/img/" + destPath + (name2 || name);
    fs.copyFileSync(orgFilePath,destinationPath)

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
/**
 * @description load a data file using an xml request, then call the callback provided with the data
 * @param {*} src the file name IE: System.json
 * @param {*} cb the callback
 */
MATTIE.DataManager.loadFileXML = function(src, cb){
    var xhr = new XMLHttpRequest();
    var url = 'data/' + src;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
        if (xhr.status < 400) {
            let data = JSON.parse(xhr.responseText);
            cb(data);
        }
    };
    xhr.onerror = this._mapLoader || function() {
        DataManager._errorUrl = DataManager._errorUrl || url;
    };
    xhr.send();
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
