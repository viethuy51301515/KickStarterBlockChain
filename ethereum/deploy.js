const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const provider = new HDWalletProvider(
  "stand tray aerobic oil tornado neither glare emerge spoil prefer brisk style",
  "https://rinkeby.infura.io/v3/aa8ab7d932ae4e5d8f658975cb61f512"
);
const CampaignFactory = require("./build/CampaignFactory.json");

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  const campaign = await new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface)
  )
    .deploy({
      data: CampaignFactory.bytecode,
      gas: "1000000",
    })
    .send({
      from: accounts[0],
    });
  console.log(campaign.options.address);
};

deploy();
