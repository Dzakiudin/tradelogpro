import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { Trade } from '../../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface WinRateChartProps {
    trades: Trade[];
}

export const WinRateChart: React.FC<WinRateChartProps> = ({ trades }) => {
    const outcomes = { Profit: 0, Loss: 0, BE: 0 };
    trades.forEach(t => {
        if (outcomes[t.outcome] !== undefined) {
            outcomes[t.outcome]++;
        }
    });

    const data = {
        labels: ['Win', 'Loss', 'BE'],
        datasets: [{
            data: [outcomes.Profit, outcomes.Loss, outcomes.BE],
            backgroundColor: [
                '#CCFF00', // Success
                '#FF0055', // Danger
                '#334155', // Neutral
            ],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '85%',
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    font: { size: 11, weight: 'bold' as const, family: 'Inter' },
                    usePointStyle: true,
                    padding: 20,
                    color: '#94a3b8' // slate-400
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                bodyFont: { weight: 'bold' as const },
                padding: 12,
                cornerRadius: 8,
            }
        }
    };

    const total = outcomes.Profit + outcomes.Loss + outcomes.BE;
    const winRate = total > 0 ? Math.round((outcomes.Profit / total) * 100) : 0;

    return (
        <div className="h-full min-h-[300px] bg-surface-container-low p-6 rounded-sm border-none shadow-sm flex flex-col items-center justify-center relative">
            <h3 className="absolute top-6 left-6 text-white font-headline font-black text-lg tracking-[0.1em] uppercase">Win Ratio</h3>

            <div className="relative w-48 h-48 mt-8">
                <Doughnut data={data} options={options} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-headline font-black text-white">{winRate}%</span>
                    <span className="text-[10px] uppercase font-label font-bold text-slate-500 tracking-widest mt-1">Win Rate</span>
                </div>
            </div>
        </div>
    );
};
