window.App.literals = {
	ctrl: {
		stepTitle: 'Perform one draw',
		stepValue: 'Step',
		strtTitle: 'Start drawing loop',
		strtValue: 'Start',
		stopTitle: 'Stop drawing loop',
		stopValue: 'Stop',
		randTitle: 'Generate new drawing function',
		randValue: 'Random',
		reinTitle: 'Re-initiate the drawing loop',
		reinValue: 'Re-init',
		auonTitle: 'Begin automatically randomizing the drawing function at occasional intervals ' +
			'(Note: the frequency of randomization is configurable in \'Conf\')',
		auonValue: 'Auto-on',
		auofTitle: 'Stop automatically randomizing the drawing function',
		auofValue: 'Auto-off',
		clerTitle: 'Clear the canvas',
		clerValue: 'Clear',
		reszTitle: 'Resize the canvas',
		reszValue: 'Resize',
		loadTitle: 'Load an image from your file system',
		loadValue: 'Load',
		saveTitle: 'Download the canvas as an image',
		saveValue: 'Save'
	},
	edit: {
		backTitle: 'Go back in this editor\'s history',
		backValue: '<',
		forwTitle: 'Go forward in this editor\'s history',
		forwValue: '>',
		setvTitle: 'Set the current content of this editor as the editor\'s new value, adding it onto the editor\'s history',
		setvValue: 'Set'
	},
	actions: {
		reinit: {
			confirmMessage: 'Re-initiate the drawing loop by setting the stepCount to 0 and the globals to an empty object?'
		},
		clear: {
			confirmMessage: 'Clear the canvas by filling it with the color value {{colorStr}}? ' +
				'(Note: the color value is configurable in \'Conf\')'
		},
		resize: {
			promptMessage: 'The current canvas size is {{sizeStr}}. Please enter the new size. ' +
				'Note: this will also perform a drawing loop re-init and a canvas clear.',
			invalidMessage: 'The entered size is invalid.'
		},
		save: {
			filename: 'image'
		}
	}
};