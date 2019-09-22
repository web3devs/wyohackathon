import VendorPage from './ui/VendorPage';
import dfsABI from './abi/DFS.json';

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
}
