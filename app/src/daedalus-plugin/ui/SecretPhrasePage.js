import React, { useState } from 'react';
import hdkey from 'ethereumjs-wallet/hdkey';
const bip39 = require('bip39');

const SecretPhrasePage = ({ plugin, burnerComponents, actions }) => {
  const { Button, Page } = burnerComponents;
  const [status, setStatus] = useState(null);
  const [phrase, setPhrase] = useState('');

  const tryClue = async () => {
    const hdwallet = hdkey.fromMasterSeed(await bip39.mnemonicToSeed(phrase.trim()));
    const path = "m/44'/60'/0'/0/0";
    const wallet = hdwallet.derivePath(path).getWallet();
    const success = await plugin.discoverClue(wallet.getPrivateKeyString());
    setStatus(success ? 'success' : 'invalid');
    success && setPhrase('');
  }

  if (status === 'success') {
    return (
      <Page title="Secret Phrase">
        <div>Clue discovered!</div>
        <Button onClick={() => actions.navigateTo('/')}>Continue</Button>
      </Page>
    );
  }

  return (
    <Page title="Secret Phrase">
      <div style={{ display: 'flex', marginBottom: '8px' }}>
        <textarea value={phrase} onChange={e => setPhrase(e.target.value.toLowerCase())} style={{width:'100%', height: '300px', fontSize: '24px' }} />
      </div>
      <Button onClick={tryClue}>Enter seed phrase</Button>
      {status === 'invalid' && (
        <div>Invalid seed phrase</div>
      )}
    </Page>
  )
};

export default SecretPhrasePage;
