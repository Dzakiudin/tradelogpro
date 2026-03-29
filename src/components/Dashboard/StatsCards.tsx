import React from 'react';
import { Activity, Award, Percent, DollarSign } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from 'chart.js';
import type { Trade } from '../../types';
import { formatCurrency } from '../../utils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

interface StatsCardsProps {
    trades: Trade[];
    currency: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ trades, currency }) => {
    // Calculations
    const totalTrades = trades.length;
    let netProfit = 0;
    let wins = 0;
    let grossProfit = 0;
    let grossLoss = 0;
    const balanceHistory: number[] = [0];

    trades.forEach(t => {
        const amt = t.amount || 0;
        if (t.outcome === 'Profit') {
            netProfit += amt;
            grossProfit += amt;
            wins++;
        } else if (t.outcome === 'Loss') {
            netProfit -= amt;
            grossLoss += amt;
        }
        balanceHistory.push(netProfit);
    });

    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : (grossProfit > 0 ? grossProfit : 0);

    // Sparkline Options
    const sparklineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } },
        elements: { point: { radius: 0 }, line: { borderWidth: 2, tension: 0.4 } }
    };

    // Helper for sparkline data
    const getSparklineData = (color: string, data: number[]) => ({
        labels: data.map((_, i) => i),
        datasets: [{
            data,
            borderColor: color,
            backgroundColor: 'transparent',
            fill: false,
        }]
    });

    const cards = [
        {
            label: 'Net Profit',
            value: `${netProfit >= 0 ? '+' : '-'}${formatCurrency(Math.abs(netProfit), currency)}`,
            icon: DollarSign,
            color: netProfit >= 0 ? '#10B981' : '#EF4444',
            bg: netProfit >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10',
            trend: balanceHistory.slice(-10), // Last 10 trades trend
            subtext: 'Total PnL'
        },
        {
            label: 'Win Rate',
            value: `${winRate.toFixed(1)}%`,
            icon: Percent,
            color: '#3B82F6',
            bg: 'bg-blue-500/10',
            trend: trades.slice(-10).map(t => t.outcome === 'Profit' ? 1 : 0), // Win/Loss binary trend
            subtext: `${wins} Wins / ${totalTrades - wins} Loss`
        },
        {
            label: 'Profit Factor',
            value: profitFactor.toFixed(2),
            icon: Activity,
            color: '#8B5CF6',
            bg: 'bg-purple-500/10',
            trend: [1, 1.5, profitFactor], // Dummy trend for PF (hard to track historically easily without heavy compute)
            subtext: 'Gross Profit / Gross Loss'
        },
        {
            label: 'Total Trades',
            value: totalTrades.toString(),
            icon: Award,
            color: '#F59E0B',
            bg: 'bg-amber-500/10',
            trend: trades.map((_, i) => i).slice(-10), // Volume trend
            subtext: 'Lifetime Trades'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card, idx) => (
                <div key={idx} className="bg-surface-container-low p-6 md:p-8 rounded-sm shadow-sm transition-colors hover:bg-surface-container group flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-8">
                        <span className="font-label text-[10px] uppercase tracking-[0.2em] text-slate-500">{card.label}</span>
                        <card.icon className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="font-headline text-4xl lg:text-5xl font-bold tracking-tighter mb-2" style={{ color: card.label === 'Net Profit' ? card.color : 'white' }}>
                        {card.value}
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-[10px] font-label uppercase tracking-widest text-slate-500">
                            <span>{card.subtext}</span>
                        </div>
                        <div className="h-8 w-1/3 opacity-50 group-hover:opacity-100 transition-opacity">
                            <Line data={getSparklineData(card.color, card.trend)} options={sparklineOptions} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
