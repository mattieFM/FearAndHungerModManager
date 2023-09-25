//this file handles emitting the event for when the host should sync vars 

var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {}
MATTIE.multiplayer.varSyncer = MATTIE.multiplayer.varSyncer || {}
MATTIE.multiplayer.equipmentEmitter = MATTIE.multiplayer.equipmentEmitter || {};
//override the function that triggers when the scene map is fully loaded
MATTIE.multiplayer.varSyncer.onMapLoaded = Scene_Map.prototype.onMapLoaded;
/** this var controls if the client will request a var sync on map load, it will set itself to false once one load is complete */
MATTIE.multiplayer.varSyncer.shouldSync = true;
MATTIE.multiplayer.varSyncer.syncEveryx = 100000 //sync every 100 seconds
MATTIE.multiplayer.varSyncer.syncedOnce = false;

setInterval(() => {
    MATTIE.multiplayer.varSyncer.shouldSync = true
}, MATTIE.multiplayer.varSyncer.syncEveryx);



Scene_Map.prototype.onMapLoaded = function () {
    MATTIE.multiplayer.varSyncer.onMapLoaded.call(this);
    if(!MATTIE.static.maps.onMenuMap()){
        setTimeout(()=>{
            MATTIE.multiplayer.hasLoadedVars = true;
        }, 1000)
        
        if(MATTIE.multiplayer.varSyncer.shouldSync && !MATTIE.multiplayer.varSyncer.syncedOnce){
            MATTIE.multiplayer.varSyncer.syncedOnce = true;
            setTimeout(() => {
                MATTIE.multiplayer.equipmentEmitter.emitAllEquipment();
            }, 5000);
        }
        if(MATTIE.multiplayer.isClient){
            //if the local machine is a client then request a var refresh the first time
            if(MATTIE.multiplayer.varSyncer.shouldSync){
                MATTIE.multiplayer.varSyncer.shouldSync = false;
                setTimeout(() => {
                    MATTIE.multiplayer.getCurrentNetController().emitRequestedVarSync();
                }, 5000);
                
                
            }
            
        }
    }
}