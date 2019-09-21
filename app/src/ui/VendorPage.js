import React, { Component, Fragment } from 'react';
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
        <h3>Set your Name</h3>
        <div className={classes.nameBox}>
          <input value={newName} onChange={e => this.setState({ newName: e.target.value })} />
          <Button
            onClick={() => {
              plugin.setName(newName);
              this.setState({ setName: newName });
            }}
            disabled={newName === setName}
          >
            Set Name
          </Button>
        </div>

        {vendors.length > 1 && (
          <Fragment>
            <h3>Select Vendor</h3>
            <div className={classes.vendorList}>
              {vendors.map(vendor => (
                <Button
                  key={vendor.id}
                  onClick={() => actions.navigateTo(`/vendors/${vendor.id}`)}
                  disabled={selectedVendor && vendor.id === selectedVendor.id}
                >
                  {vendor.name}
                </Button>
              ))}
            </div>
          </Fragment>
        )}

        <h3>Order</h3>
        {!selectedVendor && <div>Select a vendor</div>}
        {selectedVendor && accounts.length > 0 && (
          <AccountBalance
            asset={asset.id}
            account={accounts[0]}
            render={(err, balance) => balance ? (
              <OrderSelector
                items={selectedVendor.items}
                balance={balance}
                unit={asset.name}
                burnerComponents={burnerComponents}
                onSend={(amount, message) => {
                  actions.send({
                    asset: asset.id,
                    ether: amount.toString(),
                    message: `[${plugin.name}] ${message}`,
                    to: selectedVendor.address,
                  });
                }}
              />
           ) : 'Loading...'}
          />
        )}
      </Page>
    );
  }
}
