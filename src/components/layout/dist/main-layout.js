'use client';
"use strict";
exports.__esModule = true;
exports.MainLayout = void 0;
var react_1 = require("react");
var dynamic_1 = require("next/dynamic");
var tooltip_1 = require("@/components/ui/tooltip");
// Dynamically import components to improve initial load time
var Header = dynamic_1["default"](function () { return Promise.resolve().then(function () { return require("./header"); }).then(function (mod) { return ({ "default": mod.Header }); }); }, { ssr: true });
var Sidebar = dynamic_1["default"](function () { return Promise.resolve().then(function () { return require("./sidebar"); }).then(function (mod) { return ({ "default": mod.Sidebar }); }); }, { ssr: false });
// Import RightSidebar directly to avoid chunk loading issues
var right_sidebar_1 = require("./right-sidebar");
exports.MainLayout = function (_a) {
    var children = _a.children, _b = _a.showHeader, showHeader = _b === void 0 ? true : _b;
    var _c = react_1.useState(false), mounted = _c[0], setMounted = _c[1];
    // Only render client-side components after mount
    react_1.useEffect(function () {
        setMounted(true);
    }, []);
    return (react_1["default"].createElement(tooltip_1.TooltipProvider, null,
        react_1["default"].createElement("div", { className: "min-h-screen bg-background" },
            showHeader && (react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement("div", { className: "hidden md:block fixed top-0 left-0 right-0 h-16 z-50 bg-background border-b border-border" },
                    react_1["default"].createElement(Header, null)),
                react_1["default"].createElement("div", { className: "md:hidden fixed top-0 left-0 right-0 h-14 z-50 bg-background border-b border-border" },
                    react_1["default"].createElement(Header, null)))),
            react_1["default"].createElement("div", { className: "flex " + (showHeader ? 'pt-14 md:pt-16' : 'pt-0') },
                react_1["default"].createElement("div", { className: "hidden md:block w-64 xl:w-72 shrink-0" },
                    react_1["default"].createElement("div", { className: "fixed " + (showHeader ? 'top-16' : 'top-0') + " bottom-0 w-64 xl:w-72 overflow-y-auto border-r border-border py-8 px-4" }, mounted && react_1["default"].createElement(Sidebar, null))),
                react_1["default"].createElement("main", { className: "flex-1 min-h-screen w-full" }, children),
                react_1["default"].createElement("div", { className: "hidden lg:block w-[320px] xl:w-[380px] shrink-0" },
                    react_1["default"].createElement("div", { className: "fixed " + (showHeader ? 'top-16' : 'top-0') + " bottom-0 w-[320px] xl:w-[380px] overflow-y-auto hide-scrollbar border-l border-border bg-background" },
                        react_1["default"].createElement("div", { className: "pb-16" }, mounted && react_1["default"].createElement(right_sidebar_1.RightSidebar, null))))))));
};
exports["default"] = exports.MainLayout;
