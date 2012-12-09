
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
			this.name = this.type = this.className();
		})
		
		proto.Error = function(message, error) {
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
			}
		}
		
		proto.Override.toString = function () {
		  return this.type + ': ' + this.message;
		}
})