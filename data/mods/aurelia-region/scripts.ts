export const Scripts: ModdedBattleScriptsData = {
	init() {
		// --- Bucle dinámico para expandir el movepool de Unown ---
		const unownLearnset = this.data.Learnsets.unown.learnset;

		for (const moveId in this.data.Moves) {
			const move = this.data.Moves[moveId];
			
			// Filtrar condiciones: Categoría Especial, Precisión 100% (true) y BP entre 75 y 100
			if (
				move.category === 'Special' &&
				move.accuracy === 100 &&
				move.basePower >= 75 &&
				move.basePower <= 100
			) {
				// Añade el movimiento de forma legal al movepool de Unown para la Gen 9
				unownLearnset[moveId] = ["9M"];
			}
		}
	},
	pokemon: {
		onStart() {
			// (Mantiene aquí el script de validación de Combee macho que programamos antes)
			if (this.baseSpecies.baseSpecies === 'Combee' && this.gender === 'F' && this.hasAbility('lividbuzz')) {
				this.setAbility('hustle'); 
			}
		},
	},
};
