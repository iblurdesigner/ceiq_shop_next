/* eslint-disable no-undef */
const Dai = artifacts.require("Dai.sol");
const PaymentProcessor = artifacts.require("PaymentProcessor.sol");

module.exports = async function (deployer, network, addresses) {
  // eslint-disable-next-line no-unused-vars
  const [admin, payer, _] = addresses;

  if (network === "develop") {
    await deployer.deploy(Dai);
    const dai = await Dai.deployed();
    // eslint-disable-next-line no-undef
    await dai.faucet(payer, web3.utils.toWei("10000"));

    await deployer.deploy(PaymentProcessor, admin, dai.address);
  } else {
    const ADMIN_ADDRESS = "";
    const DAI_ADDRESS = "";
    await deployer.deploy(PaymentProcessor, ADMIN_ADDRESS, DAI_ADDRESS);
  }
};
