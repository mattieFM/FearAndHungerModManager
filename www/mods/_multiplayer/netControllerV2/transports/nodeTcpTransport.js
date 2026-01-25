const net = require('net');

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
			if (os) {
				const nets = os.networkInterfaces();
				for (const name of Object.keys(nets)) {
					for (const netObj of nets[name]) {
						if (netObj.family === 'IPv4' && !netObj.internal) {
							console.log('NodeTcpTransport: Found IP ID: ', netObj.address);
							return `${netObj.address}:${this.port}`;
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

	open() {
		console.log(`NodeTcpTransport: opening... (Host: ${this.isHost})`);
		if (this.isHost) {
			this.server = net.createServer((socket) => {
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
			});

			this.server.listen(this.port, () => {
				console.log(`TCP Host listening on port ${this.port}`);
				this.emit('open', this.id);
			});

			this.server.on('error', (err) => {
				this.emit('error', err);
			});
		} else {
			// Client "open" is immediate as it's just ready to connect
			setTimeout(() => this.emit('open', this.id), 10);
		}
	}

	connect(hostAddress) {
		if (this.isHost) return null;

		// Handle address format if needed (e.g. "127.0.0.1:6878" or just "127.0.0.1")
		let host = hostAddress;
		let port = this.port;
		if (host.includes(':')) {
			const parts = host.split(':');
			host = parts[0];
			port = parseInt(parts[1], 10);
		}

		const socket = new net.Socket();
		this.clientSocket = socket;
		socket.id = hostAddress; // Set the peer ID to the address we are connecting to

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
			this.server.close(() => console.log('Server closed'));
			this.server = null;
		}
		if (this.clientSocket) {
			this.clientSocket.destroy();
			this.clientSocket = null;
		}
		this.sockets.forEach((s) => s.destroy());
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
