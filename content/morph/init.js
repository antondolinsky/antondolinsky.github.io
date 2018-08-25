const editorValueConf = {

};

const editorValueRand = (stringify) => {

	const randConfig = {

		varLookBehind: 10,

		instructionsNumRange: {
			min: 10,
			max: 40
		},

		instructionChances: {
			getData: 20,
			putData: 20,
			reference: 120,
			const: 10,
			copy: 10,
			rand: 0,
			step: 25,
			if: 50,
			getAtPosR: 30,
			getAtPosPRadius: 20,
			getAtPosPAngle: 0,
			getAbsR: 20,
			getAbsP: 0,
			getRelR: 50,
			getRelP: 50,
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
					$.data.permanentMemory = new Float32Array($.config.instructions.permanentMemory.num).fill(0);
				}
				_.output[0] = $.data.permanentMemory[Math.floor(((_.input[0] + 1) / 2) * $.data.permanentMemory.length)];
			},
			putData: (_, $) => {
				if (! $.data.hasOwnProperty('permanentMemory')) {
					$.data.permanentMemory = new Float32Array($.config.instructions.permanentMemory.num).fill(0);
				}
				if ((_.input[0] + 1) / 2 > $.config.instructions.permanentMemory.changeThreshold) {
					$.data.permanentMemory[Math.floor(((_.input[1] + 1) / 2) * $.data.permanentMemory.length)] = _.input[2];
				}
			},
			reference: (_, $) => {
				_.temp[0] = _.varBase;
				_.temp[1] = _.temp[0] - $.config.instructions.reference.lookBehind;
				_.temp[2] = _.temp[1] < 0 ? 0 : _.temp[1];
				_.temp[3] = Math.floor(((_.input[0] + 1) / 2) * (_.temp[0] - _.temp[2])) + _.temp[2];
				_.output[0] = $.v[_.temp[3]];
			},
			const: (_, $) => {
				_.output[0] = Math.random() * 2 - 1;
			},
			copy: (_, $) => {
				_.output[0] = _.input[0];
			},
			rand: (_, $) => {
				_.output[0] = Math.random() * 2 - 1;
			},
			step: (_, $) => {
				if (! $.data.hasOwnProperty('steps')) {
					$.data.steps = new Array($.config.instructions.step.num).fill(null);
				}
				_.temp[0] = Math.floor(((_.input[0] + 1) / 2) * $.config.instructions.step.num);
				if ($.data.steps[_.temp[0]] === null || _.input[0] > $.config.instructions.step.changeThreshold * 2 - 1) {
					_.temp[1] = Math.max(Math.floor(((_.input[1] + 1) / 2) * $.config.instructions.step.multiplier), 1);
					data.steps[_.temp[0]] = {
						length: _.temp[1],
						phase: Math.floor(((_.input[2] + 1) / 2) * _.temp[1])
					};
				}
				_.temp[2] = data.steps[_.temp[0]];
				_.output[0] = (((($.stepCount + _.temp[2].phase) % _.temp[2].length) / _.temp[2].length)) * 2 - 1;
			},
			if: (_, $) => {
				_.output[0] = _.input[0] > _.input[1] ? _.input[2] : _.input[3];
			},
			getAtPosR: (_, $) => {
				_.output[0] = (($.r_x / $.size.x) * 2 - 1) * ($.size.x / $.sizeMax);
				_.output[1] = (($.r_y / $.size.y) * 2 - 1) * ($.size.y / $.sizeMax);
			},
			getAtPosPRadius: (_, $) => {
				_.temp[0] = (($.r_x / $.size.x) * 2 - 1) * ($.size.x / $.sizeMax);
				_.temp[1] = (($.r_y / $.size.y) * 2 - 1) * ($.size.y / $.sizeMax);
				_.output[0] = ((Math.hypot(_.temp[0], _.temp[1]) / Math.SQRT2) * 2 - 1) * 0.99999999;
			},
			getAtPosPAngle: (_, $) => {
				_.temp[0] = (($.r_x / $.size.x) * 2 - 1) * ($.size.x / $.sizeMax);
				_.temp[1] = (($.r_y / $.size.y) * 2 - 1) * ($.size.y / $.sizeMax);
				_.temp[2] = Math.atan2(_.temp[0], _.temp[1]) / Math.PI;
				_.output[0] = _.temp[2] === 1 ? 0 : _.temp[2];
			},
			getAbsR: (_, $) => {
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
			getAbsP: (_, $) => {
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
			getRelR: (_, $) => {
				_.temp[0] = ($.r_x + 0.5 + _.input[0] * $.config.instructions.positionMultiplier) | 0;
				_.temp[1] = ($.r_y + 0.5 + _.input[1] * $.config.instructions.positionMultiplier) | 0;
				_.temp[2] = ((_.temp[0] % $.size.x) + $.size.x) % $.size.x;
				_.temp[3] = ((_.temp[1] % $.size.y) + $.size.y) % $.size.y;
				_.temp[4] = 4 * (_.temp[3] * $.size.x + _.temp[2]);
				_.output[0] = $.d_o[_.temp[4]] / 128 - 1;
				_.output[1] = $.d_o[_.temp[4] + 1] / 128 - 1;
				_.output[2] = $.d_o[_.temp[4] + 2] / 128 - 1;
				_.output[3] = $.d_o[_.temp[4] + 3] / 128 - 1;
			},
			getRelP: (_, $) => {
				_.temp[0] = _.input[0] * $.config.instructions.positionMultiplier;
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

		drawConfig: {
			instructions: {
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
			outColorWeights: {
				r: 0.5,
				g: 0.5,
				b: 0.5,
				a: 0
			}
		}

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
		const compile = (func, inputArr, varBase, tempBase) => {
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
			const replace4 = replace3.replace(/_\.varBase/g, varBase.toString());
			const compiledStr = replace4;
			return compiledStr;
		};
		return {inputMatches, outputMatches, tempMatches, compile};
	})();

	const instructionsNum =
		Math.floor(Math.random() * (randConfig.instructionsNumRange.max - randConfig.instructionsNumRange.min)) +
		randConfig.instructionsNumRange.min;
	const instructionTypes = []
		.concat(['const'])
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
		const instructionStr = compiler.compile(func, inputArr, instructionsCtx.varCount, instructionsCtx.tempCount);
		instructionsCtx.varCount += outputCount, instructionsCtx.tempCount += tempCount;
		instructionsCtx.instructionsStrs.push(instructionStr);
		return instructionsCtx;
	}, {varCount: 0, tempCount: 0, instructionsStrs: []});

	const drawConfigStr = `globals.config = ${stringify(randConfig.drawConfig)};`;
	const vDefStr = `globals.v = new Float64Array(${instructionsCtx.varCount});`;
	const tDefStr = instructionsCtx.tempCount === 0 ?
		'' :
		`let ${new Array(instructionsCtx.tempCount).fill(true).map((item, index) => `t${index.toString()}`).join(', ')};`;
	const instructionsStr = instructionsCtx.instructionsStrs
		.map((str) => str.trim())
		.map((str) => '\t\t\t' + str.split('\n').join('\n\t\t\t'))
		.join('\n\n');
	const writeStr = new Array(4).fill(true).map((item, index) =>
		`d_n[di] = (d_o[di] * w_a_${index} + (v[${instructionsCtx.varCount - 4 + index}] + 1) * 128 * w_o_${index}) | 0; di ++;`
		).join('\n');

	return stringify((stepCount, globals, canv) => {

		if (stepCount === 0) {
			globals.data = {};
			/*-- drawConfigStr --*/
			globals.size = canv.getSize();
			globals.sizeMax = Math.max(globals.size.x, globals.size.y);
			globals.d_o = canv.getData();
			globals.d_n = canv.buildEmptyData();
			const outColorWeights = globals.config.outColorWeights;
			const w_o = new Float32Array([outColorWeights.r, outColorWeights.g, outColorWeights.b, outColorWeights.a]);
			globals.w_o = w_o;
			globals.w_a = new Float32Array([1 - w_o[0], 1 - w_o[1], 1 - w_o[2], 1 - w_o[3]]);
			/*-- vDefStr --*/
		}

		/*-- tDefStr --*/

		const {data, config, size, sizeMax, d_o, d_n, w_o, w_a, v} = globals;

		let di = 0;
		let w_a_0 = w_a[0], w_a_1 = w_a[1], w_a_2 = w_a[2], w_a_3 = w_a[3];
		let w_o_0 = w_o[0], w_o_1 = w_o[1], w_o_2 = w_o[2], w_o_3 = w_o[3];

		for (let r_y = 0; r_y < size.y; r_y ++) { for (let r_x = 0; r_x < size.x; r_x ++) {

			v.fill(0);

			/* Start of instructions */

			/*-- instructionsStr --*/

			/* End of instructions */

			/*-- writeStr --*/

		} }

		canv.putData(d_n);

	}, {
		drawConfigStr,
		vDefStr,
		tDefStr,
		instructionsStr,
		writeStr
	});

};

const init = ({stringify, editors, canv, randGenerate}) => {

	canv.setSize({x: 400, y: 400});
	canv.fill([255, 255, 255, 255]);

	editors['rand'].save(stringify(editorValueRand));
	editors['conf'].save(stringify(editorValueConf));

	randGenerate();

};

window.App.init = init;