'use strict';

/**@type {{[k: string]: ModdedItemData}} */
let BattleItems = {
	// E4 Flint
	magmarizer: {
		inherit: true,
		megaStone: "Steelix-Mega",
		megaEvolves: "Steelix",
		onTakeItem: function (item, source) {
			if (item.megaEvolves === source.baseTemplate.baseSpecies) return false;
			return true;
		},
		fling: undefined, // Cannot be flung now since its a mega stone
		desc: "If held by a Steelix, this item allows it to Mega Evolve in battle.",
	},
	// Tiksi
	tiksiumz: {
		id: "tiksiumz",
		name: "Tiksium Z",
		spritenum: 689,
		onTakeItem: false,
		zMove: "Devolution Wave",
		zMoveFrom: "Rock Slide",
		zMoveUser: ["Cradily"],
		gen: 7,
		desc: "If held by a Cradily with Rock Slide, it can use Devolution Wave.",
	},
};

exports.BattleItems = BattleItems;