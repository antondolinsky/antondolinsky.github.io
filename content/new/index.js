window.addEventListener('DOMContentLoaded', () => {
  const defaults = {
    canvSize: 600,
    depth: 32,
    width: 16,
    tCount: 2,
    step: 0.001,
    ts: null,
    f: null
  };

  const options = { ...defaults };

  const params = new URLSearchParams(window.location.search);

  ['canvSize', 'depth', 'width', 'tCount', 'step'].forEach((name) => {
    if (params.has(name)) {
      options[name] = Number(params.get(name));
    }
  });
  if (params.has('ts')) {
    const paramStr = params.get('ts');
    options.ts = paramStr.substring(1, paramStr.length - 1).split(',').map((item) => Number(item));
  } else {
    options.ts = new Array(options.tCount).fill(true).map(() => Math.random() * 2 - 1);
  }
  if (params.has('f')) {
    const paramStr = params.get('f');
    options.f = new Float32Array(paramStr.substring(1, paramStr.length - 1).split(',').map((item) => Number(item)));
  } else {
    options.f = new Float32Array(options.depth * options.width * (options.width + 1)).map(() => Math.random() * 2 - 1);
  }

  const { canvSize, depth, width, tCount, step, ts, f } = options;

  const setParams = new URLSearchParams();
  ['canvSize', 'depth', 'width', 'tCount', 'step'].forEach((name) => {
    setParams.append(name, options[name]);
  });
  setParams.append('ts', `[${options.ts.map((t) => t.toString()).join(',')}]`);
  setParams.append('f', `[${options.f.map((v) => v.toString()).join(',')}]`);
  const queryStr = setParams.toString();

  const k = new Function('ts', `
let depth = ${depth};
let width = ${width};
let x = (this.thread.x / this.output.x) * 2 - 1;
let y = (this.thread.y / this.output.y) * 2 - 1;
${new Array(f.length).fill(true).map((e, fIndex) => `let f${fIndex} = ${f[fIndex]};`).join('')}
${new Array(width).fill(true).map((e, iIndex) => `let i${iIndex} = 0;`).join('')}
${new Array(width).fill(true).map((e, oIndex) => `let o${oIndex} = 0;`).join('')}
${new Array(width).fill(true).map((e, iIndex) => `i${iIndex} = ${(['x', 'y'].concat(new Array(tCount).fill(true).map((e, tIndex) => `ts[${tIndex}]`)))[iIndex % (2 + tCount)]};`).join('')}
${new Array(depth).fill(true).map((e, lIndex) =>
  `${new Array(width).fill(true).map((e, oIndex) =>
    `o${oIndex} = Math.tanh(${new Array(width).fill(true).map((e, iIndex) =>
      `i${iIndex} * f${lIndex * width * (width + 1) + oIndex * (width + 1) + iIndex}`).join(' + ')} + f${lIndex * width * (width + 1) + oIndex * (width + 1) + width});`
  ).join('\n')}
${new Array(width).fill(true).map((e, index) => `i${index} = o${index};`).join('')}`
).join('')}
this.color((o0 + 1) / 2, (o1 + 1) / 2, (o2 + 1) / 2, 1);
  `);

  console.log({ options, queryStr, k });

  const gpu = new GPU();

  const render = gpu.createKernel(k)
    .setOutput([canvSize, canvSize])
    .setGraphical(true);

  const genTFunc = (t) => {
    return () => {
      const initialT = t;
      t += step;
      if (t >= 1) {
        t -= 2;
      }
      const returnValue = Math.cos(initialT * Math.PI);
      return returnValue;
    };
  };

  const go = (tFuncs) => {
    const ts = tFuncs.map((tFunc) => tFunc());
    render(ts);
    document.body.firstChild && document.body.firstChild.remove();
    document.body.appendChild(render.canvas);
    window.requestAnimationFrame(() => go(tFuncs));
  };

  const tFuncs = new Array(tCount).fill(true).map((e, tIndex) => genTFunc(ts[tIndex]));
  window.requestAnimationFrame(() => go(tFuncs));
});
