import dfsABI from './abi/DFS.json';
import Advanced from './ui/Advanced';
import DiscoverCluePage from './ui/DiscoverCluePage';
import SecretPhrasePage from './ui/SecretPhrasePage';
import Game from './ui/Game';

export default class FootballPlugin {
  constructor({ assetId, contractAddress, network }) {
    this.assetId = assetId;
    this.contractAddress = contractAddress;
    this.network = network;

    this.contract = null;
  }

  initializePlugin(pluginContext) {
    this._pluginContext = pluginContext;

    pluginContext.addPage('/secret', SecretPhrasePage);
    pluginContext.addPage('/discover/:pk', DiscoverCluePage);
    pluginContext.addElement('home-middle', Game);
    pluginContext.addElement('advanced', Advanced);
  }

  getContract() {
    if (!this.contract) {
      const web3 = this._pluginContext.getWeb3(this.network);
      this.contract = new web3.eth.Contract(dfsABI, this.contractAddress);
    }
    return this.contract;
  }

  getWeb3() {
    return this._pluginContext.getWeb3(this.network);
  }

  // async discoverClue(pk) {
  //   const web3 = this.getWeb3();
  //   const account = web3.eth.accounts.privateKeyToAccount(pk);
  //   console.log(account);
  //   const clueNum = await this.getContract().methods.clueToClueNum(account.address).call();
  //   if (clueNum !== 0) {
  //     this.storeClue(clueNum, pk);
  //     return true;
  //   }
  //   return false;
  // }

  // getStoredClues() {
  //   return JSON.parse(localStorage.getItem('storedClues') || '{}');
  // }

  // storeClue(index, privateKey) {
  //   const clues = JSON.parse(localStorage.getItem('storedClues') || '{}');
  //   clues[index] = privateKey;
  //   localStorage.setItem('storedClues', JSON.stringify(clues));
  // }

  // getStoredClue(index) {
  //   const clues = JSON.parse(localStorage.getItem('storedClues') || '{}');
  //   return clues[index];
  // }

  // clearStoredClues() {
  //   localStorage.setItem('storedClues', '{}');
  // }
}
