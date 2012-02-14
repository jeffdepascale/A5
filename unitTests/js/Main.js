
a5.cl.Config({
	dependencies: [
		'js/lib/CLUnitTest.js',
		'js/tests/CoreTest.js',
		'js/tests/AttributesTest.js',
		'js/tests/EnumTest.js',
		'js/tests/MixinTest.js',
		'js/tests/ErrorTest.js',
		'js/tests/EventTest.js',
		'js/tests/InterfaceTest.js',
		'js/tests/MethodChangerTest.js',
		'js/tests/ReflectionTest.js'
	]
});

var app = a5.cl.CreateApplication({
	applicationPackage: 'a5.unitTest'
});