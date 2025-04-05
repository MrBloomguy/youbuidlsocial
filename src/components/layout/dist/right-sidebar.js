"use client";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.RightSidebar = void 0;
var react_1 = require("react");
var avatar_1 = require("@/components/ui/avatar");
var link_1 = require("next/link");
var utils_1 = require("@/lib/utils");
var card_1 = require("@/components/ui/card");
var lucide_react_1 = require("lucide-react");
var orbis_1 = require("@/lib/orbis");
function TopPost(_a) {
    var post = _a.post;
    return (React.createElement(link_1["default"], { href: "/post/" + post.id, className: "px-4 py-3 hover:bg-secondary/80 transition-colors block" },
        React.createElement("div", { className: "flex items-start gap-3" },
            React.createElement(avatar_1.Avatar, { className: "h-8 w-8" },
                React.createElement(avatar_1.AvatarImage, { src: post.author.avatar, alt: post.author.name }),
                React.createElement(avatar_1.AvatarFallback, null, utils_1.formatAddress(post.author.id))),
            React.createElement("div", { className: "flex-1 min-w-0" },
                React.createElement("div", { className: "text-sm font-medium mb-1 truncate" }, post.author.name || utils_1.formatAddress(post.author.id)),
                React.createElement("p", { className: "text-sm text-muted-foreground line-clamp-2" }, post.content),
                React.createElement("div", { className: "flex items-center gap-4 mt-2 text-xs text-muted-foreground" },
                    React.createElement("span", null,
                        "\u2764\uFE0F ",
                        post.stats.likes),
                    React.createElement("span", null,
                        "\uD83D\uDCAC ",
                        post.stats.comments))))));
}
function RightSidebar() {
    var _this = this;
    var _a = react_1.useState(false), mounted = _a[0], setMounted = _a[1];
    var _b = react_1.useState([]), topEarners = _b[0], setTopEarners = _b[1];
    var _c = react_1.useState(false), isLoading = _c[0], setIsLoading = _c[1];
    var _d = react_1.useState([]), recentPosts = _d[0], setRecentPosts = _d[1];
    var _e = react_1.useState(false), loading = _e[0], setLoading = _e[1];
    react_1.useEffect(function () {
        setMounted(true);
    }, []);
    // Simplified version without external dependencies
    var mockTopEarners = [
        {
            id: '0x1234567890abcdef',
            name: '0x1234...cdef',
            username: '0x1234...cdef',
            avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=user1',
            points: 1250,
            level: 4
        },
        {
            id: '0xabcdef1234567890',
            name: '0xabcd...7890',
            username: '0xabcd...7890',
            avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=user2',
            points: 980,
            level: 3
        },
        {
            id: '0x9876543210abcdef',
            name: '0x9876...cdef',
            username: '0x9876...cdef',
            avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=user3',
            points: 750,
            level: 3
        }
    ];
    // Fetch real posts from Orbis
    var fetchRecentPosts = function () { return __awaiter(_this, void 0, void 0, function () {
        var isConnected, _a, data, orbisError, transformedPosts, sortedPosts, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, 6, 7]);
                    setLoading(true);
                    if (!orbis_1.orbis) {
                        throw new Error('Orbis client not initialized');
                    }
                    return [4 /*yield*/, orbis_1.orbis.isConnected()];
                case 1:
                    isConnected = (_b.sent()).status;
                    if (!!isConnected) return [3 /*break*/, 3];
                    return [4 /*yield*/, orbis_1.orbis.connect()];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3: return [4 /*yield*/, orbis_1.orbis.getPosts({
                        context: 'youbuidl:post'
                    })];
                case 4:
                    _a = _b.sent(), data = _a.data, orbisError = _a.error;
                    if (orbisError) {
                        throw new Error("Orbis error: " + orbisError);
                    }
                    if (!Array.isArray(data)) {
                        console.error('Unexpected Orbis response:', data);
                        throw new Error('Invalid response format from Orbis');
                    }
                    transformedPosts = data.map(function (post) {
                        var _a, _b, _c, _d, _e, _f, _g;
                        if (!post || typeof post !== 'object') {
                            console.warn('Invalid post data:', post);
                            return null;
                        }
                        return {
                            id: post.stream_id || '',
                            content: ((_a = post.content) === null || _a === void 0 ? void 0 : _a.body) || '',
                            author: {
                                id: post.creator || '',
                                name: ((_c = (_b = post.creator_details) === null || _b === void 0 ? void 0 : _b.profile) === null || _c === void 0 ? void 0 : _c.username) ||
                                    (post.creator ? post.creator.slice(0, 6) + "..." + post.creator.slice(-4) : ''),
                                username: ((_e = (_d = post.creator_details) === null || _d === void 0 ? void 0 : _d.profile) === null || _e === void 0 ? void 0 : _e.username) || post.creator || '',
                                avatar: ((_g = (_f = post.creator_details) === null || _f === void 0 ? void 0 : _f.profile) === null || _g === void 0 ? void 0 : _g.pfp) ||
                                    "https://api.dicebear.com/9.x/bottts/svg?seed=" + (post.creator || 'default'),
                                verified: false
                            },
                            timestamp: post.timestamp ? new Date(post.timestamp * 1000).toISOString() : new Date().toISOString(),
                            stats: {
                                likes: Number(post.count_likes) || 0,
                                comments: Number(post.count_replies) || 0,
                                reposts: Number(post.count_haha) || 0
                            }
                        };
                    }).filter(function (post) { return post !== null; });
                    sortedPosts = transformedPosts.sort(function (a, b) {
                        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                    });
                    // Take only the 5 most recent posts
                    setRecentPosts(sortedPosts.slice(0, 5));
                    return [3 /*break*/, 7];
                case 5:
                    err_1 = _b.sent();
                    console.error('Error fetching posts for sidebar:', err_1);
                    return [3 /*break*/, 7];
                case 6:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Fetch data when component mounts
    react_1.useEffect(function () {
        if (mounted) {
            setTopEarners(mockTopEarners);
            fetchRecentPosts();
            // Refresh posts every 60 seconds
            var intervalId_1 = setInterval(function () {
                fetchRecentPosts();
            }, 60000);
            return function () { return clearInterval(intervalId_1); };
        }
    }, [mounted]);
    if (!mounted)
        return null;
    return (React.createElement("div", { className: "w-0 lg:w-[320px] xl:w-[380px] h-full hidden lg:block bg-background" },
        React.createElement("div", { className: "h-full flex flex-col" },
            React.createElement("div", { className: "flex-1 overflow-y-auto hide-scrollbar" },
                React.createElement("div", { className: "mb-4" },
                    React.createElement(card_1.Card, { className: "overflow-hidden rounded-none border-x-0 bg-background" },
                        React.createElement("div", { className: "p-4 font-semibold text-sm border-b border-border flex items-center gap-2" }, "\uD83D\uDCDD Recent Posts"),
                        React.createElement("div", null, loading ? (React.createElement("div", { className: "flex items-center justify-center p-4" },
                            React.createElement(lucide_react_1.Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" }))) : recentPosts.length > 0 ? (recentPosts.map(function (post) { return (React.createElement(TopPost, { key: post.id, post: post })); })) : (React.createElement("div", { className: "px-4 py-3 text-sm text-muted-foreground" }, "No recent posts"))))),
                React.createElement("div", { className: "mb-4" },
                    React.createElement(card_1.Card, { className: "overflow-hidden rounded-none border-x-0 bg-background" },
                        React.createElement("div", { className: "p-4 font-semibold text-sm border-b border-border flex items-center gap-2" }, "\uD83C\uDFC6 Top Earners"),
                        React.createElement("div", null, isLoading ? (React.createElement("div", { className: "flex items-center justify-center p-4" },
                            React.createElement(lucide_react_1.Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" }))) : topEarners.length > 0 ? (React.createElement("div", { className: "divide-y divide-border" }, topEarners.map(function (earner) { return (React.createElement("div", { key: earner.id, className: "p-3 flex items-center gap-3" },
                            React.createElement(avatar_1.Avatar, { className: "h-8 w-8" },
                                React.createElement(avatar_1.AvatarImage, { src: earner.avatar, alt: earner.name }),
                                React.createElement(avatar_1.AvatarFallback, null, earner.name[0])),
                            React.createElement("div", { className: "flex-1 min-w-0" },
                                React.createElement("div", { className: "text-sm font-medium truncate" }, earner.name),
                                React.createElement("div", { className: "text-xs text-muted-foreground" },
                                    earner.points,
                                    " points")),
                            React.createElement("div", { className: "text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full" },
                                "Level ",
                                earner.level))); }))) : (React.createElement("div", { className: "px-4 py-3 text-sm text-muted-foreground" }, "No data available")))))),
            React.createElement("div", { className: "mt-auto pb-16 hide-scrollbar" },
                React.createElement("div", { className: "p-4 text-xs text-muted-foreground" },
                    React.createElement("p", null, "\u00A9 2023 YouBuidl Social"),
                    React.createElement("p", { className: "mt-1" }, "Built on Optimism"))))));
}
exports.RightSidebar = RightSidebar;
