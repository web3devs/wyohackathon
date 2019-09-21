import VendorPage from './ui/VendorPage';
import vendors from './vendors.json';
import dfsABI from './football-plugin/abi/DFS.json';

const NAME_KEY = 'burner-vendor-name';

export default class VendorPlugin {
  constructor(props) {
    this.props = props;
    this.name = window.localStorage.getItem(NAME_KEY) || '';
  }

  initializePlugin(pluginContext) {
    this._pluginContext = pluginContext;

    pluginContext.addPage('/vendors/:vendorName?', VendorPage);
    pluginContext.addHomeButton('Vendors', '/vendors');
    pluginContext.onAccountSearch(query => this.vendorSearch(query));
  }

  setName(newName) {
    this.name = newName;
    window.localStorage.setItem(NAME_KEY, newName);
  }

  getVendors() {
    return vendors.vendors;
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

  getAsset() {
    const [asset] = this._pluginContext.getAssets().filter(asset => asset.id === vendors.asset);
    if (!asset) {
      throw new Error(`Can't find vendor asset ${vendors.asset}`)
    }
    return asset;
  }

  getVendor(id) {
    const [vendor] = vendors.vendors.filter(vendor => vendor.id === id);
    return vendor;
  }

  vendorSearch(query) {
    return query.length === 0
      ? []
      : vendors.vendors.filter(vendor => vendor.name.toLowerCase().indexOf(query) === 0);
  }
}
