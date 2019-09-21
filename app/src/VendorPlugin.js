import VendorPage from './ui/VendorPage';
import dfsABI from './football-plugin/abi/DFS.json';

export default class VendorPlugin {
  constructor(props) {
    this.props = props;
  }

  initializePlugin(pluginContext) {
    this._pluginContext = pluginContext;

    pluginContext.addPage('/sports', VendorPage);
    pluginContext.addHomeButton('Sports', '/sports');
  }

  async testFunction() {
    let web3 = this._pluginContext.getWeb3(100);
    let contract = web3.eth.Contract(dfsABI, '0x797A9A300249AB72E52090B511C26adcA0bA108a');
    let returnValue = await contract.methods.payDues().send({
      from: '0x138e4AE992e883f56a0F40a64ad766A70BAa53Da',
      value: 1
    });
    //console.log(returnValue);
  }
}
