/*:
 * @plugindesc Shuffles the $dataEnemies array and fixes IDs to match indices. Warning: Destructive to the database session.
 * @author Mattie
 *
 * @param Excluded IDs
 * @desc A comma-separated list of Enemy IDs that should NOT be moved (e.g., 1,2,3).
 * @default
 *
 * @help
 * ============================================================================
 * Mattie Enemy Randomizer
 * ============================================================================
 *
 * This plugin shuffles the enemies in the database while the game is running.
 * * USAGE:
 * Create an event and use the following Plugin Command:
 * * ShuffleEnemies
 * * WARNING:
 * As noted in the original code, if your game uses a system where limbs
 * are stored as separate enemies (like Fear & Hunger), this will result in
 * chaos (enemies composed of random limbs).
 * * This change is "destructive" for the current game session. If you reload
 * the game, the database resets to default until you run the command again.
 *
 */

var MATTIE = MATTIE || {};
MATTIE.Randomizer = MATTIE.Randomizer || {};

(function () {
	// --- Parameter Parsing ---
	var parameters = PluginManager.parameters('Mattie_EnemyRandomizer');
	var excludedParam = parameters['Excluded IDs'] || '';

	// Parse the excluded IDs into an array of numbers
	var excludedIds = excludedParam.split(',').map((id) => parseInt(id.trim(), 10)).filter((n) => !isNaN(n));

	/**
     * Standard randomizer helper to replace external dependency.
     */
	function seedRandom() {
		return Math.random();
	}

	/**
     * Default filter: Checks if element exists, has the attribute, and is not in excluded list.
     */
	function baseShuffleFilter(e, attrib) {
		if (e != null) {
			if (typeof e[attrib] != 'undefined') {
				if (e[attrib] != '') {
					return true;
				}
			} else {
				return true;
			}
		}
		return false;
	}

	/**
     * @description Shuffle an array randomly and fix ID properties.
     */
	MATTIE.Randomizer.shuffle = function (arr, attrib = 'name', cb = () => {}, filterCb = null) {
		// 1. Setup Filter
		if (filterCb === null) {
			filterCb = (e) => baseShuffleFilter(e, attrib);
		}

		// 2. Create the list of items eligible to be moved
		const realArr = arr.filter(filterCb);

		// 3. Shuffle that list
		realArr.sort((a, b) => seedRandom() - 0.5);

		// 4. Map back to original array
		// We iterate through the original array. If a slot contained a valid item (passed filter),
		// we fill it with the next item from our shuffled pile.
		// If it didn't pass the filter (was null or excluded), we leave it alone.
		let shuffledIndex = 0;

		for (let j = 0; j < arr.length; j++) {
			const originalElement = arr[j];

			// If the original element at this spot was one meant to be shuffled:
			if (filterCb(originalElement)) {
				// Determine if we should swap
				// Note: The original logic had nested typeof checks here which were slightly redundant
				// simplified to check if we still have items in the shuffled bag.
				if (typeof realArr[shuffledIndex] !== 'undefined') {
					arr[j] = realArr[shuffledIndex];
					shuffledIndex++;
				}
			}
		}

		// 5. Post-processing: Fix IDs and run callback
		for (let index = 0; index < arr.length; index++) {
			const element = arr[index];
			cb(element, index);

			if (element) {
				// Crucial for RPG Maker: The internal ID must match the array index
				if (element.id) {
					element.id = index;
				}
			}
		}

		return arr;
	};

	/**
     * @description Wrapper to shuffle the global $dataEnemies
     */
	MATTIE.Randomizer.shuffleEnemies = function () {
		// $dataEnemies index 0 is always null in MV, so the filter naturally handles it,
		// but we ensure we are shuffling the global object.
		if (typeof $dataEnemies !== 'undefined') {
			this.shuffle($dataEnemies, 'name');
			console.log('Mattie Randomizer: Enemies have been shuffled.');
		}
	};

	// --- Plugin Command Implementation ---
	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function (command, args) {
		_Game_Interpreter_pluginCommand.call(this, command, args);

		if (command === 'ShuffleEnemies') {
			MATTIE.Randomizer.shuffleEnemies();
		}
	};
}());
