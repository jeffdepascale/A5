
a5.Package('a5.unitTest.tests')

	.Extends('a5.cl.CLUnitTest')
	.Class('EnumTest', function(cls, im, EnumTest){
			
			cls.EnumTest = function(){
				cls.superclass(this);
			}	
			
			cls.Override.runTest = function(){
				
				a5.Package('a5.unitTest.testClasses')
				
					.Enum('TestEnum1', function(cls){
						
						cls.addValue('VALUE_ONE');
						cls.addValue('VALUE_TWO');
						cls.addValue('VALUE_THREE');
						cls.addValue('VALUE_FOUR');
				})
				cls.assert(a5.unitTest.testClasses.TestEnum1.VALUE_ONE === 0, "Enum failed for index 0.")
				
				
				a5.Package('a5.unitTest.testClasses')
				
					.Enum('TestEnum2', function(cls){
						cls.startIndex(1);
						cls.addValue('VALUE_ONE');
						cls.addValue('VALUE_TWO');
						cls.addValue('VALUE_THREE');
						cls.addValue('VALUE_FOUR');
				})
				cls.assert(a5.unitTest.testClasses.TestEnum2.VALUE_ONE === 1, "Enum failed for altered start index.");
				cls.assert(a5.unitTest.testClasses.TestEnum2.VALUE_TWO === 2, "Enum failed for index 2.");
				
				cls.assert(a5.unitTest.testClasses.TestEnum2.getValue(2) === 'VALUE_TWO', 'Enum getValue failure');
				
				a5.unitTest.testClasses.TestEnum2.addValue('ADD_TEST');
				cls.assert(a5.unitTest.testClasses.TestEnum2.getValue(5) === 'ADD_TEST', 'Enum addValue failure');
			}
});