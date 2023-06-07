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


//-----------------------------------------------------------------------------
// ModManager
//
// The static class that manages the mods (might need to be beefed up in future, but for now, just extend plugin manager).

let MATTIE_ModManager = {};

class ModManager {
    constructor(path) {
        Object.assign(this,PluginManager);
        this._path = path
        this._mods = []
    }
    parseMod(path,modName){
        const fs = require('fs');
        const modInfoPath =  path + modName;
        const modInfoData = fs.readFileSync(modInfoPath)
        const modInfo = JSON.parse(modInfoData);
        this.addModEntry(modInfo.status,modInfo.name,modInfo.parameters)
    }

    addModEntry(status,name,params){
        let mod = {};
        mod.status = status;
        mod.name = name;
        mod.parameters = params;
        this._mods.push(mod);

    }

    parseMods(path){
        const fs = require('fs');
        let readMods;
        let mode;
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
        
        this.addModEntry(true,"_common",{}); //set common mod to load first
        //mods that start with _ load first and do not have config files. This is as they should be dev facing and not using facing. any _ files should be
        //dependencies for actual mods and thus should not present the user with config options.
        readMods.forEach(modName => { //load _mods first
            if (modName[0] === "_"){
                this.addModEntry(true,modName.replace('.js',""),{}); 
            }
        })

        readMods.forEach(modName=>{//load all other mods second
            try {
                if(modName.includes('.json')){
                    this.parseMod(path,modName)
                }

            } catch (error) {
                throw new Error(`an error occurred while loading the mod:\n${error}`)
            }
        })
        return this._mods;

    }

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
        }, 2000);
}

MATTIE_ModManager.init();