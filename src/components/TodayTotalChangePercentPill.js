import React from 'react';
import '../styles/stockTotalsTable.css'; // Import the CSS file

const TodayTotalChangePercentPill = ({ stocks }) => {
  const totalTodaysChangeNum = stocks.reduce(
    (sum, stock) => sum + (parseFloat(stock.todaysChangeNumeral) || 0),
    0
  );

  const totalMarketValue = stocks.reduce(
    (sum, stock) => sum + stock.units * parseFloat(stock.price),
    0
  );

  const totalChangePercent =
    totalMarketValue > 0
      ? (totalTodaysChangeNum / totalMarketValue) * 100
      : 0;

  return (
    <div className="stock-totals-container">
      <h3 className="stock-totals-header">Today's Total Change (%)</h3>
      <p
        className={`stock-totals-value ${
          totalChangePercent >= 0 ? 'positive' : 'negative'
        }`}
      >
        {totalChangePercent.toFixed(2)}%
      </p>
    </div>
  );
};

export default TodayTotalChangePercentPill;
