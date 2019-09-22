import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { xdai, dai, eth, ERC20Asset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { InjectedSigner, LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway, InjectedGateway, XDaiGateway } from '@burner-wallet/core/gateways';
import Exchange from '@burner-wallet/exchange';
import { xdaiBridge, uniswapDai } from '@burner-wallet/exchange/pairs';
import BurnerUI from '@burner-wallet/ui';
// import LegacyPlugin from '@burner-wallet/plugins/legacy';

// this imports from the plugin

// import FootballPlugin from './football-plugin'
import VendorPlugin from './VendorPlugin';
import Nft from './assets/Nft.js'

const nft = new Nft({
  id: "nft",
  name: "Trophies",
  network: "100",
  address: "0xA20258B0c9F0F43Ee08785EA89FbE5b9d636d475"
});


const core = new BurnerCore({
  signers: [new InjectedSigner(), new LocalSigner()],
  gateways: [
    new InjectedGateway(),
    new InfuraGateway(process.env.REACT_APP_INFURA_KEY),
    new XDaiGateway(),
    ],
    assets: [xdai, dai, eth, nft],
});

const exchange = new Exchange({
pairs: [xdaiBridge, uniswapDai],
});

const BurnerWallet = () =>
<BurnerUI
title="WyoHackathon"
core={core}
plugins={[exchange, new VendorPlugin({  assetId: 'xdai',
  contractAddress: '0x797A9A300249AB72E52090B511C26adcA0bA108a',
  network: '100'})]}
/>

ReactDOM.render(<BurnerWallet />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
