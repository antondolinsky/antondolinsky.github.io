window.App = {};

const _document = document;

const elFromStr = (str) => Object.assign(_document.createElement('DIV'), {innerHTML: str.trim()}).firstChild;
const qsa = (selectors, _root) => (_root || _document).querySelectorAll(selectors);

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
		const clear = () => {
			const size = getSize();
			context.clearRect(0, 0, size.x, size.y);
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
			const data = buildEmptyData();
			for (let i = 0; i < data.length; i += 1) {
				data[i] = colorValues[i % 4];
			}
			putData(data);
		};
		return {_root, _canvas, context, getSize, setSize, getDataLength, clear, buildEmptyData, getData, putData, fill};
	},

	editorgroup: (editorDefs) => {
		const templates = {
			root: (v) => `
				<div data-component-editorgroup class="componentEditorgroup">
					<div class="componentEditorgroup-tabs" data-tabs></div>
					<div class="componentEditorgroup-controls" data-controls>
						<button class="componentEditorgroup-controls-item" data-control="back" title="Go back in this editor's history">Back</button>
						<button class="componentEditorgroup-controls-item" data-control="forw" title="Go forward in this editor's history">Forw</button>
						<button class="componentEditorgroup-controls-item" data-control="save" title="Save the current content of this editor">Save</button>
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
		const _root = elFromStr(templates.root());
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
			editor.historyIndex -= 1;
			editor._editor.value = editor.history[editor.historyIndex];
			setControlsEnabledMode();
		});
		controls._forw.addEventListener('click', (e) => {
			const editor = getTopEditor();
			editor.historyIndex += 1;
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
			const _editor = elFromStr(templates.editor({name}));
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
				history: [],
				historyIndex: null,
				get: () => editor.history[editor.history.length - 1],
				save: (str) => {
					editor.history.push(str);
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

_document.addEventListener('DOMContentLoaded', () => {

	const components = Object.keys(componentBuilders).reduce((components, key) => {
		components[key] = componentBuilders[key]();
		return components;
	}, {});

	const run = (() => {
		let on = false;
		const func = () => {
			if (on) {
				editorValues.draw(stepCount, globals, components.canv);
				setTimeout(func, 0);
			}
		};
		return {
			step: () => (on = true, func(), on = false),
			start: () => (on = true, func()),
			stop: () => on = false
		};
	})();

	const randGenerate = () => components.editorgroup.editors['draw'].save(editorValues.rand(stringify));

	const stringify = (() => {
		const recursive = (v, replaceInFuncs, tabLevel = 1) => {
			if (typeof(v) === 'object') {
				return `{\n${Object.keys(v).map((k) => `${new Array(tabLevel).fill('\t').join('')}${k}: ` +
					`${recursive(v[k], replaceInFuncs, tabLevel + 1)}`).join(',\n')}\n${new Array(tabLevel - 1).fill('\t').join('')}}`;
			} else {
				let str = v.toString();
				if (typeof(v) === 'function') {
					Object.keys(replaceInFuncs).forEach((key) => {
						str = str.replace(`/*-- ${key} --*/`, replaceInFuncs[key]);
					});
				}
				return str;
			}
		};
		return (v, replaceInFuncs = {}) => `(${recursive(v, replaceInFuncs)})`;
	})();

	components.editorgroup.addEditors(['draw', 'rand', 'conf']);

	Object.keys(components).forEach((key) => qsa(`[data-area-${key}]`)[0].appendChild(components[key]._root));

	const controls = ['step', 'strt', 'stop', 'rand'].reduce((controls, name) => {
		controls[`_${name}`] = qsa(`[data-control="${name}"]`, qsa('[data-component-controls]')[0])[0];
		return controls;
	}, {});

	const setStrtStopControlMode = (mode) => {
		controls._strt.style.display = mode ? 'initial': 'none';
		controls._stop.style.display = mode ? 'none': 'initial';
	};

	controls._step.addEventListener('click', (e) => run.step());
	controls._strt.addEventListener('click', (e) => (setStrtStopControlMode(false), run.start()));
	controls._stop.addEventListener('click', (e) => (setStrtStopControlMode(true), run.stop()));
	controls._rand.addEventListener('click', randGenerate);

	setStrtStopControlMode(true);

	const editorValues = Object.keys(components.editorgroup.editors).reduce((editorValues, key) => {
		const editor = components.editorgroup.editors[key];
		editor.onSave.push((editor) => editorValues[key] = eval(editor.get()));
		return editorValues;
	}, {});

	let stepCount, globals;

	components.editorgroup.editors['draw'].onSave.push((editor) => {
		stepCount = 0;
		globals = {};
	});

	window.App.init({
		stringify, editors: components.editorgroup.editors, canv: components.canv, randGenerate
	});

});