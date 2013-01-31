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
		 * @param {a5.AspectCallArguments} Arguments for the context of the aspect;
		 */
		cls.before = function(rules, args, scope, method, callback, callOriginator){ return AspectAttribute.NOT_IMPLEMENTED; }
		
		/**
		 * Override to specify logic that should occur after the attributed method block is executed.
		 * @param {a5.AspectCallArguments} Arguments for the context of the aspect;
		 */
		cls.after = function(rules, args, scope, method, callback, callOriginator, beforeArgs){ return AspectAttribute.NOT_IMPLEMENTED; }
		
		/**
		 * Override to specify logic that should occur both before and after the attributed method block is executed.
		 * @param {a5.AspectCallArguments} Arguments for the context of the aspect;
		 */
		cls.around = function(){ return AspectAttribute.NOT_IMPLEMENTED; }
});

a5.Package('a5')

	.Class('AspectCallArguments', function(cls, im, AspectCallArguments){
		
		var _rules, _args, _scope, _method, _callback, _beforeArgs;
		
		cls.AspectCallArguments = function(rules, args, scope, method, callback, beforeArgs){
			_rules = rules;
			_args = args;
			_scope = scope;
			_method = method;
			_callback = callback;
			_beforeArgs = beforeArgs;
		}
		
		/**
		 * Returns the rule parameters defined when the attribute was applied.
		 * @returns {Array}
		 */
		cls.rules = function(){ return _rules; }
		
		/**
		 * Returns the arguments being passed to the method.
		 * @returns {Array}
		 */
		cls.args = function(){ return _args; }
		
		/**
		 * Returns the scope of the method.
		 * @returns {a5.Object}
		 */
		cls.scope = function(){ return _scope; }
		
		/**
		 * Returns the definition of the wraped method, accessible for reflection purposes.
		 * @returns {Function}
		 */
		cls.method = function(){ return _method; }
		
		/**
		 * Returns a method that must be invoked with a return status when returning {@link AspectAttribute.ASYNC}.
		 * @return {Function}
		 */
		cls.callback = function(){ return _callback; }
		
		/**
		 * On after methods and after phase of around methods, returns the args passed to the before chain of the aspect.
		 */
		cls.beforeArgs = function(){ return _beforeArgs; }
})