/*:
 * @plugindesc V0
 * a mod for fear and hunger
 * @author Mattie
 * 
 * 
 * 
 * @param modName  
 * @desc the name of the mod to load
 * @text mod name
 * @type string
 * @default testMod 
 */


//-----------------------------------------------------------------------------\\
// ModManager
//-----------------------------------------------------------------------------\\

/**
 * By default mod's cannot load anything outside of their folder, all dependencies must be included within the mods folder.
 */

var MATTIE_ModManager = MATTIE_ModManager || {};
var MATTIE = MATTIE || {};
var MATTIE_RPG = MATTIE_RPG || {};
MATTIE.ignoredPlugins = ["HIME_PreTitleEvents"];
MATTIE.isDev = false;

MATTIE.global = MATTIE.global || {};
MATTIE.menus = MATTIE.menus || {};
MATTIE.windows = MATTIE.windows || {};
MATTIE.scenes = MATTIE.scenes || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};
MATTIE.menus.mainMenu = MATTIE.menus.mainMenu || {};

MATTIE.global.checkGameVersion = function(){
    let version = $dataSystem.gameTitle.includes("termina")? 2 : 1;
    MATTIE.global.version = version
    return version;
}

/**
 * 
 * @param {*} plugins 
 * @returns {Promise}
 */
PluginManager.loadScript = function(name) {
    return new Promise(res =>{
        var url = this._path + name;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.async = false;
        script.onerror = this.onError.bind(this);
        script._url = url;
        script.addEventListener("load", (ev) => {
            res();
        })
        document.body.appendChild(script);
    })
    
};
/**
 * 
 * @param {*} plugins 
 * @returns {Promise}
 */
PluginManager.setup = function(plugins) {
    let promises = [];
    plugins.forEach(function(plugin) {
        console.log(plugin.name)
        if (plugin.status && !this._scripts.contains(plugin.name)) {
            if(!MATTIE.ignoredPlugins.includes(plugin.name)){ //this does not work as we load after the plugins, easy enough to implment later when we want to optimze tarrax lighting, but for not im going to leave it
                this.setParameters(plugin.name, plugin.parameters);
                promises.push(this.loadScript(plugin.name + '.js'));
                this._scripts.push(plugin.name);
            }
        }
    }, this);
    return Promise.all(promises);

}
MATTIE.DataManagerLoaddatabase =DataManager.loadDatabase;
DataManager.loadDatabase = function() {
    MATTIE.DataManagerLoaddatabase.call(this);
    let int = setInterval(() => {
        if(DataManager.isDatabaseLoaded()){
            if(MATTIE.global)
            if(MATTIE.static){
                MATTIE.global.checkGameVersion();
                MATTIE.static.update();
                clearInterval(int);
            }
            
        }
    }, 50);
    
    
};

class ModManager {
    constructor(path) {
        Object.assign(this,PluginManager);
        this._path = path
        this._realMods = [];
        this._mods = []
        this.forceModdedSaves = false;
        this.forceVanillaSaves = false;
    }

    checkMod (name){
        let allMods = this.getAllMods();
        for (let index = 0; index < allMods.length; index++) {
            const element = allMods[index];
            if(element.name == name) return true;
        }
        return false;
    }

    getModInfo(path,modName){
        const fs = require('fs');
        const modInfoPath =  path + modName;
        const modInfoData = fs.readFileSync(modInfoPath)
        const modInfo = JSON.parse(modInfoData);
        return modInfo;
    }

    getPath(){
        const fs = require('fs');
        let path;
        let mode;
        try {
            fs.readdirSync("www/"+this._path); //dist mode
            mode = "dist"
        } catch (error){
            mode = "dev";
        }
        if(mode === "dist"){
            path="www/"+this._path;
        }else{
            path =this._path;
        }
        return path
    }

    getModsFolder(){
        let arr = [];
        const fs = require('fs');
        
        let readMods = fs.readdirSync(this.getPath());
        
        readMods.forEach(modName => { //load _mods first
            arr.push(modName);
        })
        return arr;
    }

    generateDefaultJSONForMod(modName){
        const fs = require('fs');
        let path = this.getPath();
        let obj = {}
        obj.name = modName;
        obj.status = false;
        obj.parameters = {};
        obj.danger = true;
        fs.writeFileSync(path+modName+".json",JSON.stringify(obj))

    }

    generateDefaultJsonForModsWithoutJsons(){
        let modsWithoutJson = this.getModsWithoutJson();
        modsWithoutJson.forEach(modName=>{
            this.generateDefaultJSONForMod(modName);
        })
    }

    getModsWithoutJson(){
        let modsWithJson = this.getAllMods().map(mod=>mod.name);
        console.log(modsWithJson);
        let modsWithoutJson = [];
        this.getModsFolder().forEach(modName =>{
            if(modName.endsWith(".js") && !modName.includes("mattieFMModLoader")){
                modName = modName.replace(".js","")
                if(!modsWithJson.includes(modName)){
                    modsWithoutJson.push(modName);
                }
            }
            
        })
        return modsWithoutJson;


    }

