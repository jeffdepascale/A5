
/**
 * Base Event object in A5.
 */
a5.Package('a5')

	.Static(function(Event){
		
		Event.DESTROYED = 'Destroyed';
		
	})
	.Prototype('Event', function(proto){
		
		this.Properties(function(){
			this._a5_type = null;
			this._a5_data = null;
			this._a5_target = null;
			this._a5_currentTarget = null;
			this._a5_phase = 1;
			this._a5_bubbles = false;
			this._a5_canceled = false;
			this._a5_cancelPending = false;
			this._a5_shouldRetain = false;
		})
		
		/**
		 * 
		 * @param {String} type The type identifier for the event.
		 * @param {Boolean} [bubbles=false] Whether or not the event should use the bubbling phase.
		 * @param {Object} [data] an optional data object to pass along with the event to registered listeners.
		 */
		proto.Event = function(type, bubbles, data){
			this._a5_type = type;
			this._a5_data = data || null;
			this._a5_bubbles = bubbles !== false;
		}
		
		
		/**
		 * Cancels the propagation of the event. Once this method is called, any event listeners that have not yet processed this event instance will be ignored.
		 * @param {Boolean} finishCurrentPhase If true, the event is allowed to finish dispatching in the current phase, but will be cancelled before the next phase begins.
		 */
		proto.cancel = function(finishCurrentPhase){
			if(finishCurrentPhase === true)
				this._a5_cancelPending = true;
			else
				this._a5_canceled = true;
		}
		
		/**
		 * The object that dispatched this event.
		 * @return {a5.Object} The object that dispatched this event.
		 */
		proto.target = function(){ return this._a5_target; };
		
		/**
		 * The object that is currently processing this event.
		 * @return {a5.Object} The object that is currently processing this event.
		 */
		proto.currentTarget = function(){ return this._a5_currentTarget; };
		
		/**
		 * The event type.
		 * @return {String} The event type.
		 */
		proto.type = function(){ return this._a5_type; };
		
		/**
		 * The data object passed along with the event dispatch, if present.
		 * @return {Object}
		 */
		proto.data = function(){ return this._a5_data; };
		
		/**
		 * The phase this event is currently in. (a5.Event.CAPTURING, a5.Event.AT_TARGET, or a5.Event.BUBBLING)
		 * @return {Number} The phase this event is currently in.
		 */
		proto.phase = function(){ return this._a5_phase; };
		
		
		/**
		 * Whether this event should use the bubbling phase.  All events use capture and target phases.
		 */
		proto.bubbles = function(){ return this._a5_bubbles; };
		
		/**
		 * When shouldRetain is set to true, the event instance will not be destroyed after it has finished being dispatched.
		 * This defaults to false, and it is recommended that you do NOT set this to true unless the same event is being
		 * dispatched on a timer, and the instance can be reused.
		 * 
		 * @param {Boolean} [value] If set to true, the event instance will not be destroyed after it has finished being dispatched.
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
});

/**
 * Defines event phases for an {@link a5.Event}.
 */
a5.Package('a5')

	.Static('EventPhase', function(EventPhase){
		
		EventPhase.CAPTURING = 1;
		
		EventPhase.AT_TARGET = 2;
		
		EventPhase.BUBBLING = 3;
});