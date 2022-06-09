const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const campaignPath = path.resolve(__dirname, "contract", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf-8");

const buildPath = path.resolve(__dirname, "build");

fs.removeSync(buildPath);

var output = solc.compile(source, 1).contracts;
fs.ensureDirSync(buildPath);
for (let contract in output) {
  fs.outputJSONSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    output[contract]
  );
}
