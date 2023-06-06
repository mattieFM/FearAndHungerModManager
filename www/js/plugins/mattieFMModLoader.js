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

const rootDir = process.cwd();
const PATH = require('path')

class ModManager {
    constructor(path) {
        Object.assign(this,PluginManager);
        this._path = path
        this._mods = []
    }
    parseMod(path,modName,mods, i){
        const fs = require('fs');
        const modInfoPath =  path + modName;
        const modInfoData = fs.readFileSync(modInfoPath)
        const modInfo = JSON.parse(modInfoData);
        mods[i] = {};
        mods[i].status = modInfo.status;
        mods[i].name = modInfo.name;
        mods[i].parameters = modInfo.parameters;
    }

    parseMods(path){
        const fs = require('fs');
        const readMods = fs.readdirSync(path);
        let mods = [];
        let i = 1;
        mods[0] = {}
        mods[0].status = true;
        mods[0].name = "_common";
        mods[0].parameters = {};
        readMods.forEach(modName=>{
            try {
                if(modName.includes('.json') && modName[0] != "_"){
                    this.parseMod(path,modName,mods, i)
                    i++
                }

            } catch (error) {
                throw new Error(`an error occurred while loading the mod:\n${error}`)
            }
        })
        return mods

    }

    setup(mods) {
        mods.forEach((mod) => {
            if (mod.status && !this._mods.contains(mod.name)) {
                this.setParameters(mod.name, mod.parameters);
                this.loadScript(mod.name + '.js');
                this._mods.push(mod.name);
            };
        });
    };
}



(async ()=>{

    const path = "mods/";
    const modManager = new ModManager(path);
    const parameters = PluginManager.parameters('mattieFMModLoader');
    const mods = modManager.parseMods(path);
    console.log(mods);
    setTimeout(() => {
        modManager.setup(mods); //all mods load after plugins
    }, 2000);
    
})();
    
    
