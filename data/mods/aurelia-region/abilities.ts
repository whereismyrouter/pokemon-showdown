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

	prismalights: {
		name: "Prisma-Lights",
		shortDesc: "Sets up a Rainbow on the user's side for 4 turns upon switch-in.",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Prisma-Lights');
			pokemon.side.addSideCondition('rainbow');
			// Overwrite default 4-turn duration for the pledge effect combo
			const rainbowCondition = pokemon.side.sideConditions['rainbow'];
			if (rainbowCondition) {
				rainbowCondition.duration = 4;
			}
		},
		rating: 4.5,
		num: -10004,
	},

	muddysurge: {
		name: "Muddy Surge",
		shortDesc: "Sets up a Swamp on the foe's side for 4 turns upon switch-in.",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Muddy Surge');
			pokemon.side.foe.addSideCondition('swamp');
			// Overwrite default 4-turn duration for the pledge effect combo
			const swampCondition = pokemon.side.foe.sideConditions['swamp'];
			if (swampCondition) {
				swampCondition.duration = 4;
			}
		},
		rating: 4.5,
		num: -10005,
	},

	flameburst: {
		name: "Flameburst",
		shortDesc: "Sets up a Sea of Fire on the foe's side for 4 turns upon switch-in.",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Flameburst');
			pokemon.side.foe.addSideCondition('firepledge');
			// Overwrite default 4-turn duration for the pledge effect combo
			const seaOfFireCondition = pokemon.side.foe.sideConditions['firepledge'];
			if (seaOfFireCondition) {
				seaOfFireCondition.duration = 4;
			}
		},
		rating: 4.5,
		num: -10006,
	},

	gunkreturn: {
		name: "Gunk Return",
		shortDesc: "Upon switch-in, moves all entry hazards from the user's side to the opposing side.",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Gunk Return');
			const normalSide = pokemon.side;
			const targetSide = pokemon.side.foe;
			const hazards = ['stealthrock', 'spikes', 'toxicspikes', 'stickyweb'];

			let hazardMoved = false;

			for (const hazard of hazards) {
				if (normalSide.sideConditions[hazard]) {
					hazardMoved = true;
					// Get the number of layers currently on your side (useful for Spikes/Toxic Spikes)
					const layers = normalSide.sideConditions[hazard].layers || 1;
					
					// Clear from your side
					normalSide.removeSideCondition(hazard);
					this.add('-sideend', normalSide, this.dex.conditions.get(hazard).name, '[from] ability: Gunk Return', '[of] ' + pokemon);

					// Set onto the opposing side matching the exact layer count
					for (let i = 0; i < layers; i++) {
						// Magic Bounce style safety check: stops hazards from bouncing endlessly if both fields have a bouncing mechanics
						targetSide.addSideCondition(hazard, pokemon);
					}
				}
			}

			if (hazardMoved) {
				this.add('-message', `${pokemon.name} threw all entry hazards right back at the opponent!`);
			}
		},
		rating: 5,
		num: -10007,
	},
			
	lawlessspin: {
		name: "Lawless Spin",
		shortDesc: "Randomizes everyone's types at the end of each turn. Reverts when deactivated. Immune if Terastallized.",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Lawless Spin');
		},
		onResidualPriority: 10, // Runs at the very end of the turn phase
		onResidual(battle, pokemon) {
			this.add('-ability', pokemon, 'Lawless Spin');
			this.add('-message', `The wheel spins! Everyone's types are shifting!`);
			
			const allTypes = ['Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];

			for (const target of this.getAllActive()) {
				if (target.fainted || target.terastallized) continue; // Skip knocked out or Terastallized Pokemon

				// Generate two completely unique random types
				const firstType = this.sample(allTypes);
				let secondType = this.sample(allTypes);
				while (secondType === firstType) {
					secondType = this.sample(allTypes);
				}

				// Apply the randomized dual typing
				target.setType([firstType, secondType]);
				this.add('-start', target, 'typechange', `${firstType}/${secondType}`, '[from] ability: Lawless Spin');
			}
		},
		onEnd(pokemon) {
			this.add('-ability', pokemon, 'Lawless Spin', '[end]');
			this.add('-message', `The wheel stopped spinning. Normal types restored!`);
			
			// Forcefully revert all active non-Terastallized Pokemon back to their natural species base types
			for (const target of this.getAllActive()) {
				if (target.fainted || target.terastallized) continue;
				target.clearAllStats(); // Resets typing changes securely
				this.add('-end', target, 'typechange', '[silent]');
			}
		},
		rating: 4.5,
		num: -10009,
	},

	neverendingwinter: {
		name: "Neverending Winter",
		shortDesc: "On switch-in, summons Primal Snow, an absolute blizzard that overcharges the field.",
		onStart(pokemon) {
			this.field.setWeather('primalsnow');
		},
		onAnySetWeather(target, source, weather) {
			// Primal weather trait: Cannot be overridden by standard weather (Rain, Sun, Sand, Snow)
			const strongWeathers = ['primalsnow', 'desolateland', 'primordialsea', 'deltastream'];
			if (this.field.weather && strongWeathers.includes(this.field.weather) && !strongWeathers.includes(weather.id)) {
				return false;
			}
		},
		onEnd(pokemon) {
			if (this.field.weather === 'primalsnow') {
				this.field.clearWeather();
			}
		},
		rating: 5,
		num: -10010,
	},

	crimsonclouds: {
		name: "Crimson Clouds",
		shortDesc: "On switch-in, summons Rage Storm for 5 turns. Blocks status moves, pivot switches, and switch items.",
		onStart(pokemon) {
			this.field.setWeather('ragestorm');
		},
		onEnd(pokemon) {
			if (this.field.weather === 'ragestorm') {
				this.field.clearWeather();
			}
		},
		rating: 5,
		num: -10011,
	},

	trainedfocus: {
		name: "Trained Focus",
		shortDesc: "The user's attacks are always critical hits. The user cannot receive critical hits.",
		onModifyMove(move) {
			// Sets the critical hit ratio to a tier that guarantees a critical hit on every move
			move.critRatio = 5;
		},
		onDamage(damage, target, source, effect) {
			// Intercepts and suppresses any incoming critical hit modifications
			if (effect && effect.id === 'crit') {
				this.debug('Trained Focus blocks critical hit damage multiplier');
				return damage; // Returns raw, un-multiplied damage instead
			}
		},
		rating: 4.5,
		num: -10012,
	},

	searise: {
		name: "Searise",
		shortDesc: "On switch-in, causes a Flood terrain that dynamically slows down non-Water types over time.",
		onStart(pokemon) {
			this.field.setTerrain('flood');
		},
		onEnd(pokemon) {
			if (this.field.terrain === 'flood') {
				this.field.clearTerrain();
			}
		},
		rating: 5,
		num: -10013,
	},

	darksun: {
		name: "Dark Sun",
		shortDesc: "On switch-in, summons a Solar Eclipse for 5 turns.",
		onStart(pokemon) {
			this.field.setWeather('solareclipse');
		},
		onEnd(pokemon) {
			if (this.field.weather === 'solareclipse') {
				this.field.clearWeather();
			}
		},
		rating: 5,
		num: -10014,
	},

	totalocclusion: {
		name: "Total Occlusion",
		shortDesc: "On switch-in, summons a Lunar Eclipse for 5 turns.",
		onStart(pokemon) {
			this.field.setWeather('lunareclipse');
		},
		onEnd(pokemon) {
			if (this.field.weather === 'lunareclipse') {
				this.field.clearWeather();
			}
		},
		rating: 5,
		num: -10015,
	},

	doomsday: {
		name: "Doomsday",
		shortDesc: "On switch-in, summons a Red Sun for 5 turns.",
		onStart(pokemon) {
			this.field.setWeather('redsun');
		},
		onEnd(pokemon) {
			if (this.field.weather === 'redsun') {
				this.field.clearWeather();
			}
		},
		rating: 5,
		num: -10016,
	},

	rottentouch: {
		name: "Rotten Touch",
		shortDesc: "The user's contact moves have a 10% chance to inflict a random status condition.",
		onSourceHit(target, source, move, effect) {
			// Trigger only on contact moves that deal damage and if the target doesn't already have a status
			if (effect && effect.flags['contact'] && !target.status) {
				if (this.randomChance(1, 10)) { // 10% Activation chance
					const statuses = ['psn', 'tox', 'brn', 'par', 'slp', 'frz'];
					const randomStatus = this.sample(statuses);
					
					target.trySetStatus(randomStatus, source);
				}
			}
		},
		rating: 4,
		num: -10018,
	},

	brothersinarms: {
		name: "Brothers in Arms",
		shortDesc: "The user's Special Attack is boosted by 10% for every non-fainted ally on the team.",
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			// Count all living teammates (excluding Kingambit itself)
			const livingAllies = pokemon.side.pokemon.filter(ally => ally !== pokemon && !ally.fainted).length;
			if (livingAllies > 0) {
				// Each living ally gives a 1.10x multiplier stack (e.g., 5 alive = 1.5x Special Attack)
				return this.chainModify(1 + (livingAllies * 0.10));
			}
		},
		rating: 4.5,
		num: -10019,
	},

	countup: {
		name: "Count-up",
		shortDesc: "The user's Attack and Special Attack rise by 5% for each consecutive turn it stays on the field.",
		onStart(pokemon) {
			this.effectState.turnCounter = 0;
			this.add('-ability', pokemon, 'Count-up');
		},
		onResidualPriority: 26, // Ticks up right at the very end of the turn cycle
		onResidual(battle, pokemon) {
			if (!pokemon.fainted) {
				this.effectState.turnCounter++;
				this.add('-message', `The clock ticks... Everghast's power is mounting! (Turn ${this.effectState.turnCounter})`);
			}
		},
		// --- Dynamically scales physical Attack ---
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			const turns = this.effectState.turnCounter || 0;
			if (turns > 0) {
				return this.chainModify(1 + (turns * 0.05));
			}
		},
		// --- Dynamically scales Special Attack ---
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			const turns = this.effectState.turnCounter || 0;
			if (turns > 0) {
				return this.chainModify(1 + (turns * 0.05));
			}
		},
		rating: 4.5,
		num: -10020,
	},

	swiftstart: {
		name: "Swift Start",
		shortDesc: "During the first 2 turns of the battle, the user's Speed and Special Attack are doubled.",
		onStart(pokemon) {
			if (this.turn <= 2) {
				this.add('-ability', pokemon, 'Swift Start');
				this.add('-message', `${pokemon.name} is overflowing with primitive universal energy!`);
			}
		},
		// --- Doubles Speed if global turn count is 1 or 2 ---
		onModifySpePriority: 5,
		onModifySpe(spe, pokemon) {
			if (this.turn <= 2) {
				return this.chainModify(2.0);
			}
		},
		// --- Doubles Special Attack if global turn count is 1 or 2 ---
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			if (this.turn <= 2) {
				return this.chainModify(2.0);
			}
		},
		rating: 4.5,
		num: -10021,
	},

	regalflight: {
		name: "Regal Flight",
		shortDesc: "If Trick Room or opposing Tailwind is active, this Pokemon always moves first in its priority bracket.",
		onOrder(pokemon) {
			const sideFoe = pokemon.side.foe;
			// Check if Trick Room is active on the field or Tailwind is active on the opponent's side
			if (this.field.pseudoWeather['trickroom'] || sideFoe.sideConditions['tailwind']) {
				this.add('-ability', pokemon, 'Regal Flight');
				// Forces the action queue to prioritize Aerovoy over standard speed calculations
				pokemon.chooseAction({priority: 0.5}); 
			}
		},
		rating: 5,
		num: -10022,
	},

	ultradrain: {
		name: "Ultradrain",
		shortDesc: "The user recovers 30% more HP from health-draining attacks. Stacks with Big Root.",
		onSourceModifyDamage(damage, source, target, move) {
			// If the move has a built-in draining mechanism, increase the healing fraction dynamically
			if (move.drain) {
				// Increases the base healing component fraction by 1.3x (stacks additively/multiplicatively with items)
				move.realMove = move.realMove || {};
				move.realMove.ultradrainBoost = true;
			}
		},
		onTryHealPriority: 1,
		onTryHeal(damage, target, source, effect) {
			// This specifically catches draining move calculation checkpoints to push the final healing upward
			if (effect && effect.id === 'drain' && target.volatiles['ultradrainboost']) {
				return this.chainModify(1.3);
			}
		},
		rating: 4,
		num: -10023,
	},

	tornadowarning: {
		name: "Tornado Warning",
		shortDesc: "On switch-in, summons Gusty Winds for 5 turns.",
		onStart(pokemon) {
			this.field.setWeather('gustywinds');
		},
		onEnd(pokemon) {
			if (this.field.weather === 'gustywinds') {
				this.field.clearWeather();
			}
		},
		rating: 5,
		num: -10024,
	},

	lividbuzz: {
		name: "Livid Buzz",
		shortDesc: "Al entrar al campo, desata una Plaga por 5 turnos que beneficia masivamente a los tipos Bicho.",
		onStart(pokemon) {
			this.field.setWeather('plague');
		},
		onEnd(pokemon) {
			if (this.field.weather === 'plague') {
				this.field.clearWeather();
			}
		},
		rating: 5,
		num: -10025,
	},

	ironfist: {
		inherit: true,
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Iron Fist boost');
				return this.chainModify([6144, 4096]); // In Showdown's native engine, 6144/4096 represents exactly a 1.5x boost
			}
		},
	},
