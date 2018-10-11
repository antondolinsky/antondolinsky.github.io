window.App.config = {

	initialCanvasSize: {
		x: 400,
		y: 400
	},

	initialFillColorValue: {
		r: 255,
		g: 255,
		b: 255,
		a: 255
	},

	initialEditorValues: {

		'inpt': '[0, 0]',

		'draw': null,

		'genr': (() => {

			/* This function will be called to randomly generate a new 'Draw' function. */

			const config = {

				dataSize: 8,

				instructionNumRange: {
					min: 8,
					max: 32
				},

				instructionChances: {
					standardInitiator: 0,
					graphOut: 0,
					graphOutBlended: 0,
					getInpt: 40,
					getFirstTwoInptItemsRelativeToPosition: 40,
					getPositionRectangular: 2,
					getPositionPolar: 2,
					getDataAbsoluteRectangular: 2,
					getDataAbsolutePolar: 2,
					getDataRelativeRectangular: 10,
					getDataRelativePolar: 10,
					getCanvasDataAbsoluteRectangular: 2,
					getCanvasDataAbsolutePolar: 2,
					getCanvasDataRelativeRectangular: 10,
					getCanvasDataRelativePolar: 10,
					constant: 80,
					random: 0,
					reference: 20,
					conditional: 20,
					mod: 40,
					add: 80,
					addMod: 80,
					mul: 80,
					hyp: 80,
					cos: 80,
					atan: 80,
					atHyp: 80,
					atAtan: 80
				},

				compileEvalContext: {
					positionMultiplier: 2
				},

				graphGenerator: (compiler, config) => {
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
					const instructionsNum =
						((Math.random() * (config.instructionNumRange.max - config.instructionNumRange.min)) | 0) +
							config.instructionNumRange.min;
					const graph = new Array(instructionsNum).fill(true).map((item, index) => {
						const instructionType = getByChance(config.instructionChances);
						const func = config.instructionDefs[instructionType];
						const counts = compiler.count(func);
						return {
							func,
							inputArr: new Array(counts.input).fill(true).map(() => (Math.random() * config.dataSize) | 0),
							outputArr: new Array(counts.output).fill(true).map(() => (Math.random() * config.dataSize) | 0)
						};
					});
					graph[0] = {
						func: config.instructionDefs['standardInitiator'],
						inputArr: [],
						outputArr: [0, 1, 2, 3, 4, 5, 6, 7]
					};
					graph[graph.length - 1] = {
						func: config.instructionDefs['graphOutBlended'],
						inputArr: [0, 1, 2, 3, 4],
						outputArr: []
					};
					return graph;
				},

				instructionDefs: {
					standardInitiator: (_, $) => {
						_.temp[0] =  ($.r_x + $.r_y * $.size_x) * 4;
						_.output[0] = (($.r_x / $.size_x) * 2 - 1) * ($.size_x / $.sizeMax);
						_.output[1] = (($.r_y / $.size_y) * 2 - 1) * ($.size_y / $.sizeMax);
						_.output[2] = $.canvasData[_.temp[0]] / 128 - 1;
						_.output[3] = $.canvasData[_.temp[0] + 1] / 128 - 1;
						_.output[4] = $.canvasData[_.temp[0] + 2] / 128 - 1;
						_.output[5] = $.canvasData[_.temp[0] + 3] / 128 - 1;
						_.output[6] = _.output[0] - $.inpt[0];
						_.output[7] = _.output[1] - $.inpt[1];
						for (let i = 8; i < $.dataSize; i ++) {
							v[i] = v[i % $.dataSize];
						}
					},
					graphOut: (_, $) => {
						_.graphOut[0] = _.input[0];
						_.graphOut[1] = _.input[1];
						_.graphOut[2] = _.input[2];
						_.graphOut[3] = _.input[3];
					},
					graphOutBlended: (_, $) => {
						_.temp[0] =  ($.r_x + $.r_y * $.size_x) * 4;
						_.temp[1] = $.canvasData[_.temp[0]] / 128 - 1;
						_.temp[2] = $.canvasData[_.temp[0] + 1] / 128 - 1;
						_.temp[3] = $.canvasData[_.temp[0] + 2] / 128 - 1;
						_.temp[4] = $.canvasData[_.temp[0] + 3] / 128 - 1;
						_.temp[5] = (_.input[4] + 1) / 2;
						_.temp[6] = 1 - _.temp[5];
						_.graphOut[0] = _.input[0] * _.temp[5] + _.temp[1] * _.temp[6];
						_.graphOut[1] = _.input[1] * _.temp[5] + _.temp[2] * _.temp[6];
						_.graphOut[2] = _.input[2] * _.temp[5] + _.temp[3] * _.temp[6];
						_.graphOut[3] = _.input[3] * _.temp[5] + _.temp[4] * _.temp[6];
					},
					getInpt: (_, $) => {
						_.output[0] = $.inpt[(((_.input[0] + 1) / 2) * $.inptLength) | 0];
					},
					getFirstTwoInptItemsRelativeToPosition: (_, $) => {
						_.temp[0] = (($.r_x / $.size_x) * 2 - 1) * ($.size_x / $.sizeMax);
						_.temp[1] = (($.r_y / $.size_y) * 2 - 1) * ($.size_y / $.sizeMax);
						_.output[0] = _.temp[0] - $.inpt[0];
						_.output[1] = _.temp[1] - $.inpt[1];
					},
					getPositionRectangular: (_, $) => {
						_.output[0] = (($.r_x / $.size_x) * 2 - 1) * ($.size_x / $.sizeMax);
						_.output[1] = (($.r_y / $.size_y) * 2 - 1) * ($.size_y / $.sizeMax);
					},
					getPositionPolar: (_, $) => {
						_.temp[0] = (($.r_x / $.size_x) * 2 - 1) * ($.size_x / $.sizeMax);
						_.temp[1] = (($.r_y / $.size_y) * 2 - 1) * ($.size_y / $.sizeMax);
						_.temp[2] = Math.atan2(_.temp[0], _.temp[1]) / Math.PI;
						_.output[0] = ((Math.hypot(_.temp[0], _.temp[1]) / Math.SQRT2) * 2 - 1) * 0.99999999;
						_.output[1] = _.temp[2] === 1 ? 0 : _.temp[2];
					},
					getDataAbsoluteRectangular: (_, $) => {
						_.temp[0] = ($.size_x / 2 + 0.5 + _.input[0] * $.size_x / 2) | 0;
						_.temp[1] = ($.size_y / 2 + 0.5 + _.input[1] * $.size_y / 2) | 0;
						_.temp[2] = ((_.temp[0] % $.size_x) + $.size_x) % $.size_x;
						_.temp[3] = ((_.temp[1] % $.size_y) + $.size_y) % $.size_y;
						_.temp[4] = (((_.input[2] + 1) / 2) * $.dataSize) | 0;
						_.output[0] = $.data[(_.temp[2] + _.temp[3] * $.size_x) * $.dataSize + _.temp[4]];
					},
					getDataAbsolutePolar: (_, $) => {
						_.temp[0] = _.input[0] * $.sizeMax / 2;
						_.temp[1] = _.input[1] * Math.PI;
						_.temp[2] = ($.size_x / 2 + 0.5 + _.temp[0] * Math.cos(_.temp[1])) | 0;
						_.temp[3] = ($.size_y / 2 + 0.5 + _.temp[0] * Math.sin(_.temp[1])) | 0;
						_.temp[4] = ((_.temp[2] % $.size_x) + $.size_x) % $.size_x;
						_.temp[5] = ((_.temp[3] % $.size_y) + $.size_y) % $.size_y;
						_.temp[6] = (((_.input[2] + 1) / 2) * $.dataSize) | 0;
						_.output[0] = $.data[(_.temp[4] + _.temp[5] * $.size_x) * $.dataSize + _.temp[6]];
					},
					getDataRelativeRectangular: (_, $) => {
						_.temp[0] = ($.r_x + 0.5 + _.input[0] * _.eval('#return ctx.positionMultiplier#')) | 0;
						_.temp[1] = ($.r_y + 0.5 + _.input[1] * _.eval('#return ctx.positionMultiplier#')) | 0;
						_.temp[2] = ((_.temp[0] % $.size_x) + $.size_x) % $.size_x;
						_.temp[3] = ((_.temp[1] % $.size_y) + $.size_y) % $.size_y;
						_.temp[4] = (((_.input[2] + 1) / 2) * $.dataSize) | 0;
						_.output[0] = $.data[(_.temp[2] + _.temp[3] * $.size_x) * $.dataSize + _.temp[4]];
					},
					getDataRelativePolar: (_, $) => {
						_.temp[0] = _.input[0] * _.eval('#return ctx.positionMultiplier#');
						_.temp[1] = _.input[1] * Math.PI;
						_.temp[2] = ($.r_x + 0.5 + _.temp[0] * Math.cos(_.temp[1])) | 0;
						_.temp[3] = ($.r_y + 0.5 + _.temp[0] * Math.sin(_.temp[1])) | 0;
						_.temp[4] = ((_.temp[2] % $.size_x) + $.size_x) % $.size_x;
						_.temp[5] = ((_.temp[3] % $.size_y) + $.size_y) % $.size_y;
						_.temp[6] = (((_.input[2] + 1) / 2) * $.dataSize) | 0;
						_.output[0] = $.data[(_.temp[4] + _.temp[5] * $.size_x) * $.dataSize + _.temp[6]];
					},
					getCanvasDataAbsoluteRectangular: (_, $) => {
						_.temp[0] = ($.size_x / 2 + 0.5 + _.input[0] * $.size_x / 2) | 0;
						_.temp[1] = ($.size_y / 2 + 0.5 + _.input[1] * $.size_y / 2) | 0;
						_.temp[2] = ((_.temp[0] % $.size_x) + $.size_x) % $.size_x;
						_.temp[3] = ((_.temp[1] % $.size_y) + $.size_y) % $.size_y;
						_.temp[4] = (_.temp[3] * $.size_x + _.temp[2]) * 4;
						_.output[0] = $.canvasData[_.temp[4]] / 128 - 1;
						_.output[1] = $.canvasData[_.temp[4] + 1] / 128 - 1;
						_.output[2] = $.canvasData[_.temp[4] + 2] / 128 - 1;
						_.output[3] = $.canvasData[_.temp[4] + 3] / 128 - 1;
					},
					getCanvasDataAbsolutePolar: (_, $) => {
						_.temp[0] = _.input[0] * $.sizeMax / 2;
						_.temp[1] = _.input[1] * Math.PI;
						_.temp[2] = ($.size_x / 2 + 0.5 + _.temp[0] * Math.cos(_.temp[1])) | 0;
						_.temp[3] = ($.size_y / 2 + 0.5 + _.temp[0] * Math.sin(_.temp[1])) | 0;
						_.temp[4] = ((_.temp[2] % $.size_x) + $.size_x) % $.size_x;
						_.temp[5] = ((_.temp[3] % $.size_y) + $.size_y) % $.size_y;
						_.temp[6] = (_.temp[5] * $.size_x + _.temp[4]) * 4;
						_.output[0] = $.canvasData[_.temp[6]] / 128 - 1;
						_.output[1] = $.canvasData[_.temp[6] + 1] / 128 - 1;
						_.output[2] = $.canvasData[_.temp[6] + 2] / 128 - 1;
						_.output[3] = $.canvasData[_.temp[6] + 3] / 128 - 1;
					},
					getCanvasDataRelativeRectangular: (_, $) => {
						_.temp[0] = ($.r_x + 0.5 + _.input[0] * _.eval('#return ctx.positionMultiplier#')) | 0;
						_.temp[1] = ($.r_y + 0.5 + _.input[1] * _.eval('#return ctx.positionMultiplier#')) | 0;
						_.temp[2] = ((_.temp[0] % $.size_x) + $.size_x) % $.size_x;
						_.temp[3] = ((_.temp[1] % $.size_y) + $.size_y) % $.size_y;
						_.temp[4] =  (_.temp[3] * $.size_x + _.temp[2]) * 4;
						_.output[0] = $.canvasData[_.temp[4]] / 128 - 1;
						_.output[1] = $.canvasData[_.temp[4] + 1] / 128 - 1;
						_.output[2] = $.canvasData[_.temp[4] + 2] / 128 - 1;
						_.output[3] = $.canvasData[_.temp[4] + 3] / 128 - 1;
					},
					getCanvasDataRelativePolar: (_, $) => {
						_.temp[0] = _.input[0] * _.eval('#return ctx.positionMultiplier#');
						_.temp[1] = _.input[1] * Math.PI;
						_.temp[2] = ($.r_x + 0.5 + _.temp[0] * Math.cos(_.temp[1])) | 0;
						_.temp[3] = ($.r_y + 0.5 + _.temp[0] * Math.sin(_.temp[1])) | 0;
						_.temp[4] = ((_.temp[2] % $.size_x) + $.size_x) % $.size_x;
						_.temp[5] = ((_.temp[3] % $.size_y) + $.size_y) % $.size_y;
						_.temp[6] = (_.temp[5] * $.size_x + _.temp[4]) * 4;
						_.output[0] = $.canvasData[_.temp[6]] / 128 - 1;
						_.output[1] = $.canvasData[_.temp[6] + 1] / 128 - 1;
						_.output[2] = $.canvasData[_.temp[6] + 2] / 128 - 1;
						_.output[3] = $.canvasData[_.temp[6] + 3] / 128 - 1;
					},
					constant: (_, $) => {
						_.output[0] = _.eval('#return Math.random() * 2 - 1#');
					},
					random: (_, $) => {
						_.output[0] = Math.random() * 2 - 1;
					},
					reference: (_, $) => {
						 $.v[(((_.input[0] + 1) / 2) * $.dataSize) | 0] = $.v[(((_.input[1] + 1) / 2) * $.dataSize) | 0];
					},
					conditional: (_, $) => {
						_.output[0] = _.input[0] > _.input[1] ? _.input[2] : _.input[3];
					},
					mod: (_, $) => {
						_.temp[0] = (_.input[0] + 1) / 2;
						_.temp[1] = (_.input[1] + 1) / 2;
						_.output[0] = _.temp[1] === 0 ? _.temp[0] : (_.temp[0] % _.temp[1]) * 2 - 1;
					},
					add: (_, $) => {
						_.output[0] = (_.input[0] + _.input[1]) / 2;
					},
					addMod: (_, $) => {
						_.temp[0] = _.input[0] + _.input[1];
						if (_.temp[0] < -1) {
							_.output[0] = _.temp[0] + 1;
						} else if (_.temp[0] >= 1) {
							_.output[0] = _.temp[0] - 1;
						} else {
							_.output[0] = _.temp[0];
						}
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
						_.temp[0] = (($.r_x / $.size_x) * 2 - 1) * ($.size_x / $.sizeMax);
						_.temp[1] = (($.r_y / $.size_y) * 2 - 1) * ($.size_y / $.sizeMax);
						_.temp[2] = (_.input[0] - _.temp[0]) / 2;
						_.temp[3] = (_.input[1] - _.temp[1]) / 2;
						_.output[0] = ((Math.hypot(_.temp[2], _.temp[3]) / Math.SQRT2) * 2 - 1) * 0.99999999;
					},
					atAtan: (_, $) => {
						_.temp[0] = (($.r_x / $.size_x) * 2 - 1) * ($.size_x / $.sizeMax);
						_.temp[1] = (($.r_y / $.size_y) * 2 - 1) * ($.size_y / $.sizeMax);
						_.temp[2] = (_.input[0] - _.temp[0]) / 2;
						_.temp[3] = (_.input[1] - _.temp[1]) / 2;
						_.temp[4] = Math.atan2(_.temp[2], _.temp[3]) / Math.PI;
						_.output[0] = _.temp[4] === 1 ? 0 : _.temp[4];
					}
				}

			};

			const compiler = (() => {
				const getFuncBodyStr = (func) => {
					const funcStr = func.toString();
					return funcStr.substring(funcStr.indexOf('{') + 1, funcStr.lastIndexOf('}'));
				};
				const normalizeCompiledStr = (str) =>
					str.split('\n').map((item) => item.trim()).filter((item) => item !== '').join('\n');
				const count = (func) => {
					const funcBodyStr = getFuncBodyStr(func);
					const countMaps = {input: {}, output: {}, temp: {}};
					const counts = {input: 0, output: 0, temp: 0};
					const countFunc = (type, p1) => {
						if (! countMaps[type].hasOwnProperty(p1)) {
							countMaps[type][p1] = true;
							counts[type] ++;
						}
						return '';
					};
					const replacedStr = funcBodyStr
						.replace(/_\.input\[(.*?)\]/g, (match, p1) => countFunc('input', p1))
						.replace(/_\.output\[(.*?)\]/g, (match, p1) => countFunc('output', p1))
						.replace(/_\.temp\[(.*?)\]/g, (match, p1) => countFunc('temp', p1));
					return counts;
				};
				const compile = (func, inputArr, outputArr, tempBase, evalContext) => {
					const funcBodyStr = getFuncBodyStr(func);
					let tempCount = tempBase;
					const replacedStr = funcBodyStr
						.replace(/\$\./g, '')
						.replace(/_\.input\[(.*?)\]/g, (match, p1) => `v[${inputArr[Number(p1)].toString()}]`)
						.replace(/_\.output\[(.*?)\]/g, (match, p1) => `v[${outputArr[Number(p1).toString()]}]`)
						.replace(/_\.graphOut\[(.*?)\]/g, (match, p1) => `out${p1}`)
						.replace(/_\.temp\[(.*?)\]/g, (match, p1) => {
							if (tempBase + Number(p1) < tempCount) {
								return `t${(tempBase + Number(p1)).toString()}`;
							} else {
								return `let t${(tempCount ++).toString()}`;
							}
						})
						.replace(/_\.eval\('#(.*?)#'\)/g, (match, p1) => (new Function('ctx', p1))(evalContext));
					return normalizeCompiledStr(replacedStr);
				};
				return {count, compile};
			})();

			return `

		(stepCount, globals, canv, inpt) => {

			/* This function will be called on each iteration ('step') of the drawing loop */

			if (stepCount === 0) {
				globals.dataSize = ${config.dataSize};
				globals.canvasData = canv.getData();
				globals.size = canv.getSize();
				globals.size_x = globals.size.x, globals.size_y = globals.size.y;
				globals.sizeMax = Math.max(globals.size.x, globals.size.y);
				globals.data = new Float64Array(globals.size_x * globals.size_y * globals.dataSize);
				globals.dataTemp = new Float64Array(globals.size_x * globals.size_y * globals.dataSize);
				globals.v = new Float64Array(globals.dataSize);
			}

			const {dataSize, canvasData, size, size_x, size_y, sizeMax, data, dataTemp, v} = globals;

			const inptLength = inpt.length;

			let r_x = r_y = 0;

			let di = 0;

			let cdi = 0;

			let out0, out1, out2, out3;

			while (true) {

				v.set(data.subarray(di, di + dataSize));

				/* Start of instructions */

				${(
					config.graphGenerator(compiler, config).reduce((ctx, item) => {
						ctx.strs.push(compiler.compile(item.func, item.inputArr, item.outputArr, ctx.tempCount, config.compileEvalContext));
						ctx.tempCount += compiler.count(item.func).temp;
						return ctx;
					}, {strs: [], tempCount: 0}).strs
						.map((item, instrIndex) => item.split('\n')
							.map((item, lineIndex) => ((instrIndex === 0 && lineIndex === 0) ? '' : '\t\t') + item)
							.join('\n'))
						.join('\n\n')
				)}

				/* End of instructions */

				dataTemp.set(v, di);

				${(new Array(4).fill(true)
					.map((item, index) => `canvasData[cdi] = ((out${index} + 1) * 128) | 0; cdi ++;`)
					.map((item, index) => (index === 0 ? '' : '\t\t') + item)
					.join('\n')
				)}

				di += dataSize;

				if (++ r_x === size_x) { r_x = 0; if (++ r_y === size_y) { break; } }

			}

			canv.putData(canvasData, size, {x: 0, y: 0});

			const swapVar = globals.data;
			globals.data = globals.dataTemp;
			globals.dataTemp = swapVar;

		}

		`.trim();

		}).toString(),

		'conf': (() => {

			/* This function should return an object of app configuration options -
				{
					editorsMaxHistoryLength: <maximum length that the editors ('Draw', 'Rand', and 'Conf' keep their history for)>
					autoRandInterval: { <when 'Auto' is on, this min-max range will be repeatedly used to randomly pick numbers of steps
							after which to randomize the drawing loop>
						min: <minimum of auto-randomization range>,
						max: <maximum of auto-randomization range>
					},
					mouseInputHandler: <function that receives mouse input data and the current value 'eval'ed from the 'inpt'
						editor and should return a string that will be set as the new contents of the 'inpt' editor.>
				}
			*/

			return {
				editorsMaxHistoryLength: {
					draw: Infinity,
					rand: Infinity,
					conf: Infinity,
					inpt: 1
				},
				autoRandInterval: {
					min: 16,
					max: 64
				},
				mouseInputHandler: (position, inptEditorValue) => {
					const inptEditorValueSlice = inptEditorValue.slice();
					inptEditorValueSlice[0] = position.x;
					inptEditorValueSlice[1] = position.y;
					return `[${inptEditorValueSlice.map((item) => item.toString()).join(', ')}]`;
				}
			};

		}).toString()

	}

};