//this variable name is just naming convention, this is just a conversion of someone else's assets into a plugin based mod
MATTIE.bearGirlImgs = {};

MATTIE.bearGirlImgs.onLoad = function(){
    confirm(`The bear girl mod is a port of \nhttps://www.nexusmods.com/fearandhunger/mods/10\n as a plugin based mod, Go check them out`)
}

MATTIE.bearGirlImgs.onLoad()

MATTIE_ModManager.modManager.addOnloadScriptToMod("bearGirlImgs", MATTIE.bearGirlImgs.onLoad);