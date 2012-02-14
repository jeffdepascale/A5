
a5.Package('a5.unitTest.tests')

	.Extends('a5.cl.CLUnitTest')
	.Class('ErrorTest', function(cls, im){
		
		cls.ErrorTest = function(){
			cls.superclass(this);
		}		
		
		cls.Override.runTest = function(){
			try {
				cls.throwError("Error test");
			} catch(e){
				cls.assert(e.message == "Error test", "error message failure");
			}
			
			try {
				cls.throwError(cls.create(a5.Error, ['error']));
			} catch(e){
				cls.assert(e instanceof a5.Error, 'a5.Error cast failure');
				cls.assert(e.message == 'error', 'a5.Error cast message failure');
			}
		}
})