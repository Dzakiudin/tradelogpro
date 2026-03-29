import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import type { Trade } from '../../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface GrowthChartProps {
    trades: Trade[];
}

export const GrowthChart: React.FC<GrowthChartProps> = ({ trades }) => {
    // Sort trades by date
    const sortedTrades = [...trades].sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));

    let balance = 0;
    const dataPoints = sortedTrades.map(t => {
        const amount = t.amount || 0;
        if (t.outcome === 'Profit') balance += amount;
        else if (t.outcome === 'Loss') balance -= amount;
        return balance;
    });

    // Add initial 0 balance
    const labels = ['Start', ...sortedTrades.map((_, i) => `T${i + 1}`)];
    const dataWithStart = [0, ...dataPoints];

    const data = {
        labels: labels,
        datasets: [{
            label: 'Account Balance',
            data: dataWithStart,
            borderColor: '#00E5FF', // primary-aqua
            backgroundColor: (context: any) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, 'rgba(0, 229, 255, 0.3)');
                gradient.addColorStop(1, 'rgba(0, 229, 255, 0.0)');
                return gradient;
            },
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointBackgroundColor: '#00E5FF',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)', // slate-900
                titleColor: '#94a3b8', // slate-400
                bodyColor: '#fff',
                bodyFont: { weight: 'bold' as const, size: 14 },
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    label: (context: any) => ` Balance: ${context.parsed.y}`
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { display: false }
            },
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: {
                    color: '#64748b', // slate-500
                    font: { size: 10, weight: 'bold' as const },
                    callback: (value: any) => value >= 1000 ? `${value / 1000}k` : value
                },
                border: { display: false }
            }
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
    };

    return (
        <div className="w-full h-[300px] md:h-[400px] bg-surface-container-low p-6 rounded-sm border-none shadow-sm relative overflow-hidden">
            <div className="mb-6">
                <h3 className="text-white font-headline font-black text-lg tracking-[0.1em] uppercase">Portfolio Growth</h3>
                <p className="text-slate-500 text-xs font-label font-bold uppercase tracking-widest mt-1">Performance Curve</p>
            </div>
            <div className="h-[230px] md:h-[300px]">
                <Line data={data} options={options} />
            </div>
        </div>
    );
};
