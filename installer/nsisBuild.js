// eslint-disable-next-line import/no-unresolved
import * as NSIS from 'makensis';
import * as fs from 'fs';

async function main() {
	const options = {

	};

	try {
		const output = await NSIS.compile('./installer.nsi', options);
		fs.writeFileSync('./RPGModManagerInstall.exe');
		console.log('Compiler output:', output);
	} catch (error) {
		console.error(error);
	}
}
main();
