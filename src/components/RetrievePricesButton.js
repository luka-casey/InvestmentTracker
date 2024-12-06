import React, { useState, useEffect } from 'react';
import { fetchStocks } from '../services/apiServices.js';
import StockTable from '../components/StockTable';
import '../styles/home.css';
import StockPieChart from '../components/StockPieChart.js';
import { format } from "date-fns";
import StockSimpleLineChart from '../components/StockSimpleLineChart.js';
import StockPills from '../components/StockPills.js';
import HomeHeadings from '../components/HomeHeadings.js';

const RetrievePricesButton = ({fetchStockData, loading}) => {

    return (
        <div className='mainTable'>
            <button className='retrievePricesButton' onClick={fetchStockData}>Retrieve Prices</button>
            {loading && <p>Loading...</p>}
        </div>
    );
};

export default RetrievePricesButton;
