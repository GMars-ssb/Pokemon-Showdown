'use strict';

/** @type {{[k: string]: ModdedMoveData}} */
let BattleMovedex = {
	/*
	// Example
	"moveid": {
		accuracy: 100, // a number or true for always hits
		basePower: 100, // Not used for Status moves, base power of the move, number
		category: "Physical", // "Physical", "Special", or "Status"
		desc: "", // long description
		shortDesc: "", // short description, shows up in /dt
		id: "moveid",
		name: "Move Name",
		pp: 10, // unboosted PP count
		priority: 0, // move priority, -6 -> 6
		flags: {}, // Move flags https://github.com/Zarel/Pokemon-Showdown/blob/master/data/moves.js#L1-L27
		secondary: {
			status: "tox",
			chance: 20,
		}, // secondary, set to null to not use one. Exact usage varies, check data/moves.js for examples
		target: "normal", // What does this move hit?
		// normal = the targeted foe, self = the user, allySide = your side (eg light screen), foeSide = the foe's side (eg spikes), all = the field (eg raindance). More can be found in data/moves.js
		type: "Water", // The move's type
		// Other useful things
		noPPBoosts: true, // add this to not boost the PP of a move, not needed for Z moves, dont include it otherwise
		isZ: "crystalname", // marks a move as a z move, list the crystal name inside
		zMoveEffect: '', // for status moves, what happens when this is used as a Z move? check data/moves.js for examples
		zMoveBoost: {atk: 2}, // for status moves, stat boost given when used as a z move
		critRatio: 2, // The higher the number (above 1) the higher the ratio, lowering it lowers the crit ratio
		drain: [1, 2], // recover first num / second num % of the damage dealt
		heal: [1, 2], // recover first num / second num % of the target's HP
	},
	*/
	// Please keep sets organized alphabetically based on staff member name!
	// Aelita
	energyfield: {
		accuracy: 100,
		basePower: 140,
		category: "Special",
		desc: "Has a 40% chance to paralyze the target. Lowers the user's spa, spd, and spe by 1 stage.",
		shortDesc: "40% to paralyze target. Lowers user's spa, spd, spe.",
		id: "energyfield",
		isNonstandard: true,
		name: "Energy Field",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Electro Ball", target);
			this.add('-anim', source, "Ion Deluge", target);
		},
		self: {boosts: {spa: -1, spd: -1, spe: -1}},
		secondary: {
			chance: 40,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		zMovePower: 200,
	},
	// ant
	truant: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		desc: "The target's ability is changed to Truant if this move hits.",
		shortDesc: "Changes the target's ability to Truant.",
		id: "truant",
		name: "TRU ANT",
		pp: 5,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Sunsteel Strike', target);
		},
		onHit: function (pokemon) {
			let oldAbility = pokemon.setAbility('truant');
			if (oldAbility) {
				this.add('-ability', pokemon, 'Truant', '[from] move: TRU ANT');
				return;
			}
			return false;
		},
		target: "normal",
		type: "Steel",
	},
	// Akir
	compost: {
		accuracy: true,
		category: "Status",
		desc: "If any ally of the user fainted last turn, the user's atk, def, and spd are boosted by 1 stage, and the user's bad status condition is cured.",
		shortDesc: "Boosts stats and cures status if ally fainted last turn.",
		id: "compost",
		name: "Compost",
		pp: 5,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		heal: [1, 2],
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Ingrain", target);
		},
		onHit: function (pokemon) {
			if (pokemon.side.faintedLastTurn) {
				this.boost({atk: 1, def: 1, spd: 1});
				pokemon.cureStatus();
			}
		},
		secondary: null,
		target: "self",
		type: "Ghost",
	},
	// Beowulf
	buzzingoftheswarm: {
		accuracy: 100,
		basePower: 95,
		category: "Physical",
		desc: "Has a 20% chance to cause the target to flinch.",
		shortDesc: "20% chance to flinch",
		id: "buzzingoftheswarm",
		name: "Buzzing of the Swarm",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Bug Buzz', source);
		},
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Bug",
	},
	// cc
	restartingrouter: {
		accuracy: 100,
		category: "Status",
		desc: "Boosts the user's spa and spe by 1 stage.",
		shortDesc: "+1 spa, spe",
		id: "restartingrouter",
		name: "Restarting Router",
		pp: 10,
		priority: 0,
		flags: {mirror: 1, snatch: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Charge', source);
		},
		boosts: {spa: 1, spe: 1},
		secondary: null,
		target: "self",
		type: "Electric",
	},
	// Cerberax
	blimpcrash: {
		accuracy: true,
		onModifyAccuracy: function (accuracy, target, source) {
			if (target.isGrounded()) return 80;
			return accuracy;
		},
		basePower: 165,
		category: "Physical",
		desc: "Will always hit a target who isn't grounded. The user and the target will be grounded, and the user will take 1/2 of the damage inflicted as recoil.",
		shortDesc: "Always hits levitating, grounds both sides, 1/2 recoil.",
		id: "blimpcrash",
		name: "Blimp Crash",
		pp: 5,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Head Smash', target);
			this.add('-anim', source, 'Earthquake', target);
		},
		onHit: function (target, source) {
			target.addVolatile('smackdown');
			source.addVolatile('smackdown');
		},
		secondary: null,
		recoil: [1, 2],
		target: "normal",
		type: "Flying",
	},
	// deg
	luciddreams: {
		accuracy: 100,
		category: "Status",
		desc: "The foe falls asleep, and is inflicted with and leech seed. The user loses 1/2 of their HP.",
		shortDesc: "Foe: sleep + nightmare + leech seed. User loses 1/2 HP.",
		id: "luciddreams",
		name: "Lucid Dreams",
		pp: 5,
		priority: 0,
		flags: {mirror: 1, snatch: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Dark Void', target);
			this.add('-anim', source, 'Night Shade', target);
		},
		onHit: function (target, source, move) {
			let hadEffect = false;
			if (target.trySetStatus('slp')) hadEffect = true;
			if (target.addVolatile('nightmare')) hadEffect = true;
			if (target.addVolatile('leechseed')) hadEffect = true;
			if (!hadEffect) {
				this.add('-fail', target);
			} else {
				this.damage(source.maxhp / 2, source, source, 'recoil');
			}
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
	},
	// E4 Flint
	fangofthefireking: {
		accuracy: 100,
		basePower: 0,
		damage: 150,
		category: "Physical",
		desc: "Does 150 damage and burns the target.",
		shortDesc: "Does 150 damage, burns.",
		id: "fangofthefireking",
		name: "Fang of the Fire King",
		pp: 10,
		priority: 0,
		flags: {mirror: 1, protect: 1, bite: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Burn Up', target);
			this.add('-anim', source, 'Crunch', target);
			this.add('-anim', source, 'Crunch', target);
		},
		onHit: function (target, source) {
			target.setStatus('brn', source, null, true);
			// Cringy message
			if (this.random(5) === 1) this.add(`c|@e4 Flint|here's a __taste__ of my __firepower__ XD`);
		},
		secondary: null,
		target: "normal",
		type: "Fire",
	},
	// EV
	evoblast: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "This move's type changes to match the user's primary type. This move is a Physical attack if the user's atk stat is greater than its spa stat, otherwise its a Special attack.",
		shortDesc: "Type = users type. Physical if atk > spa, else Special.",
		id: "evoblast",
		name: "Evoblast",
		pp: 10,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onModifyMove: function (move, pokemon, target) {
			move.type = pokemon.types[0];
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Extreme Evoboost', source);
			switch (move.type) {
			case 'Fire':
				this.add('-anim', source, 'Flamethrower', target);
				break;
			case 'Electric':
				this.add('-anim', source, 'Thunderbolt', target);
				break;
			case 'Water':
				this.add('-anim', source, 'Bubblebeam', target);
				break;
			case 'Psychic':
				this.add('-anim', source, 'Psybeam', target);
				break;
			case 'Dark':
				this.add('-anim', source, 'Dark Pulse', target);
				break;
			case 'Grass':
				this.add('-anim', source, 'Solar Beam', target);
				break;
			case 'Ice':
				this.add('-anim', source, 'Ice Beam', target);
				break;
			case 'Fairy':
				this.add('-anim', source, 'Dazzling Gleam', target);
				break;
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal",
	},
	// eternally
	quack: {
		accuracy: 100,
		category: "Status",
		desc: "Boosts the users spa and def by 1 stage.",
		shortDesc: "+1 def, spa",
		id: "quack",
		name: "Quack",
		pp: 5,
		priority: 0,
		flags: {mirror: 1, snatch: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Feather Dance', source);
			this.add('-anim', source, 'Aqua Ring', source);
		},
		boosts: {def: 1, spa: 1},
		secondary: null,
		target: "self",
		type: "Flying",
	},
	// Hippopotas
	hazardpass: {
		accuracy: 100,
		category: "Status",
		pp: 20,
		desc: "The user sets 2 of Stealth Rocks, Spikes (1 layer), Toxic Spikes (1 layer), and Sticky Web on the foe's side of the field, and then switches out.",
		shortDesc: "Sets 2 random hazards, then switches out.",
		id: "hazardpass",
		isNonstandard: true,
		name: "Hazard Pass",
		flags: {reflectable: 1, mirror: 1, authentic: 1},
		onPrepareHit: function () {
			this.attrLastMove('[still]');
		},
		onHitSide: function (target, source) {
			// All possible hazards, and their maximum possible layer count
			/** @type {{[key: string]: number}} */
			let hazards = {stealthrock: 1, spikes: 3, toxicspikes: 2, stickyweb: 1};
			// Check how many layers of each hazard can still be added to the foe's side
			if (target.getSideCondition('stealthrock')) delete hazards.stealthrock;
			if (target.getSideCondition('spikes')) {
				hazards.spikes -= target.sideConditions['spikes'].layers;
				if (!hazards.spikes) delete hazards.spikes;
			}
			if (target.getSideCondition('toxicspikes')) {
				hazards.toxicspikes -= target.sideConditions['toxicspikes'].layers;
				if (!hazards.toxicspikes) delete hazards.toxicspikes;
			}
			if (target.getSideCondition('stickyweb')) delete hazards.stickyweb;
			// Create a list of hazards not yet at their maximum layer count
			let hazardTypes = Object.keys(hazards);
			// If there are no possible hazards, don't do anything
			if (!hazardTypes.length) return false;
			// Pick a random hazard, and set it
			let hazard1 = this.sample(hazardTypes);
			// Theoretically, this should always work
			this.add('-anim', source, this.getMove(hazard1).name, target);
			target.addSideCondition(hazard1, source, this.effect);
			// If that was the last possible layer of that hazard, remove it from our list of possible hazards
			if (hazards[hazard1] === 1) {
				hazardTypes.splice(hazardTypes.indexOf(hazard1), 1);
				// If there are no more hazards we can set, end early on a success
				if (!hazardTypes.length) return true;
			}
			// Set the last hazard and animate the switch
			let hazard2 = this.sample(hazardTypes);
			this.add('-anim', source, this.getMove(hazard2).name, target);
			target.addSideCondition(hazard2, source, this.effect);
			this.add('-anim', source, "Baton Pass", target);
		},
		selfSwitch: true,
		secondary: null,
		target: "foeSide",
		type: "Normal",
		zMoveBoost: {def: 1},
	},
	//hoeenhero
	scripting: {
		accuracy: 100,
		category: "Status",
		desc: "The user summon's rainy weather and boosts its spa by 1 stage.",
		shortDesc: "Rain Dance & +1 spa",
		id: "scripting",
		name: "Scripting",
		pp: 5,
		priority: 0,
		flags: {mirror: 1, snatch: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Calm Mind', source);
			this.add('-anim', source, 'Geomancy', source);
		},
		weather: 'raindance',
		boosts: {spa: 1},
		secondary: null,
		target: "self",
		type: "Psychic",
	},
	// Iyarito
	vbora: {
		accuracy: 100,
		category: "Status",
		desc: "Cures the user's party of all status conditions, but poisons the user.",
		shortDesc: "Cures party's statuses, poisons self.",
		id: "vbora",
		name: "Víbora",
		pp: 5,
		flags: {mirror: 1, snatch: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Acid Armor', source);
		},
		onHit: function (pokemon, source, move) {
			//this.add('-activate', source, 'move: Víbora');
			let success = false;
			for (const ally of pokemon.side.pokemon) {
				if (ally.cureStatus()) success = true;
			}
			pokemon.setStatus('psn', pokemon);
			return success;
		},
		secondary: null,
		target: "allyTeam",
		type: "Poison",
	},
	// kalalokki
	maelstrm: {
		accuracy: 85,
		basePower: 100,
		category: "Special",
		desc: "The user traps the target, preventing them from switching out.",
		shortDesc: "Traps the target",
		id: "maelstrm",
		name: "Maelström",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		volatileStatus: 'partiallytrapped',
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Dark Void', source);
			this.add('-anim', source, 'Surf', source);
		},
		onHit: function (target, source, move) {
			target.addVolatile('trapped', source, move);
		},
		secondary: null,
		target: "normal",
		type: "Water",
	},
	// Level 51
	nextlevelstrats: {
		accuracy: true,
		category: "Status",
		desc: "The user gains 10 levels when using this move.",
		shortDesc: "User gains 10 levels",
		id: "nextlevelstrats",
		name: "Next Level Strats",
		pp: 5,
		priority: 0,
		flags: {snatch: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Nasty Plot", target);
		},
		onHit: function (pokemon) {
			const template = pokemon.template;
			pokemon.level += 10;
			pokemon.set.level = pokemon.level;
			pokemon.formeChange(template);
			// ability is set to default from formeChange
			pokemon.setAbility('parentalbond');

			pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
			this.add('detailschange', pokemon, pokemon.details);

			const newHP = Math.floor(Math.floor(2 * template.baseStats['hp'] + pokemon.set.ivs['hp'] + Math.floor(pokemon.set.evs['hp'] / 4) + 100) * pokemon.level / 100 + 10);
			pokemon.hp = newHP - (pokemon.maxhp - pokemon.hp);
			pokemon.maxhp = newHP;
			this.add('-heal', pokemon, pokemon.getHealth, '[silent]');

			this.add('-message', `${pokemon.name} advanced 10 levels! It is now level ${pokemon.level}!`);
		},
		secondary: null,
		target: "self",
		type: "Normal",

	},
	// LifeisDANK
	barfight: {
		accuracy: 100,
		basePower: 10,
		category: "Physical",
		desc: "3 Priority. Gives the user and target +3 atk, -3 def and confusion.",
		shortDesc: "Hits first. +3 atk, -3 def & confusion for both sides.",
		id: "barfight",
		name: "Bar Fight",
		pp: 10,
		priority: 3,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Fake Out", target);
			this.add('-anim', source, "Feather Dance", target);
		},
		onHit: function (target, source) {
			this.boost({atk: 3, def: -3}, target);
			this.boost({atk: 3, def: -3}, source);
			target.addVolatile('confusion');
			source.addVolatile('confusion');
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
	},
	// MacChaeger
	naptime: {
		accuracy: 100,
		category: "Status",
		desc: "The user falls asleep for the next turn and restores 50% of its HP, curing itself of any major status condition. If the user falls asleep in this way, all other active Pokemon that are not asleep or frozen also try to use Nap Time. Fails if the user has full HP, is already asleep, or if another effect is preventing sleep.",
		shortDesc: "All active Pokemon sleep 1 turn, restore HP & status.",
		id: "naptime",
		isNonstandard: true,
		name: "Nap Time",
		pp: 5,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Rest", target);
			this.add('-anim', source, "Aromatic Mist", target);
		},
		onTryMove: function (pokemon) {
			if (pokemon.hp < pokemon.maxhp && pokemon.status !== 'slp' && !pokemon.hasAbility('comatose')) return;
			this.add('-fail', pokemon);
			return null;
		},
		onHit: function (target, source, move) {
			let napWeather = this.pseudoWeather['naptime'];
			// Trigger sleep clause if not the original user
			// @ts-ignore
			if (!target.setStatus('slp', napWeather.source, move)) return false;
			target.statusData.time = 2;
			target.statusData.startTime = 2;
			this.heal(target.maxhp / 2); //Aesthetic only as the healing happens after you fall asleep in-game
			this.add('-status', target, 'slp', '[from] move: Rest');
			// @ts-ignore
			if (napWeather.source === target) {
				for (let i = 0; i < this.sides.length; i++) {
					for (let j = 0; j < this.sides[i].active.length; j++) {
						let curMon = this.sides[i].active[j];
						if (curMon === source) continue;
						if (curMon && curMon.hp && curMon.status !== 'slp' && curMon.status !== 'frz' && !curMon.hasAbility('comatose')) {
							this.add('-anim', source, "Yawn", curMon);
							this.useMove(move, curMon, curMon, move);
						}
					}
				}
			}
			this.removePseudoWeather('naptime');
		},
		pseudoWeather: 'naptime',
		effect: {
			duration: 1,
		},
		target: "self",
		type: "Fairy",
		zMoveEffect: 'clearnegativeboosts',
	},
	// martha
	crystalboost: {
		accuracy: 90,
		basePower: 75,
		category: "Special",
		desc: "Has a 50% chance to boost the user's spa by 1 stage.",
		shortDesc: "50% chance to boost spa by 1 stage.",
		id: "crystalboost",
		name: "Crystal Boost",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', target, "Power Gem", target);
		},
		secondary: {
			chance: 50,
			boosts: {
				spa: 1,
			},
		},
		target: "normal",
		type: "Rock",
	},
	// Megazard
	tippingover: {
		accuracy: 100,
		basePower: 20,
		basePowerCallback: function (pokemon, target, move) {
			return move.basePower + 20 * pokemon.positiveBoosts();
		},
		category: "Physical",
		desc: "Power is equal to 20+(X*20), where X is the user's total stat stage changes that are greater than 0. If the user had any stockpile layers, they lose them.",
		shortDesc: "+20 power for each boost. Resets Stockpile.",
		id: "tippingover",
		name: "Tipping Over",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dragon Hammer", target);
			this.add('-anim', target, "Explosion", target);
		},
		onTry: function (pokemon) {
			if (!pokemon.volatiles['stockpile']) return false;
		},
		onAfterMove: function (pokemon) {
			pokemon.removeVolatile('stockpile');
		},
		secondary: null,
		target: "normal",
		type: "???",
	},
	// moo
	proteinshake: {
		accuracy: 100,
		category: "Status",
		desc: "The user's Attack, Special Attack, and Speed are boosted by 1. The user also gains 100kg of weight.",
		shortDesc: "+1 atk, spa, and spe. User gains 100kg.",
		id: "proteinshake",
		name: "Protein Shake",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Milk Drink", source);
		},
		volatileStatus: 'proteinshake',
		effect: {
			onStart: function (pokemon) {
				this.effectData.multiplier = 1;
				this.add('-start', pokemon, 'Protein Shake', '[silent]');
			},
			onRestart: function (pokemon) {
				this.effectData.multiplier++;
				this.add('-start', pokemon, 'Protein Shake', '[silent]');
			},
			onModifyWeightPriority: 1,
			onModifyWeight: function (weight, pokemon) {
				if (this.effectData.multiplier) {
					weight += this.effectData.multiplier * 100;
					return weight;
				}
			},
		},
		boosts: {atk: 1, def: 1, spe: 1},
		secondary: null,
		target: "self",
		type: "Normal",
	},
	// The Immortal
	ultrasucc: {
		accuracy: 95,
		basePower: 90,
		desc: "The user boosts their speed by 1 stage, and recovers 50% of the damage dealt.",
		shortDesc: "+1 spe, user heals 50% of the damage dealt.",
		id: "ultrasucc",
		name: "Ultra Succ",
		category: "Physical",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, heal: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Dragon Ascent", target);
			this.add('-anim', source, "Draining Kiss", target);
		},
		self: {
			boosts: {spe: 1},
		},
		drain: [1, 2],
		target: "normal",
		type: "Fighting",
	},
	// Tiksi
	devolutionwave: {
		accuracy: true,
		basePower: 25,
		category: "Physical",
		desc: "This move hits 5 times. After the first hit, the target is badly poisoned or paralyzed. After the second hit, the target swaps abilities with the user, or gains the water type. After the third hit, the target gains stealth rocks or a layer of spikes on their side. After the fourth hit, grassy terrain or misty terrain covers the field. After the fifth hit, the user gains a boost of 1 stage in atk or def.",
		shortDesc: "Hits 5 times, various effects after each hit.",
		id: "devolutionwave",
		name: "Devolution Wave",
		pp: 1,
		priority: 0,
		flags: {},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Psywave", target);
		},
		multihit: 5,
		onAfterHit: function (target, source, move) {
			// @ts-ignore hack for tiksi's move
			if (!move.curHits) move.curHits = 1;
			let option = this.random(2);
			this.add('-anim', source, 'Rock Throw', target);
			// @ts-ignore hack for tiksi's move
			switch (move.curHits) {
			case 1:
				if (option) {
					target.trySetStatus('tox', source);
				} else {
					target.trySetStatus('par', source);
				}
				break;
			case 2:
				if (option) {
					let bannedAbilities = ['battlebond', 'comatose', 'disguise', 'illusion', 'multitype', 'powerconstruct', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'wonderguard'];
					if (bannedAbilities.includes(target.ability) || bannedAbilities.includes(source.ability)) {
						this.add('-fail', target, 'move: Skill Swap');
						break;
					}
					let targetAbility = this.getAbility(target.ability);
					let sourceAbility = this.getAbility(source.ability);
					if (target.side === source.side) {
						this.add('-activate', source, 'move: Skill Swap', '', '', '[of] ' + target);
					} else {
						this.add('-activate', source, 'move: Skill Swap', targetAbility, sourceAbility, '[of] ' + target);
					}
					this.singleEvent('End', sourceAbility, source.abilityData, source);
					this.singleEvent('End', targetAbility, target.abilityData, target);
					if (targetAbility.id !== sourceAbility.id) {
						source.ability = targetAbility.id;
						target.ability = sourceAbility.id;
						source.abilityData = {id: toId(source.ability), target: source};
						target.abilityData = {id: toId(target.ability), target: target};
					}
					this.singleEvent('Start', targetAbility, source.abilityData, source);
					this.singleEvent('Start', sourceAbility, target.abilityData, target);
				} else {
					if (!target.setType('Water')) {
						this.add('-fail', target, 'move: Soak');
					} else {
						this.add('-start', target, 'typechange', 'Water');
					}
				}
				break;
			case 3:
				if (option) {
					target.side.addSideCondition('stealthrock');
				} else {
					target.side.addSideCondition('spikes');
				}
				break;
			case 4:
				if (option) {
					this.setTerrain('grassyterrain', source);
				} else {
					this.setTerrain('mistyterrain', source);
				}
				break;
			case 5:
				if (option) {
					this.boost({atk: 1}, source);
				} else {
					this.boost({def: 1}, source);
				}
				break;
			}
			// @ts-ignore hack for tiksi's move
			move.curHits++;
		},
		isZ: "tiksiumz",
		secondary: null,
		target: "normal",
		type: "Rock",
	},
	// torkool
	smokebomb: {
		accuracy: 100,
		category: "Status",
		desc: "Moves all hazards on the user's side of the field to the foe's side of the field. The user then switches out.",
		shortDesc: "Moves hazards to foe's side. Switches out.",
		id: "smokebomb",
		name: "Smoke Bomb",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Smokescreen", target);
			this.add('-anim', source, "Parting Shot", target);
		},
		onHit: function (target, source) {
			const sideConditions = {'spikes': 1, 'toxicspikes': 1, 'burnspikes': 1, 'stealthrock': 1, 'stickyweb': 1};
			for (let i in sideConditions) {
				let layers = source.side.sideConditions[i] ? (source.side.sideConditions[i].layers || 1) : 1;
				if (source.side.removeSideCondition(i)) {
					this.add('-sideend', source.side, this.getEffect(i).name, '[from] move: Smoke Bomb', '[of] ' + source);
					for (layers; layers > 0; layers--) target.side.addSideCondition(i, source);
				}
			}
		},
		selfSwitch: true,
		secondary: null,
		target: "normal",
		type: "Fire",
	},
	// Trickster
	minisingularity: {
		accuracy: 55,
		basePower: 0,
		basePowerCallback: function (pokemon, target) {
			let targetWeight = target.getWeight();
			if (targetWeight >= 200) {
				this.debug('120 bp');
				return 120;
			}
			if (targetWeight >= 100) {
				this.debug('100 bp');
				return 100;
			}
			if (targetWeight >= 50) {
				this.debug('80 bp');
				return 80;
			}
			if (targetWeight >= 25) {
				this.debug('60 bp');
				return 60;
			}
			if (targetWeight >= 10) {
				this.debug('40 bp');
				return 40;
			}
			this.debug('20 bp');
			return 20;
		},
		category: "Special",
		desc: "The heavier the target is, the more damage this move does. The target's item is replaced with an Iron Ball, and the target's weight is doubled.",
		shortDesc: "Heavier foe = more power. Increases foe's weigth.",
		id: "minisingularity",
		name: "Mini Singularity",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		volatileStatus: "minisingularity",
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, "Spacial Rend", target);
			this.add('-anim', source, "Flash", target);
		},
		onAfterHit: function (target, source) {
			if (source.hp) {
				let item = target.takeItem();
				if (item) {
					this.add('-enditem', target, item.name, '[from] move: Mini Singularity', '[of] ' + source);
					target.setItem('ironball');
					this.add('-message', target.name + ' obtained an Iron Ball.');
				}
			}
		},
		effect: {
			noCopy: true,
			onStart: function (pokemon) {
				this.add('-message', pokemon.name + ' weight has doubled.');
			},
			onModifyWeight: function (weight) {
				return weight * 2;
			},
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
	},
};

exports.BattleMovedex = BattleMovedex;