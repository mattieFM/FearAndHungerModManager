MATTIE.supporters = MATTIE.supporters || {};

/** @description a list of supporters and beta testers */
MATTIE.supporters.list = [
	'Frapollo65',
	'Greeb',
	'ADarkRacoon',
	'mauthedoog',
	'Chuckle',
	'Ruuppa',
	'Wayne',
	'Mattie',
	'David',
	'Casca :3',
	'Guts ;/',
	'Skwelletwn Knwight UwU',
	'Grwiffith ;3',
	'Moonless <3',
];

MATTIE.supporters.getRandomSupporter = function () {
	const name = MATTIE.supporters.list[MATTIE.util.randBetween(0, MATTIE.supporters.list.length - 1)];
	return name;
};
