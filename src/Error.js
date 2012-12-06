
/**
 * Defines a custom A5 Error.
 */
a5.Package('a5')

	.Extends(Error)
	.Prototype('Error', function(proto, im, Error){
		
		Error.FORCE_CAST_ERROR = '_a5_forceCastError';
		
		this.Properties(function(){
			this.stack = [];
			this.message = "";
			this._a5_isWindowError = false;
			this.name = this.type = this.className();
		})
		
		proto.Error = function(message, error) {
			if(error === false)
				this._a5_isWindowError = true;
			if(typeof message === 'string')
				this.message = message;
			else
				error = message;
			if(error instanceof Error){
				if(error.stack)
					this.stack = error.stack.split('\n');
				this.line = error.lineNumber;
				this.url = error.fileName;
				if(error.message && this.message === "")
					this.message = error.message;
			} else if(error !== false){
				/*try{ 
					__undefined__();
				} catch(e) {
					if (e.stack) {
						var hasAtHttp = e.stack.indexOf('@http') !== -1;
						this.stack = e.stack.split('\n');
						this.stack = this.stack.splice(4);
						if (hasAtHttp) 
							for (var i = 0; i < this.stack.length; i++)
								this.stack[i] = this.stack[i].substr(this.stack[i].indexOf('@http'));
					} else {
						var usedFuncs = [];
						try {
							var i = 0, context = this.init.caller.caller.caller;
							do {
								for (i = 0, l = usedFuncs.length; i < l; i++)
									if (usedFuncs[i] === context) context = null;
								if (context) {
									if(context.toString().indexOf(Error.FORCE_CAST_ERROR) === -1)
										this.stack.push(context.toString().replace(/;/g, ';<br/>').replace(/{/g, '{<br/>').replace(/}/g, '}<br/>') + '<br/><br/>');
									usedFuncs.push(context)
									context = context.caller;
									i++;
								}
							} while (context && i <= 50);
						} catch (e) {}
					}
				}*/
			}
		}
		
		/**
		 * whether the error originated from a window onerror catch statement.
		 */
		proto.isWindowError = function(){
			return this._a5_isWindowError;
		}
		
		proto.Override.toString = function () {
		  return this.type + ': ' + this.message;
		}
})