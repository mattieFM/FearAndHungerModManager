# Enemy Targeting and Health Display Fix

## Issues Resolved

### Issue #1: Enemy Attacks Hitting Both Players
**Problem**: When both host and client had the same character (e.g., both have Darce), enemy attacks would damage BOTH players' characters instead of just one.

**Root Cause**: Enemy AI runs on both host and client machines. When an enemy selects a target and applies damage via `Game_Action.prototype.apply()`, it executes on both machines. Since both machines have the same actors in their local parties, the damage gets applied to both players' versions of that character.

**Solution**: Added a filter in `Game_Action.prototype.apply()` to prevent enemy actions from damaging netplayer actors. Each machine's enemies can still generate actions and target selection, but damage only applies to the LOCAL party members, not netplayers.

**File Modified**: `enemyEmitter.js`
- Overrode `Game_Action.prototype.apply()` 
- Added check: if subject is enemy AND target is a netplayer's actor, skip damage application
- Clears the result to prevent visual/log artifacts
- Local party members receive damage normally

**Benefits**:
- ✅ Enemies can attack on all machines (no "standing still" issue)
- ✅ Each player's characters only take damage once
- ✅ Enemy AI can target any local party member naturally
- ✅ No broadcast system needed
- ✅ Works with existing combat flow

### Issue #2: "View Allies" Showing Wrong Health
**Problem**: When viewing netplayers using the "View Allies" menu, their health bars showed starting health values instead of current health, even after they took damage.

**Root Cause**: The `syncActorData` method was correctly updating netplayer actor health values, but the status window wasn't being refreshed after the sync. The window would only refresh when the player manually toggled away and back to that party.

**Solution**: Added automatic status window refresh after actor sync, but only if the player is currently viewing that specific party.

**File Modified**: `baseNetController.js` - `syncActorData()` method
- Added check to see if player is viewing the synced party
- Calls `scene._statusWindow.refresh()` after health/mana updates
- Only refreshes when `_statusWindow._gameParty` matches the synced netPlayer

## Testing Checklist
- [ ] Start multiplayer session with both players having same character (e.g., both have Darce)
- [ ] Enter combat together
- [ ] Verify enemies attack and deal damage normally
- [ ] Verify each enemy attack only hits ONE player's character, not both
- [ ] Have one player take damage
- [ ] Other player uses "View Allies" to check their health
- [ ] Verify displayed health matches actual current health, not starting health
- [ ] Verify enemies attack both host and client parties

## Known Limitations
None. This solution works with the existing combat system without requiring architectural changes.

## Future Work (Optional)
For even more control, the host-authoritative AI system in `hostEnemyAI.js` could be integrated to have the host make ALL enemy decisions (including which player to target). This would:
- Enable cross-party targeting strategies
- Ensure 100% identical enemy behavior across all clients
- Prevent any client-side combat manipulation

See `HOST_ENEMY_AI_INTEGRATION.md` for implementation details.

## Files Modified
- `enemyEmitter.js` - Added target filtering in Game_Action.apply()
- `baseNetController.js` - Added status window refresh after actor sync
