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
