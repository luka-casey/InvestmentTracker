import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { db } from '../services/fireBaseService'; // Import your Firebase config

const fetchAndFormatStockData = async () => {
    const stocksCollection = collection(db, 'stocks');
    const querySnapshot = await getDocs(stocksCollection);

    return querySnapshot.docs.map(doc => {
        const stock = doc.data();
        const formattedDate = stock.dateTime.toDate().toLocaleDateString('en-US', {
            year: '2-digit',
            month: 'short',
            day: 'numeric',
        });

        return {
            dateTime: formattedDate,
            totalValue: stock.price * stock.units,
            originalDate: stock.dateTime.toDate(),
            stockId: stock.id,
            stockName: stock.name,
        };
    });
};

const groupStocksByDateAndAggregateValues = (data) => {
    const groupedData = {};

    data.sort((a, b) => a.originalDate - b.originalDate).forEach(stock => {
        const dateKey = stock.dateTime;
        const stockKey = stock.stockName;

        if (!groupedData[dateKey]) {
            groupedData[dateKey] = {};
        }

        if (!groupedData[dateKey][stockKey]) {
            groupedData[dateKey][stockKey] = stock.totalValue;
        }
    });

    return Object.keys(groupedData).map(dateKey => ({
        dateTime: dateKey,
        totalValue: Object.values(groupedData[dateKey]).reduce((acc, value) => acc + value, 0),
        originalDate: new Date(dateKey),
    }));
};

const calculateDynamicYAxisDomain = (data) => {
    if (data.length === 0) return [0, 10000];

    const minValue = Math.min(...data.map(item => item.totalValue));
    const maxValue = Math.max(...data.map(item => item.totalValue));
    const padding = 100;

    return [
        Math.floor(minValue / padding) * padding,
        Math.ceil(maxValue / padding) * padding,
    ];
};

const createYAxisTicks = (min, max, step = 100) => {
    const ticks = [];
    for (let i = min; i <= max; i += step) {
        ticks.push(i);
    }
    return ticks;
};

const StockLineChart = () => {
    const [stockData, setStockData] = useState([]);
    const [yAxisDomain, setYAxisDomain] = useState([0, 10000]);

    useEffect(() => {
        const fetchAndProcessStockData = async () => {
            const rawData = await fetchAndFormatStockData();
            const aggregatedData = groupStocksByDateAndAggregateValues(rawData);
            const yAxisRange = calculateDynamicYAxisDomain(aggregatedData);

            setStockData(aggregatedData);
            setYAxisDomain(yAxisRange);
        };

        fetchAndProcessStockData();
    }, []);

    return (
        <div>
            <h2 className='pillsHeading'>Total Worth</h2>
            <LineChart width={1000} height={250} data={stockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="dateTime"
                    angle={0}
                    textAnchor="end"
                    interval={0}
                    fontSize="10px"
                />
                <YAxis
                    domain={yAxisDomain}
                    ticks={createYAxisTicks(yAxisDomain[0], yAxisDomain[1])}
                    fontSize="10px"
                />
                <Tooltip
                    formatter={(value) => [`Total Value: $${value.toFixed(2)}`]}
                />
                <Line type="monotone" dataKey="totalValue" stroke="#82ca9d" />
            </LineChart>
        </div>
    );
};

export default StockLineChart;
