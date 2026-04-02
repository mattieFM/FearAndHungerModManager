/* eslint-disable no-unused-vars */
/**
 * @file _gameModuleLoader.js
 * @description Game Module System for the MATTIE Mod Engine.
 *
 * Provides a registration, selection, and application system that decouples
 * game-specific data (map IDs, actor IDs, switch arrays, etc.) from the
 * generic RPG Maker MV mod engine.
 *
 * A "game module" is a plain object that describes one specific game's data
 * and must implement the interface defined below. When loaded, it calls
 * MATTIE.static.registerGameModule(module) to register itself.
 *
 * The engine selects the correct module at runtime by calling each module's
 * versionMatch() function and applying the first match.
 *
 * @see MATTIE.static.registerGameModule
 * @see MATTIE.static._applyGameModule
 */

var MATTIE = MATTIE || {};
MATTIE.static = MATTIE.static || {};
MATTIE.compat = MATTIE.compat || {};

// ─────────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @description All registered game modules. Populated by calls to registerGameModule().
 * @type {Object[]}
 */
MATTIE.static._registeredModules = MATTIE.static._registeredModules || [];

/**
 * @description The currently active game module, set after selection and application.
 * @type {Object|null}
 */
MATTIE.static._activeModule = MATTIE.static._activeModule || null;

// ─────────────────────────────────────────────────────────────────────────────
// Registration
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @description Register a game module with the engine.
 * Each module must provide at minimum: id, name, versionMatch.
 *
 * Full interface contract:
 * {
 *   id: string,                          // e.g. "fearandhunger1"
 *   name: string,                        // e.g. "Fear & Hunger"
 *   versionMatch: function() -> boolean, // returns true when this game is running
 *
 *   actors: { mercenaryId, girlId, ... },
 *   maps:   { menuMaps, blockingMaps, charCreationMap, startMap, fortress, ... },
 *   teleports: [ { id, name, cmd, bool, btn }, ... ],
 *   switches: {
 *     ignored, synced, syncedSelfSwitches, ignoredSelfSwitches,
 *     characterLimbs, logical, hardMode, starvation,
 *     crowMaulerCanSpawn, crowMaulerDead, crowMaulerDisabled, ...
 *   },
 *   variables: { ignored, synced, secondarySynced, godAffinityAndPrayerVars, ... },
 *   states:    { knockout, resistDeath, armCut, legCut, bleeding, ... },
 *   troops:    { crowMauler, ... },
 *   items:     function($dataItems) -> { emptyScroll, silverCoin, icons },
 *   skills:    function($dataSkills) -> { hurting, ... },
 *   commonEvents: { smallFood, medFood, largeFood, lootTables, ... },
 *   events:    { images: { shiny, coin }, crowMauler },
 *
 *   multiplayer: {
 *     ghost:           { mapId, eventId, troopId, troopIndex },
 *     pvpActorTroopMap: { [actorId]: troopId },
 *     gameOverText:    { death, place, spectate, rebirth },
 *     spawnMap:        { mapId, x, y },
 *     charPortraitMap: { [actorId]: faceName },
 *   },
 *
 *   features:     { hasCrowMauler, hasLighting },
 *   compat:       { blockedMods, ignoredPlugins, menuIconMap },
 *   hooks:        { onStaticUpdate, onMultiplayerInit },
 *   dependencies: [],   // commonLib paths to load, e.g. "_common/betterCrowMauler"
 * }
 *
 * @param {Object} module - The game module to register
 */
MATTIE.static.registerGameModule = function (module) {
	if (!module || !module.id || !module.name || typeof module.versionMatch !== 'function') {
		console.error('[GameModule] Cannot register — missing required fields (id, name, versionMatch):', module);
		return;
	}
	// Avoid duplicate registration (e.g. if update() is called multiple times)
	const existing = this._registeredModules.findIndex((m) => m.id === module.id);
	if (existing !== -1) {
		this._registeredModules[existing] = module;
	} else {
		this._registeredModules.push(module);
	}
	console.log('[GameModule] Registered:', module.name);
};

// ─────────────────────────────────────────────────────────────────────────────
// Selection
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @description Find the first registered module whose versionMatch() returns true.
 * @returns {Object|null} The matching module, or null if none found.
 */
