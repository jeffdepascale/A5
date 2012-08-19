
/**
 * @name TopLevel
 * @namespace  
 */
a5.SetNamespace('a5.core.classProxyObj',{
	
	construct:{
		classPackage:function(getObj){ return getObj ? a5.GetNamespace(this._a5_pkg, null, true) : this._a5_pkg; },
		className:function(){ return this._a5_clsName; },
		namespace:function(){return this._a5_namespace; },
		imports:function(){ return this._a5_imports ? this._a5_imports():{}; },
		doesImplement:function(cls){ return a5.core.verifiers.checkImplements(this, cls); },
		doesExtend:function(cls){ return a5.core.verifiers.checkExtends(this, cls); },
		doesMix:function(cls){ return a5.core.verifiers.checkMixes(this, cls); },
		getAttributes:function(){ return this._a5_attributes; },
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
		/**#@+
 		 * @memberOf TopLevel#
 		 * @function
	 	 */
		isA5:true,
		isA5ClassDef:function(){ return false },
		
		getStatic:function(){
			return this.constructor;
		},
		
		/**
		 * Returns a reference to the parent class of the object. Returns null if calling class is final parent.
		 * @name superclass
		 * @param {Object} scope
		 * @param {Object} args
		 */
		superclass:function(scope, args){ 
			return this.constructor.superclass(scope, args); 
		},	
		
		mixins:function(namespace){
			if (namespace !== undefined)
				return GetNamespace(namespace, this.imports());
			else
				return this.constructor._a5_mixedMethods;
		},
		
		mix:function(cls){
			a5.core.mixins.applyMixins(this, cls, this.imports(), this);
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
					prop.substr(0, 4) !== '_a5_' &&
					(includePrivate || prop.substr(0, 1) !== '_'))
						retArray.push(prop);
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
				if ((this.namespace() === 'a5.cl.CL' || this.classPackage().indexOf('a5.cl.core') !== -1) && !this.classPackage() === 'a5.cl.core.viewDef') {
					a5.ThrowError(215, null, {nm:this.namespace()});
					return;
				}
				this._a5_initialized = false;
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
						if (nextRef && nextRef.dealloc !== descenderRef.dealloc) descenderRef.dealloc.call(this);
						descenderRef = nextRef;
					} else {
						descenderRef = null;
					}
				}	
				if(this.constructor._a5_instance === this)
					this.constructor._a5_instance = null;
				for (prop in this) {
					if(typeof this[prop] == 'function'){
						this[prop] = a5._a5_destroyedObjFunc;
					} else {
						this[prop] = null;
						delete this[prop];
					}
				}
				if(this.__proto__)
					this.__proto__ = a5._a5_destroyedObj;
			}
		},
		_a5_initialize: function(args){
			if (!this._a5_initialized) {
				if (this.constructor.isAbstract() && this._a5_initialize.caller.caller !== Extend)
					return a5.ThrowError(216, null, {nm:this.constructor.namespace()});
				this._a5_initialized = true;
				if (this.constructor.isSingleton() && this.constructor._a5_instance !== null)
					return a5.ThrowError(217, null, {nm:this.constructor.namespace()});	
				this._a5_instanceUID = this.namespace().replace(/\./g, '_') + '__' + this.constructor.instanceCount();
				if(this.instanceCount() === 0)
					this.constructor._a5_instance = this;
				this.constructor._instanceCount++;				
				var self = this,
					descenderRef = this,
					_args = args || [],
					protoPropRef = [],
					cs, i, l, mixinRef;
				
				this._a5_privatePropsRef = {};
				if (typeof this.constructor._a5_instanceConst !== 'function')
					return a5.ThrowError(218, null, {clsName:this.className()});
				while (descenderRef !== null) {
					var dConst = descenderRef.constructor;
					if (dConst._a5_attribs)
						a5.core.attributes.applyClassAttribs(this, dConst._a5_attribs);
					if (dConst._a5_protoPrivateProps !== undefined) {
						this._a5_privatePropsRef[descenderRef.namespace()] = {};
						dConst._a5_protoPrivateProps.call(this._a5_privatePropsRef[descenderRef.namespace()]);
					}
					if(dConst._a5_protoProps !== undefined)
						protoPropRef.unshift(dConst._a5_protoProps);
						
					descenderRef = dConst.superclass && 
									dConst.superclass().constructor.namespace ? 
									dConst.superclass() : null;
				}
				a5.core.mixins.initializeMixins(this);
				for(i = 0, l = protoPropRef.length; i<l; i++)
					protoPropRef[i].call(this);
				this.constructor._a5_instanceConst.apply(this, _args);
				a5.core.mixins.mixinsReady(this);
				return true;
			} else
				return null; 
		},
		
		/**
		 * @name create
		 * @see a5.Create
		 */
		create:a5.Create,
		
		throwError: function(){
			return a5.ThrowError.apply(this, arguments);
		},

		
		/**
		 * @name assert
		 * @param {Object} exp
		 * @param {Object} err
		 */
		assert:function(exp, err){
			if (exp !== true)
				throw this.create(a5.AssertException, [err]);
		}
	}
	
	/**#@-*/
})