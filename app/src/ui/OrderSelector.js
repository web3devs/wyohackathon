import React, { useState } from 'react';
const classes = require('./OrderSelector.module.css')

const OrderSelector = ({ items, balance, onSend, unit, burnerComponents }) => {
  const [quantities, setQuantities] = useState({});
  const setQuanity = (name, quanity) => {
    setQuantities({
      ...quantities,
      [name]: parseInt(quanity),
    });
  };
  const [tip, setTip] = useState('0');
  const [notes, setNotes] = useState('');

  let message = items
    .filter((item) => quantities[item.name])
    .map((item) => `${item.name}: ${quantities[item.name]}`)
    .join(', ');
  if (tip !== '0') {
    message += `, Tip: ${tip}`
  }
  if (notes.length > 0) {
    message += `, "${notes}"`;
  }

  const subtotal = items.reduce((_total, item) =>
    _total + parseFloat(item.price) * parseFloat(quantities[item.name] || 0), 0);
  const total = subtotal + parseFloat(tip);

  const insufficentBalance = parseFloat(balance.displayBalance) < total;

  const { Button } = burnerComponents;

  return (
    <div className={classes.orders}>
      {items.map((item) => (
        <div className={classes.itemRow} key={item.name}>
          <div>
            <div>{item.name}</div>
            {item.description && (
              <div>{item.description}</div>
            )}
          </div>
          <div>
            <div className={classes.right}>{item.price} {unit}</div>
            <div className={classes.right}>
              Quantity: {}
              <input
                type="number"
                value={quantities[item.name] || '0'}
                min="0"
                step="0"
                onChange={e => setQuanity(item.name, e.target.value)}
                className={classes.input}
              />
            </div>
          </div>
        </div>
      ))}

      <div className={classes.bottom}>
        <div className={classes.noteBox}>
          <div>Note:</div>
          <div>
            <textarea onChange={e => setNotes(e.target.value)} value={notes} className={classes.notes} />
          </div>
        </div>

        <div>
          <div className={classes.right}>Subtotal: {subtotal} {unit}</div>
          <div className={classes.right}>
            Tip: {}
            <input
              type="number"
              min="0"
              value={tip}
              onChange={e => setTip(parseFloat('0' + e.target.value))}
              className={classes.input}
            />
          </div>
          <div className={classes.total}>Total: {total} {unit}</div>
        </div>
      </div>

      {insufficentBalance && (
        <div>Insufficent Balance: you only have {balance.displayBalance} {unit} remaining</div>
      )}
      <div>
        <Button onClick={() => onSend(total, message)} disabled={total === 0 || insufficentBalance}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default OrderSelector;
