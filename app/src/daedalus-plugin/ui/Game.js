import React, { Component } from 'react';

const STAKE_AMOUNT = '16000000000000000000';

const StakeAmount = ({ amount }) => (
  <div className="BalanceRow_balanceRow__2DRQd">
    <div className="BalanceRow_assetName__1Zw3e">Staked</div>
    <div className="BalanceRow_assetBalance__3STUO">{amount}</div>
  </div>
);

const KeyFilled = () => (
  <svg style={{ width: 48, height: 48 }} viewBox="0 0 24 24">
    <path fill="#fbfbfb" d="M7,14A2,2 0 0,1 5,12A2,2 0 0,1 7,10A2,2 0 0,1 9,12A2,2 0 0,1 7,14M12.65,10C11.83,7.67 9.61,6 7,6A6,6 0 0,0 1,12A6,6 0 0,0 7,18C9.61,18 11.83,16.33 12.65,14H17V18H21V14H23V10H12.65Z" />
  </svg>
);
const KeyOutline = () => (
  <svg style={{ width: 48, height: 48 }} viewBox="0 0 24 24">
    <path fill="#fbfbfb" d="M22,19H16V15H13.32C12.18,17.42 9.72,19 7,19C3.14,19 0,15.86 0,12C0,8.14 3.14,5 7,5C9.72,5 12.17,6.58 13.32,9H24V15H22V19M18,17H20V13H22V11H11.94L11.71,10.33C11,8.34 9.11,7 7,7A5,5 0 0,0 2,12A5,5 0 0,0 7,17C9.11,17 11,15.66 11.71,13.67L11.94,13H18V17M7,15A3,3 0 0,1 4,12A3,3 0 0,1 7,9A3,3 0 0,1 10,12A3,3 0 0,1 7,15M7,11A1,1 0 0,0 6,12A1,1 0 0,0 7,13A1,1 0 0,0 8,12A1,1 0 0,0 7,11Z" />
  </svg>
);

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'start',
      numClues: 0,
      clueStatus: {},
      staked: '0',
      hintAmount: '',
      showHint: false,
      sendingHint: false,
    }
  }

  componentDidUpdate() {
    this.updateGame();
  }
  componentDidMount() {
    this.updateGame();
  }

  async updateGame() {
    let { status, numClues } = this.state;
    const { accounts, plugin } = this.props;
    const contract = plugin.getContract();

    if (numClues === 0) {
      numClues = (await contract.methods.numClues().call()).toNumber();
      this.setState({ numClues });
    }

    if (accounts.length === 0) {
      return;
    }

    if (status === 'start') {
      const staked = await contract.methods.remainingStake(accounts[0]).call();
      if (staked.toString() === '0') {
        this.setState({ status: 'unstaked' });
        return;
      }

      this.updateGameStatus();
    }
  }

  async stake() {
    const { assets, plugin, accounts } = this.props;
    const [asset] = assets.filter(asset => asset.id === plugin.assetId);
    this.setState({ status: 'approving' });
    await asset.approve(accounts[0], plugin.getContract().address, STAKE_AMOUNT);
    this.setState({ status: 'staking' });
    await plugin.getContract().methods.stake(STAKE_AMOUNT).send({ from: accounts[0] });
    this.updateGameStatus();
  }

  async updateGameStatus() {
    const { plugin, accounts } = this.props;
    const [account] = accounts;
    const clueStatus = {};
    let unlockedAll = true;
    for (let i = 1; i <= this.state.numClues; i++) {
      if (plugin.getStoredClue(i)
        || await plugin.getContract().methods.foundClue(account, i).call()) {
        clueStatus[i] = true;
      } else {
        unlockedAll = false;
      }
    }
    const status = unlockedAll ? 'unlocked' : 'playing';
    const web3 = plugin.getWeb3();
    const staked = await plugin.getContract().methods.remainingStake(account).call();
    this.setState({ clueStatus, status, staked: web3.utils.fromWei(staked.toString(), 'ether') });
  }

  getSignatures(account) {
    const web3 = this.props.plugin.getWeb3();
    const accounts = this.props.plugin.getStoredClues();

    const clues = [];
    const rs = [];
    const ss = [];
    const vs = [];
    Object.values(accounts).forEach(pk => {
      const clueAccount = web3.eth.accounts.privateKeyToAccount(pk);
      const { r, s, v } = clueAccount.sign(web3.utils.keccak256(account), pk);
      clues.push(clueAccount.address);
      rs.push(r);
      ss.push(s);
      vs.push(v);
    });

    return { clues, rs, ss, vs };
  }

  async requestHint() {
    const { plugin, accounts } = this.props;
    this.setState({ sendingHint: true });
    const amount = plugin.getWeb3().utils.toWei(this.state.hintAmount, 'ether');
    await plugin.getContract().methods.donate(amount).send({ from: accounts[0] });
    await this.updateGameStatus();
    this.setState({ sendingHint: false, showHint: false, hintAmount: '' });
  }

  async promptDonate() {
    await this.props.actions.scanQrCode();
    this.donate();
  }

  async donate() {
    const { plugin, accounts } = this.props;
    const contract = plugin.getContract();

    this.setState({ status: 'sending' });
    const { clues, rs, ss, vs } = this.getSignatures(accounts[0]);
    const remaining = await contract.methods.remainingStake(accounts[0]).call();
    await contract.methods.findCluesAndDonate(clues, vs, rs, ss, remaining).send({ from: accounts[0] });
    this.setState({ status: 'complete' });
  }


  async promptRedeem() {
    await this.props.actions.scanQrCode();
    this.redeem();
  }

  async redeem() {
    const { plugin, accounts } = this.props;

    this.setState({ status: 'sending' });
    const { clues, rs, ss, vs } = this.getSignatures(this.props.accounts[0]);
    await plugin.getContract().methods.findCluesAndRedeem(clues, vs, rs, ss).send({ from: accounts[0], gas: 200000 });
    this.setState({ status: 'complete' });
  }

  render() {
    const { accounts, burnerComponents, plugin } = this.props;
    const { status, clueStatus, numClues, staked, hintAmount, sendingHint, showHint } = this.state;

    if (accounts.length === 0) {
      return null;
    }

    const { Button, AccountBalance } = burnerComponents;
    const stakeAmt = plugin.getWeb3().utils.fromWei(STAKE_AMOUNT, 'ether');

    if (status === 'unstaked') {
      return (
        <div>
          <div>You must stake {stakeAmt} Dai to start</div>
          <AccountBalance
            asset={plugin.assetId}
            account={accounts[0]}
            render={(err, balance) => (
              balance < parseFloat(stakeAmt) ? (
                <div>Add {stakeAmt} Dai to unlock staking</div>
              ) : (
                <Button onClick={() => this.stake()}>Stake {stakeAmt} Dai</Button>
              )
            )}
          />
        </div>
      );
    }

    if (status === 'start') {
      return 'Loading...';
    }

    if (status === 'approving') {
      return (<div>Approving...</div>);
    }
    if (status === 'staking') {
      return (<div>Staking...</div>);
    }

    if (status === 'sending') {
      return (<div>Sending</div>);
    }

    if (status === 'complete') {
      return (<div>Complete</div>);
    }

    if (status === 'playing') {
      return (
        <div>
          <StakeAmount amount={staked}/>

          <div style={{ marginTop: '12px' }}>Keys Unlocked: {Object.keys(clueStatus).length}/{numClues}</div>
          <div style={{ display: 'flex' }}>
            {[...Array(numClues).keys()].map(i => (
              <div key={`clue${i + 1}`} style={{ padding: 12 }}>
                {clueStatus[i + 1] ? <KeyFilled /> : <KeyOutline />}
              </div>
            ))}
          </div>

          {showHint && (
            <div style={{ display: 'flex' }}>
              <input
                type="number"
                value={hintAmount}
                onChange={e => this.setState({ hintAmount: e.target.value })}
                min="0"
                placeholder="10 Dai"
                disabled={sendingHint}
                style={{ fontSize: '18px' }}
              />
              <Button onClick={() => this.requestHint()} disabled={hintAmount === ''}>Send to Eve</Button>
            </div>
          )}

          <div>
            <div>
              <Button onClick={() => this.setState({ showHint: !showHint })}>Hint</Button>
            </div>
            <div>
              <Button onClick={() => this.props.actions.navigateTo('/secret')}>Secret Phrase</Button>
            </div>
          </div>
        </div>
      );
    }

    if (status === 'unlocked') {
      return (
        <div>
          <StakeAmount amount={staked}/>
          <div>All clues unlocked</div>
          <Button onClick={() => this.promptDonate()}>Donate</Button>
          <Button onClick={() => this.promptRedeem()}>Redeem</Button>
        </div>
      );
    }

    return `Unknown status ${status}`;
  }
}