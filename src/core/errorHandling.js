
a5.SetNamespace('a5.core.errorHandling', true, function(){
	
	var thrownError = null;
	
	this.ThrowError = function(error, type, replacements){
		var t = typeof error,
			errorStr;
		if (t === 'string')
			errorStr = error;			
		else if (t === 'number'){
			if (a5.GetNamespace('a5.ErrorDefinitions', null, true)) {
				var errorStr = a5.ErrorDefinitions[error];
				if(!errorStr)
					errorStr = 'Invalid error id ' + error + ' thrown: error not defined.';
			} else
				errorStr = 'Error id ' + error + ' thrown. Include a5.ErrorDefinitions for verbose information.';
			error = a5.Create(type || a5.Error, [errorStr, a5.Error.FORCE_CAST_ERROR]);
		}
		if(errorStr)
			error = a5.Create(type || a5.Error, [(replacements ? runReplacements(errorStr, replacements) : errorStr), a5.Error.FORCE_CAST_ERROR]);
		thrownError = error;
		throw error;
	}
	
	this._a5_getThrownError = function(){
		var err = thrownError;
		thrownError = null;
		return err;
	}
	
	var runReplacements = function(str, replacements){
		for(var prop in replacements)
			str = str.replace(new RegExp('{' + prop + '}', 'g'), replacements[prop]);
		return str;
	}
})

/**
 * @name ThrowError
 */
a5.ThrowError = a5.core.errorHandling.ThrowError;
a5._a5_getThrownError = a5.core.errorHandling._a5_getThrownError;