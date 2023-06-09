/**
 * create a new horisontal btn menu
 * y pos, 
 * btns
 * width
 */
MATTIE.windows.horizontalBtns = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.windows.horizontalBtns.prototype = Object.create(Window_HorzCommand.prototype);
MATTIE.windows.horizontalBtns.prototype.constructor = MATTIE.windows.horizontalBtns;

MATTIE.windows.horizontalBtns.prototype.initialize = function(y,btns,width) {
        this._mattieBtns = btns;
        this._mattieMaxCols = width;
        Window_HorzCommand.prototype.initialize.call(this,0,0)
        this.updatePlacement(y);
        
};

MATTIE.windows.horizontalBtns.prototype.updatePlacement = function(y) {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = y;
};

MATTIE.windows.horizontalBtns.prototype.maxCols = function() {
    return this._mattieMaxCols;
};

/**
 * 
 * @param {dict} btns a key pair value {displayname:commandname} 
 */
MATTIE.windows.horizontalBtns.prototype.makeCommandList = function() {
    for(key in this._mattieBtns){
        console.log(key)
        this.addCommand(key, this._mattieBtns[key])
    }
};



/**
 * A window to display text
 * @extends Window_Base
 */
MATTIE.windows.textDisplay = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.windows.textDisplay.prototype = Object.create(Window_Base.prototype);
MATTIE.windows.textDisplay.prototype.constructor = MATTIE.windows.textDisplay;

MATTIE.windows.textDisplay.prototype.initialize = function(x,y,width,height,text) {
    Window_Base.prototype.initialize.call(this, x,y,width,height);
    this.mattieWidth = width;
    this.resetTextColor();
    this.changePaintOpacity(true);
    this.updateText(text);
    
    
};

/**
 * center this window then add the offsets
 * @param {*} xOffset how much to offset x by
 * @param {*} yOffset how much to offset y by
 */
MATTIE.windows.textDisplay.prototype.updatePlacement = function(xOffset=0,yOffset=0) {
    this.x = ((Graphics.boxWidth - this.width)) / 2+xOffset;
    this.y = ((Graphics.boxHeight - this.height)) / 2+yOffset;
};
MATTIE.windows.textDisplay.prototype.updateText = function(text) {
    this.contents.clear();
    if(typeof text === typeof []){
        let i = 0;
        text.forEach(element => {
            this.drawText(element,0,25*i,0)
            i++;
        });
    }else{
        this.drawText(text,0,0,0)
    }
};

MATTIE.windows.textDisplay.prototype.windowWidth = function() {
    return this.mattieWidth;
};



/**
 * A window to display text
 * @extends MATTIE.windows.textDisplay
 */
MATTIE.windows.textInput = function () {
    this.initialize.apply(this, arguments);
}

MATTIE.windows.textInput.prototype = Object.create(MATTIE.windows.textDisplay.prototype);
MATTIE.windows.textInput.prototype.constructor = MATTIE.windows.textInput;

MATTIE.windows.textInput.prototype.initialize = function(x,y,width,height,header) {
    this._text = "";
    this._header = header;
    MATTIE.windows.textDisplay.prototype.initialize.call(this, x,y,width,height,"");
    this.updatePlacement();
    this.initEventHandler();
    
    
};
MATTIE.windows.textInput.prototype.close = function(){
    MATTIE.windows.textDisplay.prototype.close.call(this);
    document.removeEventListener('keydown', this._listenFunc);
}
MATTIE.windows.textInput.prototype.initEventHandler = function() {
    let lastKey = ""
    this._listenFunc = (event) => {
        var key = event.key;
        //this is fucky but w/e its just a shitty menu so it shouldn't cause issues
        if(!key.startsWith("Arrow")) //no arrow key inputs
        if(key !== "Return")
        if(key !== "Enter")
        if(key !== "PageDown")
        if(key !== "PageUp")
        if(key !== "Shift")
        if(key === "Control"){
            lastKey = "Control"
        } 
        else if(key !== "Alt")
        if(key !== "Tab")
        switch (key) {
            case "Escape":
                this._text=""
                break;
            case "Backspace":
                this._text=this._text.slice(0,this._text.length-1)
                break;
            case "v":
                if(lastKey === "Control"){
                    let data;
                    if(Utils.isNwjs){
                        data = nwGui.Clipboard.get().get();
                    }else{
                        data = window.navigator.clipboard.readText()
                    }
                    this._text+=data
                    break;
                }
            default:
                this._text+=key
                break;
        }
        this.updateText()
      }
      
    document.addEventListener('keydown', this._listenFunc, false);
    
}

MATTIE.windows.textInput.prototype.getInput = function(){
    return this._text;
}
MATTIE.windows.textInput.prototype.updateText = function(text=this._text) {
    this.contents.clear();
    let i = 0;
    this.drawText(this._header,0,25*i,0)
    i++;
    if(typeof text === typeof []){
        text.forEach(element => {
            this.drawText(element,0,25*i,0)
            i++;
        });
    }else{
        this.drawText(text,0,25*i,0)
    }
};

