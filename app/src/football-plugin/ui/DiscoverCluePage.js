import React, { useState } from 'react';

const DiscoverPage = ({ match, actions, accounts, plugin, burnerComponents }) => {
  const { Page, Button } = burnerComponents;
  const [status, setStatus] = useState('started');

  const makePage = content => <Page title="Discovering Clue...">{content}</Page>;

  const discoverClue = async (pk) => {
    try {
      const success = await plugin.discoverClue(pk);
      setStatus(success ? 'success' : 'invalid');
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  if (status === 'started') {
    setStatus('loading');
    discoverClue(match.params.pk);
    return makePage(null);
  }

  if (status === 'loading') {
    return makePage('Discovering...');
  }
  if (status === 'success') {
    const content = (
      <div>
        <h3>You discovered a clue!</h3>
        <Button onClick={() => actions.navigateTo('/')}>Continue</Button>
      </div>
    );
    return makePage(content);
  }
  if (status === 'error') {
    const content = (
      <div>
        <h3>There was an error with your clue...</h3>
        <Button onClick={() => actions.navigateTo('/')}>Back</Button>
      </div>
    );
    return makePage(content);
  }
  if (status === 'invalid') {
    const content = (
      <div>
        <h3>Invalid Clue</h3>
        <Button onClick={() => actions.navigateTo('/')}>Back</Button>
      </div>
    );
    return makePage(content);
  }
};

export default DiscoverPage;
