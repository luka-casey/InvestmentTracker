import React from 'react';
import StockTotalsPills from '../components/StockTotalsPills.js';
import '../styles/home.css';
import TotalProfitLoss from '../components/TotalProfitLoss.js'
import TodayTotalPill from '../components/TodayTotalPill.js';
import StockTotalsPercentPill from '../components/StockTotalsPercentPill.js';
import TodayTotalChangePercentPill from '../components/TodayTotalChangePercentPill.js'

const StockPills = ({ stocks }) => {
    return (
        <div className='pillsContainer'>
            <div className='pills'>
                <h1 className='pillsHeading'>All Time</h1>
                <StockTotalsPills stocks={stocks} />
                <TotalProfitLoss stocks={stocks} />
                <StockTotalsPercentPill stocks={stocks} />
            </div>
            <div className='pills'>
                <h1 className='pillsHeading'>Today</h1>
                <TodayTotalChangePercentPill stocks={stocks} />
                <TodayTotalPill stocks={stocks} />
            </div>
        </div>
    );
};

export default StockPills;
