"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
exports.DonationSDK = void 0;
var viem_1 = require("viem");
var chains_1 = require("viem/chains");
var DonationContract_1 = require("@/contracts/DonationContract");
var EXPECTED_CONTRACT_ADDRESS = "0x94207105ab27a2b3eebeab7fa0c60ab674c77883";
var DonationSDK = /** @class */ (function () {
    function DonationSDK() {
    }
    return DonationSDK;
}());
exports.DonationSDK = DonationSDK;
"0x" + string;
publicClient: any;
walletClient: WalletClient;
constructor(config, DonationSDKConfig);
{
    var configuredAddress = process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS;
    if (!configuredAddress) {
        throw new Error('Donation contract address not configured');
    }
    if (configuredAddress.toLowerCase() !== EXPECTED_CONTRACT_ADDRESS.toLowerCase()) {
        throw new Error("Invalid contract address. Expected " + EXPECTED_CONTRACT_ADDRESS);
    }
    this.contractAddress = configuredAddress;
    "0x" + string;
    this.publicClient = viem_1.createPublicClient({
        chain: chains_1.optimismSepolia,
        transport: viem_1.http()
    });
    // Initialize wallet client only if ethereum is available
    if (typeof window !== 'undefined' && window.ethereum) {
        this.walletClient = viem_1.createWalletClient({
            chain: chains_1.optimismSepolia,
            transport: viem_1.custom(window.ethereum)
        });
    }
    else {
        // Create a placeholder wallet client that will be initialized later
        this.walletClient = {};
    }
}
ensureWalletClient();
{
    if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('No ethereum wallet found. Please connect your wallet first.');
    }
    // Re-initialize wallet client to ensure it's using the current window.ethereum
    this.walletClient = viem_1.createWalletClient({
        chain: chains_1.optimismSepolia,
        transport: viem_1.custom(window.ethereum)
    });
}
// Add error handling and validation
async;
donate(params, DonationParams);
{
    // Ensure wallet client is initialized
    this.ensureWalletClient();
    // Validate minimum amount
    var minAmount = '0.001';
    if (parseFloat(params.amount) < parseFloat(minAmount)) {
        throw new Error("Minimum donation amount is " + minAmount + " ETH");
    }
    // Validate streamId format
    if (!params.streamId || typeof params.streamId !== 'string') {
        throw new Error('Invalid streamId format');
    }
    try {
        var account = (await this.walletClient.requestAddresses())[0];
        // Add balance check before donation
        var balance = await this.publicClient.getBalance({
            address: account
        });
        var value = viem_1.parseEther(params.amount);
        if (balance < value) {
            throw new Error('Insufficient balance for donation');
        }
        // Simulate the transaction first to get potential errors
        await this.publicClient.simulateContract({
            address: this.contractAddress,
            abi: DonationContract_1.donationContractABI,
            functionName: 'donateETH',
            args: [params.streamId],
            value: value,
            account: account
        });
        var hash = await this.walletClient.writeContract({
            address: this.contractAddress,
            abi: DonationContract_1.donationContractABI,
            functionName: 'donateETH',
            args: [params.streamId],
            value: value,
            account: account
        });
        var receipt = await this.publicClient.waitForTransactionReceipt({
            hash: hash,
            confirmations: 1
        });
        if (receipt.status === 'reverted') {
            throw new Error('Transaction reverted on-chain');
        }
        return receipt;
    }
    catch (error) {
        console.error('Donation failed:', {
            error: error,
            params: params,
            contractAddress: this.contractAddress
        });
        throw new Error((error === null || error === void 0 ? void 0 : error.message) || 'Transaction failed');
    }
}
async;
withdraw();
{
    // Ensure wallet client is initialized
    this.ensureWalletClient();
    var account = (await this.walletClient.requestAddresses())[0];
    var hash = await this.walletClient.writeContract({
        address: this.contractAddress,
        abi: DonationContract_1.donationContractABI,
        functionName: 'withdrawDonations',
        account: account
    }(templateObject_1 || (templateObject_1 = __makeTemplateObject(["0x", ""], ["0x", ""])), string));
}
;
return this.publicClient.waitForTransactionReceipt({ hash: hash });
async;
getDonationRecipient(streamId, string);
Promise < string > {
    "try": {
        "const": data = await this.publicClient.readContract({
            address: this.contractAddress,
            abi: DonationContract_1.donationContractABI,
            functionName: 'streamToAuthor',
            args: [streamId]
        }),
        "return": data
    },
    "catch": function (error) {
        console.error('Failed to get donation recipient:', error);
        throw error;
    }
};
async;
getDonationHistory(streamId, string);
{
    try {
        var events = await this.publicClient.getContractEvents({
            address: this.contractAddress,
            abi: DonationContract_1.donationContractABI,
            eventName: 'DonationReceived',
            args: {
                streamId: streamId
            },
            fromBlock: 'earliest'
        });
        return events;
    }
    catch (error) {
        console.error('Failed to get donation history:', error);
        throw error;
    }
}
var templateObject_1;
