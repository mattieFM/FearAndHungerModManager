/** @namespace MATTIE.TaF the namespace for trepidation and famine (difficulty mod) */

MATTIE.TaF = {};

/** @namespace MATTIE.TaF.config the namespace for trepidation and famine config (difficulty mod config) */
MATTIE.TaF.config = {};

Object.defineProperties(MATTIE.TaF.config, {

	shouldScaleHealingWhispers: {
		get: () => MATTIE.configGet('shouldScaleHealingWhispers', true),
		set: (value) => { MATTIE.configSet('shouldScaleHealingWhispers', value); },
	},
});
