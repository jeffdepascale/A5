
a5.Package('a5.unitTest.tests')
	
	.Import('a5.ContractAttribute')
	.Extends('a5.cl.CLUnitTest')
	.Class('ReflectionTest', function(cls, im){
		
		cls.ReflectionTest = function(){
			cls.superclass(this);
		}	
		
		cls.foo = this.Attributes(['Contract', {foo:'string'}], function(){
			
		})	
		
		cls.Override.runTest = function(){	
			cls.assert(cls.runTest.getName() === 'runTest', 'reflection method getName failure');
			
			cls.assert(cls.foo.getClass() === a5.unitTest.tests.ReflectionTest, 'reflection method getClass failure');
			
			cls.assert(cls.runTest.getClassInstance() === this, 'reflection method getClass failure');
			
			cls.assert(typeof cls.foo.getAttributes() === 'object' && cls.foo.getAttributes().ContractAttribute !== undefined, 'reflection method getAttributes failure');
		}
})