a5.Package('a5')

	.Prototype('Attribute', 'singleton', function(proto, im, Attribute){
		
		Attribute.RETURN_NULL = '_a5_attributeReturnsNull';
		Attribute.SUCCESS = '_a5_attributeSuccess';
		Attribute.ASYNC = '_a5_attributeAsync';
		Attribute.FAILURE = '_a5_attributeFailure';
		
		Attribute.processInstance = function(cls){
			return a5.core.attributes.processInstance(cls);
		}
		
		this.Properties(function(){
			this.target = a5.AttributeTarget.ALL;
		});
		
		proto.Attribute = function($target){
			if($target)
				this.target = $target;
		}
		
		proto.instanceCreate = function(rules, instance){ return Attribute.SUCCESS; }
		
		proto.instanceDestroy = function(rules, instance){ return Attribute.SUCCESS; }
		
		proto.instanceProcess = function(rules, instance){ return Attribute.SUCCESS; }
		
		proto.methodPre = function(){ return Attribute.SUCCESS; }
		
		proto.methodPost = function(scope, method){ return Attribute.SUCCESS; }

})

a5.Package('a5')

	.Static('AttributeTarget', function(AttributeTarget){
		
		AttributeTarget.ALL = '_a5_attTargAll';
		AttributeTarget.METHOD = '_a5_attTargMethod';
		AttributeTarget.CLASS = '_a5_attTargClass';
			
})	