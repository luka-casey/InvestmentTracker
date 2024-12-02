import React from 'react';

const StockTotalsPercentPill = ({ stocks }) => {
    
    const totalMarketValue = stocks.reduce(
        (sum, stock) => sum + stock.units * parseFloat(stock.price),
        0
    );

    const totalChangeSum = stocks.reduce(
        (sum, stock) => sum + Number(stock.totalChange || 0),
        0
    );

    const totalPercentChange = (totalChangeSum / totalMarketValue) * 100;

    return (
        <div className="stock-totals-container">
            <h3 className="stock-totals-header">Total Profit/Loss (%)</h3>
            <p
                className={`stock-totals-value ${
                    totalPercentChange >= 0 ? 'positive' : 'negative'
                }`}
            >
                {totalPercentChange.toFixed(2)}%
            </p>
        </div>
    );
};

export default StockTotalsPercentPill;
