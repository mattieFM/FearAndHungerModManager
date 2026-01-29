const net = require('net');
const http = require('http');
const { Resolver } = require('dns');

let os;
try {
	os = require('os');
} catch (e) {
	console.error("NodeTcpTransport: Failed to require 'os'. IP generation will fail.", e);
}

class NodeTcpTransport extends EventEmitter {
	constructor(isHost, port = 6878) {
		super();
		this.isHost = isHost;
		this.port = port;
		this.server = null;
		this.sockets = []; // For host: all connected clients
		this.clientSocket = null; // For client: connection to host

		try {
			this.id = this.generateId(); // Identify self
		} catch (e) {
			console.error('NodeTcpTransport: Critical error in generateId', e);
			this.id = 'error_generating_id';
		}

		// Auto-start to mimic PeerJS behavior
		setTimeout(() => this.open(), 0);

		// Ensure cleanup on window close/reload
		if (typeof window !== 'undefined') {
			window.addEventListener('beforeunload', () => {
				this.destroy();
			});
		}
	}

	generateId() {
		try {
            // Append random suffix to Ensure uniqueness even on same machine
            // This fixes "Same IP" loopback issues where PeerIDs collided
            const randomSuffix = Math.floor(Math.random() * 10000).toString(16);

			if (os) {
				const nets = os.networkInterfaces();
				for (const name of Object.keys(nets)) {
					for (const netObj of nets[name]) {
						if (netObj.family === 'IPv4' && !netObj.internal) {
							const id = `${netObj.address}:${this.port}_${randomSuffix}`;
                            console.log('NodeTcpTransport: Generated Unique IP ID: ', id);
							return id;
						}
					}
				}
			} else {
				console.warn("NodeTcpTransport: 'os' module not available.");
			}
		} catch (e) {
			console.error('NodeTcpTransport: Error generating IP-based ID', e);
		}
		// Simple random ID generation
		console.warn('NodeTcpTransport: Falling back to random ID.');
		return `user_${Math.floor(Math.random() * 16777215).toString(16)}:${this.port}`;
	}

	async getPublicIp() {
        // Method 1: OpenDNS via DNS (No HTTP)
		const tryDns = () => new Promise((resolve, reject) => {
			try {
				const resolver = new Resolver();
				resolver.setServers(['208.67.222.222', '208.67.220.220']); // OpenDNS Servers

				// 3s timeout
				const timer = setTimeout(() => {
					resolver.cancel();
					reject(new Error('Public IP DNS lookup timeout'));
				}, 3000);

				resolver.resolve4('myip.opendns.com', (err, addresses) => {
					clearTimeout(timer);
					if (err) {
						reject(err);
						return;
					}
					if (addresses && addresses.length > 0) {
						resolve(addresses[0]);
					} else {
						reject(new Error('No IP address found via DNS'));
					}
				});
			} catch (e) {
				reject(e);
			}
		});

        // Method 2: AWS CheckIP via HTTP (Fallback)
        const tryHttp = () => new Promise((resolve, reject) => {
            const req = http.get('http://checkip.amazonaws.com/', (res) => {
                if (res.statusCode !== 200) {
                    res.resume();
                    reject(new Error(`HTTP Status: ${res.statusCode}`));
                    return;
                }
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(data.trim()));
            });
            req.on('error', reject);
            req.setTimeout(3000, () => {
                req.destroy();
                reject(new Error('HTTP timeout'));
            });
        });

