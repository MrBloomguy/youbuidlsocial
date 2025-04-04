"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.PointsLeaderboard = exports.PostCard = void 0;
var react_1 = require("react");
var image_1 = require("next/image");
var navigation_1 = require("next/navigation");
var use_toast_1 = require("@/components/ui/use-toast");
var usePointsContract_1 = require("@/hooks/usePointsContract");
var provider_1 = require("@/lib/provider");
var PointsContract_json_1 = require("@/contracts/contracts/PointsContract.sol/PointsContract.json");
var use_post_interactions_1 = require("@/hooks/use-post-interactions");
var avatar_1 = require("@/components/ui/avatar");
var date_fns_1 = require("date-fns");
var tooltip_1 = require("@/components/ui/tooltip");
var badge_1 = require("@/components/ui/badge");
var input_1 = require("@/components/ui/input");
var button_1 = require("@/components/ui/button");
var donation_badge_1 = require("@/components/donation-badge");
var ethers_1 = require("ethers");
var next_themes_1 = require("next-themes");
var lucide_react_1 = require("lucide-react");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var DonationModal_1 = require("@/components/DonationModal");
var card_1 = require("@/components/ui/card");
var utils_1 = require("@/lib/utils");
var wagmi_1 = require("wagmi");
var donation_widget_1 = require("@/components/donation-widget");
var lucide_react_2 = require("lucide-react");
var gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL;
function PostCard(_a) {
    var _this = this;
    var _b;
    var post = _a.post;
    var router = navigation_1.useRouter();
    var toast = use_toast_1.useToast().toast;
    var _c = usePointsContract_1.usePointsContract(), addLike = _c.addLike, addComment = _c.addComment;
    var _d = use_post_interactions_1.usePostInteractions(post.id), like = _d.like, repost = _d.repost, comment = _d.comment, isProcessing = _d.isProcessing, isConnected = _d.isConnected;
    var _e = react_1.useState(false), isLiked = _e[0], setIsLiked = _e[1];
    var _f = react_1.useState(false), showDonateModal = _f[0], setShowDonateModal = _f[1];
    var _g = react_1.useState(((_b = post.stats) === null || _b === void 0 ? void 0 : _b.likes) || 0), likeCount = _g[0], setLikeCount = _g[1];
    var _h = react_1.useState(false), isReposted = _h[0], setIsReposted = _h[1];
    var _j = react_1.useState(post.stats.reposts), repostCount = _j[0], setRepostCount = _j[1];
    var _k = react_1.useState(post.stats.comments), commentCount = _k[0], setCommentCount = _k[1];
    var _l = react_1.useState(false), isCommentsOpen = _l[0], setIsCommentsOpen = _l[1];
    var _m = react_1.useState([]), comments = _m[0], setComments = _m[1];
    var _o = react_1.useState(false), isLoadingComments = _o[0], setIsLoadingComments = _o[1];
    var _p = react_1.useState(false), isSubmittingComment = _p[0], setIsSubmittingComment = _p[1];
    var _q = react_1.useState(''), newComment = _q[0], setNewComment = _q[1];
    var _r = react_1.useState(false), showDonationWidget = _r[0], setShowDonationWidget = _r[1];
    var _s = react_1.useState(0), userPoints = _s[0], setUserPoints = _s[1];
    var _t = react_1.useState(true), isLoadingPoints = _t[0], setIsLoadingPoints = _t[1];
    var theme = next_themes_1.useTheme().theme;
    // Check if the current user has liked or reposted this post
    react_1.useEffect(function () {
        function checkUserInteractions() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    try {
                        // For now, we'll just use the local state
                        // In a real app, you would check if the user has liked or reposted the post
                        // by querying the blockchain or a database
                        // This is a placeholder for actual implementation
                        // setIsLiked(false);
                        // setIsReposted(false);
                    }
                    catch (error) {
                        console.error('Error checking user interactions:', error);
                    }
                    return [2 /*return*/];
                });
            });
        }
        checkUserInteractions();
    }, [post.id]);
    // Fetch user points
    react_1.useEffect(function () {
        function fetchUserPoints() {
            return __awaiter(this, void 0, void 0, function () {
                var authorId, authorAddress, provider, contractAddress, contract, points, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            authorId = post.author.id;
                            if (!authorId)
                                return [2 /*return*/];
                            authorAddress = '0x741Bc71588D75b35660AE124F6ba6921b00fa958';
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, 5, 6]);
                            setIsLoadingPoints(true);
                            return [4 /*yield*/, provider_1.getProvider()];
                        case 2:
                            provider = _a.sent();
                            contractAddress = process.env.NEXT_PUBLIC_POINTS_CONTRACT_ADDRESS;
                            if (!contractAddress)
                                return [2 /*return*/];
                            contract = new ethers_1.ethers.Contract(contractAddress, PointsContract_json_1["default"].abi, provider);
                            console.log('Fetching points for address:', authorAddress);
                            return [4 /*yield*/, contract.getUserPoints(authorAddress)];
                        case 3:
                            points = _a.sent();
                            console.log('Points fetched:', Number(points));
                            setUserPoints(Number(points));
                            return [3 /*break*/, 6];
                        case 4:
                            error_1 = _a.sent();
                            console.error('Error fetching user points:', error_1);
                            return [3 /*break*/, 6];
                        case 5:
                            setIsLoadingPoints(false);
                            return [7 /*endfinally*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
        fetchUserPoints();
    }, [post.author.id]);
    var projectConfig = {
        id: post.id,
        name: post.author.name,
        recipients: [
            {
                address: post.author.address,
                chainId: 11155420,
                share: 100 // Full share to the author
            }
        ],
        theme: {
            primaryColor: '#676FFF',
            buttonStyle: 'rounded',
            size: 'medium',
            darkMode: theme === 'dark'
        }
    };
    var handlePostClick = function (e) {
        if (e.target.closest('button') || e.target.closest('a')) {
            return;
        }
        router.push("/post/" + post.id);
    };
    var handleLike = function () { return __awaiter(_this, void 0, void 0, function () {
        var wasLiked, success, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isProcessing)
                        return [2 /*return*/];
                    wasLiked = isLiked;
                    setIsLiked(!wasLiked);
                    setLikeCount(function (prev) { return wasLiked ? prev - 1 : prev + 1; });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, like(wasLiked)];
                case 2:
                    success = _a.sent();
                    // If the API call fails, revert the UI
                    if (!success) {
                        setIsLiked(wasLiked);
                        setLikeCount(function (prev) { return wasLiked ? prev + 1 : prev - 1; });
                        throw new Error('Failed to like post');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    // Revert UI changes on error
                    setIsLiked(wasLiked);
                    setLikeCount(function (prev) { return wasLiked ? prev + 1 : prev - 1; });
                    console.error('Like error:', error_2);
                    toast({
                        title: "Error",
                        description: error_2 instanceof Error ? error_2.message : "Failed to like post",
                        variant: "destructive"
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleRepost = function () { return __awaiter(_this, void 0, void 0, function () {
        var wasReposted, success, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isProcessing)
                        return [2 /*return*/];
                    wasReposted = isReposted;
                    setIsReposted(!wasReposted);
                    setRepostCount(function (prev) { return wasReposted ? prev - 1 : prev + 1; });
                    // Show a subtle toast for repost
                    if (!wasReposted) {
                        toast({
                            title: "Post reposted",
                            description: "Content shared to your feed"
                        });
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, repost(wasReposted)];
                case 2:
                    success = _a.sent();
                    // If the API call fails, revert the UI
                    if (!success) {
                        setIsReposted(wasReposted);
                        setRepostCount(function (prev) { return wasReposted ? prev + 1 : prev - 1; });
                        throw new Error('Failed to repost');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    // Revert UI changes on error
                    setIsReposted(wasReposted);
                    setRepostCount(function (prev) { return wasReposted ? prev + 1 : prev - 1; });
                    console.error('Repost error:', error_3);
                    toast({
                        title: "Error",
                        description: error_3 instanceof Error ? error_3.message : "Could not process repost action",
                        variant: "destructive"
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleDonate = function () {
        setShowDonateModal(true);
    };
    var handleShare = function (type) { return __awaiter(_this, void 0, void 0, function () {
        var postUrl, text, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    postUrl = window.location.origin + "/post/" + post.id;
                    text = ((_b = post.ceramicData) === null || _b === void 0 ? void 0 : _b.body) || post.content;
                    _a = type;
                    switch (_a) {
                        case 'copy': return [3 /*break*/, 1];
                        case 'twitter': return [3 /*break*/, 3];
                        case 'email': return [3 /*break*/, 4];
                    }
                    return [3 /*break*/, 5];
                case 1: return [4 /*yield*/, navigator.clipboard.writeText(postUrl)];
                case 2:
                    _c.sent();
                    toast({
                        title: "Link copied",
                        description: "Post link has been copied to your clipboard"
                    });
                    return [3 /*break*/, 5];
                case 3:
                    window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(postUrl), '_blank');
                    return [3 /*break*/, 5];
                case 4:
                    window.location.href = "mailto:?subject=Check out this post&body=" + encodeURIComponent(text) + "%0A%0A" + encodeURIComponent(postUrl);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var formatPostDate = function (timestamp) {
        return date_fns_1.formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    };
    // Add this function to safely render content with iframes
    var renderContent = function (content) {
        // Split content into text and iframes
        var parts = content.split(/(<iframe.*?<\/iframe>)/g);
        return parts.map(function (part, index) {
            if (part.startsWith('<iframe')) {
                // Create a wrapper for the iframe
                return (React.createElement("div", { key: index, className: "my-2 rounded-lg overflow-hidden" },
                    React.createElement("div", { dangerouslySetInnerHTML: { __html: part } })));
            }
            return React.createElement("p", { key: index }, part);
        });
    };
    var handleCommentClick = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var fetchedComments;
        return __generator(this, function (_a) {
            e.stopPropagation();
            setIsCommentsOpen(!isCommentsOpen);
            if (!isCommentsOpen && comments.length === 0) {
                setIsLoadingComments(true);
                try {
                    fetchedComments = [];
                    setComments(fetchedComments);
                }
                catch (error) {
                    toast({
                        title: "Error",
                        description: "Failed to load comments",
                        variant: "destructive"
                    });
                }
                finally {
                    setIsLoadingComments(false);
                }
            }
            return [2 /*return*/];
        });
    }); };
    var handleComment = function (content) { return __awaiter(_this, void 0, void 0, function () {
        var tx, provider, receipt, updatedComments, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!content.trim() || !isConnected) {
                        if (!isConnected) {
                            toast({
                                title: "Connect Wallet",
                                description: "Please connect your wallet to comment",
                                variant: "destructive"
                            });
                            return [2 /*return*/];
                        }
                        return [2 /*return*/];
                    }
                    setIsSubmittingComment(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    return [4 /*yield*/, addComment(post.id)];
                case 2:
                    tx = _a.sent();
                    toast({
                        title: "Transaction Sent",
                        description: "Waiting for confirmation..."
                    });
                    return [4 /*yield*/, ethers_1.ethers.getDefaultProvider(process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.optimism.io')];
                case 3:
                    provider = _a.sent();
                    return [4 /*yield*/, provider.waitForTransaction(tx)];
                case 4:
                    receipt = _a.sent();
                    if (receipt.status === 1) {
                        updatedComments = [];
                        setComments(updatedComments);
                        setCommentCount(function (prev) { return prev + 1; });
                        setNewComment('');
                        toast({
                            title: "Comment posted",
                            description: "Transaction confirmed on Optimism"
                        });
                    }
                    return [3 /*break*/, 7];
                case 5:
                    error_4 = _a.sent();
                    console.error('Comment error:', error_4);
                    toast({
                        title: "Error",
                        description: error_4 instanceof Error ? error_4.message : "Could not post comment",
                        variant: "destructive"
                    });
                    return [3 /*break*/, 7];
                case 6:
                    setIsSubmittingComment(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Memoize the image rendering function to prevent unnecessary re-renders
    var renderImage = react_1.useCallback(function (ipfsHash) {
        if (!ipfsHash)
            return null;
        var imageUrl = "https://gateway.pinata.cloud/ipfs/" + ipfsHash;
        var fallbackUrl = "https://ipfs.io/ipfs/" + ipfsHash;
        // Generate a low-quality placeholder image
        var blurDataURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEtAI8V7yQCgAAAABJRU5ErkJggg==";
        return (React.createElement("div", { className: "mt-2 relative group" },
            React.createElement("div", { className: "relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden bg-muted/30" },
                React.createElement("div", { className: "absolute inset-0 bg-muted/20 animate-pulse rounded-lg", style: { backgroundSize: 'cover', backgroundPosition: 'center' } }),
                React.createElement(image_1["default"], { src: imageUrl, alt: "Post attachment", fill: true, sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw", className: "rounded-lg object-cover transition-opacity duration-300", loading: "lazy", priority: false, quality: 60, placeholder: "blur", blurDataURL: blurDataURL, onLoadingComplete: function (img) {
                        // Add a fade-in effect when the image loads
                        img.classList.remove('opacity-0');
                    }, onError: function (e) {
                        // Try the fallback URL if the primary one fails
                        var imgElement = e.currentTarget;
                        if (imgElement && !imgElement.src.includes('ipfs.io')) {
                            imgElement.src = fallbackUrl;
                        }
                    }, style: { opacity: 0 } })),
            React.createElement("div", { className: "absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg" })));
    }, []);
    return (React.createElement(React.Fragment, null,
        React.createElement(card_1.Card, { className: "bg-white dark:bg-zinc-900 shadow-sm rounded-xl overflow-hidden mb-4" },
            React.createElement("div", { className: "p-4" },
                React.createElement("div", { className: "flex items-start justify-between" },
                    React.createElement("div", { className: "flex items-center space-x-3" },
                        React.createElement(avatar_1.Avatar, { className: "h-10 w-10 ring-2 ring-offset-2 ring-blue-500" },
                            React.createElement(avatar_1.AvatarImage, { src: "https://api.dicebear.com/9.x/bottts/svg?seed=" + post.author.username, alt: post.author.name }),
                            React.createElement(avatar_1.AvatarFallback, null, post.author.name.charAt(0))),
                        React.createElement("div", null,
                            React.createElement("div", { className: "flex items-center" },
                                React.createElement("span", { className: "font-semibold text-zinc-900 dark:text-zinc-100" }, post.author.address ? utils_1.formatAddress(post.author.address) : post.author.name),
                                post.author.verified && (React.createElement(tooltip_1.TooltipProvider, null,
                                    React.createElement(tooltip_1.Tooltip, null,
                                        React.createElement(tooltip_1.TooltipTrigger, null,
                                            React.createElement(lucide_react_1.Check, { className: "w-4 h-4 text-blue-500 ml-1" })),
                                        React.createElement(tooltip_1.TooltipContent, null, "Verified")))),
                                React.createElement("div", { className: "ml-2" },
                                    React.createElement(donation_badge_1.DonationBadge, { totalDonations: 0n }))),
                            React.createElement("div", { className: "flex items-center text-sm text-zinc-500 space-x-2" },
                                React.createElement("span", null, formatPostDate(post.timestamp)),
                                React.createElement("span", null, "\u2022"),
                                React.createElement("div", { className: "flex items-center" },
                                    React.createElement(badge_1.Badge, { variant: "outline", className: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 px-2 py-0 h-5 text-xs font-medium" }, isLoadingPoints ? (React.createElement("span", { className: "flex items-center" },
                                        React.createElement("span", { className: "h-2 w-2 mr-1 rounded-full animate-pulse bg-blue-400" }),
                                        "Loading...")) : (React.createElement("span", { className: "flex items-center" },
                                        React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-3 w-3 mr-1", viewBox: "0 0 20 20", fill: "currentColor" },
                                            React.createElement("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z", clipRule: "evenodd" })),
                                        userPoints,
                                        " points"))))))),
                    React.createElement(dropdown_menu_1.DropdownMenu, null,
                        React.createElement(dropdown_menu_1.DropdownMenuTrigger, { asChild: true },
                            React.createElement(button_1.Button, { variant: "ghost", size: "sm" },
                                React.createElement(lucide_react_1.MoreHorizontal, { className: "h-5 w-5" }))),
                        React.createElement(dropdown_menu_1.DropdownMenuContent, { align: "end" },
                            React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return handleShare('copy'); } },
                                React.createElement(lucide_react_1.Link, { className: "w-4 h-4 mr-2" }),
                                "Copy link"),
                            React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return handleShare('twitter'); } },
                                React.createElement(lucide_react_1.Twitter, { className: "w-4 h-4 mr-2" }),
                                "Share on Twitter"),
                            React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return setShowDonateModal(true); } },
                                React.createElement(lucide_react_1.Wallet, { className: "w-4 h-4 mr-2" }),
                                "Donate"),
                            React.createElement(dropdown_menu_1.DropdownMenuItem, { className: "text-red-500" },
                                React.createElement(lucide_react_1.Flag, { className: "w-4 h-4 mr-2" }),
                                "Report"))))),
            React.createElement("div", { className: "px-4", onClick: handlePostClick }, renderContent(post.content)),
            React.createElement("div", { className: "px-4 py-2 flex items-center space-x-4 text-sm text-zinc-500" }),
            React.createElement("div", { className: "px-2 py-1 border-t border-zinc-100 dark:border-zinc-800" },
                React.createElement("div", { className: "grid grid-cols-4 gap-1" },
                    React.createElement(button_1.Button, { variant: "ghost", className: utils_1.cn("flex items-center justify-center space-x-2 w-full", isLiked && "text-blue-500", isProcessing && "opacity-50 cursor-not-allowed"), onClick: handleLike, disabled: isProcessing },
                        React.createElement(lucide_react_1.Heart, { className: utils_1.cn("w-5 h-5 transition-all duration-300 ease-in-out group-hover:scale-110", isLiked && "fill-current animate-like") }),
                        React.createElement("span", { className: utils_1.cn("transition-all", isLiked && "animate-quick-pulse") }, likeCount)),
                    React.createElement(button_1.Button, { variant: "ghost", className: utils_1.cn("flex items-center justify-center space-x-2 w-full group", isCommentsOpen && "text-blue-500"), onClick: handleCommentClick },
                        React.createElement(lucide_react_1.MessageCircle, { className: "w-5 h-5 transition-all duration-300 ease-in-out group-hover:scale-110" }),
                        React.createElement("span", null, commentCount)),
                    React.createElement(button_1.Button, { variant: "ghost", className: utils_1.cn("flex items-center justify-center space-x-2 w-full group", isReposted && "text-green-500"), onClick: handleRepost },
                        React.createElement(lucide_react_1.Repeat2, { className: utils_1.cn("w-5 h-5 transition-all duration-300 ease-in-out group-hover:scale-110", isReposted && "animate-repost text-green-500") }),
                        React.createElement("span", { className: utils_1.cn("transition-all", isReposted && "animate-quick-pulse text-green-500") }, repostCount)),
                    React.createElement(button_1.Button, { variant: "ghost", className: "flex items-center justify-center space-x-2 w-full group hover:text-purple-500", onClick: function () { return setShowDonationWidget(true); } },
                        React.createElement(lucide_react_2.Gift, { className: "w-5 h-5 transition-all duration-300 ease-in-out group-hover:scale-110" }),
                        React.createElement("span", null, "Donate")))),
            isCommentsOpen && (React.createElement("div", { className: "border-t border-zinc-100 dark:border-zinc-800" },
                React.createElement("div", { className: "max-h-[400px] overflow-y-auto custom-scrollbar" }, isLoadingComments ? (React.createElement("div", { className: "flex items-center justify-center py-6" },
                    React.createElement("div", { className: "animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" }))) : comments.length > 0 ? (React.createElement("div", { className: "p-4 space-y-4" }, comments.map(function (comment) { return (React.createElement("div", { key: comment.id, className: "group" },
                    React.createElement("div", { className: "flex gap-3" },
                        React.createElement("div", { className: "flex-shrink-0" },
                            React.createElement(avatar_1.Avatar, { className: "h-7 w-7" },
                                React.createElement(avatar_1.AvatarImage, { src: comment.author.avatar }),
                                React.createElement(avatar_1.AvatarFallback, null, comment.author.name[0]))),
                        React.createElement("div", { className: "flex-1 min-w-0" },
                            React.createElement("div", { className: "flex items-center gap-2" },
                                React.createElement("span", { className: "font-medium text-sm" }, comment.author.name),
                                React.createElement("span", { className: "text-xs text-muted-foreground" }, date_fns_1.formatDistanceToNow(comment.timestamp, { addSuffix: true }))),
                            React.createElement("p", { className: "text-sm mt-1 break-words" }, comment.content),
                            React.createElement("div", { className: "flex items-center gap-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" },
                                React.createElement("button", { className: "flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors" },
                                    React.createElement(lucide_react_1.Heart, { className: "h-3.5 w-3.5" }),
                                    React.createElement("span", null, comment.likes || 0)),
                                React.createElement("button", { className: "flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors" },
                                    React.createElement(lucide_react_1.MessageCircle, { className: "h-3.5 w-3.5" }),
                                    React.createElement("span", null, "Reply"))))))); }))) : (React.createElement("div", { className: "py-8 text-center text-muted-foreground text-sm" },
                    React.createElement(lucide_react_1.MessageCircle, { className: "h-5 w-5 mx-auto mb-2 opacity-50" }),
                    React.createElement("p", null, "No comments yet"),
                    React.createElement("p", { className: "text-xs" }, "Be the first to join the conversation")))),
                React.createElement("div", { className: "border-t border-zinc-100 dark:border-zinc-800 p-3" },
                    React.createElement("div", { className: "flex items-start gap-3" },
                        React.createElement(avatar_1.Avatar, { className: "h-7 w-7 flex-shrink-0" },
                            React.createElement(avatar_1.AvatarImage, { src: post.author.avatar }),
                            React.createElement(avatar_1.AvatarFallback, null, "You")),
                        React.createElement("div", { className: "flex-1 min-w-0" },
                            React.createElement("div", { className: "relative" },
                                React.createElement(input_1.Input, { placeholder: isConnected ? "Write a comment..." : "Connect wallet to comment", className: "bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-offset-0 text-sm pr-[70px]", value: newComment, onChange: function (e) { return setNewComment(e.target.value); }, onKeyDown: function (e) {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleComment(newComment);
                                        }
                                    }, disabled: isSubmittingComment || !isConnected }),
                                isSubmittingComment && (React.createElement("div", { className: "absolute right-3 top-1/2 -translate-y-1/2" },
                                    React.createElement("div", { className: "animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" })))))))))),
        React.createElement(DonationModal_1.DonationModal, { isOpen: showDonateModal, onClose: function () { return setShowDonateModal(false); }, author: {
                name: post.author.name,
                avatar: post.author.avatar,
                address: post.author.address || post.author.id // Use address if available, fallback to ID
            }, streamId: post.id, postExcerpt: post.content, projectConfig: {
                id: post.id,
                name: post.author.name,
                recipients: [
                    {
                        address: post.author.address || post.author.id,
                        chainId: 11155420,
                        share: 100
                    }
                ],
                theme: {
                    primaryColor: '#676FFF',
                    buttonStyle: 'rounded',
                    size: 'medium',
                    darkMode: theme === 'dark'
                }
            } }),
        React.createElement(donation_widget_1.DonationWidget, { isOpen: showDonationWidget, onClose: function () { return setShowDonationWidget(false); }, projectConfig: {
                id: post.id,
                name: "Project Name" // Replace with actual project name
            }, author: {
                name: post.author.name,
                avatar: post.author.avatar,
                address: post.author.address || post.author.id // Use address if available, fallback to ID
            }, postExcerpt: post.content })));
}
exports.PostCard = PostCard;
function PointsLeaderboard() {
    var _a = react_1.useState(true), loading = _a[0], setLoading = _a[1];
    var _b = react_1.useState(false), mounted = _b[0], setMounted = _b[1];
    // Use useContractRead from wagmi instead of useContract
    var _c = wagmi_1.useContractRead({
        address: process.env.NEXT_PUBLIC_POINTS_CONTRACT_ADDRESS
    }(templateObject_1 || (templateObject_1 = __makeTemplateObject(["0x", ""], ["0x", ""])), string), abi, PointsContract_json_1["default"].abi, functionName, 'getTopUsers', args, [10], // Get top 10 users
    enabled, mounted), topUsers = _c.data, isLoading = _c.isLoading; // Only enable the query when component is mounted
}
exports.PointsLeaderboard = PointsLeaderboard;
;
// Set mounted state when component mounts
react_1.useEffect(function () {
    setMounted(true);
}, []);
// Update loading state when data changes
react_1.useEffect(function () {
    if (!isLoading) {
        setLoading(false);
    }
}, [isLoading]);
if (loading)
    return React.createElement("div", null, "Loading leaderboard...");
// Format the data from the contract
var leaderboard = topUsers ? Array.isArray(topUsers) ? topUsers : [] : [];
return (React.createElement("div", { className: "rounded-lg border p-4" },
    React.createElement("h2", { className: "text-xl font-bold mb-4" }, "Top Contributors"),
    React.createElement("div", { className: "space-y-2" }, leaderboard.length > 0 ? (leaderboard.map(function (user, index) { return (React.createElement("div", { key: user.user || index, className: "flex justify-between items-center" },
        React.createElement("span", null,
            "#",
            index + 1,
            " ",
            typeof user.user === 'string' ? user.user.slice(0, 6) + "..." + user.user.slice(-4) : 'Unknown'),
        React.createElement("span", null,
            user.points ? Number(user.points) : 0,
            " points"))); })) : (React.createElement("div", { className: "text-center py-4 text-muted-foreground" }, "No data available")))));
var templateObject_1;
