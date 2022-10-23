// require("@nomicfoundation/hardhat-toolbox");
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.7",
  paths: {
    artifacts: './frontend/src/artifacts',
  },
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.API_KEY}`,
      accounts: [PRIVATE_KEY]
    },
    // hardhat: {
    //   // blockGasLimit: 0x1fffffffffffff,
    //   chainId: 31337,
    //   // allowUnlimitedContractSize: true,
    // },
  }
};
