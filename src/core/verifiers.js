
a5.SetNamespace('a5.core.verifiers', {
	namespaceArray:[],
	validateImplementation:function(pkgObj, obj){
		var i, l, prop, implNM, testInst, impl, hasProp;
		for (i = 0, l = pkgObj.implement.length; i<l; i++) {
			implNM = pkgObj.implement[i];
			try {
				testInst = new obj(); 
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
				if (!hasProp || (hasProp && typeof impl.interfaceVals[prop] !== typeof testInst[prop]))
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
			implement = GetNamespace(implement);
		var imRef = cls._implementsRef, i, l;
		for(i = 0, l=imRef.length; i<l; i++)
			if(imRef[i] === implement)
				return true;
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