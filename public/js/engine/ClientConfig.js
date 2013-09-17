var igeClientConfig = {
	include: [
		/* Your custom game JS scripts */
		'js/engine/gameClasses/ClientNetworkEvents.js',
		'js/engine/gameClasses/Character.js',
		'js/engine/gameClasses/CharacterContainer.js',
		'js/engine/gameClasses/PlayerComponent.js',
    'js/engine/gameClasses/ClientObjects.js',
		/* Standard game scripts */
		'js/engine/client.js',
		'js/engine/index.js'
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }