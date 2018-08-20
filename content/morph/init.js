const conf = {
	autoGen: {
		on: false,
		range: {
			min: 5,
			max: 40
		}
	},
	rand: {
		varLookBehind: 10,
		referenceLookBehind: 10,
		instructionsNumRange: {
			min: 10,
			max: 40
		},
		instructionChances: {
			getData: 0,
			putData: 0,
			reference: 120,
			const: 10,
			rand: 30,
			step: 20,
			step2: 20,
			step3: 20,
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
		},
		dataLen: 5,
		instructionsDef: {
			getData: (iface) => `
${iface.strRand()} = ${iface.strDataRand()};
`,
			putData: (iface) => `
${iface.strDataRand()} = ${iface.strRand()};
`,
			reference: (iface) =>
`
${iface.strTemp()} = ${iface.maxRand()};
${iface.strTemp()} = ${iface.strTempNum(0)} - conf.rand.referenceLookBehind;
${iface.strTemp()} = ${iface.strTempNum(1)} < 0 ? 0 : ${iface.strTempNum(1)};
${iface.strTemp()} = Math.floor(((${iface.strRand()} + 1) / 2) * (${iface.strTempNum(0)} - ${iface.strTempNum(2)})) + ${iface.strTempNum(2)};
${iface.strIter()} = v[${iface.strTempNum(3)}];
`,
			const: (iface) => `
${iface.strIter()} = ${Math.random() * 2 - 1};
`,
			rand: (iface) => `
${iface.strIter()} = Math.random() * 2 - 1;
`,
			step: (iface) => `
${iface.strIter()} = ((globals.step % conf.draw.instructions.stepModuli[0]) / conf.draw.instructions.stepModuli[0]) * 2 - 1;
`,
			step2: (iface) => `
${iface.strIter()} = ((globals.step % conf.draw.instructions.stepModuli[1]) / conf.draw.instructions.stepModuli[1]) * 2 - 1;
`,
			step3: (iface) => `
${iface.strIter()} = ((globals.step % conf.draw.instructions.stepModuli[2]) / conf.draw.instructions.stepModuli[2]) * 2 - 1;
`,
			if: (iface) => `
${iface.strIter()} = ${iface.strRand()} > ${iface.strRand()} ? ${iface.strRand()} : ${iface.strRand()};
`,
			getAtPosR: (iface) => `
${iface.strTemp()} = Math.max(size_x, size_y);
${iface.strIter()} = ((r_x / size_x) * 2 - 1) * (size_x / ${iface.strTempNum(0)});
${iface.strIter()} = ((r_y / size_y) * 2 - 1) * (size_y / ${iface.strTempNum(0)});
`,
			getAtPosPRadius: (iface) => `
${iface.strTemp()} = Math.max(size_x, size_y);
${iface.strTemp()} = ((r_x / size_x) * 2 - 1) * (size_x / ${iface.strTempNum(0)});
${iface.strTemp()} = ((r_y / size_y) * 2 - 1) * (size_y / ${iface.strTempNum(0)});
${iface.strIter()} = Math.hypot(${iface.strTempNum(1)}, ${iface.strTempNum(2)}) / Math.sqrt(2);
`,
			getAtPosPAngle: (iface) => `
${iface.strTemp()} = Math.max(size_x, size_y);
${iface.strTemp()} = ((r_x / size_x) * 2 - 1) * (size_x / ${iface.strTempNum(0)});
${iface.strTemp()} = ((r_y / size_y) * 2 - 1) * (size_y / ${iface.strTempNum(0)});
${iface.strIter()} = Math.atan2(${iface.strTempNum(1)}, ${iface.strTempNum(2)}) / Math.PI;
`,
			getAbsR: (iface) => `
${iface.strTemp()} = (size_x / 2 + 0.5 + ${iface.strRand()} * size_x / 2) | 0;
${iface.strTemp()} = (size_y / 2 + 0.5 + ${iface.strRand()} * size_y / 2) | 0;
${iface.strTemp()} = ((${iface.strTempNum(0)} % size_x) + size_x) % size_x;
${iface.strTemp()} = ((${iface.strTempNum(1)} % size_y) + size_y) % size_y;
${iface.strTemp()} = 4 * (${iface.strTempNum(3)} * size_x + ${iface.strTempNum(2)});
${iface.strIter()} = d_o[${iface.strTempNum(4)}] / 128 - 1;
${iface.strIter()} = d_o[${iface.strTempNum(4)} + 1] / 128 - 1;
${iface.strIter()} = d_o[${iface.strTempNum(4)} + 2] / 128 - 1;
${iface.strIter()} = d_o[${iface.strTempNum(4)} + 3] / 128 - 1;
`,
			getAbsP: (iface) => `
${iface.strTemp()} = ${iface.strRand()} * Math.max(size_x, size_y) / 2;
${iface.strTemp()} = ${iface.strRand()} * Math.PI;
${iface.strTemp()} = (size_x / 2 + 0.5 + ${iface.strTempNum(0)} * Math.cos(${iface.strTempNum(1)})) | 0;
${iface.strTemp()} = (size_y / 2 + 0.5 + ${iface.strTempNum(0)} * Math.sin(${iface.strTempNum(1)})) | 0;
${iface.strTemp()} = ((${iface.strTempNum(2)} % size_x) + size_x) % size_x;
${iface.strTemp()} = ((${iface.strTempNum(3)} % size_y) + size_y) % size_y;
${iface.strTemp()} = 4 * (${iface.strTempNum(5)} * size_x + ${iface.strTempNum(4)});
${iface.strIter()} = d_o[${iface.strTempNum(6)}] / 128 - 1;
${iface.strIter()} = d_o[${iface.strTempNum(6)} + 1] / 128 - 1;
${iface.strIter()} = d_o[${iface.strTempNum(6)} + 2] / 128 - 1;
${iface.strIter()} = d_o[${iface.strTempNum(6)} + 3] / 128 - 1;
`,
			getRelR: (iface) => `
${iface.strTemp()} = (r_x + 0.5 + ${iface.strRand()} * conf.draw.instructions.positionMultiplier) | 0;
${iface.strTemp()} = (r_y + 0.5 + ${iface.strRand()} * conf.draw.instructions.positionMultiplier) | 0;
${iface.strTemp()} = ((${iface.strTempNum(0)} % size_x) + size_x) % size_x;
${iface.strTemp()} = ((${iface.strTempNum(1)} % size_y) + size_y) % size_y;
${iface.strTemp()} = 4 * (${iface.strTempNum(3)} * size_x + ${iface.strTempNum(2)});
${iface.strIter()} = d_o[${iface.strTempNum(4)}] / 128 - 1;
${iface.strIter()} = d_o[${iface.strTempNum(4)} + 1] / 128 - 1;
${iface.strIter()} = d_o[${iface.strTempNum(4)} + 2] / 128 - 1;
${iface.strIter()} = d_o[${iface.strTempNum(4)} + 3] / 128 - 1;
`,
			getRelP: (iface) => `
${iface.strTemp()} = ${iface.strRand()} * conf.draw.instructions.positionMultiplier;
${iface.strTemp()} = ${iface.strRand()} * Math.PI;
${iface.strTemp()} = (r_x + 0.5 + ${iface.strTempNum(0)} * Math.cos(${iface.strTempNum(1)})) | 0;
${iface.strTemp()} = (r_y + 0.5 + ${iface.strTempNum(0)} * Math.sin(${iface.strTempNum(1)})) | 0;
${iface.strTemp()} = ((${iface.strTempNum(2)} % size_x) + size_x) % size_x;
${iface.strTemp()} = ((${iface.strTempNum(3)} % size_y) + size_y) % size_y;
${iface.strTemp()} = 4 * (${iface.strTempNum(5)} * size_x + ${iface.strTempNum(4)});
${iface.strIter()} = d_o[${iface.strTempNum(6)}] / 128 - 1;
${iface.strIter()} = d_o[${iface.strTempNum(6)} + 1] / 128 - 1;
${iface.strIter()} = d_o[${iface.strTempNum(6)} + 2] / 128 - 1;
${iface.strIter()} = d_o[${iface.strTempNum(6)} + 3] / 128 - 1;`,
			mod: (iface) => `
${iface.strTemp()} = (${iface.strRand()} + 1) / 2;
${iface.strTemp()} = (${iface.strRand()} + 1) / 2;
${iface.strIter()} = ${iface.strTempNum(1)} === 0 ? ${iface.strTempNum(0)} : (${iface.strTempNum(0)} % ${iface.strTempNum(1)}) * 2 - 1;
`,
			add: (iface) => `
${iface.strIter()} = (${iface.strRand()} + ${iface.strRand()}) / 2;
`,
			mul: (iface) => `
${iface.strIter()} = ${iface.strRand()} * ${iface.strRand()};
`,
			hyp: (iface) => `
${iface.strIter()} = Math.hypot(${iface.strRand()}, ${iface.strRand()}) / Math.sqrt(2);
`,
			cos: (iface) => `
${iface.strIter()} = Math.cos(${iface.strRand()} * Math.PI);
`,
			atan: (iface) => `
${iface.strIter()} = Math.atan2(${iface.strRand()}, ${iface.strRand()}) / Math.PI;
`
		}
	},
	draw: {
		instructions: {
			stepModuli: [20, 200, 1000],
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

const randFunc = (globals, conf, bodyFunc) => {
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
	let instructions;
	let iface = (() => {
		let count = 0;
		let tempCount = 0;
		let instructionTempCount;
		let maxRand;
		return {
			instructions,
			count: (val) => val === undefined ? count : count = val,
			tempCount: () => tempCount,
			maxRand: () => maxRand,
			update: () => {
				maxRand = count;
				instructionTempCount = tempCount;
			},
			strIter: () => `v[${count ++}]`,
			strRand: () => {
				const max = maxRand;
				const min = Math.max(max - conf.rand.varLookBehind, 0);
				return `v[${Math.floor(Math.random() * (max - min)) + min}]`;
			},
			strTemp: () => `t${tempCount ++}`,
			strTempNum: (n) => `t${instructionTempCount + n}`,
			strDataRand: () => `globals.data[${Math.floor(Math.random() * conf.rand.dataLen)}]`
		};
	})();
	iface.count(1);
	const instructionsNum =
		Math.floor(Math.random() * (conf.rand.instructionsNumRange.max - conf.rand.instructionsNumRange.min)) +
		conf.rand.instructionsNumRange.min;
	instructions = []
		.concat(`v[0] = ${Math.random() * 2 - 1}`)
		.concat(new Array(instructionsNum)
			.fill(true)
			.map((item) => {
				iface.update();
				return conf.rand.instructionsDef[getByChance(conf.rand.instructionChances)](iface);
			}));
	const instructionsStr = instructions
		.map((str) => str.trim())
		.map((str) => '\t\t\t' + str.split('\n').join('\n\t\t\t'))
		.join('\n\n');
	const vDefStr = `const v_l = ${iface.count()}; const v = new Float32Array(v_l);`;
	const tempDefStr = iface.tempCount() === 0 ?
		'' :
		`let ${new Array(iface.tempCount()).fill(undefined).map((item, index) => `t${index}`).join(', ')};`;
	const drawFunc = (globals, _canvas, conf, rand) => {
		globals.step = globals.hasOwnProperty('step') ? globals.step + 1 : 0;
		if (conf.autoGen.on && (globals.autoGenNextStep === undefined || globals.step >= globals.autoGenNextStep)) {
			let isDef = globals.autoGenNextStep !== undefined;
			globals.autoGenNextStep = globals.step +
				Math.floor(Math.random() * (conf.autoGen.range.max - conf.autoGen.range.min)) + conf.autoGen.range.min;
			if (isDef) {
				rand();
			}
		}
		if (! globals.hasOwnProperty('data')) {
			globals.data = new Float32Array(conf.rand.dataLen).fill(0);
		}
		const context = _canvas.getContext('2d');
		const size_x = _canvas.width, size_y = _canvas.height;
		const imageData = context.getImageData(0, 0, size_x, size_y);
		const d_o = imageData.data, d_n = new Uint8ClampedArray(d_o);
		const outColorWeights = conf.draw.outColorWeights;
		const w_o = new Float32Array([outColorWeights.r, outColorWeights.g, outColorWeights.b, outColorWeights.a]);
		const w_a = new Float32Array([1 - w_o[0], 1 - w_o[1], 1 - w_o[2], 1 - w_o[3]]);
		/* vDefStr */
		/* tempDefStr */
		let di = 0;
		for (let r_y = 0; r_y < size_y; r_y ++) { for (let r_x = 0; r_x < size_x; r_x ++) { v.fill(0);

/* instructionsStr */

		for (let i = 0, s = v_l - 4; i < 4; i ++, di ++) { d_n[di] = (d_o[di] * w_a[i] + (v[s + i] + 1) * 128 * w_o[i]) | 0; } } }
		context.putImageData((imageData.data.set(d_n), imageData), 0, 0);
	};
	return bodyFunc(drawFunc)
		.replace('/* vDefStr */', vDefStr)
		.replace('/* tempDefStr */', tempDefStr)
		.replace('/* instructionsStr */', instructionsStr);
};

const drawInit = (_canvas) => {
	const width = 400, height = 400;
	_canvas.width = width, _canvas.height = height;
	const context = _canvas.getContext('2d');
	const imageData = context.getImageData(0, 0, width, height);
	imageData.data.fill(255);
	context.putImageData(imageData, 0, 0);
};

const init = ({qsa, run, draw, rand, bodyFunc, stringify, editorPane}) => {
	const _canvas = qsa('[data-canvas]')[0];

	drawInit(_canvas);

	Object.values(editorPane.editors)
		.forEach((editor) => Object.assign(editor._editor.style, {width: '800px', height: '400px'}));

	editorPane.editors['rand'].save(bodyFunc(randFunc));
	editorPane.editors['conf'].save(`(${stringify(conf)})`);

	rand();
};

window.App.init = init;