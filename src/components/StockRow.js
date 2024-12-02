import React from 'react';

const StockRow = ({ stock }) => {
  return (
    <p>{stock.name}: ${stock.price}</p>
  );
};

export default StockRow;
