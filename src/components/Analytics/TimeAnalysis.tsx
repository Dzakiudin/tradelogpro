import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import type { Trade } from '../../types';
import { formatCurrency } from '../../utils';
import { Clock, TrendingUp, AlertTriangle } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TimeAnalysisProps {
    trades: Trade[];
    currency: string;
}

export const TimeAnalysis: React.FC<TimeAnalysisProps> = ({ trades, currency }) => {
    const { hourlyStats, sessions, bestSession, bestHour } = useMemo(() => {
        const hStats = Array.from({ length: 24 }).map((_, i) => ({ hour: i, pnl: 0, trades: 0, wins: 0 }));
        
        const sess = {
            Asia: { name: 'Asia (Tokyo)', start: 6, end: 13, trades: 0, wins: 0, pnl: 0, totalRR: 0, icon: '🌏' },
            London: { name: 'London', start: 14, end: 18, trades: 0, wins: 0, pnl: 0, totalRR: 0, icon: '🏰' },
            NewYork: { name: 'New York', start: 19, end: 5, trades: 0, wins: 0, pnl: 0, totalRR: 0, icon: '🗽' },
        };

        trades.forEach(t => {
            if (!t.createdAt) return;
            const d = t.createdAt.toDate();
            const h = d.getHours();
            
            const isWin = t.outcome === 'Profit';
            const amount = t.amount || 0;
            const net = isWin ? amount : (t.outcome === 'Loss' ? -amount : 0);
            
            // Hourly
            hStats[h].trades += 1;
            hStats[h].pnl += net;
            if (isWin) hStats[h].wins += 1;
            
            // Session
            let sessionKey = '';
            if (h >= 6 && h <= 13) sessionKey = 'Asia';
            else if (h >= 14 && h <= 18) sessionKey = 'London';
            else if (h >= 19 || h <= 5) sessionKey = 'NewYork';
            
            if (sessionKey) {
                const key = sessionKey as keyof typeof sess;
                sess[key].trades += 1;
                sess[key].pnl += net;
                if (isWin) sess[key].wins += 1;
                sess[key].totalRR += (t.rr || 0);
            }
        });

        const validSessions = Object.values(sess).filter(s => s.trades > 0);
        // Best session by win rate, then PNL
        const bestSess = validSessions.sort((a, b) => {
            const wrA = a.wins / a.trades;
            const wrB = b.wins / b.trades;
            return wrB - wrA || b.pnl - a.pnl;
        })[0];

        const validHours = hStats.filter(s => s.trades > 0);
        const bestHr = validHours.sort((a, b) => {
            const wrA = a.wins / a.trades;
            const wrB = b.wins / b.trades;
            return wrB - wrA || b.pnl - a.pnl;
        })[0];

        return { hourlyStats: hStats, sessions: sess, bestSession: bestSess, bestHour: bestHr };
    }, [trades]);

    // Chart Setup
    const data = {
        labels: hourlyStats.map(s => `${s.hour.toString().padStart(2, '0')}:00`),
        datasets: [{
            label: 'Net P/L per Hour',
            data: hourlyStats.map(s => s.pnl),
            backgroundColor: hourlyStats.map(s => s.pnl >= 0 ? '#CCFF00' : '#FF0055'),
            borderRadius: 2,
            borderSkipped: false,
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#94a3b8',
                bodyColor: '#fff',
                bodyFont: { weight: 'bold' as const, size: 13 },
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: (context: any) => ` P/L: ${formatCurrency(Math.abs(context.parsed.y), currency)}`
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { size: 10, weight: 'bold' as const } }
            },
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: {
                    color: '#64748b',
                    font: { size: 10, weight: 'bold' as const },
                    callback: (value: any) => value !== 0 ? (value >= 1000 || value <= -1000 ? `${value / 1000}k` : value) : '0'
                },
                border: { display: false }
            }
        }
    };

    if (trades.length === 0) {
        return (
            <div className="bg-surface-container p-6 rounded-sm border-none text-center flex flex-col items-center justify-center min-h-[200px]">
                <Clock className="w-12 h-12 text-slate-700 mb-4" />
                <p className="text-slate-500 font-label font-bold uppercase tracking-widest text-xs">Belum ada data waktu</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Insights Banner */}
            {bestSession && (
                <div className="glass-panel p-6 rounded-sm border-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-white font-headline font-black text-xl flex items-center gap-2 mb-1 uppercase tracking-widest">
                                <TrendingUp className="w-6 h-6 text-primary" />
                                WAKTU OPTIMAL: SESI {bestSession.name}
                            </h3>
                            <p className="text-slate-400 font-body text-sm font-medium leading-relaxed max-w-lg">
                                Historis menunjukkan sesi {bestSession.name} memberikan win rate tertinggi 
                                <strong className="text-white ml-1">({Math.round((bestSession.wins/bestSession.trades)*100)}%)</strong>. 
                                {bestHour && ` Jam paling profitable jatuh pada ${bestHour.hour.toString().padStart(2, '0')}:00.`}
                            </p>
                        </div>
                        <div className="text-right shrink-0">
                            <span className="text-3xl drop-shadow-lg" title={bestSession.name}>{bestSession.icon}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Session Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.values(sessions).map((sess, idx) => {
                    const wr = sess.trades > 0 ? Math.round((sess.wins / sess.trades) * 100) : 0;
                    const avgRR = sess.trades > 0 ? (sess.totalRR / sess.trades).toFixed(1) : 0;
                    
                    return (
                        <div key={idx} className="bg-surface-container-low p-5 rounded-sm border-none shadow-sm hover:bg-surface-container transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-headline font-black text-white text-sm uppercase tracking-widest flex items-center gap-2">
                                    <span className="text-xl drop-shadow-sm">{sess.icon}</span> {sess.name}
                                </span>
                                <span className="text-xs font-label font-bold text-slate-500 uppercase tracking-widest">
                                    {sess.start.toString().padStart(2,'0')}:00 - {sess.end.toString().padStart(2,'0')}:59
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div>
                                    <p className="text-[10px] font-label text-slate-500 uppercase tracking-widest font-bold mb-1">Win Rate</p>
                                    <p className={`text-xl font-headline font-black ${wr >= 50 ? 'text-success' : 'text-slate-300'}`}>{wr}%</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-label text-slate-500 uppercase tracking-widest font-bold mb-1">Net P/L</p>
                                    <p className={`text-xl font-headline font-black ${sess.pnl > 0 ? 'text-success' : (sess.pnl < 0 ? 'text-danger' : 'text-slate-300')}`}>
                                        {sess.pnl > 0 ? '+' : (sess.pnl < 0 ? '-' : '')}{formatCurrency(Math.abs(sess.pnl), currency)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-label text-slate-500 uppercase tracking-widest font-bold mb-1">Trades</p>
                                    <p className="text-sm font-headline font-black text-white">{sess.trades}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-label text-slate-500 uppercase tracking-widest font-bold mb-1">Avg R:R</p>
                                    <p className="text-sm font-headline font-black text-white">1:{avgRR}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* History Bar Chart */}
            <div className="bg-surface-container-low p-6 rounded-sm border-none shadow-sm">
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-white font-headline font-black text-lg tracking-[0.1em] flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" /> HISTORI WAKTU
                        </h3>
                        <p className="text-slate-500 text-xs font-label font-bold uppercase tracking-widest mt-1">P/L by Hour (Local Time)</p>
                    </div>
                </div>
                
                <div className="w-full h-[250px] relative">
                    <Bar data={data} options={options} />
                </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-danger/5 border-none rounded-sm">
                <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                <p className="text-xs font-body font-medium text-danger/80 leading-relaxed">
                    <strong>Catatan:</strong> Analisis waktu menggunakan local time Anda saat transaksi disimpan. 
                    Hindari sesi dengan <span className="text-white font-bold">hasil negatif berulang</span> untuk menjaga ekuitas.
                </p>
            </div>
        </div>
    );
};
