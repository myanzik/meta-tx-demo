/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('dotenv').config();
require('solidity-coverage');
require("@nomicfoundation/hardhat-chai-matchers");
require("@nomicfoundation/hardhat-ethers");
require("solidity-docgen");
require("@nomicfoundation/hardhat-verify")

module.exports = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  docgen: {
    outputDir: './docs',
    pages: 'files'
  },

  networks: {
    hardhat: {
      chains: {
        99: {
          hardforkHistory: {
            berlin: 10000000,
            london: 20000000,
          },
        }
      }
    },

    arbiSepolia: {
      url: "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: [process.env.PRIVATE_KEY]
    },
  },
  paths: {
    sources: './contracts',
    tests: './tests',
    cache: './hardhat_build/cache',
    artifacts: './hardhat_build/artifacts',
  },

  etherscan:
  {
    apiKey: {
      arbiSepolia: process.env.ARBISCAN_KEY,
    },
    customChains: [
      {
        network: "arbiSepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://sepolia-rollup.arbitrum.io/rpc",
          browserURL: "https://sepolia.arbiscan.io"
        }
      }
    ]
  },
  sourcify: {
    enabled: true,
    // Optional: specify a different Sourcify server
    apiUrl: "https://sourcify.dev/server",
    // Optional: specify a different Sourcify repository
    browserUrl: "https://repo.sourcify.dev",
  }

};
