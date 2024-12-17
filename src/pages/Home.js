import React, { useState, useEffect } from 'react';
import '../styles/home.css';
import { fetchStocks } from '../services/YahooFinanceService/fetchStocks.js'
import StockTable from '../components/StockTable';
import StockPieChart from '../components/StockPieChart.js';
import StockSimpleLineChart from '../components/StockSimpleLineChart.js';
import StockPills from '../components/StockPills.js';
import HomeHeadings from '../components/HomeHeadings.js';
import RetrievePricesButton from '../components/RetrievePricesButton.js';
import WeeklyHighlites from '../components/WeeklyHighlites.js';

const Home = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const cachedStocks = localStorage.getItem("stocks");

        if (cachedStocks) {
            setStocks(JSON.parse(cachedStocks));
        }

    }, []);

    const fetchStockData = async () => {
        setLoading(true);

        try {
            const newStocks = await fetchStocks();
            setStocks(newStocks);

            localStorage.setItem("stocks", JSON.stringify(newStocks));

            setCurrentTime(new Date());

        } catch (error) {
            console.error("Error fetching data:", error);
        }

        setLoading(false);
    };


    return (
        <div className='mainContainer'>

            <HomeHeadings currentTime={currentTime} />

            <div className='mainTable'>

                <RetrievePricesButton fetchStockData={fetchStockData} loading={loading} />

                <StockTable stocks={stocks} />

                <StockPills stocks={stocks} />

                <div className='stockGraphsRow'>

                    <StockSimpleLineChart specificStockName={"none"} />

                    <StockPieChart stocks={stocks} />

                    <WeeklyHighlites />

                </div>

            </div>
        </div>
    );
};

export default Home;
