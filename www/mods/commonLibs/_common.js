var MATTIE = MATTIE || {};
MATTIE.menus = MATTIE.menus || {};
MATTIE.windows = MATTIE.windows || {};
MATTIE.scenes = MATTIE.scenes || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};
MATTIE.modLoader = MATTIE.modLoader || {};
MATTIE.menus.mainMenu = MATTIE.menus.mainMenu || {};

MATTIE.isDev = true;
MATTIE.GameInfo = {};
MATTIE.GameInfo.getDifficulty = (data=$gameSwitches)=>{
    var difficulty = "Fear & Hunger"
    if (MATTIE.GameInfo.isHardMode(data)) { //Hard mode
        difficulty = "Hard Mode" //funnier name: "Trepidation & Famine"
    }
    else if (MATTIE.GameInfo.isTerrorAndStarvation(data)) { //terror and starvation
        difficulty = "Terror And Starvation"
    } 
    return difficulty;
}
MATTIE.GameInfo.getCharName = (data=$gameParty)=>{ return data.menuActor()._name;};
MATTIE.GameInfo.isHardMode = (data=$gameSwitches)=>data._data[2190] === true;
MATTIE.GameInfo.isTerrorAndStarvation = (data=$gameSwitches)=>(!data._data[2190] && data._data[3153] === true);

MATTIE.DataManager = {};
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
    var saveJson = StorageManager.load(index)
    var saveData = MATTIE.DataManager.extractAndReturnSaveContents(JsonEx.parse(saveJson));
    return saveData;
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

class CommonMod {
    constructor() {
         this.status = true;
         this.name = "commonMod";
         this.params = {};
         this.loaded = false;
    }

    setLoaded(loaded){
        this.loaded = loaded;
    }

    setStatus(status){
        this.status = status;
    }

    setName(name){
        this.name = name;
    }

    setParams(params){
        this.params = params;
    }

    addParam(key,val){
        this.params[key,val];
    }

    register(cb){
        cb();
    }

}

// --UTIL--
function updateKeys(keys,name="") {
    Object.keys(keys).forEach(key => {
        Input.keyMapper[key.toUpperCase().charCodeAt(0)] = key; //add our key to the list of watched keys
    });
};

function updateKey(key,name="") {
    Input.keyMapper[key.toUpperCase().charCodeAt(0)] = key; //add our key to the list of watched keys
};
const keys = {};
Input.addKeyBind = function (key, cb, name ="") {
    
    if(name != ""){
        let tempFunc = Window_KeyConfig.prototype.actionKey;
        let tempFunc2 = Window_KeyAction.prototype.makeCommandList;
        Window_KeyConfig.prototype.actionKey = function(action) {
            if(action === key) return name;
            return tempFunc.call(this,action);
        }

        Window_KeyAction.prototype.makeCommandList = function() {
            tempFunc2.call(this);
            this.addCommand(name, 'ok', true, key);
        }
    }
    keys[key]=cb;
    updateKey(key, name);
}
MATTIE.Prev_Input_Update = Input.update;
    Input.update = function () {
        MATTIE.Prev_Input_Update.call(this);
        for(var key in keys){
            const cb = keys[key];
            if(Input.isRepeated(key)){
                cb();
            }
        }
            
    }

    console.log(MATTIE);
    MATTIE.menus.mainMenu.addBtnToMainMenu(TextManager.Mods,TextManager.Mods,
        MATTIE.menus.toModMenu.bind(this));
    console.log("inited")
if(MATTIE.isDev){
   
    // console.log("inited")
    
    // Input.keyMapper[119] = "F8"
    // keys[119] = ()=>{
    //     if (Utils.isNwjs()) {   
    //         require('nw.gui').Window.get().showDevTools();
    //     }
    // }
}

// --ENGINE OVERRIDES--
