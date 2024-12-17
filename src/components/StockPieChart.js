import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const StockPieChart = ({ stocks }) => {
    const stockData = stocks.map(stock => ({
        name: stock.name,
        value: stock.units * parseFloat(stock.price),
    }));

    const COLORS = ['#607ff0', '#818181', '#e8db23', '#e83323', '#187fed'];

    // Custom label renderer for percentages
    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5; // Position the label halfway in the slice
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontSize: '12px' }}
            >
                {`${(percent * 100).toFixed(1)}%`}
            </text>
        );
    };

    return (
        <PieChart width={300} height={300}>
            <Pie
                data={stockData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={renderCustomLabel} // Use custom percentage labels
                labelLine={false} // Disable label lines
            >
                {stockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    );
};

export default StockPieChart;