    /**
     * @description Add a mod to the list of mods that setup will initialize. All mod dependencies (Defined in its mod.json) will be loaded before that mod.
     * @param {*} path the path to the folder
     * @param {*} modName the name of the json file containing the mod info
     */
    parseMod(path,modName){
        const fs = require('fs');
        
        const modInfoPath =  path + modName;
        const modInfoData = fs.readFileSync(modInfoPath)
        const modInfo = JSON.parse(modInfoData);
        if(modInfo.dependencies && modInfo.status){ //load all dependencies before mod
            modInfo.dependencies.forEach(dep=>{
                this.addModEntry(dep);
            });
        }
        if(modInfo.name){
            this.addModEntry(modInfo.name,modInfo.status,modInfo.danger,modInfo.parameters)
        }else{
            this.addModEntry(modName)
        }
        
    }

    getActiveRealDangerMods(){
        let arr = [];
        let currentModsData = this.getAllMods();
        currentModsData.forEach(mod => {
            if(mod.status && mod.name[0] != "_" && mod.danger == true) arr.push(mod);
        });
        return arr;
    }

    getActiveRealMods(){
        let arr = [];
        let currentModsData = this.getAllMods();
        currentModsData.forEach(mod => {
            if(mod.status && mod.name[0] != "_") arr.push(mod);
        });
        return arr;
    }

    checkSaveDanger(){
        return this.getActiveRealDangerMods().length > 0;
    }

    switchForceModdedSaves(){
        this.forceModdedSaves = !MATTIE.DataManager.global.get("forceModded");
        MATTIE.DataManager.global.set("forceModded", this.forceModdedSaves);
        this.forceVanillaSaves = false
    }

    switchForceVanillaSaves(){
        this.forceModdedSaves = false;
        
        this.forceVanillaSaves = !MATTIE.DataManager.global.get("forceVanilla");
        MATTIE.DataManager.global.set("forceVanilla", this.forceVanillaSaves);
    }

    checkForceModdedSaves(){
        return MATTIE.DataManager.global.get("forceModded");
    }

    checkForceVanillaSaves(){
        return  MATTIE.DataManager.global.get("forceVanilla");
    }

    checkVanilla(){
        return this.getActiveRealMods().length === 0;
    }

    checkModded(){
        return this.getActiveRealMods().length > 0;
    }

    setVanilla(){
        let currentModsData = this.getAllMods();
        currentModsData.forEach(mod => {
            if(mod.status) this.switchStatusOfMod(mod.name);
        });
    }

    setNonDanger(){
        let currentModsData = this.getAllMods();
        currentModsData.forEach(mod => {
            if(mod.status == true && mod.danger == true) {
                this.switchStatusOfMod(mod.name);
            }
        });
        if(this.forceModdedSaves) this.switchForceModdedSaves();
    }

    checkModsChanged(){
        let currentModsData = this.getAllMods();
        for (let index = 0; index < this._mods.length; index++) {
            const mod = this._mods[index];
            for (let index = 0; index < currentModsData.length; index++) {
                const currentMod = currentModsData[index];
                if(mod.name === currentMod.name && mod.status != currentMod.status) {
                    return true
                }
                
            }
            
        }
        return false;
    }

    reloadIfChangedGame(){
        if(this.checkModsChanged())  this.reloadGame();
    }

    reloadGame(){
        location.reload()
    }

    switchStatusOfMod(modName){
        if(!modName.includes(".json")) modName+=".json";
        const fs = require('fs');
        let arr = [];
        let mode;
        let path;
        try {
            fs.readdirSync("www/"+this._path); //dist mode
            mode = "dist"
        } catch (error){
            mode = "dev";
        }
        if(mode === "dist"){
            path="www/"+this._path;
        }

        let dataInfo = this.getModInfo(path,modName);
        dataInfo.status = !dataInfo.status;
        fs.writeFileSync(path+modName,JSON.stringify(dataInfo));
    }

    getAllMods(){
        const fs = require('fs');
        let arr = [];
        let mode;
        let path;
        try {
            fs.readdirSync("www/"+this._path); //dist mode
            mode = "dist"
        } catch (error){
            mode = "dev";
        }
        if(mode === "dist"){
            path="www/"+this._path;
        }
        let readMods = fs.readdirSync(path);
        
        readMods.forEach(modName => { //load _mods first
            if(modName.includes(".json")){
                let name = modName.replace(".json","").replace("_","");
                let obj = {};
                let dataInfo = this.getModInfo(path,modName);
                arr.push(dataInfo);
            }
            
        })
        return arr;

    }

