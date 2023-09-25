var MATTIE = MATTIE || {};
MATTIE.supporters = MATTIE.supporters || {};

/** @description a list of supporters and beta testers */
MATTIE.supporters.list = [
    "Santy99",
    "Spooky Man",
    "Zank",
    "Payton",

]

MATTIE.supporters.alphaTestersList = [
    "Frapollo65",
    "Greeb",
    "ADarkRacoon",
    "mauthedoog",
    "Chuckle",
    "Ruuppa",
    "Wayne",
    "Mattie",
    "David",
    "Casca :3",
    "Guts ;/",
    "Skwelletwn Knwight UwU",
    "Grwiffith ;3",
    "Moonless <3",
]

MATTIE.supporters.getRandomSupporter = function(){
    let list = MATTIE.supporters.alphaTestersList.concat(MATTIE.supporters.list);
    let name = list[MATTIE.util.randBetween(0,list.length-1)];
    return name;
}