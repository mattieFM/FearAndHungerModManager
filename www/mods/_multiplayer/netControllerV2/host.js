// @using peerJs from /dist/peerjs.min.js
var MATTIE = MATTIE || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
/**
 * @description a wrapper class for the net controller for the host, this just overrides some things to fix up how data is sent and prepared
 * for clients.
 *  @global
 * @class
 * */
class HostController extends BaseNetController {
	constructor() {
		super();
		/** the host's peer */
		this.self = null;

		/** the id of the host's peer */
		this.peerId = null;

		/** all connections to the host's peer */
		this.connections = [];

		/** the player on the local machine */
		this.player = new PlayerModel(MATTIE.util.getName(), 3);

		/**
         *  players not on the local machine
         *  dictionary with keys equal to the client's peer id
         * */
		this.netPlayers = {};
	}

	open() {
		if (this.self && this.self.destroy) {
			console.log('Destroying previous host instance to free port');
			this.self.destroy();
		}
		this.initEmitterOverrides(); // override stuff for interceptors
		this.setIsHost();
		if (MATTIE.multiplayer.forceFallback) {
			console.log('Forcing Fallback TCP Transport (Host)');
			if (typeof NodeTcpTransport !== 'undefined') {
				this.self = new NodeTcpTransport(true);
				console.log('Host Transport created via global NodeTcpTransport');
			} else {
				console.error('FATAL: NodeTcpTransport is not defined globally.');
			}
			if (this.self) this.peerId = this.self.id;
		} else {
			this.self = new Peer();
		}
		this.self.on('open', () => {
			console.info(`host opened at: ${this.self.id}`);
			this.peerId = this.self.id;
			this.player.setPeerId(this.peerId);
			setTimeout(() => {
				this.emit('playerInfo', this.player.getCoreData()); // emit playerInfo event with self slightly after open to render host in lobby
			}, 500);
		});

		this.self.on('connection', (conn) => {
			console.info(`Client connected to host at: ${conn.peer}`);

			this.handleConnection(conn);

			conn.on('data', (data) => {
				this.onData(data, conn);
			});
		});

		this.self.on('error', (err) => {
			console.error('Host Transport Error:', err);
		});
	}

	// /**
	//  * @description send a json object to the main connection. Since this is the host this will just send to all clients
	//  * @param {*} obj the object to send
	//  */
	// sendViaMainRoute(obj, excludedIds = []){
	//     this.sendAll(obj, excludedIds);
	// }

	/**
     * @description a function to redistribute data to all clients
     * @param {*} obj the object to distribute
     * @param {*} senderId the id of the original sender
     */
	distributeDataToClients(obj, senderId) {
		obj.id = senderId;
		this.sendViaMainRoute(obj, [senderId]);
	}

	/**
     * @description a function that will preprocess the data for onData.
     * this adds the field .id equal to the connection's id and distribute's data to clients
     * @param data the data that was sent
     * @param conn the connection that is sending the data
     */
	preprocessData(data, conn) {
		if (MATTIE.multiplayer.devTools.dataLogger) console.log(data);
		data.id = conn.peer; // set the id of the data to the id of the peer on the other side of this connection
		this.distributeDataToClients(data, conn.peer);

		return data;
	}

	sendAll(data, excluded = []) {
		this.connections.forEach((conn) => {
			if (!excluded.includes(conn.peer)) { // if the id of the peer is excluded don't send
				if (conn) conn.send(data);
			}
		});
	}

	/** send all connections the startGame command */
	startGame() {
		const obj = {};
		obj.startGame = 'y';
		this.started = true;
		this.sendViaMainRoute(obj);
	}

	/**
     * processes playerinfo and then emits the 'playerInfo' event
     * @emits playerInfo
     * */
	onPlayerInfoData(playerInfo) {
		// console.log(playerInfo)
		this.updateNetPlayer(playerInfo);
		this.updateNetPlayerFollowers(playerInfo);

		this.distributeNetPlayersToClients();

		this.emit('playerInfo', playerInfo);
	}

	handleConnection(conn) {
		const id = conn.peer; // get the id of the peer that is on the other side of the connection
		this.connections.push(conn);

		// Send initial player info to the new client so they can see the host/others immediately
		console.log('Sending initial player info to new client:', id);
		const newNetPlayers = this.createOutGoingNetPlayers(id);
		const obj = {};
		obj.updateNetPlayers = newNetPlayers;
		conn.send(obj);
	}

	/** send an updated list of all net players to the client.
     *  The host needs to be included in this list and the client the information is being sent to needs to be excluded from this list
     */
	distributeNetPlayersToClients() {
		this.connections.forEach((conn) => {
			const peerId = conn.peer; // get the id of the peer on the other end of the connection.
			const newNetPlayers = this.createOutGoingNetPlayers(peerId);
			const obj = {};
			obj.updateNetPlayers = newNetPlayers;
			conn.send(obj);
		});
	}

	/** alias of distributeNetPlayersToClients used for updating players when this one changes */
	sendPlayerInfo() {
		this.distributeNetPlayersToClients();
	}

	/**
     * assembles the proper list of netPlayers with host included and recipient excluded
     * @param recipientId the id of the recipient's peer
     * */
	createOutGoingNetPlayers(recipientId) {
		const dict = {};
		for (key in this.netPlayers) {
			if (key != recipientId) {
				if (this.netPlayers[key]) {
					console.log(this.netPlayers[key]);
					dict[key] = this.netPlayers[key].getCoreData();
				} // add all but the recipient
			}
		}

		dict[this.peerId] = this.player.getCoreData(); // add host
		return dict;
	}
}

// ignore this does nothing, just to get intellisense working. solely used to import into the types file for dev.
try {
	module.exports.HostController = HostController;
} catch (error) {
	// eslint-disable-next-line no-global-assign
	module = {};
	module.exports = {};
}
module.exports.HostController = HostController;
