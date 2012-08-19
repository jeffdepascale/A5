(function(){
	
	var windowItemList = null,
	
	GetNamespace = function(namespace, imports, allowGenericReturns){
		var splitNM, i, l, context;
		if(!namespace)
			return null;
		allowGenericReturns = allowGenericReturns || false;
		if(typeof namespace === 'object')
			return namespace;
		splitNM = namespace.split('.');
		context = window;
		if(splitNM.length === 1 && imports && imports[namespace])
			return imports[namespace];
		for(i= 0, l=splitNM.length; i<l; i++){
			context = context[splitNM[i]];
			if(context === undefined) return null;
		}
		if(allowGenericReturns || context.namespace !== undefined)
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
		object = splitNM.length ? _af_objectQualifier(splitNM) : window
		if (object[property] !== undefined)
			return object[property]; 
		return object[property] = autoCreate ? new placedObject() : placedObject;
	},	
	
	_af_objectQualifier = function(nmArr){
		var context = window,
			i, l;
		for(i = 0, l=nmArr.length; i<l; i++){
			if(!context[nmArr[i]]) context[nmArr[i]] = {};
			context = context[nmArr[i]];
		}
		return context;
	},
	
	TrackWindowStrays = function(){
		windowItemList = {};
		for(var prop in window)
			windowItemList[prop] = '';
	},
	
	GetWindowStrays = function(purge){
		if(!windowItemList)
			a5.ThrowError(101);
		else {
			var retList = [], prop
			for(prop in window)
				if(windowItemList[prop] === undefined)
					retList.push(prop);
			if(purge === true)
				TrackWindowStrays();
			return retList;
		}	
	}
	
	/**
	 * @name a5
	 * @namespace Houses all classes and OOP methods in the A5 model. 
	 */
	window.a5 = {
		/**#@+
	 	 * @memberOf a5
	 	 * @function
		 */
		
		/**
		 * @name version
		 * @type String
		 * @returns The version number of A5.
		 */
		version:function(){
			return  '0.5.{BUILD_NUMBER}';
		},
		/**
		 * @name buildDate
		 * @type String
		 * @returns The build date of the release of A5.
		 */
		buildDate:function(){
			return '{BUILD_DATE}';
		},
		
		/**
		 * Returns a class declaration for a given namespace string.
		 * @name GetNamespace
		 * @param {String} namespace
		 */
		GetNamespace:GetNamespace,
		
		/**
		 * Places a function or object in the specified namespace. If the namespace does not exist it is created.
		 * @name SetNamespace
		 * @param {String} namespace
		 * @param {Object|Function} placedObject
		 */
		SetNamespace:SetNamespace,
		
		TrackWindowStrays:TrackWindowStrays,
		
		GetWindowStrays:GetWindowStrays,
		
		_a5_destroyedObj:{},
		
		_a5_destroyedObjFunc:function(){
			var caller = arguments.callee.caller,
				prefix = "Destroyed method called from";
			if (caller._a5_methodName !== undefined) 
				throw prefix + " method '" + caller.getName() + "' in class '" + caller.getClass().className() + "'";
			else
				throw prefix + " function '" + caller.toString() + "'";
		}, 
		
		/**
		 * @name CreateGlobals
		 */
		CreateGlobals:function(){
			window.Create = a5.Create;
			window.Package = a5.Package;
			window.GetNamespace = a5.GetNamespace;
			window.SetNamespace = a5.SetNamespace;
			window.ThrowError = a5.ThrowError; 
		}
	}
})();