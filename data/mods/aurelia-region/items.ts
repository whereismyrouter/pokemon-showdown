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
