// @using peerJs from /dist/peerjs.min.js
var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};

/**
 * @description a small wrapper class for the net controller that just fixes up some things to make it work for the client
 * basically just change the way data is sent and prepared
 */
class ClientController extends BaseNetController {
	constructor() {
		super();
		/** the client's peer */
		this.self = null;

		/** the id of the client's peer */
		this.peerId = null;

		/** the id of the host's peer */
		this.hostId = null;

		this.lastHostId = null;

		/** the connection to the host */
		this.conn = null;

		/** the player on the local machine */
		this.player = new PlayerModel(MATTIE.util.getName(), 4);

		/**
         *  players not on the local machine
         *  dictionary with keys equal to the client's peer id
         * */
		this.netPlayers = {};
	}

	open() {
		if (!this.lastHostId) this.lastHostId = '';
		this.initEmitterOverrides(); // override stuff for interceptors
		this.setIsClient();
		if (!this.lastHostId.includes(this.hostId) || !this.canTryToReconnect) {
			if (this.self && this.self.destroy) {
				this.self.destroy();
			}

			if (MATTIE.multiplayer.forceFallback) {
				console.log('Forcing Fallback TCP Transport (Client)');
				if (typeof NodeTcpTransport !== 'undefined') {
					this.self = new NodeTcpTransport(false);
					console.log('Client Transport created via global NodeTcpTransport');
				} else {
					console.error('FATAL: NodeTcpTransport is not defined globally.');
				}
				if (this.self) this.peerId = this.self.id;
			} else {
				this.self = new Peer();
			}

			this.self.on('open', () => {
				this.peerId = this.self.id;
				this.player.setPeerId(this.peerId);
				console.info(`Client opened at: ${this.peerId}`);
				console.info(`Attempting to connect to host at: ${this.hostId}`);
				this.connect();
			});
		} else {
			this.connect();
		}
	}

	connect(hostId = this.hostId, patch = true, retryCount = 0) {
		if (!this.lastHostId) this.lastHostId = '';
		if (retryCount === 0 && this.lastHostId.includes(hostId) && this.canTryToReconnect) {
			this.reconnectAllConns();
			this.sendPlayerInfo();
			this.lastHostId = hostId;
			return;
		}

		console.info(`Attempting to connect to ${hostId} (Attempt ${retryCount + 1})`);
		this.conn = this.self.connect(hostId);

		let isConnected = false;
		let failureHandled = false;

		const handleFailure = (reason) => {
			if (isConnected || failureHandled) return;
			failureHandled = true;

			if (retryCount < 5) { // Max 5 retries
				console.warn(`Connection attempt ${retryCount + 1} failed: ${reason}. Retrying in 2s...`);
				setTimeout(() => {
					this.connect(hostId, patch, retryCount + 1);
				}, 2000);
			} else {
				console.error(`Failed to connect to host ${hostId} after multiple attempts.`);
			}
		};

		// 5 second timeout for connection
		const timeoutId = setTimeout(() => {
			if (!isConnected && (!this.conn || !this.conn.open)) {
				handleFailure('Timeout');
			}
		}, 5000);

		this.conn.on('open', () => {
			isConnected = true;
			clearTimeout(timeoutId);
			console.info('Client Connected to the host');
			this.sendPlayerInfo();
			this.emit('clientConnectedToHost');
		});

		this.conn.on('error', (err) => {
			clearTimeout(timeoutId);
			handleFailure(err);
		});

		this.conn.on('close', () => {
			clearTimeout(timeoutId);
			if (!isConnected) handleFailure('Closed immediately');
		});

		this.conn.on('data', (data) => {
			// if(!this.self.disconnected)
			this.onData(data, this.conn);
		});

		this.lastHostId = hostId;
	}

	/**
     * @description a function that will preprocess the data for onData.
     * this adds the field .id equal to the host's id or the sender id
     * @param data the data that was sent
     * @param conn the connection that is sending the data
     */
	preprocessData(data, conn) {
		if (!data.id) data.id = conn.peer;
		return data;
	}

	// /**
	//  * @description send a json object to the main connection. Since this is the client this will just send to host.
	//  * @param {*} obj the object to send
	//  */
	// sendViaMainRoute(obj){
	//     this.sendHost(obj);
	// }

	sendHost(data) {
		if (this.conn) this.conn.send(data);
	}

	/**
     * @param {*} startGame unused var
     * @emits startGame;
     */
	onStartGameData(startGame) {
		this.emit('startGame');
		this.started = true;
	}

	/**
     * send's the user's player info to the host
     * used to initialize them as a player
     */
	sendPlayerInfo() {
		const obj = {};
		obj.playerInfo = this.player.getCoreData();
		this.sendViaMainRoute(obj);
	}
}

// ignore this does nothing, just to get intellisense working. solely used to import into the types file for dev.
try {
	module.exports.ClientController = ClientController;
} catch (error) {
	// eslint-disable-next-line no-global-assign
	module = {};
	module.exports = {};
}
module.exports.ClientController = ClientController;
