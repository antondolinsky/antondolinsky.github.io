window.App = {};

const domFromStr = (str) => Object.assign(document.createElement('DIV'), {innerHTML: str.trim()}).childNodes;
const qsa = (selectors, _root) => (_root || document).querySelectorAll(selectors);

const componentBuilders = {

	canv: (opts) => {
		const templates = {
			root: (v) => `<div data-component-canv class="componentCanv">
				<canvas class="componentCanv-canvas" data-canvas></canvas>
			</div>`
		};
		const _root = domFromStr(templates.root())[0];
		const _canvas = qsa('[data-canvas]', _root)[0];
		const context = _canvas.getContext('2d');
		const getSize = () => ({x: _canvas.width, y: _canvas.height});
		const setSize = (size) =>
			(_canvas.width = _canvas.style.width = size.x, _canvas.height = _canvas.style.height = size.y, instance);
		const getDataLength = () => {
			const size = getSize();
			return size.x * size.y * 4;
		};
		const buildEmptyData = () => new Uint8ClampedArray(getDataLength());
		const getData = () => {
			const size = getSize();
			return context.getImageData(0, 0, size.x, size.y).data;
		};
		const putData = (data) => {
			const size = getSize();
			const imageData = new ImageData(size.x, size.y);
			imageData.data.set(data);
			context.putImageData(imageData, 0, 0);
			return instance;
		};
		const fill = (colorValues) => {
			const colorValuesArr = [colorValues.r, colorValues.g, colorValues.b, colorValues.a];
			const data = buildEmptyData();
			for (let i = 0; i < data.length; i ++) {
				data[i] = colorValuesArr[i % 4];
			}
			putData(data);
			return instance;
		};
		const toDataURL = (type, encoderOptions) => _canvas.toDataURL(type, encoderOptions);
		const fromURL = (url) => new Promise((resolve) => {
			const image = new Image();
			image.addEventListener('load', (e) => {
				setSize({x: image.width, y: image.height});
				context.drawImage(image, 0, 0);
				resolve();
			});
			image.src = url;
		});
		const instance =
			{_root, _canvas, context, getSize, setSize, getDataLength, buildEmptyData, getData, putData, fill, toDataURL, fromURL};
		return instance;
	},

	ctrl: (opts) => {
		const templates = {
			root: (v) => `
				<div data-component-ctrl class="componentCtrl"></div>
			`,
			button: (v) => `
				<button class="componentCtrl-button"></button>
			`,
			fileInput: (v) => `
				<input type="file" style="display:none;" />
				<button class="componentCtrl-button"></button>
			`
		};
		const itemTypes = {
			button: (opts) => {
				const _items = domFromStr(templates.button());
				const {0: _button} = _items;
				_button.addEventListener('click', (e) => {
					const currState = _button.dataset['state'];
					opts.states[currState].onClick(setState);
				});
				const setState = (state) => {
					const stateOpts = opts.states[state];
					_button.setAttribute('data-state', state.toString());
					_button.setAttribute('title', stateOpts.title);
					_button.innerHTML = stateOpts.value;
				}
				setState(opts.initialState);
				return _items;
			},
			fileInput: (opts) => {
				const _items = domFromStr(templates.fileInput());
				const {0: _input, 2: _button} = _items;
				_button.setAttribute('title', opts.title);
				_button.innerHTML = opts.value;
				_button.addEventListener('click', (e) => _input.click());
				_input.addEventListener('change', (e) => {
				  const reader = new FileReader();
				  reader.onload = (e) => {
				  	_input.value = '';
				  	opts.onLoad(e.target.result);
				  };
				  const method = {
				  	arrayBuffer: 'readAsArrayBuffer',
				  	binaryString: 'readAsBinaryString',
				  	dataURL: 'readAsDataURL',
				  	test: 'readAsText'
				  }[opts.method];
				  reader[method](_input.files[0]);
				});
				return _items;
			}
		};
		const _root = domFromStr(templates.root())[0];
		const setTemplate = (html) => {
			if (_root.firstChild !== null) {
				_root.removeChild(_root.firstChild);
			}
			const parsedHtml = html.replace(/{{(.*?)}}/g, (match, p1) => `<div data-attachpoint="${p1}"></div>`);
			domFromStr(parsedHtml).forEach((_item) => _root.appendChild(_item));
			return instance;
		};
		const add = (items) => items.forEach(({type, attachPoint, opts}) => {
			const _attachElement = qsa(`[data-attachpoint="${attachPoint}"]`, _root)[0];
			const _items = itemTypes[type](opts);
			_items.forEach((_item) => _attachElement.parentNode.insertBefore(_item, _attachElement));
			_attachElement.parentNode.removeChild(_attachElement);
			return instance;
		});
		const instance = {_root, setTemplate, add};
		return instance;
	},

	edit: (opts) => {
		const templates = {
			root: (v) => `
				<div data-component-edit class="componentEdit">
					<div class="componentEdit-tabs" data-tabs></div>
					<div class="componentEdit-controls" data-controls>
						<button class="componentEdit-controls-item" data-control="back"
							title="${v.literals.backTitle}">${v.literals.backValue}</button>
						<button class="componentEdit-controls-item" data-control="forw"
							title="${v.literals.forwTitle}">${v.literals.forwValue}</button>
						<button class="componentEdit-controls-item" data-control="setv"
							title="${v.literals.setvTitle}">${v.literals.setvValue}</button>
					</div>
					<div class="componentEdit-editors" data-editors></div>
				</div>
			`,
			tab: (v) => `
				<div class="componentEdit-tabs-tab" data-name="${v.name}">
					<a class="componentEdit-tabs-tab-link" href="editor-${v.name}">${v.text}</a>
				</div>
			`,
			editor: (v) => `
				<textarea class="componentEdit-editors-editor" data-name="${v.name}"></textarea>
			`
		};
		const _root = domFromStr(templates.root({literals: opts.literals}))[0];
		const _tabs = qsa('[data-tabs]', _root)[0];
		const _controls = qsa('[data-controls', _root)[0];
		const _editors = qsa('[data-editors]', _root)[0];
		const tabsArr = [], editorsArr = [];
		const getTopEditor = () => editors[qsa('[data-top]', _editors)[0].dataset.name];
		const setElementEnabled = (_element, mode) => {
			if (mode) {
				_element.removeAttribute('disabled');
			} else {
				_element.setAttribute('disabled', 'disabled');
			}
		};
		const setControlsEnabledMode = () => {
			if (Object.keys(editors).length === 0) {
				Object.keys(controls).forEach((key) => setElementEnabled(controls[key], false));
			} else {
				const editor = getTopEditor();
				setElementEnabled(controls._back, editor.historyIndex !== null && editor.historyIndex > 0);
				setElementEnabled(controls._forw, editor.historyIndex !== null && editor.historyIndex < editor.history.length - 1);
			}
		};
		const controls = ['back', 'forw', 'setv'].reduce((controls, name) => {
			controls[`_${name}`] = qsa(`[data-control="${name}"]`, _controls)[0];
			return controls;
		}, {});
		controls._back.addEventListener('click', (e) => {
			const editor = getTopEditor();
			editor.historyIndex --;
			editor._editor.value = editor.history[editor.historyIndex];
			setControlsEnabledMode();
		});
		controls._forw.addEventListener('click', (e) => {
			const editor = getTopEditor();
			editor.historyIndex ++;
			editor._editor.value = editor.history[editor.historyIndex];
			setControlsEnabledMode();
		});
		controls._setv.addEventListener('click', (e) => {
			const editor = getTopEditor();
			editor.set(editor._editor.value);
		});
		const editors = [];
		const addEditor = (name) => {
			const _tab = domFromStr(templates.tab({name, text: name.charAt(0).toUpperCase() + name.substr(1)}))[0];
			const _editor = domFromStr(templates.editor({name}))[0];
			_editor.setAttribute('spellcheck', 'false');
			if (editorsArr.length === 0) {
				_tab.classList.add('top');
				_editor.classList.add('top');
				_tab.dataset['top'] = '';
				_editor.dataset['top'] = '';
			}
			tabsArr.push(_tab);
			editorsArr.push(_editor);
			_tabs.appendChild(_tab);
			_editors.appendChild(_editor);
			const _a = qsa('a', _tab)[0];
			_a.addEventListener('click', (e) => e.preventDefault());
			_tab.addEventListener('click', (e) => {
				tabsArr.forEach((_tab2) => {
					const isTop = _tab === _tab2;
					_tab2.classList.toggle('top', isTop);
					if (isTop) {
						_tab2.dataset['top'] = '';
					} else {
						delete _tab2.dataset['top'];
					}
				});
				editorsArr.forEach((_editor) => {
					const isTop = _tab.dataset.name === _editor.dataset.name;
					_editor.classList.toggle('top', isTop);
					if (isTop) {
						_editor.dataset['top'] = '';
					} else {
						delete _editor.dataset['top'];
					}
				});
				setControlsEnabledMode();
			});
			_editor.addEventListener('keydown', (e) => {
			  if (! e.shiftKey && e.keyCode === 9) {
			    e.preventDefault();
			    const start = Number(_editor.selectionStart),
			    			end = Number(_editor.selectionEnd);
			    _editor.value = _editor.value.substring(0, start) + '\t' + _editor.value.substring(end);
			    _editor.selectionStart = (start + 1).toString();
			    _editor.selectionEnd = (start + 1).toString();
				}
			});
			const editor = {
				name,
				_editor,
				maxHistoryLength: Infinity,
				history: [],
				historyIndex: null,
				get: () => editor.history[editor.history.length - 1],
				set: (str) => {
					editor.history.push(str);
					if (editor.history.length > editor.maxHistoryLength) {
						editor.history.shift();
						editor.historyIndex = Math.max(0, editor.historyIndex - 1);
					}
					editor.historyIndex = editor.history.length - 1;
					_editor.value = str;
					setControlsEnabledMode();
					editor.onSet.forEach((item) => item(editor));
				},
				onSet: []
			};
			editors[name] = editor;
			setControlsEnabledMode();
		};
		const addEditors = (names) => names.forEach(addEditor);
		return {_root, editors, addEditors};
	}

};

