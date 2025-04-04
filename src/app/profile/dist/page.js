'use client';
"use strict";
exports.__esModule = true;
var use_auth_1 = require("@/hooks/use-auth");
var navigation_1 = require("next/navigation");
var react_1 = require("react");
var main_layout_1 = require("@/components/layout/main-layout");
var page_header_1 = require("@/components/layout/page-header");
var avatar_1 = require("@/components/ui/avatar");
var button_1 = require("@/components/ui/button");
var wagmi_1 = require("wagmi");
var loading_state_1 = require("@/components/loading-state");
function ProfilePage() {
    var _a = use_auth_1.useAuth(), isAuthenticated = _a.isAuthenticated, isLoading = _a.isLoading, user = _a.user;
    var router = navigation_1.useRouter();
    var address = wagmi_1.useAccount().address;
    var _b = react_1.useState(false), mounted = _b[0], setMounted = _b[1];
    react_1.useEffect(function () {
        setMounted(true);
        // If user is authenticated and has an address, redirect to their profile page
        if (mounted && !isLoading && isAuthenticated && address) {
            router.push("/profile/" + address);
        }
    }, [isLoading, isAuthenticated, router, address, mounted]);
    // Show loading state while checking authentication
    if (isLoading || !mounted) {
        return (React.createElement(main_layout_1.MainLayout, null,
            React.createElement(page_header_1.PageHeader, { title: "Profile" }),
            React.createElement(loading_state_1.LoadingState, { type: "profile" })));
    }
    // If not authenticated, show login prompt
    if (!isAuthenticated) {
        return (React.createElement(main_layout_1.MainLayout, null,
            React.createElement(page_header_1.PageHeader, { title: "Profile" }),
            React.createElement("div", { className: "flex flex-col items-center justify-center p-8 text-center" },
                React.createElement(avatar_1.Avatar, { className: "h-24 w-24 mb-4" },
                    React.createElement(avatar_1.AvatarFallback, null, "?")),
                React.createElement("h2", { className: "text-2xl font-bold mb-2" }, "Sign in to view your profile"),
                React.createElement("p", { className: "text-muted-foreground mb-6" }, "Connect your wallet to access your profile and activity"),
                React.createElement(button_1.Button, { onClick: function () { return router.push('/'); } }, "Connect Wallet"))));
    }
    // This should not be reached as authenticated users with an address are redirected
    return (React.createElement(main_layout_1.MainLayout, null,
        React.createElement(page_header_1.PageHeader, { title: "Profile" }),
        React.createElement("div", { className: "flex flex-col items-center justify-center p-8 text-center" },
            React.createElement("p", null, "Redirecting to your profile..."))));
}
exports["default"] = ProfilePage;
