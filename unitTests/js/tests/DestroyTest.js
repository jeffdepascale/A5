a5.Package('a5.unitTest.tests')

	.Extends('a5.cl.CLUnitTest')
	.Class('DestroyTest', function(cls, im){
		
		cls.DestroyTest = function(){
			cls.superclass(this);
		}
		
		cls.Override.runTest = function(){
			a5.Package('a5.unitTest.testClasses.destroys')
			
				.Class('TestDestroyClass', function(cls, im){
					
					cls.TestDestroyClass = function(){ }	
					
					cls.test = function(){}
			})	
			
			var obj = new a5.unitTest.testClasses.destroys.TestDestroyClass();
			obj.destroy();
			try {
				obj.test();
			} catch(e){
				cls.assert(e == "Destroyed method called from method 'runTest' in class 'DestroyTest'", "destroy method call failure");
			}
		}
		
});