var MATTIE = MATTIE || {};
MATTIE.RPG = MATTIE.RPG || {};
MATTIE.multiplayer = MATTIE.multiplayer || {};
MATTIE.menus.multiplayer = MATTIE.menus.multiplayer || {};
MATTIE.scenes.multiplayer = MATTIE.scenes.multiplayer || {};
MATTIE.windows.multiplayer = MATTIE.windows.multiplayer || {};
MATTIE.multiplayer.renderer = MATTIE.multiplayer.renderer || {};

/** render all net players */
MATTIE.multiplayer.renderer._renderNetPlayers = function (target) {
	this.playersSprites = [];
	let players = [];
	if (MATTIE.multiplayer.isClient) {
		players = MATTIE.multiplayer.clientController.netPlayers;
	} else if (MATTIE.multiplayer.isHost) {
		players = MATTIE.multiplayer.hostController.netPlayers;
	}
	for (key in players) {
		if (key) {
			/** @type {PlayerModel} */
			const netPlayer = players[key];
			if ($gameMap.mapId() === netPlayer.map
			&& (!netPlayer.isMarried || netPlayer.isMarriageHost)
			) { // only render players on same map that are not married unless they are the host
				netPlayer.$gamePlayer.setActor(netPlayer.actorId);
				netPlayer.$gamePlayer.refresh();
				const p2 = netPlayer.$gamePlayer;
				p2.setTransparent(false);

				p2.name = netPlayer.name;
				const p2Sprite = new MATTIE.multiplayer.NetSpriteChar(p2);
				if (MATTIE.multiplayer.devTools.shouldTint) {
					if (!MATTIE.multiplayer.devTools.consistentTint) {
						MATTIE.multiplayer.devTools.consistentTint = MATTIE.multiplayer.devTools.getTint();
					}
					p2Sprite.tint = MATTIE.multiplayer.devTools.consistentTint;
				}
				this.playersSprites.push(p2Sprite);
				netPlayer.$gamePlayer.followers().forEach((follower) => {
					if (follower.actorId) {
						const followerSprite = new Sprite_Character(follower);
						follower.setTransparent(false);
						this.playersSprites.push(followerSprite);
					}
				});
			}
		}
	}
	for (var i = 0; i < this.playersSprites.length; i++) {
		target.addChild(this.playersSprites[i]);
	}
};

//-----------------------------------------------------------------------------
// netSpriteChar
//
// The sprite for displaying a character.

MATTIE.multiplayer.NetSpriteChar = function () {
	this.initialize.apply(this, arguments);
};

MATTIE.multiplayer.NetSpriteChar.prototype = Object.create(Sprite_Character.prototype);
MATTIE.multiplayer.NetSpriteChar.prototype.constructor = MATTIE.multiplayer.NetSpriteChar;

MATTIE.multiplayer.NetSpriteChar.prototype.updateVisibility = function () {
	Sprite_Character.prototype.updateVisibility.call(this);
	if (!this._character.isOnMap()) {
		this.visible = false;
	}
};
