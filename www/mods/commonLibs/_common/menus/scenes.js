MATTIE.menus = MATTIE.menus || {};
MATTIE.windows = MATTIE.windows || {};
MATTIE.scenes = MATTIE.scenes || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};
MATTIE.modLoader = MATTIE.modLoader || {};


MATTIE.TextManager.decryptBtn="Decrypt"
MATTIE.CmdManager.decryptBtn="CMD_Decrypt"
MATTIE.TextManager.encryptBtn = "Encrypt"
MATTIE.CmdManager.encryptBtn = "CMD_Encrypt"
MATTIE.TextManager.deleteEncryptedFiles = "Delete ENcrypted Files"
MATTIE.CmdManager.deleteEncryptedFiles = "CMD_DeleteEncrypted"
MATTIE.TextManager.deleteDecryptedFiles = "Delete DEcrypted Files"
MATTIE.CmdManager.deleteDecryptedFiles = "CMD_DeleteDecrypted"

/**
 * @class
 * @description the base menu page with the manager logo
 * */
MATTIE.scenes.base = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.scenes.base.prototype = Object.create(Scene_Base.prototype);
MATTIE.scenes.base.prototype.constructor = MATTIE.scenes.base;

MATTIE.scenes.base.prototype.create = function () {
	Scene_Base.prototype.create.call(this);
	this.createBackground();
};

/**
 * @override the create background function to have the modmanager background logo
 */
MATTIE.scenes.base.prototype.createBackground = function () {
	this._backSprite2 = new Sprite(ImageManager.loadBitmap('mods/commonLibs/_common/images/', 'FearAndHungerModMan', 0, true, true));
	this.addChild(this._backSprite2);
};

//-----------------------------------
// Mod loader Scene 
//-----------------------------------

/**
 * @class the main scene for the mod list page or the modloader itself depending on how you view it.
 */
MATTIE.scenes.modLoader = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.scenes.modLoader.prototype = Object.create(MATTIE.scenes.base.prototype);
MATTIE.scenes.modLoader.prototype.constructor = MATTIE.scenes.modLoader;

/**
 * @override we add the mods list window here.
 */
MATTIE.scenes.modLoader.prototype.create = function () {
	MATTIE.scenes.base.prototype.create.call(this)
	console.log("modloader create")
	this.addModsListWindow()
}

/**
 * a method that adds the mods list window to the page
 */
MATTIE.scenes.modLoader.prototype.addModsListWindow = function () {
	this._modListWin = new MATTIE.windows.ModListWin(0, 0);
	this.addChild(this._modListWin);
};

//-----------------------------------
// Decrypter Scene 
//-----------------------------------

MATTIE.scenes.decrypter = function () {
	this.initialize.apply(this, arguments);
	this.text3="test"
	this.encryptedCount=0
	this.totalCount=0
};

MATTIE.scenes.decrypter.prototype = Object.create(MATTIE.scenes.base.prototype);
MATTIE.scenes.decrypter.prototype.constructor = MATTIE.scenes.decrypter;

/**
 * @override we add the mods list window here.
 */
MATTIE.scenes.decrypter.prototype.create = function () {
	MATTIE.scenes.base.prototype.create.call(this)
	this.createWindowLayer();
	this.addWins()
	this.setupHandlers()
	
}

/**add all wins for this scene */
MATTIE.scenes.decrypter.prototype.addWins = function(){
	this.addDecryptBtn()
	this.addTextWindow()
}

function findFilesInDir(directory) {
	const fs = require('fs');
	const path = require('path');
	let results = [];

	// Read all items in the current directory
	const items = fs.readdirSync(directory);

	items.forEach(item => {
		const fullPath = path.join(directory, item);
		const stat = fs.statSync(fullPath);

		// If it's a directory, recurse into it
		if (stat.isDirectory()) {
			results = results.concat(findFilesInDir(fullPath));
		} else {
			// Otherwise, it's a file, add it to the results
			results.push(fullPath);
		}
	});

	return results;
}

