a5.Package('a5.unitTest.tests')

	.Extends('a5.cl.CLUnitTest')
	.Class('AttributesTest', function(cls, im){
		
		cls.AttributesTest = function(){
			cls.superclass(this);
		}
		
		cls.Override.runTest = function(){
			
			a5.Package('a5.unitTest.testClasses.attributes')
			
				.Extends('a5.Attribute')
				.Class('TestAttribute', function(cls, im, AttrTest){
					
					cls.AttrTest = function(){ cls.superclass(this); }	
			})	
			
			a5.Package('a5.unitTest.testClasses.attributes')

				.Class('AttrTest', function(cls, im, AttrTest){
					cls.AttrTest = function(){
					}

					cls.genericAttributeTest = this.Attributes(['Test']);
					
			})
			
			var attrTest = cls.create(a5.unitTest.testClasses.attributes.AttrTest);
			cls.assert(attrTest.genericAttributeTest.getAttributes()["TestAttribute"] !== null, "Generic Attribute failure.");			
				
			a5.Package('a5.unitTest.testClasses.attributes')

				.Import('a5.ContractAttribute')
				.Class('AttrTest1', function(cls, im, AttrTest1){
					
					cls.AttrTest1 = function(){
						
					}
					
					cls.contractTest = this.Attributes(
					['Contract', {foo:'string', bar:'boolean=false'}],
					function(args){
						cls.assert(typeof args.foo === 'string', "type error fail 1");
					})
			})
			var attrtest1 = cls.create(a5.unitTest.testClasses.attributes.AttrTest1);
			attrtest1.contractTest("foo");
			cls.log('AttrTest1 passed');
			
			a5.Package('a5.unitTest.testClasses.attributes')
			
				.Extends('a5.AspectAttribute')
				.Class('TestAspectAttribute', function(cls){
					
					cls.TestAspectAttribute = function(){
						cls.superclass(this);
					}
					
					cls.Override.before = function(){
						return a5.AspectAttribute.SUCCESS;
					}
					
					cls.Override.after = function(){
						return a5.AspectAttribute.SUCCESS;
					}
				})
			
			
			a5.Package('a5.unitTest.testClasses.attributes')

				.Class('AttrTest2', ['TestAspect', {include:'meth*'}], function(cls, im){
					
					cls.AttrTest2 = function(){
					}
					
					cls.method = function(){
					}
				});
			
			var attrTest2 = cls.create(a5.unitTest.testClasses.attributes.AttrTest2);
			cls.assert(attrTest2.method.getAttributes().TestAspectAttribute !== null, 'failed');
			attrTest2.method();
		}
		
})	