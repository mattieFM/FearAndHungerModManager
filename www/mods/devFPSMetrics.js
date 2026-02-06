/* eslint-disable no-undef */
var MATTIE = MATTIE || {};
MATTIE.devFPS = MATTIE.devFPS || {};

(function () {
	function getDevStatsString() {
		var lines = [];

		// 1. Packets per second
		var pps = (MATTIE.multiplayer && MATTIE.multiplayer.lastPacketsPerSecond) !== undefined
			? MATTIE.multiplayer.lastPacketsPerSecond
			: 0;
		lines.push(`Packets/s: ${pps}`);

		// 2. Ping to Host
		var ping = 'N/A';
		// Check simulation first as fallback or primary if enabled
		if (MATTIE.multiplayer && MATTIE.multiplayer.simulation && MATTIE.multiplayer.simulation.enabled) {
			ping = `${MATTIE.multiplayer.simulation.latency}ms (Sim)`;
		}
		lines.push(`Ping: ${ping}`);

		// 3. Dropped Packets
		var drops = 'N/A';
		if (MATTIE.multiplayer && MATTIE.multiplayer.simulation && MATTIE.multiplayer.simulation.enabled) {
			drops = `${(MATTIE.multiplayer.simulation.packetLoss * 100).toFixed(0)}% (Sim)`;
		}
		lines.push(`Loss: ${drops}`);

		// 4. Enemy HP (Combat Only)
		if (typeof $gameTroop !== 'undefined' && $gameTroop && $gameTroop.inBattle()) {
			lines.push('--- Enemy HP ---');
			var enemies = $gameTroop.members();
			enemies.forEach((e, i) => {
				if (e) {
					var hpStatus = e.isDead() ? 'Dead' : `${e.hp}/${e.mhp}`;
					var name = e.name ? e.name() : (`Enemy ${i + 1}`);
					lines.push(`${name}: ${hpStatus}`);
				}
			});
		}

		// 5. Player Count
		if (MATTIE.multiplayer && MATTIE.multiplayer.getCurrentNetController) {
			var nc = MATTIE.multiplayer.getCurrentNetController();
			if (nc && nc.netPlayers) {
				var pCount = Object.keys(nc.netPlayers).length + 1; // +1 for self
				lines.push(`Players: ${pCount}`);
			}
		}

		return lines.join('\n');
	}

	// Update stats every 1 second
	setInterval(() => {
		// Only run if Dev mode is enabled
		if (!MATTIE.isDev) return;

		var modeText = document.getElementById('modeText');
		var modeTextBack = document.getElementById('modeTextBack');

		// Only update if the element exists
		if (modeText) {
			var stats = getDevStatsString();
			var baseText = (typeof Graphics !== 'undefined' && Graphics.isWebGL && Graphics.isWebGL()) ? 'WebGL mode' : 'Canvas mode';

			// Set text content
			modeText.textContent = `${baseText}\n${stats}`;

			// Enforce styling ensuring it fits on screen
			modeText.style.height = 'auto';
			modeText.style.whiteSpace = 'pre';
			modeText.style.textAlign = 'center';
			modeText.style.fontFamily = 'monospace';
			modeText.style.color = 'white';
			modeText.style.textShadow = 'rgba(0, 0, 0, 0.5) 1px 1px 0px';

			// Enforce container styling
			if (modeTextBack) {
				modeTextBack.style.height = 'auto';
				modeTextBack.style.width = 'auto';
				modeTextBack.style.minWidth = '119px';
				modeTextBack.style.zIndex = '100000';
				modeTextBack.style.padding = '5px';
			}
		}
	}, 1000);
}());
