/**
 * @file natTraversal.js
 * @description NAT Traversal helpers for the TCP transport layer.
 *   - UPnPMapper: Automatic UPnP/IGD port forwarding (solves ~80% of NAT issues).
 *   - TcpHolePuncher: TCP hole-punching via a rendezvous server (solves remaining cases).
 *
 * Both classes are exposed globally for use by NodeTcpTransport.
 * Neither throws on failure — they log warnings and return false / null so the
 * caller can fall back gracefully.
 */

const _nat_dgram = require('dgram');
const _nat_net = require('net');
const _nat_http = require('http');

let _nat_os;
try { _nat_os = require('os'); } catch (e) { /* optional */ }

// ═══════════════════════════════════════════════════════════════════════════
//  UPnP / IGD Port Mapper
// ═══════════════════════════════════════════════════════════════════════════

class UPnPMapper {
	constructor() {
		this._controlUrl = null;
		this._serviceType = null;
		this._mappedPorts = []; // Track what we mapped so we can clean up
	}

	// ── Public API ─────────────────────────────────────────────────────────

	/**
	 * Attempt to create a UPnP port mapping on the gateway.
	 * @param {number} externalPort
	 * @param {number} internalPort
	 * @param {string} [protocol='TCP']
	 * @param {string} [description='FearHungerMP']
	 * @param {number} [leaseDuration=0] 0 = permanent until reboot/unmap
	 * @returns {Promise<boolean>} true on success
	 */
	async mapPort(externalPort, internalPort, protocol, description, leaseDuration) {
		protocol = protocol || 'TCP';
		description = description || 'FearHungerMP';
		leaseDuration = leaseDuration || 0;

		try {
			console.log('UPnP: Starting port mapping attempt...');

			// Step 1 — Discover gateway via SSDP
			const gatewayUrl = await this._ssdpDiscover(4000);
			console.log('UPnP: Gateway found at', gatewayUrl);

			// Step 2 — Fetch device description, find WANIPConnection control URL
			const info = await this._fetchControlUrl(gatewayUrl);
			this._controlUrl = info.controlUrl;
			this._serviceType = info.serviceType;
			console.log('UPnP: Control URL:', this._controlUrl, '| Service:', this._serviceType);

			// Step 3 — Determine our LAN IP
			const internalIp = this._getInternalIp();
			console.log('UPnP: Internal IP:', internalIp);

			// Step 4 — Send AddPortMapping SOAP request
			await this._soapAddPortMapping(
				this._controlUrl,
				this._serviceType,
				externalPort,
				internalPort,
				internalIp,
				protocol,
				description,
				leaseDuration,
			);

			this._mappedPorts.push({ externalPort, protocol });
			console.log(`UPnP: SUCCESS — ${protocol} ${externalPort} → ${internalIp}:${internalPort}`);
			return true;
		} catch (err) {
			console.warn('UPnP: Port mapping failed:', err.message || err);
			return false;
		}
	}

	/**
	 * Remove a previously created mapping.
	 */
	async unmapPort(externalPort, protocol) {
		protocol = protocol || 'TCP';
		if (!this._controlUrl || !this._serviceType) return;
		try {
			await this._soapDeletePortMapping(this._controlUrl, this._serviceType, externalPort, protocol);
			this._mappedPorts = this._mappedPorts.filter(
				(m) => !(m.externalPort === externalPort && m.protocol === protocol),
			);
			console.log(`UPnP: Removed mapping ${protocol} ${externalPort}`);
		} catch (err) {
			console.warn('UPnP: Failed to remove mapping:', err.message || err);
		}
	}

	/**
	 * Remove all mappings we created. Call on shutdown.
	 */
	async unmapAll() {
		const copy = this._mappedPorts.slice();
		for (const m of copy) {
			await this.unmapPort(m.externalPort, m.protocol);
		}
	}

	// ── SSDP Discovery ────────────────────────────────────────────────────

