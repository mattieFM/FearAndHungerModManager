# FearAndHungerModManager
Welcome to MATTIE's Fear And Hunger Mod Manager. This mod manager works for both F&H 1 and 2.

##Mod Loader Features
-Abiltiy to toggle on and off any and all mods you have installed.
![image](https://github.com/mattieFM/FearAndHungerModManager/assets/66142165/e3012f3c-b75d-4ec4-a4d0-282b8ad24cf4)

-Save File Protection.
  -All mods are marked as either "safe for save files" or "unsafe for save files" if you are running mods that are unsafe for game files, the mod loader will create a seperate set of saves and protect your vanilla saves. If you are using mods that are safe for game files than the mod loader will load your normal saves for the game. 
  -There are settings to make the mod manager always use its own saves or always use vanilla saves. 
  -Ability to have seperate saves for each mod or combination of mods.
-Config files to allow customisation of mods. 
-Automatically disables incompatible mods, and helps reduce crashes.


# Mods
Most mods will work for both F&H1 and F&H2. But if they are not working properly than the mod loader should automatically disable them and inform you which one it believes is not supported.
-Better Saves
  -Allows as many save files as you would like, by default max saves is set to 99 but can be set to how ever large a value you would like.
  -Also displays name and difficulty on save files, as shown below:
  ![image](https://github.com/mattieFM/FearAndHungerModManager/assets/66142165/37b1610a-fd7f-4559-83ed-8103e536113f)
  
-Dev Tools.
  -Press "i" to open and close a cheat menu.
  -Press "v" to use a better form of phase step.
  
-Unlocked Blood Portal
  -Press "b" to open the blood portal menu from anywhere. Allowing fast travel from any location.

-Multiplayer
  -WIP
  -A lot of changes

#Install
Installation instructions: 
 -First Decompile Fear and Hunger.
 -Download this repo.
 -add the mods folder to your game's www/ folder.
 -replace your game's index.html file with mine.
 -The mod loader is now installed.

#development info
Mods consist of 2 files, a .js file and a .json file, the .json file contains information about the mod, think of it as a config file of sorts. It must contain the following values
{
    "name":(string)(the file name of the mod)
    "status":(boolean)(this is wether the mod is enabled or not, it should be set to false by default untill the user enables it),
    "parameters":(dict)(a dictionary of any config options / values that you want the user to be able to edit),
    "danger": (boolean) (wether or not this mod poses a risk to save file and save data, could this mod result in damage to the save data or not)
}
there is one more value that is not required which is:
"dependencies": (array) (array of file names without prefixes that need to be loaded before this mod can be run).

the .js file is akin to a plugin file for RPG maker but it does not need any of the specific rpg maker metadata or comments as the mod is loaded as a mod rather than a plugin.
Any mod with _ at the front of its name will be loaded before files without a _, this is useful for loading Libraries that are common between all of your mods. The commonLib's folder is not ment to be edited ever, these are files specific to the mod loader and are loaded before everything else.

Example mods can be found in the mods folder, and the commonLibs folder is also provided, this mod is loaded first before all other mods. _Common.js should NOT be edited, if you want to add a common.js file 
that loads before all other mods for your own mods, just add an _ to the name of it and it will load before them.


\

Eventually I will propperly map out control vars and switches in the game to actual variables, but currently if you need to acsess game data open fear and hunger in rpgmaker mv, and then find the nubmer of the switch
you want to acsess then just user $gameSwitches[index] to return the value.
