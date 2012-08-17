
/**
 * Applies cross cutting logic to a method to wrap getter and setter like functionality to a property in a Prototype class.
 */
a5.Package('a5')

	.Extends('AspectAttribute')
	.Class('PropertyMutatorAttribute', function(cls){
		
		cls.PropertyMutatorAttribute = function(){
			cls.superclass(this);
		}

		cls.Override.before = function(aspectArgs){
			if(aspectArgs.args().length){
				var typeVal = aspectArgs.rules()[0].validate,
					isCls = false;
				if(typeVal){
					if (typeVal.indexOf('.') !== -1) {
						isCls = true;
						var typeVal = a5.GetNamespace(typeVal);
						if(!typeVal)
							return a5.AspectAttribute.FAILURE;
					}
					var isValid = isCls ? (aspectArgs.args()[0] instanceof typeVal) : (typeof aspectArgs.args()[0] === typeVal);
					if(!isValid)
						return a5.AspectAttribute.FAILURE;
				}
				aspectArgs.scope()[aspectArgs.rules()[0].property] = aspectArgs.args()[0];
				return a5.AspectAttribute.SUCCESS;
			}
			var retVal = aspectArgs.scope()[aspectArgs.rules()[0].property] || null;
			return retVal === null || retVal === undefined ? a5.AspectAttribute.RETURN_NULL : retVal;
		}	
		
		cls.Override.after = function(aspectArgs){
			if (aspectArgs.beforeArgs().length) 
				return aspectArgs.scope();
			else 				
				return a5.AspectAttribute.SUCCESS;
		}
})