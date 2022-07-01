import { ethers, network } from "hardhat"
import * as helper_hh_conf from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"
import { moveTime } from "../utils/move-time"
//npx hardhat run scripts\3_queue-and-execute.ts --network localhost
export async function main() {
  const args = [helper_hh_conf.NEW_STORE_VALUE]
  const functionToCall = helper_hh_conf.FUNC
  const box = await ethers.getContract("Box")
  const encodeFuncToCall = box.interface.encodeFunctionData(functionToCall, args)
  const desHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(helper_hh_conf.PROPOSAL_DESCRIPTION))
  // ethers.utils.id(PROPOSAL_DESCRIPTION)

  const governor = await ethers.getContract("GovernorContract")
  console.log("Queueing...")
  const queueTx = await governor.queue([box.address], [0], [encodeFuncToCall], desHash)
  await queueTx.wait(1)

  if (helper_hh_conf.developmentChains.includes(network.name)) {
    await moveTime(helper_hh_conf.MIN_DELAY + 1)
    await moveBlocks(1)
  }

  console.log("Executing...")
  // if fail on a testnet , you are supposed to wait for the MIN_DELAY.
  const exeTx = await governor.execute(
    [box.address],
    [0],
    [encodeFuncToCall],
    desHash
  )
  await exeTx.wait(1)
  const new_value=await box.retrieve()
  console.log("Box upated value : "+new_value)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
