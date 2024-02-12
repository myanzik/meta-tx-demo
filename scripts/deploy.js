const { ethers, run } = require('hardhat');
const { writeFileSync } = require('fs');

const verify = async (contractAddress, args) => {
  console.log("Verifying contract...");
  try {
    console.log({ contractAddress, args })
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e);
    }
  }
};

const sleep = (ms) => {
  console.log(`sleeping for ${ms} seconds`)
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function deploy(name, ...params) {
  const anchor = await ethers.deployContract(name, ...params);
  console.log(anchor);
  return anchor;
}

async function main() {
  this.accounts = await ethers.getSigners();
  const [admin1, admin2, member1, member2] = this.accounts;
  console.log("Deploying the forwarder")
  const forwarder = await deploy('ERC2771Forwarder', ['Rumsan Forwarder']);
  const forwarderAddress = await forwarder.getAddress();
  console.log({ forwarder: forwarderAddress });
  console.log("Deploying Storage")
  const storage = await ethers.deployContract("Storage", [forwarderAddress, [admin1.address], [admin1.address]]);
  const storageAddress = await storage.getAddress();
  console.log({ storage: storageAddress })
  // await sleep(10000)
  // console.log("Verifying Storage")
  // await verify(storageAddress, [forwarderAddress, [admin1.address], [admin1.address]])

  console.log(`DONE:)`)


  writeFileSync('deploy.json', JSON.stringify({
    forwarderAddress,
    storageAddress
  }, null, 2));



}

if (require.main === module) {
  main().then(() => process.exit(0))
    .catch(error => { console.error(error); process.exit(1); });
}