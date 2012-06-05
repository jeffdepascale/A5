a5.SetNamespace('a5.ErrorDefinitions', {
	//100: root level
	100:'invalid namespace "{namespace}", namespaces must contain only letters, numbers, or periods.',
	101:'TrackWindowStrays must be called prior to GetWindowStrays.',
	//200: class processing
	200:'Invalid attempt to define new method "{prop}" in class "{namespace}", without calling override, method exists in superclass.',
	201:'Invalid attempt to override method "{prop}" in class "{namespace}", method marked as Final in superclass.',
	202:'Invalid attempt to override method "{prop}" in class "{namespace}", method not defined in superclass.',
	203:'Invalid attempt to override method "{prop}" in class "{namespace}", method marked as Final in superclass.',
	204:'Interface "{objNM}" cannot extend the non interface class "{clsNM}"',
	205:'Mixin "{nm}" doesn not specify a constructor.',
	206:'Class definitions not found for the following expected {classPlural}: \n {clsString}',
	207:'Error creating new class instance: cannot find object {className}.',
	208:'Cannot instantiate class {nm} , interfaces must be associated by the Implements directive.',
	209:'Error creating class instance {nm} ({errorStr})',
	210:'Superclass called on an object without a superclass.',
	211:'Constructor not defined on class "{nm}"',
	212:'invalid scope argument passed to superclass constructor on class "{nm}".',
	213:'Cannot implement "{implNM}" on class "{objNM}", class is not an interface.',
	214:'Invalid implementation of interface "{implNM}" , on class "{objNM}".',
	215:'Destroy called on core object "{nm}"',
	216:'Cannot directly instantiate class "{nm}", class marked as abstract.',
	217:'Cannot create new instance of class "{nm}", class marked as singleton already exists.',
	218:'Constructor not defined on class "{clsName}"',
	219:'Class "{currClass}" requires "{checkedClass}"',
	220:'Invalid attempt to define new method "{prop}" in class "{namespace}", without calling override, method exists in mixin.',
	
	//300: attributes
	300:'Invalid attribute definition: "Attributes" call must take a function as its last parameter.',
	301:'Invalid attribute definition: No attributes were defined.',
	302:'Attribute error: Attributes call accepts only arrays as attribute annotations.',
	303:'Attribute error: First parameter must be a reference to a class that extends a5.Attribute.',
	304:'Attribute error: invalid parameter specified for Attribute, params must be key/value pair objects.',
	305:'Attribute error: no parameters passed to Attribute call.',
	308:'Error processing attribute "{prop}", "{method}" must return a value.',
	
	//400: mixins
	400:'Mixin "{mixinNM}" requires mixing object "{instNM}" to extend class "{clsNM}" .',
	401:'Mixin "{nm}" requires owner class to mix "{cls}".',
	402:'Mixin "{nm}" already mixed into ancestor chain.',
	403:'Invalid mixin: Method "{method}" defined by more than one specified mixin.',
	404:'Invalid mixin: Mixin "{mixin}" does not exist.',
	
	//600: Contract
	601:'Invalid implementation of Contract on interace {intNM} in class {implNM} for method {method}.'
})
