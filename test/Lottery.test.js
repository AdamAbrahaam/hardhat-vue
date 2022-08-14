const { expect, assert } = require("chai");

describe("Lottery contract", function () {
  let lotteryInstance = null;
  let deployerAddress = null

  beforeEach(async () => {
    const Lottery = await ethers.getContractFactory("Lottery");
    const [deployer] = await ethers.getSigners();

    deployerAddress = deployer.address
    lotteryInstance = await Lottery.deploy();
  });


  it("Lottery not started", async function () {
    const state = await lotteryInstance.state();
    const prizePool = await lotteryInstance.prizePool();

    expect(state).to.equal(2);
    expect(prizePool).to.equal(0);

    try {
      await lotteryInstance.enter('Adam', 1)
      assert.fail('This should have thrown an error')
    } catch (error) {
      assert.include(error.message, 'Lottery not started')
    }

    try {
      await lotteryInstance.getWinner()
      assert.fail('This should have thrown an error')
    } catch (error) {
      assert.include(error.message, 'Lottery not active')
    }
  });

  it("Lottery started", async function () {
    await lotteryInstance.create(5, 10);

    const state = await lotteryInstance.state();
    expect(state).to.equal(0);

    try {
      await lotteryInstance.create(5, 10)
      assert.fail('This should have thrown an error')
    } catch (error) {
      assert.include(error.message, 'Lottery still running')
    }

    try {
      await lotteryInstance.enter('Adam', 77)
      assert.fail('This should have thrown an error')
    } catch (error) {
      assert.include(error.message, 'Number not in range')
    }

    try {
      await lotteryInstance.enter('Adam', 7, { value: 4 })
      assert.fail('This should have thrown an error')
    } catch (error) {
      assert.include(error.message, 'Fee too low')
    }

    await lotteryInstance.enter('Adam', 4, { value: 100 })

    const participantName = await lotteryInstance.participantNames(deployerAddress)
    const bettings = await lotteryInstance.bettings(4, 1)
    console.log(bettings);
    expect(participantName).to.equal('Adam')

    const prizePool = Number(await lotteryInstance.prizePool())
    expect(prizePool).to.equal(100)

    const winners = await lotteryInstance.getWinner()
    //console.log(winners);

  });
})
