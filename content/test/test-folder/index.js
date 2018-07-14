const onload = function() {

	const targetNode = document.querySelector('div');
	const observerOptions = {
	  childList: true,
	  attributes: true,
	  subtree: true
	};

	const observer = new MutationObserver((...args) => {
		console.log(...args);
	});

	observer.observe(targetNode, observerOptions);

	targetNode.setAttribute('testProp', 'testVal');

	observer.disconnect();

};

export { onload };