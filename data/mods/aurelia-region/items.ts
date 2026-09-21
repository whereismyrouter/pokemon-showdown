export const Items: {[k: string]: ModdedItemData} = {
	// --- Your Brand New Custom Mega Stone ---
	golurkitez: {
		name: "Golurkite Z",
		spritenum: 575, // Uses a generic Mega Stone sprite in Showdown's interface
		megaStone: "Golurk-Mega-Z",
		megaEvolves: "Golurk",
		onTakeItem(item, pokemon, source) {
			// Prevents items-manipulation moves like Trick, Knock Off, or Thief from removing the stone
			if ((source && source.baseSpecies.name === 'Golurk') || pokemon.baseSpecies.name === 'Golurk') return false;
			return true;
		},
		shortDesc: "Mega Evolves Golurk into Mega Golurk-Z during battle.",
	},
};

	nidokingite: {
		name: "Nidokingite",
		spritenum: 575,
		megaStone: "Nidoking-Mega",
		megaEvolves: "Nidoking",
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.name === 'Nidoking') || pokemon.baseSpecies.name === 'Nidoking') return false;
			return true;
		},
		shortDesc: "Mega Evolves Nidoking into Mega Nidoking during battle.",
	},
	nidoqueenite: {
		name: "Nidoqueenite",
		spritenum: 575,
		megaStone: "Nidoqueen-Mega",
		megaEvolves: "Nidoqueen",
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.name === 'Nidoqueen') || pokemon.baseSpecies.name === 'Nidoqueen') return false;
			return true;
		},
		shortDesc: "Mega Evolves Nidoqueen into Mega Nidoqueen during battle.",
	},

export const Items: {[k: string]: ModdedItemData} = {
	// (Keep your existing Golurkite Z, Nidokingite, and Nidoqueenite here)

	brokentransmissor: {
		name: "Broken Transmissor",
		spritenum: 224, // Generically mapped to a mechanical item sprite index
		shortDesc: "If the holder uses Trick Room, its duration becomes 8 turns instead of 5.",
	},
	aerodynamicrock: {
		name: "Aerodynamic Rock",
		spritenum: 114, // Generically mapped to a weather rock sprite index
		shortDesc: "If the holder summons Gusty Winds, its duration becomes 8 turns instead of 5.",
	},
	gloomrock: {
		name: "Gloom Rock",
		spritenum: 114,
		shortDesc: "If the holder summons a Lunar Eclipse, its duration becomes 8 turns instead of 5.",
	},
	darkrock: {
		name: "Dark Rock",
		spritenum: 114,
		shortDesc: "If the holder summons a Solar Eclipse, its duration becomes 8 turns instead of 5.",
	},
	sweetrock: {
		name: "Sweet Rock",
		spritenum: 114,
		shortDesc: "If the holder summons a Plague, its duration becomes 8 turns instead of 5.",
	},
	radianttelescope: {
		name: "Radiant Telescope",
		spritenum: 688, // Generically mapped to an optometric/lens item sprite index
		shortDesc: "If the holder summons a Red Sun, its duration becomes 8 turns instead of 5.",
	},
	mysticalhumidifier: {
		name: "Mystical Humidifier",
		spritenum: 232,
		shortDesc: "If the holder summons a Rage Storm, its duration becomes 8 turns instead of 5.",
	},
};
