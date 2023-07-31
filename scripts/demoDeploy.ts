// Imports
// ========================================================
import { ethers } from "hardhat";

// Deployment Script
// ========================================================

// copied erc20Deploy.ts file, with custom constants
// see tutorial for on-chain-verification:
// https://0xpolygonid.github.io/tutorials/verifier/on-chain-verification/overview/#deploy-the-contract
const main = async () => {
  const verifierContract = "ERC20Verifier";
  const verifierName = "ERC20zkAirdrop";
  const verifierSymbol = "zkERC20";

  // when adding the libraries to the getContractFactory, as in the tutorial in link above, deploy fails.
  // this demo does not include any libraries
  // const spongePoseidonLib = "0x12d8C87A61dAa6DD31d8196187cFa37d1C647153";
  // const poseidon6Lib = "0xb588b8f07012Dc958aa90EFc7d3CF943057F17d7";

  const ERC20Verifier = await ethers.getContractFactory(verifierContract);
  const erc20Verifier = await ERC20Verifier.deploy(
    verifierName,
    verifierSymbol
  );

  await erc20Verifier.deployed();
  console.log(verifierName, " contract address:", erc20Verifier.address);
};

// Init
// ========================================================
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
