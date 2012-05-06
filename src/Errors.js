
/**
 * Exceptions thrown from assert statements.
 */
a5.Package('a5')
	.Extends('Error')
	.Prototype('AssertException', function(proto){
		
		proto.AssertException = function(){
			proto.superclass(this, arguments);
			this.type = 'AssertException';
		}
		
});

/**
 * Exceptions thrown from contract attributes.
 */
a5.Package('a5')
	.Extends('Error')
	.Prototype('ContractException', function(proto){
		
		proto.ContractException = function(){
			proto.superclass(this, arguments);
			this.type = 'ContractException';
		}
		
});