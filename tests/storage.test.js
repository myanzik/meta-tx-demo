const { ethers } = require("hardhat")
const { expect } = require("chai")
const sampleData = require("./sampleData.json")

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
    console.log("forwarderContract:", await forwarderContract.getAddress())
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
      const tx = await storageContract.connect(member1).recordData(sampleData["data-1"]);
      const receipt = await tx.wait()
      const event = receipt.logs[0]
      expect(event.fragment.name).to.equal("dataRecorded");
      expect(await storageContract.dataExists(sampleData["data-1"])).to.equal(true)
    })

    it("Should not be able to Record Data via nonMember", async function () {
      await expect(storageContract.connect(nonMember).recordData(sampleData["data-1"])).to.be.revertedWith("Storage: Only Members can record data");
    })

  })
})
