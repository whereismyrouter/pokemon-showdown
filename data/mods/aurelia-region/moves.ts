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
