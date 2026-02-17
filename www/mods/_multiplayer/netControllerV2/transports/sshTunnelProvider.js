/* eslint-disable no-console */
const { spawn } = require('child_process');

/**
 * @description Provides SSH-based TCP tunneling through free relay services.
 * Uses the system-installed SSH client (OpenSSH, built into Windows 10+ and all modern Linux/Mac)
 * to create reverse tunnels, allowing hosting without port forwarding.
 *
 * Tunnel chain (tried in order, first success wins):
 *   1. serveo.net  — Free TCP tunnel, no signup, no time limit
 *   2. pinggy.io   — Free TCP tunnel, no signup, 60-min sessions
 *
 * If all services fail, returns null so the caller can fall back to direct TCP.
 *
 * @class
 */
class SSHTunnelProvider {
	/**
	 * @param {number} localPort The local TCP port to tunnel
	 */
	constructor(localPort) {
		this.localPort = localPort;
		/** @type {import('child_process').ChildProcess|null} */
		this.process = null;
		/** @type {string|null} The public address (host:port) assigned by the tunnel service */
		this.publicAddress = null;
		/** @type {string|null} Name of the service that succeeded */
		this.serviceName = null;
		this._destroyed = false;
	}

	/**
	 * @description Attempt to establish a tunnel through available free SSH tunnel services.
	 * Tries each service in order, returning on the first success.
	 * @returns {Promise<string|null>} The public address (host:port) on success, or null if all fail.
	 */
	async tryEstablish() {
		if (this._destroyed) return null;

		const sshAvailable = await SSHTunnelProvider.isSSHAvailable();
		if (!sshAvailable) {
			console.warn('SSHTunnelProvider: SSH client not found on this system.');
			console.warn('SSHTunnelProvider: On Windows 10+, enable "OpenSSH Client" in Settings → Apps → Optional Features.');
			return null;
		}

		const services = [
			{ name: 'serveo.net', fn: () => this._tryServeo() },
			{ name: 'pinggy.io', fn: () => this._tryPinggy() },
		];

		for (const service of services) {
			if (this._destroyed) return null;
			console.log(`SSHTunnelProvider: Trying ${service.name}...`);
			try {
				// eslint-disable-next-line no-await-in-loop
				const address = await service.fn();
				if (address) {
					this.serviceName = service.name;
					this.publicAddress = address;
					console.log(`SSHTunnelProvider: Tunnel established via ${service.name} → ${address}`);
					return address;
				}
			} catch (e) {
				console.warn(`SSHTunnelProvider: ${service.name} failed:`, e.message);
			}
			// Clean up any leftover process before trying the next service
			this._killCurrentProcess();
		}

		console.warn('SSHTunnelProvider: All tunnel services failed.');
		return null;
	}

	/**
	 * @description Check if the system SSH client is available.
	 * @returns {Promise<boolean>}
	 */
	static isSSHAvailable() {
		return new Promise((resolve) => {
			const timer = setTimeout(() => resolve(false), 5000);
			try {
				const proc = spawn('ssh', ['-V'], {
					shell: true,
					stdio: ['ignore', 'pipe', 'pipe'],
					windowsHide: true,
				});
				let resolved = false;
				const done = (val) => {
					if (!resolved) {
						resolved = true;
						clearTimeout(timer);
						try { proc.kill(); } catch (_) { /* ignore */ }
						resolve(val);
					}
				};
				// ssh -V outputs version info to stderr
				proc.stdout.on('data', () => done(true));
				proc.stderr.on('data', () => done(true));
				proc.on('error', () => done(false));
				proc.on('close', (code) => done(code === 0));
			} catch (_) {
				clearTimeout(timer);
				resolve(false);
			}
		});
	}

	/**
	 * @returns {string} The null device path for the current OS.
	 */
	static _getNullDevice() {
		return process.platform === 'win32' ? 'NUL' : '/dev/null';
	}

	/**
	 * @description Build common SSH arguments for reverse tunneling.
	 * @param {string} remoteSpec  -R argument value (e.g. "0:localhost:6878")
	 * @param {string} host        SSH server hostname
	 * @param {number} [port=22]   SSH server port
	 * @returns {string[]}
	 */
	static _buildSSHArgs(remoteSpec, host, port = 22) {
		return [
			'-o', 'StrictHostKeyChecking=no',
			'-o', `UserKnownHostsFile=${SSHTunnelProvider._getNullDevice()}`,
			'-o', 'ServerAliveInterval=60',
			'-o', 'ServerAliveCountMax=3',
			'-o', 'ExitOnForwardFailure=yes',
			'-o', 'ConnectTimeout=10',
			'-p', String(port),
			'-N', // No remote command
			'-R', remoteSpec,
			host,
		];
	}

	// ----------------------------------------------------------------
	//  Service-specific tunnel attempts
	// ----------------------------------------------------------------

