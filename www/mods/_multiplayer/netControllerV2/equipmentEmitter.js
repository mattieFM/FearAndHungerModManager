//this file handles emitting events for equipment / weapon / skill changes

var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.multiplayer.equipmentEmitter = MATTIE.multiplayer.equipmentEmitter || {};

// Change Skill
MATTIE.multiplayer.equipmentEmitter.changeSkill =Game_Interpreter.prototype.command318;
Game_Interpreter.prototype.command318 = function() {
    let val =MATTIE.multiplayer.equipmentEmitter.changeSkill.call(this);

    return val;
    
};

// Change Equipment
MATTIE.multiplayer.equipmentEmitter.changeEquipment =Game_Actor.prototype.changeEquip;
Game_Actor.prototype.changeEquip = function(slotId, item, ignore=false) {
    let val = MATTIE.multiplayer.equipmentEmitter.changeEquipment.call(this, slotId,item);
    if(!ignore && item) MATTIE.multiplayer.getCurrentNetController().emitEquipmentChange(this._actorId,slotId, item.id);
    if(!ignore && !item) MATTIE.multiplayer.getCurrentNetController().emitEquipmentChange(this._actorId,slotId, 9); //9 is a fake item and should work
    return val;
};

MATTIE.multiplayer.equipmentEmitter.emitAllEquipment = function(){
    $gameParty.allMembers().forEach(actor=>{
        if(actor){
            actor.equips().forEach(equip=>{
                if(equip){
                    let slotId = equip.etypeId-1;
                    let itemId = equip.id;
                    MATTIE.multiplayer.getCurrentNetController().emitEquipmentChange(actor.actorId(), slotId, itemId);
                }
                
            })
        }
        
    })
}