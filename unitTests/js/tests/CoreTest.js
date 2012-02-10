a5.Package('a5.unitTest.tests')

	.Extends('a5.cl.testing.CLUnitTest')
	.Class('CoreTest', function(self, im){
		
		self.CoreTest = function(){
			self.superclass(this);
		}		
		
		self.runTest = function(){
			try{
				self.log("Testing Prototype...");
				self.log("Testing generic class...");
				
				
				a5.Package('a5.unitTest.testClasses')
					
					.Prototype('ProtoTest', function(proto, im, ProtoTest){
						
						proto.ProtoTest = function(){
						}
					
				})
				
				self.create(a5.unitTest.testClasses.ProtoTest);
				
				self.log("Testing extends...");
				
				a5.Package('a5.unitTest.testClasses')
					
					.Extends('a5.cl.CLBase')
					.Prototype('ProtoTest2', function(proto, im, ProtoTest){
						
						proto.ProtoTest2 = function(){
							proto.superclass(this);
						}
					
				})
				self.create(a5.unitTest.testClasses.ProtoTest2);
				
				
				self.log("Testing imports...");
				a5.Package('a5.unitTest.testClasses')
					
					.Import('a5.cl.*')
					.Prototype('ProtoTest3', function(proto, im, ProtoTest){
						
						proto.ProtoTest3 = function(){
							//self.assert(im.CLBase === a5.cl.CLBase, 'Import test 1 failed')
						}
					
				})
				
				self.create(a5.unitTest.testClasses.ProtoTest3);
				
				self.log('Prototype tests complete.');
				
				self.log("Testing Class...");
				
				a5.Package('a5.unitTest.testClasses')
					.Class('ClassTest1', function(cls, im, ClassTest1){
					
						cls.ClassTest1 = function(){
							
						}						
				});
				
				self.create(a5.unitTest.testClasses.ClassTest1);
				
				self.log('Class tests complete.');
			} catch(e){
				self.error(e);
			}
			
			this.testComplete();
		}

})