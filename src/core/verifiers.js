
a5.SetNamespace('a5.core.verifiers', {
	namespaceArray:[],
	validateImplementation:function(pkgObj, obj){
		var i, l, prop, implNM, testInst, impl, hasProp,
			compareObjs = function(obj1, obj2){
				for(var prop in obj1)
					if(obj1[prop] !== obj2[prop])
						return false;
				return true;
			};
		for (i = 0, l = pkgObj.implement.length; i<l; i++) {
			implNM = pkgObj.implement[i];
			try {
				testInst = new obj;
				testInst.Override = {};
				testInst.Final = {};
				testInst.Attributes = function(){
					var args = Array.prototype.slice.call(arguments);
					var func = args.pop();
					for(var i = 0, l = args.length; i<l; i++){
						var attr = args[i][0];
						if(attr === 'Contract' || attr === 'ContractAttribute' || attr === a5.ContractAttribute)
							func.attributes = args[i];
					}
					return func;
				}
				impl = a5.GetNamespace(implNM, obj.imports());
				if(obj._a5_clsDef)
					obj._a5_clsDef.call(testInst, testInst, obj.imports(), obj);
			} 
			catch (e) {
				throw e;
				return false;
			}
			if (!impl.isInterface())
				return a5.ThrowError(213, null, {implNM:impl.namespace(), objNM:obj.namespace()});
			for (prop in impl.interfaceVals) {
				hasProp = testInst[prop] !== undefined;
				var intProp = impl.interfaceVals[prop],
					testInstProp = testInst[prop];
				if(hasProp && 
					typeof intProp === 'object' && 
					testInstProp.attributes && 
					(testInstProp.attributes[0] === 'Contract' || 
						testInstProp.attributes[0] === 'ContractAttribute' || 
							testInstProp.attributes[0] === a5.ContractAttribute)){
					var isValid = true;
					for (var i = 0, l = intProp.length; i < l; i++)
						isValid = isValid && testInstProp.attributes.length >=(i+1) ? compareObjs(intProp[i], testInstProp.attributes[i+1]) : false;
					if(!isValid)
						return a5.ThrowError(601, null, {intNM:impl.namespace(), implNM:obj.namespace(), method:prop});
				}else if (!hasProp || (hasProp && typeof impl.interfaceVals[prop] !== typeof testInst[prop]))
					return a5.ThrowError(214, null, {implNM:impl.namespace(), objNM:obj.namespace()});
			}
			obj._implementsRef.push(impl);
			testInst.destroy();
		}
		return true;
	},
	
	checkNamespaceValid:function(namespace){
		for(var i = 0, l=this.namespaceArray.length; i<l; i++)
			if(this.namespaceArray[i] == namespace) 
				return false;
		this.namespaceArray.push(namespace);
		return true;
	},
	
	checkImplements:function(cls, implement){
		if(typeof implement === 'string')
			implement = a5.GetNamespace(implement);
		var imRef = cls._implementsRef, i, j, k, l;
		while (imRef) {
			for (i = 0, l = imRef.length; i < l; i++) 
				if (imRef[i] === implement) 
					return true;
			imRef = cls.superclass() ? cls.superclass().getStatic()._implementsRef : null;
		}
		return false;
	},
	
	checkExtends:function(cls, extend){
		var clsCheck = cls._a5_superclass && cls._a5_superclass.prototype.className ? cls._a5_superclass : null;
		if(!clsCheck) return false;
		var extendCheck = (typeof extend === 'string') ? a5.GetNamespace(extend) : extend;
		if(!extendCheck) return false;
		while(clsCheck){
			if(clsCheck === extendCheck) return true;
			clsCheck = clsCheck._a5_superclass && clsCheck._a5_superclass.prototype.className ? clsCheck._a5_superclass : null;
		}
		return false;
	},
	
	checkMixes:function(cls, mix){
		if(typeof mix === 'string')
			mix = a5.GetNamespace(mix);
		if(!mix)
			return false;
		for(var i = 0, l = cls._mixinRef.length; i<l; i++)
			if(cls._mixinRef[i] === mix)
				return true;
		return false;
	},
	
	validateClassDependencies:function(base, im, mixins, implement, isInterface, isMixin){
		var canCreate,
			reason,
			reasonNM,
			baseCls = null,
			prop, m, nm, i;
		if (base !== undefined) {
			if(typeof base === 'function') baseCls = base;
			else baseCls = a5.GetNamespace(base, im);
		}
		canCreate = true;
		if(base !== undefined && !baseCls){
			canCreate = false;
			reason = 'base';
			reasonNM = base;
		} 
		if(canCreate && mixins !== undefined){
			for(prop in mixins){
				m = mixins[prop];
				if(typeof m === 'string')
					nm = a5.GetNamespace(m, im);
				if (typeof nm !== 'function') {
					canCreate = false;
					reason = 'mixin';
					reasonNM = m;
				}
			}	
		}
		if(canCreate && implement !== undefined){
			for(prop in implement){
				i = implement[prop];
				if(typeof i === 'string')
					nm = a5.GetNamespace(i, im);
				if (typeof nm !== 'function') {
					canCreate = false;
					reason = 'interface';
					reasonNM = i;
				}
			}
		}	
		return canCreate ? true : {reason:reason, reasonNM:reasonNM};
	}
})