        try {
            return await tryDns();
        } catch (dnsError) {
            console.warn('NodeTcpTransport: DNS lookup failed, trying HTTP fallback...', dnsError.message);
            return await tryHttp();
        }
	}

	open() {
		console.log(`NodeTcpTransport: opening... (Host: ${this.isHost})`);
		if (this.isHost) {
			// Create connection handler function to avoid duplication
			const createConnectionHandler = (socket) => {
				socket._buffer = ''; // Data buffer
				socket._handshakeDone = false;

				// socket.id is not set yet. waiting for handshake.
				console.log('Client connected (TCP level), waiting for handshake...');
				this.sockets.push(socket);

				socket.on('data', (chunk) => {
					this.handleIncomingData(socket, chunk);
				});

				socket.on('close', () => {
					this.sockets = this.sockets.filter((s) => s !== socket);
					if (socket._wrapper) socket._wrapper.emit('close');
				});

				socket.on('error', (err) => {
					console.error('Socket error', err);
					if (socket._wrapper) socket._wrapper.emit('error', err);
				});
			};

			this.server = net.createServer(createConnectionHandler);

			// Add retry logic for EADDRINUSE errors with automatic port switching
			const attemptListen = (retries = 3, delay = 1000, maxPortAttempts = 10) => {
				this.server.listen(this.port, async () => {
					console.log(`TCP Host listening on port ${this.port}`);
					
                    if (this.port !== 6878 && typeof window !== 'undefined' && window.alert) {
                        window.alert(`port 6878 was taken, the next free avalible port was ${this.port}, if having connection issues allow this port through your network.`);
                    }

                    // Try to resolve Public IP for the Host ID
                    try {
                        console.log('NodeTcpTransport: Attempting to resolve Public IP...');
                        const publicIp = await this.getPublicIp();
                        if (publicIp) {
                            const randomSuffix = Math.floor(Math.random() * 10000).toString(16);
                            this.id = `${publicIp}:${this.port}_${randomSuffix}`;
                            console.log('NodeTcpTransport: Successfully resolved Public IP ID:', this.id);
                        } else {
                            throw new Error("No IP returned");
                        }
                    } catch (e) {
                         console.warn('NodeTcpTransport: Failed to get Public IP, falling back to Local IP.', e.message);
                         // Regenerate ID with correct port (Local fallback)
					     this.id = this.generateId();

                         if (typeof window !== 'undefined' && window.alert) {
                             window.alert(`UNABLE TO DETECT PUBLIC IP.\n(DNS and HTTP checks failed)\n\nFalling back to Local Private IP: ${this.id}\n\nPlayers outside your local network may not be able to join unless you manually Port Forward and provide your Public IP.`);
                         }
                    }

					this.emit('open', this.id);
				});

				this.server.once('error', (err) => {
					if (err.code === 'EADDRINUSE' && retries > 0) {
						console.warn(`Port ${this.port} is in use, retrying... (${retries} retries left)`);
						this.server.close(() => {
							setTimeout(() => attemptListen(retries - 1, delay, maxPortAttempts), delay);
						});
					} else if (err.code === 'EADDRINUSE' && retries === 0 && maxPortAttempts > 0) {
						// Switch to next port
						this.port++;
						console.warn(`All retries failed on previous port. Switching to port ${this.port}... (${maxPortAttempts - 1} port attempts remaining)`);
						this.server.close(() => {
							// Recreate server for new port with fresh state
							this.server = net.createServer(createConnectionHandler);
							// Try next port with fresh retry count
							setTimeout(() => attemptListen(3, delay, maxPortAttempts - 1), delay);
						});
					} else if (err.code === 'EADDRINUSE' && maxPortAttempts === 0) {
						console.error(`Failed to bind after trying multiple ports. All ports in range appear to be in use.`);
						this.emit('error', err);
					} else {
						this.emit('error', err);
					}
				});
			};

			attemptListen();
		} else {
			// Client "open" is immediate as it's just ready to connect
			setTimeout(() => this.emit('open', this.id), 10);
		}
	}

	connect(hostAddress) {
		if (this.isHost) return null;

		// Handle address format if needed (e.g. "127.0.0.1:6878" or just "127.0.0.1")
        // If connecting to a PeerID with suffix (e.g. 192.168.1.5:6878_a1b2), strip the suffix for the actual TCP connection
		let host = hostAddress;
		let port = this.port;
        
        let targetPeerId = hostAddress; // The ID we expect to talk to (or just the IP if user typed short)

        // Remove suffix for connection parsing
        let connectString = hostAddress;
        if (hostAddress.includes('_')) {
             connectString = hostAddress.split('_')[0];
        }

		if (connectString.includes(':')) {
			const parts = connectString.split(':');
			host = parts[0];
			port = parseInt(parts[1], 10);
		}

		const socket = new net.Socket();
		this.clientSocket = socket;
		socket.id = targetPeerId; // Set the peer ID (initially just the target address)

		socket._buffer = '';
		socket._handshakeDone = true; // Client assumes host is ready

		socket.connect(port, host, () => {
			console.log('Connected to host, sending handshake...');

			// 1. Send Handshake
			const handshake = `${JSON.stringify({ type: 'HANDSHAKE', peerId: this.id })}\n`;
			socket.write(handshake);

			// 2. Emit open for wrapper
			const connectionWrapper = this.createConnectionWrapper(socket);
			connectionWrapper.emit('open');
		});

		const connectionWrapper = this.createConnectionWrapper(socket);

		socket.on('data', (chunk) => {
			this.handleIncomingData(socket, chunk);
		});

		socket.on('close', () => { connectionWrapper.emit('close'); });
		socket.on('error', (err) => { connectionWrapper.emit('error', err); });

		return connectionWrapper;
	}

	disconnect() {
		this.destroy();
	}

	destroy() {
		console.log('NodeTcpTransport: Destroying...');
		if (this.server) {
			// Unref to allow process to exit cleanly
			if (this.server.unref) this.server.unref();
			this.server.close(() => console.log('Server closed'));
			// Force close all active connections
			this.sockets.forEach((s) => {
				if (!s.destroyed) s.destroy();
			});
			this.server = null;
		}
		if (this.clientSocket) {
			if (!this.clientSocket.destroyed) {
				this.clientSocket.destroy();
			}
			this.clientSocket = null;
		}
		this.sockets.forEach((s) => {
			if (!s.destroyed) s.destroy();
		});
		this.sockets = [];
		this.emit('close');
		this.emit('disconnected'); // PeerJS emits disconnected too
	}

	handleIncomingData(socket, chunk) {
		socket._buffer += chunk.toString();

		let d_index = socket._buffer.indexOf('\n');
		while (d_index > -1) {
			const line = socket._buffer.substring(0, d_index);
			socket._buffer = socket._buffer.substring(d_index + 1);

			if (line.trim()) {
				if (this.isHost && !socket._handshakeDone) {
					this.processHandshake(socket, line);
				} else {
					this.processMessage(socket, line);
				}
			}
			d_index = socket._buffer.indexOf('\n');
		}
	}

	processHandshake(socket, line) {
		try {
			const msg = JSON.parse(line);
			if (msg.type === 'HANDSHAKE' && msg.peerId) {
				socket.id = msg.peerId;
				socket._handshakeDone = true;
				console.log('Handshake successful. PeerID:', socket.id);

				// Now emit connection event for host controller
				const wrapper = this.createConnectionWrapper(socket);
				this.emit('connection', wrapper);
			} else {
				console.warn('Invalid handshake received:', line);
				socket.destroy();
			}
		} catch (e) {
			console.error('Handshake error', e);
			socket.destroy();
		}
	}

	processMessage(socket, line) {
		try {
			const msg = JSON.parse(line);
			const wrapper = this.createConnectionWrapper(socket);
			wrapper.emit('data', msg);
		} catch (e) {
			console.error('Failed to parse message', e);
		}
	}

	createConnectionWrapper(socket) {
		if (socket._wrapper) return socket._wrapper;

		const wrapper = new EventEmitter();
		wrapper.peer = socket.id || 'unknown_pending'; // The ID of the other end
		wrapper.send = (data) => {
			try {
				const str = `${JSON.stringify(data)}\n`;
				if (!socket.destroyed) {
					socket.write(str);
				}
			} catch (e) {
				console.error('Send error', e);
			}
		};
		wrapper.close = () => socket.destroy();

		socket._wrapper = wrapper;
		return wrapper;
	}
}
