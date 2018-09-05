window.App.literals = {
	templates: {
		editorgroup: {
			root: {
				backTitle: 'Go back in this editor\'s history',
				backValue: 'Back',
				forwTitle: 'Go forward in this editor\'s history',
				forwValue: 'Forw',
				saveTitle: 'Save the current content of this editor and set it as the editor\'s new value',
				saveValue: 'Save'
			}
		}
	},
	actions: {
		reinit: {
			confirmMessage: 'Re-initiate the drawing loop by setting the stepCount to 0 and the globals to an empty object?'
		},
		clear: {
			confirmMessage: 'Clear the canvas by filling it with the color value {{colorStr}} ?'
		},
		resize: {
			promptMessage: 'The current canvas size is {{sizeStr}}. Please enter the new size. ' +
				'Note: this will also perform a drawing loop re-init and a canvas clear.',
			invalidMessage: 'The entered size is invalid.'
		}
	}
};