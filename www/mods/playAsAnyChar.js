(async () => {
	// use dev tools to spawn in a charecter if you want them, this is just for laughs rn.
	const ironShakeSpear = new MATTIE.actorAPI.Data_Actor_Wrapper();
	ironShakeSpear.buildDataActorFromEventAndTroop(await MATTIE.eventAPI.getEventOnMap(185, 20), $dataTroops[174], 7); // add miner ghost as actor
	ironShakeSpear._data.characterName = '$iron_shakespeare';
	ironShakeSpear.create();

	const girl_seizure = new MATTIE.actorAPI.Data_Actor_Wrapper();
	girl_seizure.buildDataActorFromEventAndTroop(await MATTIE.eventAPI.getEventOnMap(185, 20), $dataTroops[174], 7); // add miner ghost as actor
	girl_seizure._data.characterName = '$girl_seizure';
	girl_seizure.create();

	const girl_seizure1 = new MATTIE.actorAPI.Data_Actor_Wrapper();
	girl_seizure1.buildDataActorFromEventAndTroop(await MATTIE.eventAPI.getEventOnMap(185, 20), $dataTroops[174], 7); // add miner ghost as actor
	girl_seizure1._data.characterName = '$girl_seizure';
	girl_seizure1.create();

	const legs = new MATTIE.actorAPI.Data_Actor_Wrapper();
	legs.buildDataActorFromEventAndTroop(await MATTIE.eventAPI.getEventOnMap(185, 20), $dataTroops[174], 7); // add miner ghost as actor
	legs._data.characterName = '$darkpriest_legsoff';
	legs.create();

	const arms = new MATTIE.actorAPI.Data_Actor_Wrapper();
	arms.buildDataActorFromEventAndTroop(await MATTIE.eventAPI.getEventOnMap(185, 20), $dataTroops[174], 7); // add miner ghost as actor
	arms._data.characterName = '$darkpriest_legsoff2';
	arms.create();

	const burning = new MATTIE.actorAPI.Data_Actor_Wrapper();
	burning.buildDataActorFromEventAndTroop(await MATTIE.eventAPI.getEventOnMap(185, 20), $dataTroops[174], 7); // add miner ghost as actor
	burning._data.characterName = '$burning1';
	burning.create();

	const blight = new MATTIE.actorAPI.Data_Actor_Wrapper();
	blight.buildDataActorFromEventAndTroop(await MATTIE.eventAPI.getEventOnMap(185, 20), $dataTroops[174], 7); // add miner ghost as actor
	blight._data.characterName = '$blight1';
	blight.create();

	const blight2 = new MATTIE.actorAPI.Data_Actor_Wrapper();
	blight2.buildDataActorFromEventAndTroop(await MATTIE.eventAPI.getEventOnMap(185, 20), $dataTroops[174], 7); // add miner ghost as actor
	blight2._data.characterName = '$blight1';
	blight2.create();

	const odd = new MATTIE.actorAPI.Data_Actor_Wrapper();
	odd.buildDataActorFromEventAndTroop(await MATTIE.eventAPI.getEventOnMap(185, 20), $dataTroops[174], 7); // add miner ghost as actor
	odd._data.characterName = '$people1';
	odd.create();

	const odd2 = new MATTIE.actorAPI.Data_Actor_Wrapper();
	odd2.buildDataActorFromEventAndTroop(await MATTIE.eventAPI.getEventOnMap(185, 20), $dataTroops[174], 7); // add miner ghost as actor
	odd2._data.characterName = '$people5';
	odd2.create();

	const odd3 = new MATTIE.actorAPI.Data_Actor_Wrapper();
	odd3.buildDataActorFromEventAndTroop(await MATTIE.eventAPI.getEventOnMap(185, 20), $dataTroops[174], 7); // add miner ghost as actor
	odd3._data.characterName = '$sergregor2';
	odd3.create();

	const sex = new MATTIE.actorAPI.Data_Actor_Wrapper();
	sex.buildDataActorFromEventAndTroop(await MATTIE.eventAPI.getEventOnMap(185, 20), $dataTroops[174], 7); // add miner ghost as actor
	sex._data.characterName = '$snatcher_manhandle';
	sex.create();

	const sex2 = new MATTIE.actorAPI.Data_Actor_Wrapper();
	sex2.buildDataActorFromEventAndTroop(await MATTIE.eventAPI.getEventOnMap(185, 20), $dataTroops[174], 7); // add miner ghost as actor
	sex2._data.characterName = '$love_knight_mercenary';
	sex2.create();
})();
