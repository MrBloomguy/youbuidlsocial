'use client';
"use strict";
exports.__esModule = true;
exports.PageTransition = void 0;
var navigation_1 = require("next/navigation");
var react_1 = require("react");
var utils_1 = require("@/lib/utils");
var loading_state_1 = require("@/components/loading-state");
function PageTransition(_a) {
    var children = _a.children;
    var pathname = navigation_1.usePathname();
    var _b = react_1.useState(false), isTransitioning = _b[0], setIsTransitioning = _b[1];
    var _c = react_1.useState(children), displayChildren = _c[0], setDisplayChildren = _c[1];
    var _d = react_1.useState(true), transitionComplete = _d[0], setTransitionComplete = _d[1];
    var _e = react_1.useState(false), showLoading = _e[0], setShowLoading = _e[1];
    var prevPathRef = react_1.useRef(null);
    // Determine loading state type based on pathname
    var getLoadingType = function () {
        if (pathname === null || pathname === void 0 ? void 0 : pathname.startsWith('/profile'))
            return 'profile';
        if (pathname === null || pathname === void 0 ? void 0 : pathname.startsWith('/post/'))
            return 'post';
        if (pathname === '/feed' || pathname === '/notifications' || pathname === '/leaderboard')
            return 'feed';
        return 'default';
    };
    react_1.useEffect(function () {
        if (pathname) {
            // Don't show loading state for initial render
            if (prevPathRef.current !== null) {
                setIsTransitioning(true);
                setTransitionComplete(false);
                // Show loading state after a short delay (only if transition takes longer than 100ms)
                var loadingTimeout_1 = setTimeout(function () {
                    setShowLoading(true);
                }, 100);
                // Short delay to allow exit animation
                var transitionTimeout_1 = setTimeout(function () {
                    setDisplayChildren(children);
                    setIsTransitioning(false);
                    setShowLoading(false);
                    // Allow time for entry animation
                    setTimeout(function () {
                        setTransitionComplete(true);
                    }, 200);
                }, 300);
                return function () {
                    clearTimeout(loadingTimeout_1);
                    clearTimeout(transitionTimeout_1);
                };
            }
            prevPathRef.current = pathname;
        }
    }, [pathname, children]);
    return (React.createElement("div", { className: utils_1.cn('transition-all duration-300 ease-in-out', isTransitioning ? 'opacity-0 transform translate-y-1' : 'opacity-100 transform translate-y-0', !transitionComplete && 'overflow-hidden') }, showLoading ? (React.createElement("div", { className: "animate-in fade-in duration-300" },
        React.createElement(loading_state_1.LoadingState, { type: getLoadingType() }))) : (displayChildren)));
}
exports.PageTransition = PageTransition;