	_ssdpDiscover(timeout) {
		return new Promise((resolve, reject) => {
			let resolved = false;
			const socket = _nat_dgram.createSocket({ type: 'udp4', reuseAddr: true });

			const timer = setTimeout(() => {
				if (!resolved) {
					resolved = true;
					try { socket.close(); } catch (e) { /* ignore */ }
					reject(new Error('UPnP SSDP discovery timed out'));
				}
			}, timeout);

			socket.on('message', (msg) => {
				if (resolved) return;
				const text = msg.toString();
				const match = text.match(/LOCATION:\s*(.*)/i);
				if (match) {
					resolved = true;
					clearTimeout(timer);
					try { socket.close(); } catch (e) { /* ignore */ }
					resolve(match[1].trim());
				}
			});

			socket.on('error', (err) => {
				if (!resolved) {
					resolved = true;
					clearTimeout(timer);
					try { socket.close(); } catch (e) { /* ignore */ }
					reject(err);
				}
			});

			// Search for Internet Gateway Device
			const targets = [
				'urn:schemas-upnp-org:device:InternetGatewayDevice:1',
				'urn:schemas-upnp-org:device:InternetGatewayDevice:2',
				'urn:schemas-upnp-org:service:WANIPConnection:1',
				'urn:schemas-upnp-org:service:WANPPPConnection:1',
			];

			const sendSearch = (st) => {
				const msg = Buffer.from(
					'M-SEARCH * HTTP/1.1\r\n'
					+ 'HOST: 239.255.255.250:1900\r\n'
					+ 'MAN: "ssdp:discover"\r\n'
					+ 'MX: 3\r\n'
					+ `ST: ${st}\r\n`
					+ '\r\n',
				);
				try {
					socket.send(msg, 0, msg.length, 1900, '239.255.255.250');
				} catch (e) { /* ignore send errors */ }
			};

			socket.bind(() => {
				// Send searches for all target types staggered slightly
				targets.forEach((st, i) => {
					setTimeout(() => sendSearch(st), i * 300);
				});
			});
		});
	}

	// ── Fetch & Parse Device Description ──────────────────────────────────

	_fetchControlUrl(deviceUrl) {
		return new Promise((resolve, reject) => {
			const timer = setTimeout(() => reject(new Error('UPnP device description fetch timeout')), 5000);

			_nat_http.get(deviceUrl, (res) => {
				let data = '';
				res.on('data', (chunk) => { data += chunk; });
				res.on('end', () => {
					clearTimeout(timer);
					try {
						const result = this._parseDeviceXml(data, deviceUrl);
						resolve(result);
					} catch (e) {
						reject(e);
					}
				});
			}).on('error', (err) => {
				clearTimeout(timer);
				reject(err);
			});
		});
	}

	_parseDeviceXml(xml, deviceUrl) {
		// Look for WANIPConnection or WANPPPConnection service types
		const serviceTypes = [
			'urn:schemas-upnp-org:service:WANIPConnection:1',
			'urn:schemas-upnp-org:service:WANIPConnection:2',
			'urn:schemas-upnp-org:service:WANPPPConnection:1',
		];

		for (const st of serviceTypes) {
			const idx = xml.indexOf(st);
			if (idx === -1) continue;

			// Find <controlURL> after this service type
			const after = xml.substring(idx);
			const ctrlMatch = after.match(/<controlURL>(.*?)<\/controlURL>/i);
			if (!ctrlMatch) continue;

			let controlPath = ctrlMatch[1].trim();

			// Make absolute if relative
			if (!controlPath.startsWith('http')) {
				try {
					const u = new URL(deviceUrl);
					controlPath = `${u.protocol}//${u.host}${controlPath.startsWith('/') ? '' : '/'}${controlPath}`;
				} catch (e) {
					// Fallback: simple string concat
					const m = deviceUrl.match(/^(https?:\/\/[^/]+)/);
					if (m) controlPath = m[1] + (controlPath.startsWith('/') ? '' : '/') + controlPath;
				}
			}

			return { controlUrl: controlPath, serviceType: st };
		}
		throw new Error('No WANIPConnection/WANPPPConnection service found in UPnP device description');
	}

