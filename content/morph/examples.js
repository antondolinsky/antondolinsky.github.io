window.App.examples = [
`
		globals.step = globals.hasOwnProperty('step') ? globals.step + 1 : 0;
		if (globals.step === 0) {
			globals.data = new Float32Array(conf.rand.dataLen).fill(0);
		}
		if (conf.autoGen.on && (globals.autoGenNextStep === undefined || globals.step >= globals.autoGenNextStep)) {
			let isDef = globals.autoGenNextStep !== undefined;
			globals.autoGenNextStep = globals.step +
				Math.floor(Math.random() * (conf.autoGen.range.max - conf.autoGen.range.min)) + conf.autoGen.range.min;
			if (isDef) {
				rand();
			}
		}
		const context = _canvas.getContext('2d');
		const size_x = _canvas.width, size_y = _canvas.height;
		const imageData = context.getImageData(0, 0, size_x, size_y);
		const d_o = imageData.data, d_n = new Uint8ClampedArray(d_o);
		const outColorWeights = conf.draw.outColorWeights;
		const w_o = new Float32Array([outColorWeights.r, outColorWeights.g, outColorWeights.b, outColorWeights.a]);
		const w_a = new Float32Array([1 - w_o[0], 1 - w_o[1], 1 - w_o[2], 1 - w_o[3]]);
		const v_l = 32; const v = new Float32Array(v_l);
		let t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15, t16, t17, t18, t19, t20, t21, t22, t23, t24, t25, t26, t27, t28, t29, t30, t31, t32, t33, t34, t35, t36, t37, t38, t39, t40, t41;
		let di = 0;
		for (let r_y = 0; r_y < size_y; r_y ++) { for (let r_x = 0; r_x < size_x; r_x ++) { v.fill(0);

			v[0] = 0.7779031006937083

			t0 = (r_x + 0.5 + v[0] * conf.draw.instructions.positionMultiplier) | 0;
			t1 = (r_y + 0.5 + v[0] * conf.draw.instructions.positionMultiplier) | 0;
			t2 = ((t0 % size_x) + size_x) % size_x;
			t3 = ((t1 % size_y) + size_y) % size_y;
			t4 = 4 * (t3 * size_x + t2);
			v[1] = d_o[t4] / 128 - 1;
			v[2] = d_o[t4 + 1] / 128 - 1;
			v[3] = d_o[t4 + 2] / 128 - 1;
			v[4] = d_o[t4 + 3] / 128 - 1;

			v[5] = Math.atan2(v[3], v[3]) / Math.PI;

			t5 = Math.max(size_x, size_y);
			v[6] = ((r_x / size_x) * 2 - 1) * (size_x / t5);
			v[7] = ((r_y / size_y) * 2 - 1) * (size_y / t5);

			v[8] = Math.random() * 2 - 1;

			t6 = v[4] * conf.draw.instructions.positionMultiplier;
			t7 = v[4] * Math.PI;
			t8 = (r_x + 0.5 + t6 * Math.cos(t7)) | 0;
			t9 = (r_y + 0.5 + t6 * Math.sin(t7)) | 0;
			t10 = ((t8 % size_x) + size_x) % size_x;
			t11 = ((t9 % size_y) + size_y) % size_y;
			t12 = 4 * (t11 * size_x + t10);
			v[9] = d_o[t12] / 128 - 1;
			v[10] = d_o[t12 + 1] / 128 - 1;
			v[11] = d_o[t12 + 2] / 128 - 1;
			v[12] = d_o[t12 + 3] / 128 - 1;

			v[13] = (v[7] + v[10]) / 2;

			t13 = (size_x / 2 + 0.5 + v[9] * size_x / 2) | 0;
			t14 = (size_y / 2 + 0.5 + v[5] * size_y / 2) | 0;
			t15 = ((t13 % size_x) + size_x) % size_x;
			t16 = ((t14 % size_y) + size_y) % size_y;
			t17 = 4 * (t16 * size_x + t15);
			v[14] = d_o[t17] / 128 - 1;
			v[15] = d_o[t17 + 1] / 128 - 1;
			v[16] = d_o[t17 + 2] / 128 - 1;
			v[17] = d_o[t17 + 3] / 128 - 1;

			t18 = 18;
			t19 = t18 - conf.rand.referenceLookBehind;
			t20 = t19 < 0 ? 0 : t19;
			t21 = Math.floor(((v[8] + 1) / 2) * (t18 - t20)) + t20;
			v[18] = v[t21];

			v[19] = ((globals.step % conf.draw.instructions.stepModuli[1]) / conf.draw.instructions.stepModuli[1]) * 2 - 1;

			t22 = (r_x + 0.5 + v[14] * conf.draw.instructions.positionMultiplier) | 0;
			t23 = (r_y + 0.5 + v[17] * conf.draw.instructions.positionMultiplier) | 0;
			t24 = ((t22 % size_x) + size_x) % size_x;
			t25 = ((t23 % size_y) + size_y) % size_y;
			t26 = 4 * (t25 * size_x + t24);
			v[20] = d_o[t26] / 128 - 1;
			v[21] = d_o[t26 + 1] / 128 - 1;
			v[22] = d_o[t26 + 2] / 128 - 1;
			v[23] = d_o[t26 + 3] / 128 - 1;

			t27 = (r_x + 0.5 + v[22] * conf.draw.instructions.positionMultiplier) | 0;
			t28 = (r_y + 0.5 + v[20] * conf.draw.instructions.positionMultiplier) | 0;
			t29 = ((t27 % size_x) + size_x) % size_x;
			t30 = ((t28 % size_y) + size_y) % size_y;
			t31 = 4 * (t30 * size_x + t29);
			v[24] = d_o[t31] / 128 - 1;
			v[25] = d_o[t31 + 1] / 128 - 1;
			v[26] = d_o[t31 + 2] / 128 - 1;
			v[27] = d_o[t31 + 3] / 128 - 1;

			t32 = 28;
			t33 = t32 - conf.rand.referenceLookBehind;
			t34 = t33 < 0 ? 0 : t33;
			t35 = Math.floor(((v[19] + 1) / 2) * (t32 - t34)) + t34;
			v[28] = v[t35];

			t36 = (v[23] + 1) / 2;
			t37 = (v[26] + 1) / 2;
			v[29] = t37 === 0 ? t36 : (t36 % t37) * 2 - 1;

			t38 = 30;
			t39 = t38 - conf.rand.referenceLookBehind;
			t40 = t39 < 0 ? 0 : t39;
			t41 = Math.floor(((v[25] + 1) / 2) * (t38 - t40)) + t40;
			v[30] = v[t41];

			v[31] = (v[29] + v[25]) / 2;

		for (let i = 0, s = v_l - 4; i < 4; i ++, di ++) { d_n[di] = (d_o[di] * w_a[i] + (v[s + i] + 1) * 128 * w_o[i]) | 0; } } }
		context.putImageData((imageData.data.set(d_n), imageData), 0, 0);
`,
`
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
		const v_l = 22; const v = new Float32Array(v_l);
		let t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15, t16, t17, t18, t19, t20, t21, t22, t23, t24, t25, t26, t27, t28, t29, t30, t31, t32, t33, t34, t35, t36, t37, t38, t39, t40;
		let di = 0;
		for (let r_y = 0; r_y < size_y; r_y ++) { for (let r_x = 0; r_x < size_x; r_x ++) { v.fill(0);

			v[0] = -0.11131168010823611

			t0 = 1;
			t1 = t0 - conf.rand.referenceLookBehind;
			t2 = t1 < 0 ? 0 : t1;
			t3 = Math.floor(((v[0] + 1) / 2) * (t0 - t2)) + t2;
			v[1] = v[t3];

			t4 = Math.max(size_x, size_y);
			t5 = ((r_x / size_x) * 2 - 1) * (size_x / t4);
			t6 = ((r_y / size_y) * 2 - 1) * (size_y / t4);
			v[2] = Math.hypot(t5, t6) / Math.sqrt(2);

			t7 = 3;
			t8 = t7 - conf.rand.referenceLookBehind;
			t9 = t8 < 0 ? 0 : t8;
			t10 = Math.floor(((v[2] + 1) / 2) * (t7 - t9)) + t9;
			v[3] = v[t10];

			v[4] = (v[3] + v[0]) / 2;

			v[5] = v[1] > v[2] ? v[2] : v[0];

			t11 = (size_x / 2 + 0.5 + v[3] * size_x / 2) | 0;
			t12 = (size_y / 2 + 0.5 + v[3] * size_y / 2) | 0;
			t13 = ((t11 % size_x) + size_x) % size_x;
			t14 = ((t12 % size_y) + size_y) % size_y;
			t15 = 4 * (t14 * size_x + t13);
			v[6] = d_o[t15] / 128 - 1;
			v[7] = d_o[t15 + 1] / 128 - 1;
			v[8] = d_o[t15 + 2] / 128 - 1;
			v[9] = d_o[t15 + 3] / 128 - 1;

			t16 = 10;
			t17 = t16 - conf.rand.referenceLookBehind;
			t18 = t17 < 0 ? 0 : t17;
			t19 = Math.floor(((v[1] + 1) / 2) * (t16 - t18)) + t18;
			v[10] = v[t19];

			v[11] = ((globals.step % conf.draw.instructions.stepModuli[1]) / conf.draw.instructions.stepModuli[1]) * 2 - 1;

			t20 = Math.max(size_x, size_y);
			v[12] = ((r_x / size_x) * 2 - 1) * (size_x / t20);
			v[13] = ((r_y / size_y) * 2 - 1) * (size_y / t20);

			v[14] = Math.hypot(v[9], v[9]) / Math.sqrt(2);

			t21 = 15;
			t22 = t21 - conf.rand.referenceLookBehind;
			t23 = t22 < 0 ? 0 : t22;
			t24 = Math.floor(((v[8] + 1) / 2) * (t21 - t23)) + t23;
			v[15] = v[t24];

			v[16] = ((globals.step % conf.draw.instructions.stepModuli[0]) / conf.draw.instructions.stepModuli[0]) * 2 - 1;

			t25 = 17;
			t26 = t25 - conf.rand.referenceLookBehind;
			t27 = t26 < 0 ? 0 : t26;
			t28 = Math.floor(((v[12] + 1) / 2) * (t25 - t27)) + t27;
			v[17] = v[t28];

			t29 = 18;
			t30 = t29 - conf.rand.referenceLookBehind;
			t31 = t30 < 0 ? 0 : t30;
			t32 = Math.floor(((v[8] + 1) / 2) * (t29 - t31)) + t31;
			v[18] = v[t32];

			t33 = 19;
			t34 = t33 - conf.rand.referenceLookBehind;
			t35 = t34 < 0 ? 0 : t34;
			t36 = Math.floor(((v[17] + 1) / 2) * (t33 - t35)) + t35;
			v[19] = v[t36];

			v[20] = Math.random() * 2 - 1;

			t37 = 21;
			t38 = t37 - conf.rand.referenceLookBehind;
			t39 = t38 < 0 ? 0 : t38;
			t40 = Math.floor(((v[15] + 1) / 2) * (t37 - t39)) + t39;
			v[21] = v[t40];

		for (let i = 0, s = v_l - 4; i < 4; i ++, di ++) { d_n[di] = (d_o[di] * w_a[i] + (v[s + i] + 1) * 128 * w_o[i]) | 0; } } }
		context.putImageData((imageData.data.set(d_n), imageData), 0, 0);
`,
`
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
		const v_l = 42; const v = new Float32Array(v_l);
		let t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15, t16, t17, t18, t19, t20, t21, t22, t23, t24, t25, t26, t27, t28, t29, t30, t31, t32, t33, t34, t35, t36, t37, t38, t39, t40, t41, t42, t43, t44, t45, t46, t47, t48, t49, t50, t51, t52, t53, t54, t55, t56;
		let di = 0;
		for (let r_y = 0; r_y < size_y; r_y ++) { for (let r_x = 0; r_x < size_x; r_x ++) { v.fill(0);

			v[0] = -0.6116395355430364

			v[1] = (v[0] + v[0]) / 2;

			t0 = v[1] * conf.draw.instructions.positionMultiplier;
			t1 = v[0] * Math.PI;
			t2 = (r_x + 0.5 + t0 * Math.cos(t1)) | 0;
			t3 = (r_y + 0.5 + t0 * Math.sin(t1)) | 0;
			t4 = ((t2 % size_x) + size_x) % size_x;
			t5 = ((t3 % size_y) + size_y) % size_y;
			t6 = 4 * (t5 * size_x + t4);
			v[2] = d_o[t6] / 128 - 1;
			v[3] = d_o[t6 + 1] / 128 - 1;
			v[4] = d_o[t6 + 2] / 128 - 1;
			v[5] = d_o[t6 + 3] / 128 - 1;

			v[6] = Math.random() * 2 - 1;

			t7 = 7;
			t8 = t7 - conf.rand.referenceLookBehind;
			t9 = t8 < 0 ? 0 : t8;
			t10 = Math.floor(((v[3] + 1) / 2) * (t7 - t9)) + t9;
			v[7] = v[t10];

			v[8] = ((globals.step % conf.draw.instructions.stepModuli[1]) / conf.draw.instructions.stepModuli[1]) * 2 - 1;

			t11 = (r_x + 0.5 + v[1] * conf.draw.instructions.positionMultiplier) | 0;
			t12 = (r_y + 0.5 + v[0] * conf.draw.instructions.positionMultiplier) | 0;
			t13 = ((t11 % size_x) + size_x) % size_x;
			t14 = ((t12 % size_y) + size_y) % size_y;
			t15 = 4 * (t14 * size_x + t13);
			v[9] = d_o[t15] / 128 - 1;
			v[10] = d_o[t15 + 1] / 128 - 1;
			v[11] = d_o[t15 + 2] / 128 - 1;
			v[12] = d_o[t15 + 3] / 128 - 1;

			v[13] = (v[7] + v[7]) / 2;

			t16 = Math.max(size_x, size_y);
			v[14] = ((r_x / size_x) * 2 - 1) * (size_x / t16);
			v[15] = ((r_y / size_y) * 2 - 1) * (size_y / t16);

			t17 = (v[7] + 1) / 2;
			t18 = (v[11] + 1) / 2;
			v[16] = t18 === 0 ? t17 : (t17 % t18) * 2 - 1;

			t19 = (size_x / 2 + 0.5 + v[15] * size_x / 2) | 0;
			t20 = (size_y / 2 + 0.5 + v[15] * size_y / 2) | 0;
			t21 = ((t19 % size_x) + size_x) % size_x;
			t22 = ((t20 % size_y) + size_y) % size_y;
			t23 = 4 * (t22 * size_x + t21);
			v[17] = d_o[t23] / 128 - 1;
			v[18] = d_o[t23 + 1] / 128 - 1;
			v[19] = d_o[t23 + 2] / 128 - 1;
			v[20] = d_o[t23 + 3] / 128 - 1;

			t24 = 21;
			t25 = t24 - conf.rand.referenceLookBehind;
			t26 = t25 < 0 ? 0 : t25;
			t27 = Math.floor(((v[18] + 1) / 2) * (t24 - t26)) + t26;
			v[21] = v[t27];

			t28 = (r_x + 0.5 + v[12] * conf.draw.instructions.positionMultiplier) | 0;
			t29 = (r_y + 0.5 + v[12] * conf.draw.instructions.positionMultiplier) | 0;
			t30 = ((t28 % size_x) + size_x) % size_x;
			t31 = ((t29 % size_y) + size_y) % size_y;
			t32 = 4 * (t31 * size_x + t30);
			v[22] = d_o[t32] / 128 - 1;
			v[23] = d_o[t32 + 1] / 128 - 1;
			v[24] = d_o[t32 + 2] / 128 - 1;
			v[25] = d_o[t32 + 3] / 128 - 1;

			t33 = 26;
			t34 = t33 - conf.rand.referenceLookBehind;
			t35 = t34 < 0 ? 0 : t34;
			t36 = Math.floor(((v[24] + 1) / 2) * (t33 - t35)) + t35;
			v[26] = v[t36];

			v[27] = (v[24] + v[26]) / 2;

			t37 = Math.max(size_x, size_y);
			t38 = ((r_x / size_x) * 2 - 1) * (size_x / t37);
			t39 = ((r_y / size_y) * 2 - 1) * (size_y / t37);
			v[28] = Math.hypot(t38, t39) / Math.sqrt(2);

			t40 = 29;
			t41 = t40 - conf.rand.referenceLookBehind;
			t42 = t41 < 0 ? 0 : t41;
			t43 = Math.floor(((v[21] + 1) / 2) * (t40 - t42)) + t42;
			v[29] = v[t43];

			v[30] = ((globals.step % conf.draw.instructions.stepModuli[0]) / conf.draw.instructions.stepModuli[0]) * 2 - 1;

			t44 = 31;
			t45 = t44 - conf.rand.referenceLookBehind;
			t46 = t45 < 0 ? 0 : t45;
			t47 = Math.floor(((v[28] + 1) / 2) * (t44 - t46)) + t46;
			v[31] = v[t47];

			v[32] = ((globals.step % conf.draw.instructions.stepModuli[0]) / conf.draw.instructions.stepModuli[0]) * 2 - 1;

			v[33] = Math.random() * 2 - 1;

			t48 = (v[28] + 1) / 2;
			t49 = (v[33] + 1) / 2;
			v[34] = t49 === 0 ? t48 : (t48 % t49) * 2 - 1;

			t50 = Math.max(size_x, size_y);
			v[35] = ((r_x / size_x) * 2 - 1) * (size_x / t50);
			v[36] = ((r_y / size_y) * 2 - 1) * (size_y / t50);

			v[37] = Math.random() * 2 - 1;

			v[38] = v[28] > v[36] ? v[36] : v[29];

			t51 = 39;
			t52 = t51 - conf.rand.referenceLookBehind;
			t53 = t52 < 0 ? 0 : t52;
			t54 = Math.floor(((v[33] + 1) / 2) * (t51 - t53)) + t53;
			v[39] = v[t54];

			t55 = (v[30] + 1) / 2;
			t56 = (v[37] + 1) / 2;
			v[40] = t56 === 0 ? t55 : (t55 % t56) * 2 - 1;

			v[41] = Math.cos(v[33] * Math.PI);

		for (let i = 0, s = v_l - 4; i < 4; i ++, di ++) { d_n[di] = (d_o[di] * w_a[i] + (v[s + i] + 1) * 128 * w_o[i]) | 0; } } }
		context.putImageData((imageData.data.set(d_n), imageData), 0, 0);
`,
`
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
		const v_l = 36; const v = new Float32Array(v_l);
		let t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15, t16, t17, t18, t19, t20, t21, t22, t23, t24, t25, t26, t27, t28, t29, t30, t31, t32, t33, t34, t35, t36, t37, t38, t39, t40, t41, t42, t43, t44, t45, t46, t47, t48, t49, t50, t51, t52, t53, t54, t55, t56, t57, t58, t59, t60, t61, t62;
		let di = 0;
		for (let r_y = 0; r_y < size_y; r_y ++) { for (let r_x = 0; r_x < size_x; r_x ++) { v.fill(0);

			v[0] = -0.7726744812873196

			t0 = Math.max(size_x, size_y);
			t1 = ((r_x / size_x) * 2 - 1) * (size_x / t0);
			t2 = ((r_y / size_y) * 2 - 1) * (size_y / t0);
			v[1] = Math.hypot(t1, t2) / Math.sqrt(2);

			t3 = (v[0] + 1) / 2;
			t4 = (v[1] + 1) / 2;
			v[2] = t4 === 0 ? t3 : (t3 % t4) * 2 - 1;

			t5 = v[2] * conf.draw.instructions.positionMultiplier;
			t6 = v[2] * Math.PI;
			t7 = (r_x + 0.5 + t5 * Math.cos(t6)) | 0;
			t8 = (r_y + 0.5 + t5 * Math.sin(t6)) | 0;
			t9 = ((t7 % size_x) + size_x) % size_x;
			t10 = ((t8 % size_y) + size_y) % size_y;
			t11 = 4 * (t10 * size_x + t9);
			v[3] = d_o[t11] / 128 - 1;
			v[4] = d_o[t11 + 1] / 128 - 1;
			v[5] = d_o[t11 + 2] / 128 - 1;
			v[6] = d_o[t11 + 3] / 128 - 1;

			t12 = 7;
			t13 = t12 - conf.rand.referenceLookBehind;
			t14 = t13 < 0 ? 0 : t13;
			t15 = Math.floor(((v[0] + 1) / 2) * (t12 - t14)) + t14;
			v[7] = v[t15];

			t16 = 8;
			t17 = t16 - conf.rand.referenceLookBehind;
			t18 = t17 < 0 ? 0 : t17;
			t19 = Math.floor(((v[2] + 1) / 2) * (t16 - t18)) + t18;
			v[8] = v[t19];

			t20 = 9;
			t21 = t20 - conf.rand.referenceLookBehind;
			t22 = t21 < 0 ? 0 : t21;
			t23 = Math.floor(((v[4] + 1) / 2) * (t20 - t22)) + t22;
			v[9] = v[t23];

			v[10] = (v[7] + v[0]) / 2;

			v[11] = v[9] > v[5] ? v[6] : v[2];

			v[12] = v[11] > v[7] ? v[4] : v[10];

			v[13] = Math.hypot(v[8], v[11]) / Math.sqrt(2);

			t24 = 14;
			t25 = t24 - conf.rand.referenceLookBehind;
			t26 = t25 < 0 ? 0 : t25;
			t27 = Math.floor(((v[5] + 1) / 2) * (t24 - t26)) + t26;
			v[14] = v[t27];

			t28 = v[6] * conf.draw.instructions.positionMultiplier;
			t29 = v[13] * Math.PI;
			t30 = (r_x + 0.5 + t28 * Math.cos(t29)) | 0;
			t31 = (r_y + 0.5 + t28 * Math.sin(t29)) | 0;
			t32 = ((t30 % size_x) + size_x) % size_x;
			t33 = ((t31 % size_y) + size_y) % size_y;
			t34 = 4 * (t33 * size_x + t32);
			v[15] = d_o[t34] / 128 - 1;
			v[16] = d_o[t34 + 1] / 128 - 1;
			v[17] = d_o[t34 + 2] / 128 - 1;
			v[18] = d_o[t34 + 3] / 128 - 1;

			v[19] = ((globals.step % conf.draw.instructions.stepModuli[2]) / conf.draw.instructions.stepModuli[2]) * 2 - 1;

			v[20] = ((globals.step % conf.draw.instructions.stepModuli[1]) / conf.draw.instructions.stepModuli[1]) * 2 - 1;

			t35 = Math.max(size_x, size_y);
			v[21] = ((r_x / size_x) * 2 - 1) * (size_x / t35);
			v[22] = ((r_y / size_y) * 2 - 1) * (size_y / t35);

			v[23] = ((globals.step % conf.draw.instructions.stepModuli[2]) / conf.draw.instructions.stepModuli[2]) * 2 - 1;

			t36 = (v[17] + 1) / 2;
			t37 = (v[18] + 1) / 2;
			v[24] = t37 === 0 ? t36 : (t36 % t37) * 2 - 1;

			t38 = 25;
			t39 = t38 - conf.rand.referenceLookBehind;
			t40 = t39 < 0 ? 0 : t39;
			t41 = Math.floor(((v[20] + 1) / 2) * (t38 - t40)) + t40;
			v[25] = v[t41];

			t42 = (r_x + 0.5 + v[25] * conf.draw.instructions.positionMultiplier) | 0;
			t43 = (r_y + 0.5 + v[17] * conf.draw.instructions.positionMultiplier) | 0;
			t44 = ((t42 % size_x) + size_x) % size_x;
			t45 = ((t43 % size_y) + size_y) % size_y;
			t46 = 4 * (t45 * size_x + t44);
			v[26] = d_o[t46] / 128 - 1;
			v[27] = d_o[t46 + 1] / 128 - 1;
			v[28] = d_o[t46 + 2] / 128 - 1;
			v[29] = d_o[t46 + 3] / 128 - 1;

			t47 = 30;
			t48 = t47 - conf.rand.referenceLookBehind;
			t49 = t48 < 0 ? 0 : t48;
			t50 = Math.floor(((v[21] + 1) / 2) * (t47 - t49)) + t49;
			v[30] = v[t50];

			t51 = 31;
			t52 = t51 - conf.rand.referenceLookBehind;
			t53 = t52 < 0 ? 0 : t52;
			t54 = Math.floor(((v[21] + 1) / 2) * (t51 - t53)) + t53;
			v[31] = v[t54];

			t55 = 32;
			t56 = t55 - conf.rand.referenceLookBehind;
			t57 = t56 < 0 ? 0 : t56;
			t58 = Math.floor(((v[29] + 1) / 2) * (t55 - t57)) + t57;
			v[32] = v[t58];

			v[33] = (v[27] + v[32]) / 2;

			v[34] = v[33] > v[28] ? v[27] : v[32];

			t59 = 35;
			t60 = t59 - conf.rand.referenceLookBehind;
			t61 = t60 < 0 ? 0 : t60;
			t62 = Math.floor(((v[26] + 1) / 2) * (t59 - t61)) + t61;
			v[35] = v[t62];

		for (let i = 0, s = v_l - 4; i < 4; i ++, di ++) { d_n[di] = (d_o[di] * w_a[i] + (v[s + i] + 1) * 128 * w_o[i]) | 0; } } }
		context.putImageData((imageData.data.set(d_n), imageData), 0, 0);
`
];