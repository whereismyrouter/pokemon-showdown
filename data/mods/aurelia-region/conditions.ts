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
			this.add('-message', "Crimson clouds gather! A violent Rage Storm locks everyone in rage!");
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

	lunareclipse: {
		name: "Lunar Eclipse",
		effectType: "Weather",
		duration: 5,
		onStart(battle, source, effect) {
			this.add('-weather', 'Lunar Eclipse');
			this.add('-message', "The moon raises... A Lunar Eclipse has begun!");
		},
		onResidualPriority: 1,
		onResidual(battle) {
			this.add('-weather', 'Lunar Eclipse', '[upkeep]');
			this.eachEvent('Weather');
		},
		// --- 1. Boosts Ghost-type move power by 50% ---
		onBasePowerPriority: 10,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Ghost') {
				return this.chainModify(1.5);
			}
		},
		// --- 2 & 4. Type effectiveness overrides (Ghost hits Normal, Dark loses resistance) ---
		onEffectivenessPriority: 10,
		onEffectiveness(typeMod, target, type, move) {
			if (move && move.type === 'Ghost') {
				// Forces Ghost moves to hit Normal targets neutrally (normally immune, so typeMod is -25)
				if (type === 'Normal') return 0;
				// Forces Ghost moves to hit Dark targets neutrally (normally resisted, so typeMod is -1)
				if (type === 'Dark') return 0;
			}
			return typeMod;
		},
		// --- 3. Modifies Poltergeist mechanics inside the weather loop ---
		onModifyMove(move, pokemon) {
			if (move.id === 'poltergeist') {
				// Overrides the native item check to look at the user instead of the target
				move.onTryHit = function (target, source, move) {
					if (!source.item) {
						this.add('-fail', source, 'move: Poltergeist');
						return null;
					}
					this.add('-activate', source, 'move: Poltergeist', this.dex.items.get(source.item).name);
				};
			}
		},
		onEnd() {
			this.add('-weather', 'none');
		},
	},

	redsun: {
		name: "Red Sun",
		effectType: "Weather",
		duration: 5,
		onStart(battle, source, effect) {
			this.add('-weather', 'Red Sun');
			this.add('-message', "An apocalyptic Red Sun shines over the horizon! Typing boundaries have collapsed!");
		},
		onResidualPriority: 1,
		onResidual(battle) {
			this.add('-weather', 'Red Sun', '[upkeep]');
			this.eachEvent('Weather');
		},
		// --- Forces all type effectiveness calculations to absolute neutral (1x damage) ---
		onEffectivenessPriority: 10,
		onEffectiveness(typeMod, target, type, move) {
			// 0 means neutral damage. This completely ignores weaknesses, resistances, and immunities globally!
			return 0;
		},
		onEnd() {
			this.add('-weather', 'none');
		},
	},

	gustywinds: {
		name: "Gusty Winds",
		effectType: "Weather",
		duration: 5,
		onStart(battle, source, effect) {
			this.add('-weather', 'Gusty Winds');
			this.add('-message', "A severe Tornado Warning was issued! Violent Gusty Winds are tearing up the field!");
		},
		onResidualPriority: 1,
		onResidual(battle) {
			this.add('-weather', 'Gusty Winds', '[upkeep]');
			this.eachEvent('Weather');
		},
		// --- 1. Flying-types double their speed tier ---
		onModifySpePriority: 10,
		onModifySpe(spe, pokemon) {
			if (pokemon.hasType('Flying')) {
				return this.chainModify(2.0);
			}
		},
		// --- 2. Dynamically activates Wind Rider profiles field-wide ---
		onUpdate(battle) {
			for (const pokemon of this.getAllActive()) {
				if (pokemon.hasAbility('windrider') && !pokemon.volatiles['windriderboost']) {
					this.add('-activate', pokemon, 'ability: Wind Rider');
					this.boost({atk: 1}, pokemon);
					pokemon.addVolatile('windriderboost'); // Custom flag to prevent infinite stacking loop
				}
			}
		},
		// --- 3 & 4. Modifies the parameters of Brave Bird and Hurricane ---
		onModifyMove(move, pokemon) {
			// Brave Bird: Upgrades to 150 Base Power and forces 1/2 (50%) recoil damage
			if (move.id === 'bravebird') {
				move.basePower = 150;
				move.recoil = [1, 2]; // 50% recoil fraction calculation
			}
			// Hurricane: Targets absolutely everyone active on the pitch simultaneously
			if (move.id === 'hurricane') {
				move.target = 'all'; // Hits user, ally, and both opposing targets
			}
		},
		// --- 5. Cleans all entry hazards from BOTH sides of the pitch at turn-end ---
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onEndTurn(battle) {
			const sides = [this.sides[0], this.sides[1]];
			const hazards = ['stealthrock', 'spikes', 'toxicspikes', 'stickyweb', 'spikes'];
			let hazardsCleared = false;

			for (const side of sides) {
				for (const hazard of hazards) {
					if (side.sideConditions[hazard]) {
						side.removeSideCondition(hazard);
						hazardsCleared = true;
					}
				}
			}
			if (hazardsCleared) {
				this.add('-message', "The violent gusts of wind swept all entry hazards right off the field!");
			}
		},
		onEnd() {
			this.add('-weather', 'none');
			// Remove temporary Wind Rider tracking flags when weather fades
			for (const pokemon of this.getAllActive()) {
				pokemon.removeVolatile('windriderboost');
			}
		},
	},

	plague: {
		name: "Plague",
		effectType: "Weather",
		duration: 5,
		onStart(battle, source, effect) {
			this.add('-weather', 'Plague');
			this.add('-message', "A deafening buzz fills the air! A bug swarm drowns the sky!");
		},
		onResidualPriority: 1,
		onResidual(battle) {
			this.add('-weather', 'Plague', '[upkeep]');
			this.eachEvent('Weather');
		},
		// --- 1. Potenciación del 50% en ambas ofensivas para los Tipo Bicho ---
		onModifyAtkPriority: 10,
		onModifyAtk(atk, pokemon) {
			if (pokemon.hasType('Bug')) return this.chainModify(1.5);
		},
		onModifySpAPriority: 10,
		onModifySpA(spa, pokemon) {
			if (pokemon.hasType('Bug')) return this.chainModify(1.5);
		},
		// --- 2. Los movimientos Bicho de baja potencia (<60 BP) golpean dos veces ---
		onModifyMove(move, pokemon) {
			if (pokemon.hasType('Bug') && move.type === 'Bug' && move.basePower > 0 && move.basePower <= 60) {
				move.multihit = 2;
				this.debug('Plague otorga golpe doble a ' + move.name);
			}
		},
		// --- 3. Forzar la activación incondicional de la habilidad Swarm (Enjambre) ---
		onBasePowerPriority: 2,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Bug' && attacker.hasAbility('swarm')) {
				return this.chainModify(1.5); // Multiplicador nativo de Swarm sin restricción de PS
			}
		},
		// --- 4. Efecto Dancer global para todos los Tipo Bicho ---
		onAnyDamageStep(battle, source, target, move) {
			// El motor de Showdown procesa los movimientos de danza mediante eventos de acción.
			// Añadimos un interceptor para que si el movimiento tiene la propiedad 'dance', los bichos bailen.
		},
		onAnyAction(pokemon) {
			const action = this.queue.willMove(pokemon);
			const move = action && this.dex.moves.get(action.move.id);
			if (move && move.flags['dance']) {
				for (const bug of this.getAllActive()) {
					if (bug.hasType('Bug') && bug !== pokemon && !bug.fainted) {
						this.add('-activate', bug, 'ability: Dancer', '[from] weather: Plague');
						this.actions.useMove(move.id, bug);
					}
				}
			}
		},
		onEnd() {
			this.add('-weather', 'none');
		},
	},
