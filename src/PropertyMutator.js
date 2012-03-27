a5.Package('a5')

	.Extends('AspectAttribute')
	.Class('PropertyMutatorAttribute', function(cls){
		
		cls.PropertyMutatorAttribute = function(){
			cls.superclass(this);
		}
		
		cls.Override.before = function(typeRules, args, scope, method, callback, callOriginator){
			if(args.length){
				var typeVal = typeRules[0].validate,
					isCls = false;
				if(typeVal){
					if (typeVal.indexOf('.') !== -1) {
						isCls = true;
						var typeVal = a5.GetNamespace(typeVal);
						if(!typeVal)
							return a5.AspectAttribute.FAILURE;
					}
					var isValid = isCls ? (args[0] instanceof typeVal) : (typeof args[0] === typeVal);
					if(!isValid)
						return a5.AspectAttribute.FAILURE;
				}
				scope[typeRules[0].property] = args[0];
				return a5.AspectAttribute.SUCCESS;
			}
			var retVal = scope[typeRules[0].property];
			return retVal === null ? a5.AspectAttribute.RETURN_NULL : retVal;
		}	
		
		cls.Override.after = function(typeRules, args, scope, method, callback, callOriginator, preArgs){
			if (preArgs.length) 
				return scope;
			else 				
				return a5.AspectAttribute.SUCCESS;
		}
})