import React, { useState } from 'react';
import '../styles/stocktable.css';
import StockSimpleLineChart from './StockSimpleLineChart'

const StockTable = ({ stocks }) => {
    const [expandedRows, setExpandedRows] = useState({}); // Track expanded rows

    const toggleRowExpansion = (index) => {
        setExpandedRows((prev) => ({
            ...prev,
            [index]: !prev[index], // Toggle expansion state for the specific row
        }));
    };

    return (
        <table className="stock-table">
            <thead className="stock-table-head">
                <tr className="stock-table-row">
                    <th className="stock-table-header">Name</th>
                    <th className="stock-table-header">Units</th>
                    <th className="stock-table-header">Price</th>
                    <th className="stock-table-header">Market Value</th>
                    <th className="stock-table-header">Today's Change %</th>
                    <th className="stock-table-header">Today's Change</th>
                    <th className="stock-table-header">Total Change</th>
                    <th className="stock-table-header">Total % Change</th>
                    <th className="stock-table-header">Market</th>
                </tr>
            </thead>
            <tbody className="stock-table-body">
                {stocks.map((stock, index) => {
                    const todaysChangeValue = parseFloat(stock.todaysChange); // Remove % for comparison
                    const totalChangeValue = parseFloat(stock.totalChange); // Remove % for comparison

                    return (
                        <React.Fragment key={index}>
                            <tr
                                className={`stock-table-row ${expandedRows[index] ? 'expanded' : ''}`}
                                onClick={() => toggleRowExpansion(index)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td className="stock-table-cell">
                                    <span className="stock-icon">
                                        {stock.icon && (
                                            <img
                                                src={stock.icon}
                                                alt={`${stock.name} icon`}
                                                className="stock-icon-img"
                                            />
                                        )}
                                    </span>
                                    <span>{stock.name}</span>
                                </td>
                                <td className="stock-table-cell">{stock.units}</td>
                                <td className="stock-table-cell">{stock.price}</td>
                                <td className="stock-table-cell">
                                    {(stock.price * stock.units).toFixed(2)}
                                </td>
                                <td
                                    className={`stock-table-cell ${
                                        todaysChangeValue >= 0 ? 'positive' : 'negative'
                                    }`}
                                >
                                    {stock.todaysChange}
                                </td>

                                <td
                                    className={`stock-table-cell ${
                                        stock.todaysChangeNumeral >= 0 ? 'positive' : 'negative'
                                    }`}
                                >
                                    {stock.todaysChangeNumeral}
                                </td>

                                <td
                                    className={`stock-table-cell ${
                                        totalChangeValue >= 0 ? 'positive' : 'negative'
                                    }`}
                                >
                                    {totalChangeValue.toFixed(2)}
                                </td>
                                <td
                                    className={`stock-table-cell ${
                                        stock.totalChangePercent >= 0 ? 'positive' : 'negative'
                                    }`}
                                >
                                    {stock.totalChangePercent + '%'}
                                </td>

                                <td>
                                    <span className="stock-icon">
                                        {stock.marketOpenIcon && (
                                            <img
                                                src={stock.marketOpenIcon}
                                                alt={`${stock.name} icon`}
                                                className="stock-icon-img"
                                            />
                                        )}
                                    </span>
                                </td>
                            </tr>
                            {expandedRows[index] && (
                                <tr className="stock-table-row expanded-row">
                                    <td colSpan="9" className="stock-table-cell expanded-content">
                                        <div style={{display: "flex", justifyContent: "center"}}>
                                            <StockSimpleLineChart specificStockName={stock.name} />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    );
                })}
            </tbody>
        </table>
    );
};

export default StockTable;
