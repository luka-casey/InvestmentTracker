import React, { useState } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/FirebaseService/fireBaseService'; // Import your Firebase config
import StockSimpleLineChart from '../components/StockSimpleLineChart.js';


const WeeklyHighlites = () => {

    const [bestStock, setBestStock] = useState();

    React.useEffect(() => {

        fetchBestStockOfWeek();

    }, []);


    const fetchBestStockOfWeek = async () => {
        const stocks = await fetchAndFormatStockData();

        const bestStock = getBestPerformingStockOfWeek(stocks);

        setBestStock(bestStock);
    }

    const fetchAndFormatStockData = async () => {
        const stocksCollection = collection(db, 'stocks');
        const querySnapshot = await getDocs(stocksCollection);

        const now = new Date();

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);

        return querySnapshot.docs
            .map((doc) => {
                const stock = doc.data();
                const date = stock.dateTime.toDate();

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
        <div>
            <h1>Best Stock this Week</h1>
            {bestStock?.stockName && (
                <>
                    <h2>{bestStock.stockName}</h2>
                    <StockSimpleLineChart specificStockName={bestStock.stockName} />
                </>
            )}
        </div>
    );
    
}

export default WeeklyHighlites