	// ── SOAP Requests ────────────────────────────────────────────────────

	_soapAddPortMapping(controlUrl, serviceType, extPort, intPort, intIp, protocol, desc, lease) {
		const body = [
			'<?xml version="1.0" encoding="utf-8"?>',
			'<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">',
			'<s:Body>',
			`<u:AddPortMapping xmlns:u="${serviceType}">`,
			'<NewRemoteHost></NewRemoteHost>',
			`<NewExternalPort>${extPort}</NewExternalPort>`,
			`<NewProtocol>${protocol}</NewProtocol>`,
			`<NewInternalPort>${intPort}</NewInternalPort>`,
			`<NewInternalClient>${intIp}</NewInternalClient>`,
			'<NewEnabled>1</NewEnabled>',
			`<NewPortMappingDescription>${desc}</NewPortMappingDescription>`,
			`<NewLeaseDuration>${lease}</NewLeaseDuration>`,
			'</u:AddPortMapping>',
			'</s:Body>',
			'</s:Envelope>',
		].join('');

		return this._soapRequest(controlUrl, serviceType, 'AddPortMapping', body);
	}

	_soapDeletePortMapping(controlUrl, serviceType, extPort, protocol) {
		const body = [
			'<?xml version="1.0" encoding="utf-8"?>',
			'<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">',
			'<s:Body>',
			`<u:DeletePortMapping xmlns:u="${serviceType}">`,
			'<NewRemoteHost></NewRemoteHost>',
			`<NewExternalPort>${extPort}</NewExternalPort>`,
			`<NewProtocol>${protocol}</NewProtocol>`,
			'</u:DeletePortMapping>',
			'</s:Body>',
			'</s:Envelope>',
		].join('');

		return this._soapRequest(controlUrl, serviceType, 'DeletePortMapping', body);
	}

	_soapRequest(controlUrl, serviceType, action, body) {
		return new Promise((resolve, reject) => {
			let parsed;
			try {
				parsed = new URL(controlUrl);
			} catch (e) {
				// Fallback for older Node.js without URL constructor
				const m = controlUrl.match(/^(https?):\/\/([^:/]+)(?::(\d+))?(\/.*)?$/);
				if (!m) return reject(new Error('Invalid control URL: ' + controlUrl));
				parsed = {
					protocol: m[1] + ':',
					hostname: m[2],
					port: m[3] || (m[1] === 'https' ? '443' : '80'),
					pathname: m[4] || '/',
				};
			}

			const options = {
				hostname: parsed.hostname,
				port: parseInt(parsed.port, 10) || 80,
				path: parsed.pathname || '/',
				method: 'POST',
				headers: {
					'Content-Type': 'text/xml; charset="utf-8"',
					'Content-Length': Buffer.byteLength(body),
					SOAPAction: `"${serviceType}#${action}"`,
				},
			};

			const req = _nat_http.request(options, (res) => {
				let data = '';
				res.on('data', (chunk) => { data += chunk; });
				res.on('end', () => {
					if (res.statusCode === 200 || res.statusCode === 204) {
						resolve(data);
					} else {
						reject(new Error(`SOAP ${action} failed: HTTP ${res.statusCode} — ${data.substring(0, 300)}`));
					}
				});
			});

			req.on('error', reject);
			req.setTimeout(5000, () => {
				req.destroy();
				reject(new Error(`SOAP ${action} request timed out`));
			});
			req.write(body);
			req.end();
		});
	}

	// ── Helpers ───────────────────────────────────────────────────────────

	_getInternalIp() {
		try {
			if (_nat_os) {
				const nets = _nat_os.networkInterfaces();
				for (const name of Object.keys(nets)) {
					for (const iface of nets[name]) {
						if (iface.family === 'IPv4' && !iface.internal) {
							return iface.address;
						}
					}
				}
			}
		} catch (e) { /* ignore */ }
		return '127.0.0.1';
	}
}


