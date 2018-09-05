window.App = {};

const elFromStr = (str) => Object.assign(document.createElement('DIV'), {innerHTML: str.trim()}).firstChild;
const qsa = (selectors, _root) => (_root || document).querySelectorAll(selectors);

const componentBuilders = {

	canv: () => {
		const templates = {
			root: (v) => `<div data-component-canv class="componentCanv">
				<canvas class="componentCanv-canvas" data-canvas></canvas>
			</div>`
		};
		const _root = elFromStr(templates.root());
		const _canvas = qsa('[data-canvas]', _root)[0];
		const context = _canvas.getContext('2d');
		const getSize = () => ({x: _canvas.width, y: _canvas.height});
		const setSize = (size) => (_canvas.width = _canvas.style.width = size.x, _canvas.height = _canvas.style.height = size.y);
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
		};
		const fill = (colorValues) => {
			const colorValuesArr = [colorValues.r, colorValues.g, colorValues.b, colorValues.a];
			const data = buildEmptyData();
			for (let i = 0; i < data.length; i ++) {
				data[i] = colorValuesArr[i % 4];
			}
			putData(data);
		};
		return {_root, _canvas, context, getSize, setSize, getDataLength, buildEmptyData, getData, putData, fill};
	},

	editorgroup: (editorDefs) => {
		const templates = {
			root: (v) => `
				<div data-component-editorgroup class="componentEditorgroup">
					<div class="componentEditorgroup-tabs" data-tabs></div>
					<div class="componentEditorgroup-controls" data-controls>
						<button class="componentEditorgroup-controls-item" data-control="back"
							title="${v.literals.backTitle}">${v.literals.backValue}</button>
						<button class="componentEditorgroup-controls-item" data-control="forw"
							title="${v.literals.forwTitle}">${v.literals.forwValue}</button>
						<button class="componentEditorgroup-controls-item" data-control="save"
							title="${v.literals.saveTitle}">${v.literals.saveValue}</button>
					</div>
					<div class="componentEditorgroup-editors" data-editors></div>
				</div>
			`,
			tab: (v) => `
				<div class="componentEditorgroup-tabs-tab" data-name="${v.name}">
					<a class="componentEditorgroup-tabs-tab-link" href="editor-${v.name}">${v.text}</a>
				</div>
			`,
			editor: (v) => `
				<textarea class="componentEditorgroup-editors-editor" data-name="${v.name}"></textarea>
			`
		};
		const _root = elFromStr(templates.root({literals: window.App.literals.templates.editorgroup.root}));
		const _tabs = qsa('[data-tabs]', _root)[0];
		const _controls = qsa('[data-controls', _root)[0];
		const _editors = qsa('[data-editors]', _root)[0];
		const tabsArr = [], editorsArr = [];
		const getTopEditor = () => editors[qsa('[data-top]', _editors)[0].dataset.name];
		const setControlsEnabledMode = () => {
			if (_editors.length === 0) {
				Object.keys(controls).forEach((key) => controls[key].disabled = true);
			} else {
				const editor = getTopEditor();
				controls._back.disabled = ! (editor.historyIndex !== null && editor.historyIndex > 0);
				controls._forw.disabled = ! (editor.historyIndex !== null && editor.historyIndex < editor.history.length - 1);
			}
		};
		const controls = ['back', 'forw', 'save'].reduce((controls, name) => {
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
		controls._save.addEventListener('click', (e) => {
			const editor = getTopEditor();
			editor.save(editor._editor.value);
		});
		const editors = [];
		const addEditor = (name) => {
			const _tab = elFromStr(templates.tab({name, text: name.charAt(0).toUpperCase() + name.substr(1)}));
			const _editor = Object.assign(elFromStr(templates.editor({name})), {
				spellcheck: false
			});
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
			    const start = _editor.selectionStart, end = _editor.selectionEnd;
			    _editor.value = _editor.value.substring(0, start) + '\t' + _editor.value.substring(end);
			    _editor.selectionStart = _editor.selectionEnd = start + 1;
				}
			});
			const editor = {
				name,
				_editor,
				maxHistoryLength: Infinity,
				history: [],
				historyIndex: null,
				get: () => editor.history[editor.history.length - 1],
				save: (str) => {
					editor.history.push(str);
					if (editor.history.length > editor.maxHistoryLength) {
						editor.history.shift();
						editor.historyIndex = Math.max(0, editor.historyIndex - 1);
					}
					editor.historyIndex = editor.history.length - 1;
					_editor.value = str;
					setControlsEnabledMode();
					editor.onSave.forEach((item) => item(editor));
				},
				onSave: []
			};
			editors[name] = editor;
			setControlsEnabledMode();
		};
		const addEditors = (names) => names.forEach(addEditor);
		return {_root, editors, addEditors};
	}

};