document.addEventListener('DOMContentLoaded', () => {

	const components = {
		canv: componentBuilders.canv(),
		ctrl: componentBuilders.ctrl(),
		edit: componentBuilders.edit({literals: window.App.literals.edit})
	};

	components.ctrl
		.setTemplate(`
			{{step}}
			{{srst}}
			{{rand}}
			{{rein}}
			{{auto}}
			{{cler}}
			{{resz}}
			{{load}}
			{{save}}
		`.trim())
		.add([
			{
				type: 'button',
				attachPoint: 'step',
				opts: {
					initialState: 'step',
					states: {
						step: {
							title: window.App.literals.ctrl.stepTitle,
							value: window.App.literals.ctrl.stepValue,
							onClick: (setState) => drawingLoop.step()
						}
					}
				}
			},
			{
				type: 'button',
				attachPoint: 'srst',
				opts: {
					initialState: 'strt',
					states: {
						strt: {
							title: window.App.literals.ctrl.strtTitle,
							value: window.App.literals.ctrl.strtValue,
							onClick: (setState) => (drawingLoop.strt(), setState('stop'))
						},
						stop: {
							title: window.App.literals.ctrl.stopTitle,
							value: window.App.literals.ctrl.stopValue,
							onClick: (setState) => (drawingLoop.stop(), setState('strt'))
						}
					}
				}
			},
			{
				type: 'button',
				attachPoint: 'rand',
				opts: {
					initialState: 'rand',
					states: {
						rand: {
							title: window.App.literals.ctrl.randTitle,
							value: window.App.literals.ctrl.randValue,
							onClick: (setState) => randGenerate()
						}
					}
				}
			},
			{
				type: 'button',
				attachPoint: 'rein',
				opts: {
					initialState: 'rein',
					states: {
						rein: {
							title: window.App.literals.ctrl.reinTitle,
							value: window.App.literals.ctrl.reinValue,
							onClick: (setState) => {
								const message = window.App.literals.actions.reinit.confirmMessage;
								if (window.confirm(message)) {
									drawingLoop.init();
								}
							}
						}
					}
				}
			},
			{
				type: 'button',
				attachPoint: 'auto',
				opts: {
					initialState: 'auon',
					states: {
						auon: {
							title: window.App.literals.ctrl.auonTitle,
							value: window.App.literals.ctrl.auonValue,
							onClick: (setState) => {
								setState('auof');
								autoRand.on();
							}
						},
						auof: {
							title: window.App.literals.ctrl.auofTitle,
							value: window.App.literals.ctrl.auofValue,
							onClick: (setState) => {
								setState('auon');
								autoRand.off();
							}
						}
					}
				}
			},
			{
				type: 'button',
				attachPoint: 'cler',
				opts: {
					initialState: 'cler',
					states: {
						cler: {
							title: window.App.literals.ctrl.clerTitle,
							value: window.App.literals.ctrl.clerValue,
							onClick: (setState) => {
								const clearingFill = editorValues['conf']().clearingFill;
								const colorStr = `{r: ${clearingFill.r.toString()}, g: ${clearingFill.g.toString()}, ` +
									`b: ${clearingFill.b.toString()}, a: ${clearingFill.a.toString()}}`;
								const message = window.App.literals.actions.clear.confirmMessage.replace('{{colorStr}}', colorStr);
								if (window.confirm(message)) {
									canvasFill();
								}
							}
						}
					}
				}
			},
			{
				type: 'button',
				attachPoint: 'resz',
				opts: {
					initialState: 'resz',
					states: {
						resz: {
							title: window.App.literals.ctrl.reszTitle,
							value: window.App.literals.ctrl.reszValue,
							onClick: (setState) => {
								const invalid = () => alert(window.App.literals.actions.resize.invalidMessage);
								const size = components.canv.getSize()
								const sizeStr = `${size.x}, ${size.y}`;
								const message = window.App.literals.actions.resize.promptMessage.replace('{{sizeStr}}', sizeStr);
								const def = sizeStr;
								const promptResStr = window.prompt(message, def);
								if (promptResStr) {
									const newSizeArr = promptResStr.split(',').map((item) => item.trim()).map((item) => Number(item));
									if (newSizeArr.length !== 2) {
										invalid();
									} else {
										const newSize = {x: newSizeArr[0], y: newSizeArr[1]};
										if (isNaN(newSize.x) || isNaN(newSize.y)) {
											invalid();
										} else {
											drawingLoop.init();
											components.canv.setSize(newSize);
											canvasFill();
										}
									}
								}
							}
						}
					}
				}
			},
			{
				type: 'fileInput',
				attachPoint: 'load',
				opts: {
					title: window.App.literals.ctrl.loadTitle,
					value: window.App.literals.ctrl.loadValue,
					method: 'dataURL',
					onLoad: (result) => {
						const wasOn = drawingLoop.on();
						drawingLoop.stop();
						drawingLoop.init();
						components.canv.fromURL(result).then(() => {
							if (wasOn) {
								drawingLoop.strt();
							}
						});
					}
				}
			},
			{
				type: 'button',
				attachPoint: 'save',
				opts: {
					initialState: 'save',
					states: {
						save: {
							title: window.App.literals.ctrl.saveTitle,
							value: window.App.literals.ctrl.saveValue,
							onClick: (setState) => {
								const dataURL = components.canv.toDataURL('image/png', 1);
								const _a = domFromStr(`<a></a>`)[0];
								_a.href = dataURL;
								_a.download = window.App.literals.actions.save.filename;
								_a.click();
							}
						}
					}
				}
			}
		]);

	const drawingLoop = (() => {
		let on;
		const func = () => {
			if (on) {
				drawingLoop.hndl.forEach((item) => item(drawingLoop));
				const drawFunc = editorValues['draw'];
				drawFunc(drawingLoop.stepCount ++, drawingLoop.globals, components.canv);
				setTimeout(func, 0);
			}
		};
		const drawingLoop = {
			on: () => on,
			stepCount: null,
			globals: null,
			hndl: [],
			init: () => (drawingLoop.stepCount = 0, drawingLoop.globals = {}),
			step: () => (on = true, func(), on = false),
			strt: () => (on = true, func()),
			stop: () => on = false
		};
		drawingLoop.stop();
		drawingLoop.init();
		return drawingLoop;
	})();

	const autoRand = (() => {
		let steps = null;
		const handler = () => {
			if (steps === null) {
				const autoRandInterval = editorValues['conf']().autoRandInterval;
				steps = Math.floor(Math.random() * (autoRandInterval.max - autoRandInterval.min)) + autoRandInterval.min;
			}
			if (steps === 0) {
				randGenerate();
				steps = null;
			} else {
				steps --;
			}
		};
		const autoRand = {
			on: () => drawingLoop.hndl.push(handler),
			off: () => (steps = null, drawingLoop.hndl.splice(drawingLoop.hndl.indexOf(handler), 1))
		};
		return autoRand;
	})();

	const canvasFill = () => {
		components.canv.fill(editorValues['conf']().clearingFill);
	};

	const randGenerate = () => components.edit.editors['draw'].set(editorValues['rand'](stringify));

	const stringify = (() => {
		const recursive = (v, replaceInFuncs, tabLevel = 1) =>
			typeof(v) === 'object' ?
				`{\n${Object.keys(v).map((k) => `${new Array(tabLevel).fill('\t').join('')}${k}: ` +
					`${recursive(v[k], replaceInFuncs, tabLevel + 1)}`).join(',\n')}\n${new Array(tabLevel - 1).fill('\t').join('')}}` :
				v.toString();
		return (v, replaceInFuncs = {}) => `(${recursive(v, replaceInFuncs)})`;
	})();

	components.edit.addEditors(['draw', 'rand', 'conf']);

	Object.keys(components).forEach((key) => qsa(`[data-area-${key}]`)[0].appendChild(components[key]._root));

	const editorValues = Object.keys(components.edit.editors).reduce((editorValues, key) => {
		const editor = components.edit.editors[key];
		editor.onSet.push((editor) => editorValues[key] = eval(editor.get()));
		return editorValues;
	}, {});

	components.edit.editors['draw'].onSet.push((editor) => drawingLoop.init());

	components.edit.editors['conf'].onSet.push((editor) =>
		Object.values(components.edit.editors)
			.forEach((editor) => editor.maxHistoryLength = editorValues['conf']().editorsMaxHistoryLength));

	components.canv.setSize(window.App.config.initialCanvasSize);

	window.App.init({
		stringify, editors: components.edit.editors, canv: components.canv, canvasFill, randGenerate
	});

});