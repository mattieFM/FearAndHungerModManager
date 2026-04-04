# Knowledge Transfer Document: FearAndHungerModManager Architectural Refactor

**Target Audience:** Autonomous coding agent (Claude Code) executing a decoupling refactor  
**Objective:** Decouple generic RPG Maker MV mod-loading and multiplayer engine logic from Fear & Hunger 1 & 2 game-specific logic  
**Repository:** `mattieFM/FearAndHungerModManager` (v1.2.3)  
**Date Generated:** 2026-03-31

---

## 1. Architectural Pipeline & Boot Sequence

### 1.1 NW.js Entry Point

The application runs inside NW.js. The root `package.json` defines:

```json
{
  "name": "62",
  "main": "www/index.html",
  "js-flags": "--expose-gc",
  "node-remote": true
}
```

- The `name` field is **not a real name** — it's a version counter (0–100) incremented every launch by `versionIncrementer.js`. This is used to bust NW.js caches.
- `node-remote: true` enables Node.js `require()` from all pages (critical — the mod loader uses `fs`, `path`, `net`, `events` directly).

### 1.2 Script Loading Order (www/index.html)

The custom `index.html` intercepts the standard RPG Maker MV boot by inserting mod system scripts between RPG Maker core and `main.js`:

```
Phase 1: RPG Maker MV Core (standard, unmodified)
├── libs/pixi.js
├── libs/fpsmeter.js
├── libs/lz-string.js
├── js/rpg_core.js
├── js/rpg_managers.js
├── js/rpg_objects.js
├── js/rpg_scenes.js
├── js/rpg_sprites.js
├── js/rpg_windows.js
├── js/plugins.js

Phase 2: Mod System Injection (3 scripts)
├── mods/commonLibs/_common/consoleLogger.js     ← Console logging setup
├── mods/commonLibs/_common/dataManager.js        ← File system API + version detection
├── mods/mattieFMModLoader.js                     ← Core mod loader (1507 lines)

Phase 3: RPG Maker Main (standard)
└── js/main.js                                    ← Creates Scene_Boot
```

**Critical insight:** The mod loader must execute *after* RPG Maker globals (`PluginManager`, `DataManager`, `SceneManager`) exist, but *before* `main.js` triggers `Scene_Boot`. The mod loader overrides `Scene_Boot` to inject its own initialization.

### 1.3 Mod Loader Initialization Sequence

Entry point at bottom of `mattieFMModLoader.js`:

```javascript
MATTIE_ModManager.overrideErrorLoggers();  // Silences RPG Maker error handlers
setTimeout(() => {
    MATTIE_ModManager.init();
}, 1000);  // 1-second delay for all scripts to be parsed
```

`MATTIE_ModManager.init()` executes the following pipeline:

| Step | Action | Key Function |
|------|--------|-------------|
| 1 | Read mod loader config | `this.setupConfig()` |
| 2 | Wait for RPG Maker database | `DataManager.waitTillDatabaseLoaded()` |
| 3 | Initialize standard plugins | `PluginManager.setup($plugins)` |
| 4 | Initialize MATTIE data manager | `MATTIE.DataManager.onLoad()` |
| 5 | Load `commonLibs/` (Phase 1) | `new ModManager(commonLibsPath)` → `parseMods()` → `setup()` |
| 6 | Update static game data | `MATTIE.static.update()` |
| 7 | Load user mods (Phase 2) | `new ModManager(modsPath)` → `parseMods()` → `setup()` |
| 8 | Transition to title | `SceneManager.goto(Scene_Title)` |

### 1.4 File Requirements: .js + .json Config Pairing

Every mod consists of two files:

- **`modName.js`** — The executable script
- **`modName.json`** — Configuration manifest:

```json
{
  "name": "modName",
  "status": true,           // Enabled by default
  "description": "...",
  "parameters": {},          // Mod-specific parameters
  "danger": false,           // If true → saves go to moddedSaves/
  "dependencies": [          // Loaded-before requirements
    "_common/someLib"
  ]
}
```

### 1.5 The Role of `_` Prefix and `commonLibs/`

**Loading priority (strict order):**

1. **`mods/commonLibs/`** → Loaded first. Contains `_common.js` + `_common.json` which declares 48 sub-dependencies in `_common/` directory.
2. **`mods/_*.js`** (prefixed mods) → Loaded second. These are library/framework mods (multiplayer, rougeLike, trepidationAndFamine).
3. **`mods/*.js`** (unprefixed mods) → Loaded last. These are user-facing feature mods.

Within each phase, `parseMods()` reads all `.json` files from the directory, constructs `Mod` objects, and `setup()` loads scripts via `Promise.all()` (parallel loading).

### 1.6 Precompiler System

**File:** `commonLibs/_common/precompiler.js` (258 lines)

Hooks into `DataManager.onLoad()` to pre-process all RPG Maker event commands at map/database load time:

| Event Code | RPG Maker Name | Precompiler Action |
|-----------|----------------|-------------------|
| 355 + 655 | Script + Continuation | Concatenates multi-line scripts → compiles to `eval()` function stored in `command.script` |
| 111, 402, 403, 411, 601–603 | Conditional Branch / Else / Battle outcomes | Pre-calculates `jumpToIndex` (target instruction index after the block) |
| 113 | Break Loop | Pre-calculates jump to loop end (code 413) |
| 108 + 408 | Comment + Continuation | Pre-calculates `jumpToIndex` to skip comment blocks |

**Runtime override:** `Game_Interpreter.prototype.skipBranch` checks `currentCommand().jumpToIndex` first; falls back to manual indent-walking only if not precompiled. Same pattern for `command108` (comments) and `command113` (break loop).

**Impact on refactoring:** The precompiler is **100% generic RPG Maker MV logic** — no game-specific code. Safe to move to engine core.

### 1.7 Multiplayer Networking Architecture

**Transport Layer:**
- **Primary:** PeerJS (WebRTC DataChannel) — peer-to-peer via `peerjs.min.js`
- **Fallback:** Node.js TCP sockets (`nodeTcpTransport.js`) — auto-port allocation starting at 6878, JSON+newline message framing

**Architecture:** Hub-and-spoke, host-authoritative:
- `HostController` accepts connections, maintains `connections[]` and `netPlayers{}`, broadcasts to all clients
- `ClientController` maintains single `conn` to host with retry logic (5 retries, 2s delay, 5s timeout)

**Priority Queue (`priorityQueue.js`):**
- Linear insertion O(n), O(1) dequeue (shift from front)
- Stored globally at `MATTIE.multiplayer.netQueue`
- Priority values: 1 (low — periodic syncs) to 1021 (high — transfer/player info)

