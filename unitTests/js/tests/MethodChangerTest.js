
a5.Package('a5.unitTest.tests')

	.Extends('a5.cl.CLUnitTest')
	.Class('MethodChangerTest', function(cls, im){
		
		cls.MethodChangerTest = function(){
			cls.superclass(this);
		}		
		
		cls.Override.runTest = function(){
			
			a5.Package('a5.unitTest.testClasses')
			
				.Prototype('MethodChangersBase', function(cls, im){
					
					cls.MethodChangersBase = function(){
						cls.superclass(this);
					}	
					
					cls.foo = function(){
						
					}
					
					cls.Final.bar = function(){
						
					}
			})
			
			a5.Package('a5.unitTest.testClasses')
				
				.Extends('MethodChangersBase')
				.Prototype('MethodChangersSuccess', function(cls, im){
					
					cls.MethodChangersSuccess = function(){
						cls.superclass(this);
					}	
					
					cls.Override.foo = function(){
						
					}
					
					cls.Final.bar = function(){}
					
			})
			
			try {
				a5.Package('a5.unitTest.testClasses')
					
					.Extends('MethodChangersBase')
					.Prototype('MethodChangersOverrideFail', function(cls, im){
				
						cls.MethodChangersOverrideFail = function(){
							cls.superclass(this);
						}
						
						cls.foo = function(){
						
						}
					
				})
			} catch(e){
				cls.assert(e.message.indexOf('override') !== -1, 'Override qualifier test failure')
			}
			
			try {
				a5.Package('a5.unitTest.testClasses')
				
					.Extends('MethodChangersBase')
					.Prototype('MethodChangersFinalFail', function(cls, im){
				
						cls.MethodChangersFinalFail = function(){
							cls.superclass(this);
						}
						
						cls.bar = function(){
						
						}
					
				})
			}catch(e){
				cls.assert(e.message.indexOf('Final') !== -1, 'Final qualifier test failure');
			}
				
		}
})