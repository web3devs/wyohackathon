import React, { Component, Fragment } from 'react';
import dfsABI from '../football-plugin/abi/DFS.json';
import OrderSelector from './OrderSelector';
const classes = require('./VendorPage.module.css');

export default class VendorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newName: props.plugin.name,
      setName: props.plugin.name,
    };
  }

  initializePlugin(pluginContext) {
    this._pluginContext = pluginContext;

    pluginContext.addPage('/vendors/:vendorName?', VendorPage);
    pluginContext.addHomeButton('Vendors', '/vendors');
    pluginContext.onAccountSearch(query => this.vendorSearch(query));
  }

  render() {
    const { burnerComponents, plugin, match, accounts, actions } = this.props;
    const { Page, AccountBalance, Button } = burnerComponents;
    const selectedVendor = match.params.vendorName ? plugin.getVendor(match.params.vendorName) : null;
    const { newName, setName } = this.state;
    const asset = plugin.getAsset();
    const vendors = plugin.getVendors();

    if (vendors.length === 1 && !selectedVendor) {
      actions.navigateTo(`/vendors/${vendors[0].id}`);
    }

    return (
      <Page title="Pick Your Football Team">
          <input type="checkbox" value="1" />Patrick Mahomes - $5000<br />
          <input type="checkbox" value="2" />Julio Jones - $3000<br />
          <input type="checkbox" value="3" />Dalvin Cook - $2500<br />
          <input type="checkbox" value="4" />Travis Kelce - $3500<br />
          <input type="checkbox" value="5" />Gardner Minshew - $3000<br />
          <input type="checkbox" value="6" />Sammy Watkins - $2000<br />
          <input type="checkbox" value="7" />Christian McCaffrey - $2500<br />
          <input type="checkbox" value="8" />Emmanuel Sanders - $2000<br />
          <input type="checkbox" value="9" />Saquon Barkley - $3000<br />
          <input type="checkbox" value="10" />Antonio Brown - $0

          <Button
                  key={10}
                  onClick={ () => plugin.testFunction()}
                >
                  Submit Team
                </Button>

      </Page>
    );
  }
}
