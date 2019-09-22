import React, { Component } from 'react';


const DuesNotPaid = () => (
  <div style={{ color: 'red' }}>Team is not selected</div>
);

const DuesPaid = () => (
  <div style={{ color: 'green' }}>Team submitted</div>
);


export default class VendorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duesStatus: 0
    }
  }

  async testFunction() {
    const { assets, plugin, accounts, defaultAccount} = this.props;
    const contract = plugin.getContract();
    console.log("plugin", plugin);
    console.log("assets", assets);
    console.log("accounts", accounts);
    console.log("contract", contract);
    console.log("props", this.props);
    console.log("sender:", accounts[0])

    // let contract = this.getContract();
    let returnValue = await contract.methods.payDues().send({
      from: accounts[0],
      value: 1
    });
    console.log(returnValue);
    this.setState({
      duesStatus: 1
    })
  }


  render() {
    const { burnerComponents, plugin } = this.props;
    const { Page, Button } = burnerComponents;

    return (
      <Page title="Pick Your Team">
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
            onClick={ () => this.testFunction()}
            disabled={this.state.duesStatus}
          >
            Submit Team
          </Button>
          <br /><br />
          {this.state.duesStatus ? <DuesPaid /> : <DuesNotPaid />}
          
      </Page>
    );
  }
}
