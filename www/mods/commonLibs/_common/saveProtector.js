var MATTIE = MATTIE || {};
var MATTIE_ModManager = MATTIE_ModManager || {};

StorageManager.localFileDirectoryPath = function() {
    var path = require('path');

    var base = path.dirname(process.mainModule.filename);
    if(MATTIE_ModManager.modManager)
    if(!MATTIE_ModManager.modManager.checkSaveDanger())
    return path.join(base, 'save/');
    else
    return path.join(base, 'moddedSaves/');
};