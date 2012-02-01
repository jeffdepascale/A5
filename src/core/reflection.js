
a5.SetNamespace('a5.core.reflection', true, function(){
	
	var proxyMethods = {
		getName:function(){	return this._a5_methodName;	},
		getClass:function(){ return this._a5_ownerClass; },
		getClassInstance:function(){ return this._a5_ownerInstance; },
		getAttributes:function(){ return this._a5_attributes ? this._a5_attributes : null; }
	},
	
	setReflection = function(cls, clsInstance, method, obj){
		obj = obj || clsInstance[method];
		obj._a5_ownerInstance = clsInstance;
		obj._a5_ownerClass = cls;
		obj._a5_methodName = method;
		obj.getName = proxyMethods.getName;
		obj.getClass = proxyMethods.getClass;
		obj.getClassInstance = proxyMethods.getClassInstance;
		obj.getAttributes = proxyMethods.getAttributes;
	}
	
	return {
		setReflection:setReflection
	}
});