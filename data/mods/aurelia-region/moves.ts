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
				this.add('-message', `${pokemon.name} was chained to the ground!`);
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
				this.add('-message', `The shadow chains that held ${pokemon.name} captive vanished away.`);
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

	flightwave: {
		num: -2016,
		accuracy: 95,
		basePower: 100,
		category: "Special",
		name: "Flight Wave",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1}, // No contact flag since it is a projectile wave
		overrideOffensiveStat: 'atk', // Forces the move to calculate damage using physical Attack
		secondary: null,
		target: "allAdjacentFoes", // Targets both opponents in double battles without hitting your ally
		type: "Flying",
	},

	draincage: {
		num: -2017,
		accuracy: 100,
		basePower: 30,
		category: "Physical",
		name: "Drain Cage",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		volatileStatus: 'draincage',
		condition: {
			duration: 5, // Lasts between 4 and 5 turns natively
			durationModifier: true,
			onStart(pokemon, source) {
				this.add('-start', pokemon, 'Drain Cage', '[silent]');
				this.add('-message', `Draining roots from ${source.name} have trapped ${pokemon.name} in a Drain Cage!`);
			},
			onTrapPokemon(pokemon) {
				pokemon.tryTrap(); // Prevents manual switching
			},
			onResidualPriority: 11,
			onResidual(pokemon) {
				const source = this.effectState.source;
				if (source && !source.fainted && !pokemon.fainted) {
					// Drains a powerful 1/8th max HP per turn cycle
					const damage = this.damage(pokemon.baseMaxHP / 8); 
					if (damage) {
						this.heal(damage, source, pokemon); // Transfers the stolen health directly to the user
						this.add('-message', `The Drain Cage absorbs vitality from ${pokemon.name}!`);
					}
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Drain Cage', '[silent]');
				this.add('-message', `The regular binding of the Drain Cage faded from ${pokemon.name}.`);
			},
		},
		secondary: null,
		target: "normal",
		type: "Dark",
	},

	animicdrain: {
		num: -2018,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Animic-Drain",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		drain:, // Drains exactly 25% of the damage dealt
		secondary: {
			chance: 20, // 20% chance to Torment the target
			volatileStatus: 'torment',
		},
		// --- Forces a massive 3x damage multiplier exclusively against Dragon-types ---
		onEffectiveness(typeMod, target, type, move) {
			if (type === 'Dragon') {
				// Replaces standard 2x super-effective math with a hard 3x scaling check
				return Math.log2(3); 
			}
			return typeMod;
		},
		target: "normal",
		type: "Fairy",
	},

				shadowpunch: {
		inherit: true, // Pulls the official accuracy (true) and flags natively
		basePower: 75, // Upgraded from 60 to 75 BP!
	},
			
	shadowimpact: {
		num: -2019,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Shadow Impact",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1}, // Main hit has the contact flag
		onHit(target, source, move) {
			// Find adjacent enemies to the target in double/triple battles
			const adjacentFoes = target.adjacentFoes();
			if (adjacentFoes.length > 0) {
				this.add('-message', `The impact created a deafening sonic boom!`);
				
				// Create a temporary move structure for the 30 BP sound shockwave
				const soundWave = this.dex.moves.get(move.id);
				soundWave.basePower = 30;
				soundWave.category = "Special"; // Special shockwave category
				soundWave.type = "Normal"; // Sound waves traditionally fit Normal typing profiles
				soundWave.flags = {protect: 1, sound: 1}; // Specifically tagged as a sound-based move!

				for (const foe of adjacentFoes) {
					if (!foe.fainted) {
						this.actions.damage(this.actions.getDamage(source, foe, soundWave), foe, source, soundWave);
					}
				}
			}
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
	},
			
	nominalblast: {
		num: -2020,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		name: "Nominal Blast",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onModifyBasePower(basePower, pokemon, target, move) {
			// Extract the length of the target's active name (checks nickname first, falls back to species name)
			const nameLength = target.name.length;
			
			// Adds +20 base power for each character in the name
			const bonusPower = nameLength * 20;
			
			this.add('-message', `Nominal Blast analyzed the name "${target.name}" (${nameLength} characters)!`);
			return basePower + bonusPower;
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
	},
			
