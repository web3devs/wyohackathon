import toDecimal from './utils/decimals';
import nftAbi from './Nft.json';

const BLOCK_LOOKBACK = 250;
const POLL_INTERVAL = 2500;

export default class Nft {
  constructor({ address, abi=nftAbi, pollInterval=POLL_INTERVAL, id, name, network, type='nft', decimals=0 }) {
    this.address = address;
    this.abi = abi;
    this._pollInterval = pollInterval;
    this._contract = null;
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

  async getBalance(account) {
    const balance = await this.getContract().methods.balanceOf(account).call();
    return balance.toString();
  }

  getContract() {
    if (!this._contract) {
      const Contract = this.getWeb3().eth.Contract;
      this._contract = new Contract(this.abi, this.address);
    }
    return this._contract;
  }

  allowance(from, to) {
    return this.getContract().methods.allowance(from, to).call();
  }

  approve(from, to, value) {
    return this.getContract().methods.approve(to, value).send({ from });
  }

  async getTx(txHash) {
    const events = await this._getEventsFromTx(txHash);
    const [transferEvent] = events.filter(event => event.event === 'Transfer');
    if (!transferEvent) {
      return null;
    }

    return {
      assetName: this.name,
      from: transferEvent.returnValues.from,
      to: transferEvent.returnValues.to,
      value: transferEvent.returnValues.value.toString(),
      displayValue: this.getDisplayValue(transferEvent.returnValues.value.toString()),
      message: null,
    };
  }

  startWatchingAddress(address) {
    let running = true;

    let block = 0;
    const poll = async () => {
      if (!running) {
        return;
      }
      try {
        const currentBlock = await this.getWeb3().eth.getBlockNumber();
        if (block === 0) {
          block = currentBlock - BLOCK_LOOKBACK;
        }

        const events = await this.getContract().getPastEvents('Transfer', {
          filter: { to: address },
          fromBlock: block,
          toBlock: currentBlock,
        });
        events.forEach(event => this.core.addHistoryEvent({
          asset: this.id,
          type: 'send',
          value: event.returnValues.value.toString(),
          from: event.returnValues.from,
          to: event.returnValues.to,
          tx: event.transactionHash,
          // TODO: timestamp,
        }));

        block = currentBlock;
      } catch (e) {
        console.warn('Polling Address failed', e);
      }
      setTimeout(poll, this._pollInterval);
    };

    poll();

    const unsubscribe = () => {
      running = false;
    };
    this.cleanupFunctions.push(unsubscribe);
    return unsubscribe;
  }


  async _getEventsFromTx(txHash) {
    const web3 = this.getWeb3();
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    if (!receipt) {
      return [];
    }
    const events = await this.getContract().getPastEvents('allEvents', {
      fromBlock: receipt.blockNumber,
      toBlock: receipt.blockNumber,
    });
    return events.filter(event => event.transactionHash === txHash);
  }

  async _send({ from, to, value }) {
    const receipt = await this.getContract().methods.transfer(to, value).send({ from });
    return {
      ...receipt,
      txHash: receipt.hash,
    };
  }
}
