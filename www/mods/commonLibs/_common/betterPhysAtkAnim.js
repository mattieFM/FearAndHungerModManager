/*: 
@plugindesc Characters draw weapons when using physical skills. 
(or any skills you configure) 
@author Coelocanth 
@param PhysicalAttacks 
@desc All skills set to "physical attack" will use the draw 
weapon animation. 
@type boolean 
@default true 
@param SkillTypes 
@desc Space separated list of skill types which use the draw weapon animations. 
@default 
@help 
In the default system, this only happens for the "attack" skill. 
This plugin allows you to have actors draw their weapon when using some 
or all skills. 

By default, all skills which have a hit type of "physical attack" will 
use the weapon animations. To turn this off, set the plugin parameter 
"CCPS_PhysicalUseWeapon" to false. 

To make all skills of particular types use the weapon animations, add 
the skill types to the "CCPS_SkillTypesUseWeapon" plugin parameter. 
e.g. for the "Special" type in a default project, set this to "2" 

These tags can be used to make individual skills use the weapon 
animation: 
<CCPS_weapon:true> - this skill uses the weapon animation 
<CCPS_weapon:false> - this skill does not use the weapon animation 

Skill note tags override the plugin parameters for that skill. 

Copyright 2018 Coelocanth 

Redistribution and use in source and binary forms, with or without 
modification, are permitted provided that the following conditions are met: 

1. Redistributions of source code must retain the above copyright notice, 
this list of conditions and the following disclaimer. 

2. Redistributions in binary form must reproduce the above copyright notice, 
this list of conditions and the following disclaimer in the documentation 
and/or other materials provided with the distribution. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE 
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE 
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL 
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR 
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER 
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, 
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE 
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 
*/ 

(function() { 
    try {
        var parameters = PluginManager.parameters('CC_physicalattacks'); 
        var phys_weap = eval(String(parameters)); 
        var types_weap = String(parameters).split(' '); 
        for(var i=0;i<types_weap.length;i++) { 
        types_weap = parseInt(types_weap); 
        } 
        
        Game_Actor.prototype.CC_performAction = Game_Actor.prototype.performAction; 
        Game_Actor.prototype.performAction = function(action) { 
        this.CC_performAction(action); 
        if(action.item().meta.CCPS_weapon === 'false') { 
        return; 
        } 
        if(action.item().meta.CCPS_weapon === 'true' 
        || (phys_weap && action.isPhysical() && action.isSkill()) 
        || (action.isSkill() && types_weap.contains(action.item().stypeId))) { 
        this.performAttack(); 
        } 
        }   
    } catch (error) {
        
    }
    
    
    })();