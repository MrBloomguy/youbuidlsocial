'use client';
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
exports.DonationModal = void 0;
var react_1 = require("react");
var dialog_1 = require("./ui/dialog");
var button_1 = require("./ui/button");
var input_1 = require("./ui/input");
var avatar_1 = require("./ui/avatar");
var wagmi_1 = require("wagmi");
var use_toast_1 = require("@/hooks/use-toast");
var lucide_react_1 = require("lucide-react");
var donation_sdk_1 = require("@/lib/donation-sdk");
var separator_1 = require("./ui/separator");
var badge_1 = require("./ui/badge");
function DonationModal(_a) {
    var _this = this;
    var isOpen = _a.isOpen, onClose = _a.onClose, author = _a.author, streamId = _a.streamId, postExcerpt = _a.postExcerpt, projectConfig = _a.projectConfig;
    var _b = react_1.useState(''), amount = _b[0], setAmount = _b[1];
    var _c = react_1.useState(false), isProcessing = _c[0], setIsProcessing = _c[1];
    var _d = react_1.useState(null), sdkInstance = _d[0], setSdkInstance = _d[1];
    var _e = wagmi_1.useAccount(), address = _e.address, isConnected = _e.isConnected;
    var _f = wagmi_1.useConnect(), connect = _f.connect, connectors = _f.connectors;
    var toast = use_toast_1.useToast().toast;
    var MIN_DONATION = '0.0001';
    // Initialize SDK only after component mounts to avoid window.ethereum issues
    react_1.useEffect(function () {
        if (typeof window !== 'undefined') {
            try {
                var sdk = new donation_sdk_1.DonationSDK({
                    projectId: projectConfig.id,
                    chainId: projectConfig.recipients[0].chainId
                });
                setSdkInstance(sdk);
            }
            catch (error) {
                console.error('Failed to initialize DonationSDK:', error);
            }
        }
    }, [projectConfig.id, projectConfig.recipients]);
    var DONATION_POINTS = 15; // You can adjust this value or make it dynamic based on amount
    var handleDonate = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isConnected) {
                        // Try to connect with the first available connector
                        if (connectors.length > 0) {
                            try {
                                connect({ connector: connectors[0] });
                            }
                            catch (error) {
                                console.error('Connection error:', error);
                            }
                        }
                        toast({
                            title: 'Connect Wallet',
                            description: 'Please connect your wallet to donate.',
                            variant: 'destructive'
                        });
                        return [2 /*return*/];
                    }
                    if (!sdkInstance) {
                        toast({
                            title: 'SDK Not Ready',
                            description: 'Donation service is initializing. Please try again.',
                            variant: 'destructive'
                        });
                        return [2 /*return*/];
                    }
                    if (!streamId) {
                        toast({
                            title: 'Invalid Stream',
                            description: 'Stream ID is required for donation',
                            variant: 'destructive'
                        });
                        return [2 /*return*/];
                    }
                    if (!amount || parseFloat(amount) < parseFloat(MIN_DONATION)) {
                        toast({
                            title: 'Invalid amount',
                            description: "Minimum donation is " + MIN_DONATION + " ETH",
                            variant: 'destructive'
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setIsProcessing(true);
                    console.log('Attempting donation with:', {
                        amount: amount,
                        streamId: streamId,
                        recipient: author.address
                    });
                    return [4 /*yield*/, sdkInstance.donate({
                            recipient: author.address,
                            amount: amount,
                            streamId: streamId.toString(),
                            metadata: {
                                postExcerpt: postExcerpt,
                                authorName: author.name
                            }
                        })];
                case 2:
                    _a.sent();
                    toast({
                        title: 'Donation successful!',
                        description: "Thank you for supporting " + author.name + "!"
                    });
                    onClose();
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Donation error:', error_1);
                    toast({
                        title: 'Error',
                        description: error_1 instanceof Error ? error_1.message : 'Failed to process donation',
                        variant: 'destructive'
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setIsProcessing(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var displayAddress = author.address && author.address !== '0x'
        ? author.address.slice(0, 6) + "..." + author.address.slice(-4)
        : 'Address not available';
    return (React.createElement(dialog_1.Dialog, { open: isOpen, onOpenChange: onClose },
        React.createElement(dialog_1.DialogContent, { className: "max-w-sm p-6" },
            React.createElement(dialog_1.DialogHeader, { className: "flex flex-col items-center space-y-3" },
                React.createElement(avatar_1.Avatar, { className: "w-16 h-16 ring-2 ring-purple-500" },
                    React.createElement(avatar_1.AvatarImage, { src: author.avatar, alt: author.name }),
                    React.createElement(avatar_1.AvatarFallback, null, author.name[0])),
                React.createElement("div", { className: "text-center" },
                    React.createElement(dialog_1.DialogTitle, { className: "text-xl font-semibold" },
                        "Support ",
                        author.name),
                    React.createElement("p", { className: "text-sm text-muted-foreground mt-1" },
                        "Project: ",
                        projectConfig.name),
                    React.createElement("div", { className: "mt-2" },
                        React.createElement(badge_1.Badge, { variant: "secondary", className: "inline-flex items-center gap-1.5 px-3 py-1.5" },
                            React.createElement(lucide_react_1.Star, { className: "w-4 h-4 text-yellow-500" }),
                            React.createElement("span", null, "Earn 15 Points"))))),
            React.createElement(separator_1.Separator, { className: "my-4" }),
            postExcerpt && (React.createElement("div", { className: "bg-muted/50 p-4 rounded-lg text-sm mb-6" },
                React.createElement("p", { className: "text-xs text-muted-foreground mb-2" }, "From post:"),
                React.createElement("p", { className: "line-clamp-3" }, postExcerpt))),
            React.createElement("div", { className: "space-y-4" },
                React.createElement("div", null,
                    React.createElement("label", { className: "text-sm font-medium mb-2 block" }, "Amount (ETH)"),
                    React.createElement(input_1.Input, { type: "number", placeholder: "0.01", value: amount, onChange: function (e) { return setAmount(e.target.value); }, disabled: isProcessing, className: "text-lg", min: MIN_DONATION, step: MIN_DONATION }),
                    React.createElement("p", { className: "text-xs text-muted-foreground mt-1" },
                        "Minimum donation: ",
                        MIN_DONATION,
                        " ETH")),
                React.createElement("div", { className: "flex gap-2 justify-center" }, ['0.01', '0.05', '0.1'].map(function (preset) { return (React.createElement(button_1.Button, { key: preset, variant: "outline", size: "sm", onClick: function () { return setAmount(preset); }, disabled: isProcessing },
                    preset,
                    " ETH")); })),
                React.createElement(button_1.Button, { className: "w-full h-12 text-base", onClick: handleDonate, disabled: isProcessing || (!isConnected && !connectors.length) || !author.address || author.address === '0x' || !sdkInstance, style: {
                        backgroundColor: projectConfig.theme.primaryColor,
                        borderRadius: projectConfig.theme.buttonStyle === 'rounded' ? '9999px' : '0.5rem'
                    } }, isProcessing ? (React.createElement(React.Fragment, null,
                    React.createElement(lucide_react_1.Loader2, { className: "mr-2 h-5 w-5 animate-spin" }),
                    "Processing...")) : !sdkInstance ? ('Initializing donation service...') : !author.address || author.address === '0x' ? ('Recipient address not available') : !isConnected ? ('Connect Wallet to Donate') : (React.createElement(React.Fragment, null,
                    React.createElement(lucide_react_1.Wallet, { className: "mr-2 h-5 w-5" }),
                    "Donate ",
                    amount ? amount + " ETH" : ''))),
                React.createElement("div", { className: "text-center space-y-2" },
                    React.createElement("p", { className: "text-xs text-muted-foreground" },
                        "Recipient address: ",
                        displayAddress),
                    React.createElement("p", { className: "text-xs text-muted-foreground" }, "Points will be credited after the transaction is confirmed"))))));
}
exports.DonationModal = DonationModal;
