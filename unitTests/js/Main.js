
a5.cl.Config({
	clientEnvironmentOverrides:true,
	dependencies: [
		'js/tests/CoreTest.js',
		'js/tests/AttributesTest.js'
	]
});

a5.cl.PluginConfig('a5.cl.testing.Testing', {
	showConsole:true
})

var app = a5.cl.CreateApplication({
	applicationPackage: 'a5.unitTest'
});