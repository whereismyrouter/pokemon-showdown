export const Abilities: {[k: string]: ModdedAbilityData} = {

	dizzystumble: {
		name: "Dizzy Stumble",
		shortDesc: "When this Pokemon's HP is lower than 40%, foes become confused.",
		onAfterMoveSecondarySelf(pokemon, attack, target) {
			if (!pokemon.m.dizzyStumbleTriggered && pokemon.hp <= pokemon.maxhp * 0.40) {
				pokemon.m.dizzyStumbleTriggered = true; 
				this.add('-ability', pokemon, 'Dizzy Stumble');
				for (const target Foe of pokemon.adjacentFoes()) {
					targetFoe.addVolatile('confusion');
				}
			}
		},
		onDamage(damage, target, source, effect) {
			if (!target.m.dizzyStumbleTriggered && target.hp <= target.maxhp * 0.40) {
				target.m.dizzyStumbleTriggered = true;
				this.add('-ability', target, 'Dizzy Stumble');
				for (const target Foe of target.adjacentFoes()) {
					targetFoe.addVolatile('confusion');
				}
			}
		},
	},

};

	doublewhip: {
		name: "Double Whip",
		shortDesc: "Whip moves hit twice. Second hit deals half damage and applies secondary effects.",
		onModifyMove(move, pokemon) {
			const whipMoves = ['powerwhip', 'tailwhip', 'firewhip']; 
			if (whipMoves.includes(move.id) && !move.multihit) {
				move.multihit = 2;
				move.smartTarget = true; 
			}
		},
		onBasePowerPriority: 8,
		onBasePower(basePower, pokemon, target, move) {
			const whipMoves = ['powerwhip', 'tailwhip', 'firewhip'];
			if (whipMoves.includes(move.id)) {
				return this.chainModify(0.5);
			}
		},
		rating: 3.5,
		num: -10002,
	},

	shadowimpact: {
		name: "Shadow Impact",
		shortDesc: "After defeating a foe with a contact move, opposing items are disabled for 1 turn.",
		onSourceAfterFaint(target, source, effect) {
			if (effect && effect.flags['contact']) {
				this.add('-ability', source, 'Shadow Impact');
				this.add('-message', `The opposing side's items were suppressed by shadows!`);
				// Applies an Embargo-like state to the opponent's side of the field for 1 turn
				source.side.foe.addSideCondition('shadowimpactside');
			}
		},
		rating: 4,
		num: -10003,
	},
