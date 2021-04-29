
Object.defineProperty(exports, "__esModule", { value: true });
exports.useScrollConstraints = void 0;
var react_1 = require("react");
/**
 * Calculate the top/bottom scroll constraints of a full-screen element vs the viewport
 */
function useScrollConstraints(ref, measureConstraints) {
    var _a = react_1.useState({
        top: 0,
        bottom: 0
    }), constraints = _a[0], setConstraints = _a[1];
    react_1.useEffect(function () {
        if (!measureConstraints)
            return;
        var element = ref.current;
        var viewportHeight = window.innerHeight;
        var contentTop = element.offsetTop;
        var contentHeight = element.offsetHeight;
        var scrollableViewport = viewportHeight - contentTop * 2;
        var top = Math.min(scrollableViewport - contentHeight, 0);
        setConstraints({ top: top, bottom: 0 });
    }, [measureConstraints]);
    return constraints;
}
exports.useScrollConstraints = useScrollConstraints;
