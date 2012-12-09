
a5.Package('a5.unitTest.tests')

	.Extends('a5.cl.CLUnitTest')
	.Class('EventTest', function(cls, im){
		
		cls.EventTest = function(){
			cls.superclass(this);
			cls.asyncTest();
		}		
		
		cls.Override.runTest = function(){
			a5.Package('a5.unitTest.testClasses')
			
				.Extends('a5.EventDispatcher')
				.Class('EventTest1', function(cls, im){
					
					cls.EventTest1 = function(){
						cls.superclass(this);
					}
					
					cls.testDispatch = function(){
						cls.dispatchEvent('TEST_EVENT');
					}
						
			})
			
			var eTestEventHandler = function(e){
				cls.assert(e.type() === 'TEST_EVENT', 'event type failure');
				cls.testComplete();
			}
			
			var et1 = new a5.unitTest.testClasses.EventTest1();
			et1.addEventListener('TEST_EVENT', eTestEventHandler);
			et1.testDispatch();
			
		}
})