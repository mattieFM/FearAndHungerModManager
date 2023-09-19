
var MATTIE = MATTIE || {};
MATTIE.bbgirlMod = {};

MATTIE.prevFun5325c = Game_Actor.prototype.characterName;

(()=>{
    let fileName = "$naked_mercenary.png";
    let bbgirlModName = 'bbgirlMod'
    MATTIE.bbgirlMod.onLoad = function(){
        if(!MATTIE.DataManager.global.get("bbgirlInstalled")){
        
            MATTIE.DataManager.addFileToImgFolder("/mods/_bbgirlAssets/images/","/characters/",fileName)
            MATTIE.DataManager.addFileToImgFolder("/img/characters/","/characters/",fileName,"_"+fileName)
            MATTIE.DataManager.global.set("bbgirlInstalled", true)
            alert("bbgirl mod installed --game will need to be reloaded");
            MATTIE_ModManager.modManager.reloadGame();
            
        }
    }


    MATTIE.bbgirlMod.offload = function(){
        MATTIE.DataManager.global.set("bbgirlInstalled", false);
        MATTIE.DataManager.addFileToImgFolder("/img/characters/","/characters/","_"+fileName,fileName)
        alert ("bgirl mod uninstalled")
    }


    MATTIE_ModManager.modManager.addOffloadScriptToMod(bbgirlModName,MATTIE.bbgirlMod.offload);

    MATTIE_ModManager.modManager.addOnloadScriptToMod(bbgirlModName,MATTIE.bbgirlMod.onLoad);
    MATTIE.bbgirlMod.onLoad();
    Game_Actor.prototype.forceCharName = function(name){
        this.forcedName = name;
        $dataActors[this.actorId()]._forcedName = name;
    }

    Game_Actor.prototype.characterName = function(){
        let name = this.forcedName || $dataActors[this.actorId()]._forcedName
        if(name){
            
            this.forcedName = name;
            return this.forcedName;}
        return MATTIE.prevFun5325c.call(this);
        
    }

    Object.defineProperty(Game_Actor.prototype, 'forcedName', {
        get: function() {
            return this._forcedName;
        },
        set: function(val){
            this._forcedName = val;
        }
    });

    setTimeout(() => {
        MATTIE.bbgirlAPI.yassify(); //setup dungeon knights icons  
    }, 500);

    //make Cahara naked if he is wearing no armor
    setInterval(() => {
        let actors = $gameParty.members();
        for (let index = 0; index < actors.length; index++) {
            let actor = null
            let name = null
            const thisActor = actors[index];
            switch (thisActor.actorId()) {
                case MATTIE.static.actors.mercenaryId:
                    actor = $gameActors.actor(MATTIE.static.actors.mercenaryId);
                    name = "$naked_mercenary";
                    break;
                case MATTIE.static.actors.darkPriestId:
                    actor = $gameActors.actor(MATTIE.static.actors.darkPriestId);
                    name = "$naked_darkpriest";
                    break;
                case MATTIE.static.actors.knightId:
                    actor = $gameActors.actor(MATTIE.static.actors.knightId);
                    name = "$naked_knight";
                    break;
                case MATTIE.static.actors.outlanderId:
                    actor = $gameActors.actor(MATTIE.static.actors.outlanderId);
                    name = "$naked_outlander";
                    break;
                default:
                    break;
            }
            if(actor){
                let id = actor.actorId();
                if(!actor.armors().length >= 1){
                    $gameActors._data[id]._forcedName = name;
                    $gameActors.actor(id).forceCharName(name);
                }else{
                    $gameActors._data[id]._forcedName = undefined;
                    $gameActors.actor(id).forceCharName(undefined);
                }
            }
        }
        
    }, 1500);

})();
