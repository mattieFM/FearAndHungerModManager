//TODO: make this less hacky in the future.
//TODO: add popup that appears if the user forgot to decompile the game before using the modmanager.

var MATTIE = MATTIE || {};
MATTIE.compat = MATTIE.compat || {};
MATTIE.compat.pauseDecrypt = false;
//override this so that when we request an image it will not try to decrypt it.
Bitmap.prototype._requestImage = function(url){
    if(Bitmap._reuseImages.length !== 0){
        this._image = Bitmap._reuseImages.pop();
    }else{
        this._image = new Image();
    }

    if (this._decodeAfterRequest && !this._loader) {
        this._loader = ResourceHandler.createLoader(url, this._requestImage.bind(this, url), this._onError.bind(this));
    }

    this._image = new Image();
    this._url = url;
    this._loadingState = 'requesting';

    if(!Decrypter.checkImgIgnore(url) && Decrypter.hasEncryptedImages && !MATTIE.compat.pauseDecrypt) {
        this._loadingState = 'decrypting';
        Decrypter.decryptImg(url, this);
    } else {
        this._image.src = url;

        this._image.addEventListener('load', this._loadListener = Bitmap.prototype._onLoad.bind(this));
        this._image.addEventListener('error', this._errorListener = this._loader || Bitmap.prototype._onError.bind(this));
    }
};


ImageManager.loadBitmap = function(folder, filename, hue, smooth, forceNoDecrypt = false) {
    //this is a hacky soltion but should work fine for now
    if(forceNoDecrypt) MATTIE.compat.pauseDecrypt = true;
    setTimeout(() => {
        MATTIE.compat.pauseDecrypt = false
    }, 1000);
    if (filename) {
        
        var path = folder + encodeURIComponent(filename) + '.png';

        var bitmap = this.loadNormalBitmap(path, hue || 0);
        bitmap.smooth = smooth;
        return bitmap;
    } else {
        return this.loadEmptyBitmap();
    }
};