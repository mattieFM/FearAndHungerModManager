# FearAndHungerModManager
This is a mod manager that can be used for any RPG maker MV game, although was designed to mod Fear and Hunger 1/2. 

The mod manager itself is the file mattieFMModManger in the plugins dir. This plugin can be added to any rpg maker plugins folder and enable to allow the use of mods. 

Mods can be placed in the mods folder with a corrisponding .json file with info about them for the modManger to read. 

Example mods can be found in the mods folder, and the _common mod is also provided, this mod is loaded first before all other mods. _Common.js should NOT be edited, if you want to add a common.js file 
that loads before all other mods for your own mods, just add an _ to the name of it and it will load before them.

this project is in vary early development but is currently fully functional. If you want to make a mod for fear and hunger, 
first de compile fear and hunger, 
then add my plugin to the js/plugins folder then 
create a mods folder in www/
then any .js file with a corrisponding .json file will load as a mod, 
look through my mod exmaples to get a jist of how to mod the game. 

Eventually I will propperly map out control vars and switches in the game to actual variables, but currently if you need to acsess game data open fear and hunger in rpgmaker mv, and then find the nubmer of the switch
you want to acsess then just user $gameSwitches[index] to return the value.