// ═══════════════════════════════════════════════════════════════════════════
//  TCP Hole Punch Helper (requires a rendezvous server)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TCP Hole Punching works by having both peers simultaneously initiate
 * TCP connections to each other. The SYN packets create NAT mappings,
 * and when the other peer's SYN arrives, the NAT lets it through.
 *
 * This requires:
 *   1. A rendezvous server where both peers register their endpoints
 *   2. Both peers knowing each other's public IP and port
 *   3. Simultaneous connection attempts
 *
 * The rendezvous server is a simple HTTP service (see rendezvousServer.js).
 */
class TcpHolePuncher {
	/**
	 * @param {string} rendezvousUrl - Base URL of the rendezvous server (e.g. "http://my-server.com:9999")
	 */
	constructor(rendezvousUrl) {
		this.rendezvousUrl = rendezvousUrl ? rendezvousUrl.replace(/\/+$/, '') : null;
		this._pollingInterval = null;
	}

	/**
	 * Check if hole punching is available (rendezvous URL configured).
	 */
	get isAvailable() {
		return !!this.rendezvousUrl;
	}

	// ── Rendezvous HTTP Client ────────────────────────────────────────────

	/**
	 * Register this peer at the rendezvous server.
	 * @param {string} roomId   - Unique room identifier (typically host's peer ID)
	 * @param {'host'|'client'} role
	 * @param {string} publicIp
	 * @param {number} port
	 * @returns {Promise<object>}
	 */
	async registerEndpoint(roomId, role, publicIp, port) {
		const payload = JSON.stringify({ roomId, role, publicIp, port });
		return this._httpPost(`${this.rendezvousUrl}/api/register`, payload);
	}

	/**
	 * Fetch current room info from the rendezvous server.
	 * @param {string} roomId
	 * @returns {Promise<{host: {publicIp, port}, clients: [{publicIp, port}]}>}
	 */
	async getRoomInfo(roomId) {
		return this._httpGet(`${this.rendezvousUrl}/api/room/${encodeURIComponent(roomId)}`);
	}

	/**
	 * Unregister / clean up the room.
	 * @param {string} roomId
	 */
	async unregister(roomId) {
		try {
			await this._httpPost(`${this.rendezvousUrl}/api/unregister`, JSON.stringify({ roomId }));
		} catch (e) { /* best-effort */ }
	}

	// ── Host-Side: Poll for pending clients and connect back ─────────────

	/**
	 * Start polling the rendezvous for new clients and attempt to connect to them.
	 * Called by the host after registering.
	 *
	 * @param {string} roomId
	 * @param {function(string, number): void} onClientDiscovered - callback(ip, port) to initiate connection
	 * @param {number} [intervalMs=3000]
	 */
	startHostPolling(roomId, onClientDiscovered, intervalMs) {
		intervalMs = intervalMs || 3000;
		const knownClients = new Set();

		this.stopPolling();

		this._pollingInterval = setInterval(async () => {
			try {
				const info = await this.getRoomInfo(roomId);
				if (info && info.clients && Array.isArray(info.clients)) {
					for (const client of info.clients) {
						const key = `${client.publicIp}:${client.port}`;
						if (!knownClients.has(key)) {
							knownClients.add(key);
							console.log(`HolePunch: Host discovered new client at ${key}`);
							onClientDiscovered(client.publicIp, client.port);
						}
					}
				}
			} catch (e) {
				// Rendezvous may be temporarily unavailable — just log
				console.warn('HolePunch: Host poll error:', e.message || e);
			}
		}, intervalMs);
	}

	/**
	 * Stop polling.
	 */
	stopPolling() {
		if (this._pollingInterval) {
			clearInterval(this._pollingInterval);
			this._pollingInterval = null;
		}
	}

	// ── Client-Side: Simultaneous Open Attempt ───────────────────────────

