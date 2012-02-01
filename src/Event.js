
/**
 * @class 
 * @name a5.Event
 */
a5.Package('a5')

	.Static(function(Event){
		
		/**#@+
	 	 * @memberOf a5.Event
		 */
		
		/**
		 * @name DESTROYED
		 * @constant
		 */
		Event.DESTROYED = 'Destroyed';
		
		/**#@-*/
	})
	.Prototype('Event', function(proto){
		
		/**#@+
	 	 * @memberOf a5.Event#
	 	 * @function
		 */
		
		
		proto.Event = function($type, $bubbles, $data){
			this._a5_type = $type;
			this._a5_data = $data;
			this._a5_target = null;
			this._a5_currentTarget = null;
			this._a5_phase = 1;
			this._a5_bubbles = $bubbles !== false;
			this._a5_canceled = false;
			this._a5_cancelPending = false;
			this._a5_shouldRetain = false;
		}
		
		
		/**
		 * Cancels the propagation of the event. Once this method is called, any event listeners that have not yet processed this event instance will be ignored.
		 * #name cancel
		 * @param {Object} finishCurrentPhase If true, the event is allowed to finish dispatching in the current phase, but will be cancelled before the next phase begins.
		 */
		proto.cancel = function(finishCurrentPhase){
			if(finishCurrentPhase === true)
				this._a5_cancelPending = true;
			else
				this._a5_canceled = true;
		}
		
		/**
		 * The object that dispatched this event.
		 * @name target
		 * @return {Object} The object that dispatched this event.
		 */
		proto.target = function(){ return this._a5_target; };
		
		/**
		 * The object that is currently processing this event.
		 * @name currentTarget
		 * @return {Object} The object that is currently processing this event.
		 */
		proto.currentTarget = function(){ return this._a5_currentTarget; };
		
		/**
		 * The event type.
		 * @name type
		 * @return {String} The event type.
		 */
		proto.type = function(){ return this._a5_type; };
		
		/**
		 * @name data
		 * @return {Object}
		 */
		proto.data = function(){ return this._a5_data; };
		
		/**
		 * The phase this event is currently in. (a5.Event.CAPTURING, a5.Event.AT_TARGET, or a5.Event.BUBBLING)
		 * @name phase
		 * @return {Number} The phase this event is currently in.
		 */
		proto.phase = function(){ return this._a5_phase; };
		
		
		/**
		 * Whether this event should use the bubbling phase.  All events use capture and target phases.
		 * @name bubbles
		 */
		proto.bubbles = function(){ return this._a5_bubbles; };
		
		/**
		 * When shouldRetain is set to true, the event instance will not be destroyed after it has finished being dispatched.
		 * Thsi defaults to false, and it is highly recommended that you do NOT set this to true unless the same event is being
		 * dispatched on a timer, and the instance can be reused.
		 * 
		 * @name shouldRetain
		 * @param {Boolean} [value=false] If set to true, the event instance will not be destroyed after it has finished being dispatched.
		 */
		proto.shouldRetain = function(value){
			if(typeof value === 'boolean'){
				this._a5_shouldRetain = value;
				return this;
			}
			return this._a5_shouldRetain;
		}
		
		proto.dealloc = function(){
			this._a5_target = this._a5_currentTarget = null;
		}
		
		/**#@-*/
});

/**
 * @class 
 * @name a5.EventPhase
 */
a5.Package('a5')

	.Static('EventPhase', function(EventPhase){
		
		/**#@+
	 	 * @memberOf a5.EventPhase
		 */
		
		/**
		 * @name CAPTURING
		 * @constant
		 */
		EventPhase.CAPTURING = 1;
		
		/**
		 * @name AT_TARGET
		 * @constant
		 */
		EventPhase.AT_TARGET = 2;
		
		/**
		 * @name BUBBLING
		 * @constant
		 */
		EventPhase.BUBBLING = 3;
});