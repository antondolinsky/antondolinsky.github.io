window.App = {};

const _document = document;

const elFromStr = (str) => Object.assign(_document.createElement('DIV'), {innerHTML: str.trim()}).firstChild;
const qsa = (selectors, _root) => (_root || _document).querySelectorAll(selectors);

const buildEditorPane = (editorDefs) => {
	const templates = {
		pane: (v) => `
			<div class="editor-pane">
				<div class="editor-pane-tabs" data-tabs></div>
				<div class="editor-pane-controls" data-controls>
					<button data-control="back" title="Go back in this editor's history">Back</button>
					<button data-control="forw" title="Go forward in this editor's history">Forw</button>
					<button data-control="save" title="Save the current content of this editor">Save</button>
				</div>
				<div class="editor-pane-editors" data-editors></div>
			</div>
		`,
		tab: (v) => `
			<div class="editor-pane-tabs-tab" data-name="${v.name}"><a href="editor-${v.name}">${v.text}</a></div>
		`,
		editor: (v) => `
			<textarea class="editor-pane-editors-editor" data-name="${v.name}"></textarea>
		`
	};
	const _editorPane = elFromStr(templates.pane());
	const _tabs = qsa('[data-tabs]', _editorPane)[0];
	const _controls = qsa('[data-controls', _editorPane)[0];
	const _editors = qsa('[data-editors]', _editorPane)[0];
	const tabsArr = [], editorsArr = [];
	const getTopEditor = () => editors[qsa('[data-top]', _editors)[0].dataset.name];
	const setControlsEnabledMode = () => {
		const editor = getTopEditor();
		controls._back.disabled = ! (editor.historyIndex !== null && editor.historyIndex > 0);
		controls._forw.disabled = ! (editor.historyIndex !== null && editor.historyIndex < editor.history.length - 1);
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
	const editors = editorDefs.reduce((editors, name, index) => {
		const _tab = elFromStr(templates.tab({name, text: name.charAt(0).toUpperCase() + name.substr(1)}));
		const _editor = elFromStr(templates.editor({name}));
		if (index === 0) {
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
		return editors;
	}, {});
	setControlsEnabledMode();
	return {_editorPane, editors};
};

_document.addEventListener('DOMContentLoaded', () => {

	const editorPane = buildEditorPane(['draw', 'rand', 'conf']);

	qsa('[data-code]')[0].appendChild(editorPane._editorPane);

	const _controls = qsa('[data-controls]')[0];

	const controls = ['step', 'strt', 'stop', 'rand'].reduce((controls, name) => {
		controls[`_${name}`] = qsa(`[data-control="${name}"]`, _controls)[0];
		return controls;
	}, {});

	controls._step.addEventListener('click', (e) => (run.on = true, run(), run.on = false));
	controls._strt.addEventListener('click', (e) => (run.on = true, run()));
	controls._stop.addEventListener('click', (e) => run.on = false);
	controls._rand.addEventListener('click', (e) => rand());

	const run = (() => {
		const func = () => {
			if (func.on) {
				draw();
				setTimeout(func, 0);
			}
		};
		func.on = false;
		return func;
	})();

	const globals = {};

	const _canvas = qsa('[data-canvas]')[0];

	let drawFunc, randFunc, conf;

	editorPane.editors['draw'].onSave.push((editor) =>
		drawFunc = new Function('globals', '_canvas', 'conf', 'rand', editor.get()));
	editorPane.editors['rand'].onSave.push((editor) =>
		randFunc = new Function('globals', 'conf', 'bodyFunc', editor.get()));
	editorPane.editors['conf'].onSave.push((editor) => conf = eval(editor.get()));

	const draw = () => {
		drawFunc(globals, _canvas, conf, rand);
	};

	const rand = () => editorPane.editors['draw'].save(randFunc(globals, conf, bodyFunc));

	const bodyFunc = (func) => {
		const funcStr = func.toString();
		return funcStr.substring(funcStr.indexOf('{') + 1, funcStr.lastIndexOf('}'));
	};

	const stringify = (() => {
		const recursive = (v, tabLevel = 1) => {
			if (typeof(v) === 'object') {
				return `{\n${Object.keys(v).map((k) => `${new Array(tabLevel).fill('\t').join('')}${k}: ` +
					`${recursive(v[k], tabLevel + 1)}`).join(',\n')}\n${new Array(tabLevel - 1).fill('\t').join('')}}`;
			} else {
				return v.toString();
			}
		};
		return (v) => recursive(v);
	})();

	window.App.init({
		qsa, elFromStr, run, draw, rand, bodyFunc, stringify, editorPane
	});

});