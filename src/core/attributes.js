
a5.SetNamespace('a5.core.attributes', true, function(){
	
	var createAttribute = function(scope, args){
		var attributes = Array.prototype.slice.call(args),
			method, i, j, k, l, t,
			attrObj = {},
			isAspect = false;
		if(!attributes.length)
			return a5.ThrowError(305);
		method = typeof attributes[attributes.length-1] === 'function' ? attributes.pop() : null;
		if(method !== null && typeof method !== 'function')
			return a5.ThrowError(300);
		if (!attributes.length)
			return a5.ThrowError(301);
		for(i = 0, l = attributes.length; i<l; i++){
			var attrDef = attributes[i];
			if(Object.prototype.toString.call(attrDef) !== '[object Array]')
				return a5.ThrowError(302);
			for(j = 0, k = attrDef.length; j <k; j++){
				var attr = attrDef[j],
					t = typeof attr;
				if(j == 0){
					var isError = false,
						clsDef = null;
					if(t !== 'string'){
						if(t === 'function'){
							clsDef = attr;
						} else
							isError = true;
					} else {
						var cls = a5.GetNamespace(attr, scope.imports());
						if(!cls)
							cls = a5.GetNamespace(attr + 'Attribute', scope.imports());
						if(cls)
							clsDef = attrDef[j] = cls;
						else
							isError = true;
					}
					if(!isError && (!clsDef.isA5 || !clsDef.doesExtend(a5.Attribute)))
						isError = true;
					else if(clsDef.doesExtend(a5.AspectAttribute))
						isAspect = true;
					if(isError)
						return a5.ThrowError(303);
				} else {
					if(t !== 'object' || Object.prototype.toString.call(attr) === '[object Array]')
						return a5.ThrowError(304);
				}
				//validate all arrays, length at least one, first is string, all remaining are objects, not arrays
			}
		}
		for (i = 0, l = attributes.length; i < l; i++) {
			var arr = attributes[i],
				vals = [];
			for(var j = 1, k = arr.length; j<k; j++)
				vals.push(arr[j]);
			attributes[i] = [arr[0], vals];
			attrObj[arr[0].className()] = vals;
		}
		
		attrObj.wrappedMethod = method;
			
		var proxyFunc = function(){
			var callOriginator,
				prop,
				attrClasses = [], 
				executionScope = this,
				callOriginator,
				count = 0;
			if(method)
				for(var prop in proxyFunc)
					method[prop] = proxyFunc[prop];
			if (proxyFunc.caller.getClassInstance !== undefined)
				callOriginator = proxyFunc.caller;
			for(var i = 0, l = attributes.length; i<l; i++){
				var cls = attributes[i][0],
					clsInst = cls.instance(true),
					props = attributes[i][1];
				attrClasses.push({cls:clsInst, props:props});
			}
			
			var processCB = function(args, isAfter, beforeArgs){
				processAttribute(count, args, isAfter, beforeArgs);
			},
			
			processAttribute = function(id, args, isAfter, beforeArgs){
				if (args) {
					if (Object.prototype.toString.call(args) !== '[object Array]') 
						args = [args];
				} else {
					args = [];
				}
				if(!beforeArgs)
					beforeArgs = args;
				if (id >= attrClasses.length) {
					if (isAfter) {
						return args[0];
					} else 						
						return processAfter(args, beforeArgs);
				}
				var ret, 
					isAfter = isAfter || false,
					isAround = false,
					isAsync = false,
					callback = function(_args){
						processCB.call(this, _args || args, isAfter, beforeArgs);	
					}	
					ret = attrClasses[id].cls.around(attrClasses[id].props, args, executionScope, proxyFunc, callback, callOriginator, beforeArgs);
					if(ret === a5.AspectAttribute.NOT_IMPLEMENTED)
						ret = attrClasses[id].cls[(isAfter ? "after" : "before")](attrClasses[id].props, args, executionScope, proxyFunc, callback, callOriginator, beforeArgs);
					else
						isAround = true;
				if (ret !== null && ret !== undefined) {
					switch(ret){
						case a5.Attribute.SUCCESS:
							ret = args;
							break;
						case a5.Attribute.ASYNC:
							isAsync = true;
							break;
						case a5.Attribute.RETURN_NULL:
							ret = null;
							break;
						case a5.Attribute.FAILURE:
							return;
					}
				} else
					return a5.ThrowError(308, null, {prop:prop, method:isAround ? 'around' : (isAfter ? 'after' : 'before')});
				count = id+1;
				if(!isAsync)
					return processAttribute(count, ret, isAfter, args, beforeArgs);
			},
			
			processAfter = function(args, beforeArgs){
				count = 0;
				var postRet = method ? method.apply(executionScope, args) : undefined;
				if(postRet !== undefined)
					postRet = [postRet];
				else
					postRet = args;
				return processAttribute(0, postRet, true, preArgs);
			}			
			return processAttribute(count, Array.prototype.slice.call(arguments));
		}
		proxyFunc._a5_attributes = attrObj;
		return proxyFunc;
	},
	
	createAttribs = function(){
		for(i = 0, l=a5.Attribute._extenderRef.length; i<l; i++)
			a5.Create(a5.Attribute._extenderRef[i]);
	},
	
	processInstance = function(cls){
		var attrs = cls.getClass().getAttributes();
		//process instanceProcess, return
		return cls;
	}
	
	return {
		createAttribute:createAttribute,
		processInstance:processInstance
	}
});