MATTIE.scenes.decrypter.prototype.count = function(){
	files=findFilesInDir(`${MATTIE.DataManager.localGamePath()}/img/`)
	numberOfRPGMVPFiles=files.filter(name=>name.includes("rpgmvp")).length
	this.encryptedCount = numberOfRPGMVPFiles
	this.totalCount = files.length
	this.updateText()
}

MATTIE.scenes.decrypter.prototype.updateText = function(){
	const text2 = [
		`RPGMaker Status: ${Decrypter.hasEncryptedImages?"Encrypted":"Decrypted"}`,
		`Files Status: ${this.encryptedCount}/${this.totalCount} Encrypted`,
	];
	this._decryptStatusWin.updateText(text2);
}

/**add the window that shows information and text for this scene */
MATTIE.scenes.decrypter.prototype.addTextWindow = function () {
	const text = [
		'This page handles decryption and encryption. Do not use anything',
		'here unless you need to, decryption is UNECCECARY now. no files',
		'are deleted via encrypt/decrypt in this process as such an',
		'decrypted game will have a .rpgmvp and a .png file for each image.',
		'RPGMaker status determines which file will be used when playing',
		'the game. You may toggle between these files by clicking encrypt',
		'and decrypt. For most people it is not necessary to ever toggle',
		'between the two but for overhaul mods that use encrypted files',
		'this feature could be useful.',
		'the delete buttons are largely not needed to be used ever. for',
		'more info you can click one to read its confirmation prompt just',
		'be sure to click cancel and not okay lest you delete things.'
	];
	this._textDisplayWin = new MATTIE.windows.TextDisplay(0,0,800,350, text);
	this._textDisplayWin.updatePlacement()
	this.addWindow(this._textDisplayWin);

	
	this._decryptStatusWin = new MATTIE.windows.TextDisplay(0,0,450,100, "");
	this._decryptStatusWin.updatePlacement(75,-250)
	this.addWindow(this._decryptStatusWin);
	this.count()

	// Create the tooltip window
    this._tooltipWindow = new MATTIE.windows.Window_Tooltip(225,35,[
		`RPGMaker Status indicates wether.`,
		`.rpgmvp or .png files will be preferred`,
		`files status is the number of`,
		`files in your copy of the game.`,
		`By default we do not delete encrypted`,
		`files if your game is decrypted it will be`,
		`roughly half of the files being encrypted.`
	],500,undefined,300);
    this.addWindow(this._tooltipWindow);

}


/**
 * a method that adds the decrypt btn to the page
 */
MATTIE.scenes.decrypter.prototype.addDecryptBtn = function () {
	const btns = {};
	btns[MATTIE.TextManager.decryptBtn] = MATTIE.CmdManager.decryptBtn;
	btns[MATTIE.TextManager.encryptBtn] = MATTIE.CmdManager.encryptBtn;
	btns[MATTIE.TextManager.deleteEncryptedFiles] = MATTIE.CmdManager.deleteEncryptedFiles;
	btns[MATTIE.TextManager.deleteDecryptedFiles] = MATTIE.CmdManager.deleteDecryptedFiles;
	this._decryptBtn = new MATTIE.windows.HorizontalBtns(175 + 300 + 10, btns, 4);
	this._decryptBtn.updateWidth(600);
	this._decryptBtn.updatePlacement(175 + 300 + 10);
	this.addWindow(this._decryptBtn)
};



/**
 * setup all handlers for this scene
 */
