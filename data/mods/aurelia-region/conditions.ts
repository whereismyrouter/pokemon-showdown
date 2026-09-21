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

	ragestorm: {
		name: "Rage Storm",
		effectType: "Weather",
		duration: 5, // Lasts 5 turns as requested
		onStart(battle, source, effect) {
			this.add('-weather', 'Rage Storm');
			this.add('-message', "Crimson clouds gather! A violent Rage Storm locks everyone on the battlefield!");
		},
		onResidualPriority: 1,
		onResidual(battle) {
			this.add('-weather', 'Rage Storm', '[upkeep]');
			this.eachEvent('Weather');
		},
		// --- Global Taunt Effect (Bypassed ONLY by Castform-Hero) ---
		onBeforeMovePriority: 1,
		onBeforeMove(pokemon, target, move) {
			if (pokemon.species.id === 'castformhero') return; // Castform-Hero is completely immune
			if (move.category === 'Status' && move.id !== 'glitchcopy') { // Keep glitch copy functional
				this.add('-activate', pokemon, 'move: Taunt'); // Re-uses Taunt's failure prompt
				return false;
			}
		},
		// --- Disables Pivot Move Swapping ---
		onModifyMove(move, pokemon) {
			if (pokemon.species.id === 'castformhero') return;
			if (move.selfSwitch) {
				delete move.selfSwitch; // Keeps the move's damage but deletes the switching mechanics
				this.add('-message', `The Rage Storm prevents switching out!`);
			}
		},
		// --- Disables Switching Items or Switching Abilities ---
		onAnyDragOut(pokemon) {
			if (pokemon.species.id === 'castformhero') return;
			return false; // Prevents moves like Whirlwind/Roar or Emergency Exit from forcing a swap
		},
		onEnd() {
			this.add('-weather', 'none');
		},
	},

	flood: {
		name: "Flood",
		effectType: "Terrain",
		duration: 0, // Lasts indefinitely as long as Galemar remains active
		onStart(battle, source, effect) {
			this.add('-fieldstart', 'move: Flood');
			this.add('-message', "The sea rises violently! The entire battlefield is completely flooded!");
			this.effectState.turnCount = 1;
		},
		onResidualPriority: 2,
		onResidual(battle) {
			this.effectState.turnCount++;
			if (this.effectState.turnCount >= 3) {
				this.add('-message', "The Flood has grown too deep! Even airborne targets are being dragged down!");
			}
		},
		// --- Halves Speed based on Turn Count and Grounded Status ---
		onModifySpe(spe, pokemon) {
			if (pokemon.hasType('Water')) return; // Water types are completely immune

			const turnCount = this.effectState.turnCount || 1;
			if (turnCount <= 2) {
				// Turns 1 and 2: Only affect grounded non-Water types
				if (pokemon.isGrounded()) {
					return this.chainModify(0.5);
				}
			} else {
				// Turn 3 onwards: Affects absolutely every non-Water type
				return this.chainModify(0.5);
			}
		},
		// --- Dynamically Force-Activates Swift Swim and Torrent Modifiers Field-Wide ---
		onModifyMove(move, pokemon) {
			// If a Water-type possesses Swift Swim or Torrent, the terrain keeps them fully active
			if (pokemon.hasType('Water')) {
				if (pokemon.hasAbility('swiftswim')) {
					pokemon.abilityState.swiftSwimForced = true; // Flag to ensure speed double calculations clear
				}
			}
		},
		// --- Extra hook to double Swift Swim speed under Flood ---
		onModifySpePriority: 1,
		onModifySpeRule(spe, pokemon) {
			if (pokemon.hasType('Water') && pokemon.hasAbility('swiftswim')) {
				return this.chainModify(2);
			}
		},
		// --- Forces Torrent's 1.5x damage modifier to trigger unconditionally ---
		onBasePowerPriority: 2,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Water' && attacker.hasAbility('torrent')) {
				return this.chainModify(1.5); // Bypasses the standard 1/3 HP threshold check entirely
			}
		},
		onEnd() {
			this.add('-fieldend', 'move: Flood');
		},
	},

	solareclipse: {
		name: "Solar Eclipse",
		effectType: "Weather",
		duration: 5,
		onStart(battle, source, effect) {
			this.add('-weather', 'Solar Eclipse');
			this.add('-message', "An eerie shadow blots out the sun! A Solar Eclipse has begun!");
		},
		onResidualPriority: 1,
		onResidual(battle) {
			this.add('-weather', 'Solar Eclipse', '[upkeep]');
			this.eachEvent('Weather');
		},
		// --- 1. Dark-types get a 1.5x Special Defense boost ---
		onModifySpDPriority: 10,
		onModifySpD(spd, pokemon) {
			if (pokemon.hasType('Dark')) {
				return this.chainModify(1.5);
			}
		},
		// --- 2. Dark-type Special Moves gain +1 priority (except Parting Shot) ---
		onModifyPriority(priority, pokemon, target, move) {
			if (pokemon.hasType('Dark') && move.type === 'Dark' && move.category === 'Special') {
				if (move.id !== 'partingshot') {
					return priority + 1;
				}
			}
		},
		// --- 3. Fairy-types lose offensive power (33% weaker) ---
		onBasePowerPriority: 10,
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.hasType('Fairy')) {
				return this.chainModify(0.67);
			}
			// --- 5. Bug-type moves hit Dark-types 1.5x harder ---
			if (move.type === 'Bug' && defender.hasType('Dark')) {
				return this.chainModify(1.5);
			}
		},
		// --- 4. Dark Pulse becomes a spread move hitting all adjacent foes ---
		onModifyMove(move, pokemon) {
			if (move.id === 'darkpulse') {
				move.target = 'allAdjacentFoes';
			}
		},
		onEnd() {
			this.add('-weather', 'none');
		},
	},
