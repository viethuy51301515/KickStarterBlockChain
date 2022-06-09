import Web3 from "web3";
let web3;
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // we are in browser and meta mask is running
  window.ethereum.request({ method: "eth_requestAccounts" });

  web3 = new Web3(window.ethereum);
} else {
  // running on server
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/15c1d32581894b88a92d8d9e519e476c"
  );
  web3 = new Web3(provider);
}

export default web3;
