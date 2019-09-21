import React, { Component } from 'react';

export default class VendorPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { burnerComponents, plugin, accounts, actions } = this.props;
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
            onClick={ () => plugin.testFunction()}
          >
            Submit Team
          </Button>

      </Page>
    );
  }
}
