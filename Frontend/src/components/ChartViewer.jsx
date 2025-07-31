import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';

const ChartViewer = ({ chartType, chartData, collectionName }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,

        indexAxis: chartType === 'bar' ? 'y' : 'x',
        plugins: {
            legend: {
                position: chartType === 'pie' ? 'top' : 'bottom',
            },
            title: {
                display: true,
                text: chartType === 'bar'
                    ? `Top 10 Revenue Growth for "${collectionName}"`
                    : `Top 8 Revenue Distribution for "${collectionName}"`,
                font: { size: 16 }
            },
        },
        scales: chartType === 'bar' ? {
            x: {
                title: {
                    display: true,
                    text: 'Revenue Growth (Q4 - Q3)'
                }
            },
            y: {
                ticks: {
                    autoSkip: false
                }
            }
        } : {}
    };

    if (!chartData) return <div className="text-center p-10">Loading Chart Data...</div>;

    return (
        <div className="relative h-[500px] w-full flex items-center justify-center">
            {chartType === 'bar' ? <Bar options={options} data={chartData} /> : <Pie options={options} data={chartData} />}
        </div>
    );
};

export default ChartViewer;