document.addEventListener('DOMContentLoaded', () => {

	const components = Object.keys(componentBuilders)
		.reduce((components, key) => (components[key] = componentBuilders[key](), components), {});

	const drawingLoop = (() => {
		let on;
		let stepCount, globals;
		const func = () => {
			if (on) {
				const drawFunc = editorValues['draw'];
				drawFunc(stepCount ++, globals, components.canv);
				setTimeout(func, 0);
			}
		};
		const drawingLoop = {
			init: () => (stepCount = 0, globals = {}),
			step: () => (on = true, func(), on = false),
			start: () => (on = true, func()),
			stop: () => on = false
		};
		drawingLoop.stop();
		drawingLoop.init();
		return drawingLoop;
	})();

	const canvasFill = () => {
		components.canv.fill(editorValues['conf']().clearingFill);
	};

	const randGenerate = () => components.editorgroup.editors['draw'].save(editorValues['rand'](stringify));

	const actionReinit = () => {
		const message = window.App.literals.actions.reinit.confirmMessage;
		if (window.confirm(message)) {
			drawingLoop.init();
		}
	};

	const actionClear = () => {
		const clearingFill = editorValues['conf']().clearingFill;
		const colorStr = `{r: ${clearingFill.r.toString()}, g: ${clearingFill.g.toString()}, ` +
			`b: ${clearingFill.b.toString()}, a: ${clearingFill.a.toString()}}`;
		const message = window.App.literals.actions.clear.confirmMessage.replace('{{colorStr}}', colorStr);
		if (window.confirm(message)) {
			canvasFill();
		}
	};

	const actionResize = () => {
		const invalid = () => alert(window.App.literals.actions.resize.invalidMessage);
		const size = components.canv.getSize()
		const sizeStr = `${size.x}, ${size.y}`;
		const message = window.App.literals.actions.resize.promptMessage.replace('{{sizeStr}}', sizeStr);
		const def = sizeStr;
		const promptResStr = window.prompt(message, def);
		if (! promptResStr) {
			invalid();
		} else {
			const newSizeArr = promptResStr.split(',').map((item) => item.trim()).map((item) => Number(item));
			const newSize = {x: newSizeArr[0], y: newSizeArr[1]};
			if (isNaN(newSize.x) || isNaN(newSize.y)) {
				invalid();
			} else {
				drawingLoop.init();
				components.canv.setSize(newSize);
				canvasFill();
			}
		}
	};

	const stringify = (() => {
		const recursive = (v, replaceInFuncs, tabLevel = 1) =>
			typeof(v) === 'object' ?
				`{\n${Object.keys(v).map((k) => `${new Array(tabLevel).fill('\t').join('')}${k}: ` +
					`${recursive(v[k], replaceInFuncs, tabLevel + 1)}`).join(',\n')}\n${new Array(tabLevel - 1).fill('\t').join('')}}` :
				v.toString();
		return (v, replaceInFuncs = {}) => `(${recursive(v, replaceInFuncs)})`;
	})();

	components.editorgroup.addEditors(['draw', 'rand', 'conf']);

	Object.keys(components).forEach((key) => qsa(`[data-area-${key}]`)[0].appendChild(components[key]._root));

	const controls = ['step', 'strt', 'stop', 'rand', 'rein', 'cler', 'resz'].reduce((controls, name) => {
		controls[`_${name}`] = qsa(`[data-control="${name}"]`, qsa('[data-component-controls]')[0])[0];
		return controls;
	}, {});

	const setStrtStopControlMode = (mode) => {
		controls._strt.style.display = mode ? 'initial': 'none';
		controls._stop.style.display = mode ? 'none': 'initial';
	};

	controls._step.addEventListener('click', (e) => drawingLoop.step());
	controls._strt.addEventListener('click', (e) => (setStrtStopControlMode(false), drawingLoop.start()));
	controls._stop.addEventListener('click', (e) => (setStrtStopControlMode(true), drawingLoop.stop()));
	controls._rand.addEventListener('click', (e) => randGenerate());
	controls._rein.addEventListener('click', (e) => actionReinit());
	controls._cler.addEventListener('click', (e) => actionClear());
	controls._resz.addEventListener('click', (e) => actionResize());

	setStrtStopControlMode(true);

	const editorValues = Object.keys(components.editorgroup.editors).reduce((editorValues, key) => {
		const editor = components.editorgroup.editors[key];
		editor.onSave.push((editor) => editorValues[key] = eval(editor.get()));
		return editorValues;
	}, {});

	components.editorgroup.editors['draw'].onSave.push((editor) => drawingLoop.init());

	components.editorgroup.editors['conf'].onSave.push((editor) =>
		Object.values(components.editorgroup.editors)
			.forEach((editor) => editor.maxHistoryLength = editorValues['conf']().editorsMaxHistoryLength));

	components.canv.setSize(window.App.config.initialCanvasSize);

	window.App.init({
		stringify, editors: components.editorgroup.editors, canv: components.canv, canvasFill, randGenerate
	});

});