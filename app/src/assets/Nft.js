// const { fromWei, toWei } = require('web3-utils');
// const pricefeed = require('./pricefeed');
import toDecimal from './utils/decimals';

const PRICE_POLL_INTERVAL = 15 * 1000;

export default class Nft {
  constructor({ id, name, network, usdPrice, priceSymbol, type=null, decimals=0 }) {
    this.id = id;
    this.name = name;
    this.network = network;
    this.usdPrice = usdPrice;
    this.priceSymbol = priceSymbol;
    this.type = type;

    this.decimals = decimals;

    this.cleanupFunctions = [];

    if (priceSymbol) {
      this._startPricePolling();
    }
  }

  setCore(core) {
    this.core = core;
  }

  supportsMessages() {
    return false;
  }

  async getTx(txHash) {
    throw new Error('Not implemented');
  }

  getDisplayValue(value, decimals=2) {
    const displayVal = toDecimal(value.toString(), this.decimals);
    if (displayVal.indexOf('.') !== -1) {
      return displayVal.substr(0, displayVal.indexOf('.') + decimals + 1);
    }
    return displayVal;
  }

  getUSDValue(value, decimals=2) {
    if (this.usdPrice) {
      return (+this.getDisplayValue(value, 10) * this.usdPrice).toFixed(decimals);
    }
    throw new Error('USD price not available');
  }

  async getBalance(account) {
    throw new Error('getBalance not implemented');
  }

  async getDisplayBalance(account, decimals=0) {
    const balance = await this.getBalance(account);
    return this.getDisplayValue(balance, decimals);
  }

  startWatchingAddress(address) {
    throw new Error('watching not implemented');
  }

  getWeb3(options) {
    return this.core.getWeb3(this.network, options);
  }

  stop() {
    this.cleanupFunctions.forEach(fn => fn());
  }
}