	/**
	 * @description Try serveo.net reverse TCP tunnel.
	 * Command: ssh -R 0:localhost:PORT serveo.net
	 * Expected output: "Forwarding TCP connections from serveo.net:PORT"
	 * @returns {Promise<string|null>}
	 */
	_tryServeo() {
		return this._attemptSSHTunnel({
			serviceName: 'serveo.net',
			remoteSpec: `0:localhost:${this.localPort}`,
			host: 'serveo.net',
			port: 22,
			// Match: "Forwarding TCP connections from serveo.net:12345"
			outputPattern: /Forwarding\s+TCP\s+connections?\s+from\s+(\S+:\d+)/i,
			timeoutMs: 15000,
		});
	}

	/**
	 * @description Try pinggy.io reverse TCP tunnel.
	 * Command: ssh -p 443 -R 0:localhost:PORT a.pinggy.io
	 * Expected output includes: "tcp://HOST:PORT"
	 * @returns {Promise<string|null>}
	 */
	_tryPinggy() {
		return this._attemptSSHTunnel({
			serviceName: 'pinggy.io',
			remoteSpec: `0:localhost:${this.localPort}`,
			host: 'a.pinggy.io',
			port: 443,
			// Match: "tcp://xxxxxx.free.pinggy.link:12345"
			outputPattern: /tcp:\/\/([^\s/]+:\d+)/i,
			timeoutMs: 20000,
		});
	}

	// ----------------------------------------------------------------
	//  Generic tunnel engine
	// ----------------------------------------------------------------

	/**
	 * @description Spawn an SSH process for reverse tunneling and wait for the public address.
	 * @param {Object} config
	 * @param {string} config.serviceName   Display name for logging
	 * @param {string} config.remoteSpec    SSH -R argument
	 * @param {string} config.host          SSH server hostname
	 * @param {number} config.port          SSH server port
	 * @param {RegExp} config.outputPattern Regex whose capture group 1 is the public host:port
	 * @param {number} config.timeoutMs     Maximum wait time in ms
	 * @returns {Promise<string|null>}
	 */
	_attemptSSHTunnel(config) {
		return new Promise((resolve) => {
			if (this._destroyed) { resolve(null); return; }

			const {
				serviceName, remoteSpec, host, port, outputPattern, timeoutMs,
			} = config;

			const timeout = setTimeout(() => {
				console.warn(`SSHTunnelProvider: ${serviceName} timed out after ${timeoutMs}ms`);
				this._killCurrentProcess();
				resolve(null);
			}, timeoutMs);

			const args = SSHTunnelProvider._buildSSHArgs(remoteSpec, host, port);
			console.log(`SSHTunnelProvider: Spawning: ssh ${args.join(' ')}`);

			try {
				this.process = spawn('ssh', args, {
					stdio: ['ignore', 'pipe', 'pipe'],
					windowsHide: true,
				});
			} catch (e) {
				clearTimeout(timeout);
				console.warn(`SSHTunnelProvider: Failed to spawn SSH for ${serviceName}:`, e.message);
				resolve(null);
				return;
			}

			let allOutput = '';
			let resolved = false;

			const checkOutput = (chunk) => {
				if (resolved || this._destroyed) return;
				const text = chunk.toString();
				allOutput += text;
				console.log(`SSHTunnelProvider [${serviceName}]: ${text.trim()}`);

				const match = allOutput.match(outputPattern);
				if (match && match[1]) {
					resolved = true;
					clearTimeout(timeout);
					resolve(match[1]);
				}
			};

			this.process.stdout.on('data', checkOutput);
			this.process.stderr.on('data', checkOutput);

			this.process.on('error', (err) => {
				if (!resolved) {
					resolved = true;
					clearTimeout(timeout);
					console.warn(`SSHTunnelProvider: ${serviceName} process error:`, err.message);
					resolve(null);
				}
			});

			this.process.on('close', (code) => {
				if (!resolved) {
					resolved = true;
					clearTimeout(timeout);
					console.warn(`SSHTunnelProvider: ${serviceName} exited with code ${code}. Output so far: ${allOutput.substring(0, 300)}`);
					resolve(null);
				}
			});
		});
	}

	// ----------------------------------------------------------------
	//  Lifecycle
	// ----------------------------------------------------------------

	/**
	 * @description Kill the current SSH tunnel process.
	 */
	_killCurrentProcess() {
		if (this.process) {
			const proc = this.process;
			this.process = null;
			if (!proc.killed) {
				try {
					proc.kill('SIGTERM');
					// Force kill after 2 s if it hasn't exited
					setTimeout(() => {
						try { if (!proc.killed) proc.kill('SIGKILL'); } catch (_) { /* ignore */ }
					}, 2000);
				} catch (_) { /* process may have already exited */ }
			}
		}
	}

	/**
	 * @description Destroy the tunnel provider and release all resources.
	 */
	destroy() {
		this._destroyed = true;
		this._killCurrentProcess();
		this.publicAddress = null;
		this.serviceName = null;
	}
}
