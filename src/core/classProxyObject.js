
/**
 * @name TopLevel
 * @namespace  
 */
a5.SetNamespace('a5.core.classProxyObj',{
	
	construct:{
		classPackage:function(getObj){ return getObj ? a5.GetNamespace(this._a5_pkg, null, true) : this._a5_pkg; },
		className:function(){ return this._a5_clsName; },
		namespace:function(){return this._a5_namespace; },
		imports:function(){ return this._a5_imports; },
		doesImplement:function(cls){ return a5.core.verifiers.checkImplements(this, cls); },
		doesExtend:function(cls){ return a5.core.verifiers.checkExtends(this, cls); },
		doesMix:function(cls){ return a5.core.verifiers.checkMixes(this, cls); },
		getAttributes:function(){ return this._a5_attributes; },
		getExtenders:function(){ return this._extenderRef; },
		getAncestors:function(){ return this._ancestorRef; },
		instance:function(autoCreate, args){
			if (autoCreate === true)
				return this._a5_instance || a5.Create(this, args);
			else
				return this._a5_instance;
		},
		superclass:function(scope, args){
			if (scope !== undefined){
				if (typeof scope === 'object' && scope.isA5 === true) {
					if (typeof args !== 'object') 
						args = [];
					if (!this._a5_superclass.className)
						return a5.ThrowError(210);
					var sclConst = this._a5_superclass.prototype.constructor._a5_instanceConst;
					if (sclConst) 
						sclConst.apply(scope, args);
					else a5.ThrowError(211, null, {nm:this._a5_superclass.className()});
				} else {
					a5.ThrowError(212, null, {nm:this.namespace()});
				}	
			} else {
				return this._a5_superclass.prototype;
			}	
		},
		instanceCount:function(){ return this._instanceCount; },
		isInterface:function(){ return this._a5_isInterface; },
		isFinal:function(){ return this._a5_isFinal; },
		isSingleton:function(){	return this._a5_isSingleton; },
		isAbstract:function(){ return this._a5_isAbstract; },
		isPrototype:function(){ return this._a5_isPrototype; },
		isA5ClassDef:function(){ return true },
		isA5:true
	},
	instance:{
		
		isA5:true,
		isA5ClassDef:function(){ return false },
		
		getStatic:function(){ return this.constructor; },
		
		/**
		 * Returns a reference to the parent class of the object. Returns null if calling class is final parent.
		 * @name superclass
		 * @param {Object} scope
		 * @param {Object} args
		 */
		superclass:function(scope, args){ 
			return this.constructor.superclass(scope, args); 
		},
		
		async:function(func, args){
			return a5.Async.apply(this, arguments);
		},
		
		cycle:function(){
			return a5.Cycle.apply(this, arguments);
		},
		
		getAttributes:function(){
			return this.constructor.getAttributes();
		},
		
		getAttributeValue:function(value){
			return this.constructor.getAttributeValue(value);
		},
		
		getMethods:function(includeInherited, includePrivate){
			var retArray = [];
			for(var prop in this)
				if((includeInherited || ({}).hasOwnProperty.call(this, prop)) && 
					typeof(this[prop]) === 'function' && 
					a5.core.classProxyObj.instance[prop] === undefined && 
					prop !== "Super" &&
					prop.substr(0, 4) !== '_a5_' &&
					(includePrivate || prop.substr(0, 1) !== '_'))
						retArray.push(this[prop]);
			return retArray;
		},
		getProperties:function(includeInherited, includePrivate){
			var retArray = [],
			checkInAncestor = function(obj, prop){
				var descenderRef = obj;
				while (descenderRef !== null) {
					var dConst = descenderRef.constructor;
					if (dConst._a5_protoProps !== undefined) {
						var ref = {};
						dConst._a5_protoProps.call(ref);
						if (ref[prop] !== undefined)
							return true;
					}
					descenderRef = dConst.superclass && 
									dConst.superclass().constructor.namespace ? 
									dConst.superclass() : null;
				}
				return false;
			}
			for(var prop in this)
				if((includeInherited || !checkInAncestor(this, prop)) && 
					typeof(this[prop]) !== 'function' && 
					a5.core.classProxyObj.instance[prop] === undefined && 
					prop.substr(0, 4) !== '_a5_' &&
					(includePrivate || prop.substr(0, 1) !== '_'))
						retArray.push(prop);
			return retArray;
		},
		
		/**
		 * @name classPackage
		 */
		classPackage:function(getObj){ return this.constructor.classPackage(getObj); },
		
		/**
		 * @name className
		 */
		className:function(){ return this.constructor.className(); },
		
		/**
		 * @name getClass
		 */			
		getClass:function(){ return this.constructor; },
		
		/**
		 * Returns the namespace of the class.
		 * @name namespace
		 * @type String
		 */
		namespace:function(){return this.constructor.namespace(); },
		
		/**
		 * @name doesImplement
		 * @param {Object} cls
		 */
		doesImplement:function(cls){ return this.constructor.doesImplement(cls) },
		
		/**
		 * @name doesExtend
		 * @param {Object} cls
		 */
		doesExtend:function(cls){ return this.constructor.doesExtend(cls) },
		
		/**
		 * @name doesMix
		 * @param {Object} cls
		 */
		doesMix:function(cls){ return this.constructor.doesMix(cls) },
		
		/**
		 * @name imports
		 */
		imports:function(){ return this.constructor.imports() },
		
		/**
		 * Called automatically upon {@link TopLevel#destroy} being called. This method should be implemented on the class level to properly deallocate.
		 * @name dealloc
		 */
		dealloc:function(){ },
		
		/**
		 * Returns the number of instances of the object.
		 * @name instanceCount
		 */
		instanceCount:function(){ return this.constructor.instanceCount(); },
		
		/**
		 * @name isInterface
		 */
		isInterface:function(){ return this.constructor.isInterface(); },
		
		/**
		 * @name isFinal
		 */
		isFinal:function(){ return this.constructor.isFinal();	},
		
		/**
		 * @name isSingleton
		 */
		isSingleton:function(){	return this.constructor.isSingleton(); },
		
		/**
		 * @name isAbstract
		 */
		isAbstract:function(){ return this.constructor.isAbstract(); },
		
		/**
		 * @name isPrototype
		 */
		isPrototype:function(){ return this.constructor.isAbstract(); },
		
		/**
		 * Returns a unique identifier for the class instance comprised of the namespace and the instanceCount for the class instance.
		 * @name instanceUID
		 */
		instanceUID:function(){
			return this._a5_instanceUID;
		},
		
		/**
		 * Destroys an instance of an object and removes it from its ancestor instance chains and fires the destroy chain through the instances prototype chain {@link TopLevel#dealloc} methods. This method should not be overriden.
		 * @name destroy
		 */
		destroy:function(){
			if (this._a5_initialized === true) {
				var descenderRef = this,
					instanceRef,
					nextRef,
					mixinRef,					
					prop,
					i, l;
				while (descenderRef !== null) {
					var dConst = descenderRef.constructor;
					mixinRef = dConst._mixinRef;
					if(mixinRef && mixinRef.length){
						for (i = 0, l = mixinRef.length; i < l; i++)
							if(mixinRef[i]._mixinDef.dealloc != undefined)
								mixinRef[i]._mixinDef.dealloc.call(this);
					}
					if (dConst.namespace) {
						nextRef = dConst.superclass ? dConst.superclass() : null;
						if (nextRef && nextRef.dealloc !== undefined && nextRef.dealloc !== descenderRef.dealloc) descenderRef.dealloc.call(this);
						descenderRef = nextRef;
					} else {
						descenderRef = null;
					}
				}	
				if(this.constructor._a5_instance === this)
					this.constructor._a5_instance = null;
				for (prop in this)
					if(typeof this[prop] === 'object') 
						this[prop] = null;
				this._a5_initialized = false;
			}
		}
	}
})