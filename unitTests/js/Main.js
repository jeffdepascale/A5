
a5.Package('a5.unitTest')

	.Extends('a5.cl.CLMain')
	.Class('Main', function(cls){
		
		cls.Main = function(){
			cls.superclass(this, arguments);
			cls.dependencies([
					'js/lib/CLUnitTest.js',
					'js/tests/CoreTest.js',
					'js/tests/AttributesTest.js',
					'js/tests/EnumTest.js',
					'js/tests/MixinTest.js',
					'js/tests/ErrorTest.js',
					'js/tests/EventTest.js',
					'js/tests/InterfaceTest.js',
					'js/tests/MethodChangerTest.js',
					'js/tests/ReflectionTest.js',
					'js/tests/DestroyTest.js'
				])	
		}
})
a5.cl.CreateApplication();