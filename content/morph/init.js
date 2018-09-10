const editorValueRand = (stringify) => {

	/* This function will be called to randomly generate a new 'Draw' function. */

	const randConfig = {

		varLookBehind: 10,

		instructionsNumRange: {
			min: 10,
			max: 40
		},

		startInstructions: ['constant'],	/* there must be at least one instruction type in the array */

		instructionChances: {
			getData: 20,
			putData: 20,
			reference: 120,
			constant: 10,
			copy: 10,
			random: 5,
			step: 25,
			conditional: 50,
			getPositionRectangular: 30,
			getPositionPolarRadius: 20,
			getPositionPolarAngle: 0,
			getColorAbsoluteRectangular: 20,
			getColorAbsolutePolar: 0,
			getColorRelativeRectangular: 50,
			getColorRelativePolar: 50,
			mod: 30,
			add: 30,
			mul: 10,
			hyp: 10,
			cos: 10,
			atan: 10,
			atHyp: 10,
			atAtan: 10
		},

		instructionsDef: {
			getData: (_, $) => {
				if (! $.data.hasOwnProperty('permanentMemory')) {
					$.data.permanentMemory = new Float32Array(_.config('permanentMemory.num')).fill(0);
				}
				_.output[0] = $.data.permanentMemory[Math.floor(((_.input[0] + 1) / 2) * $.data.permanentMemory.length)];
			},
			putData: (_, $) => {
				if (! $.data.hasOwnProperty('permanentMemory')) {
					$.data.permanentMemory = new Float32Array(_.config('permanentMemory.num')).fill(0);
				}
				if ((_.input[0] + 1) / 2 > _.config('permanentMemory.changeThreshold')) {
					$.data.permanentMemory[Math.floor(((_.input[1] + 1) / 2) * $.data.permanentMemory.length)] = _.input[2];
				}
			},
			reference: (_, $) => {
				_.temp[0] = _.varBase;
				_.temp[1] = _.temp[0] - _.config('reference.lookBehind');
				_.temp[2] = _.temp[1] < 0 ? 0 : _.temp[1];
				_.temp[3] = Math.floor(((_.input[0] + 1) / 2) * (_.temp[0] - _.temp[2])) + _.temp[2];
				_.output[0] = $.v[_.temp[3]];
			},
			constant: (_, $) => {
				_.output[0] = _.eval('#Math.random() * 2 - 1#');
			},
			copy: (_, $) => {
				_.output[0] = _.input[0];
			},
			random: (_, $) => {
				_.output[0] = Math.random() * 2 - 1;
			},
			step: (_, $) => {
				if (! $.data.hasOwnProperty('steps')) {
					$.data.steps = new Array(_.config('step.num')).fill(null);
				}
				_.temp[0] = Math.floor(((_.input[0] + 1) / 2) * _.config('step.num'));
				if ($.data.steps[_.temp[0]] === null || _.input[0] > _.config('step.changeThreshold') * 2 - 1) {
					_.temp[1] = Math.max(Math.floor(((_.input[1] + 1) / 2) * _.config('step.multiplier')), 1);
					data.steps[_.temp[0]] = {
						length: _.temp[1],
						phase: Math.floor(((_.input[2] + 1) / 2) * _.temp[1])
					};
				}
				_.temp[2] = data.steps[_.temp[0]];
				_.output[0] = (((($.stepCount + _.temp[2].phase) % _.temp[2].length) / _.temp[2].length)) * 2 - 1;
			},
			conditional: (_, $) => {
				_.output[0] = _.input[0] > _.input[1] ? _.input[2] : _.input[3];
			},
			getPositionRectangular: (_, $) => {
				_.output[0] = (($.r_x / $.size.x) * 2 - 1) * ($.size.x / $.sizeMax);
				_.output[1] = (($.r_y / $.size.y) * 2 - 1) * ($.size.y / $.sizeMax);
			},
			getPositionPolarRadius: (_, $) => {
				_.temp[0] = (($.r_x / $.size.x) * 2 - 1) * ($.size.x / $.sizeMax);
				_.temp[1] = (($.r_y / $.size.y) * 2 - 1) * ($.size.y / $.sizeMax);
				_.output[0] = ((Math.hypot(_.temp[0], _.temp[1]) / Math.SQRT2) * 2 - 1) * 0.99999999;
			},
			getPositionPolarAngle: (_, $) => {
				_.temp[0] = (($.r_x / $.size.x) * 2 - 1) * ($.size.x / $.sizeMax);
				_.temp[1] = (($.r_y / $.size.y) * 2 - 1) * ($.size.y / $.sizeMax);
				_.temp[2] = Math.atan2(_.temp[0], _.temp[1]) / Math.PI;
				_.output[0] = _.temp[2] === 1 ? 0 : _.temp[2];
			},
			getColorAbsoluteRectangular: (_, $) => {
				_.temp[0] = ($.size.x / 2 + 0.5 + _.input[0] * $.size.x / 2) | 0;
				_.temp[1] = ($.size.y / 2 + 0.5 + _.input[1] * $.size.y / 2) | 0;
				_.temp[2] = ((_.temp[0] % $.size.x) + $.size.x) % $.size.x;
				_.temp[3] = ((_.temp[1] % $.size.y) + $.size.y) % $.size.y;
				_.temp[4] = 4 * (_.temp[3] * $.size.x + _.temp[2]);
				_.output[0] = $.d_o[_.temp[4]] / 128 - 1;
				_.output[1] = $.d_o[_.temp[4] + 1] / 128 - 1;
				_.output[2] = $.d_o[_.temp[4] + 2] / 128 - 1;
				_.output[3] = $.d_o[_.temp[4] + 3] / 128 - 1;
			},
			getColorAbsolutePolar: (_, $) => {
				_.temp[0] = _.input[0] * $.sizeMax / 2;
				_.temp[1] = _.input[1] * Math.PI;
				_.temp[2] = ($.size.x / 2 + 0.5 + _.temp[0] * Math.cos(_.temp[1])) | 0;
				_.temp[3] = ($.size.y / 2 + 0.5 + _.temp[0] * Math.sin(_.temp[1])) | 0;
				_.temp[4] = ((_.temp[2] % $.size.x) + $.size.x) % $.size.x;
				_.temp[5] = ((_.temp[3] % $.size.y) + $.size.y) % $.size.y;
				_.temp[6] = 4 * (_.temp[5] * $.size.x + _.temp[4]);
				_.output[0] = $.d_o[_.temp[6]] / 128 - 1;
				_.output[1] = $.d_o[_.temp[6] + 1] / 128 - 1;
				_.output[2] = $.d_o[_.temp[6] + 2] / 128 - 1;
				_.output[3] = $.d_o[_.temp[6] + 3] / 128 - 1;
			},
			getColorRelativeRectangular: (_, $) => {
				_.temp[0] = ($.r_x + 0.5 + _.input[0] * _.config('positionMultiplier')) | 0;
				_.temp[1] = ($.r_y + 0.5 + _.input[1] * _.config('positionMultiplier')) | 0;
				_.temp[2] = ((_.temp[0] % $.size.x) + $.size.x) % $.size.x;
				_.temp[3] = ((_.temp[1] % $.size.y) + $.size.y) % $.size.y;
				_.temp[4] = 4 * (_.temp[3] * $.size.x + _.temp[2]);
				_.output[0] = $.d_o[_.temp[4]] / 128 - 1;
				_.output[1] = $.d_o[_.temp[4] + 1] / 128 - 1;
				_.output[2] = $.d_o[_.temp[4] + 2] / 128 - 1;
				_.output[3] = $.d_o[_.temp[4] + 3] / 128 - 1;
			},
			getColorRelativePolar: (_, $) => {
				_.temp[0] = _.input[0] * _.config('positionMultiplier');
				_.temp[1] = _.input[1] * Math.PI;
				_.temp[2] = ($.r_x + 0.5 + _.temp[0] * Math.cos(_.temp[1])) | 0;
				_.temp[3] = ($.r_y + 0.5 + _.temp[0] * Math.sin(_.temp[1])) | 0;
				_.temp[4] = ((_.temp[2] % $.size.x) + $.size.x) % $.size.x;
				_.temp[5] = ((_.temp[3] % $.size.y) + $.size.y) % $.size.y;
				_.temp[6] = 4 * (_.temp[5] * $.size.x + _.temp[4]);
				_.output[0] = $.d_o[_.temp[6]] / 128 - 1;
				_.output[1] = $.d_o[_.temp[6] + 1] / 128 - 1;
				_.output[2] = $.d_o[_.temp[6] + 2] / 128 - 1;
				_.output[3] = $.d_o[_.temp[6] + 3] / 128 - 1;
			},
			mod: (_, $) => {
				_.temp[0] = (_.input[0] + 1) / 2;
				_.temp[1] = (_.input[1] + 1) / 2;
				_.output[0] = _.temp[1] === 0 ? _.temp[0] : (_.temp[0] % _.temp[1]) * 2 - 1;
			},
			add: (_, $) => {
				_.output[0] = (_.input[0] + _.input[1]) / 2;
			},
			mul: (_, $) => {
				_.output[0] = _.input[0] * _.input[1];
			},
			hyp: (_, $) => {
				_.output[0] = ((Math.hypot(_.input[0],  _.input[1]) / Math.SQRT2) * 2 - 1) * 0.99999999;
			},
			cos: (_, $) => {
				_.output[0] = Math.cos(_.input[0] * Math.PI) * 0.99999999;
			},
			atan: (_, $) => {
				_.temp[0] = Math.atan2(_.input[0],  _.input[1]) / Math.PI;
				_.output[0] = _.temp[0] === 1 ? 0 : _.temp[0];
			},
			atHyp: (_, $) => {
				_.temp[0] = (($.r_x / $.size.x) * 2 - 1) * ($.size.x / $.sizeMax);
				_.temp[1] = (($.r_y / $.size.y) * 2 - 1) * ($.size.y / $.sizeMax);
				_.temp[2] = (_.input[0] - _.temp[0]) / 2;
				_.temp[3] = (_.input[1] - _.temp[1]) / 2;
				_.output[0] = ((Math.hypot(_.temp[2], _.temp[3]) / Math.SQRT2) * 2 - 1) * 0.99999999;
			},
			atAtan: (_, $) => {
				_.temp[0] = (($.r_x / $.size.x) * 2 - 1) * ($.size.x / $.sizeMax);
				_.temp[1] = (($.r_y / $.size.y) * 2 - 1) * ($.size.y / $.sizeMax);
				_.temp[2] = (_.input[0] - _.temp[0]) / 2;
				_.temp[3] = (_.input[1] - _.temp[1]) / 2;
				_.temp[4] = Math.atan2(_.temp[2], _.temp[3]) / Math.PI;
				_.output[0] = _.temp[4] === 1 ? 0 : _.temp[4];
			}
		},

		instructionConfig: {
			permanentMemory: {
				num: 4,
				changeThreshold: 0.8
			},
			reference: {
				lookBehind: 10
			},
			step: {
				num: 4,
				multiplier: 1000,
				changeThreshold: 0.8
			},
			positionMultiplier: 2
		},

		outColorWeights: [0.5, 0.5, 0.5, 0]

	};

	const getByChance = (chances) => {
		const chancesKeys = Object.keys(chances);
		const valueSum = chancesKeys.reduce((sum, key) => sum + chances[key], 0);
		const arr = chancesKeys.map((key) => ({key, value: chances[key] / valueSum}));
		const rand = Math.random();
		let i = 0, at = 0;
		while (true) {
			let arrItem = arr[i];
			at += arrItem.value;
			if (at > rand) {
				return arrItem.key;
			}
			i ++;
		}
	};

	const compiler = (() => {
		const getByPath = (obj, path) => {
			for (let i = 0; i < path.length; obj = obj[path[i]], i ++);
			return obj;
		};
		const getUniqueMatches = (str, re) => {
		  let matches = [], match;
		  while (match = re.exec(str)) {
		    matches.push(match[1]);
		  }
		  return matches.filter((item, index) => matches.indexOf(item) === index);
		};
		const getFuncBodyStr = (func) => {
			const funcStr = func.toString();
			return funcStr.substring(funcStr.indexOf('{') + 1, funcStr.lastIndexOf('}'));
		};
		const inputMatches = (func) =>
			getUniqueMatches(getFuncBodyStr(func), (/_\.input\[([0-9]+)\]/g)).map(Number).sort((a, b) => a > b);
		const outputMatches = (func) =>
			getUniqueMatches(getFuncBodyStr(func), (/_\.output\[([0-9]+)\]/g)).map(Number).sort((a, b) => a > b);
		const tempMatches = (func) =>
			getUniqueMatches(getFuncBodyStr(func), (/_\.temp\[([0-9]+)\]/g)).map(Number).sort((a, b) => a > b);
		const compile = (func, inputArr, varBase, tempBase, config) => {
			const funcBodyStr = getFuncBodyStr(func);
			const replace0 = funcBodyStr.replace(/\$\./g, '');
			const replace1 = inputMatches(func).reduce((soFar, curr) => {
				return soFar.replace(new RegExp(`_\\.input\\[${curr}\\]`, 'g'), `v[${inputArr[curr]}]`);
			}, replace0);
			const replace2 = tempMatches(func).reduce((soFar, curr) => {
				return soFar.replace(new RegExp(`_\\.temp\\[${curr}\\]`, 'g'), `t${tempBase + curr}`);
			}, replace1);
			const replace3 = outputMatches(func).reduce((soFar, curr) => {
				return soFar.replace(new RegExp(`_\\.output\\[${curr}\\]`, 'g'), `v[${varBase + curr}]`);
			}, replace2);
			const replace4 = replace3.replace(/_.config\('(.*?)'\)/g,
				(match, p1) => getByPath(config, p1.split('.')).toString());
			const replace5 = replace4.replace(/_.eval\('#(.*?)#'\)/g,
				(match, p1) => eval(p1));
			const replace6 = replace5.replace(/_\.varBase/g, varBase.toString());
			const compiledStr = replace6;
			return compiledStr;
		};
		return {inputMatches, outputMatches, tempMatches, compile};
	})();

	const instructionsNum =
		Math.floor(Math.random() * (randConfig.instructionsNumRange.max - randConfig.instructionsNumRange.min)) +
		randConfig.instructionsNumRange.min;
	const instructionTypes = []
		.concat(randConfig.startInstructions)
		.concat(new Array(instructionsNum - 1)
			.fill(true)
			.map((item) => getByChance(randConfig.instructionChances)));
	const instructionsCtx = instructionTypes.reduce((instructionsCtx, instructionType) => {
		const func = randConfig.instructionsDef[instructionType];
		const inputCount = compiler.inputMatches(func).length;
		const outputCount = compiler.outputMatches(func).length;
		const tempCount = compiler.tempMatches(func).length;
		const inputArr = new Array(inputCount)
			.fill(true)
			.map(() => ((min, max) => Math.floor(Math.random() * (max - min)) + min)
				(Math.max(instructionsCtx.varCount - randConfig.varLookBehind, 0), instructionsCtx.varCount));
		const outputArr = new Array(outputCount)
			.fill(true)
			.map((item, index) => instructionsCtx.varCount + index);
		const instructionStr = compiler.compile(func, inputArr, instructionsCtx.varCount, instructionsCtx.tempCount, randConfig.instructionConfig);
		instructionsCtx.varCount += outputCount, instructionsCtx.tempCount += tempCount;
		instructionsCtx.instructionsStrs.push(instructionStr);
		return instructionsCtx;
	}, {varCount: 0, tempCount: 0, instructionsStrs: []});

	const vDefStr = `globals.v = new Float64Array(${instructionsCtx.varCount});`;
	const tDefStr = instructionsCtx.tempCount === 0 ?
		'' :
		`let ${new Array(instructionsCtx.tempCount).fill(true).map((item, index) => `t${index.toString()}`).join(', ')};`;
	const writeStr = new Array(4).fill(true).map((item, index) =>
		`d_n[di] = (d_o[di] * ${1 - randConfig.outColorWeights[index].toString()} + ` +
		`(v[${instructionsCtx.varCount - 4 + index}] + 1) * 128 * ${randConfig.outColorWeights[index].toString()}) | 0; di ++;`
		).join('\n');

	return stringify((stepCount, globals, canv) => {

		/* This function will be called on each iteration ('step') of the drawing loop */

		if (stepCount === 0) {
			globals.d_n = canv.buildEmptyData();
			globals.size = canv.getSize();
			globals.sizeMax = Math.max(globals.size.x, globals.size.y);
			globals.data = {};
			/*-- vDefStr --*/
		}

		/*-- tDefStr --*/

		const d_o = canv.getData();

		const {data, size, sizeMax, d_n, v} = globals;

		let di = 0;

		for (let r_y = 0; r_y < size.y; r_y ++) { for (let r_x = 0; r_x < size.x; r_x ++) {

			v.fill(0);

			/* Start of instructions */

			/*-- instructionsStr --*/

			/* End of instructions */

			/*-- writeStr --*/

		} }

		canv.putData(d_n);

	})
		.replace(/\/\*-- vDefStr --\*\//, vDefStr)
		.replace(/\/\*-- tDefStr --\*\//, tDefStr)
		.replace(/\t\t\t\/\*-- instructionsStr --\*\//,
			instructionsCtx.instructionsStrs
				.map((item) => item.split('\n').filter((item) => item.trim() !== '').join('\n')).join('\n\n')
				.split('\n').map((item) => item.substr(1)).join('\n'))
		.replace(/\t\t\t\/\*-- writeStr --\*\//, writeStr.split('\n').map((item) => `\t\t\t${item}`).join('\n'));

};

const editorValueConf = (() => {

	/* This function should return an object of app configuration options -
		{
			clearingFill: <color used to fill the canvas on a 'Clear'>,
			editorsMaxHistoryLength: <maximum length that the editors ('Draw', 'Rand', and 'Conf' keep their history for)>
			autoRandInterval: { <when 'Auto' is on, this min-max range will be repeatedly used to randomly pick numbers of steps
					after which to randomize the drawing loop>
				min: <minimum of auto-randomization range>,
				max: <maximum of auto-randomization range>
			}
		}
	*/

	return {
		clearingFill: {
			r: 255,
			g: 255,
			b: 255,
			a: 255
		},
		editorsMaxHistoryLength: Infinity,
		autoRandInterval: {
			min: 4,
			max: 40
		}
	};

});

const init = ({stringify, editors, canv, canvasFill, randGenerate}) => {

	editors['rand'].set(stringify(editorValueRand));
	editors['conf'].set(stringify(editorValueConf));

	canvasFill();

	randGenerate();

};

window.App.init = init;