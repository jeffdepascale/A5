
	
    var globalItemList = null,
        namespaceResolver = null,
	
	GetNamespace = function(namespace, imports, allowGenericReturns){
		var splitNM, i, l, context;
		if(!namespace)
			return null;
		allowGenericReturns = allowGenericReturns || false;
		if(typeof namespace === 'object')
			return namespace;
		splitNM = namespace.split('.');
		context = global;
		if(splitNM.length === 1 && imports && imports[namespace])
			return imports[namespace];
		for(i= 0, l=splitNM.length; i<l; i++){
			context = context[splitNM[i]];
			if (context === undefined) {
				if (namespaceResolver) {
					try {
						var result = namespaceResolver(namespace, imports);
						if (result) 
							return result;
					} catch(e){
						return null;
					}
				}
				else 
					return null;
			}
		}
		if (allowGenericReturns || context.namespace !== undefined)
		    return context;
		return null;
	},
	SetNamespace = function(namespace, arg1, arg2){
		var hasBool = typeof arg1 === 'boolean',
			autoCreate = hasBool ? arg1:false,
			splitNM,
			placedObject = (hasBool ? arg2:arg1) || {},
			splitNM = namespace.split('.'),
			property = splitNM.pop(),
			object;
		if(!namespace.match(/^[A-Za-z0-9.]*$/))
			return a5.ThrowError(100, null, {namespace:namespace});
		object = splitNM.length ? objectQualifier(splitNM) : global
		if (object[property] !== undefined)
			return object[property]; 
		return object[property] = autoCreate ? new placedObject() : placedObject;
	},	
	
	objectQualifier = function(nmArr){
		var context = global,
			i, l;
		for(i = 0, l=nmArr.length; i<l; i++){
			if(!context[nmArr[i]]) context[nmArr[i]] = {};
			context = context[nmArr[i]];
		}
		return context;
	},
	
	TrackGlobalStrays = function(){
		globalItemList = {};
		for(var prop in global)
			globalItemList[prop] = '';
	},
	
	GetGlobalStrays = function(purge){
		if(!globalItemList)
			a5.ThrowError(101);
		else {
			var retList = [], prop
			for(prop in global)
				if(globalItemList[prop] === undefined)
					retList.push(prop);
			if(purge === true)
				TrackGlobalStrays();
			return retList;
		}	
	}
	
	global.a5 = {
		Version:function(){ return '0.5.{BUILD_NUMBER}'; },	
		GetNamespace:GetNamespace,	
		SetNamespace:SetNamespace,	
		TrackGlobalStrays:TrackGlobalStrays,
		GetGlobalStrays:GetGlobalStrays,
		RegisterNamespaceResolver: function (resolver) { namespaceResolver = resolver; },
		CreateGlobals:function(){
			global.Create = a5.Create;
			global.Package = a5.Package;
			global.GetNamespace = a5.GetNamespace;
			global.SetNamespace = a5.SetNamespace;
		}
	}