    addModEntry(name,status=true,danger=false, params={}){
        var mod = {};
        mod.status = status;
        mod.name = name;
        mod.parameters = params;
        mod.danger = danger;
        this._mods.push(mod);
    }

    
    disableAndReload(){
        this.setVanilla();
        this.reloadGame();
    }

    parseMods(path){
        const fs = require('fs');
        var readMods;
        var mode;
        try {
            fs.readdirSync("www/"+path); //dist mode
            mode = "dist"
        } catch (error){
            mode = "dev";
        }
        if(mode === "dist"){
            path="www/"+path;
        }
        readMods = fs.readdirSync(path);
        
        readMods.forEach(modName => { //load _mods first
            if (modName[0] === "_" && modName.includes(".json") ){
                this.parseMod(path,modName); 
            }
        })

        readMods.forEach(modName=>{//load all other mods second
            try {
                if(modName.includes('.json') && modName[0] != "_"){
                    this.parseMod(path,modName)
                }

            } catch (error) {
                throw new Error(`an error occurred while loading the mod:\n${error}`)
            }
        })
        return this._mods;

    }

    /**
     * @description load all mods from a list that are not already loaded
     * @param {*} mods a list of mods to load
     */
    setup(mods) {
        let promises = [];
        mods.forEach((mod) => {
            if (mod.status && !this._mods.contains(mod.name)) {
                this.setParameters(mod.name, mod.parameters);
                promises.push(this.loadScript(mod.name));
                this._mods.push(mod.name);
            };
        });
        return Promise.all(promises);
        
    };
}

MATTIE_ModManager.init =
function () {
    
    
    const defaultPath = PluginManager._path;
        const path = "mods/";
        const commonLibsPath = path+"commonLibs/";
        const modManager = new ModManager(path);
        MATTIE_ModManager.modManager = modManager;
        modManager.generateDefaultJsonForModsWithoutJsons();
        const commonModManager = new ModManager(commonLibsPath);
        const commonMods = modManager.parseMods(commonLibsPath)
            
        new Promise(res=>{
            PluginManager._path = commonLibsPath;
            commonModManager.setup(commonMods).then(()=>{
                //common mods loaded
                PluginManager._path = defaultPath
                res();
            });
            
        }).then(()=>{
            setTimeout(() => {
                
                PluginManager._path = path;
                const mods = modManager.parseMods(path); //fs is in a different root dir so it needs this.
                console.info(mods)
                modManager.setup(mods).then(()=>{ //all mods loaded after plugins
                    SceneManager.goto(Scene_Title);
                    MATTIE.msgAPI.footerMsg("Mod loader successfully initialized") 
                    PluginManager._path = defaultPath;
                }); 
                
                
            }, 1000);
            
                
            
            
            
        })
        

}

Graphics.clearCanvasFilter = function() {
    if (this._canvas) {
        this._canvas.style.opacity = 1;
        this._canvas.style.filter = null;
        this._canvas.style.webkitFilter = null;
    }
};
Graphics.hideError = function() {
    this._errorShowed = false;
    this.eraseLoadingError();
    this.clearCanvasFilter();
};

MATTIE.suppressingAllErrors = false;
MATTIE.onError = function(e) {
    if(!MATTIE.suppressingAllErrors){
        console.error(e);
    console.error(e.message);
    console.error(e.filename, e.lineno);
    try {
        this.stop();
        Graphics.printError('Error', e.message+"<br>Press 'F7' or 'escape' to try to continue despite this error. <br><br>Press 'F9' to suppress all future errors. (be carful using this)<br><br>Press 'F6' To Reboot without mods. <br> Press 'F5' to reboot with mods. <br><br> If you are reporting a bug, <br> include this screen with the error and what mod/mods you were using and when you were doing when the bug occurred. <br> Thanks <br> -Mattie");
        AudioManager.stopAll();
        let cb = ((key)=>{
            console.log(key.key);
            if(key.key === 'F6'){
                MATTIE_ModManager.modManager.disableAndReload();
                MATTIE_ModManager.modManager.reloadGame();
            } else if(key.key === 'F7' || key.key === 'Escape'){
                document.removeEventListener('keydown', cb, false)
                Graphics.hideError();
                this.resume()
            }
            
            else if (key.key === 'F5'){
                MATTIE_ModManager.modManager.reloadGame();
            }

            else if (key.key === 'F9'){
                MATTIE.suppressingAllErrors = true;
                Graphics.hideError();
                this.resume()
            }
            
        })
        document.addEventListener('keydown', cb, false);
        
    } catch (e2) {
        Graphics.printError('Error', e.message+"\nFUBAR");
    }
    }
    
}

//error handling woooooo

SceneManager.onError = function(e) {
    MATTIE.onError.call(this,e);
};

SceneManager.catchException = function(e) {
    MATTIE.onError.call(this,e);
};


MATTIE_ModManager.init();  
