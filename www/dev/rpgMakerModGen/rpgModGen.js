/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable prefer-const */
// eslint-disable-next-line import/no-extraneous-dependencies

// eslint-disable-next-line import/no-extraneous-dependencies
// const { dialog } = require('electron');
const fs = require('fs');
const { promisify } = require('util');
const { resolve } = require('path');

let pathToOriginalFiles = 'E:/FearAndHunger/builds/Fear & Hunger/www/';
let pathToModdedFiles = 'E:/FearAndHunger/builds/FHDevBuild/www/';
let ModName = 'testMod';

const defaultOutFolder = (`./build/${ModName}`);

console.log(defaultOutFolder);

const requiredFolders = [
	'data',
];

const validateFolder = function (path) {
	let valid = true;
	const filesInFolder = fs.readdirSync(path);
	requiredFolders.forEach((folder) => {
		if (!filesInFolder.includes(folder)) valid = false;
	});
	return valid;
};

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function getFiles(dir) {
	const subdirs = await readdir(dir);
	const files = await Promise.all(subdirs.map(async (subdir) => {
		const res = resolve(dir, subdir);
		return (await stat(res)).isDirectory() ? getFiles(res) : res;
	}));
	return files.reduce((a, f) => a.concat(f), []);
}

const checkValidFolders = function () {
	const moddedValid = validateFolder(pathToModdedFiles);
	const orgValid = validateFolder(pathToOriginalFiles);
	return (moddedValid && orgValid);
};

/**
 * @description find all differences between 2 objects, if one exists return the value of 1
 * @param {*} obj1
 * @param {*} obj2
 * @returns
 */
async function differenceObj(obj1, obj2) {
	let obj = {};
	let keys1 = [];
	try {
		keys1 = Object.keys(obj1);
	} catch (error) {
		//
	}

	if (obj1) {
		if (obj1.id) {
			obj.id = obj1.id;
		}
	}

	for (let index = 0; index < keys1.length; index++) {
		let key1 = keys1[index];
		const member1 = obj1[key1];
		const member2 = obj2[key1];

		if (typeof member2 != 'undefined') {
			if (JSON.stringify(member1) != JSON.stringify(member2)) {
				if (typeof member1 == 'object' && !!member2) {
					obj[key1] = await differenceObj(member1, member2);
				} else {
					obj[key1] = member1;
				}
			}
		} else {
			obj[key1] = member1;
		}
	}

	// // convert to array if keys are all numbers
	// keys1 = Object.keys(obj);
	// if (keys1.length > 0 && keys1.every((key) => !isNaN(parseInt(key, 10)))) {
	// 	let tmpObj = obj;
	// 	obj = [];
	// 	let tmpKeys = Object.keys(tmpObj);
	// 	tmpKeys.forEach((key) => {
	// 		obj[parseInt(key, 10)] = tmpObj[key];
	// 	});
	// 	const result = [];
	// 	console.log(obj.length);
	// 	for (let i = 0; i < obj.length; ++i) {
	// 		if (!(i in obj)) result.push('MGS_UN_DEF'); // fill empty spots with string "undefined"
	// 		else result.push(obj[i]);
	// 	}
	// 	obj = result;
	// }

	// if (typeof obj === 'object' && obj != null) { if (Object.keys(obj).length < 1) obj = 'MGS_UN_DEF'; }
	return obj;
}

async function compareFile(moddedFilePath, orgFilePath) {
	let isObject = false;
	let returnVal;
	let moddedLines;
	let orgLines;
	if (!moddedFilePath.includes('.DS_Store')) {
		if (moddedFilePath.includes('.json')) {
		// if the file is a json
			moddedLines = require(moddedFilePath);
			orgLines = require(orgFilePath);
			isObject = true;
		} else {
			// if not split by actual lines
			const moddedFile = fs.readFileSync(moddedFilePath, { encoding: 'utf8', flag: 'r' });
			const orgFile = fs.readFileSync(orgFilePath, { encoding: 'utf8', flag: 'r' });
			moddedLines = moddedFile.split('\n');
			orgLines = orgFile.split('\n');
		}
	}
	if (moddedFilePath.includes('actor')) {
		console.log('here');
	}

	returnVal = await differenceObj(moddedLines, orgLines);

	return returnVal;
}