**Rate Limiting:**
- Configurable `maxPacketsPerSecond` (default: 50)
- Counter resets every 1000ms
- Send interval: `1000 / maxPacketsPerSecond` ms (~20ms for 50pps)
- If limit exceeded, packets queue; critical packets bypass queue if `priority > 1` or queue < 100 items

**Critical Packet Reliability:**
- 15 packet types flagged as "critical" (combat, events, transfers, marriage, equipment)
- Critical packets sent 5× with staggered delays: 0ms, 150ms, 300ms, 600ms, 1200ms
- Extra retry if `packetLoss > 0.2`
- Deduplication via `uid` (9-char random string) with 60-second TTL cache

**30+ Message Types with Priorities:**

| Message | Priority | Critical | Notes |
|---------|----------|----------|-------|
| `move` | 10 | No | Includes sequence numbers for ordering |
| `syncedVars` / `syncedSwitches` | 1 | No | Periodic bulk sync |
| `transfer` | 1021 | Yes | Map transfers |
| `battleStart` / `battleEnd` | 1 | Yes | Combat lifecycle |
| `ctrlSwitch` / `cmd` / `event` | 1 | Yes | Event synchronization |
| `equipChange` / `spawnEvent` | 1000 | Yes | State mutations |
| `updateNetPlayers` | 1002 | No | Client-only, from host |
| `startGame` | 1001 | Yes | Client-only |
| `enemyActions` | Default | Yes | Host-authoritative AI |

**Network Simulation (for testing):**
```javascript
MATTIE.multiplayer.simulation = {
    latency: 900,       // ms delay
    jitter: 400,        // ms variance  
    packetLoss: 0.2,    // 0.0–1.0
    enabled: false
};
```

---

## 2. The Coupling Matrix: Engine vs. Game Logic

### 2.1 Generic RPG Maker MV / Mod Loader Core

These files contain **zero** Fear & Hunger-specific logic and are safe to extract as-is:

#### Core Mod Loading Engine
| File | Lines | Purpose |
|------|-------|---------|
| `www/index.html` | 43 | Boot interceptor — script loading order |
| `www/mods/mattieFMModLoader.js` | 1507 | `ModManager` class, `Mod` class, `Asset` class, `PluginManager.setup()` override, mod parsing, dependency resolution, enable/disable, danger system |
| `www/mods/commonLibs/_common.js` | ~50 | Namespace initialization (`MATTIE.*`), `Input.addKeyBind()`, `MATTIE.GameInfo` utilities |
| `www/mods/commonLibs/_common.json` | 51 | Dependency manifest |

#### File System & Data Persistence
| File | Lines | Purpose |
|------|-------|---------|
| `commonLibs/_common/dataManager.js` | 344 | `MATTIE.DataManager` — fs operations, `modDataGlobal.json` read/write, save data loading/saving. **EXCEPT** lines 16–72 (version detection, `isTermina()`/`isFunger()` checks, `ignoredPlugins`) |
| `commonLibs/_common/saveProtector.js` | ~40 | `StorageManager.localFileDirectoryPath()` override — routes saves to `save/` or `moddedSaves/` based on danger level |

#### Performance & Optimization
| File | Lines | Purpose |
|------|-------|---------|
| `commonLibs/_common/precompiler.js` | 258 | Event command precompilation (jump indices, script compilation) |
| `commonLibs/_common/optimisations.js` | ~150 | `forEach` → `for` loop replacements, `loadGlobalInfo` caching (500ms), save backup/restore |

#### Compatibility Layer (mostly generic)
| File | Lines | Purpose |
|------|-------|---------|
| `commonLibs/_common/compatibility.js` | 404 | Image decryption (`compatabilityLoad`, `decryptAndSave`), `hasEncryptedImages` management, Graphics render fix, Window property fixes, party item safety checks. **EXCEPT** lines 350–403 (Termina menu icon compat, `terminaBlockedMods`) |

#### UI Framework (generic windowing)
| File | Lines | Purpose |
|------|-------|---------|
| `commonLibs/_common/menus/windows.js` | 28377 bytes | Window classes: `TooltipIcon`, mod list windows, text input windows, scrollable windows, command windows |
| `commonLibs/_common/menus/scenes.js` | 11150 bytes | `MATTIE.scenes.base`, `MATTIE.scenes.modLoader`, `MATTIE.scenes.decrypter` — decryption tab UI |
| `commonLibs/_common/menus/mainMenu.js` | 5399 bytes | Title screen mod menu injection |
| `commonLibs/_common/menus/menu.js` | 1267 bytes | Menu base utilities |

#### Generic APIs (engine-level)
| File | Purpose | Game-Specific? |
|------|---------|---------------|
| `API_CORE/eventAPI.js` | Event creation, manipulation, lifecycle | No |
| `API_CORE/eventWrapper.js` | Event object wrapper class | No |
| `API_CORE/eventHooks.js` | Map event setup hooks | No |
| `API_CORE/itemAPI.js` | Item manipulation and queries | No |
| `API_CORE/vfxAPI.js` | Visual effects API | No |
| `API_CORE/msgAPI.js` | Message/notification display | No |
| `API_CORE/inputAPI.js` | Input detection utilities | No |
| `API_CORE/imageAPI.js` | Image loading/saving utilities | No |
| `API_CORE/preFabAPI.js` | Prefab event creation | No |
| `API_CORE/simpleBattleAPI.js` | Generic battle start API | No |
| `API_CORE/sceneOverlappAPI.js` | Scene overlap detection | No |
| `API_CORE/apiDOCS.js` | Documentation stubs | No |

#### Multiplayer Netcode (fully generic engine)
| File/Directory | Purpose |
|---------------|---------|
| `_multiplayer/netControllerV2/baseNetController.js` | Core networking: send/receive, priority queue, rate limiting, reliability, deduplication |
| `_multiplayer/netControllerV2/host.js` | Host controller with broadcast logic |
| `_multiplayer/netControllerV2/client.js` | Client controller with retry/reconnection |
| `_multiplayer/netControllerV2/models/priorityQueue.js` | Priority queue data structure |
| `_multiplayer/netControllerV2/models/playerModel.js` | Network player representation |
| `_multiplayer/netControllerV2/models/playerFollowerModel.js` | Follower sync |
| `_multiplayer/netControllerV2/models/connectionModel.js` | Connection abstraction |
| `_multiplayer/netControllerV2/switchEmitter.js` | Switch/variable sync (generic, but references `MATTIE.static.switch.ignoredSelfSwitches`) |
| `_multiplayer/netControllerV2/eventMovementEmitter.js` | Event movement sync |
| `_multiplayer/netControllerV2/commandInterpreter.js` | Network command execution (only cmd 205 enabled) |
| `_multiplayer/netControllerV2/transports/nodeTcpTransport.js` | TCP fallback transport |
| `_multiplayer/peerjs.min.js` | PeerJS library |
| `_multiplayer/scaleing.js` | Difficulty scaling config |
| `_multiplayer/netControllerV2/battle/battleController.js` | Battle sync |
| `_multiplayer/netControllerV2/battle/pvpController.js` | PvP controller |
| All `*Emitter.js` files | Event emission for various game systems |
| All menu files (`hostMenu.js`, `joinMenu.js`, `lobby.js`, etc.) | Multiplayer UI |

