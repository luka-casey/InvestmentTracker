import React, { useState } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/FirebaseService/fireBaseService'; // Import your Firebase config
import StockSimpleLineChart from '../components/StockSimpleLineChart.js';


const WeeklyHighlites = () => {

    const [bestStock, setBestStock] = useState();

    React.useEffect(() => {

        fetchBestStockOfWeek();

    }, []);

    function parseFormattedDate(dateString) {
        const [month, day, year] = dateString.split(' ').map(Number);
        const fullYear = 2000 + year; // Assuming the year is in "yy" format
        return new Date(fullYear, month - 1, day);
    }


    const fetchBestStockOfWeek = async () => {
        const stocks = await fetchAndFormatStockData();

        const bestStock = getBestPerformingStockOfWeek(stocks);

        setBestStock(bestStock);
    }

    const fetchAndFormatStockData = async () => {
        const stocksCollection = collection(db, 'testForStocks');
        const querySnapshot = await getDocs(stocksCollection);

        const now = new Date();

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);

        return querySnapshot.docs
            .map((doc) => {
                const stock = doc.data();
                const date = parseFormattedDate(stock.date);

                if (date < oneWeekAgo || date > now) {
                    return null;
                }

                const currentValue = stock.price * stock.units;

                return {
                    date,
                    stockId: stock.id,
                    stockName: stock.name,
                    value: currentValue,
                };
            })
            .filter((stock) => stock !== null);
    };


    const getBestPerformingStockOfWeek = (stocks) => {
        const groupedStocks = stocks.reduce((acc, stock) => {
            if (!acc[stock.stockName]) {
                acc[stock.stockName] = [];
            }
            acc[stock.stockName].push(stock);
            return acc;
        }, {});

        let bestStock = null;
        let maxChangePercent = -Infinity;

        Object.values(groupedStocks).forEach((stockGroup) => {
            const sortedStockGroup = stockGroup.sort((a, b) => a.date - b.date);
            const startValue = sortedStockGroup[0].value;
            const endValue = sortedStockGroup[sortedStockGroup.length - 1].value;
            const changePercent = ((endValue - startValue) / startValue) * 100;

            if (changePercent > maxChangePercent) {
                maxChangePercent = changePercent;
                bestStock = {
                    stockName: stockGroup[0].stockName,
                    startValue,
                    endValue,
                    changePercent,
                };
            }
        });

        //console.log(bestStock)
        return bestStock;
    };

    return (
        <div style={{padding: '50px'}}>
            {bestStock?.stockName && (
                <>
                    <h2 style={{color: 'grey', textAlign: 'center'}}>Stock of the Week</h2>
                    <StockSimpleLineChart specificStockName={bestStock.stockName} days={7} />
                </>
            )}
        </div>
    );
    
}

export default WeeklyHighlites