	/**
	 * Attempt TCP hole punching from the client side.
	 *
	 * Flow:
	 * 1. Open a local TCP server on `localPort` to accept incoming connections.
	 * 2. Register our endpoint at the rendezvous so the host can find us.
	 * 3. Simultaneously try connecting to the host (creates outbound NAT mapping).
	 * 4. Wait for either:
	 *    - Our outgoing connection to the host succeeds (host's NAT let us through)
	 *    - The host's incoming connection arrives on our server (our NAT let host through)
	 * 5. Return whichever socket succeeds first.
	 *
	 * @param {string} roomId       - The host's room/peer ID
	 * @param {string} remoteHost   - Host's public IP
	 * @param {number} remotePort   - Host's public port
	 * @param {string} localPublicIp - Our public IP
	 * @param {number} localPort    - Port to bind locally (and announce to rendezvous)
	 * @param {number} [timeout=15000] - Max time to wait
	 * @returns {Promise<net.Socket|null>} Connected socket or null
	 */
	attemptHolePunch(roomId, remoteHost, remotePort, localPublicIp, localPort, timeout) {
		timeout = timeout || 15000;

		return new Promise(async (resolve) => {
			let settled = false;
			let tempServer = null;
			const pendingSockets = [];

			const cleanup = (winner) => {
				if (settled) return;
				settled = true;
				clearTimeout(timer);

				// Close temp server
				if (tempServer) {
					try { tempServer.close(); } catch (e) { /* ignore */ }
					tempServer = null;
				}

				// Destroy all sockets except the winner
				for (const s of pendingSockets) {
					if (s !== winner && !s.destroyed) {
						try { s.destroy(); } catch (e) { /* ignore */ }
					}
				}

				resolve(winner || null);
			};

			const timer = setTimeout(() => {
				console.warn('HolePunch: Client timeout — hole punch failed');
				cleanup(null);
			}, timeout);

			// ── 1. Open a local listening server ──────────────────────────
			try {
				tempServer = _nat_net.createServer((incomingSocket) => {
					if (settled) {
						incomingSocket.destroy();
						return;
					}
					console.log('HolePunch: Incoming connection received on local server!');
					pendingSockets.push(incomingSocket);
					cleanup(incomingSocket);
				});

				tempServer.on('error', (err) => {
					console.warn('HolePunch: Local server error:', err.message);
					// Don't fail entirely — outgoing connect may still work
				});

				tempServer.listen(localPort, '0.0.0.0', () => {
					console.log(`HolePunch: Local server listening on port ${localPort}`);
				});
			} catch (e) {
				console.warn('HolePunch: Failed to create local server:', e.message);
			}

			// ── 2. Register at rendezvous ─────────────────────────────────
			try {
				await this.registerEndpoint(roomId, 'client', localPublicIp, localPort);
				console.log('HolePunch: Registered at rendezvous as client');
			} catch (e) {
				console.warn('HolePunch: Failed to register at rendezvous:', e.message);
				// Continue anyway — we can still try the outgoing connection
			}

			// ── 3. Simultaneously attempt outgoing connections ────────────
			// We send multiple connection attempts with slight delays to
			// increase the chance of the SYN timing aligning with the host's SYN.
			const attemptCount = 5;
			const attemptDelay = 1500; // ms between attempts

			for (let i = 0; i < attemptCount && !settled; i++) {
				if (i > 0) {
					await this._sleep(attemptDelay);
					if (settled) break;
				}

				console.log(`HolePunch: Outgoing connection attempt ${i + 1}/${attemptCount} to ${remoteHost}:${remotePort}`);

				const connectOptions = {
					host: remoteHost,
					port: remotePort,
				};

				// Try to use localPort if the Node.js version supports it.
				// This makes the NAT mapping consistent (same source port for both
				// the outgoing connection and the listening server).
				// If not supported, the connection still works but relies on the
				// host's outgoing SYN arriving at our server port instead.
				try {
					connectOptions.localAddress = '0.0.0.0';
					connectOptions.localPort = localPort;
				} catch (e) { /* localPort not supported — ignore */ }

				const sock = new _nat_net.Socket();
				pendingSockets.push(sock);

				sock.on('connect', () => {
					if (!settled) {
						console.log('HolePunch: Outgoing connection succeeded!');
						cleanup(sock);
					}
				});

				// EADDRINUSE is expected when localPort is already bound by the server
				// ECONNREFUSED / ETIMEDOUT are expected when the NAT blocks us
				sock.on('error', (err) => {
					if (err.code === 'EADDRINUSE') {
						// localPort is taken by our server — retry without localPort
						const sock2 = new _nat_net.Socket();
						pendingSockets.push(sock2);
						sock2.on('connect', () => {
							if (!settled) {
								console.log('HolePunch: Outgoing connection (no localPort) succeeded!');
								cleanup(sock2);
							}
						});
						sock2.on('error', () => { /* expected */ });
						sock2.connect({ host: remoteHost, port: remotePort });
					}
					// Other errors are expected — the hole punch may still succeed via the server
				});

				try {
					sock.connect(connectOptions);
				} catch (e) {
					// If localPort throws, retry without it
					if (e.message && e.message.includes('localPort')) {
						sock.connect({ host: remoteHost, port: remotePort });
					}
				}
			}
		});
	}