async function getEnabledFiles(path) {
	let allFiles = [];
	for await (const folder of requiredFolders) {
		console.log(`${path}${folder}/`);
		const files = await getFiles(`${path}${folder}/`);
		allFiles = allFiles.concat(files);
	}

	return allFiles;
}

async function writeDifferences(data, fileName) {
	console.log(`WritingTo:${fs.realpathSync(defaultOutFolder)}\\${fileName}`);
	const path = `${fs.realpathSync(defaultOutFolder)}\\${fileName}`;

	if (Object.keys(data).length > 0 && data != 'MGS_UN_DEF') {
		fs.writeFileSync(path, JSON.stringify(data));
	}
}

async function compareFolders(moddedFolder, orgFolder) {
	const moddedContent = await getEnabledFiles(moddedFolder);
	const orgContent = await getEnabledFiles(orgFolder);
	const filesWithoutConflict = [];
	moddedContent.forEach(async (moddedPath) => {
		const modNameSplit = moddedPath.split('\\');
		const modFileName = modNameSplit[modNameSplit.length - 1];

		const orgPath = orgContent.find((path) => {
			const orgNameSplit = path.split('\\');
			const orgFileName = orgNameSplit[orgNameSplit.length - 1];
			return (orgFileName == modFileName);
		});

		if (orgContent.includes(orgPath)) {
			// compare file
			const difLines = await compareFile(moddedPath, orgPath);
			writeDifferences(difLines, modFileName);
			// console.log(difLines);
		} else {
			filesWithoutConflict.push(moddedPath);
			writeDifferences(fs.readFileSync(moddedPath), modFileName);
			// nothing to compare --no conflict
		}
	});
}

function replaceData(obj1, obj2) {
	const keys = Object.keys(obj1);
	for (let index = 0; index < keys.length; index++) {
		const key = keys[index];
		const element = obj1[key];

		if (element.id) {
			const keys2 = Object.keys(obj2);
			for (let x = 0; x < keys2.length; x++) {
				const key2 = keys2[x];
				const element2 = obj2[key2];
				// if element has id
				if (element2.id === element.id) {
					obj2[key] = element;
				} else if (typeof element === 'object') {
					this.replaceData(element, element2);
				}
			}
		} else {
			obj2[key] = element;
		}
	}
}

async function run() {
	if (checkValidFolders()) {
		console.log('folders are valid');
		await compareFolders(pathToModdedFiles, pathToOriginalFiles);
	}
}
async function getModSource() {
	pathToModdedFiles = `${(await dialog.showOpenDialog({ properties: ['openDirectory'], title: 'Select the "www/" folder of your mode' })).filePaths[0]}/`;
	return pathToModdedFiles;
}

async function getOrgSource() {
	// eslint-disable-next-line max-len
	pathToOriginalFiles = `${(await dialog.showOpenDialog({ properties: ['openDirectory'], title: 'Select the "www/" the unmodded base game' })).filePaths[0]}/`;
	return pathToOriginalFiles;
}

exports.getOrgSource = getOrgSource;
exports.getModSource = getModSource;
exports.compile = run;

run().then(() => {
	let fileName = 'Map001.json';

	const sourceObj = require(`${pathToModdedFiles}data/${fileName}`);
	// eslint-disable-next-line import/no-dynamic-require
	const targetObj = require(`${pathToOriginalFiles}data/${fileName}`);

	replaceData(sourceObj, targetObj);

	fs.writeFileSync(`${pathToOriginalFiles}data/${fileName}`, JSON.stringify(targetObj));
});