MATTIE.scenes.decrypter.prototype.setupHandlers = function() {
	this._decryptBtn.setHandler(MATTIE.CmdManager.decryptBtn, (async () => {
		const fs = require("fs")
		
		if(
			confirm("This will freeze the game until it is finished. The first time this is run it will take 5-10 min for slower computers, it will not take much time to toggle between encrypted/decrypted files once the bulk of the work is done.\n This will create a decrypt all files, leaving the original files intact, simply creating a decrypted copy, as such you will have .rpgmvp files and .png files for every image.\n Additionally this will set system.json's field 'hasEncryptedImages' to false.\nIMPORTANT:this can cause the game to crash sometimes depending on how much memory your computer has, should it crash you may restart the game and click the button again, it will pickup where it left off.")
		){
			img_files=findFilesInDir(`${MATTIE.DataManager.localGamePath()}/img/`).filter(path=>path.includes(".rpgmvp"))
			prev = MATTIE.compat.runtime_decrypt
			MATTIE.compat.runtime_decrypt=true

			for (let index = 0; index < img_files.length; index++) {
				const img = img_files[index];
				if(!fs.existsSync(img.replace(".rpgmvp",".png"))){
					await new Promise(res=>{
						bitmap=Bitmap.load(img.split("www")[1])
						const that = this
						bitmap.addLoadListener(function() {
							that.totalCount++
							that.updateText()
							res()
						});
					})
					
				}
			}
			
				
		

			MATTIE.compat.setEncryptedImagesInSystemJson(false)
		
			MATTIE.compat.runtime_decrypt=prev
		}
		
		//call activate so we dont get locked out
		this.count()
		this._decryptBtn.activate();
	}));
	
	this._decryptBtn.setHandler(MATTIE.CmdManager.encryptBtn, (() => {
		console.log("hiya")
		//call activate so we dont get locked out
		MATTIE.compat.setEncryptedImagesInSystemJson(true)
		this.count()
		this._decryptBtn.activate();
	}));

	this._decryptBtn.setHandler(MATTIE.CmdManager.deleteEncryptedFiles, (async () => {
		const fs = require("fs")
		if(confirm("This button will delete all encrypted files that have a matching .png file of the same name. This is largely uneccecary to ever do. The only main reason to do this is to save some disk space. But its not much that you would save.")){
			img_files=findFilesInDir(`${MATTIE.DataManager.localGamePath()}/img/`).filter(path=>path.includes(".rpgmvp"))

			for (let index = 0; index < img_files.length; index++) {
				const img = img_files[index];
				if(fs.existsSync(img.replace(".rpgmvp",".png"))){
					console.log(`deleting:${img}`)
					await new Promise(res=>{
						fs.unlink(img, (err) => {
						this.totalCount--
						this.encryptedCount--
						this.updateText()
						res()
					})})

				}
			}
		}
		this.count()
		this._decryptBtn.activate();
	}));

	this._decryptBtn.setHandler(MATTIE.CmdManager.deleteDecryptedFiles, (async () => {
		const fs = require("fs")
		if(confirm("This button will delete all decrypted (.png) files that have a matching .rpgmvp file of the same name. This is largely uneccecary to ever do. The only main reason to do this is to save some disk space. But its not much that you would save.")){
			img_files=findFilesInDir(`${MATTIE.DataManager.localGamePath()}/img/`).filter(path=>path.includes(".png"))
			console.log(img_files)
			for (let index = 0; index < img_files.length; index++) {
				const img = img_files[index];
				if(fs.existsSync(img.replace(".png",".rpgmvp"))){
					console.log(`deleting:${img}`)
					await new Promise(res=>{
						fs.unlink(img, (err) => {
						this.totalCount--
						this.updateText()
						res()
					})})
				}
			}
		}
		MATTIE.compat.setEncryptedImagesInSystemJson(true)
		this.count()
		this._decryptBtn.activate();
	}));

	this._decryptBtn.setHandler('cancel', this.popScene.bind(this));
}






//-----------------------------------
// Window Item List Overrides @override
//-----------------------------------
// forces all items to be enabled for menu use
Window_ItemList.prototype.forceEnableAll = function () {
	this.forceEnable = true;
};

Window_ItemList.prototype.isCurrentItemEnabled = function () {
	return this.forceEnable || this.isEnabled(this.item());
};

Window_ItemList.prototype.isEnabled = function (item) {
	return this.forceEnable || $gameParty.canUse(item);
};
