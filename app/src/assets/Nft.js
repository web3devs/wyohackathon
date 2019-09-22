import toDecimal from './utils/decimals';

export default class Nft {
  constructor({ address, id, name, network, type=null, decimals=0 }) {
    this.address = address;
    this.id = id;
    this.name = name;
    this.network = network;
    this.type = type;

    this.decimals = decimals;

    this.cleanupFunctions = [];
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
