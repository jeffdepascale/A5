
a5.Package('a5')

	.Extends('Attribute')
	.Class('SynchronizedAttribute', function(cls){
		
		var lockedScopes = {};
		
		cls.SynchronizedAttribute = function(){
			cls.superclass(this);
		}
		
		cls.Override.methodPre = function(typeRules, args, scope, method, callback){
			if (lockedScopes[scope.namespace()] === true) {
				cls.throwError(625, null, {methodName:method.getName(), nm:scope.namespace()})
			} else {
				lockedScopes[scope.namespace()] = true;
			}
		}
		
		cls.Override.methodPost = function(typeRules, args, scope, method, callback){
			delete lockedScopes[scope.namespace()];
		}
		
});