	// ── HTTP Helpers ──────────────────────────────────────────────────────

	_httpGet(urlStr) {
		return new Promise((resolve, reject) => {
			const req = _nat_http.get(urlStr, (res) => {
				let data = '';
				res.on('data', (chunk) => { data += chunk; });
				res.on('end', () => {
					if (res.statusCode >= 200 && res.statusCode < 300) {
						try {
							resolve(JSON.parse(data));
						} catch (e) {
							reject(new Error('Invalid JSON from rendezvous: ' + data.substring(0, 200)));
						}
					} else {
						reject(new Error(`Rendezvous GET ${res.statusCode}: ${data.substring(0, 200)}`));
					}
				});
			});
			req.on('error', reject);
			req.setTimeout(5000, () => {
				req.destroy();
				reject(new Error('Rendezvous GET timeout'));
			});
		});
	}

	_httpPost(urlStr, jsonBody) {
		return new Promise((resolve, reject) => {
			let parsed;
			try {
				parsed = new URL(urlStr);
			} catch (e) {
				const m = urlStr.match(/^(https?):\/\/([^:/]+)(?::(\d+))?(\/.*)?$/);
				if (!m) return reject(new Error('Invalid rendezvous URL: ' + urlStr));
				parsed = {
					protocol: m[1] + ':',
					hostname: m[2],
					port: m[3] || '80',
					pathname: m[4] || '/',
				};
			}

			const options = {
				hostname: parsed.hostname,
				port: parseInt(parsed.port, 10) || 80,
				path: parsed.pathname || '/',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': Buffer.byteLength(jsonBody),
				},
			};

			const req = _nat_http.request(options, (res) => {
				let data = '';
				res.on('data', (chunk) => { data += chunk; });
				res.on('end', () => {
					if (res.statusCode >= 200 && res.statusCode < 300) {
						try {
							resolve(data ? JSON.parse(data) : {});
						} catch (e) {
							resolve({});
						}
					} else {
						reject(new Error(`Rendezvous POST ${res.statusCode}: ${data.substring(0, 200)}`));
					}
				});
			});
			req.on('error', reject);
			req.setTimeout(5000, () => {
				req.destroy();
				reject(new Error('Rendezvous POST timeout'));
			});
			req.write(jsonBody);
			req.end();
		});
	}

	_sleep(ms) {
		return new Promise((r) => setTimeout(r, ms));
	}
}


// ═══════════════════════════════════════════════════════════════════════════
//  Global Exposure
// ═══════════════════════════════════════════════════════════════════════════
if (typeof window !== 'undefined') {
	window.UPnPMapper = UPnPMapper;
	window.TcpHolePuncher = TcpHolePuncher;
}

// CommonJS export (for tests / direct require)
try {
	module.exports = { UPnPMapper, TcpHolePuncher };
} catch (e) { /* not in a CJS environment */ }
