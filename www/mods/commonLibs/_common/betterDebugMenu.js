//-------------------------------------------------
// Override Debug_Scene (to add more functionality)
//-----------------------------------------------

// Override create range window to setup ctrl+f as a search keybind
MATTIE_RPG.Scene_debug_createRangeWindow = Scene_Debug.prototype.createRangeWindow;
Scene_Debug.prototype.createRangeWindow = function () {
	const allNames = $dataSystem.switches;
	console.log(allNames);
	/**
     * @description search for a string/regex
     * @param {string} query the query string
     * @param {bool} goBack whehter to go forward or back when the same string was searched
     */
	const searchFor = function (query, goBack, that) {
		if (query) {
			if (query.length > 0) {
				if (query === that.lastSearch) {
					if (goBack) {
						that.timesRepeated--;
						if (that.timesRepeated < 0) that.timesRepeated = 0;
					} else {
						that.timesRepeated++;
					}
				} else {
					that.timesRepeated = 0;
				}
				console.log(`you searched for: ${query}`);
				let occurrence = 0;

				const dontUseRegex = query.startsWith('/');
				// eslint-disable-next-line no-inner-declarations
				function elementMatches(element) {
					element = element.toLowerCase();
					if (dontUseRegex) {
						return element.contains(query.slice(1));
					}
					return new RegExp(query).test(element);
				}
				const index = allNames.findIndex((element) => {
					if (elementMatches(element)) {
						occurrence++;
					}
					return occurrence >= that.timesRepeated + 1;
				});
				if (index === -1) {
					console.log('it was not found');
				} else {
					console.log(`it was found at: ${index}`);
					let editIndex = index % that._editWindow.maxRows() - 1;
					const rangeIndex = Math.floor(index / that._editWindow.maxRows()) - (editIndex == -1 ? 1 : 0);

					if (editIndex === -1) editIndex = that._editWindow.maxRows() - 1;
					that._rangeWindow.select(rangeIndex);
					that._editWindow.select(editIndex);
				}
				that.lastSearch = query;
			}
		}
	};

	Input.addKeyBind('control&f', () => {
		// check in right scene
		if (SceneManager._scene instanceof Scene_Debug) {
			// eslint-disable-next-line max-len
			let query = prompt('!!use lowercase!!\nEnter your search query \nUse the same query to find next matching element.\n start your query with / to disable regex.\nEnd your query with < to go back to the previous element\nor use keybinds "1" to go to next element and "2" to go to previous element', this.lastSearch || '').toLowerCase();
			const goBack = query.endsWith('<');
			if (goBack) { query = query.slice(0, query.length - 1); } // get rid of <

			searchFor(query, goBack, this);
		}
	}, 'debug ctrl+f (Dev)');

	Input.addKeyBind('1', () => {
		// check in right scene
		if (SceneManager._scene instanceof Scene_Debug) {
			searchFor(this.lastSearch, true, this);
		}
	}, 'debug ctrl+f back (Dev)');

	Input.addKeyBind('2', () => {
		// check in right scene
		if (SceneManager._scene instanceof Scene_Debug) {
			searchFor(this.lastSearch, false, this);
		}
	}, 'debug ctrl+f forward (Dev)');

	// Input.addKeyBind('b', () => {
	// 	searchFor(this.lastSearch, false, this);
	// });

	MATTIE_RPG.Scene_debug_createRangeWindow.call(this);
};
