
a5.SetNamespace('a5.core.attributes', true, function(){
	
	createAttribute = function(scope, args){
		var attributes = Array.prototype.slice.call(args),
			method = attributes.pop(), i, j, k, l, t,
			attrObj = {};
		if(typeof method !== 'function')
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
					var isError = false;
					if(t !== 'string'){
						if(t === 'function'){
							if(!t.isA5 || !attr.doesExtend(a5.Attribute))
								isError = true;
						} else
							isError = true;
					}
					if(isError)
						return a5.ThrowError(303);
				} else {
					if(t !== 'object' || Object.prototype.toString.call(attr) === '[object Array]')
						return a5.ThrowError(304);
				}
				//validate all arrays, length at least one, first is string, all remaining are objects, not arrays
			}
		}
		for (i = 0, l = attributes.length; i < l; i++)
			attrObj[attributes[i].shift()] = attributes[i];
			
		var proxyFunc = function(){
			var callOriginator,
				prop,
				attrClasses = [], 
				executionScope = this,
				callOriginator
				count = 0;
			for(var prop in proxyFunc)
				method[prop] = proxyFunc[prop];
			if (proxyFunc.caller.getClassInstance !== undefined)
				callOriginator = proxyFunc.caller;
			for(prop in attrObj){
				var cls, clsInst, props;
				switch(typeof prop){
					case 'string':
						cls = a5.GetNamespace(prop, scope.imports());
						if(!cls)
							cls = a5.GetNamespace(prop + 'Attribute', scope.imports());
						break;
					case 'function':
						cls = prop;
						break;
					default:
						//throw error
						return;
				}
				if(!cls){
					return a5.ThrowError(309, null, {prop:prop});
				} else {
					clsInst = cls.instance(true);
					props = attrObj[prop];
					attrClasses.push({cls:clsInst, props:props});
				}
			}
			
			var processCB = function(args, isPost){
				processAttribute(count, args, isPost);
			},
			
			processAttribute = function(id, args, isPost){
				if (Object.prototype.toString.call(args) !== '[object Array]')
					args = [args];
				if (id >= attrClasses.length) {
					if (isPost) {
							return args[0];
					} else 						
						return processPost(args);
				}
				var ret, 
					isPost = isPost || false,
					isAsync = false,
					callback = function(_args){
						processCB.call(this, _args || args, isPost);	
					}			
				callback.prop = prop;
					ret = attrClasses[id].cls["method" + (isPost ? "Post" : "Pre")](attrClasses[id].props, args, executionScope, proxyFunc, callback, callOriginator);
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
					return a5.ThrowError(308, null, {prop:prop, method:isPost ? 'methodPost' : 'methodPre'});
				count++;
				if(!isAsync)
					return processAttribute(count, ret, isPost);
			},
			
			processPost = function(args){
				count = 0;
				var postRet = method.apply(executionScope, args);
				return processAttribute(count, postRet, true);
			},		
			
			preRet = processAttribute(count, Array.prototype.slice.call(arguments));
			return preRet;
		}
		proxyFunc._a5_attributes = attributes;
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