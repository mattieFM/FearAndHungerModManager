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


var MATTIE_ModManager = {};

class ModManager {
    constructor(path) {
        Object.assign(this,PluginManager);
        this._path = path
        this._mods = []
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
        if(modInfo.dependencies){ //load all dependencies before mod
            modInfo.dependencies.forEach(dep=>{
                this.addModEntry(dep);
            });
        }
        if(modInfo.name){
            this.addModEntry(modInfo.name,modInfo.status,modInfo.parameters)
        }else{
            this.addModEntry(modName)
        }
        
    }

    addModEntry(name,status=true,params={}){
        var mod = {};
        mod.status = status;
        mod.name = name;
        mod.parameters = params;
        this._mods.push(mod);
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
        mods.forEach((mod) => {
            if (mod.status && !this._mods.contains(mod.name)) {
                this.setParameters(mod.name, mod.parameters);
                this.loadScript(mod.name);
                this._mods.push(mod.name);
            };
        });
    };
}
MATTIE_ModManager.init =
function () {
    const defaultPath = PluginManager._path;
        const path = "mods/";
        PluginManager._path = path;
        const modManager = new ModManager(path);
        const mods = modManager.parseMods(path); //fs is in a different root dir so it needs this.
        console.log(mods);
        setTimeout(() => {
            modManager.setup(mods); //all mods load after plugins
            window.alert("all mods successfully loaded")
            PluginManager._path = defaultPath;
        }, 500);
}

MATTIE_ModManager.init();