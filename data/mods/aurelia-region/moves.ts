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
