const hre = require("hardhat");

async function main() {
  const MultiSendETH = await hre.ethers.getContractFactory("MultiSendETH");
  const multiSendETH = await MultiSendETH.deploy();

  await multiSendETH.waitForDeployment();
  console.log("MultiSendETH deployed at:", multiSendETH.target);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
