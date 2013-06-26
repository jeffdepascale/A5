/**
 * Strictly defines parameters for a method, and optionally overloaded parameter options.
 */
a5.Package('a5')

	.Extends('AspectAttribute')
	.Class('ContractAttribute', function(cls, im, ContractAttribute){
		
		cls.ContractAttribute = function(){
			cls.superclass(this);
		}

		cls.Override.before = function(aspectParams){
			var retObj = null,
				foundTestRule = false,
				processError = function(error){
					error.message = 'Contract type failure on method "' + aspectParams.method().getName() + '" ' + error.message;
					return error;
				}
				
			//TODO: validate structure of passed rules. 
			//checkIsValid for datatypes, default vals should still fail out via error
			if(aspectParams.rules().length > 1){
				for (var i = 0, l = aspectParams.rules().length; i < l; i++) {
					retObj = runRuleCheck(aspectParams.rules()[i], aspectParams.args());
					if (retObj instanceof a5.ContractException) {
						cls.throwError(processError(retObj));
						return a5.AspectAttribute.FAILURE;
					}
					if (retObj !== false) {
						foundTestRule = true;
						retObj.overloadID = i;
						break;
					}
				}
			} else {
				foundTestRule = true;
				retObj = runRuleCheck(aspectParams.rules()[0], aspectParams.args(), true);
				if (retObj instanceof a5.ContractException) {
					cls.throwError(processError(retObj));
					return a5.AspectAttribute.FAILURE;
				}
			}
			if (!foundTestRule || retObj === false) {
				cls.throwError(processError(new a5.ContractException('no matching overload found')));
				return a5.AspectAttribute.FAILURE;
			} else {
				return retObj;
			}
		}
		
		var runRuleCheck = function(rule, args){
			var retObj = {},
				count = 0,
				testResult,
				prop, type;
			for (prop in rule) {
				type = rule[prop];
				testResult = validate((count < args.length ? args[count] : undefined), type, count);
				if(testResult instanceof a5.ContractException)
					return testResult;
				retObj[prop] = testResult;
				count++;
			}
			if(args.length > count)
				return false;
			if(args.length === 0){
				if(count === 0) return retObj;
				return false;
			}
			return retObj;
		},	
		
		validate = function(arg, type, count){
			var kind = 'type',
				foundOptionals = false,
				defaultVal = null,
				split, clsDef;
			if(type.indexOf('=') != -1){
				split = type.split('=');
				type = split[0];
				foundOptionals = true;
				defaultVal = split[1];
			} else {
				if(foundOptionals)
					return new a5.ContractException('for argument ' + count + ', required values cannot be defined after optional values');
			}
			if(type.indexOf('.') !== -1) kind = 'class';
			if(type === 'array') kind = 'array';
			if(type === 'object') kind = 'object';
			if(kind !== 'class') type = type.toLowerCase();
			if (arg === undefined) {
				if (foundOptionals) arg = discernDefault(type, kind, defaultVal, count);
				else return new a5.ContractException('for argument ' + count + ', missing required argument of type "' + type + '"');
			}
	
			if (arg !== undefined && arg !== null) {
				switch (kind) {
					case 'class':
						clsDef = a5.GetNamespace(type);
						if(clsDef.isInterface()){
							if(!(arg.doesImplement(clsDef)))
								return new a5.ContractException('for argument ' + count + ', must implement interface ' + type);
						} else {
							if (!(arg instanceof clsDef))
								return new a5.ContractException('for argument ' + count + ', must be an instance of type ' + type);
						}
						break;
					case 'type':
						if(arg !== null && typeof arg !== type)
							return new a5.ContractException('for argument ' + count + ', must be of type ' + type);
						break;
					case 'array':
						if (Object.prototype.toString.call(arg) !== '[object Array]')
							return new a5.ContractException('for argument ' + count + ', must be an array');
						break;
					case 'object':
						if(arg._a5_initialized !== undefined || typeof arg !== 'object' || arg instanceof Array)
							return new a5.ContractException('for argument ' + count + ', must be a generic object');
						break;
				}
			}
			return arg;
		},
		
		discernDefault = function(type, kind, defaultVal, count){
			var retVal, invalid = false;
			if (type === 'string') {
				var zChar = defaultVal.charAt(0);
				if (zChar === defaultVal.charAt(defaultVal.length - 1)) {
					if(zChar === '"' || zChar === "'") retVal = defaultVal.substr(1, defaultVal.length - 2);
					else invalid = true;
				} else
					invalid = true;
			} else if (type === 'number'){
				if(!isNaN(defaultVal))
					retVal = parseInt(defaultVal);
				else
					invalid = true;
			} else if (kind === 'class'){
				if(defaultVal === 'null')
					retVal = null;
				else 
					invalid = true;
			} else if(	type === 'boolean' 	|| 
						type === 'array' 	|| 
						type === 'function' ||
						type === 'object'){
				switch (defaultVal){
					case '{}':
						if(type === 'object')
							retVal = {};
						else 
							invalid = true;
						break;
					case '[]':
						if(type === 'array')
							retVal = [];
						else 
							invalid = true;
						break;
					case 'null':
						retVal = null;
						break;
					case 'true':
						if(type === 'boolean')
							retVal = true;
						else 
							invalid = true;
						break;
					case 'false':
						if(type === 'boolean')
							retVal = false;
						else
							invalid = true;
						break;
					default:
						invalid = true;
				}
			} else
				invalid = true;
			if(invalid)
				return new a5.ContractException('for argument ' + count + ', invalid default value for data type "' + type + '"');
			 else 
			 	return retVal;
		}

})