MATTIE.static._selectGameModule = function () {
	for (let i = 0; i < this._registeredModules.length; i++) {
		const module = this._registeredModules[i];
		try {
			if (module.versionMatch()) return module;
		} catch (e) {
			console.warn('[GameModule] versionMatch() threw for module:', module.name, e);
		}
	}
	return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Application
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @description Apply a game module's data into MATTIE.static.* namespaces.
 * Called automatically by MATTIE.static.update() when a module is selected.
 * @param {Object} module - The game module to apply.
 */
MATTIE.static._applyGameModule = function (module) {
	if (!module) return;

	this._activeModule = module;
	console.log('[GameModule] Applying:', module.name);

	// ── Actors ──────────────────────────────────────────────────────────────
	if (module.actors) {
		Object.assign(MATTIE.static.actors, module.actors);
	}

	// ── Maps ────────────────────────────────────────────────────────────────
	if (module.maps) {
		Object.keys(module.maps).forEach((key) => {
			const val = module.maps[key];
			if (val && typeof val === 'object' && !Array.isArray(val)) {
				// Deep merge nested map objects (e.g. maps.termina)
				MATTIE.static.maps[key] = Object.assign(MATTIE.static.maps[key] || {}, val);
			} else {
				MATTIE.static.maps[key] = val;
			}
		});
		// menuMaps may need rangeParser if provided as ranges
		if (module.maps.menuMaps) {
			MATTIE.static.maps.menuMaps = MATTIE.static.rangeParser(MATTIE.static.maps.menuMaps);
		}
	}

	// ── Teleports ───────────────────────────────────────────────────────────
	if (module.teleports !== undefined) {
		MATTIE.static.teleports = module.teleports;
	}

	// ── Switches ────────────────────────────────────────────────────────────
	if (module.switches) {
		const sw = module.switches;

		if (sw.ignored !== undefined) {
			MATTIE.static.switch.ignoredSwitches = MATTIE.static.rangeParser(sw.ignored);
		}
		if (sw.synced !== undefined) {
			MATTIE.static.switch.syncedSwitches = MATTIE.static.rangeParser(sw.synced);
		}
		if (sw.characterLimbs !== undefined) {
			MATTIE.static.switch.characterLimbs = MATTIE.static.rangeParser(sw.characterLimbs);
		}
		if (sw.logical !== undefined) {
			MATTIE.static.switch.logical = sw.logical;
		}
		if (sw.godAffinitySwitches !== undefined) {
			MATTIE.static.switch.godAffinitySwitches = MATTIE.static.rangeParser(sw.godAffinitySwitches);
		}
		// Self-switch arrays: game module provides raw arrays, we stringify them
		if (sw.syncedSelfSwitches !== undefined) {
			MATTIE.static.switch.syncedSelfSwitches = sw.syncedSelfSwitches.map((arr) => JSON.stringify(arr));
		}
		if (sw.ignoredSelfSwitches !== undefined) {
			MATTIE.static.switch.ignoredSelfSwitches = sw.ignoredSelfSwitches.map((arr) => JSON.stringify(arr));
		}
		// Named switch IDs (scalar values)
		const scalarKeys = ['crowMaulerCanSpawn', 'crowMaulerDead', 'crowMaulerDisabled',
			'hardMode', 'starvation', 'legardAliveSwitch'];
		scalarKeys.forEach((key) => {
			if (sw[key] !== undefined) MATTIE.static.switch[key] = sw[key];
		});
		// Any additional switch properties not in the known list
		const knownSwitchKeys = new Set(['ignored', 'synced', 'characterLimbs', 'logical',
			'godAffinitySwitches', 'syncedSelfSwitches', 'ignoredSelfSwitches',
			...scalarKeys]);
		Object.keys(sw).forEach((key) => {
			if (!knownSwitchKeys.has(key)) MATTIE.static.switch[key] = sw[key];
		});
	}

	// ── Variables ───────────────────────────────────────────────────────────
	if (module.variables) {
		const v = module.variables;

		if (v.ignored !== undefined) {
			MATTIE.static.variable.ignoredVars = MATTIE.static.rangeParser(v.ignored);
		}
		if (v.synced !== undefined) {
			MATTIE.static.variable.syncedVars = MATTIE.static.rangeParser(v.synced);
		}
		if (v.secondarySynced !== undefined) {
			MATTIE.static.variable.secondarySyncedVars = MATTIE.static.rangeParser(v.secondarySynced);
		}
		if (v.godAffinityAndPrayerVars !== undefined) {
			MATTIE.static.variable.godAffinityAndPrayerVars = MATTIE.static.rangeParser(v.godAffinityAndPrayerVars);
		}
		// Additional variable properties
		const knownVarKeys = new Set(['ignored', 'synced', 'secondarySynced', 'godAffinityAndPrayerVars']);
		Object.keys(v).forEach((key) => {
			if (!knownVarKeys.has(key)) MATTIE.static.variable[key] = v[key];
		});
	}

	// ── States ──────────────────────────────────────────────────────────────
	if (module.states) {
		Object.assign(MATTIE.static.states, module.states);
	}

	// ── Troops ──────────────────────────────────────────────────────────────
	if (module.troops) {
		Object.assign(MATTIE.static.troops, module.troops);
	}

	// ── Items (deferred — requires $dataItems to be loaded) ─────────────────
	if (typeof module.items === 'function') {
		try {
			const items = module.items();
			if (items) Object.assign(MATTIE.static.items, items);
		} catch (e) {
			console.warn('[GameModule] items() threw:', e);
		}
	}

	// ── Skills (deferred — requires $dataSkills) ─────────────────────────────
	if (typeof module.skills === 'function') {
		try {
			const skills = module.skills();
			if (skills) Object.assign(MATTIE.static.skills, skills);
		} catch (e) {
			console.warn('[GameModule] skills() threw:', e);
		}
	}

	// ── Common Events ────────────────────────────────────────────────────────
	if (module.commonEvents !== undefined) {
		const ce = (typeof module.commonEvents === 'function') ? module.commonEvents() : module.commonEvents;
		if (ce) Object.assign(MATTIE.static.commonEvents, ce);
	}

	// ── Events ──────────────────────────────────────────────────────────────
	if (module.events) {
		if (module.events.images) {
			Object.assign(MATTIE.static.events.images, module.events.images);
		}
		if (module.events.crowMauler !== undefined) {
			MATTIE.static.events.crowMauler = module.events.crowMauler;
		}
	}

	// ── Compatibility ────────────────────────────────────────────────────────
	if (module.compat) {
		if (module.compat.blockedMods !== undefined) {
			MATTIE.compat.blockedMods = module.compat.blockedMods;
		}
		if (module.compat.menuIconMap !== undefined) {
			MATTIE.compat.menuIconMap = module.compat.menuIconMap;
		}
		if (module.compat.ignoredPlugins !== undefined) {
			MATTIE.compat.moduleIgnoredPlugins = module.compat.ignoredPlugins;
		}
	}

	// ── God Affinity / Multiplayer Merge ─────────────────────────────────────
	// Same logic exists in both F&H1 and Termina branches — handled generically here.
	if (MATTIE.static.switch.godAffinitySwitches && MATTIE.static.switch.godAffinitySwitches.length > 0) {
		if (MATTIE.multiplayer && MATTIE.multiplayer.params) {
			if (MATTIE.multiplayer.params.sharedAffinity) {
				MATTIE.static.switch.syncedSwitches = MATTIE.static.switch.syncedSwitches.concat(MATTIE.static.switch.godAffinitySwitches);
				MATTIE.static.variable.syncedVars = MATTIE.static.variable.syncedVars.concat(MATTIE.static.variable.godAffinityAndPrayerVars);
			} else {
				MATTIE.static.switch.ignoredSwitches = MATTIE.static.switch.ignoredSwitches.concat(MATTIE.static.switch.godAffinitySwitches);
				MATTIE.static.variable.ignoredVars = MATTIE.static.variable.ignoredVars.concat(MATTIE.static.variable.godAffinityAndPrayerVars);
			}
		}
	}

	// ── onStaticUpdate Hook ───────────────────────────────────────────────────
	// Runs after all data is applied. Game modules use this to register teleport
	// functions, apply compatibility patches, etc.
	if (module.hooks && typeof module.hooks.onStaticUpdate === 'function') {
		try {
			module.hooks.onStaticUpdate();
		} catch (e) {
			console.error('[GameModule] hooks.onStaticUpdate threw:', e);
		}
	}
};
