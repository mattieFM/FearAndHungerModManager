# Changelog

All notable changes to this project are documented in this file.

## [1.2.4] - 2026-04-03

### Added
- Host-authoritative enemy AI action replication with precomputed action payloads.
- Deterministic seeded PRNG fallback for net actions when preloaded RNG data is missing.
- Indexed target-result transport and lookup for actor/enemy target matching across peers.
- Early `exTurnNotify` network packet and `netExTurnPending` flow to block local input before remote extra-turn execution.
- Multiplayer battle UI indicator: "Waiting for companion extra turn...".
- Enemy host pause state packet (`enemyHostPause`) to signal map/menu inactivity.
- Host gameplay config snapshot sync (`configSync`) for newly connected and game-start clients.

### Changed
- Enemy host selection is now deterministic per map (lowest active peer ID wins).
- Battle start setup now refreshes net battlers after internal actor-buffer resets.
- Troop combatant tracking now refreshes from live troop data each setup to avoid stale combatant state.
- Player core sync payload now includes map ID.

### Fixed
- Deterministic enemy combat behavior across clients in multiplayer battles.
- Extra-turn deadlocks and input race conditions when only a remote ally has an extra turn.
- Enemy host authority handoff when the current host pauses via menu/scene inactivity.
- Simultaneous battle-join race where clients could proceed with mismatched combatant lists.
- Event movement command comparison bug in movement history validation.
