import React from 'react';
import '../styles/stockTotalsTable.css'; // Import the CSS file

const TodayTotalPill = ({ stocks }) => {
  const totalTodaysChangeNum = stocks.reduce(
    (sum, stock) => sum + (parseFloat(stock.todaysChangeNumeral) || 0),
    0
  );

  return (
    <div className="stock-totals-container">
      <h3 className="stock-totals-header">Today's Total Change</h3>
      <p
        className={`stock-totals-value ${
          totalTodaysChangeNum >= 0 ? 'positive' : 'negative'
        }`}
      >
        {totalTodaysChangeNum.toFixed(2)}
      </p>
    </div>
  );
};

export default TodayTotalPill;
