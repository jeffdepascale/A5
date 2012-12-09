
a5.Package('a5.cl')
	
	.Extends('a5.cl.CLBase')
	.Static(function(CLUnitTest){
		
		CLUnitTest.COMPLETE = 'a5_cl_testing_complete';
		
		CLUnitTest._cl_testRef = null;
		
		CLUnitTest.testingRef = function(){
			return CLUnitTest._cl_testRef || a5.cl.testing.Testing();
		}
		
	})
	.Prototype('CLUnitTest', 'singleton', function(proto, im, CLUnitTest){
		
		this.Properties(function(){
			this._cl_async = false;
		})
		
		proto.CLUnitTest = function(){
			proto.superclass(this);
		}
		
		/**
		 * @name assert
		 * @param {Object} exp
		 * @param {Object} err
		 */
		proto.assert = function(exp, err){
			if (exp !== true)
				throw new a5.AssertException(err);
		}
		
		proto.asyncTest = function(){
			this._cl_async = true;
		}
		
		proto.runTest = function(){
			if(this.runTest === proto.runTest)
				this.error('runTest method not implemented on CLUnitTest class ' + this.namespace());
		}
		
		proto.testComplete = function(){
			if(this._cl_async == true)
				this.dispatchEvent(CLUnitTest.COMPLETE);
		}
		
		proto.Override.log = function(value){
			CLUnitTest.testingRef().log(value);
		}
		
		proto.Override.warn = function(value){
			CLUnitTest.testingRef().warn(value);
		}
		
		proto.error = function(value){
			CLUnitTest.testingRef().fail(value);
		}
		
		proto.fail = function(value){
			CLUnitTest.testingRef().fail(value);
		}

});