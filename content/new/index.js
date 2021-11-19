window.addEventListener('DOMContentLoaded', () => {
  const CANV_SIZE = 600;

  const depth = 32;
  const width = 16;

  const tCount = 2;

  const f = new Float32Array(depth * width * (width + 1)).map(() => Math.random() * 2 - 1);

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

  console.log({ depth, width, f, k });

  const gpu = new GPU();

  const render = gpu.createKernel(k)
    .setOutput([CANV_SIZE, CANV_SIZE])
    .setGraphical(true);

  const genTFunc = () => {
    const STEP = 0.001;
    let t = Math.random() * 2 - 1;
    return () => {
      const initialT = t;
      t += STEP;
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

  const tFuncs = new Array(tCount).fill(true).map(() => genTFunc());
  window.requestAnimationFrame(() => go(tFuncs));
});
