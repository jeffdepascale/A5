a5.Package('a5')

	.Extends('Attribute')
	.Prototype('AspectAttribute', function(cls, im, AspectAttribute){
		
		AspectAttribute.RETURN_NULL = '_a5_aspectReturnsNull';
		AspectAttribute.SUCCESS = '_a5_aspectSuccess';
		AspectAttribute.ASYNC = '_a5_aspectAsync';
		AspectAttribute.FAILURE = '_a5_aspectFailure';
		AspectAttribute.NOT_IMPLEMENTED = '_a5_notImplemented';
		
		cls.AspectAttribute = function(){
			cls.superclass(this);
		}
		
		cls.before = function(){ return AspectAttribute.NOT_IMPLEMENTED; }
		
		cls.after = function(){ return AspectAttribute.NOT_IMPLEMENTED; }
		
		cls.around = function(){ return AspectAttribute.NOT_IMPLEMENTED; }
});
