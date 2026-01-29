/**
 * @description Increments the version number in package.json on game start
 */
(function () {
	const fs = require('fs');
	const path = require('path');

	try {
		// Get the package.json path (go up from www/mods to root)
		const packagePath = path.join(process.cwd(), 'package.json');

		// Read the current package.json
		const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

		// Get current version number from name
		let currentVersion = parseInt(packageData.name) || 0;

		// Increment and loop at 100
		currentVersion = (currentVersion + 1) % 101;

		// Update the name
		packageData.name = currentVersion.toString();

		// Write back to package.json
		fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2), 'utf8');

		console.log(`[VersionIncrementer] Updated version to: ${currentVersion}`);
	} catch (error) {
		console.error('[VersionIncrementer] Failed to update version:', error);
	}
}());
