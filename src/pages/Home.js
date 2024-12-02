import React, { useState, useEffect } from 'react';
import { fetchStocks } from '../services/apiServices.js';
import StockTable from '../components/StockTable';
import StockTotalsPills from '../components/StockTotalsPills.js';
import '../styles/home.css';
import StockPieChart from '../components/StockPieChart.js';
import TotalProfitLoss from '../components/TotalProfitLoss.js'
import TodayTotalPill from '../components/TodayTotalPill.js';
import StockTotalsPercentPill from '../components/StockTotalsPercentPill.js';
import TodayTotalChangePercentPill from '../components/TodayTotalChangePercentPill.js'
import { format } from "date-fns";
import StockSimpleLineChart from '../components/StockSimpleLineChart.js';


const Home = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Load cached stocks from local storage
        const cachedStocks = localStorage.getItem("stocks");
        if (cachedStocks) {
            setStocks(JSON.parse(cachedStocks));
        }
    }, []); // Only run once on mount

    const fetchStockData = async () => {
        setLoading(true);
        try {
            const newStocks = await fetchStocks(); // Assuming fetchStocks is defined elsewhere
            setStocks(newStocks);
            localStorage.setItem("stocks", JSON.stringify(newStocks));
            setCurrentTime(new Date()); // Update time only when data is fetched
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
    };

    const formattedDateTime = format(currentTime, "EEEE, do, yyyy, h:mm:ss a");


    return (
        <div className='mainContainer'>
            <h1 className='heading'>Investment Tracker</h1>
            <h2 className='heading'>{formattedDateTime}</h2>

            <div className='mainTable'>
                <button className='retrievePricesButton' onClick={fetchStockData}>Retrieve Prices</button>
                {loading && <p>Loading...</p>}
                <StockTable stocks={stocks} />
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

                <div className='stockGraphsRow'>
                    <StockSimpleLineChart />
                    <StockPieChart stocks={stocks} />
                </div>

            </div>
        </div>
    );
};

export default Home;
