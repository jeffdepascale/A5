
a5.Package('a5.unitTest.tests')

	.Extends('a5.cl.CLUnitTest')
	.Class('InterfaceTest', function(cls, im){
		
		cls.InterfaceTest = function(){
			cls.superclass(this);
		}		
		
		cls.Override.runTest = function(){
			var didFail1 = false;
			
			a5.Package('a5.unitTests.testClasses')
			
				.Interface('InterfaceTest1', function(cls){
					
					cls.requiredMethod = function(){};	
			})
			
			try {
				a5.Package('a5.unitTests.testClasses').Implements('InterfaceTest1').Class('FailImplement', function(cls){
				
					cls.FailImplement = function(){
					
					}
				})
			} catch(e){
				if(e.message.indexOf('implementation') !== -1)
					didFail1 = true;
			}
			
			a5.Package('a5.unitTests.testClasses')
			
				.Implements('InterfaceTest1')
				.Class('SuccessImplement', function(cls){
					
					cls.SuccessImplement = function(){
						
					}
					
					cls.requiredMethod = function(){
						
					}
			})
			cls.assert(didFail1, 'Interface generic method failure');
			
			
			var didFail2 = false,
				didFail3 = false,
				didFail4 = false;
			
			a5.Package('a5.unitTests.testClasses')
			
				.Interface('InterfaceTest2', function(cls){
					
					cls.requiredMethod = [{foo:'string'}];	
			})
			
			try {
				a5.Package('a5.unitTests.testClasses')
					
					.Implements('InterfaceTest2')
					.Class('FailImplement2', function(cls){
				
						cls.FailImplement2 = function(){
						
						}
						
				})
			} catch(e){
				if(e.message.indexOf('implementation') !== -1)
					didFail2 = true;
			}
			
			try {
				a5.Package('a5.unitTests.testClasses')
					
					.Implements('InterfaceTest2')
					.Class('FailImplement3', function(cls){
				
						cls.FailImplement3 = function(){
						
						}
						
						cls.requiredMethod = function(){}
				})
			} catch(e){
				if(e.message.indexOf('implementation') !== -1)
					didFail3 = true;
			}
			
			try {
				a5.Package('a5.unitTests.testClasses')
					.Import('a5.ContractAttribute')
					.Implements('InterfaceTest2')
					.Class('FailImplement4', function(cls){
				
						cls.FailImplement4 = function(){
						
						}
						
						cls.requiredMethod = this.Attributes(
						['Contract', {foo:'array'}],
						function(){
							
						})
				})
			} catch(e){
				if(e.message.indexOf('implementation') !== -1)
					didFail4 = true;
			}
			
			a5.Package('a5.unitTests.testClasses')
				.Import('a5.ContractAttribute')
				.Implements('InterfaceTest2')
				.Class('SuccessImplement2', function(cls){
					
					cls.SuccessImplement2 = function(){
						
					}

					cls.requiredMethod = this.Attributes(
					['Contract', {foo:'string'}],
					function(){
						
					})
			})
			cls.assert(didFail2, 'Interface contract method failure - no method');
			cls.assert(didFail3, 'Interface contract method failure - generic method');
			cls.assert(didFail4, 'Interface contract method failure - wrong args');
		}
})