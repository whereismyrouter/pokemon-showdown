	boilingslapdown: {
		num: -2003, // Custom ID number
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Boiling Slapdown",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1}, // Has the contact flag as requested
		secondary: {
			chance: 20, // 20% base chance to burn
			status: 'brn',
		},
		target: "normal",
		type: "Water",
	},

	rootrush: {
		num: -2004,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Root-Rush",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1}, // Has the contact flag as requested
		overrideOffensiveStat: 'spe', // Forces the move to calculate damage using Speed instead of Attack
		secondary: null,
		target: "normal",
		type: "Grass",
	},

	fireclaw: {
		num: -2005,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Fire Claw",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, slicing: 1}, // Has both contact and slicing flags
		secondary: {
			chance: 10,
			status: 'brn',
		},
		target: "allAdjacentFoes", // This targets all adjacent enemies in both doubles and triples
		type: "Fire",
	},

	glitchcopy: {
		num: -2006,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Glitch Copy",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onHit(pokemon) {
			const possibleMoves: string[] = [];
			const team = pokemon.side.pokemon;

			// Step 1: Loop through all non-KOed team members
			for (const ally of team) {
				if (ally === pokemon || ally.fainted) continue;

				for (const moveSlot of ally.moveSlots) {
					const move = this.dex.moves.get(moveSlot.id);
					
					// Step 2: Apply all your restriction filters
					if (moveSlot.pp <= 0) continue; // Must have PP remaining
					if (move.isMoveDescriptor || move.isMax || move.isZ) continue;
					if (move.priority !== 0) continue; // No non-zero priority
					if (move.ohko) continue; // No OHKO moves
					
					// Filter explicit banned moves requested
					const explicitBans = ['substitute', 'transform', 'batonpass'];
					if (explicitBans.includes(move.id)) continue;

					// Filter Signature Moves (Showdown flags these via 'isNonstandard' or custom checks)
					// We check if a move belongs strictly to a specific species signature pool
					if (move.isNonstandard === 'Past' || move.realMove) continue; 
					
					// If it passes all checks, it's a valid choice!
					possibleMoves.push(moveSlot.id);
				}
			}

			// Step 3: Execute the copied move if any are available
			if (!possibleMoves.length) {
				this.add('-fail', pokemon, 'move: Glitch Copy');
				return false;
			}

			const chosenMoveId = this.sample(possibleMoves);
			const chosenMove = this.dex.moves.get(chosenMoveId);
			
			this.add('-message', `${pokemon.name} glitched and copied ${chosenMove.name}!`);

			// Step 4: Find the original ally move slot and deduct 1 PP from them
			for (const ally of team) {
				if (ally.fainted) continue;
				const slot = ally.moveSlots.find(m => m.id === chosenMoveId);
				if (slot) {
					slot.pp--;
					break;
				}
			}

			// Step 5: Use the move!
			this.actions.useMove(chosenMoveId, pokemon);
		},
		secondary: null,
		target: "self",
		type: "Normal",
	},

	coinflip: {
		num: -2007,
		accuracy: true, // Bypasses standard accuracy/evasion checks entirely
		basePower: 170,
		category: "Special",
		name: "Coin Flip",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, pulse: 1},
		onTryHit(target, source, move) {
			// Hard-coded 50/50 coin flip. True accuracy, items, and abilities are completely ignored.
			if (!this.randomChance(1, 2)) {
				this.add('-message', `The coin landed on the wrong side! Backfire!`);
				
				// Find all potential friendly targets (the user + any active allies)
				const allies = source.side.active.filter(a => a && !a.fainted);
				if (allies.length > 0) {
					const randomAlly = this.sample(allies);
					this.actions.damage(this.actions.getDamage(source, randomAlly, move), randomAlly, source, move);
				}
				return false; // Stop the move from hitting the enemy
			}
			return true; // The coin landed on the right side! Proceed to hit.
		},
		onModifyTarget(target, source, move) {
			// On a successful hit, choose a random active foe
			const foes = source.side.foe.active.filter(f => f && !f.fainted);
			if (foes.length > 0) {
				return this.sample(foes);
			}
		},
		onEffectiveness(typeMod, target, type, move) {
			// Forces the type effectiveness multiplier to always be neutral (1x damage), ignoring resistances!
			return 0;
		},
		secondary: null,
		target: "normal",
		type: "Steel",
	},

	icebergcrash: {
		num: -2008,
		accuracy: 100,
		basePower: 130,
		category: "Physical",
		name: "Iceberg Crash",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1}, // Has the contact flag
		recoil:, // Deals 33% recoil damage based on damage dealt
		onTryHit(target, source, move) {
			// Check if the target's side has active screens
			const targetSide = target.side;
			const screens = ['reflect', 'lightscreen', 'auroraveil'];
			let screenDestroyed = false;

			for (const screen of screens) {
				if (targetSide.sideConditions[screen]) {
					targetSide.removeSideCondition(screen);
					this.add('-sideend', targetSide, this.dex.conditions.get(screen).name, '[from] move: Iceberg Crash', '[of] ' + source);
					screenDestroyed = true;
				}
			}

			// If any screens were destroyed, apply the +30% damage boost flag
			if (screenDestroyed) {
				this.add('-message', `Iceberg Crash shattered the barriers and grew stronger!`);
				move.basePowerModifier = 1.3;
			}
		},
		onBasePower(basePower, pokemon, target, move) {
			// Multiplies the damage if the screen-destroyed modifier was flagged
			if (move.basePowerModifier) {
				return this.chainModify(move.basePowerModifier);
			}
		},
		secondary: null,
		target: "normal",
		type: "Ice",
	},

	weatherball: {
		inherit: true,
		onModifyType(move, pokemon) {
			switch (this.field.effectiveWeather()) {
				case 'sunnyday':
				case 'desolateland':
					move.type = 'Fire';
					break;
				case 'raindance':
				case 'primordialsea':
					move.type = 'Water';
					break;
				case 'sandstorm':
					move.type = 'Rock';
					break;
				case 'hail':
				case 'snow':
				case 'primalsnow':
					move.type = 'Ice';
					break;
				// --- Custom Weather Multi-Type Shifts ---
				case 'ragestorm':
					move.type = 'Fighting';
					break;
				case 'plague':
					move.type = 'Bug';
					break;
				case 'solareclipse':
					move.type = 'Dark';
					break;
				case 'lunareclipse':
					move.type = 'Ghost';
					break;
				case 'gustywinds':
					move.type = 'Flying';
					break;
				case 'redsun':
					move.type = 'Normal'; // Stays normal but gets the damage boost below!
					break;
			}
		},
		onModifyMove(move, pokemon) {
			const doublePowerWeathers = [
				'sunnyday', 'desolateland', 'raindance', 'primordialsea', 'sandstorm', 'hail', 'snow', 'primalsnow',
				'ragestorm', 'plague', 'solareclipse', 'lunareclipse', 'gustywinds', 'redsun'
			];
			if (doublePowerWeathers.includes(this.field.effectiveWeather())) {
				move.basePower *= 2;
			}
		},
	},

	magicbarrage: {
		num: -2009,
		accuracy: 100,
		basePower: 130,
		category: "Physical",
		name: "Magic Barrage",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, punch: 1, pulse: 1}, // No contact flag, but has punch and pulse!
		secondary: {
			chance: 100, // 100% chance to drop defenses
			boosts: {
				def: -1,
				spd: -1,
			},
		},
		target: "normal",
		type: "Fairy",
	},

	riposte: {
		num: -2010,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Riposte",
		pp: 10,
		priority: 5, // Highly reactive +5 priority to get ready before other priority moves
		flags: {protect: 1},
		onTryPriority(priority, pokemon, target, move) {
			// Prepares the stance at the start of the action phase
		},
		onHit(pokemon) {
			this.add('-singleturn', pokemon, 'move: Riposte');
			pokemon.addVolatile('ripostestance');
		},
		condition: {
			duration: 1,
			onStart(pokemon) {
				this.add('-message', `${pokemon.name} readied its blade for a perfect riposte!`);
			},
			// Intercepts any move before it hits anyone on the user's side
			onAnyTryMove(source, target, move) {
				const user = this.effectState.target;
				
				// Only intercept if the opponent is using a high-priority move targeting the user's side
				if (source.side !== user.side && move.priority > 0 && target.side === user.side) {
					this.add('-activate', user, 'move: Riposte');
					this.add('-message', `${user.name} parried ${source.name}'s ${move.name}!`);

					if (this.gameType === 'singles') {
						// SINGLES: The attacker hits themselves with their own move!
						this.add('-message', `${source.name} was forced to strike itself!`);
						this.actions.useMove(move.id, source, source);
					} else {
						// DOUBLES: Redirect the attack to the opponent's active ally
						const foeAllies = source.side.active.filter(a => a && a !== source && !a.fainted);
						if (foeAllies.length > 0) {
							const randomFoeAlly = this.sample(foeAllies);
							this.add('-message', `${user.name} redirected the strike toward ${randomFoeAlly.name}!`);
							this.actions.useMove(move.id, source, randomFoeAlly);
						} else {
							// Fallback to hitting themselves if no ally is active in doubles
							this.actions.useMove(move.id, source, source);
						}
					}
					return false; // Cancels the original execution of the move against your team entirely!
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Fighting",
	},

	doombeam: {
		num: -2011,
		accuracy: 100,
		basePower: 230,
		category: "Special",
		name: "Doom Beam",
		pp: 5,
		priority: 0,
		flags: {protect: 1, recharge: 1, mirror: 1}, // Has the recharge flag set
		self: {
			volatileStatus: 'mustrecharge', // Forces the user to recharge on the next turn
		},
		secondary: null,
		target: "normal",
		type: "Dark", // Fits the 'Doom' theme perfectly as a Dark-type tactical nuke
	},
		
	shadowchains: {
		num: -2012,
		accuracy: 80,
		basePower: 20,
		category: "Physical",
		name: "Shadow Chains",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1}, // No tiene flag de contacto porque usa cadenas espectrales a distancia
		volatileStatus: 'shadowchains',
		condition: {
			duration: 4, // 4 ticks internos equivalen a la resolución del turno actual + 3 turnos completos de atrapamiento
			onStart(pokemon, source) {
				this.add('-start', pokemon, 'Shadow Chains', '[silent]');
				this.add('-message', `¡Cadenas espectrales han encadenado a ${pokemon.name} al suelo!`);
			},
			onTrapPokemon(pokemon) {
				pokemon.tryTrap(); // Fuerza el estado de atrapamiento independientemente de quién esté en el campo
			},
			onResidualPriority: 11,
			onResidual(pokemon) {
				this.damage(pokemon.baseMaxHP / 16); // Hace daño residual de 1/16 por cada turno atrapado
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Shadow Chains', '[silent]');
				this.add('-message', `Las cadenas de sombras que retenían a ${pokemon.name} se han desvanecido.`);
			},
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
	},

	tacticalblast: {
		num: -2013,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Tactical Blast",
		pp: 5,
		priority: 1, // Special priority mechanism
		flags: {protect: 1, mirror: 1},
		onTry(source, target) {
			const action = this.queue.willMove(target);
			const move = action && this.dex.moves.get(action.move.id);
			// Fails instantly if the opponent is status-checking, setting up, or switching
			if (!move || move.category === 'Status') {
				this.add('-fail', source);
				return null;
			}
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
	},

	whispingmemory: {
		num: -2014,
		accuracy: 100,
		basePower: 20,
		category: "Physical", // Default category, overridden dynamically per hit
		name: "Whisping Memory",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		// --- The core complex loop that handles the fallen allies ---
		onPrepareHit(target, source, move) {
			const team = source.side.pokemon;
			const faintedAllies = team.filter(p => p.fainted);

			if (faintedAllies.length === 0) {
				this.add('-fail', source, 'move: Whisping Memory');
				return null;
			}

			// Forces the move to hit exactly once for every fallen teammate
			move.multihit = faintedAllies.length;
			// Stores the fainted allies in the move state so we can access them hit-by-hit
			move.realMove = move.realMove || {};
			move.realMove.faintedList = faintedAllies;
		},
		// --- This hooks into EACH individual hit of the multi-hit sequence ---
		onHit(target, source, move) {
			const faintedList = move.realMove?.faintedList;
			if (!faintedList) return;

			// Get the specific fallen ally for this current hit number
			const currentHitIndex = move.hit - 1;
			const ally = faintedList[currentHitIndex];

			if (ally) {
				// Step 1: Announce which fallen teammate is attacking from beyond the grave
				this.add('-message', `The spirit of ${ally.name} strikes through the Whisping Memory!`);

				// Step 2: Compare its raw base stats to see if it's a physical or special attacker
				const highestStatName = ally.baseSpecies.baseStats.atk >= ally.baseSpecies.baseStats.spa ? 'atk' : 'spa';
				
				// Step 3: Dynamically shift the move category and calculation hooks for this hit
				if (highestStatName === 'atk') {
					move.category = 'Physical';
					move.overrideOffensiveStat = 'atk';
					// Temporarily inject the ally's physical attack stat value for calculation
					source.storedStats.atk = ally.baseSpecies.baseStats.atk; 
				} else {
					move.category = 'Special';
					move.overrideOffensiveStat = 'spa';
					// Temporarily inject the ally's special attack stat value for calculation
					source.storedStats.spa = ally.baseSpecies.baseStats.spa;
				}
			}
		},
		// --- Cleanup Step: Revert Everghast's stats back to normal after the move finishes ---
		onAfterMove(source) {
			source.storedStats.atk = source.baseSpecies.baseStats.atk;
			source.storedStats.spa = source.baseSpecies.baseStats.spa;
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
	},

	sparkingswap: {
		num: -2015,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Sparking Swap",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1}, // ¡Categoría Especial pero hace contacto físico!
		selfSwitch: true, // Fuerza al usuario a retirarse tras golpear con éxito
		secondary: null,
		target: "normal",
		type: "Fire",
	},
