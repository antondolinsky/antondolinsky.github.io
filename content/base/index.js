const rafWrap = (cb, args) => {
  const go = () => {
    args = cb(args);
    window.requestAnimationFrame(go);
  };
  window.requestAnimationFrame(go);
};

window.addEventListener('DOMContentLoaded', () => {
  const defaults = {
    canvSize: 600,
    depth: 32,
    width: 16
  };

  const options = { ...defaults };

  options.f = new Float32Array(options.depth * options.width * (options.width + 1)).map(() => Math.random() * 2 - 1);

  const kernelSource = new Function(`
let depth = ${options.depth};
let width = ${options.width};
let x = (this.thread.x / this.output.x) * 2 - 1;
let y = (this.thread.y / this.output.y) * 2 - 1;
${new Array(options.f.length).fill(true).map((e, fIndex) => `let f${fIndex} = ${options.f[fIndex]};`).join('')}
${new Array(options.width).fill(true).map((e, iIndex) => `let i${iIndex} = 0;`).join('')}
${new Array(options.width).fill(true).map((e, oIndex) => `let o${oIndex} = 0;`).join('')}
${new Array(options.width).fill(true).map((e, iIndex) => `i${iIndex} = ${Math.random() < 0.5 ? 'x' : 'y'};`).join('')}
${new Array(options.depth).fill(true).map((e, lIndex) =>
  `${new Array(options.width).fill(true).map((e, oIndex) =>
    `o${oIndex} = Math.tanh(${new Array(options.width).fill(true).map((e, iIndex) =>
      `i${iIndex} * f${lIndex * options.width * (options.width + 1) + oIndex * (options.width + 1) + iIndex}`).join(' + ')} + f${lIndex * options.width * (options.width + 1) + oIndex * (options.width + 1) + options.width});`
  ).join('\n')}
${new Array(options.width).fill(true).map((e, index) => `i${index} = o${index};`).join('')}`
).join('')}
this.color((o0 + 1) / 2, (o1 + 1) / 2, (o2 + 1) / 2, 1);
  `);

  console.log({ options, kernelSource });

  const gpu = new GPU();

  const kernel = gpu.createKernel(kernelSource)
    .setOutput([options.canvSize, options.canvSize])
    .setGraphical(true);

  rafWrap(() => {
    kernel();
    document.body.firstChild && document.body.firstChild.remove();
    document.body.appendChild(kernel.canvas);
  });
});
