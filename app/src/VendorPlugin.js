import VendorPage from './ui/VendorPage';
import dfsABI from './football-plugin/abi/DFS.json';

export default class VendorPlugin {
  constructor({assetId, contractAddress, network}) {
    this.assetId = assetId;
    this.contractAddress = contractAddress;
    this.network = network;

    this.contract = null;
  }

  initializePlugin(pluginContext) {
    this._pluginContext = pluginContext;

    pluginContext.addHomeButton('Sports', '/sports');
    pluginContext.addPage('/sports', VendorPage);
  }

  getContract() {
    if (!this.contract) {
      const web3 = this._pluginContext.getWeb3(this.network);
      this.contract = new web3.eth.Contract(dfsABI, this.contractAddress);
    }
    return this.contract;
  }

  getWeb3() {
    return this._pluginContext.getWeb3(this.network);
  }

  async testFunction() {
    let web3 = this.getWeb3(this.network);
    // const account = web3.eth.accounts.privateKeyToAccount();
    // console.log("account",account);
    console.log("sender:", this._pluginContext)
    alert("test")

    let contract = this.getContract();
    let returnValue = await contract.methods.payDues().send({
      from: '0x138e4AE992e883f56a0F40a64ad766A70BAa53Da',
      value: 1
    });
    console.log(returnValue);
  }
}
