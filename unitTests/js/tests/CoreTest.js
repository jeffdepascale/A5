a5.Package('a5.unitTest.tests')

	.Extends('a5.cl.testing.CLUnitTest')
	.Class('CoreTest', function(self, im){
		
		self.CoreTest = function(){
			self.superclass(this);
		}		
		
		self.runTest = function(){
			try{
				
				//Testing generic class
				a5.Package('a5.unitTest.testClasses')
					
					.Prototype('ProtoTest', function(proto, im, ProtoTest){
						
						proto.ProtoTest = function(){
						}
					
				})
				self.create(a5.unitTest.testClasses.ProtoTest);
				
				//Testing extend
				a5.Package('a5.unitTest.testClasses')
					
					.Extends('a5.cl.CLView')
					.Prototype('ProtoTest2', function(proto, im, ProtoTest){
						
						proto.ProtoTest2 = function(){
							proto.superclass(this);
						}
					
				})
				self.create(a5.unitTest.testClasses.ProtoTest2);
				
				
				//testing implements
				//Testing extend
				a5.Package('a5.unitTest.testClasses')
					
					.Import('a5.cl.*', 'a5.cl.testing.Testing')
					.Prototype('ProtoTest3', function(proto, im, ProtoTest){
						
						proto.ProtoTest3 = function(){
							self.assert(im.Testing === a5.cl.testing.Testing, 'Import test 1 failed')
						}
					
				})
				self.create(a5.unitTest.testClasses.ProtoTest3);
				
			} catch(e){
				self.error(e);
			}
			self.log('Prototype tests passed')
			
			this.testComplete();
		}

})