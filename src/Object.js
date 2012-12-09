a5.Package('a5')

	.Prototype('Object', function(cls, im){
		cls.Object = function(){
			
		}	
		
		cls.mixins = function(namespace){
			if (namespace !== undefined)
				return a5.GetNamespace(namespace, this.imports());
			else
				return this.constructor._a5_mixedMethods;
		}
})
