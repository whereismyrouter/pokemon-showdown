export const Pokedex: {[k: string]: ModdedSpeciesData} = {

	solenogre: {
		num: 10001,
		name: "Solenogre",
		types: ["Normal", "Electric"],
		baseStats: {hp: 110, atk: 120, def: 100, spa: 5, spd: 100, spe: 36},
		abilities: {0: "Iron Fist", 1: "Unaware", H: "Dizzy Stumble"},
		weightkg: 270, // Le puse 150kg por su estilo de tanque pesón, puedes cambiarlo si quieres!
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
		weightkg: 240.0, // Adjust weight as needed
	},

	amaroshog: {
		num: 10005,
		name: "Amaroshog",
		types: ["Grass", "Water"],
		baseStats: {hp: 80, atk: 70, def: 105, spa: 115, spd: 75, spe: 115}, // Total: 560
		abilities: {0: "Overgrow", H: "Muddy Surge"},
		weightkg: 170.0, // Adjust weight as needed
	},

	pyrostoke: {
		num: 10006,
		name: "Pyrostoke",
		types: ["Fire", "Grass"],
		baseStats: {hp: 125, atk: 140, def: 115, spa: 40, spd: 95, spe: 30}, // Total: 560
		abilities: {0: "Blaze", H: "Flameburst"},
		weightkg: 210.0, // Adjust weight as needed
	},

	gnomska: {
		num: 10007,
		name: "Gnomska",
		types: ["Ground", "Fairy"],
		baseStats: {hp: 75, atk: 85, def: 95, spa: 75, spd: 85, spe: 60}, // Total: 475
		abilities: {0: "Gunk Return"}, // Only has this single ability
		weightkg: 3.5, // Lightweight, matching a garden gnome!
	},

	jokergeist: {
		num: 10009,
		name: "Jokergeist",
		types: ["Dark", "Psychic"],
		baseStats: {hp: 65, atk: 77, def: 33, spa: 77, spd: 105, spe: 120}, // Total: 477
		abilities: {0: "Lawless Spin"}, // Uniquely has this single ability
		weightkg: 45.0, // Adjust weight as needed for a ghostly croupier
	},

	brumaroth: {
		num: 10010,
		name: "Brumaroth",
		types: ["Ice", "Ground"],
		baseStats: {hp: 110, atk: 165, def: 140, spa: 60, spd: 75, spe: 130}, // Total: 680 (Box Legend Stats!)
		abilities: {0: "Neverending Winter"},
		weightkg: 680.0, // Heavy bulldozer weight
	},

	castform: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Castform' || pokemon.transformed) return;
			let form = '';
			const weather = this.field.effectiveWeather();
			switch (weather) {
				case 'sunnyday':
				case 'desolateland':
					form = 'Sunny';
					break;
				case 'raindance':
				case 'primordialsea':
					form = 'Rainy';
					break;
				case 'hail':
				case 'snow':
				case 'primalsnow':
					form = 'Snowy';
					break;
				// --- Your 6 Brand New Custom Weather Forms ---
				case 'ragestorm':
					form = 'Hero';
					break;
				case 'plague':
					form = 'Swarmy';
					break;
				case 'solareclipse':
					form = 'Doomy';
					break;
				case 'lunareclipse':
					form = 'Gloomy';
					break;
				case 'gustywinds':
					form = 'Windy';
					break;
				case 'redsun':
					form = 'Super';
					break;
			}
			if (pokemon.species.id !== form.toLowerCase()) {
				pokemon.formeChange('Castform' + (form ? '-' + form : ''), this.effect, true);
			}
		},
	},
	// Defining the basic database layouts for your new Castform forms
	castformhero: {
		num: 351,
		name: "Castform-Hero",
		baseSpecies: "Castform",
		form: "Hero",
		types: ["Fighting"],
		baseStats: {hp: 70, atk: 70, def: 70, spa: 70, spd: 70, spe: 70},
		abilities: {0: "Forecast"},
		weightkg: 0.8,
	},
	castformswarmy: {
		num: 351,
		name: "Castform-Swarmy",
		baseSpecies: "Castform",
		form: "Swarmy",
		types: ["Bug"],
		baseStats: {hp: 70, atk: 70, def: 70, spa: 70, spd: 70, spe: 70},
		abilities: {0: "Forecast"},
		weightkg: 0.8,
	},
	castformdoomy: {
		num: 351,
		name: "Castform-Doomy",
		baseSpecies: "Castform",
		form: "Doomy",
		types: ["Dark"],
		baseStats: {hp: 70, atk: 70, def: 70, spa: 70, spd: 70, spe: 70},
		abilities: {0: "Forecast"},
		weightkg: 0.8,
	},
	castformgloomy: {
		num: 351,
		name: "Castform-Gloomy",
		baseSpecies: "Castform",
		form: "Gloomy",
		types: ["Ghost"],
		baseStats: {hp: 70, atk: 70, def: 70, spa: 70, spd: 70, spe: 70},
		abilities: {0: "Forecast"},
		weightkg: 0.8,
	},
	castformwindy: {
		num: 351,
		name: "Castform-Windy",
		baseSpecies: "Castform",
		form: "Windy",
		types: ["Flying"],
		baseStats: {hp: 70, atk: 70, def: 70, spa: 70, spd: 70, spe: 70},
		abilities: {0: "Forecast"},
		weightkg: 0.8,
	},
	castformsuper: {
		num: 351,
		name: "Castform-Super",
		baseSpecies: "Castform",
		form: "Super",
		types: ["Normal"],
		baseStats: {hp: 70, atk: 70, def: 70, spa: 70, spd: 70, spe: 70},
		abilities: {0: "Forecast"},
		weightkg: 0.8,
	},
			
	helistionix: {
		num: 10011,
		name: "Helistionix",
		types: ["Steel", "Fairy"],
		baseStats: {hp: 130, atk: 160, def: 220, spa: 50, spd: 110, spe: 5}, // Total: 675 (Incredible trick room tank!)
		abilities: {0: "Crimson Clouds"},
		weightkg: 590.0, // Ultra-dense composition
	},
						
	fencerush: {
		num: 10012,
		name: "Fencerush",
		types: ["Grass", "Fighting"],
		baseStats: {hp: 60, atk: 95, def: 70, spa: 40, spd: 65, spe: 105}, // Total: 435
		abilities: {0: "Trained Focus"}, // Uniquely has this single ability
		weightkg: 28.0, // Light and swift for an agile fencer
	},

	galemar: {
		num: 10013,
		name: "Galemar",
		types: ["Water", "Dark"],
		baseStats: {hp: 135, atk: 155, def: 130, spa: 115, spd: 105, spe: 80}, // Total: 720 (A true titan!)
		abilities: {0: "Searise"},
		weightkg: 950.0, // Heavy leviathan with a sunken ship
	},
