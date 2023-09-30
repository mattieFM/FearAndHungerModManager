/* eslint-disable import/no-extraneous-dependencies */
const { contextBridge, ipcRenderer } = require('electron');

document.getElementById('loadMod').addEventListener('click', () => {
	ipcRenderer.send('loadMod');
});

document.getElementById('loadGame').addEventListener('click', () => {
	ipcRenderer.send('loadGame');
});

document.getElementById('compile').addEventListener('click', () => {
	ipcRenderer.send('compile');
});

ipcRenderer.on('loadedMod', (msg, content) => {
	document.getElementById('modRen').value = content;
});

ipcRenderer.on('loadedGame', (msg, content) => {
	document.getElementById('gameRen').value = content;
});

ipcRenderer.on('compiled', (msg, content) => {
	alert('complied');
});
