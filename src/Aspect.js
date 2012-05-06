/**
 * Decorates methods with cross cutting logic.
 */
a5.Package('a5')

	.Extends('Attribute')
	.Prototype('AspectAttribute', function(cls, im, AspectAttribute){
		
		/**
		 * Returned from aspect methods where an explicit null is the return value.
		 */
		AspectAttribute.RETURN_NULL = '_a5_aspectReturnsNull';
		
		/**
		 * Returned from aspect methods when the test passes with no modification to the passed params.
		 */
		AspectAttribute.SUCCESS = '_a5_aspectSuccess';
		
		/**
		 * Returned from aspect methods when a test method requires asynchronous processing. The callback param must be called to continue the aspect chain.
		 */
		AspectAttribute.ASYNC = '_a5_aspectAsync';
		
		/**
		 * Returned from aspect methods when a test method fails processing.
		 */
		AspectAttribute.FAILURE = '_a5_aspectFailure';
		
		/**
		 * Returned from aspect methods by default when a method is not overriden.
		 */
		AspectAttribute.NOT_IMPLEMENTED = '_a5_notImplemented';
		
		cls.AspectAttribute = function(){
			cls.superclass(this);
		}
		
		/**
		 * Override to specify logic that should occur before the attributed method block is executed.
		 * @param {Array} rules the rule parameters defined when the attribute was applied.
		 * @param {Array} args the arguments being passed to the method.
		 * @param {a5.Object} scope the scope of the method.
		 * @param {Function} method the method definition, accessible for reflection purposes.
		 * @param {Function} callback must be invoked with a return status when returning {@link AspectAttribute.ASYNC}. 
		 * @param {Function} callOriginator when accessible, the object that made the call to the method.
		 */
		cls.before = function(rules, args, scope, method, callback, callOriginator){ return AspectAttribute.NOT_IMPLEMENTED; }
		
		/**
		 * Override to specify logic that should occur after the attributed method block is executed.
		 * @param {Array} rules the rule parameters defined when the attribute was applied.
		 * @param {Array} args the arguments being passed to the method.
		 * @param {a5.Object} scope the scope of the method.
		 * @param {Function} method the method definition, accessible for reflection purposes.
		 * @param {Function} callback must be invoked with a return status when returning {@link AspectAttribute.ASYNC}. 
		 * @param {Function} callOriginator when accessible, the object that made the call to the method.
		 */
		cls.after = function(rules, args, scope, method, callback, callOriginator, beforeArgs){ return AspectAttribute.NOT_IMPLEMENTED; }
		
		/**
		 * Override to specify logic that should occur both before and after the attributed method block is executed.
		 * @param {Array} rules the rule parameters defined when the attribute was applied.
		 * @param {Array} args the arguments being passed to the method.
		 * @param {a5.Object} scope the scope of the method.
		 * @param {Function} method the method definition, accessible for reflection purposes.
		 * @param {Function} callback must be invoked with a return status when returning {@link AspectAttribute.ASYNC}. 
		 * @param {Function} callOriginator when accessible, the object that made the call to the method.
		 */
		cls.around = function(){ return AspectAttribute.NOT_IMPLEMENTED; }
});
