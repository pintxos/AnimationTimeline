(function (window) {

	'use strict';

	// UMD
	if(typeof define !== 'function') {
		window.define = function(deps, definition) {
			window.pintxos = window.pintxos || {};
			window.pintxos.AnimationTimeline = definition(jQuery, pintxos.inherit, EventEmitter);
			define = null;
		};
	}

	define(
	[
		'jQuery',
		'pintxos-inherit',
		'EventEmitter'
	], function (
		$,
		inherit,
		EventEmitter
	) {


		var AnimationTimeline, _defaults, rAF;

		_defaults = {
			easing: 'linear',
			events: {
				tick: 'tick.AnimationTimeline'
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
			this._easing = (typeof easing === 'function') ? easing : AnimationTimeline.easing[easing];

		};

		inherit(AnimationTimeline, EventEmitter);

		/* Static properties
		----------------------------------------------- */
		AnimationTimeline.easing = {
			linear: function (t) { return t; },
			easeInQuad: function (t) { return t*t; },
			easeOutQuad: function (t) { return t*(2-t); }
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
			this._tick(this._progress);
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
		AnimationTimeline.prototype._tick = function (progress) {
			var currTime, timePassed, _self;

			_self = this;

			currTime = new Date().getTime();
			timePassed = currTime - this._startTime;

			progress = (typeof progress === 'undefined') ? 0 : progress;

			this._progress = Math.min(this._easing(timePassed / this._duration) + progress, 1);

			this.emit(this._settings.events.tick, this._progress);

			if(this._progress < 1 && !this._stop) {
				rAF(function () {
					_self._tick();
				});
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
