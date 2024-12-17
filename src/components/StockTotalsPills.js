import React from 'react';
import '../styles/stockTotalsTable.css'; // Import the CSS file

const StockTotalsPills = ({ stocks }) => {
  // Calculate total market value
  const totalMarketValue = stocks.reduce(
    (sum, stock) => sum + stock.units * parseFloat(stock.price),
    0
  );

  return (
    <div className="stock-totals-container">
      <h3 className="stock-totals-header">Total Worth</h3>
      <p
        className={`stock-totals-value ${
          totalMarketValue >= 0 ? 'positive' : 'negative'
        }`}
      >
        {totalMarketValue.toFixed(2)}
      </p>
    </div>
  );
};

export default StockTotalsPills;
