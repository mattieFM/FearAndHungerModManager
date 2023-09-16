var MATTIE_ModManager = MATTIE_ModManager || {};
var MATTIE = MATTIE || {};

//----------------------------------------------------------------
//Error Handling
//----------------------------------------------------------------

/**
 * @description override the scene manager error functions with our own error screen instead
 */
MATTIE_ModManager.overrideErrorLoggers = function(){
    SceneManager.onError = function(e) {
        MATTIE.onError.call(this,e);
    };
    
    SceneManager.catchException = function(e) {
        MATTIE.onError.call(this,e);
    };
}

Graphics.clearCanvasFilter = function() {
    if (this._canvas) {
        this._canvas.style.opacity = 1;
        this._canvas.style.filter = null;
        this._canvas.style.webkitFilter = null;
    }
};
Graphics.hideError = function() {
    this._errorShowed = false;
    this.eraseLoadingError();
    this.clearCanvasFilter();
};

/**
 * @description for the purpose of matching our error style to that of termina I have used Olivia's formatting below
 * variables names were changed to match coding convention of my modloader not to appear as though this is my code. That said this is like
 * borrowing a color. 
 * @credit Olivia AntiPlayerStress
 */
MATTIE_RPG.Graphics_updateErrorPrinter = Graphics._updateErrorPrinter;
Graphics._updateErrorPrinter = function() {
    MATTIE_RPG.Graphics_updateErrorPrinter.call(this);
    this._errorPrinter.height = this._height * 0.5;
    this._errorPrinter.style.textAlign = 'left';
    this._centerElement(this._errorPrinter);
};

MATTIE.suppressingAllErrors = false;
MATTIE.onError = function(e) {
    if(!MATTIE.suppressingAllErrors){
        console.error(e);
    console.error(e.message);
    console.error(e.filename, e.lineno);
    try {
        this.stop();
        let color = "#f5f3b0";
        let errorText = "";
        errorText += `<font color="Yellow" size=5>The game has encountered an error, please report this.<br></font>`
        errorText += `<br> If you are reporting a bug, include this screen with the error and what mod/mods you were using and when you were doing when the bug occurred. <br> Thanks <br> -Mattie<br>`
        
       
        errorText += `<br><font color="Yellow" size=5>Error<br></font>`
        errorText += e.stack.split("\n").join("<br>");

        errorText += `<font color=${color}><br><br>Press 'F7' or 'escape' to try to continue despite this error. <br></font>`
        errorText += `<font color=${color}>Press 'F9' to suppress all future errors. (be carful using this)<br></font>`
        errorText += `<font color=${color}>Press 'F6' To reboot without mods.<br></font>`
        errorText += `<font color=${color}>Press 'F5' to reboot with mods. <br></font>`
        
        Graphics.printError('',errorText);
        AudioManager.stopAll();
        let cb = ((key)=>{
            if(key.key === 'F6'){
                MATTIE_ModManager.modManager.disableAndReload();
                MATTIE_ModManager.modManager.reloadGame();
            } else if(key.key === 'F7' || key.key === 'Escape'){
                document.removeEventListener('keydown', cb, false)
                Graphics.hideError();
                this.resume()
            }
            
            else if (key.key === 'F5'){
                MATTIE_ModManager.modManager.reloadGame();
            }

            else if (key.key === 'F9'){
                MATTIE.suppressingAllErrors = true;
                document.removeEventListener('keydown', cb, false)
                Graphics.hideError();
                this.resume()
            }
            
        })
        document.addEventListener('keydown', cb, false);
        
    } catch (e2) {
        Graphics.printError('Error', e.message+"\nFUBAR");
    }
    }
    
}

MATTIE_ModManager.overrideErrorLoggers();