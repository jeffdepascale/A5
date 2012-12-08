
a5.Package('a5.unitTest.tests')

	.Extends('a5.cl.CLUnitTest')
	.Class('CoreTest', function(cls, im){
		
		cls.CoreTest = function(){
			cls.superclass(this);
		}		
		
		cls.Override.runTest = function(){
			cls.log('Testing core class qualifier methods...');
			cls.assert(cls.namespace() === 'a5.unitTest.tests.CoreTest', 'namespace failure');
			
			cls.log("Testing Prototype...");
			
			//GENERIC CLASS
			cls.log("Testing generic class...");
			
			a5.Package('a5.unitTest.testClasses')
				
				.Prototype('ProtoTest', function(proto, im, ProtoTest){
					
					proto.ProtoTest = function(){
					}
				
			})
			new a5.unitTest.testClasses.ProtoTest();
			
			
			
			//EXTENDS
			cls.log("Testing extends...");

			a5.Package('a5.unitTest.testClasses')
				
				.Extends('a5.cl.CLBase')
				.Prototype('ProtoTest2', function(proto, im, ProtoTest){
					
					proto.ProtoTest2 = function(){
						proto.superclass(this);
					}
				
			})
			new a5.unitTest.testClasses.ProtoTest2();
			
			
			//IMPORTS
			cls.log("Testing imports...");
			a5.Package('a5.unitTest.testClasses')
				
				.Import('a5.cl.*')
				.Prototype('ProtoTest3', function(proto, im, ProtoTest){
					
					proto.ProtoTest3 = function(){
						cls.assert(im.CLBase === a5.cl.CLBase, 'Import test 1 failed');
					}
				
			})
			new a5.unitTest.testClasses.ProtoTest3();
			
			
			//CONSTRUCTORS
			cls.log('Testing constructors...');
			
			a5.Package('a5.unitTest.testClasses')
				
				.Prototype('ProtoTest4', function(proto, im, ProtoTest){
					
					proto.ProtoTest4 = function(){
						proto.superclass(this);
					}
				
			})
			
			try {
				new a5.unitTest.testClasses.ProtoTest4();
			} catch(e){
				cls.assert(e.message.indexOf('superclass') !== -1, "Invalid superclass call not found");
			}
			
			
			
			
			
			
			
			
			cls.log('Prototype tests complete.');
			
			cls.log("Testing Class...");
			
			a5.Package('a5.unitTest.testClasses')
				.Class('ClassTest1', function(cls, im, ClassTest1){
				
					cls.ClassTest1 = function(){
						
					}						
			});
			
			new a5.unitTest.testClasses.ClassTest1();
			
			
			a5.Package('a5.unitTest.testClasses')
				.Class('SingletonTest', 'singleton', function(cls){
					
					cls.SingletonTest = function(){
						
					}
			})
			var singletonFailed = false;
			new a5.unitTest.testClasses.SingletonTest();
			try{
				new a5.unitTest.testClasses.SingletonTest();
			}catch(e){
				if(e.message.indexOf('singleton') !== -1)
					singletonFailed = true;
			}
			
			cls.assert(singletonFailed, 'Singleton test failure');
			cls.log('Class tests complete.');
		}

})