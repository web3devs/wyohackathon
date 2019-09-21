import VendorPage from './ui/VendorPage';
import vendors from './vendors.json';

const NAME_KEY = 'burner-vendor-name';

export default class VendorPlugin {
  constructor() {
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
