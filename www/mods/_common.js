var MATTIE = MATTIE || {};

MATTIE.GameInfo = {};
MATTIE.GameInfo.getDifficulty = ()=>{
    let difficulty = "Fear & Hunger"
    if (MATTIE.GameInfo.isHardMode()) { //Hard mode
        difficulty = "Hard Mode" //funnier name: "Trepidation & Famine"
    }
    else if (MATTIE.GameInfo.isTerrorAndStarvation()) { //terror and starvation
        difficulty = "Terror And Starvation"
    } 
    return difficulty;
}
MATTIE.GameInfo.getCharName = (data=$gameParty)=>{ return data.menuActor()._name;};
MATTIE.GameInfo.isHardMode = (data=$gameSwitches)=>data._data[2190] === true;
MATTIE.GameInfo.isTerrorAndStarvation = (data=$gameSwitches)=>data._data[2190] === false && $gameSwitches._data[3153] === true;



class CommonMod {
    constructor() {
         this.status = true;
         this.name = "commonMod";
         this.params = {};
         this.loaded = false;
    }

    consoleLog(){
        console.log("hello")
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
function updateKeys(keys) {
    Object.keys(keys).forEach(key => {
        Input.keyMapper[key.toUpperCase().charCodeAt(0)] = key; //add our key to the list of watched keys
    });
};
const keys = {};
Input.addKeyBind = function (key, cb) {
    keys[key]=cb;
    updateKeys(keys);
}
MATTIE.Prev_Input_Update = Input.update;
    Input.update = function () {
        MATTIE.Prev_Input_Update.call(this);
        for(let key in keys){
            const cb = keys[key];
            if(Input.isRepeated(key)){
                cb();
            }
        }
            
    }

// --ENGINE OVERRIDES--
