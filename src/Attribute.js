a5.Package('a5')

	.Prototype('Attribute', 'singleton', function(proto, im, Attribute){
		
		proto.Attribute = function(){
		}

})

a5.Package('a5')

	.Static('AttributeTarget', function(AttributeTarget){
		
		AttributeTarget.ALL = '_a5_attrTargAll';
		AttributeTarget.METHOD = '_a5_attrTargMethod';
		AttributeTarget.CLASS = '_a5_attrTargClass';
			
})	