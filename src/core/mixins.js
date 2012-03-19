
a5.SetNamespace('a5.core.mixins', {
	
	prepareMixins:function(inst){
		var scope = inst,
			mixinRef = inst.constructor._mixinRef,
			i, l, prop, cls;
		if(mixinRef.length){
			for (i = mixinRef.length - 1, l = -1; i > l; i--) {
				if(mixinRef[i]._a5_mixinMustExtend !== undefined){
					for (prop in mixinRef[i]._a5_mixinMustExtend) {
						cls = mixinRef[i]._a5_mixinMustExtend[prop];
						if (!inst.doesExtend(a5.GetNamespace(cls, inst.imports())))
							return a5.ThrowError(400, null, {nm:mixinRef[i].namespace()});
					}
				}			
			}						
		}	
	},
	
	initializeMixins:function(inst){
		var scope = inst,
			mixinRef = inst.constructor._mixinRef,
			i, l, prop, cls;
		if (mixinRef.length) {
			for (i = mixinRef.length - 1, l = -1; i > l; i--)
				if (mixinRef[i]._a5_mixinProps !== undefined) 
					mixinRef[i]._a5_mixinProps.call(scope);
			for(i = 0, l = mixinRef.length; i<l; i++)
				mixinRef[i]._a5_instanceConst.call(scope);
		}
	},
	
	mixinsReady:function(scope){
		var mixinRef = scope.constructor._mixinRef,
			i, l, prop, cls;
		if (mixinRef.length) {
			for (i = mixinRef.length - 1, l = -1; i > l; i--) {
				if(mixinRef[i]._a5_mixinMustMix !== undefined){
					for (prop in mixinRef[i]._a5_mixinMustMix) {
						cls = mixinRef[i]._a5_mixinMustMix[prop];
						if (!inst.doesMix(a5.GetNamespace(cls)))
							return a5.ThrowError(401, null, {nm:mixinRef[i].namespace(), cls:cls});
					}
				}
				if (typeof mixinRef[i].mixinReady === 'function') 
					mixinRef[i].mixinReady.call(scope);
			}
		}
	},
	
	applyMixins:function(sourceObj, mixins, imports, inst){
		var usedMethods = {},
			mixins = typeof mixins === 'string' ? [mixins] : mixins,
			mixinInsts = [],
			i, l, mixin;
			
		for (i = 0, l = mixins.length; i < l; i++) {
			mixin = a5.GetNamespace(mixins[i], typeof imports === 'function' ? imports() : imports);
			if(!mixin)
				return a5.ThrowError(404, null, {mixin:mixins[i]});
			mixinInsts.push(mixin);
			for (i = 0; i < sourceObj.constructor._mixinRef.length; i++)
				if (sourceObj.constructor._mixinRef[i] === mixin)
					return a5.ThrowError(402, null, {nm:mixin.namespace()});
			for (var method in mixin._mixinDef) {
				if (method !== 'dealloc' && method !== 'Properties' && method !== 'mixinReady' && method !== 'MustExtend' && method !== 'Contract') {
					if (usedMethods[method] === undefined) {
						if(inst === undefined)
							sourceObj.constructor._a5_mixedMethods[method] = mixin._mixinDef[method];
						sourceObj[method] = mixin._mixinDef[method];
						usedMethods[method] = 'mixed';
					} else
						return a5.ThrowError(403, null, {method:method});
				}
			}
			if(inst)
				a5.core.mixins.initializeMixins(inst, mixinInsts, inst);
			else
				sourceObj.constructor._mixinRef.push(mixin);
		}
	}
})