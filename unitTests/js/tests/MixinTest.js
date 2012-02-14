
a5.Package('a5.unitTest.tests')

	.Extends('a5.cl.CLUnitTest')
	.Class('MixinTest', function(cls, im){
		
		cls.MixinTest = function(){
			cls.superclass(this);
		}		
		
		cls.Override.runTest = function(){
			var const1Called = false,
				const2Called = false,
				dealloc1Called = false,
				dealloc2Called = false,
				mixerDeallocCalled = false,
				override1Called = false;
			
			a5.Package('a5.unitTest.testClasses')
			
				.Prototype('MixinTestBase', function(cls){
					
					cls.MixinTestBase = function(){
					}	
			})
			
			
			a5.Package('a5.unitTest.testClasses')
		
				.Mixin('Mixer', function(mixin){
					
					this.MustExtend('MixinTestBase');
					
					this.Properties(function(){
						this.mixerProperty = 'mixin set prop val';
					})
					
					mixin.Mixer = function(){
						const1Called = true;
					}
					
					mixin.mixinTest = function(){
						return 'mixinTest called';
					}
					
					mixin.dealloc = function(){
						dealloc1Called = true;
					}
			})
			
			a5.Package('a5.unitTest.testClasses')
			
				.Mixin('Mixer2', function(mixin){
					
					mixin.Mixer2 = function(){
						const2Called = true;
					}
					
					mixin.mixinTest2 = function(){
						return 'mixinTest2 called';
					}
					
					mixin.dealloc = function(){
						dealloc2Called = true;
					}
			})
			
			
			a5.Package('a5.unitTest.testClasses')
				
				.Mix('Mixer', 'Mixer2')
				.Extends('MixinTestBase')
				.Class('MixerTest', function(self, im, MixerTest){
					
					self.MixerTest = function(value){
						self.superclass(this);
						cls.assert(self.mixinTest() == 'mixinTest called', 'mixinTest method failure');
						cls.assert(self.mixinTest2() == 'mixinTest2 called', 'mixinTest2 method failure');
					}
					
					self.mixinTest = function(){
						override1Called = true;
						return self.mixins().mixinTest.call(this);
					}
					
					self.dealloc = function(){
						mixerDeallocCalled = true;
					}
			})
			
			var inst = cls.create(a5.unitTest.testClasses.MixerTest);
			cls.assert(inst.mixerProperty == 'mixin set prop val', 'mixerProperty check failure');
			inst.destroy();
			
			cls.assert(const1Called === true, 'const1 failure');
			cls.assert(const2Called === true, 'const2 failure');
			cls.assert(dealloc1Called === true, 'dealloc1 failure');
			cls.assert(dealloc2Called === true, 'dealloc2 failure');
			cls.assert(mixerDeallocCalled === true, 'mixerDealloc failure');
			cls.assert(override1Called === true, 'override1 failure');
		}
})