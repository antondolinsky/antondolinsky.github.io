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
		const setSize = (size) => {
			_canvas.width = size.x;
			_canvas.height = size.y;
			_canvas.style.width = `${size.x.toString()}px`;
			_canvas.style.height = `${size.y.toString()}px`;
			return instance;
		};
		const getDataLength = () => {
			const size = getSize();
			return size.x * size.y * 4;
		};
		const buildEmptyData = () => new Uint8ClampedArray(getDataLength());
		const getData = () => {
			const size = getSize();
			return context.getImageData(0, 0, size.x, size.y).data;
		};
		const putData = (data, size, position) => {
			const imageData = new ImageData(size.x, size.y);
			imageData.data.set(data);
			context.putImageData(imageData, position.x, position.y);
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
			{_root, _canvas, context, getSize, setSize, getDataLength, buildEmptyData, getData, putData, toDataURL, fromURL};
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
				const iface = {
					setEnabled: (mode) => {
						if (mode) {
							_button.removeAttribute('disabled');
						} else {
							_button.setAttribute('disabled', 'disabled');
						}
					}
				};
				return {_items, iface};
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
				const iface = {};
				return {_items, iface};
			}
		};
		const _root = domFromStr(templates.root())[0];
		const ifaces = {};
		const setTemplate = (html) => {
			if (_root.firstChild !== null) {
				_root.removeChild(_root.firstChild);
			}
			const parsedHtml = html
				.replace(/{{(.*?)}}/g, (match, p1) => `<div data-attachpoint="${p1}"></div>`);
			domFromStr(parsedHtml).forEach((_item) => _root.appendChild(_item));
			return instance;
		};
		const add = (items) => items.forEach(({name, type, attachPoint, opts}) => {
			const _attachElement = qsa(`[data-attachpoint="${attachPoint}"]`, _root)[0];
			const {_items, iface} = itemTypes[type](opts);
			ifaces[name] = iface;
			_items.forEach((_item) => _attachElement.parentNode.insertBefore(_item, _attachElement));
			_attachElement.parentNode.removeChild(_attachElement);
			return instance;
		});
		const instance = {_root, ifaces, setTemplate, add};
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
					<textarea class="componentEdit-editor" data-editor spellcheck="false"></textarea>
				</div>
			`,
			tab: (v) => `
				<div class="componentEdit-tabs-tab" data-name="${v.name}">
					<a class="componentEdit-tabs-tab-link" href="editor-${v.name}">${v.text}</a>
				</div>
			`
		};
		const _root = domFromStr(templates.root({literals: opts.literals}))[0];
		const _tabs = qsa('[data-tabs]', _root)[0];
		const _controls = qsa('[data-controls', _root)[0];
		const _editor = qsa('[data-editor]', _root)[0];
		const tabsArr = [];
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
				const activeEditor = editors[activeEditorName];
				setElementEnabled(controls._back,
					activeEditor.historyIndex !== null && activeEditor.historyIndex > 0);
				setElementEnabled(controls._forw,
					activeEditor.historyIndex !== null && activeEditor.historyIndex < activeEditor.history.length - 1);
			}
		};
		const controls = ['back', 'forw', 'setv'].reduce((controls, name) => {
			controls[`_${name}`] = qsa(`[data-control="${name}"]`, _controls)[0];
			return controls;
		}, {});
		controls._back.addEventListener('click', (e) => {
			const activeEditor = editors[activeEditorName];
			activeEditor.historyIndex --;
			_editor.value = activeEditor.history[activeEditor.historyIndex];
			setControlsEnabledMode();
		});
		controls._forw.addEventListener('click', (e) => {
			const activeEditor = editors[activeEditorName];
			activeEditor.historyIndex ++;
			_editor.value = activeEditor.history[activeEditor.historyIndex];
			setControlsEnabledMode();
		});
		controls._setv.addEventListener('click', (e) => {
			const activeEditor = editors[activeEditorName];
			activeEditor.set(_editor.value);
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
		let activeEditorName = null;
		const editors = [];
		const presentationAttributes = ['value', 'selectionStart', 'selectionEnd', 'scrollTop'];
		const setActiveEditor = (name) => {
			if (activeEditorName !== null) {
				const activeEditor = editors[activeEditorName];
				presentationAttributes.forEach((item) => activeEditor.presentation[item] = _editor[item]);
			}
			activeEditorName = name;
			const newActiveEditor = editors[activeEditorName];
			presentationAttributes.forEach((item) => _editor[item] = newActiveEditor.presentation[item]);
			setControlsEnabledMode();
			tabsArr.forEach((tab) => tab.classList.toggle('top', tab.dataset['name'] === activeEditorName));
			_editor.focus();
		};
		const addEditor = (name) => {
			const editor = {
				name,
				maxHistoryLength: Infinity,
				history: [],
				historyIndex: null,
				presentation: {
					value: null,
					selectionStart: null,
					selectionEnd: null,
					scrollTop: null
				},
				get: () => editor.history[editor.history.length - 1],
				set: (str) => {
					editor.history.push(str);
					if (editor.history.length > editor.maxHistoryLength) {
						editor.history.shift();
						editor.historyIndex = Math.max(0, editor.historyIndex - 1);
					}
					editor.historyIndex = editor.history.length - 1;
					setControlsEnabledMode();
					editor.presentation.value = str;
					if (name === activeEditorName) {
						_editor.value = str;
					}
					editor.onSet.forEach((item) => item(editor));
				},
				onSet: []
			};
			editors[name] = editor;
			const _tab = domFromStr(templates.tab({name, text: name.charAt(0).toUpperCase() + name.substr(1)}))[0];
			tabsArr.push(_tab);
			_tabs.appendChild(_tab);
			const _a = qsa('a', _tab)[0];
			_a.addEventListener('click', (e) => e.preventDefault());
			_tab.addEventListener('click', (e) => setActiveEditor(name));
			if (Object.keys(editors).length === 1) {
				setActiveEditor(name);
			}
		};
		const addEditors = (names) => names.forEach(addEditor);
		const getActiveEditorName = () => activeEditorName;
		const instance = {_root, editors, addEditors, getActiveEditorName};
		return instance;
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
			{{rand}}
			{{frsr}}
			{{step}}
			{{srst}}
			{{genr}}
			{{rein}}
			{{auto}}
			{{mous}}
			{{fill}}
			{{resz}}
			{{load}}
			{{save}}
		`.trim())
		.add([
			{
				name: 'rand',
				type: 'button',
				attachPoint: 'rand',
				opts: {
					initialState: 'rand',
					states: {
						rand: {
							title: window.App.literals.ctrl.randTitle,
							value: window.App.literals.ctrl.randValue,
							onClick: (setState) => {
								const wasOn = drawingLoop.on();
								drawingLoop.stop();
								drawingLoop.init();
								components.edit.editors['inpt'].set(window.App.config.initialEditorValues['inpt']);
								canvasFill(window.App.config.initialFillColorValue);
								randGenerate();
								if (wasOn) {
									drawingLoop.strt();
								}
							}
						}
					}
				}
			},
			{
				name: 'frsr',
				type: 'button',
				attachPoint: 'frsr',
				opts: {
					initialState: 'frsr',
					states: {
						frsr: {
							title: window.App.literals.ctrl.frsrTitle,
							value: window.App.literals.ctrl.frsrValue,
							onClick: (setState) => {
								const wasOn = drawingLoop.on();
								drawingLoop.stop();
								drawingLoop.init();
								components.edit.editors['inpt'].set(window.App.config.initialEditorValues['inpt']);
								canvasFill(window.App.config.initialFillColorValue);
								if (wasOn) {
									drawingLoop.strt();
								}
							}
						}
					}
				}
			},
			{
				name: 'step',
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
				name: 'srst',
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
				name: 'genr',
				type: 'button',
				attachPoint: 'genr',
				opts: {
					initialState: 'genr',
					states: {
						genr: {
							title: window.App.literals.ctrl.genrTitle,
							value: window.App.literals.ctrl.genrValue,
							onClick: (setState) => randGenerate()
						}
					}
				}
			},
			{
				name: 'rein',
				type: 'button',
				attachPoint: 'rein',
				opts: {
					initialState: 'rein',
					states: {
						rein: {
							title: window.App.literals.ctrl.reinTitle,
							value: window.App.literals.ctrl.reinValue,
							onClick: (setState) => {
								const message = window.App.literals.actions.rein.confirmMessage;
								if (window.confirm(message)) {
									drawingLoop.init();
								}
							}
						}
					}
				}
			},
			{
				name: 'auto',
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
				name: 'mous',
				type: 'button',
				attachPoint: 'mous',
				opts: {
					initialState: 'mson',
					states: {
						mson: {
							title: window.App.literals.ctrl.msonTitle,
							value: window.App.literals.ctrl.msonValue,
							onClick: (setState) => {
								setState('msof');
								canvasMousetrack.track(true);
							}
						},
						msof: {
							title: window.App.literals.ctrl.msofTitle,
							value: window.App.literals.ctrl.msofValue,
							onClick: (setState) => {
								setState('mson');
								canvasMousetrack.track(false);
							}
						}
					}
				}
			},
			{
				name: 'fill',
				type: 'button',
				attachPoint: 'fill',
				opts: {
					initialState: 'fill',
					states: {
						fill: {
							title: window.App.literals.ctrl.fillTitle,
							value: window.App.literals.ctrl.fillValue,
							onClick: (setState) => {
								const promptMessage = window.App.literals.actions.fill.promptMessage;
								const promptDefault = ['r', 'g', 'b', 'a'].map((item) =>
									window.App.config.initialFillColorValue[item].toString()).join(', ');
								const promptResStr = window.prompt(promptMessage, promptDefault);
								if (promptResStr !== null) {
									const colorValueArr = promptResStr.split(',').map((item) => item.trim()).map((item) => Number(item));
									if (colorValueArr
										.filter((item) => ! isNaN(item) && (item | 0) === item && item >= 0 && item < 256).length === 4) {
											const colorValue = {r: colorValueArr[0], g: colorValueArr[1], b: colorValueArr[2], a: colorValueArr[3]};
											canvasFill(colorValue);
									} else {
										const invalidMessage = window.App.literals.actions.fill.invalidMessage
											.replace('{{promptResStr}}', `'${promptResStr}'`);
										alert(invalidMessage);
									}
								}
							}
						}
					}
				}
			},
			{
				name: 'resz',
				type: 'button',
				attachPoint: 'resz',
				opts: {
					initialState: 'resz',
					states: {
						resz: {
							title: window.App.literals.ctrl.reszTitle,
							value: window.App.literals.ctrl.reszValue,
							onClick: (setState) => {
								const currentSize = components.canv.getSize()
								const currentSizeStr = `${currentSize.x}, ${currentSize.y}`;
								const colorValueStr = `{${['r', 'g', 'b', 'a'].map((item) =>
									`${item}: ${window.App.config.initialFillColorValue[item].toString()}`).join(', ')}}`;
								const promptMessage = window.App.literals.actions.resz.promptMessage
									.replace('{{sizeStr}}', currentSizeStr)
									.replace('{{colorValue}}', colorValueStr);
								const promptDefault = currentSizeStr;
								const promptResStr = window.prompt(promptMessage, promptDefault);
								if (promptResStr !== null) {
									const newSizeArr = promptResStr.split(',').map((item) => item.trim()).map((item) => Number(item));
									if (newSizeArr
										.filter((item) => ! isNaN(item) && (item | 0) === item && item >= 0).length === 2) {
											const newSize = {x: newSizeArr[0], y: newSizeArr[1]};
											const drawingLoopOn = drawingLoop.on();
											drawingLoop.stop();
											drawingLoop.init();
											components.canv.setSize(newSize);
											canvasFill(window.App.config.initialFillColorValue);
											if (drawingLoopOn) {
												drawingLoop.strt();
											}
									} else {
										const invalidMessage = window.App.literals.actions.resz.invalidMessage
											.replace('{{promptResStr}}', `'${promptResStr}'`);
										alert(invalidMessage);
									}
								}
							}
						}
					}
				}
			},
			{
				name: 'load',
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
				name: 'save',
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
		let timeoutID = null;
		const func = () => {
			if (on === true) {
				drawingLoop.hndl.forEach((item) => item(drawingLoop));
				const drawFunc = editorValues['draw'];
				drawFunc(drawingLoop.stepCount ++, drawingLoop.globals, components.canv, editorValues['inpt']);
				timeoutID = setTimeout(func, 0);
			}
			if (on === false) {
				if (timeoutID !== null) {
					clearTimeout(timeoutID);
					timeoutID = null;
				}
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
			stop: () => (on = false, func())
		};
		drawingLoop.stop();
		drawingLoop.init();
		return drawingLoop;
	})();

	const autoRand = (() => {
		let steps = null;
		const handler = () => {
			if (steps === null) {
				const autoRandInterval = confValRes.autoRandInterval;
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

	const canvasMousetrack = (() => {
		const _canvas = components.canv._canvas;
		const propagate = (type, e) => {
			const {left, top, width, height} = _canvas.getBoundingClientRect();
			const position = {
				x: ((e.clientX - left) / width) * 2 - 1,
				y: ((e.clientY - top) / height) * 2 - 1
			};
			canvasMousetrack.handlers.forEach((item) => item(type, position));
		};
		const listenerTypes = ['mousedown', 'mouseup', 'mousemove'];
		const listeners = listenerTypes.reduce((listeners, item) =>
			(listeners[item] = (e) => propagate(item, e), listeners), {});
		const canvasMousetrack = {
			track: (mode) => {
				listenerTypes.forEach((item) =>
					_canvas[mode ? 'addEventListener' : 'removeEventListener'](item, listeners[item]));
				_canvas.classList.toggle('mousetracking', mode);
			},
			handlers: []
		};
		return canvasMousetrack;
	})();

	const canvasFill = (colorValue) => {
		const colorValueArr = [colorValue.r, colorValue.g, colorValue.b, colorValue.a];
		const data = components.canv.buildEmptyData();
		for (let i = 0; i < data.length; i ++) {
			data[i] = colorValueArr[i % 4];
		}
		components.canv.putData(data, components.canv.getSize(), {x: 0, y: 0});
	};

	const randGenerate = () => components.edit.editors['draw'].set(editorValues['genr']());

	components.edit.addEditors(['inpt', 'draw', 'genr', 'conf']);

	Object.keys(components).forEach((key) => qsa(`[data-area-${key}]`)[0].appendChild(components[key]._root));

	const editorValues = Object.keys(components.edit.editors).reduce((editorValues, key) => {
		const editor = components.edit.editors[key];
		editor.onSet.push((editor) => {
			const editorStr = editor.get();
			try {
				const evalRes = eval(editorStr);
				editorValues[key] = evalRes;
			} catch (err) {
				editorValues[key] = null;
				const alertMessage = window.App.literals.editorValuesInvalidMessage
					.replace('{{err}}', err.toString());
				alert(alertMessage);
			}
		});
		return editorValues;
	}, {});

	let confValRes;

	components.edit.editors['draw'].onSet.push((editor) => ['step', 'srst'].forEach((item) =>
		components.ctrl.ifaces[item].setEnabled(editorValues['draw'] !== null)));

	components.edit.editors['draw'].onSet.push((editor) => drawingLoop.init());

	components.edit.editors['genr'].onSet.push((editor) => ['genr'].forEach((item) =>
		components.ctrl.ifaces[item].setEnabled(editorValues['genr'] !== null)));

	components.edit.editors['conf'].onSet.push((editor) => confValRes = editorValues['conf']());

	components.edit.editors['conf'].onSet.push((editor) =>
		Object.values(components.edit.editors)
			.forEach((editor) => editor.maxHistoryLength = confValRes.editorsMaxHistoryLength[editor.name]));

	components.canv.setSize(window.App.config.initialCanvasSize);

	Object.keys(window.App.config.initialEditorValues)
		.forEach((item) => {
			if (window.App.config.initialEditorValues[item] !== null) {
				components.edit.editors[item].set(window.App.config.initialEditorValues[item]);
			}
		});

	canvasMousetrack.handlers.push((() => {
		let mouseIsDown = false;
		return (type, position) => {
			if (type === 'mouseup') {
				mouseIsDown = false;
			}
			if (type === 'mousedown') {
				mouseIsDown = true;
			}
			if (type === 'mouseup' || type === 'mousedown' || (type === 'mousemove' && mouseIsDown)) {
				const newInptStr = confValRes.mouseInputHandler(position, editorValues['inpt']);
				components.edit.editors['inpt'].set(newInptStr);
			}
		}
	})());

	canvasFill(window.App.config.initialFillColorValue);

	randGenerate();

});