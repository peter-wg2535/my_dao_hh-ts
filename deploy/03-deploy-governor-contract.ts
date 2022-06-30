import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
// import verify from "../helper-functions"
import {
  // networkConfig,
  // developmentChains,
  QUORUM_PERCENTAGE,
  VOTING_PERIOD,
  VOTING_DELAY,
} from "../helper-hardhat-config"

const deployGovernorContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const { getNamedAccounts, deployments} = hre
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()

  // get contract deployed from  01-deploy-governor-token.ts  and 02-deploy-time-lock.ts
  const governanceToken = await get("GovernanceToken")
  const timeLock = await get("TimeLock")
  // log(governanceToken.address)
  // log(timeLock.address)
  
  /*
  GovernorContract.sol
  constructor(
    IVotes _token,
    TimelockController _timelock,
    uint256 _quorumPercentage,
    uint256 _votingPeriod,
    uint256 _votingDelay
  )
  */
  log("----------------------------------------------------")
  log("Deploying GovernorContract")
  const governorContract = await deploy("GovernorContract", {
    from: deployer,
    args: [
      governanceToken.address,
      timeLock.address,
      QUORUM_PERCENTAGE,
      VOTING_PERIOD,
      VOTING_DELAY,
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
