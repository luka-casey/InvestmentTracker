import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { db } from '../services/FirebaseService/fireBaseService'; // Import your Firebase config

const originalInvestments = {
    Ethereum: { cost: 3000, units: 0.6238 },
    Tesla: { cost: 2642.13, units: 5 },
    "Global X Physical Gold": { cost: 1553.6, units: 47 },
    Redox: { cost: 2478.58, units: 772 },
    Freelancer: { cost: 1096.67, units: 6451 }
};

const fetchAndFormatStockData = async (specificStockName, days) => {
    const stocksCollection = collection(db, 'stocks');
    const querySnapshot = await getDocs(stocksCollection);
    const formattedStocks = [];
    
    const now = new Date();
    const pastDate = new Date();
    pastDate.setDate(now.getDate() - days);

    querySnapshot.docs.forEach((doc) => {
        const stock = doc.data();
        const stockDate = stock.dateTime.toDate();

        if (stockDate < pastDate || stockDate > now) {
            return;
        }

        const formattedDate = stock.dateTime.toDate().toLocaleDateString('en-US', {
            year: '2-digit',
            month: 'short',
            day: 'numeric',
        });

        const originalInvestment = originalInvestments[stock.name];
        const currentValue = stock.price * stock.units;
        const profitOrLoss = originalInvestment
            ? currentValue - originalInvestment.cost
            : 0;

        const formattedStock = {
            dateTime: formattedDate,
            profitOrLoss,
            originalDate: stockDate,
            stockId: stock.id,
            stockName: stock.name,
        };

        if (specificStockName === "none" || specificStockName === formattedStock.stockName.toString()) {
            formattedStocks.push(formattedStock);
        }
    });

    return formattedStocks;
};

const groupStocksByDateAndAggregateValues = (data) => {
    const groupedData = {};

    data.forEach((stock) => {
        const { dateTime, stockName, profitOrLoss, originalDate } = stock;

        if (!groupedData[dateTime]) {
            groupedData[dateTime] = {};
        }

        if (!groupedData[dateTime][stockName] || groupedData[dateTime][stockName].originalDate < originalDate) {
            groupedData[dateTime][stockName] = { profitOrLoss, originalDate };
        }
    });

    return Object.keys(groupedData).map(dateKey => ({
        dateTime: dateKey,
        profitOrLoss: Object.values(groupedData[dateKey]).reduce((acc, stock) => acc + stock.profitOrLoss, 0),
        originalDate: new Date(dateKey),
    })).sort((a, b) => a.originalDate - b.originalDate);
};

const calculateDynamicYAxisDomain = (data) => {
    if (data.length === 0) return [-10000, 10000];

    const minValue = Math.min(...data.map(item => item.profitOrLoss));
    const maxValue = Math.max(...data.map(item => item.profitOrLoss));
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

const StockLineChart = ({ specificStockName, days }) => {
    const [stockData, setStockData] = useState([]);
    const [yAxisDomain, setYAxisDomain] = useState([0, 10000]);
    const [title, setTitle] = useState("");

    useEffect(() => {
        const fetchAndProcessStockData = async () => {
            const rawData = await fetchAndFormatStockData(specificStockName, days);
            const aggregatedData = groupStocksByDateAndAggregateValues(rawData);
            const yAxisRange = calculateDynamicYAxisDomain(aggregatedData);

            if (specificStockName === "none") {
                setTitle("All Time Change");
            } else {
                setTitle(specificStockName);
            }

            setStockData(aggregatedData);
            setYAxisDomain(yAxisRange);
        };

        fetchAndProcessStockData();
    }, [specificStockName, days]); // Re-run effect when specificStockName or days changes

    return (
        <div>
            <h2 className='pillsHeading'>{title}</h2>
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
                <Tooltip formatter={(value) => [`Total Value: $${value.toFixed(2)}`]} />
                <Line type="monotone" dataKey="profitOrLoss" stroke="#82ca9d" />
            </LineChart>
        </div>
    );
};

export default StockLineChart;