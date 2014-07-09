
a5.SetNamespace('a5.core.classBuilder', true, function(){
	
	var packageQueue = [], 
		delayProtoCreation = false, 
		queuedPrototypes = [], 
		queuedImplementValidations = [], 
		prop, 
		uidWriter = null,
		FROM_CREATE = '_a5_constructFromCreate', 
		BASE_CONSTRUCT = "_a5_baseConstruct", 
		INTERFACE_TEST = '_a5_interfaceTest',
		watchImports = {},
		
	Create = function(classRef, args){
		var ref, retObj;
		if (typeof classRef === 'string') {
			ref = a5.GetNamespace(classRef);
			if (ref === null) 
				return a5.ThrowError(207, null, { className: classRef });
		} else 
			ref = classRef;
		if (typeof ref !== 'function') 
			return a5.ThrowError(207, null, { className: classRef });
		return new ref(FROM_CREATE, args);
	}, 
	
	updateWatches = function(pkg, clsName, obj){
		var i, l, pkgName = pkg.replace(/\./g, '_');
		if(watchImports[pkgName]){
			var arr = watchImports[pkgName];
			for(var i = 0, l = arr.length; i<l; i++)
				if(!arr[i][clsName])
					arr[i][clsName] = obj;
		}
		if(watchImports[pkgName + "_" + clsName]){
			var arr = watchImports[pkgName + "_" + clsName];
			for(i = 0, l = arr.length; i<l; i++)
				if(!arr[i][clsName])
					arr[i][clsName] = obj;
			delete watchImports[pkgName + "_" + clsName];
		}
	},
	
	processDeclaration = function(owner, scope, obj, imports, stRef, isProto){
		if (isProto)
			scope.Properties = function(propFunc){ obj.constructor._a5_protoProps = propFunc; }
		scope.Attributes = function(){ return a5.core.attributes.createAttribute.call(obj, scope, arguments); }
		obj.Override = {};
		obj.Final = {};
		owner.call(scope, obj, imports, stRef);
		a5.core.mixins.prepareMixins(obj);
		processMethodChangers(obj);
		delete scope.Attributes;	
		if (isProto)
			delete scope.Properties;
		delete obj.Final;
		delete obj.Override;
		for (prop in obj) {
			if (({}).hasOwnProperty.call(obj, prop) &&
			typeof obj[prop] === 'function' &&
			(stRef._a5_namespace === 'a5.Object' || a5.core.classProxyObj.instance[prop] === undefined)) {
				if (prop === obj.className()) {
					obj.constructor._a5_instanceConst = obj[prop];
					a5.core.reflection.setReflection(stRef, obj, prop, obj.constructor._a5_instanceConst);
					delete obj[prop];
				} else {
					a5.core.reflection.setReflection(stRef, obj, prop);
				}
			}
		}
	}, 
	
	processMethodChangers = function(obj){
		var sc = obj.superclass(), mixinRef = obj.constructor._a5_mixedMethods;
		if (!sc) 
			sc = {};
		for (prop in obj) {
			if (obj.hasOwnProperty(prop) && typeof obj[prop] === 'function') {
				if (prop !== 'Final' && prop !== 'Override' && prop !== 'constructor' && prop !== 'prototype' && prop !== 'dealloc' && prop !== '_a5_initialized') {
					if (sc[prop] && sc[prop].toString().indexOf('[native code]') === -1) {
						if (sc[prop].Final == true) 
							return a5.ThrowError(201, null, { prop: prop, namespace: obj.namespace() });
						return a5.ThrowError(200, null, { prop: prop, namespace: obj.namespace() });
					} else {
						var mixMethod = mixinRef[prop];
						if (mixinRef[prop] !== undefined && mixMethod !== obj[prop]) {
							return a5.ThrowError(220, null, { prop: prop, namespace: obj.namespace() });
						}
					}
				}
			}
		}
		obj.constructor._a5_superMethods = {};
		for (prop in obj.Override) {
			if (sc[prop] === undefined && mixinRef[prop] === undefined) 
				return a5.ThrowError(202, null, { prop: prop, namespace: obj.namespace() });
			if (sc[prop] && sc[prop].Final !== undefined && sc[prop].Final === true || mixinRef[prop] && mixinRef[prop].Final !== undefined && mixinRef[prop].Final === true) 
				return a5.ThrowError(203, null, { prop: prop, namespace: obj.namespace() });
			obj[prop] = obj.Override[prop];
			obj.constructor._a5_superMethods[prop] = (function(method){
				return function(){
					var args = [].slice.call(arguments, 1), context = this;
					return function(){ return method.apply(context, args); };
				}
			})(sc[prop]);
		}
		for (prop in obj.Final) {
			obj[prop] = obj.Final[prop];
			obj[prop].Final = true;
		}
	}, 
	
	Package = function(pkg){
		var imports, clsName, cls, base, type, proto, implement, mixins, attribs = null, staticMethods = false, isMixin = false, isInterface = false, enumDeclaration = false, isProto = false, 
			process = function(){
				var pkgObj = {
					pkg: pkg,
					imports: processImports(imports, pkg),
					clsName: clsName,
					cls: cls,
					base: base,
					attribs: attribs,
					type: type,
					proto: proto,
					implement: implement,
					mixins: mixins,
					staticMethods: staticMethods,
					isInterface: isInterface,
					isMixin: isMixin,
					enumDeclaration: enumDeclaration,
					isProto: isProto
				}, validationResult = a5.core.verifiers.validateClassDependencies(base, pkgObj.imports, mixins, implement, isInterface, isMixin);
				if (validationResult === true) 
					processClass(pkgObj);
				else 
					packageQueue.push({
						pkg: pkgObj,
						reason: validationResult.reason,
						reasonNM: validationResult.reasonNM
					});
				process = Import = Extends = Implements = Static = Interface = Class = Prototype = Mixin = Mix = Enum = null;
			}, 
			Import = function(){
				imports = Array.prototype.slice.call(arguments);
				return {
					Prototype: Prototype,
					Static: Static,
					Mixin: Mixin,
					Mix: Mix,
					Extends: Extends,
					Implements: Implements,
					Interface: Interface,
					Class: Class
				};
			}, 
			Extends = function(str){
				base = str;
				return {
					Prototype: Prototype,
					Static: Static,
					Import: Import,
					Mix: Mix,
					Implements: Implements,
					Interface: Interface,
					Class: Class
				};
			}, 
			Mix = function(){
				mixins = Array.prototype.slice.call(arguments);
				return {
					Prototype: Prototype,
					Static: Static,
					Extends: Extends,
					Implements: Implements,
					Interface: Interface,
					Class: Class
				};
			}, 
			Implements = function(arr){
				implement = Array.prototype.slice.call(arguments);
				return {
					Prototype: Prototype,
					Static: Static,
					Mix: Mix,
					Import: Import,
					Extends: Extends,
					Class: Class
				};
			}, 
			Static = function(name, func){
				if (typeof name === 'string') {
					clsName = name;
					staticMethods = func;
					process();
				} else {
					staticMethods = name;
					return {
						Prototype: Prototype,
						Implements: Implements,
						Mix: Mix,
						Mixin: Mixin,
						Import: Import,
						Extends: Extends,
						Class: Class
					};
				}
			}, 
			Interface = function(str, $cls){
				clsName = str;
				cls = $cls;
				isInterface = true;
				process();
			}, 
			Mixin = function(){
				isMixin = true;
				var args = Array.prototype.slice.call(arguments);
				clsName = args[0];
				for (var i = 1, l = args.length; i < l; i++) {
					switch (typeof args[i]) {
						case 'string':
							type = args[i];
							break;
						case 'object':
							if (Object.prototype.toString.call(args[i]) === '[object Array]') {
								if (!attribs) 
									attribs = [];
								attribs.push(args[i]);
							}
							break;
						case 'function':
							cls = args[i];
							break;
					}
				}
				process();
			}, 
			Enum = function(name, func){
				clsName = name;
				enumDeclaration = func;
				process();
			}, 
			Class = function(){
				var args = Array.prototype.slice.call(arguments);
				clsName = args[0];
				for (var i = 1, l = args.length; i < l; i++) {
					switch (typeof args[i]) {
						case 'string':
							type = args[i];
							break;
						case 'object':
							if (Object.prototype.toString.call(args[i]) === '[object Array]') {
								if (!attribs) 
									attribs = [];
								attribs.push(args[i]);
							}
							break;
						case 'function':
							cls = args[i];
							break;
					}
				}
				process();
			}, 
			Prototype = function(){
				isProto = true;
				var args = Array.prototype.slice.call(arguments);
				clsName = args[0];
				for (var i = 1, l = args.length; i < l; i++) {
					switch (typeof args[i]) {
						case 'string':
							type = args[i];
							break;
						case 'object':
							if (Object.prototype.toString.call(args[i]) === '[object Array]') {
								if (!attribs) 
									attribs = [];
								attribs.push(args[i]);
							}
							break;
						case 'function':
							proto = args[i];
							break;
					}
				}
				process();
			}
		
			a5.SetNamespace(pkg);
		
			return { Enum: Enum, Static: Static, Import: Import, Extends: Extends, Mixin: Mixin, Mix: Mix, Implements: Implements, Class: Class, Prototype: Prototype, Interface: Interface };
	}, 
	
	hashString = function(str){
		var h = 0;
		if (!str.length) 
			return h;
		for (var i = 0; i < str.length; i++) {
			h = ((h<<5)-h)+str.charCodeAt(i);
			h = h & h;
	    }
		return Math.abs(h);
	},
	
	Initialize = function(args, createArgs){
		if (!this._a5_initialized) {
			if (this.constructor.isInterface()) 
				return a5.ThrowError(208, null, { nm: ref.namespace() });
			if (this.constructor.isAbstract()) 
				return a5.ThrowError(216, null, { nm: this.constructor.namespace() });
			if (this.constructor.isSingleton() && this.constructor._a5_instance !== null) 
				return a5.ThrowError(217, null, { nm: this.constructor.namespace() });
			var self = this, descenderRef = this, _args = args || [], protoPropRef = [], cs, i, l, mixinRef;
			this._a5_initialized = true;
			this._a5_instanceUID = hashString(this.namespace() + this.constructor.instanceCount());
			if(uidWriter)
				this._a5_instanceUID = uidWriter(this, this._a5_instanceUID);
			if (this.instanceCount() === 0) 
				this.constructor._a5_instance = this;
			this.constructor._instanceCount++;
			
			(function(self){
				self.Super = function(){
					if (!self.constructor._a5_superclass.className)
						return a5.ThrowError(210);
					var sclConst = self.constructor._a5_superclass.prototype.constructor._a5_instanceConst;
					if (sclConst) 
						sclConst.apply(self, arguments);
					else a5.ThrowError(211, null, {nm:self.constructor._a5_superclass.className()});
				};			
				for (var prop in self.constructor._a5_superMethods) 
					self.Super[prop] = self.constructor._a5_superMethods[prop].call(self);
			})(this);
			if (typeof this.constructor._a5_instanceConst !== 'function') 
				return a5.ThrowError(218, null, { clsName: this.className() });
			while (descenderRef !== null) {
				var dConst = descenderRef.constructor;
				if (dConst._a5_attribs) 
					a5.core.attributes.applyClassAttribs(this, dConst._a5_attribs);
				if (dConst._a5_protoProps !== undefined) 
					protoPropRef.unshift(dConst._a5_protoProps);
				
				descenderRef = dConst.superclass &&
				dConst.superclass().constructor.namespace ? dConst.superclass() : null;
			}
			a5.core.mixins.initializeMixins(this);
			for (i = 0, l = protoPropRef.length; i < l; i++) 
				protoPropRef[i].call(this);
			if (args == FROM_CREATE) 
				this.constructor._a5_instanceConst.apply(this, createArgs || []);
			else 
				this.constructor._a5_instanceConst.apply(this, arguments);
			a5.core.mixins.mixinsReady(this);
		}
	},
	
	Extend = function(namespace, base, clsDef, type, isInterface, isProto, imports, mixins, attribs){
		if(isInterface){
			if (base && !base.isInterface())
				return a5.ThrowError('Interface "' + namespace + '" cannot extend "' + base.namespace() + '", base class is not an interface.');
			base = null;		
		}
		var genBaseFunc = function(){},
			isFinal = isProto === false || false,
			isSingleton = false,
			isAbstract = false,
			superclass = null,
			nmi = namespace.lastIndexOf('.'),
			pkg = nmi > -1 ? namespace.substring(0, nmi):"",
			clsName = nmi > -1 ? namespace.substring(nmi+1):namespace,
			typeSplit,
			extender,
			eProto,
			eProtoConst, i, l;

		
		
		if (!base || base === undefined) base = (namespace == 'a5.Object' ? genBaseFunc : a5.Object);
		extender = function(args, createArgs){
				var self = this;
				if (this.constructor._a5_clsDef) 
					processDeclaration(this.constructor._a5_clsDef, this, this, this.constructor.imports(), this.constructor);
				if(args !== INTERFACE_TEST && args !== BASE_CONSTRUCT)
					Initialize.apply(this, arguments);
				//if(a5.ES5)
				//	Object.freeze(this);
			}
		
		if (type) {
			typeSplit = type.split(/[ |]/);
			for (i = 0, l = typeSplit.length; i<l; i++) {
				if (typeSplit[i] == 'final') isFinal = true;
				else if (typeSplit[i] == 'singleton') isSingleton = true;
				else if (typeSplit[i] == 'abstract') isAbstract = true;
			}
		}
		if (a5.core.verifiers.checkNamespaceValid(namespace)) {
			if (!base.isFinal || (base.isFinal() != true)) {
				if(base === Error){
					var proxy = {};
					proxy.prototype = new base();
					extender.prototype = proxy;
					proxy = null;	
				} else
					extender.prototype = new base(BASE_CONSTRUCT);
				superclass = base;
			} else
				return a5.ThrowError('Cannot extend ' + base.namespace() + ', class marked as final.');
		} else
			return a5.ThrowError('Cannot create new class in namespace ' + namespace + ', definition already exists.');
		
		eProto = extender.prototype;
		eProtoConst = eProto.constructor = extender;
		if (base.prototype.constructor._extenderRef)
			base.prototype.constructor._extenderRef.push(extender);
		eProtoConst._a5_superclass = superclass;
		eProtoConst._a5_pkg = pkg;
		eProtoConst._a5_clsDef = clsDef;
		eProtoConst._a5_clsName = clsName;
		eProtoConst._a5_namespace = namespace;
		eProtoConst._a5_imports = imports;
		eProtoConst._a5_isFinal = isFinal;
		eProtoConst._a5_isAbstract = isAbstract;
		eProtoConst._a5_isSingleton = isSingleton;
		eProtoConst._a5_isInterface = isInterface;
		eProtoConst._a5_isPrototype = isProto || false;
		eProtoConst._a5_attribs = attribs;
		eProtoConst._mixinRef = base.prototype.constructor._mixinRef ? base.prototype.constructor._mixinRef.slice(0) : [];
		eProtoConst._implementsRef =  base.prototype.constructor._implementsRef ? base.prototype.constructor._implementsRef.slice(0) : [];
		eProtoConst._a5_mixedMethods = {};
		eProtoConst._a5_instance = null;
		eProtoConst._instanceCount = 0;
		eProtoConst._extenderRef = [];
		if (namespace === 'a5.Object' || base == Error) {
			eProtoConst._ancestorRef = [];
		} else {
			eProtoConst._ancestorRef = base.prototype.constructor._ancestorRef.slice(0);
			eProtoConst._ancestorRef.push(base.prototype.constructor);
		} 
		eProto._a5_initialized = false;
			
		for(prop in a5.core.classProxyObj.construct)
			eProtoConst[prop] = a5.core.classProxyObj.construct[prop];
		if (base.namespace === undefined) {
			for (prop in a5.core.classProxyObj.instance) 
				eProto[prop] = a5.core.classProxyObj.instance[prop];
		}
		if(mixins)
			a5.core.mixins.applyMixins(eProto, mixins, imports);
		
		return a5.SetNamespace(namespace, extender);
	},
	
	processQueue = function(){
		var shouldReprocess = false, i, l;
		for(i = 0; i < packageQueue.length; i++){
			var pkgObj = packageQueue[i].pkg,
				validationResult = a5.core.verifiers.validateClassDependencies(pkgObj.base, pkgObj.imports, pkgObj.mixins, pkgObj.implement);		
			if (validationResult === true){
				processClass(pkgObj, true);
				packageQueue.splice(i, 1);
				i--;
				shouldReprocess = true;
			} else {
				packageQueue[i].reason = validationResult.reason;
				packageQueue[i].reasonNM = validationResult.reasonNM;
			}
		}	
		if(shouldReprocess) processQueue();
	},
	
	processProtoClass = function(queued){
		var obj = queued.obj,
			pkgObj = queued.pkgObj;
		processDeclaration(pkgObj.proto, obj, obj.prototype, obj.imports(), obj, true)
	},
	
	processClass = function(pkgObj, $fromQueue){
		var base = (typeof pkgObj.base === 'function') ? pkgObj.base : a5.GetNamespace(pkgObj.base, pkgObj.imports),
			obj = Extend(pkgObj.pkg + '.' + pkgObj.clsName, base, pkgObj.cls, pkgObj.type, pkgObj.isInterface, pkgObj.isProto, pkgObj.imports, pkgObj.mixins, pkgObj.attribs),
			fromQueue = $fromQueue || false,
			isValid = true, i, l;
		if(pkgObj.staticMethods)
			pkgObj.staticMethods(obj, pkgObj.imports);
		if (pkgObj.proto && delayProtoCreation) {
			queuedPrototypes.push({obj:obj, pkgObj:pkgObj});
			if(pkgObj.implement)
				queuedImplementValidations.push({pkgObj:pkgObj, obj:obj});
		} else {
			if(pkgObj.proto)
				processProtoClass({obj:obj, pkgObj:pkgObj});
			if(pkgObj.implement)
				isValid = a5.core.verifiers.validateImplementation(pkgObj, obj);
		}	
		if(!isValid)
			return;
		if(pkgObj.enumDeclaration){
			var startIndex = 0,
				values = [],
				index;
			pkgObj.enumDeclaration({
				startIndex:function(value){
					startIndex = value;
				},
				addValue:function(value){
					values.push(value);
				}
			})
			
			index = startIndex;
			for (i = 0, l = values.length; i < l; i++)
				obj[values[i]] = index++;
				
			obj.addValue = function(value){
				if (obj[value] === undefined) {
					obj[value] = index++;
					values.push(value);
				}
			}
			obj.getValue = function(id){
				try {
					return values[id - startIndex];
				} catch (e) {
					return null;
				}
			}
		}
		if (pkgObj.isInterface) {
			obj.interfaceVals = {};
			if (pkgObj.base !== null && pkgObj.base !== undefined) {
				var cls = a5.GetNamespace(pkgObj.base, pkgObj.imports);
				if (cls.isInterface()) {
					for (prop in cls.interfaceVals) 
						if(obj.interfaceVals[prop] === undefined)
							obj.interfaceVals[prop] = cls.interfaceVals[prop];
				} else
					a5.ThrowError(204, null, {objNM:obj.namespace(), clsNM:cls.namespace()});
			}
			pkgObj.cls.call(obj.interfaceVals, obj.interfaceVals);
		}
		if(pkgObj.isMixin){
			obj._mixinDef = {
				Properties: function(propFunc){
					obj.prototype.constructor._a5_mixinProps = propFunc;
				},
				MustExtend:function(){
					obj.prototype.constructor._a5_mixinMustExtend = arguments;
				},
				MustMix:function(){
					obj.prototype.constructor._a5_mixinMustMix = arguments;
				}
			}
			pkgObj.cls.call(obj._mixinDef, obj._mixinDef, pkgObj.imports, obj);
			if(typeof obj._mixinDef[obj.className()] === 'function'){
				obj._a5_instanceConst = obj._mixinDef[obj.className()];
				delete obj._mixinDef[obj.className()];
			} else
				a5.ThrowError(205, null, {nm:obj.namespace()});
			delete obj._mixinDef.Properties;
			delete obj._mixinDef.Contract;
			delete obj._mixinDef.MustExtend;
			delete obj._mixinDef.MustMix;
		}
		updateWatches(pkgObj.pkg, pkgObj.clsName, obj);
		if (!fromQueue) processQueue();
	},
	
	processImports = function(array, pkg, $isRebuild){
		var retObj = {},i, l, str, pkg, clsName, isWC, dotIndex, pkgName, obj;
		if(array == undefined) array = [];
		array.push(pkg + '.*');
		for (i = 0, l = array.length; i < l; i++) {
			str = array[i], isWC = false, dotIndex = str.lastIndexOf('.');
			pkgName = str.substr(0, str.length - 2);
			if (str.charAt(str.length - 1) == '*') isWC = true;
			if (isWC) {
				pkgName = str.substr(0, str.length - 2);
				pkg = a5.GetNamespace(pkgName, null, true);
				if (pkg) {
					for (prop in pkg) {
						obj = pkg[prop];
						if ((typeof obj === 'function' || typeof obj === 'object') && retObj[prop] === undefined) retObj[prop] = obj;
					}
				}
				var pkgWatchName = pkgName.replace(/\./g, '_');
				if(!watchImports[pkgWatchName])
					watchImports[pkgWatchName] = [];
				watchImports[pkgWatchName].push(retObj);
			} else {
				clsName = dotIndex > -1 ? str.substr(dotIndex + 1) : str;
				pkgName = str.substr(0, dotIndex);
				var obj = a5.GetNamespace(str, null, true);
				if (obj) {
					if (retObj[clsName] === undefined)
						retObj[clsName] = obj;
				} else{
					var clsWatchName = pkgName.replace(/\./g, '_') + "_" + clsName;
					if(!watchImports[clsWatchName])
						watchImports[clsWatchName] = [];
					watchImports[clsWatchName].push(retObj);
				}	
			}
		}
		return retObj;
	}
	
	/**
	* @name Create
	* Instantiates a new instance of an object defined by {@link cl.Package}
	* @type Object
	* @param {Object} classRef
	* @param {Object} args
	*/
	a5.Create = Create;
	/**
	* @name Package
	* @param {Object} pkg
	*/
	a5.Package = Package;

	a5._a5_verifyPackageQueueEmpty = function(){
	    if(packageQueue.length){
	        var clsString = '', i, l;
	        for(i = 0, l = packageQueue.length; i < l; i++)
	            clsString += '"' + packageQueue[i].pkg.pkg + '.' + packageQueue[i].pkg.clsName + '", ' + packageQueue[i].reason  + ' class missing: "' + packageQueue[i].reasonNM + '"' + (packageQueue.length > 1 && i < packageQueue.length-1 ? ', \n':'');
	        a5.ThrowError(206, null, {classPlural:packageQueue.length == 1 ? 'class':'classes', clsString:clsString});
	    }
	}
	
	a5._a5_delayProtoCreation = function(value){
	    delayProtoCreation = value;
	}
	
	a5._a5_createQueuedPrototypes = function(){
	    for (var i = 0, l = queuedPrototypes.length; i < l; i++)
	        processProtoClass(queuedPrototypes[i]);
	    queuedPrototypes = [];
	    for(i = 0, l = queuedImplementValidations.length; i<l; i++)
	        a5.core.verifiers.validateImplementation(queuedImplementValidations[i].pkgObj, queuedImplementValidations[i].obj); 
	    queuedImplementValidations = [];
	}
	
	a5.RegisterUIDWriter = function (writer) { uidWriter = writer; };
	
	a5.HashString = hashString;
	
	a5._a5_processImports = processImports;
})