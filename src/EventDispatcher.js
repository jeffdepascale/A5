
/**
 * @class The EventDispatcher class defines a prototype object for handling listeners and dispatching events.
 * <br/><b>Abstract</b>
 * @name a5.EventDispatcher
 */
a5.Package("a5")

	.Prototype('EventDispatcher', 'abstract', function(proto){
		
		/**#@+
	 	 * @memberOf a5.EventDispatcher#
	 	 * @function
		 */
		
		this.Properties(function(){
			this._a5_autoPurge = false;
			this._a5_listeners = {};
		})
		
		proto.EventDispatcher = function(){
			
		}
		
		proto.autoPurge = function(value){
			if(typeof value === 'boolean'){
				this._a5_autoPurge = value;
				return this;
			}
			return this._a5_autoPurge;
		}
		
		/**
		 * Adds an event listener to the parent object.
		 * @name addEventListener
		 * @param {String} type The event type to be added.
		 * @param {Object} method The associated listener method to be added.
		 * @param {Boolean} [useCapture=false] If set to true, the listener will process the event in the capture phase.  Otherwise, it will process the event bubbling or target phase.
		 * @param {Boolean} [scope=null]
		 */
		proto.addEventListener = function(type, method, useCapture, scope){
			this._a5_addEventListener(type, method, useCapture, scope);
		}
		
		/**
		 * Adds an event listener to the parent object that fires only once, then is removed.
		 * @name addOneTimeEventListener
		 * @param {String} type The event type to be added.
		 * @param {Object} method The associated listener method to be added.
		 * @param {Boolean} [useCapture=false] If set to true, the listener will process the event in the capture phase.  Otherwise, it will process the event bubbling or target phase.
		 * @param {Boolean} [scope=null]
		 */
		proto.addOneTimeEventListener = function(type, method, useCapture, scope){
			this._a5_addEventListener(type, method, useCapture, scope, true);
		}
		
		/**
		 * @name hasEventListener
		 * @param {String} type
		 * @param {Object} [method]
		 */
		proto.hasEventListener = function(type, method){
			var types = type.split('|'),
				scope = this.cl(),
				i, l, listArray, j, m;
			for (i = 0, l = types.length; i < l; i++) {
				listArray = this._a5_getListenerArray(types[i]);
				if (listArray) {
					for (j = 0, m = listArray.length; j < m; j++) 
						if (listArray[j].type == types[i] && (typeof method === 'function' ? (listArray[j].method == method) : true))
							return true;
				}
			}
			return false;
		}
		
		/**
		 * Remove a listener from the parent object.
		 * @name removeEventListener
		 * @param {String} type The event type to be removed.
		 * @param {Object} method The associated listener method to be removed.
		 * @param {Boolean} [useCapture=false] Whether the listener to remove is bound to the capture phase or the bubbling phase.
		 */
		proto.removeEventListener = function(type, method,  $useCapture, $scope, $isOneTime){
			var scope = $scope || null,
				types = type.split('|'),
				isOneTime = $isOneTime || false,
				useCapture = $useCapture === true,
				shouldPush = true,
				i, l, listArray, j, m;
			for (i = 0, l = types.length; i < l; i++) {
				listArray = this._a5_getListenerArray(types[i]);
				if (listArray) {
					for (j = 0, m = listArray.length; j < m; j++) {					
						if (listArray[j].method === method && 
							listArray[j].type === types[i] && 
							listArray[j].useCapture === useCapture && 
							listArray[j].isOneTime === isOneTime) {
								listArray.splice(j, 1);
								m = listArray.length;
						}
					}
					this.eListenersChange({
						type: types.length > 1 ? types:types[0],
						method: method,
						useCapture: useCapture,
						changeType: 'REMOVE'
					});
				}
			}
		}
		
		/**
		 * @name removeAllListeners
		 */
		proto.removeAllListeners = function(){
			if(this._a5_listeners)
				this._a5_listeners = {};
		}
		
		/**
		 * Returns the total number of listeners attached to the parent object.
		 * @name getTotalListeners
		 */
		proto.getTotalListeners = function(type){
			if (typeof type === 'string') {
				var arr = this._a5_getListenerArray(type);
				if(arr)
					return arr.length;
				else
					return 0;
			} else {
				var count = 0;
				for(var prop in this._a5_listeners)
					count += this._a5_listeners[prop].length;
				return count;
			}
		} 
		
		/**
		 * Sends an event object to listeners previously added to the event chain. By default an event object with a target property is sent pointing to the sender. If a custom object is sent with a target property, this property will not be overridden.
		 * @name dispatchEvent
		 * @param {String|a5.Event} event The event object to dispatch.  Or, if a string is passed, the 'type' parameter of the event to dispatch. 
		 */
		proto.dispatchEvent = function(event, data, bubbles){
			var e = this._a5_createEvent(event, data, bubbles);
			//target phase only
			e._a5_phase = a5.EventPhase.AT_TARGET;
			this._a5_dispatchEvent(e);
			if(!e.shouldRetain()) e.destroy();
			e = null;
		}
		
		/**
		 * Override this method to be notified of listener addition or removal.
		 * @name eListenersChange
		 * @param {Object} e The event object
		 * @param {String} e.type - The event type associated with the change.
		 * @param {Object} e.method - The listener method associated with the change.
		 * @param {String} e.changeType - Specifies what the type the change was, either 'ADD' or 'REMOVE'. 
		 */
		proto.eListenersChange = function(e){}
		
		//private methods
		
		proto._a5_addEventListener = function(type, method, $useCapture, $scope, $isOneTime){
			var scope = $scope || null,
				types = type.split('|'),
				isOneTime = $isOneTime || false,
				useCapture = $useCapture === true,
				shouldPush = true,
				i, l, listArray, j, m;
			if (types.length != 0 && method != undefined) {
				for (i = 0, l = types.length; i < l; i++) {
					listArray = this._a5_getListenerArray(types[i], true);
					for (j = 0, m = listArray.length; j < m; j++) {
						if (listArray[j].method === method && 
							listArray[j].type === types[i] && 
							listArray[j].useCapture === useCapture && 
							listArray[j].scope === scope && 
							listArray[j].isOneTime === isOneTime) {
								shouldPush = false;
								break;
						}
					}
					if (shouldPush) {
						listArray.push({
							type: types[i],
							method: method,
							scope: scope,
							useCapture: useCapture === true,
							isOneTime:isOneTime
						});
					}
				}
				this.eListenersChange({
					type: types.length > 1 ? types : types[0],
					method: method,
					changeType: 'ADD'
				});
			} else
				throw 'invalid listener: type- ' + type + ', method- ' + method;
		}
		
		proto._a5_createEvent = function(event, data, bubbles){
			//if event was passed as a string, create a new Event object
			var e = (typeof event === 'string') ? a5.Create(a5.Event, [event, bubbles]) : event;
			if(e instanceof a5.Event || e.doesExtend && e.doesExtend(a5.Error)){
				e._a5_target = this;
				if(data)
					e._a5_data = data;
				return e;
			}
			throw 'Invalid event type.';
		}
		
		proto._a5_dispatchEvent = function(e){
			e._a5_currentTarget = this;
			if (this._a5_listeners) {
				var typeArray = this._a5_getListenerArray(e.type()),
					i, l, thisListener, validPhase;
				if (typeArray) {
					for (i = 0, l = typeArray.length; i < l; i++) {
						thisListener = typeArray ? typeArray[i] : null;
						if (e._a5_canceled || !thisListener) return; //if the event has been canceled (or this object has been destroyed), stop executing
						validPhase = (e.phase() === a5.EventPhase.CAPTURING && thisListener.useCapture) || (e.phase() !== a5.EventPhase.CAPTURING && !thisListener.useCapture), validListener = typeof thisListener.method === 'function' && (thisListener.scope && thisListener.scope.namespace ? thisListener.scope._a5_initialized : true);
						if (validPhase && validListener) thisListener.method.call(thisListener.scope, e);
						if (thisListener.isOneTime === true || (!validListener && this._a5_autoPurge)) {
							typeArray.splice(i, 1);
							i--;
							l--;
						}							
					}
				}
			}
		}
		
		proto._a5_getListenerArray = function(type, create){
			if (this._a5_listeners[type] === undefined) {
				if (create === true) {
					this._a5_listeners[type] = [];
					return this._a5_listeners[type];
				}
				return null;
			}
			return this._a5_listeners[type];
		}
		
		proto.dealloc = function(){
			this.dispatchEvent(a5.Create(a5.Event, [a5.Event.DESTROYED]));
			this.removeAllListeners();
			this._a5_listeners = null;
		}
		
});