
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWheelScroll = void 0;
var framer_motion_1 = require("framer-motion");
var popmotion_1 = require("popmotion");
var popcorn_1 = require("@popmotion/popcorn");
var lodash_1 = require("lodash");
// Absolute distance a wheel scroll event can travel outside of
// the defined constraints before we fire a "snap back" animation
var deltaThreshold = 5;
// If wheel event fires beyond constraints, multiple the delta by this amount
var elasticFactor = 0.1;
function springTo(value, from, to) {
    if (value.isAnimating())
        return;
    value.start(function (complete) {
        var animation = popmotion_1.spring({
            from: from,
            to: to,
            velocity: value.getVelocity(),
            stiffness: 400,
            damping: 40
        }).start({
            update: function (v) { return value.set(v); },
            complete: complete
        });
        return function () { return animation.stop(); };
    });
}
var debouncedSpringTo = lodash_1.debounce(springTo, 100);
/**
 * Re-implements wheel scroll for overlflow: hidden elements.
 *
 * Adds Apple Watch crown-style constraints, where the user
 * must continue to input wheel events of a certain delta at a certain
 * speed or the scrollable container will spring back to the nearest
 * constraint.
 *
 * Currently achieves this using event.deltaY and a debounce, which
 * feels pretty good during direct input but it'd be better to increase
 * the deltaY threshold during momentum scroll.
 *
 * TODOs before inclusion in Framer Motion:
 * - Detect momentum scroll and increase delta threshold before spring
 * - Remove padding hack
 * - Handle x-axis
 * - Perhaps handle arrow and space keyboard events?
 *
 * @param ref - Ref of the Element to attach listener to
 * @param y - MotionValue for the scrollable element - might be different to the Element
 * @param constraints - top/bottom scroll constraints in pixels.
 * @param isActive - `true` if this listener should fire.
 */
function useWheelScroll(ref, y, constraints, onWheelCallback, isActive) {
    var onWheel = function (event) {
        event.preventDefault();
        var currentY = y.get();
        var newY = currentY - event.deltaY;
        var startedAnimation = false;
        var isWithinBounds = constraints && newY >= constraints.top && newY <= constraints.bottom;
        if (constraints && !isWithinBounds) {
            newY = popcorn_1.mix(currentY, newY, elasticFactor);
            if (newY < constraints.top) {
                if (event.deltaY <= deltaThreshold) {
                    springTo(y, newY, constraints.top);
                    startedAnimation = true;
                }
                else {
                    debouncedSpringTo(y, newY, constraints.top);
                }
            }
            if (newY > constraints.bottom) {
                if (event.deltaY >= -deltaThreshold) {
                    springTo(y, newY, constraints.bottom);
                    startedAnimation = true;
                }
                else {
                    debouncedSpringTo(y, newY, constraints.bottom);
                }
            }
        }
        if (!startedAnimation) {
            y.stop();
            y.set(newY);
        }
        else {
            debouncedSpringTo.cancel();
        }
        onWheelCallback(event);
    };
    framer_motion_1.useDomEvent(ref, "wheel", isActive && onWheel, { passive: false });
}
exports.useWheelScroll = useWheelScroll;
