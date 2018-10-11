window.App.literals = {
	ctrl: {
		randTitle: 'Re-init the drawing loop, set the \'inpt\' value back to the initial value, fill the canvas with the ' +
			'initial fill color value, and generate a new drawing function',
		randValue: 'Random',
		frsrTitle: 'Re-init the drawing loop, set the \'inpt\' value back to the initial value, fill the canvas with the ' +
			'initial fill color value, but do not generate a new drawing function',
		frsrValue: 'From Start',
		stepTitle: 'Perform one draw',
		stepValue: 'Step',
		strtTitle: 'Start drawing loop',
		strtValue: 'Start',
		stopTitle: 'Stop drawing loop',
		stopValue: 'Stop',
		genrTitle: 'Generate a new drawing function',
		genrValue: 'Generate',
		reinTitle: 'Re-initiate the drawing loop',
		reinValue: 'Re-init',
		auonTitle: 'Begin automatically randomizing the drawing function at occasional intervals ' +
			'(Note: the frequency of randomization is configurable in \'Conf\')',
		auonValue: 'Auto-on',
		auofTitle: 'Stop automatically randomizing the drawing function',
		auofValue: 'Auto-off',
		msonValue: 'Mouse-on',
		msonTitle: 'Turn mouse input on',
		msofValue: 'Mouse-off',
		msofTitle: 'Turn mouse input off',
		fillTitle: 'Fill the canvas with a color value',
		fillValue: 'Fill',
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
		rein: {
			confirmMessage: 'Re-initiate the drawing loop by setting the stepCount to 0 and the globals to an empty object?'
		},
		fill: {
			promptMessage: 'Please enter a color value in \'r, g, b, a\' format. The canvas will be filled with this value.',
			invalidMessage: 'TThe entered string {{promptResStr}} does not correspond to a valid color value.'
		},
		resz: {
			promptMessage: 'The current canvas size is {{sizeStr}}. Please enter the new size in \'width, height\' format. ' +
				'Note: this will also perform a drawing loop re-init and a fill of the canvas with the color value {{colorValue}}.',
			invalidMessage: 'The entered string {{promptResStr}} does not correspond to a valid size.'
		},
		save: {
			filename: 'image'
		}
	},
	editorValuesInvalidMessage: 'The text contents of the editor could not be successfully \'eval\'ed. ' +
		'Eval call failed with error:\n{{err}}.'
};