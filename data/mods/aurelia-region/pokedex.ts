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

	astralembus: {
		num: 10014,
		name: "Astralembus",
		types: ["Ghost", "Fire"],
		baseStats: {hp: 130, atk: 80, def: 100, spa: 160, spd: 120, spe: 90}, // Total: 680 (Box Legend profile)
		abilities: {0: "Dark Sun", 1: "Total Occlusion", H: "Doomsday"},
		weightkg: 420.0, // A massive but gentle cosmic entity
	},

	perishtoll: {
		num: 10015,
		name: "Perish Toll",
		types: ["Steel", "Ghost"],
		baseStats: {hp: 95, atk: 115, def: 150, spa: 125, spd: 75, spe: 45}, // Total: 605 (Paradox profile)
		abilities: {0: "Photosynthesis"},
		weightkg: 320.0, // Heavy spectral bell
	},

	gholdengoaurelian: {
		num: 1000, // Uses Gholdengo's official number
		name: "Gholdengo-Aurelian",
		baseSpecies: "Gholdengo",
		form: "Aurelian",
		types: ["Ice", "Poison"],
		baseStats: {hp: 87, atk: 133, def: 95, spa: 60, spd: 91, spe: 84}, // Total: 550
		abilities: {0: "Rotten Touch"}, // Uniquely has this single ability
		weightkg: 30.0, // Decay makes it lighter than solid gold!
	},

	kingambitaurelian: {
		num: 983, // Uses Kingambit's official number
		name: "Kingambit-Aurelian",
		baseSpecies: "Kingambit",
		form: "Aurelian",
		types: ["Fighting", "Steel"],
		baseStats: {hp: 59, atk: 60, def: 85, spa: 135, spd: 120, spe: 100}, // Total: 550
		abilities: {0: "Competitive", 1: "Brothers in Arms", H: "Unnerve"},
		weightkg: 110.0, // Sleeker, more tactical frame
	},

	everghast: {
		num: 10016,
		name: "Everghast",
		types: ["Ghost", "Normal"],
		baseStats: {hp: 110, atk: 115, def: 95, spa: 115, spd: 95, spe: 60}, // Total: 600 (Mythical profile)
		abilities: {0: "Count-up"}, // Uniquely has this single signature ability
		weightkg: 120.0, // Solid heavy ticking entity
	},

	etherspark: {
		num: 10017,
		name: "Etherspark",
		types: ["Fairy", "Fire"],
		baseStats: {hp: 65, atk: 60, def: 55, spa: 135, spd: 75, spe: 160}, // Total: 550 (Ultra-fast Mythical profile)
		abilities: {0: "Swift Start"}, // Uniquely has this single signature ability
		weightkg: 0.1, // A literal weightless spark
	},

	aerovoy: {
		num: 10018,
		name: "Aerovoy",
		types: ["Flying"],
		baseStats: {hp: 75, atk: 130, def: 70, spa: 75, spd: 70, spe: 150}, // Total: 570 (Mythical speed tier)
		abilities: {0: "Regal Flight"}, // Uniquely has this single signature ability
		weightkg: 15.0, // Sleek, aerodynamic frame
	},

	drawndrein: {
		num: 10019,
		name: "Drawndrein",
		types: ["Dark", "Fairy"],
		baseStats: {hp: 105, atk: 155, def: 130, spa: 60, spd: 100, spe: 50}, // Total: 600 (Pseudo-legendary profile)
		abilities: {0: "Ultradrain", 1: "Rough Skin", H: "Intimidate"},
		weightkg: 410.0, // Heavy wood and root amalgamation
	},

	rotom: {
		inherit: true,
		baseStats: {hp: 50, atk: 50, def: 77, spa: 134, spd: 77, spe: 132}, // Massive speed and power upgrade!
	},

	rotomfan: {
		inherit: true,
		abilities: {0: "Tornado Warning"}, // Replaces Levitate completely!
	},

	cofagrigus: {
		inherit: true,
		abilities: {0: "Mummy", H: "Livid Buzz"}, // Añadido como Habilidad Oculta
	},
	kricketune: {
		inherit: true,
		abilities: {0: "Swarm", 1: "Technician", H: "Livid Buzz"},
	},
	beautifly: {
		inherit: true,
		abilities: {0: "Swarm", 1: "Rivalry", H: "Livid Buzz"},
	},
	combee: {
		inherit: true,
		abilities: {0: "Honey Gather", H: "Livid Buzz"},
	},
	ceruledge: {
		inherit: true,
		abilities: {0: "Flash Fire", 1: "Sharpness", H: "Weak Armor"}, // Added Sharpness!
	},
	armarouge: {
		inherit: true,
		abilities: {0: "Flash Fire", 1: "Mega Launcher", H: "Weak Armor"}, // Added Mega Launcher!
	},

	golurkmegaz: {
		num: 623, // Usa el número oficial de Pokedex de Golurk
		name: "Golurk-Mega-Z",
		baseSpecies: "Golurk",
		form: "Mega-Z",
		types: ["Ground", "Ghost"],
		baseStats: {hp: 89, atk: 154, def: 110, spa: 70, spd: 50, spe: 110}, // Total: 583 (+100 estadísticas base)
		abilities: {0: "No Guard"}, // ¡Fijado con Indefenso!
		weightkg: 480.0, // Aumenta su peso al convertirse en un pesado carruaje de arcilla
		requiredItem: "Golurkite Z", // Nombre de su megapiedra
	},

	nidokingmega: {
		num: 34,
		name: "Nidoking-Mega",
		baseSpecies: "Nidoking",
		form: "Mega",
		types: ["Poison", "Ground"],
		baseStats: {hp: 81, atk: 152, def: 97, spa: 75, spd: 85, spe: 115}, // Total: 605 (+100 Stats!)
		abilities: {0: "Tantrum Breaker"},
		weightkg: 85.0,
		requiredItem: "Nidokingite",
	},
	nidoqueenmega: {
		num: 31,
		name: "Nidoqueen-Mega",
		baseSpecies: "Nidoqueen",
		form: "Mega",
		types: ["Poison", "Ground"],
		baseStats: {hp: 90, atk: 75, def: 117, spa: 135, spd: 115, spe: 73}, // Total: 605 (+100 Stats!)
		abilities: {0: "Re-concentrate"},
		weightkg: 82.0,
		requiredItem: "Nidoqueenite",
	},
		
