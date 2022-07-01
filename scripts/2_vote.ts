import { ethers,network } from "hardhat"
import * as helper_hh_conf from "../helper-hardhat-config"
import * as fs from "fs"
import {moveBlocks} from "../utils/move-blocks"

// Run : npx hardhat run scripts\2_vote.ts --network localhost


async function main() {
    const index=0
    const proposals_file=JSON.parse(fs.readFileSync(helper_hh_conf.proposalsFile,"utf8"))
    // get id from proposals.json
    const proposalId=proposals_file[network.config.chainId!][index]

    const voteWay = 1
    const reason = "100 let 's go"
    
    const governor = await ethers.getContract("GovernorContract")
    //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/Governor.sol
    //function castVoteWithReason(uint256 proposalId,uint8 support,string calldata reason) 
    const voteTxRespose=await governor.castVoteWithReason(proposalId, voteWay, reason)
    await voteTxRespose.wait(1)

    if (helper_hh_conf.developmentChains.includes(network.name)) {
        await moveBlocks(helper_hh_conf.VOTING_PERIOD + 1)
      }
    // check state  function state(uint256 proposalId
    //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/IGovernor.sol
    console.log("Respect my vote on  democracy in Thailand")  
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
