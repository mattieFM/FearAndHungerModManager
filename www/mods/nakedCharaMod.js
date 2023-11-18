var MATTIE = MATTIE || {};

MATTIE.prevFun5325c = Game_Actor.prototype.characterName;

Game_Actor.prototype.forceCharName = function (name) {
	this.forcedName = name;
	$dataActors[this.actorId()]._forcedName = name;
};

Game_Actor.prototype.characterName = function () {
	const name = this.forcedName || $dataActors[this.actorId()]._forcedName;
	if (name) {
		this.forcedName = name;
		return this.forcedName;
	}
	return MATTIE.prevFun5325c.call(this);
};

Object.defineProperty(Game_Actor.prototype, 'forcedName', {
	get() {
		return this._forcedName;
	},
	set(val) {
		this._forcedName = val;
	},
});

setTimeout(() => {
	MATTIE.static.actors.charah = new MATTIE.actorAPI.Data_Actor_Wrapper();
	MATTIE.static.actors.charah.buildDataActorFromExistingActor($dataActors[1]);
	MATTIE.static.actors.charah._data.characterName = '$naked_mercenary';
	MATTIE.static.actors.charah.create();
	MATTIE.static.actors.charah.replace(1);

	console.log($gameActors.actor(1).characterName());
	$gamePlayer.refresh();
	$gameActors._data[1]._forcedName = '$naked_mercenary';
	$gameActors.actor(1).forceCharName('$naked_mercenary');
	MATTIE.bbgirlAPI.yassify();
}, 500);
