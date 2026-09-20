export const Pokedex: {[k: string]: ModdedSpeciesData} = {

	solenogre: {
		num: 10001,
		name: "Solenogre",
		types: ["Normal", "Electric"],
		baseStats: {hp: 110, atk: 120, def: 100, spa: 5, spd: 100, spe: 36},
		abilities: {0: "Iron Fist", 1: "Unaware", H: "Dizzy Stumble"},
		weightkg: 150, // Le puse 150kg por su estilo de tanque pesón, puedes cambiarlo si quieres!
	},

};

	rougeent: {
		num: 10002,
		name: "Rougeent",
		types: ["Normal", "Fighting"],
		baseStats: {hp: 61, atk: 90, def: 70, spa: 10, spd: 70, spe: 110},
		abilities: {0: "Guts", 1: "Merciless", H: "Double Whip"},
		weightkg: 22.0,
	},

	peregrimm: {
		num: 10003,
		name: "Peregrimm",
		types: ["Dark", "Flying"],
		baseStats: {hp: 59, atk: 120, def: 75, spa: 40, spd: 40, spe: 140}, // Total: 474
		abilities: {0: "Unburden", 1: "Keen Eye", H: "Shadow Impact"},
		weightkg: 40.0, // Adjust weight as needed
	},

	nymbulon: {
		num: 10004,
		name: "Nymbulon",
		types: ["Water", "Fire"],
		baseStats: {hp: 100, atk: 110, def: 95, spa: 110, spd: 95, spe: 50}, // Total: 560
		abilities: {0: "Torrent", H: "Prisma-Lights"},
		weightkg: 130.0, // Adjust weight as needed
	},
