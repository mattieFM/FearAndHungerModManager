var MATTIE = MATTIE || {};
MATTIE.multiplayer.charCreationRenderer = MATTIE.multiplayer.charCreationRenderer || {};




MATTIE.multiplayer.charCreationRenderer.renderNetPlayerPortraitsOnScreen = function(){
    if(!MATTIE.multiplayer.varSyncer.syncedOnce){
        if(MATTIE.static.maps.onStartMap()){
            
        }
        
    }
}

MATTIE.multiplayer.charCreationRenderer.onMapLoad = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function () {

    
    MATTIE.multiplayer.charCreationRenderer.onMapLoad.call();
}