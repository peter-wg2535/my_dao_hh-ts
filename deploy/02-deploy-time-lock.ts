import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
// import verify from "../helper-functions"
import * as helper_hh_conf from "../helper-hardhat-config"

const deployTimeLock: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  log("----------------------------------------------------")
  log("Deploying TimeLock and waiting for confirmations...")
  //TimeLock.sol
  //constructor(uint256 minDelay,address[] memory proposers,address[] memory executors)==>args: [MIN_DELAY, [], []],
  const timeLock = await deploy("TimeLock", {
    from: deployer,
    args: [helper_hh_conf.MIN_DELAY, [], []],
    log: true,
    // we need to wait if on a live network so we can verify properly
    //waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })
  // log(`TimeLock at ${timeLock.address}`)
  // if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
  //   await verify(timeLock.address, [])
  // }
}

export default deployTimeLock
deployTimeLock.tags = ["all", "timelock"]
