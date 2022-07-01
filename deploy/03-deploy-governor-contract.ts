import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
// import verify from "../helper-functions"


import * as helper_hh_conf from "../helper-hardhat-config"

const deployGovernorContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

  const { getNamedAccounts, deployments} = hre
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()

  // get contract deployed from  01-deploy-governor-token.ts  and 02-deploy-time-lock.ts
  const governanceToken = await get("GovernanceToken")
  const timeLock = await get("TimeLock")
  // log(governanceToken.address)
  // log(timeLock.address)
  
 
  log("----------------------------------------------------")
  log("Deploying GovernorContract")
   /*
  GovernorContract.sol
  constructor(IVotes _token,TimelockController _timelock,uint256 _quorumPercentage,
    uint256 _votingPeriod,uint256 _votingDelay)
  */
  const governorContract = await deploy("GovernorContract", {
    from: deployer,
    args: [
      governanceToken.address,
      timeLock.address,
      helper_hh_conf.QUORUM_PERCENTAGE,
      helper_hh_conf.VOTING_PERIOD,
      helper_hh_conf.VOTING_DELAY,
    ],
    log: true,
    // we need to wait if on a live network so we can verify properly
    //waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })
  // log(`GovernorContract at ${governorContract.address}`)
  // if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
  //   await verify(governorContract.address, [])
  // }
}

export default deployGovernorContract
deployGovernorContract.tags = ["all", "governor"]
