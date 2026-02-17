#!/usr/bin/env node
/**
 * @file rendezvousServer.js
 * @description Lightweight TCP hole-punch rendezvous server.
 *
 * Both the game host and client register their public endpoints here.
 * The host polls for clients, the client polls for the host.
 * Once both know each other's endpoint, they perform TCP simultaneous open.
 *
 * Usage:
 *   node rendezvousServer.js [port]
 *
 * Default port: 9999
 *
 * Endpoints:
 *   POST /api/register     { roomId, role, publicIp, port }
 *   GET  /api/room/:roomId
 *   POST /api/unregister    { roomId }
 *
 * Rooms auto-expire after 5 minutes of inactivity.
 *
 * Set MATTIE.multiplayer.config.rendezvousUrl in the game to:
 *   "http://<your-server-ip>:9999"
 */

const http = require('http');

const PORT = parseInt(process.argv[2], 10) || 9999;

// ── In-memory room store ──────────────────────────────────────────────────
const rooms = new Map(); // roomId → { host: {publicIp, port}, clients: [{publicIp, port}], lastActivity: Date.now() }

const ROOM_TTL = 5 * 60 * 1000; // 5 minutes

// Prune expired rooms every 60 seconds
setInterval(() => {
	const now = Date.now();
	for (const [id, room] of rooms) {
		if (now - room.lastActivity > ROOM_TTL) {
			rooms.delete(id);
			console.log(`[prune] Room ${id} expired`);
		}
	}
}, 60000);

// ── HTTP helpers ──────────────────────────────────────────────────────────

function readBody(req) {
	return new Promise((resolve, reject) => {
		let data = '';
		req.on('data', (chunk) => { data += chunk; });
		req.on('end', () => {
			try {
				resolve(JSON.parse(data));
			} catch (e) {
				reject(new Error('Invalid JSON'));
			}
		});
		req.on('error', reject);
	});
}

function sendJson(res, status, obj) {
	const body = JSON.stringify(obj);
	res.writeHead(status, {
		'Content-Type': 'application/json',
		'Content-Length': Buffer.byteLength(body),
		'Access-Control-Allow-Origin': '*',
	});
	res.end(body);
}

// ── Request handler ───────────────────────────────────────────────────────

async function handleRequest(req, res) {
	// CORS preflight
	if (req.method === 'OPTIONS') {
		res.writeHead(204, {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		});
		res.end();
		return;
	}

	const url = req.url;

	// ── POST /api/register ────────────────────────────────────────────
	if (req.method === 'POST' && url === '/api/register') {
		try {
			const body = await readBody(req);
			const { roomId, role, publicIp, port } = body;

			if (!roomId || !role || !publicIp || port == null) {
				return sendJson(res, 400, { error: 'Missing fields: roomId, role, publicIp, port' });
			}

			let room = rooms.get(roomId);
			if (!room) {
				room = { host: null, clients: [], lastActivity: Date.now() };
				rooms.set(roomId, room);
			}
			room.lastActivity = Date.now();

			if (role === 'host') {
				room.host = { publicIp, port: parseInt(port, 10) };
				console.log(`[register] Host for room ${roomId}: ${publicIp}:${port}`);
			} else if (role === 'client') {
				// Avoid duplicate entries for same IP:port
				const key = `${publicIp}:${port}`;
				const exists = room.clients.some((c) => `${c.publicIp}:${c.port}` === key);
				if (!exists) {
					room.clients.push({ publicIp, port: parseInt(port, 10) });
					console.log(`[register] Client for room ${roomId}: ${publicIp}:${port}`);
				}
			}

			return sendJson(res, 200, { ok: true });
		} catch (e) {
			return sendJson(res, 400, { error: e.message });
		}
	}

	// ── GET /api/room/:roomId ─────────────────────────────────────────
	if (req.method === 'GET' && url.startsWith('/api/room/')) {
		const roomId = decodeURIComponent(url.substring('/api/room/'.length));
		const room = rooms.get(roomId);

		if (!room) {
			return sendJson(res, 404, { error: 'Room not found' });
		}

		room.lastActivity = Date.now();
		return sendJson(res, 200, {
			roomId,
			host: room.host,
			clients: room.clients,
		});
	}

	// ── POST /api/unregister ──────────────────────────────────────────
	if (req.method === 'POST' && url === '/api/unregister') {
		try {
			const body = await readBody(req);
			if (body.roomId) {
				rooms.delete(body.roomId);
				console.log(`[unregister] Room ${body.roomId} removed`);
			}
			return sendJson(res, 200, { ok: true });
		} catch (e) {
			return sendJson(res, 400, { error: e.message });
		}
	}

	// ── Health check ──────────────────────────────────────────────────
	if (req.method === 'GET' && (url === '/' || url === '/health')) {
		return sendJson(res, 200, {
			status: 'ok',
			rooms: rooms.size,
			uptime: process.uptime(),
		});
	}

	sendJson(res, 404, { error: 'Not found' });
}

// ── Start server ──────────────────────────────────────────────────────────

const server = http.createServer(handleRequest);
server.listen(PORT, () => {
	console.log(`\n  Rendezvous server running on port ${PORT}`);
	console.log(`  Set in game: MATTIE.multiplayer.config.rendezvousUrl = "http://<this-ip>:${PORT}"\n`);
});
