angular.module('itc.infinitescroll', []);

/*global jQuery*/
(function ()
{
    'use strict';

    function itcInfiniteScroll($window, timeout)
    {
        return{
            link: function (scope, element, attr)
            {
                var lengthThreshold = attr.scrollThreshold || 550, timeThreshold = attr.timeThreshold ||
                        100, handler = scope.$eval(attr.itcInfiniteScroll), promise = null, lastRemaining = 9999;

                lengthThreshold = parseInt(lengthThreshold, 10);
                timeThreshold = parseInt(timeThreshold, 10);

                if (!handler || !angular.isFunction(handler)) {
                    handler = angular.noop;
                }

                jQuery($window).bind('scroll', function ()
                {
                    var remaining = (element[0].clientHeight - jQuery($window).scrollTop());
                    //if we have reached the threshold and we scroll down
                    if (remaining < lengthThreshold && (remaining - lastRemaining) < 0) {

                        //if there is already a timer running which has no expired yet we have to cancel it and restart the timer
                        if (promise !== null) {
                            timeout.cancel(promise);
                        }
                        promise = timeout(function ()
                        {
                            var waitingElement = jQuery('.waiting-for-load');
                            if (waitingElement.length === 0) {
                                jQuery(element[0]).after('<div class="waiting-for-load"></div>');
                            }
                            handler();
                            promise = null;
                        }, timeThreshold);
                    }
                    lastRemaining = remaining;
                });
                scope.$on('productLoading', function ()
                {
                    jQuery('.waiting-for-load').remove();
                });
            }

        };
    }

    angular.module('itc.infinitescroll').directive('itcInfiniteScroll', ['$window', '$timeout', itcInfiniteScroll]);

})();
