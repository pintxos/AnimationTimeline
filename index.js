(function (window) {

	'use strict';

	// UMD
	if(typeof define !== 'function') {
		window.define = function(deps, definition) {
			window.pintxos = window.pintxos || {};
			window.pintxos.AnimationTimer = definition(jQuery, pintxos.inherit, EventEmitter);
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


		var AnimationTimer, _defaults, rAF;

		_defaults = {
			easing: 'linear',
			events: {
				tick: 'tick.AnimationTimer'
			}
		};

		/* Constructor
		----------------------------------------------- */
		AnimationTimer = function (duration, options) {

			var easing;

			this._settings = $.extend(true, {}, _defaults, options);

			this._duration = duration;
			this._progress = 0;
			this._stop = false;

			// determine easing function
			easing = this._settings.easing;
			this._easing = (typeof easing === 'function') ? easing : AnimationTimer.easing[easing];

		};

		inherit(AnimationTimer, EventEmitter);

		/* Static properties
		----------------------------------------------- */
		AnimationTimer.easing = {
			linear: function (t) { return t },
			easeInQuad: function (t) { return t*t },
			easeOutQuad: function (t) { return t*(2-t) }
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

		AnimationTimer.prototype.start = function () {
			this._stop = false;
			this._startTime = new Date().getTime();
			this._tick(this._progress);
		};

		AnimationTimer.prototype._tick = function (progress) {
			var currTime, time, _self;

			_self = this;

			currTime = new Date().getTime();
			time = currTime - this._startTime;

			progress = (typeof progress === 'undefined') ? 0 : progress;

			this._progress = Math.min(this._easing(time / this._duration) + progress, 1);

			this.emit(this._settings.events.tick, this._progress);

			if(this._progress < 1 && !this._stop) {
				rAF(function () {
					_self._tick();
				});
			}
		}

		AnimationTimer.prototype.reset = function () {
			this._progress = 0;
		};

		AnimationTimer.prototype.stop = function () {
			this._stop = true;
		};

		/* Export
		----------------------------------------------- */
		return AnimationTimer;

	});

})(this);
