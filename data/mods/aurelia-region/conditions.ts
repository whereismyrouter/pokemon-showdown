export const Conditions: {[k: string]: ModdedConditionData} = {
	shadowimpactside: {
		duration: 2, // 2 ticks internally covers the remaining of the current turn + the full next turn
		onStart(side) {
			for (const pokemon of side.active) {
				if (pokemon && !pokemon.fainted) {
					this.add('-item', pokemon, pokemon.getItem().name, '[from] ability: Shadow Impact', '[of] ' + pokemon);
				}
			}
		},
		// Prevents items from activating or being used while the condition is active
		onTakeItem(item, pokemon) {
			return false;
		},
		onResidualOrder: 21,
		onResidualSubOrder: 2,
		onEnd(side) {
			this.add('-message', `The shadow suppressing the opposing items faded away.`);
		},
	},
};
