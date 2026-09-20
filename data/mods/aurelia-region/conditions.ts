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

	primalsnow: {
		name: "Primal Snow",
		effectType: "Weather",
		duration: 0, // Lasts indefinitely as long as Brumaroth is active on the field
		onStart(battle, source, effect) {
			this.add('-weather', 'Primal Snow');
			this.add('-message', "A cataclysmic, neverending winter has frozen the battlefield over!");
		},
		onResidualPriority: 1,
		onResidual(battle) {
			this.add('-weather', 'Primal Snow', '[upkeep]');
			this.eachEvent('Weather');
		},
		// --- Constant Hail Chip Damage ---
		onWeather(target) {
			if (!target.hasType('Ice')) {
				this.damage(target.baseMaxHP / 16);
			}
		},
		// --- Boosts Ice-type attacks by 50% ---
		onBasePowerPriority: 1,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Ice') {
				return this.chainModify(1.5);
			}
		},
		// --- Prevents and destroys Aurora Veil ---
		onSideConditionStart(sideCondition, side, source) {
			if (sideCondition.id === 'auroraveil') {
				this.add('-message', "The sheer pressure of the Primal Snow overcharged and shattered the Aurora Veil!");
				return false; // Blocks Aurora Veil from being created entirely
			}
		},
		onEnd() {
			this.add('-weather', 'none');
		},
	},
