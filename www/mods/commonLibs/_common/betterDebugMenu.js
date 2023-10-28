//-------------------------------------------------
// Override Debug_Scene (to add more functionality)
//-----------------------------------------------
function setupSearcher() {
	let window;
	let allNames = this._itemList || this._data || this._list || this.itemsList || this._itemsList || [];
	if (this instanceof Scene_Debug) {
		window = this._windowLayer.children.find((element) => element instanceof Window_Selectable);
		allNames = $dataSystem.switches;
		console.log('here');
	} else if ((this instanceof Window_DebugEdit || this instanceof Window_DebugRange) && !(this instanceof MATTIE.windows.Window_DebugSpecific)) {
		window = SceneManager._scene;
		allNames = $dataSystem.switches;
	} else if (this instanceof Window_ItemCategory) {
		allNames = [TextManager.item, TextManager.weapon, TextManager.armor, TextManager.keyItem];
		window = this;
	} else if (this instanceof MATTIE.windows.Window_DebugSpecific) {
		allNames = allNames.map((id) => this.itemName(id));
		window = this;
	} else {
		window = this;

		if (!allNames || allNames.length <= 0) {
			if (window instanceof Window_SkillStatus) {
				allNames = $gameParty.members();
			} else if (window instanceof Window_MenuStatus) {
				allNames = $gameParty.members().map((actor) => actor.name());
			} else if (window instanceof Window_ItemList) {
				//
			}
		}
	}

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
					if (typeof element != 'string') {
						if (element.name) element = element.name;
						else if (element.id) element = element.id;
						else element = JSON.stringify(element);
					}
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

					try {
						let editIndex = index % window._editWindow.maxRows() - 1;
						const rangeIndex = Math.floor(index / window._editWindow.maxRows()) - (editIndex == -1 ? 1 : 0);
						if (editIndex === -1) editIndex = window._editWindow.maxRows() - 1;
						window._rangeWindow.select(rangeIndex);
						window._editWindow.select(editIndex);
					} catch (error) {
						console.log(error);
						try {
							window.select(index);
						} catch (err2) {
							console.log(err2);
						}
						//
					}
				}
				that.lastSearch = query;
			}
		}
	};

	Input.addKeyBind('control&f', () => {
		// check in right scene
		// eslint-disable-next-line max-len
		let query = prompt('!!use lowercase!!\nEnter your search query \nUse the same query to find next matching element.\n start your query with / to disable regex.\nEnd your query with < to go back to the previous element\nor use keybinds "1" to go to next element and "2" to go to previous element', this.lastSearch || '').toLowerCase();
		const goBack = query.endsWith('<');
		this.lastQuery = query;
		if (goBack) { query = query.slice(0, query.length - 1); } // get rid of <
		console.log(this);
		try {
			searchFor(query, goBack, this);
		} catch (error) {
			console.log(error);
		}
	}, 'ctrl+f', 4, 'control&f', 'control&f');

	Input.addKeyBind('', () => {
		// check in right scene
		try {
			searchFor(this.lastQuery, true, this);
		} catch (error) {
			console.log(error);
		}
	}, 'ctrl+f back', 4, '1', '1');

	Input.addKeyBind('', () => {
		// check in right scene
		try {
			searchFor(this.lastQuery, false, this);
		} catch (error) {
			console.log(error);
		}
	}, 'ctrl+f forward', 4, '2', '2');

	// Input.addKeyBind('b', () => {
	// 	searchFor(this.lastSearch, false, this);
	// });
}

// Override create range window to setup ctrl+f as a search keybind
MATTIE_RPG.Scene_debug_createRangeWindow = Scene_Debug.prototype.createRangeWindow;
Scene_Debug.prototype.createRangeWindow = function () {
	MATTIE_RPG.Scene_debug_createRangeWindow.call(this);
	setupSearcher.call(this);
};

// Override create range window to setup ctrl+f as a search keybind
MATTIE_RPG.Window_Selectable_select = Window_Selectable.prototype.select;
Window_Selectable.prototype.select = function (x, y, width, height) {
	MATTIE_RPG.Window_Selectable_select.call(this, x, y, width, height);
	setupSearcher.call(this);
};
