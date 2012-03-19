a5.Package('a5')

	.Extends('Attribute')
	.Class('PropertyMutatorAttribute', function(cls){
		
		cls.PropertyMutatorAttribute = function(){
			cls.superclass(this);
		}
		
		cls.Override.methodPre = function(typeRules, args, scope, method, callback, callOriginator){
			if(args.length){
				var typeVal = typeRules[0].validate,
					isCls = false;
				if(typeVal){
					if (typeVal.indexOf('.') !== -1) {
						isCls = true;
						var typeVal = a5.GetNamespace(typeVal);
						if(!typeVal)
							return a5.Attribute.FAILURE;
					}
					var isValid = isCls ? (args[0] instanceof typeVal) : (typeof args[0] === typeVal);
					if(!isValid)
						return a5.Attribute.FAILURE;
				}
				scope[typeRules[0].property] = args[0];
				return a5.Attribute.SUCCESS;
			}
			var retVal = scope[typeRules[0].property];
			return retVal === null ? a5.Attribute.RETURN_NULL : retVal;
		}	
		
		cls.Override.methodPost = function(typeRules, args, scope, method, callback, callOriginator, preArgs){
			if (preArgs.length) 
				return scope;
			else 				
				return a5.Attribute.SUCCESS;
		}
})