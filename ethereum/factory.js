import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x5c5E385F9A446DC536cFB956b32963a3a44AE31c"
);

export default instance;
