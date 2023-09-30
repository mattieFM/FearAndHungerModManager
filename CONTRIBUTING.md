First add me on discord @MattieFM.
Then read the dev onboarding page on the wiki: https://mattiefm.github.io/FearAndHungerModManager/tutorial-devSetup.html.
Msg me with any questions, if I have time I will set up a time to meet with out and help bring you up to speed.

To contribute make a fork of this repo, make your changes, validate your changes and then open a PR from your fork to main.

#Guidelines
-Maintain quality code.
-Ensure you are following the eslint style declared, to check for issues with your code run npm lint:mods or configure your ide to lint on save. Your ide should show errros anywhere you ar violating lint rules.
-Good documentation. Follow JSDoc standards for documenation.
 -If you are creating a namespace use @namespace so that the doc gen will find it
 -all methods and non-private functions require full documentation comments, description, param and return.
 -use @class above prototype based classes so that the doc gen will find it
-Make reusable code, do not copy and paste code, ensure you are not implmenting something someone else already did for the repo, and if you are, extend their version when possible.
-DO NOT OVERRIDE base rpgmaker classes fully without understanding what that means. If you fully override an rpg maker function durring mod-compile time it will erease all plugins that also extended that function, you should instead override the rpgmaker method durring the phase before plugins are loaded such that you won't mess them up. Remember, sometime you want to override plugin's sometimes you don't. Load code durring the apropirate stage and leave comments as to why you did what you did.



We welcome pull requests but might reject them if they do not meet the standards above.
