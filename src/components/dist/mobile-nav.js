'use client';
"use strict";
exports.__esModule = true;
exports.MobileNav = void 0;
var wagmi_1 = require("wagmi");
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var react_1 = require("react");
var utils_1 = require("@/lib/utils");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
// Memoize the MobileNav component to prevent unnecessary re-renders
var MobileNavComponent = react_1.memo(function MobileNav() {
    var address = wagmi_1.useAccount().address;
    var pathname = navigation_1.usePathname();
    var router = navigation_1.useRouter();
    var _a = react_1.useState(false), mounted = _a[0], setMounted = _a[1];
    var _b = react_1.useState(''), activeTab = _b[0], setActiveTab = _b[1];
    var touchStartRef = react_1.useRef(0);
    var touchEndRef = react_1.useRef(0);
    var lastNavigationTimeRef = react_1.useRef(0);
    // Prefetch all routes on mount
    react_1.useEffect(function () {
        setMounted(true);
        // Prefetch all main routes immediately
        var routesToPrefetch = [
            '/feed',
            '/notifications',
            '/leaderboard',
            '/messages',
            '/compose'
        ];
        // Prefetch all routes in parallel
        Promise.all(routesToPrefetch.map(function (route) { return router.prefetch(route); }));
        // If user is logged in, prefetch their profile page
        if (address) {
            router.prefetch("/profile/" + address);
        }
        // Set active tab based on current pathname
        setActiveTab(pathname || '');
    }, [router, address, pathname]);
    // Handle touch events for swipe navigation
    var handleTouchStart = react_1.useCallback(function (e) {
        touchStartRef.current = e.targetTouches[0].clientX;
    }, []);
    var handleTouchEnd = react_1.useCallback(function (e) {
        touchEndRef.current = e.changedTouches[0].clientX;
        handleSwipe();
    }, []);
    var handleSwipe = react_1.useCallback(function () {
        // Prevent rapid navigation (throttle to 300ms)
        var now = Date.now();
        if (now - lastNavigationTimeRef.current < 300)
            return;
        var SWIPE_THRESHOLD = 100; // Minimum distance for a swipe
        var diff = touchStartRef.current - touchEndRef.current;
        // Only navigate if the swipe is significant
        if (Math.abs(diff) < SWIPE_THRESHOLD)
            return;
        // Determine navigation direction
        var routes = ['/feed', '/messages', '/leaderboard', '/notifications', '/profile'];
        var currentIndex = routes.findIndex(function (route) {
            return pathname === route || (route === '/profile' && (pathname === null || pathname === void 0 ? void 0 : pathname.startsWith('/profile')));
        });
        if (currentIndex === -1)
            return;
        var nextIndex;
        if (diff > 0) {
            // Swipe left - go to next tab
            nextIndex = Math.min(currentIndex + 1, routes.length - 1);
        }
        else {
            // Swipe right - go to previous tab
            nextIndex = Math.max(currentIndex - 1, 0);
        }
        // Navigate to the new route
        var nextRoute = routes[nextIndex];
        if (nextRoute === '/profile' && address) {
            router.push("/profile/" + address);
        }
        else {
            router.push(nextRoute);
        }
        lastNavigationTimeRef.current = now;
    }, [pathname, router, address]);
    var profilePath = mounted && address ? "/profile/" + address : '#';
    return (React.createElement(React.Fragment, null,
        React.createElement(link_1["default"], { href: "/compose", className: "fixed right-4 bottom-20 z-50 md:hidden transform transition-transform active:scale-95 touch-manipulation" },
            React.createElement(button_1.Button, { className: "h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg", size: "icon" },
                React.createElement(lucide_react_1.PlusSquare, { className: "h-6 w-6" }))),
        React.createElement("nav", { className: "fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background md:hidden touch-manipulation", onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd },
            React.createElement("div", { className: "flex items-center justify-around" },
                React.createElement(NavLink, { href: "/feed", isActive: pathname === '/feed', icon: React.createElement(lucide_react_1.Home, { className: "w-5 h-5" }), label: "Feed" }),
                React.createElement(NavLink, { href: "/messages", isActive: pathname === '/messages', icon: React.createElement(lucide_react_1.MessageSquare, { className: "w-5 h-5" }), label: "Messages" }),
                React.createElement(NavLink, { href: "/leaderboard", isActive: pathname === '/leaderboard', icon: React.createElement(lucide_react_1.Trophy, { className: "w-5 h-5" }), label: "Rank" }),
                React.createElement(NavLink, { href: "/notifications", isActive: pathname === '/notifications', icon: React.createElement(lucide_react_1.Bell, { className: "w-5 h-5" }), label: "Alerts" }),
                React.createElement(NavLink, { href: profilePath, isActive: pathname === null || pathname === void 0 ? void 0 : pathname.startsWith('/profile'), icon: React.createElement(lucide_react_1.User, { className: "w-5 h-5" }), label: "Profile", onClick: function (e) {
                        if (!mounted || !address) {
                            e.preventDefault();
                            // Optionally show a toast or modal prompting to connect wallet
                        }
                    } })))));
});
// Optimized NavLink component for mobile navigation
var NavLink = react_1.memo(function (_a) {
    var href = _a.href, isActive = _a.isActive, icon = _a.icon, label = _a.label, onClick = _a.onClick;
    return (React.createElement(link_1["default"], { href: href, className: utils_1.cn("flex flex-col items-center justify-center flex-1 h-full py-3 px-2 text-xs transition-colors duration-150 touch-manipulation", isActive ? 'text-primary' : 'text-muted-foreground'), onClick: onClick, prefetch: true },
        React.createElement("div", { className: utils_1.cn("relative flex items-center justify-center w-10 h-10 mb-1 rounded-full", isActive ? 'bg-primary/10' : 'bg-transparent') },
            icon,
            isActive && (React.createElement("span", { className: "absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary" }))),
        React.createElement("span", { className: utils_1.cn("font-medium transition-opacity", isActive ? 'opacity-100' : 'opacity-70') }, label)));
});
NavLink.displayName = 'NavLink';
MobileNavComponent.displayName = 'MobileNav';
// Export the optimized component
exports.MobileNav = MobileNavComponent;
