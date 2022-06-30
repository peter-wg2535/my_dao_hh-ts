//https://github.com/wighawag/hardhat-deploy/tree/master
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import { ethers } from 'hardhat';

const deployGovernanceToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

  console.log("Deploy GovernanceToken")
  const { getNamedAccounts,deployments} = hre;  //Hardhat.config.ts  get object from hre object
  const {deploy ,log}=deployments  ;//  get object from deployments object
  const {deployer} =await getNamedAccounts()  ;//  get object from getNamedAccounts funtion
  log("Deploying Governance Token.....")
  //constructor() 
  const governanceToken= await deploy("GovernanceToken",{
    from : deployer,
    args:[],
    log: true
  })
  log("Deployed Governance Token to address "+governanceToken.address)
  await x_delegate(governanceToken.address,deployer)
  log("Delegated to deployer")

};
//https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/ERC20Votes.sol
  const x_delegate =async function( governanceTokenAddress: string, delegatedAccount: string){

  const governanceToken =await ethers.getContractAt("GovernanceToken",governanceTokenAddress)
  //const governanceToken = await get("GovernanceToken")

  // GovernanceToken.sol   contract GovernanceToken is ERC20Votes
  // function numCheckpoints(address account) public view virtual returns (uint32) 
  // function delegates(address account) public view virtual override returns (address) 
  const tx= await governanceToken.delegate(delegatedAccount)
  await tx.wait(1)
  console.log("Checkpoints: "+await governanceToken.numCheckpoints(delegatedAccount))
}
export default deployGovernanceToken;
deployGovernanceToken.tags = ["all", "governance"]