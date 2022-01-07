const fill = (length) => (cb) => new Array(length).fill(true).map((item, index) => cb(index));

const getKernelCoreStr = ({ width, depth, f, inputMap }) => `
  ${fill(f.length)((fIndex) => `let f${fIndex} = ${f[fIndex]};`).join('')}
  ${fill(width)((iIndex) => `let i${iIndex} = 0;`).join('')}
  ${fill(width)((oIndex) => `let o${oIndex} = 0;`).join('')}
  ${fill(width)((iIndex) => `i${iIndex} = ${inputMap[iIndex]};`).join('')}
  ${fill(depth)((lIndex) =>
    `${fill(width)((oIndex) =>
      `o${oIndex} = Math.tanh(${fill(width)((iIndex) =>
        `i${iIndex} * f${lIndex * width * (width + 1) + oIndex * (width + 1) + iIndex}`).join(' + ')} + f${lIndex * width * (width + 1) + oIndex * (width + 1) + width});`
    ).join('\n')}
    ${fill(width)((index) => `i${index} = o${index};`).join('')}`
  ).join('')}
`;

const animation = (cb) => {
  let running = false;
  let time = 0;
  const go = () => {
    if (running) {
      cb(time);
      time += 1;
      window.requestAnimationFrame(go);
    }
  };
  return {
    start: () => {
      running = true;
      window.requestAnimationFrame(go);
    },
    stop: () => {
      running = false;
    }
  };
};

const data = {
  canvSize: 600,
  depth: 32,
  width: 16,
  tCount: 8,
  tChance: 0.5,
  fMax: 1000,    
  step: 0.000001,
  timeFunc: (data, time) => data.tsDefinition.map(({ f, a, p }) => {
    return Math.cos((f * data.fMax) * ((((((data.step * time) % 1) + p) % 1) * 2 - 1) * Math.PI)) * a;
  })
};

data.tsDefinition = new Array(data.tCount).fill(true).map(() => ({ f: Math.random(), p: Math.random(), a: Math.random() }));
data.f = new Float32Array(data.depth * data.width * (data.width + 1)).map(() => Math.random() * 2 - 1);
data.inputMap = fill(data.width)(() => Math.random() < data.tChance ? `$[${Math.floor(Math.random() * data.tCount)}]` : ['x', 'y'][Math.floor(Math.random() * 2)]);

data.k = new Function('$', `
let x = (this.thread.x / this.output.x) * 2 - 1;
let y = (this.thread.y / this.output.y) * 2 - 1;
${getKernelCoreStr(data)}
this.color((o0 + 1) / 2, (o1 + 1) / 2, (o2 + 1) / 2, 1);
`);

console.log(data);

const render = new GPU().createKernel(data.k)
  .setOutput([data.canvSize, data.canvSize])
  .setGraphical(true);

const cb = (time) => {
  const $ = data.timeFunc(data, time);
  render($);
  document.body.firstChild && document.body.firstChild.remove();
  document.body.appendChild(render.canvas);
};

window.addEventListener('DOMContentLoaded', () => animation(cb).start());
