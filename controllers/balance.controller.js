const { createPublicClient, erc20Abi, http, formatUnits } = require("viem");
const { mainnet, polygon } = require("viem/chains");

const tokens = {
  erc20: [
    {
      chainId: 1,
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      symbol: "USDT",
      name: "Tether USD",
      decimals: 6,
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
    },
    {
      chainId: 137,
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      _scan:
        "https://polygonscan.com/token/0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      symbol: "USDT",
      name: "USDT",
      decimals: 6,
      logoURI: "https://coin.top/production/logo/usdtlogo.png",
    },
  ],
};

const fetchWalletBalance = async (req, res) => {
  try {
    console.log("fetchWalletBalance", req.query);
    const { tokenSymbol, chainId, walletAddress } = req.query;

    let thisChainId = parseInt(chainId) || 1;

    const publicClient = createPublicClient({
      chain: thisChainId == 1 ? mainnet : polygon,
      transport: http(),
    });
    const thisToken = tokens.erc20.find(
      (token) => token.symbol === tokenSymbol && token.chainId === thisChainId
    );

    console.log("thisToken", thisToken);
    const data = await publicClient.readContract({
      address: thisToken.address,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [walletAddress],
    });

    console.log("wallet balance", data);

    res.json({ success: true, balance: formatUnits(data, thisToken.decimals) });
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};

module.exports = {
  fetchWalletBalance,
};
