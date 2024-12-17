import React from 'react';

const TotalProfitLoss = ({ stocks }) => {
  // Calculate the total change
  const totalChangeSum = stocks.reduce((sum, stock) => sum + Number(stock.totalChange || 0), 0);

  return (
    <div className="stock-totals-container">
      <h3 className="stock-totals-header">Total Profit/Loss</h3>
      <p
        className={`stock-totals-value ${
          totalChangeSum >= 0 ? 'positive' : 'negative'
        }`}
      >
        {totalChangeSum.toFixed(2)}
      </p>
    </div>
  );
};

export default TotalProfitLoss;