#### Utility Files (generic)
| File | Purpose |
|------|---------|
| `commonLibs/_common/lodash.js` | Lodash library |
| `commonLibs/_common/seedRandom.js` | Seeded random (David Bau's library) |
| `commonLibs/_common/clipboard.js` | Clipboard access |
| `commonLibs/_common/nw.js` | NW.js GUI require |
| `commonLibs/_common/consoleLogger.js` | Console logging setup |
| `commonLibs/_common/util.js` | Utility functions (includes `getAllAutoRunEvents()`) |
| `commonLibs/_common/gameEmitter.js` | EventEmitter-based game event system |
| `commonLibs/_common/dataMapModel.js` | Map data model |
| `commonLibs/_common/systemEvents.js` | RPG Maker event code enum (274 codes, duplicated 3×) |
| `commonLibs/_common/tas.js` | TAS mode (stub — only `enableTas()`/`disableTas()`) |

### 2.2 Fear & Hunger Specifics — The Hardcoded Matrix

#### 2.2.1 The `static.js` Monolith (2844 lines)

**File:** `commonLibs/_common/static.js`

This is the **single largest coupling point** in the entire codebase. It contains virtually all hardcoded F&H game data:

**Hardcoded `$gameSwitches` IDs:**

| Switch ID | Variable Name | Purpose |
|-----------|--------------|---------|
| 3153 | `STARVATION` | Starvation mode flag |
| 2844 | `phaseStep` | Phase step trigger |
| 16 | `neckBreak` | Neck break state |
| 1045 | `backstab` | Backstab flag |
| 1281 | `justGuard` | Just guard flag |
| 3155 | `toughEnemyMode` | Tough enemy mode |
| 52 | `talk` | Talk interaction |
| 3151 | `torchTimer` | Torch timer |
| 3118 | `taf` | Trepidation & Famine flag |
| 2190 | (unnamed) | Hard mode check |

**Hardcoded `$gameVariables` IDs:**

| Variable ID | Name | Purpose |
|-------------|------|---------|
| 162 | `groGorothAffinity` | Gro-Goroth affinity |
| 163 | `groSylvianAffinity` | Sylvian affinity |
| 164 | `allMerAffinity` | All-mer affinity |
| 165 | `godOfTheDepthsAffinity` | God of the Depths affinity |

**Hardcoded Map IDs — Fear & Hunger 1:**

```javascript
MATTIE.static.maps = {
  fortress: 74,
  levelOneEntranceA: 1, levelOneEntranceB: 29, levelOneEntranceC: 51,
  levelOneInnerHallA: 3, levelOneInnerHallB: 31, levelOneInnerHallC: 53,
  levelOneBackyard: 9,
  levelTwoBloodPitA: 5,
  levelThreePrisonsA: 6, levelThreePrisonsB: 37, levelThreePrisonsC: 59,
  // ... 30+ more dungeon map IDs
  charCreationMap: 2, startMap: 10,
  menuMaps: [10, 2, 72, 73, 86, 130, 61, 64, 170, 161, 33, 181],
  blockingMaps: [132, 122, 131, 153, 160, 185, 40, ...], // 51 map IDs
  dungeonKnights: [161, 158, 165, 166, 167, 162, 168, ...], // 20+ IDs
};
```

**Hardcoded Map IDs — Termina (Fear & Hunger 2):**

```javascript
MATTIE.static.maps.termina = {
  oldHouse: 11, start: 10, charCreation: 3,
  introTrain: 19, introMoonScene: 8,
  path1: 4, outskirts1: 15, outskirtPath: 114,
  abandonedHouse: 5, cottage: 13, trainCabins: 14,
  oldTown1: 16, oldTown2: 9, oldTown3: 41,
  prehevil: { staircase: 36, east: 37, central: 38, west: 39, west2: 156 },
  church: 44, churchLevel2: 51, churchPassageway: 81, confessional: 109,
  school: 77, school2: 87, schoolyard: 88, schoolBasement: 108,
  riverside: 40, lake: 42, devilsIsland: 112,
  forest: 23, deepWoods: 64, deeperWoods: 65, deepestWoods: 113,
  tunnel7: 24, tunnel6: 104, tunnel5: 50, tunnel4: 167,
  sewers1: 78, sewers2: 98, sewers3: 101, sewers4: 106,
  mayorsManor: 20, manorBasement: 103,
  restaurant: 53, bookStore: 54, museum: 84,
  speakeasy: 105, renkaCafe: 56,
  hexen: 31, moonTower: 32,
  otherside: 82, ruinedCity: 60,
  grandHallFinal: 139, splashScreen: 72, dayChange: 129, endings: 151,
  // ... 100+ total Termina map IDs
};
```

**Hardcoded Actor IDs — Fear & Hunger 1:**

```javascript
mercenaryId: 1, girlId: 2, knightId: 3, darkPriestId: 4,
outlanderId: 5, leGardeId: 6, demonKidId: 8, marriageId: 9,
abominableMarriage: 11, nashrahId: 14
```

**Hardcoded Actor IDs — Termina:**

```javascript
leviId: 1, marinaId: 3, daanId: 4, abellaId: 5, osaaId: 6,
blackKalevId: 7, marcohId: 13, karinId: 14, oliviaId: 15
```

**Hardcoded Skill References:**

```javascript
bloodportal, hurting, bloodGolem, greaterBloodGolem, 
healingWhispers, run, enGarde
```

**Hardcoded Item References:**

```javascript
emptyScroll = $dataItems[88], silverCoin = $dataItems[59], bookIcon = 121
```

**Cheat Menu Teleport Arrays:** Two large arrays (15+ entries each) containing hardcoded `{name, mapId, x, y}` teleport destinations for both F&H1 and Termina.

**Synced Switches/Variables Arrays:** Extensive arrays containing hundreds of switch/variable IDs that the multiplayer system must synchronize. These include game-specific event states like:
- `'2319-2326'` — ladders
- `'4010-4013'` — arrival/travel/return/ladders
- `'2281-2286'` — death masks
- `'941-957'` — ritual locations
- `2240` — sewer lid west
- `2287–2288` — sewer winches

#### 2.2.2 Termina-Specific Compatibility Code

**`compatibility.js` (lines 350–403):**
```javascript
MATTIE.compat.terminaBlockedMods = ['bossRushOfTheEndless'];

// Termina menu icon rendering override
Window_Command.prototype.drawItem = function (index) {
    const isTermina = MATTIE.global && MATTIE.global.version === 2;
    const isMenuCommandWindow = this instanceof Window_MenuCommand || this instanceof Window_GameEnd;
    if (isTermina && isMenuCommandWindow) {
        // Custom Termina rendering logic
    }
    // ...
};
```

**`dataManager.js` (lines 36–72):** Version detection reads `System.json` gameTitle:
```javascript
MATTIE.global.isTermina = () => (MATTIE.global.version === 2);
MATTIE.global.isFunger = () => (MATTIE.global.version === 1);
// Detection: data.gameTitle.toUpperCase().includes('TERMINA') ? 2 : 1
```

**`teleportsAPI.js` (lines 138–262):** 20+ hardcoded Termina teleport functions:
```javascript
this.terminaOldHouse = () => this.genericTp(MATTIE.static.maps.termina.oldHouse, 22, 43);
this.terminaTrainCabins = () => this.genericTp(14, 16, 2);
this.terminaOldTown = () => this.genericTp(16, 10, 18);
// ... 17+ more Termina-specific teleports
```

**`multiplayerKeybindsAndTools.js` (lines 8–21):**
```javascript
if (MATTIE.global.isTermina()) {
    $gamePlayer.reserveTransfer(MATTIE.static.maps.termina.oldHouse, 22, 43, 0, 2);
}
// Hardcoded teleport to Termina spawn map for multiplayer
```

**`gameOverScene.js`:** Termina-specific game over text:
```javascript
const isTermina = MATTIE.global.isTermina();
// Different game over messages for F&H1 vs Termina
```

#### 2.2.3 Game-Specific Battle/Actor/Item Code

**`trepidationAndFamine.js`:** Custom difficulty mode using:
- `$gameSwitches.setValue(MATTIE.static.switch.STARVATION, true)` (switch 3153)
- `$gameSwitches.setValue(MATTIE.static.switch.taf, 1)` (switch 3118)
- `$gameVariables` manipulation for honey/Mer affinity system

**`betterCrowMauler.js` (in commonLibs):** Crow Mauler-specific AI:
- `$gameSwitches.setValue(MATTIE.static.switch.crowMaulerDisabled, true)`
- Crow Mauler spawn condition checks

**`optimizedTarraxLighting.js`:** Extensive lighting system using hardcoded `$gameVariables` for:
- Day/night cycle (12+ variable references)
- Daynight debug mode
- Time system scripting

**`bossRushOfTheEndless.js`:** F&H2-specific boss descriptions and troop data.

**`TY_FnHShowLimbHP.js`:** Fear & Hunger limb HP display (game-specific battle UI).

**`multiplayer.js` (lines 162–201):** Termina vs F&H1 conditional initialization:
- Ghost actor creation (different troop/event data per game version)
- Crow Mauler initialization (F&H1 only)
- `if (MATTIE.global.isTermina()) { ... }` conditionals

#### 2.2.4 Cheat Menu Game-Specific Content

**`cheatMenu.js`:**
- Teleport lists populated from `MATTIE.static.teleports` (game-specific locations)
- Actor lists from `MATTIE.static.actors`
- Item/skill lists filtered by game-specific icon indices
- Switch toggles using game-specific switch IDs (`MATTIE.static.switch.cheatSwitches`)

**`devMenu.js`:**
- Debug tabs (Items, Skills, Actors, Debug, Misc) — populated with game data
- `BattleManager.clearActor()` calls

#### 2.2.5 Full List of Version-Conditional Code

Every `MATTIE.global.isTermina()` / `MATTIE.global.isFunger()` / `MATTIE.global.version` check:

| File | Line(s) | Logic |
|------|---------|-------|
| `dataManager.js` | 36–72 | Version detection from System.json |
| `compatibility.js` | 12, 350–403 | Termina blocked mods, menu icon override |
| `static.js` | ~1449–1505, ~1981–2028 | Teleport arrays selected by version |
| `teleportsAPI.js` | 138–262 | 20+ Termina-specific teleport functions |
| `betterSaves.js` | 150 | UI layout conditional (rect.y vs bottom-4) |
| `multiplayer.js` | 162–201 | Initialization branching |
| `multiplayerKeybindsAndTools.js` | 10–11 | Spawn map teleport |
| `gameOverScene.js` | 46–94 | Game over text |
| `actorAPI.js` | 131, 141 | Actor logic branching |
| `_common.js` | ~20 | Default version = 1 |

---

## 3. Target Architecture & Refactoring Roadmap

### 3.1 Proposed Directory Structure

```
www/
├── index.html                          (unchanged — load order stays the same)
├── mods/
│   ├── core-engine/                    ◄── NEW: Generic RPG Maker MV mod engine
│   │   ├── _core.js                    (namespace init, formerly _common.js minus game checks)
│   │   ├── _core.json                  (dependency manifest)
│   │   ├── _core/
│   │   │   ├── modLoader.js            (extracted from mattieFMModLoader.js)
│   │   │   ├── dataManager.js          (generic fs, global data, save load — no version checks)
│   │   │   ├── saveProtector.js        (unchanged — fully generic)
│   │   │   ├── precompiler.js          (unchanged — fully generic)
│   │   │   ├── optimisations.js        (unchanged — fully generic)
│   │   │   ├── compatibility.js        (generic RPG Maker fixes only — no Termina code)
│   │   │   ├── gameEmitter.js          (unchanged)
│   │   │   ├── systemEvents.js         (unchanged, deduplicate the 3× array)
│   │   │   ├── util.js                 (unchanged)
│   │   │   ├── consoleLogger.js        (unchanged)
│   │   │   ├── clipboard.js            (unchanged)
│   │   │   ├── nw.js                   (unchanged)
│   │   │   ├── seedRandom.js           (unchanged)
│   │   │   ├── lodash.js               (unchanged)
│   │   │   ├── dataMapModel.js         (unchanged)
│   │   │   ├── versionIncrementer.js   (unchanged)
│   │   │   ├── API_CORE/               (all 20 APIs — most are generic)
│   │   │   │   ├── eventAPI.js
│   │   │   │   ├── eventWrapper.js
│   │   │   │   ├── eventHooks.js
│   │   │   │   ├── itemAPI.js
│   │   │   │   ├── vfxAPI.js
│   │   │   │   ├── msgAPI.js
│   │   │   │   ├── inputAPI.js
│   │   │   │   ├── imageAPI.js
│   │   │   │   ├── preFabAPI.js
│   │   │   │   ├── simpleBattleAPI.js
│   │   │   │   ├── sceneOverlappAPI.js
│   │   │   │   ├── apiDOCS.js
│   │   │   │   ├── troopAPI.js         (generic parts only)
│   │   │   │   ├── actorAPI.js         (generic parts only)
│   │   │   │   ├── unstuckAPI.js       (unchanged)
│   │   │   │   ├── miscAPI.js          (review for game refs)
│   │   │   │   ├── infoAPI.js          (review for game refs)
│   │   │   │   └── teleportsAPI.js     (generic teleport function only)
│   │   │   └── menus/
│   │   │       ├── windows.js          (unchanged — generic window classes)
│   │   │       ├── scenes.js           (unchanged — mod loader + decrypter scenes)
│   │   │       ├── mainMenu.js         (unchanged — menu injection)
│   │   │       ├── menu.js             (unchanged)
│   │   │       ├── cheatMenu.js        (generic framework only)
│   │   │       └── devMenu.js          (generic framework only)
│   │   └── multiplayer/                ◄── Multiplayer engine (from _multiplayer/)
│   │       ├── netControllerV2/
│   │       │   ├── baseNetController.js
│   │       │   ├── host.js
│   │       │   ├── client.js
│   │       │   ├── models/
│   │       │   ├── transports/
│   │       │   ├── battle/
│   │       │   └── [all emitters]
│   │       ├── peerjs.min.js
│   │       └── [all UI files]
│   │
│   ├── game-modules/                   ◄── NEW: Game-specific module directory
│   │   ├── fear-and-hunger-1/
│   │   │   ├── gameConfig.js           ◄── Maps, actors, switches, variables, items
│   │   │   ├── teleports.js            ◄── F&H1 teleport destinations
│   │   │   ├── syncedData.js           ◄── Synced switches/variables arrays
│   │   │   ├── compatibility.js        ◄── F&H1-specific compat fixes
│   │   │   └── crowMauler.js           ◄── Crow Mauler AI
│   │   │
│   │   ├── fear-and-hunger-termina/
│   │   │   ├── gameConfig.js           ◄── Maps, actors, switches, variables, items
│   │   │   ├── teleports.js            ◄── Termina teleport destinations
│   │   │   ├── syncedData.js           ◄── Synced switches/variables arrays
│   │   │   ├── compatibility.js        ◄── Termina menu icons, blocked mods
│   │   │   └── multiplayerInit.js      ◄── Termina-specific MP initialization
│   │   │
│   │   └── gameModuleInterface.js      ◄── NEW: Interface/contract that game modules must implement
│   │
│   ├── mattieFMModLoader.js            (slimmed: delegates to core-engine)
│   ├── [existing user mods — unchanged]
│   └── commonLibs/                     (becomes thin wrapper loading core-engine + game module)
```

### 3.2 Abstraction Targets — Specific Splits Required

#### Split 1: `static.js` → `gameModuleInterface.js` + 2 game configs

**Current state:** 2844-line monolith mixing generic static utility functions with game-specific data.

**Target:**
- **`core-engine/gameModuleInterface.js`** — Defines the data schema that every game module must provide:

```javascript
// Game Module Interface — all game modules must populate these
MATTIE.static = {
  maps: {},                    // { mapName: mapId, ... }
  actors: {},                  // { actorName: actorId, ... }
  skills: {},                  // { skillName: skillRef, ... }
  items: {},                   // { itemName: itemRef, ... }
  states: {},                  // { stateName: stateRef, ... }
  switch: {
    syncedSwitches: [],        // Switch IDs to sync in multiplayer
    ignoredSwitches: [],       // Switch IDs to not sync
    syncedSelfSwitches: [],    // Self-switch keys to sync
    ignoredSelfSwitches: [],   // Self-switch keys to not sync
    cheatSwitches: [],         // Switch IDs for cheat menu
  },
  variable: {
    syncedVars: [],            // Variable IDs to sync
  },
  teleports: [],               // [{ name, mapId, x, y }, ...]
  commonEvents: {},            // { eventName: eventId, ... }
  menuMaps: [],                // Map IDs where menu is available
  blockingMaps: [],            // Map IDs that block certain features
  rpg: {},                     // RPG Maker command code mappings
  
  // Utility (stays in core)
  rangeParser: function(array) { ... },
  update: function() { ... },
};
```

- **`game-modules/fear-and-hunger-1/gameConfig.js`** — Fills all F&H1 data.
- **`game-modules/fear-and-hunger-termina/gameConfig.js`** — Fills all Termina data.

**The `MATTIE.static.update()` function** currently branches on `MATTIE.global.version` — refactor to: `MATTIE.static.loadGameModule(version)` which dynamically loads the correct game config.

#### Split 2: `compatibility.js` → generic + game-specific

- **Lines 1–349**: Generic RPG Maker MV fixes → stays in `core-engine/compatibility.js`
- **Lines 350–403**: Termina menu icon override + `terminaBlockedMods` → moves to `game-modules/fear-and-hunger-termina/compatibility.js`

#### Split 3: `teleportsAPI.js` → generic + game teleport data

- **`genericTp()` function**: Stays in `core-engine/API_CORE/teleportsAPI.js`
- **20+ named Termina teleports**: Move to `game-modules/fear-and-hunger-termina/teleports.js`
- **F&H1 teleport data**: Move to `game-modules/fear-and-hunger-1/teleports.js`

#### Split 4: `dataManager.js` → generic + version detection

- **Lines 1–15, 73–344**: Generic file system, global data → `core-engine/dataManager.js`
- **Lines 16–72**: `isTermina()`, `isFunger()`, `ignoredPlugins`, version detection → **New: `core-engine/versionDetector.js`** that returns a version enum and delegates to game module for plugin filtering

#### Split 5: `multiplayer.js` → generic + game initialization

- **Lines 1–160**: Generic multiplayer flags and net controller setup → stays
- **Lines 162–201**: Termina/F&H1 conditional init (ghost actor, crow mauler) → `game-modules/*/multiplayerInit.js`

#### Split 6: Cheat menu data population

`cheatMenu.js` currently reads from `MATTIE.static.*` — after Split 1, it automatically gets game-correct data. No code changes needed in cheatMenu.js itself.

### 3.3 Step-by-Step Refactoring Plan

**Phase 1: Create Infrastructure (Non-Breaking)**

1. Create `core-engine/` and `game-modules/` directory structure.
2. Create `gameModuleInterface.js` defining the schema.
3. Create `fear-and-hunger-1/gameConfig.js` extracting F&H1 data from `static.js`.
4. Create `fear-and-hunger-termina/gameConfig.js` extracting Termina data from `static.js`.
5. Create game module loader in `_core.js` that detects version and loads correct module.

**Phase 2: Extract Game Data from static.js**

6. Move all F&H1 map IDs, actor IDs, switch IDs, variable IDs → `fear-and-hunger-1/gameConfig.js`.
7. Move all Termina map IDs, actor IDs, switch IDs, variable IDs → `fear-and-hunger-termina/gameConfig.js`.
8. Move synced switch/variable arrays → respective `syncedData.js` files.
9. Move teleport destination arrays → respective `teleports.js` files.
10. Verify `MATTIE.static.*` remains populated correctly at runtime.

**Phase 3: Extract Game Logic from Generic Files**

11. Extract Termina menu icon code from `compatibility.js` → `fear-and-hunger-termina/compatibility.js`.
12. Extract Termina teleport functions from `teleportsAPI.js` → `fear-and-hunger-termina/teleports.js`.
13. Extract version detection from `dataManager.js` → `core-engine/versionDetector.js`.
14. Extract game-specific multiplayer init from `multiplayer.js` → game module files.
15. Extract `ignoredPlugins` game-specific arrays → game module configs.

**Phase 4: Move Generic Engine Files**

16. Copy generic files to `core-engine/` maintaining exact behavior.
17. Update dependency manifests (`_core.json` replaces `_common.json`).
18. Update `index.html` if script paths change.
19. Run full regression test (manual — load game, verify mods, test multiplayer).

**Phase 5: Cleanup**

20. Remove game-specific code from original locations (now in game modules).
21. Deduplicate `systemEvents.js` (remove 3× array repetition).
22. Update `_common.js` to become thin wrapper loading `core-engine` + detected game module.
23. Update all JSDoc references.

### 3.4 High-Risk Zones — Handle With Extreme Care

#### RISK 1: Save File Data Integrity (CRITICAL)

**`saveProtector.js`** redirects save paths based on danger level. The path computation uses `process.mainModule.filename` which varies by NW.js version. Any change to the save path logic could make existing saves inaccessible.

**Mitigation:**
- Do NOT change `saveProtector.js` logic.
- Do NOT change the `modDataGlobal.json` file path or schema.
- Test: Enable a dangerous mod → verify saves go to `moddedSaves/`. Disable → verify saves go to `save/`. Verify old saves still load.

#### RISK 2: `hasEncryptedImages` Flag Logic (HIGH)

The encryption/decryption system in `compatibility.js` is a fragile state machine:
- `Decrypter.hasEncryptedImages` (runtime flag)
- `MATTIE.compat.pauseDecrypt` (pause flag)
- `MATTIE.compat.runtime_decrypt` (write-back flag)
- `System.json` file on disk (persistent flag)

Bitmap loading checks all four states:
```javascript
rpgmakerWantsToDecrypt = !Decrypter.checkImgIgnore(url) && Decrypter.hasEncryptedImages;
modmanagerWantsToDecrypt = fs.existsSync(rpgMVPUrl) && !MATTIE.compat.pauseDecrypt;
cannotUseEncrypted = !fs.existsSync(rpgMVPUrl) && fs.existsSync(pngUrl);
```

**Mitigation:** Keep the entire `Bitmap.prototype.compatabilityLoad` function in `core-engine/compatibility.js` exactly as-is. Do not split this function.

#### RISK 3: Multiplayer Priority Queue Breaking (HIGH)

The priority queue is a simple array with linear scan. The `clearLowPrioEvents()` method has a **known bug**: it splices while iterating, which can skip elements:

```javascript
indexsToRemove.forEach((i) => {
    this.values.splice(i, 1);  // BUG: indices shift after each splice
});
```

**Mitigation:** Do not "fix" this during refactoring — it's a known behavior that existing code depends on. Flag it for future fix.

#### RISK 4: `MATTIE.static.update()` Timing (HIGH)

This function is called during Phase 1 of mod loading (between commonLibs and user mods). If the game module isn't loaded yet when `update()` runs, all static data will be wrong.

**Mitigation:** Ensure game module configs are loaded as part of `commonLibs/` loading (Phase 1), not user mods (Phase 2). The game config files should be dependencies of `_core.json`.

#### RISK 5: Precompiler `eval()` and Script Compilation (MEDIUM)

The precompiler converts event scripts to `eval()` functions:
```javascript
command.script = eval(`(__)=>{\n${script}\n}`);
```

This runs in the NW.js context with full Node.js access. Moving this file must preserve the execution context (global scope access to `$gameMap`, `$gameSwitches`, etc.).

**Mitigation:** Do not wrap in a module or IIFE. Keep as global scope script.

#### RISK 6: `versionIncrementer.js` Side Effects (LOW)

This file modifies `package.json` on every game start (increments the `name` field 0–100). This is used to bust NW.js caches. Moving this file could change the working directory assumption (`process.cwd()`).

**Mitigation:** Verify `process.cwd()` still points to game root after refactoring.

---

## 4. Codebase Quirks & Unwritten Rules

### 4.1 Non-Standard Implementations

#### The `versionIncrementer.js` Cache-Busting Hack

The `name` field in `package.json` (currently `"62"`) is NOT a project name — it's an integer counter (0–100) incremented on every game launch. This busts NW.js's cached copies of JavaScript files. **Do not rename this field or remove this file.**

#### `ignoredPlugins` Filter That Doesn't Work

```javascript
// dataManager.js line 634 comment:
if (!MATTIE.ignoredPlugins().includes(plugin.name)) {
    // this does not work as we load after the plugins
```

The `HIME_PreTitleEvents` and `physical_attack_animation` plugins are listed in `ignoredPlugins` but the filter runs too late to prevent their loading. **Do not rely on this filter for correctness.**

#### `betterPhysAtkAnim.js` — eval() and Array Bug

```javascript
const phys_weap = eval(String(parameters));  // eval() for plugin params
types_weap = parseInt(types_weap, 10);       // Overwrites array with int
```

This file has known bugs but is wrapped in a try-catch and works in production. **Do not fix these bugs during refactoring.**

#### `systemEvents.js` — Triple-Duplicated Array

The 274-element event code array is literally duplicated 3 times in the file with a comment noting codes 412, 505, 404 come from "a plugin or the game idk what it is but it fires constantly." During refactoring, consider deduplicating to a single array.

### 4.2 Autorun Event Handling

RPG Maker MV autorun events (trigger === 3) block all other processing. The mod system handles this via:

1. **Detection:** `Game_Event.prototype.isAutorun()` checks `this._trigger === 3`
2. **Enumeration:** `MATTIE.util.getAllAutoRunEvents(anyPage)` finds all active autoruns
3. **Conversion:** `MATTIE.unstuckAPI.convertRunningAutorunToParallel()` changes autoruns to parallel (trigger 4) with a custom `sequential` flag
4. **Sequential Parallel:** When `sequential = true`, converted events share a single `Game_Interpreter` instance rather than each getting their own. This preserves execution order.
5. **Repair:** Optional `repairInMs` parameter reverts the conversion after a timeout.
6. **Multiplayer:** Spectating players have autorun events disabled to prevent duplicate triggers: `"make sure autorun events cannot run while ghost"`

**Unwritten rule:** Never permanently convert autoruns — always use the repair timer or the non-blocking secondary interpreter variant.

### 4.3 Server/Client Side Switch Synchronization

The `switchEmitter.js` implements a sophisticated filtering system:

1. **Parallel Event Detection:** A tolerance counter (12 calls threshold) detects when a switch/variable is being set by a parallel process event (infinite loop). When exceeded, the interpreter is flagged `_isParallel = true`.
2. **Silencing:** Parallel-detected events are "silenced" — they still execute locally but don't emit over the network.
3. **Override:** Switches in `MATTIE.static.switch.syncedSwitches` override silencing — they're always emitted regardless of parallel detection.
4. **Ignored Switches:** Switches in `MATTIE.static.switch.ignoredSwitches` are never emitted.
5. **Self-Switch Filtering:** Same pattern via `ignoredSelfSwitches` and `syncedSelfSwitches`.

**Network Payload Format:**
- Global switches: `{i: id, b: value, s: 0}`
- Self-switches: `{i: key, b: value, s: 1}`
- Variables: `{i: id, b: value, s: 2}`

**Critical:** The synced/ignored switch arrays in `static.js` are **game-specific**. After refactoring, these must come from the loaded game module.

### 4.4 Precompiler Jump Overrides

The precompiler pre-calculates `jumpToIndex` on conditional branch commands. The runtime override chain:

```
Game_Interpreter.prototype.skipBranch()
  → if currentCommand().jumpToIndex exists → direct jump (O(1))
  → else → manual indent-walking loop (O(n), original RPG Maker behavior)

Game_Interpreter.prototype.command113() [Break Loop]
  → if currentCommand().jumpToIndex exists → direct jump to loop end
  → else → manual depth-tracking search for code 413

Game_Interpreter.prototype.command108() [Comment]
  → if currentCommand().jumpToIndex exists → jump to comment end
  → else → sequential nextEventCode() === 408 scanning
```

**All three have fallback paths** to original behavior if precompilation didn't run. This makes the precompiler a pure optimization — safe to move without breaking anything.

### 4.5 The `ModManager` / `PluginManager` Relationship

`ModManager` (line 686 of mattieFMModLoader.js) extends RPG Maker's `PluginManager` via:

```javascript
Object.assign(this, PluginManager);  // Copy all static properties
```

This is **not** prototype inheritance — it's a shallow copy of the PluginManager singleton's properties onto the ModManager instance. This means:
- `PluginManager._path` is shared (and mutated during loading phases)
- The path is temporarily changed for commonLibs loading, then restored
- Multiple `ModManager` instances exist but share the same underlying `_scripts` array

**Unwritten rule:** Never create more than 2 `ModManager` instances (one for commonLibs, one for user mods).

### 4.6 The Save Slot 9998 Conflict

Both `betterSaves.js` and `quickSave.js` use save slot ID `9998`:
- `betterSaves.js`: `MATTIE.saves.suspendedRunId = 9998` (suspended run)
- `quickSave.js`: `MATTIE.quickSaves.quickSaveId = 9998` (quick save)

These mods overwrite each other's data if both are enabled. **This is a known conflict** that should be documented but not fixed during refactoring.

### 4.7 Enemy Host — Distributed Authority

Multiplayer uses a "first player on the map is enemy host" pattern:

```javascript
MATTIE.multiplayer.setEnemyHost = function () {
    var shouldBeHost = true;
    Object.keys(netController.netPlayers).forEach(key => {
        if (netController.netPlayers[key].map === $gameMap.mapId()) {
            shouldBeHost = false;  // Another player already on this map
        }
    });
    MATTIE.multiplayer.isEnemyHost = shouldBeHost;
};
```

This determines who sends enemy movement events. **Only the enemy host emits `moveStraight` for NPCs.** If this logic breaks, either no enemies move (both think other is host) or enemies move double (both think they're host).

### 4.8 Difficulty Scaling Authority

The host has final authority over HP scaling:

```javascript
// host.js preprocessData():
data.battleStart.scalingFactor = projectedFactor;
conn.send({ scalingCorrection: { factor: projectedFactor } });
```

The host projects total combatants, calculates the scaling factor, modifies the `battleStart` packet, and sends a `scalingCorrection` back to the initiating client. **This logic is generic but the scaling formula references `MATTIE.multiplayer.config.scaling` which could have game-specific defaults.**

### 4.9 File Asset System

The `Asset` class (mattieFMModLoader.js line 50) handles copying mod assets into the game directory at load time. It supports:
- Images (characters, enemies, faces, pictures, sv_actors)
- Data files (JSON database overrides)
- Audio files

Assets are defined in the mod JSON:
```json
{
  "assets": [
    { "src": "_bbgirlMod/images/characters/", "dest": "img/characters/" }
  ]
}
```

**The asset system is fully generic** — it copies files from mod directories to game directories. No game-specific logic.

---

## Appendix A: Complete File Classification

### Engine Core (Move to `core-engine/`)

| File | Classification | Notes |
|------|---------------|-------|
| `mattieFMModLoader.js` | ✅ 100% Generic | Mod loading, dependency resolution, danger system |
| `_common.js` | ⚠️ 95% Generic | Remove `MATTIE.global.version = 1` default |
| `dataManager.js` | ⚠️ 80% Generic | Extract version detection + ignoredPlugins |
| `saveProtector.js` | ✅ 100% Generic | Save path routing |
| `precompiler.js` | ✅ 100% Generic | Event precompilation |
| `optimisations.js` | ✅ 100% Generic | Performance improvements |
| `compatibility.js` | ⚠️ 85% Generic | Extract Termina menu/blocked mods (lines 350–403) |
| `consoleLogger.js` | ✅ 100% Generic | Logging |
| `gameEmitter.js` | ✅ 100% Generic | Event system |
| `systemEvents.js` | ✅ 100% Generic | Event code enum (deduplicate) |
| `util.js` | ✅ 100% Generic | Utilities |
| `lodash.js` | ✅ 100% Generic | Library |
| `seedRandom.js` | ✅ 100% Generic | Library |
| `clipboard.js` | ✅ 100% Generic | Utility |
| `nw.js` | ✅ 100% Generic | NW.js GUI |
| `dataMapModel.js` | ✅ 100% Generic | Map model |
| `tas.js` | ✅ 100% Generic | TAS stub |
| `versionIncrementer.js` | ✅ 100% Generic | Cache busting |
| `yanflyChecker.js` | ✅ 100% Generic | Namespace guard |
| `betterPhysAtkAnim.js` | ✅ 100% Generic | Physical attack animation plugin |
| All `menus/*.js` | ⚠️ 90% Generic | Cheat menu data comes from `MATTIE.static.*` |
| Most `API_CORE/*.js` | ✅ 95% Generic | See individual notes above |

### Game-Specific (Move to `game-modules/`)

| Content | Source File | Target |
|---------|------------ |--------|
| F&H1 map IDs | `static.js` lines 120–140, 601–670 | `fear-and-hunger-1/gameConfig.js` |
| Termina map IDs | `static.js` lines 142–238 | `fear-and-hunger-termina/gameConfig.js` |
| F&H1 actor IDs | `static.js` lines 587–597 | `fear-and-hunger-1/gameConfig.js` |
| Termina actor IDs | `static.js` lines 2035–2056 | `fear-and-hunger-termina/gameConfig.js` |
| Switch/variable IDs | `static.js` (distributed) | Respective `gameConfig.js` files |
| Synced switch arrays | `static.js` (end of file) | Respective `syncedData.js` files |
| Cheat teleports | `static.js` lines 1458–1505, 1981–2028 | Respective `teleports.js` files |
| Termina teleport functions | `teleportsAPI.js` lines 138–262 | `fear-and-hunger-termina/teleports.js` |
| Termina menu icons | `compatibility.js` lines 350–403 | `fear-and-hunger-termina/compatibility.js` |
| Termina blocked mods | `compatibility.js` line 12 | `fear-and-hunger-termina/compatibility.js` |
| Version detection | `dataManager.js` lines 36–72 | `core-engine/versionDetector.js` |
| Termina MP spawn | `multiplayerKeybindsAndTools.js` line 11 | `fear-and-hunger-termina/multiplayerInit.js` |
| Game over text | `gameOverScene.js` lines 46–94 | Respective game modules |
| Crow Mauler AI | `betterCrowMauler.js` | `fear-and-hunger-1/crowMauler.js` |
| Lighting variables | `optimizedTarraxLighting.js` | Review: may need game module refs |
| F&H-specific items | `static.js` (emptyScroll, silverCoin, bookIcon) | Respective `gameConfig.js` |
| F&H-specific skills | `static.js` (bloodportal, hurting, etc.) | Respective `gameConfig.js` |

### User Mods (Unchanged — No Refactoring Needed)

These mods reference `MATTIE.static.*` and `MATTIE.global.*` APIs — they'll work automatically once the game module populates those namespaces:

`10xEnemyHealth.js`, `OnlyBosses.js`, `TY_FnHShowLimbHP.js`, `bbgirlMod.js`, `bearGirlImgs.js`, `betterCrowMauler.js`, `betterSaves.js`, `bossRushOfTheEndless.js`, `devFPSMetrics.js`, `devTools.js`, `easyEmptyScroll.js`, `higherItemCount.js`, `overworldHurting.js`, `playAsAnyChar.js`, `quickSave.js`, `randomiser.js`, `rougeLike.js`, `rpgmakermvstandalonEnemyRandomzier.js`, `trepidationAndFamine.js`, `tutorial.js`, `unlockedBloodPortal.js`, `wideScreen.js`

---

## Appendix B: Global Namespace Map

All `MATTIE.*` namespaces and their owners:

| Namespace | Defined In | Purpose |
|-----------|-----------|---------|
| `MATTIE` | `_common.js` | Root namespace |
| `MATTIE.global` | `_common.js` | Global state (version, isDev) |
| `MATTIE.global.version` | `dataManager.js` | 1 = F&H1, 2 = Termina |
| `MATTIE.global.isTermina()` | `dataManager.js` | Version check |
| `MATTIE.global.isFunger()` | `dataManager.js` | Version check |
| `MATTIE.static` | `static.js` | Game data (maps, actors, switches, items) |
| `MATTIE.DataManager` | `dataManager.js` | File system API |
| `MATTIE.DataManager.global` | `dataManager.js` | modDataGlobal.json interface |
| `MATTIE.menus` | `_common.js` | Menu namespace |
| `MATTIE.windows` | `_common.js` | Window namespace |
| `MATTIE.scenes` | `_common.js` | Scene namespace |
| `MATTIE.TextManager` | `_common.js` | Text/label manager |
| `MATTIE.CmdManager` | `_common.js` | Command symbol manager |
| `MATTIE.modLoader` | `_common.js` | Mod loader utilities |
| `MATTIE.compat` | `compatibility.js` | Compatibility layer |
| `MATTIE.preCompiler` | `precompiler.js` | Precompiler system |
| `MATTIE.optimisations` | `optimisations.js` | Performance system |
| `MATTIE.GameInfo` | `_common.js` | Game state queries |
| `MATTIE.gameEmitter` | `gameEmitter.js` | Event emitter instance |
| `MATTIE.multiplayer` | `multiplayer.js` | Multiplayer state + config |
| `MATTIE.multiplayer.netQueue` | `baseNetController.js` | Priority queue instance |
| `MATTIE.multiplayer.config` | `scaleing.js` | Scaling config |
| `MATTIE.multiplayer.simulation` | `baseNetController.js` | Network simulation |
| `MATTIE.eventAPI` | `eventAPI.js` | Event manipulation |
| `MATTIE.unstuckAPI` | `unstuckAPI.js` | Autorun conversion |
| `MATTIE.inputAPI` | `inputAPI.js` | Input utilities |
| `MATTIE.imageAPI` | `imageAPI.js` | Image utilities |
| `MATTIE.msgAPI` | `msgAPI.js` | Message display |
| `MATTIE.vfxAPI` | `vfxAPI.js` | Visual effects |
| `MATTIE.simpleBattleAPI` | `simpleBattleAPI.js` | Battle start API |
| `MATTIE.saves` | `betterSaves.js` | Enhanced save system |
| `MATTIE.quickSaves` | `quickSave.js` | Quick save system |
| `MATTIE.isDev` | `dataManager.js` | Dev mode flag |
| `MATTIE.ignoredPlugins` | `dataManager.js` | Plugin filter function |
| `MATTIE_ModManager` | `mattieFMModLoader.js` | Mod manager singleton |
| `MATTIE_RPG` | `compatibility.js` | Original RPG Maker function storage |

---

*End of Knowledge Transfer Document*