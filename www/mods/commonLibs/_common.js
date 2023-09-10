var MATTIE = MATTIE || {};
MATTIE.menus = MATTIE.menus || {};
MATTIE.windows = MATTIE.windows || {};
MATTIE.scenes = MATTIE.scenes || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};
MATTIE.modLoader = MATTIE.modLoader || {};
MATTIE.menus.mainMenu = MATTIE.menus.mainMenu || {};
MATTIE.global = MATTIE.global || {};
MATTIE.global.version = 1;
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
    if(key.includes("&")){  
        let keys = key.split("&");
        keys.forEach(element=>{
            Input.keyMapper[element.toUpperCase().charCodeAt(0)] = element; //add our key to the list of watched keys
        })
    }else{
        Input.keyMapper[key.toUpperCase().charCodeAt(0)] = key; //add our key to the list of watched keys
    }
    
};

/**
 * 
 * @param {int} scope 
 * -2 = in dev mode
 * -1 = never
 * 0 = global
 * 1 = on scene_map
 * 2 = on scene_battle
 * 3 = on scene_menu
 */
Input.checkScope = function(scope){
    switch (scope) {
        case -1:
            return false;
        case 0:
            return true;
        case 1:
            return SceneManager._scene instanceof Scene_Map;
        case 2:
            return SceneManager._scene instanceof Scene_Battle;
        case 3:
            return SceneManager._scene instanceof Scene_Menu;
        case -2:
            return MATTIE.isDev;
        default:
            return false;
    }
}



const keys = {};
Input.addKeyBind = function (key, cb, name ="", scope = 0) {
    
    if(name != ""){
        let tempFunc = Window_KeyConfig.prototype.actionKey;
        let tempFunc2 = Window_KeyAction.prototype.makeCommandList;
        //this is so that keys can be rebound
        Window_KeyConfig.prototype.actionKey = function(action) {
            if(action === key) return name;
            return tempFunc.call(this,action);
        }
        //this is so that keys can be rebound
        Window_KeyAction.prototype.makeCommandList = function() {
            tempFunc2.call(this);
            this.addCommand(name, 'ok', true, key);
        }
    }

    keys[name]={
        key: key,
        cb: ()=>{if(Input.checkScope(scope))cb()}
    };
    updateKey(key, name);
}
MATTIE.Prev_Input_Update = Input.update;
    Input.update = function () {
        MATTIE.Prev_Input_Update.call(this);
        for(var name in keys){
            let obj = keys[name]
            let key = obj.key;
            let cb = obj.cb;
            if(key.contains("&")){
                /**@type {[]} */
                let combinedKeys = key.split("&");
                
                let pressed = (()=>{
                    for (let index = 0; index < combinedKeys.length-1; index++) {
                        const element = combinedKeys[index];
                        console.log("'"+element+"'");
                        if(!Input.isPressed(element)) return false;
                    }
                    return Input.isRepeated(combinedKeys[combinedKeys.length-1]);
                })();
                if(pressed){
                    cb();
                }
            }else{
                if(Input.isRepeated(key)){
                    cb();
                }
            }
            
            
        }
            
    }


    this.forceModdedSaves = MATTIE.DataManager.global.get("forceModded");
    this.forceVanillaSaves = MATTIE.DataManager.global.get("forceVanilla");
    console.log(MATTIE);
    MATTIE.menus.mainMenu.addBtnToMainMenu(TextManager.Mods,TextManager.Mods,
    MATTIE.menus.toModMenu.bind(this));

// --ENGINE OVERRIDES--

MATTIE_RPG.Game_Map_Setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
    /** @description the last map that the player was on */
    this._lastMapId = mapId;
    console.log(this._lastMapId);
    MATTIE_RPG.Game_Map_Setup.call(this, mapId)
};

/**
 * @description get the last map id
 * @returns the id of the last map 
 */
Game_Map.prototype.lastMapId = function(){
    return this._lastMapId;
}
/**
 * @description format the key of a self swtich id
 * @param {*} mapId the map id that this event is on
 * @param {*} eventId the event id of this event
 * @param {*} letter the letter of this switch
 * @returns {[]}
 */
Game_SelfSwitches.prototype.formatKey = function(mapId, eventId, letter){
    var key = [mapId, eventId, letter];
    return key;
}