var MATTIE = MATTIE || {};
MATTIE.bbgirlAPI = MATTIE.bbgirlAPI || {};



var Imported = Imported || {};

MATTIE.bbgirlAPI.yassify = function(){
    console.log("yassed")
    let yassssifyyDict = {
        "Actor1": {
            0:"portrarL_cahara",
            2:"portraitR_darce",
            3:"portraitR_girl",
            6:"portraitL_enki",
            7:"portraitL_ragn"
        },
        "Actor2":{
            0:"portraitL_legarde",

        },
        "Actor3":{
            0:"portraitL_nashrah",
            2:"portraitR_darce",
            3:"portraitR_girl",
            6:"portraitL_enki",
            7:"portraitL_ragn"
            
        }
    }
    Window_MenuStatus.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) {
        console.log(faceName);
        console.log(faceIndex)
        var width = this.bustWidth();
    
        var bustName = faceName + "_" + (faceIndex + 1)
        let keys = Object.keys(yassssifyyDict);

        keys.forEach(key => {
            if(faceName.includes(key)){
                let portraitKeys = Object.keys(yassssifyyDict[key]);
                if(portraitKeys.includes(faceIndex)){
                    bustName = yassssifyyDict[key][portraitKeys[faceIndex]];
                }
            }
        });
        var bitmap = ImageManager.loadPicture(bustName);
        
        var ox = 0;
        var oy = 0;
        if (Galv.BM.offsets[bustName]) {
            ox = Galv.BM.offsets[bustName][0] || 0;
            oy = Galv.BM.offsets[bustName][1] || 0;
        };
    
        var sw = width;
        var sh = Galv.BM.bustHeight;
        var dx = x - 1;
        var dy = y + Galv.BM.bust;
        var sx = bitmap.width / 2 - width / 2 - ox;
        var sy = oy;
        this.contents.unlimitedBlt(bitmap, sx, sy, sw, sh, dx, dy);
    }; 
}
