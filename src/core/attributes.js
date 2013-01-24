
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
					else if(!isError && clsDef.doesExtend(a5.AspectAttribute))
						isAspect = true;
					if (isError) {
						return a5.ThrowError(303);
					}
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
		
		if (!isAspect) {
			if(!method)
				method = function(){};
			method._a5_attributes = attrObj;
			return method;
		}

		attrObj.wrappedMethod = method;
			
		var proxyFunc = function(){
			var callOriginator,
				prop,
				pCaller,
				attrClasses = [], 
				executionScope = this,
				callOriginator,
				count = 0;
			if(method)
				for(var prop in proxyFunc)
					method[prop] = proxyFunc[prop];
			pCaller = proxyFunc.caller;
			do{
				if (pCaller.getClassInstance !== undefined)
					callOriginator = pCaller;
				else	
					pCaller = pCaller.caller;
			} while (pCaller !== null && !callOriginator);
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
					var argsObj = new a5.AspectCallArguments(attrClasses[id].props, args, executionScope, proxyFunc, callback, callOriginator, beforeArgs);
					ret = attrClasses[id].cls.around(argsObj);
					if(ret === a5.AspectAttribute.NOT_IMPLEMENTED)
						ret = attrClasses[id].cls[(isAfter ? "after" : "before")](argsObj);
					else
						isAround = true;
				if (ret !== null && ret !== undefined) {
					switch(ret){
						case a5.AspectAttribute.NOT_IMPLEMENTED:
						case a5.AspectAttribute.SUCCESS:
							ret = args;
							break;
						case a5.AspectAttribute.ASYNC:
							isAsync = true;
							break;
						case a5.AspectAttribute.RETURN_NULL:
							ret = null;
							break;
						case a5.AspectAttribute.FAILURE:
							return;
					}
				} else {
					return a5.ThrowError(308, null, {prop:prop, method:isAround ? 'around' : (isAfter ? 'after' : 'before')});
				}
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
				return processAttribute(0, postRet, true, beforeArgs);
			}			
			return processAttribute(count, Array.prototype.slice.call(arguments));
		}
		proxyFunc._a5_attributes = attrObj;
		return proxyFunc;
	},
	
	createAttribs = function(){
		for(i = 0, l=a5.Attribute._extenderRef.length; i<l; i++)
			new a5.Attribute._extenderRef[i]();
	},
	
	validMName = function(methodName, str){
		var split = str.split('|');
		for(var i = 0, l=split.length; i<l; i++){
			var r = split[i],
				beginW = r.charAt(0) === '*',
				endW = r.charAt(r.length-1) === '*',
				index = methodName.indexOf(r),
				isMatch = index !== -1;
			if (isMatch)
				return true;
			if(beginW && methodName.indexOf(r.substr(1)) === 0)
				return true;
			if(endW && methodName.indexOf(r.substr(0, r.length-1)) > -1)
				return true;
		}
		return false;
	},
	
	applyClassAttribs = function(cls, attribs){
		var methods = cls.getMethods(),
			slice = Array.prototype.slice;
		for (var i = 0, l = methods.length; i < l; i++) {
			var methodName = methods[i],
					method = cls[methodName],
					appliedAttribs = [];
			for(var j = 0, k=attribs.length; j<k; j++){	
				var attr = slice.call(attribs[j]);
				if (attr.length > 1) {
					var ruleObj = attr[attr.length-1],
						validRuleObj = false,
						validMethod = true,
						incl = ruleObj.include,
						excl = ruleObj.exclude;
					if(incl !== undefined){
						validRuleObj = true;
						if(typeof incl === 'object')
							validMethod = methodName.match(incl).length > 0;
						else
							validMethod = validMName(methodName, incl);
					}
					if(excl !== undefined){
						validRuleObj = true;
						if(typeof excl === 'object')
							validMethod = methodName.match(excl);
						else
							validMethod = validMName(methodName, excl);
					}
					if(validRuleObj)
						attr.pop();
					if(validMethod)
						appliedAttribs.push(attr);
				} else {
					appliedAttribs.push(attr);
				}
			}
			if (appliedAttribs.length) {
				appliedAttribs.push(method);
				cls[methodName] = a5.core.attributes.createAttribute(cls, appliedAttribs);
				a5.core.reflection.setReflection(cls.constructor, cls, methodName, cls[methodName]);
			}
		}
	}
	
	return {
		createAttribute:createAttribute,
		applyClassAttribs:applyClassAttribs
	}
});
