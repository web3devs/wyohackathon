import React from 'react';

const Advanced = ({ burnerComponents, plugin }) => {
  const { Button } = burnerComponents;

  return (
    <div>
      <h3>Daedalus</h3>
      <Button onClick={() => plugin.clearStoredClues()}>Reset Clues</Button>
    </div>
  );
}

export default Advanced;
