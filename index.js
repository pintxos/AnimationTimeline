(function (window) {

	'use strict';

	// UMD
	if(typeof define !== 'function') {
		window.define = function(deps, definition) {
			window.pintxos = window.pintxos || {};
			window.pintxos.AnimationTimeline = definition(jQuery, pintxos.inherit, EventEmitter, BezierEasing);
			define = null;
		};
	}

	define(
	[
		'jQuery',
		'pintxos-inherit',
		'EventEmitter',
		'BezierEasing'
	], function (
		$,
		inherit,
		EventEmitter,
		BezierEasing
	) {


		var AnimationTimeline, _defaults, rAF;

		_defaults = {
			easing: 'linear',
			events: {
				tick: 'tick'
			}
		};

		/* Constructor
		----------------------------------------------- */
		AnimationTimeline = function (duration, options) {

			var easing;

			this._settings = $.extend(true, {}, _defaults, options);
			this._duration = (typeof duration !== 'number') ? 500 : duration;
			this._progress = 0;
			this._stop = false;

			// determine easing function
			easing = this._settings.easing;

			if(typeof easing === 'string') {

				if(AnimationTimeline.easing.hasOwnProperty(easing)) {
					this._easing = AnimationTimeline.easing[easing];
				}else {
					this._easing = _defaults.easing;
				}

			}else {
				this._easing = easing;
			}

		};

		inherit(AnimationTimeline, EventEmitter);


		/* Static properties
		----------------------------------------------- */
		AnimationTimeline.easing = {
			linear: [0.00, 0.0, 1.00, 1.0],
		};


		/* Helper function
		----------------------------------------------- */
		rAF = (function () {
			return  window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					function( callback ){
						window.setTimeout(callback, 1000 / 60);
					};
		})();



		/* Methods
		----------------------------------------------- */

		/**
		 * Start the timer
		 *
		 * @return {void}
		 */
		AnimationTimeline.prototype.start = function () {
			this._stop = false;
			this._startTime = new Date().getTime();
			this._tick();
		};

		/**
		 * Executed each frame until the progress equals 1 or the stop var is set to true.
		 * This function is also used to start the ticking process.
		 * An optional progress parameter can be passed when the ticking process
		 * should start at a certain progress value.
		 *
		 * @param  {number} (optional)
		 * @return {void}
		 */
		AnimationTimeline.prototype._tick = function () {
			var currTime, _self, timePassed;

			_self = this;

			currTime = new Date().getTime();
			timePassed = currTime - this._startTime;

			this._progress = BezierEasing.apply(this, this._easing)(timePassed / this._duration);

			this.emit(this._settings.events.tick, this._progress);

			if((timePassed / this._duration) <= 1 && !this._stop) {

				rAF(function () {
					_self._tick();
				});

			}else {

				// make sure we stop at 100%
				this.emit(this._settings.events.tick, 1);
				this.emit(this._settings.events.done);

			}
		};

		/**
		 * Resets the progress param
		 *
		 * @return {void}
		 */
		AnimationTimeline.prototype.reset = function () {
			this._progress = 0;
		};

		/**
		 * Stops the ticking process
		 *
		 * @return {void}
		 */
		AnimationTimeline.prototype.stop = function () {
			this._stop = true;
		};


		/* Export
		----------------------------------------------- */
		return AnimationTimeline;

	});

})(this);
