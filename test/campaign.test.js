const Web3 = require("web3");
const ganache = require("ganache-cli");
const assert = require("assert");
const compiledCampaign = require("../ethereum/build/Campaign.json");
const compiledFactory = require("../ethereum/build/CampaignFactory.json");

let accounts;
let factory;
let campaign;
let campaignAddress;

const web3 = new Web3(ganache.provider());
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({
      data: compiledFactory.bytecode,
    })
    .send({
      from: accounts[0],
      gas: "1000000",
    });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000",
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaign", () => {
  it("deploy factory and campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });
  it("allows people to contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: "200",
    });

    const isContributor = await campaign.methods.approvers(accounts[1]).call();

    assert(isContributor);
  });
  it("require minimum", async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: "0",
      });
      assert(false);
    } catch (error) {
      assert(true);
    }
  });

  it("get request", async () => {
    await campaign.methods
      .createRequest("buy new computer", "9999999", accounts[2])
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    const request = await campaign.methods.requests(0).call();

    assert.equal(request.description, "buy new computer");
    assert.equal(request.value, "9999999");
    assert.equal(request.recipient, accounts[2]);
  });

  it("set request approval", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: "200",
    });
    await campaign.methods.contribute().send({
      from: accounts[2],
      value: "200",
    });

    await campaign.methods
      .createRequest("buy new computer", "10000000", accounts[3])
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    await campaign.methods.approveRequest(0).send({
      from: accounts[1],
    });
    await campaign.methods.approveRequest(0).send({
      from: accounts[2],
    });

    const request = await campaign.methods.requests(0).call();
    assert.equal(request.approvalCount, 2);

    const initialValue = await web3.eth.getBalance(accounts[3]);

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    const finalValue = await web3.eth.getBalance(accounts[3]);

    const diff = finalValue - initialValue;
    console.log(diff);
    assert(diff > 8000000);
  });
});
