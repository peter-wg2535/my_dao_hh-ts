import { ethers,network } from "hardhat"
import * as helper_hh_conf from "../helper-hardhat-config"
import * as fs from "fs"
import {moveBlocks} from "../utils/move-blocks"

//Run hardhat localhost : npx hardhat node , it will deploy all files in deploy script
// Run : npx hardhat run scripts\1_propose.ts --network localhost

async function main() {

  const governor =await ethers.getContract("GovernorContract")
  const box=await ethers.getContract("Box")

  const args_func=[helper_hh_conf.NEW_STORE_VALUE]
  const encodeFuncToCall=box.interface.encodeFunctionData(helper_hh_conf.FUNC,args_func)
  console.log("Proposing "+helper_hh_conf.FUNC+" on "+box.address+" with "+args_func)
  console.log("Proposal Des :\n+ "+helper_hh_conf.PROPOSAL_DESCRIPTION)
// GovernorContract.sol
// function propose(address[] memory targets,uint256[] memory values
//,bytes[] memory calldatas,string memory description)
// public override(Governor, IGovernor) returns (uint256)
  const proposeTx=await governor.propose(
    [box.address],[0],[encodeFuncToCall],helper_hh_conf.PROPOSAL_DESCRIPTION)

    // If working on a development chain, we will push forward till we get to the voting period.
    if ( helper_hh_conf. developmentChains.includes(network.name)){
    await moveBlocks(helper_hh_conf.VOTING_DELAY + 1)}

    const proposeReceipt=await proposeTx.wait(1)
    const proposalId=proposeReceipt.events[0].args.proposalId  // get emit event of propose method
    console.log("Proposed with proposal ID:\n  "+proposalId)

    let proposals = JSON.parse(fs.readFileSync(helper_hh_conf.proposalsFile, "utf8"))
    proposals[network.config.chainId!.toString()].push(proposalId.toString())
    fs.writeFileSync(helper_hh_conf.proposalsFile, JSON.stringify(proposals))


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
