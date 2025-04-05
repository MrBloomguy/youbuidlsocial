'use client';
"use strict";
exports.__esModule = true;
exports.LoginButton = void 0;
require("./globals.css");
var theme_provider_1 = require("@/components/theme-provider");
var notification_provider_1 = require("@/components/notification-provider");
var auth_provider_1 = require("@/providers/auth-provider");
var points_provider_1 = require("@/providers/points-provider");
var toaster_1 = require("@/components/ui/toaster");
var mobile_nav_1 = require("@/components/mobile-nav");
var google_1 = require("next/font/google");
var privy_provider_1 = require("@/providers/privy-provider");
var rainbow_kit_provider_1 = require("@/providers/rainbow-kit-provider");
var react_query_1 = require("@tanstack/react-query");
var react_1 = require("react");
var register_sw_1 = require("@/utils/register-sw");
var page_transition_1 = require("@/components/page-transition");
var orbis_1 = require("@/lib/orbis");
var inter = google_1.Inter({
    subsets: ['latin'],
    variable: '--font-sans'
});
// Configure the QueryClient with optimized settings
var queryClient = new react_query_1.QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
            cacheTime: 1000 * 60 * 30,
            retry: 1,
            suspense: false
        }
    }
});
function RootLayout(_a) {
    var children = _a.children;
    // Register service worker and initialize Orbis
    react_1.useEffect(function () {
        register_sw_1.registerServiceWorker();
        // Initialize Orbis connection
        orbis_1.initializeOrbis()["catch"](function (error) {
            console.error('Failed to initialize Orbis:', error);
        });
    }, []);
    return (React.createElement("html", { lang: "en", suppressHydrationWarning: true, className: inter.variable },
        React.createElement("head", null,
            React.createElement("link", { rel: "manifest", href: "/manifest.json" }),
            React.createElement("meta", { name: "theme-color", content: "#000000" }),
            React.createElement("meta", { name: "apple-mobile-web-app-capable", content: "yes" }),
            React.createElement("meta", { name: "apple-mobile-web-app-status-bar-style", content: "black" }),
            React.createElement("link", { rel: "apple-touch-icon", href: "/icon-192.png" })),
        React.createElement("body", null,
            React.createElement(react_query_1.QueryClientProvider, { client: queryClient },
                React.createElement(rainbow_kit_provider_1.WalletProvider, null,
                    React.createElement(privy_provider_1.PrivyClientProvider, null,
                        React.createElement(theme_provider_1.ThemeProvider, { defaultTheme: "system", enableSystem: true, attribute: "class" },
                            React.createElement(notification_provider_1.NotificationProvider, null,
                                React.createElement(auth_provider_1.AuthProvider, null,
                                    React.createElement(points_provider_1.PointsProvider, null,
                                        React.createElement(page_transition_1.PageTransition, null, children),
                                        React.createElement(toaster_1.Toaster, null),
                                        React.createElement(mobile_nav_1.MobileNav, null)))))))))));
}
exports["default"] = RootLayout;
function LoginButton() {
    var _a, _b, _c, _d, _e;
    var _f = usePrivy(), login = _f.login, logout = _f.logout, authenticated = _f.authenticated, user = _f.user, ready = _f.ready;
    if (!ready) {
        return null;
    }
    if (!authenticated) {
        return (React.createElement(Button, { onClick: login, variant: "outline", className: "rounded-full" }, "Login"));
    }
    return (React.createElement(DropdownMenu, null,
        React.createElement(DropdownMenuTrigger, { asChild: true },
            React.createElement(Button, { variant: "outline", className: "rounded-full" }, ((_a = user === null || user === void 0 ? void 0 : user.email) === null || _a === void 0 ? void 0 : _a.address) || ((_c = (_b = user === null || user === void 0 ? void 0 : user.wallet) === null || _b === void 0 ? void 0 : _b.address) === null || _c === void 0 ? void 0 : _c.slice(0, 6)) + '...' + ((_e = (_d = user === null || user === void 0 ? void 0 : user.wallet) === null || _d === void 0 ? void 0 : _d.address) === null || _e === void 0 ? void 0 : _e.slice(-4)))),
        React.createElement(DropdownMenuContent, null,
            React.createElement(DropdownMenuItem, { onClick: logout }, "Logout"))));
}
exports.LoginButton = LoginButton;
