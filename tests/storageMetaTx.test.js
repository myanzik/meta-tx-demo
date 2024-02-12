const { ethers } = require("hardhat")
const { expect } = require("chai")
const sampleData = require("./sampleData.json")
const { signMetaTxRequest } = require("../utils/signer")


async function getMetaTxRequest(signer, forwarderContract, storageContract, functionName, params) {
  return signMetaTxRequest(
    signer,
    forwarderContract,
    {
      from: signer.address,
      to: storageContract.target,
      data: storageContract.interface.encodeFunctionData(functionName, params),
    },
  )

}

describe("------ Storage Contract TESTS ------", function () {

  before(async function () {
    [
      admin1,
      admin2,
      member1,
      member2,
      nonMember,
    ] = await ethers.getSigners();
    forwarderContract = await ethers.deployContract("ERC2771Forwarder", ["Rumsan Forwarder"]);
    storageContract = await ethers.deployContract("Storage", [await forwarderContract.getAddress(), [admin1, admin2],
    [member1, member2]])

  })

  describe("Deployment", function () {
    it("Should deploy the storage Contract", async function () {
      expect(await storageContract.getAddress()).to.be.properAddress;
      console.log("storage:", await storageContract.getAddress())
    })
  })

  describe("Records Data", function () {
    it("Should Record Data via member1", async function () {
      const request = await getMetaTxRequest(member1, forwarderContract, storageContract, 'recordData', [sampleData["data-1"]])
      const tx = await forwarderContract.execute(request)
      await tx.wait()
      expect(await storageContract.dataExists(sampleData["data-1"])).to.equal(true)
    })

    it("Should not be able to Record Data via non-Member", async function () {
      const request = await getMetaTxRequest(admin1, forwarderContract, storageContract, 'recordData', [sampleData["data-1"]])
      await expect(forwarderContract.execute(request)).to.be.reverted;
    })

  })
})
