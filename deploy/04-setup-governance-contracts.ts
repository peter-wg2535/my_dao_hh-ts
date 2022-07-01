import {HardhatRuntimeEnvironment} from "hardhat/types"
import { DeployFunction} from  "hardhat-deploy/types"
import * as helper_hh_conf from "../helper-hardhat-config"

import {ethers} from "hardhat"
const setupContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments} = hre
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()

    
    const  timeLock=await ethers.getContract("TimeLock",deployer)
    //const timeLock = await get("TimeLock")
    const governor = await ethers.getContract("GovernorContract",deployer)
    //const governor = await get("GovernorContract")

    log("----------------------------------------------------")
    log("Setting up contracts for roles...")
    // would be great to use multicall here...
    const proposerRole = await timeLock.PROPOSER_ROLE()
    const executorRole = await timeLock.EXECUTOR_ROLE()
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE()

    const proposerTx = await timeLock.grantRole(proposerRole, governor.address)
    await proposerTx.wait(1)
    const executorTx = await timeLock.grantRole(executorRole, helper_hh_conf.ADDRESS_ZERO)
    await executorTx.wait(1)
    const revokeTx = await timeLock.revokeRole(adminRole, deployer)
    await revokeTx.wait(1)
    // Guess what? Now, anything the timelock wants to do has to go through the governance process!

}

export default setupContracts
setupContracts.tags = ["all", "setup"]