import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, TrendingUp, TrendingDown, Flame, Target, BarChart3, Clock } from 'lucide-react';
import type { Trade } from '../../types';
import { formatCurrency } from '../../utils';

interface TradingCalendarProps {
    trades: Trade[];
    currency: string;
}

export const TradingCalendar: React.FC<TradingCalendarProps> = ({ trades, currency }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    const dailyPnL: Record<number, number> = {};
    let monthlyProfit = 0;

    // Filter trades for current month
    const monthTrades = useMemo(() => {
        return trades.filter(t => {
            if (!t.createdAt) return false;
            const d = t.createdAt.toDate();
            return d.getMonth() === month && d.getFullYear() === year;
        }).sort((a, b) => {
            const da = a.createdAt?.toDate?.() ?? new Date(0);
            const db = b.createdAt?.toDate?.() ?? new Date(0);
            return db.getTime() - da.getTime();
        });
    }, [trades, month, year]);

    monthTrades.forEach(t => {
        if (!t.createdAt) return;
        const d = t.createdAt.toDate();
        const k = d.getDate();
        const amount = t.outcome === 'Profit' ? t.amount : (t.outcome === 'Loss' ? -t.amount : 0);
        dailyPnL[k] = (dailyPnL[k] || 0) + amount;
        monthlyProfit += amount;
    });

    // === Monthly Stats ===
    const monthlyStats = useMemo(() => {
        const total = monthTrades.length;
        const wins = monthTrades.filter(t => t.outcome === 'Profit').length;
        const losses = monthTrades.filter(t => t.outcome === 'Loss').length;
        const winRate = total > 0 ? (wins / total) * 100 : 0;

        const pnlEntries = Object.entries(dailyPnL).map(([day, pnl]) => ({ day: parseInt(day), pnl }));
        const bestDay = pnlEntries.length > 0 ? pnlEntries.reduce((a, b) => a.pnl > b.pnl ? a : b, pnlEntries[0]) : null;
        const worstDay = pnlEntries.length > 0 ? pnlEntries.reduce((a, b) => a.pnl < b.pnl ? a : b, pnlEntries[0]) : null;
        const avgPnl = total > 0 ? monthlyProfit / total : 0;

        return { total, wins, losses, winRate, bestDay, worstDay, avgPnl };
    }, [monthTrades, dailyPnL, monthlyProfit]);

    // === Streak Counter ===
    const streak = useMemo(() => {
        const sorted = [...monthTrades].sort((a, b) => {
            const da = a.createdAt?.toDate?.() ?? new Date(0);
            const db = b.createdAt?.toDate?.() ?? new Date(0);
            return db.getTime() - da.getTime();
        });

        if (sorted.length === 0) return { type: 'none' as const, count: 0 };

        const firstOutcome = sorted[0].outcome;
        let count = 0;
        for (const t of sorted) {
            if (t.outcome === firstOutcome) count++;
            else break;
        }
        return { type: firstOutcome as 'Profit' | 'Loss' | 'BE', count };
    }, [monthTrades]);

    // === Daily P&L Bar Chart Data ===
    const barChartData = useMemo(() => {
        const entries = [];
        for (let d = 1; d <= totalDays; d++) {
            if (dailyPnL[d] !== undefined) {
                entries.push({ day: d, pnl: dailyPnL[d] });
            }
        }
        const maxAbs = entries.length > 0 ? Math.max(...entries.map(e => Math.abs(e.pnl)), 1) : 1;
        return { entries, maxAbs };
    }, [dailyPnL, totalDays]);

    // Recent trades (top 5)
    const recentTrades = monthTrades.slice(0, 5);

    // Motivational quotes
    const quotes = [
        "Consistency is the key to trading mastery.",
        "Protect your capital, profits will follow.",
        "Plan the trade, trade the plan.",
        "Discipline over emotion, always.",
        "Small wins compound into big results.",
    ];
    const quote = quotes[month % quotes.length];

    return (
        <div className="space-y-6">
            {/* Calendar Grid */}
            <div className="bg-surface-container-low rounded-sm border-none shadow-sm p-6 h-fit flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-sm text-primary">
                            <CalendarIcon className="w-5 h-5 drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
                        </div>
                        <div>
                            <h2 className="font-headline font-black text-white text-lg tracking-[0.1em] uppercase">
                                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h2>
                            <p className={`text-xs font-label font-bold tracking-widest uppercase ${monthlyProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                                {monthlyProfit >= 0 ? '+' : ''}{formatCurrency(monthlyProfit, currency)}
                            </p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={prevMonth} className="p-2 bg-surface-container hover:bg-surface-container-highest rounded-sm text-slate-400 hover:text-white transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={nextMonth} className="p-2 bg-surface-container hover:bg-surface-container-highest rounded-sm text-slate-400 hover:text-white transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center mb-2">
                    {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
                        <div key={d} className="text-[10px] font-label font-bold text-slate-500 uppercase tracking-widest">{d}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1 md:gap-2 auto-rows-min">
                    {Array.from({ length: startDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="rounded-sm bg-transparent aspect-square"></div>
                    ))}

                    {Array.from({ length: totalDays }).map((_, i) => {
                        const day = i + 1;
                        const pl = dailyPnL[day] || 0;

                        let bgClass = "bg-surface-container hover:bg-surface-container-highest";
                        let textClass = "text-slate-400";

                        if (pl > 0) {
                            bgClass = "bg-success/10 hover:bg-success/20";
                            textClass = "text-success";
                        } else if (pl < 0) {
                            bgClass = "bg-danger/10 hover:bg-danger/20";
                            textClass = "text-danger";
                        }

                        return (
                            <div key={day} className={`rounded-sm border-none p-1 aspect-square flex flex-col justify-between transition-all ${bgClass} group relative overflow-hidden shadow-inner`}>
                                <span className={`text-[10px] font-label font-bold ${textClass}`}>{day}</span>

                                {pl !== 0 && (
                                    <span className={`text-[8px] md:text-[10px] font-headline font-black truncate w-full text-center ${textClass}`}>
                                        {pl > 0 ? '+' : ''}{Math.abs(pl) >= 1000000 ? (Math.abs(pl) / 1000000).toFixed(1) + 'M' : (Math.abs(pl) >= 1000 ? (Math.abs(pl) / 1000).toFixed(0) + 'k' : Math.abs(pl))}
                                    </span>
                                )}

                                <div className="absolute inset-0 bg-background/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-md">
                                    <span className="text-[10px] font-headline font-bold text-white tracking-widest uppercase">
                                        {formatCurrency(pl, currency)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-xs font-body font-medium text-slate-500 italic">"{quote}"</p>
                </div>
            </div>

            {/* Monthly Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    {
                        label: 'Total Trade',
                        value: monthlyStats.total.toString(),
                        sub: `${monthlyStats.wins}W / ${monthlyStats.losses}L`,
                        icon: Target,
                        color: 'text-primary',
                        bg: 'bg-primary/10',
                    },
                    {
                        label: 'Win Rate',
                        value: `${monthlyStats.winRate.toFixed(1)}%`,
                        sub: monthlyStats.winRate >= 50 ? 'Above avg' : 'Below avg',
                        icon: TrendingUp,
                        color: monthlyStats.winRate >= 50 ? 'text-success' : 'text-danger',
                        bg: monthlyStats.winRate >= 50 ? 'bg-success/10' : 'bg-danger/10',
                    },
                    {
                        label: 'Best Day',
                        value: monthlyStats.bestDay ? `Tgl ${monthlyStats.bestDay.day}` : '-',
                        sub: monthlyStats.bestDay ? formatCurrency(monthlyStats.bestDay.pnl, currency) : 'No data',
                        icon: TrendingUp,
                        color: 'text-success',
                        bg: 'bg-success/10',
                    },
                    {
                        label: 'Worst Day',
                        value: monthlyStats.worstDay ? `Tgl ${monthlyStats.worstDay.day}` : '-',
                        sub: monthlyStats.worstDay ? formatCurrency(monthlyStats.worstDay.pnl, currency) : 'No data',
                        icon: TrendingDown,
                        color: 'text-danger',
                        bg: 'bg-danger/10',
                    },
                ].map((stat, i) => (
                    <div key={i} className="bg-surface-container-low rounded-sm shadow-sm p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-label font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                            <div className={`p-1.5 ${stat.bg} rounded-sm`}>
                                <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                            </div>
                        </div>
                        <span className={`text-xl font-headline font-black ${stat.color} tracking-tight`}>{stat.value}</span>
                        <span className="text-[10px] font-label text-slate-500 tracking-wide">{stat.sub}</span>
                    </div>
                ))}
            </div>

            {/* Streak Counter + Daily P&L Bar Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Streak Counter */}
                <div className="bg-surface-container-low rounded-sm shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Flame className="w-4 h-4 text-amber-400" />
                        <h3 className="text-[10px] font-label font-bold text-slate-500 uppercase tracking-widest">Current Streak</h3>
                    </div>
                    {streak.type === 'none' ? (
                        <div className="text-center py-6">
                            <p className="text-slate-600 text-sm font-label">Belum ada trade bulan ini</p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                            <div className={`w-20 h-20 rounded-sm flex items-center justify-center ${streak.type === 'Profit' ? 'bg-success/10' : streak.type === 'Loss' ? 'bg-danger/10' : 'bg-slate-500/10'}`}>
                                <span className={`text-4xl font-headline font-black ${streak.type === 'Profit' ? 'text-success' : streak.type === 'Loss' ? 'text-danger' : 'text-slate-400'}`}>
                                    {streak.count}
                                </span>
                            </div>
                            <div>
                                <p className={`font-headline font-black text-lg tracking-tight ${streak.type === 'Profit' ? 'text-success' : streak.type === 'Loss' ? 'text-danger' : 'text-slate-400'}`}>
                                    {streak.type === 'Profit' ? '🔥 Winning Streak' : streak.type === 'Loss' ? '❄️ Losing Streak' : '⚖️ Break Even'}
                                </p>
                                <p className="text-[10px] font-label text-slate-500 tracking-widest uppercase mt-1">
                                    {streak.count} trade berturut-turut {streak.type === 'Profit' ? 'winning' : streak.type === 'Loss' ? 'losing' : 'BE'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Daily P&L Bar Chart */}
                <div className="bg-surface-container-low rounded-sm shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        <h3 className="text-[10px] font-label font-bold text-slate-500 uppercase tracking-widest">Daily P&L</h3>
                    </div>
                    {barChartData.entries.length === 0 ? (
                        <div className="text-center py-6">
                            <p className="text-slate-600 text-sm font-label">Belum ada data</p>
                        </div>
                    ) : (
                        <div className="flex items-end gap-[3px] h-28">
                            {barChartData.entries.map(entry => {
                                const heightPct = Math.max(10, (Math.abs(entry.pnl) / barChartData.maxAbs) * 100);
                                const isPositive = entry.pnl >= 0;
                                return (
                                    <div key={entry.day} className="flex-1 flex flex-col items-center gap-1 group relative">
                                        <div
                                            className={`w-full min-w-[4px] max-w-[24px] rounded-sm transition-all ${isPositive ? 'bg-success/60 group-hover:bg-success' : 'bg-danger/60 group-hover:bg-danger'}`}
                                            style={{ height: `${heightPct}%` }}
                                        />
                                        <span className="text-[7px] font-label text-slate-600">{entry.day}</span>

                                        {/* Tooltip */}
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-md px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-lg">
                                            <span className={`text-[9px] font-headline font-bold ${isPositive ? 'text-success' : 'text-danger'}`}>
                                                {isPositive ? '+' : ''}{formatCurrency(entry.pnl, currency)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Trades */}
            <div className="bg-surface-container-low rounded-sm shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-primary" />
                    <h3 className="text-[10px] font-label font-bold text-slate-500 uppercase tracking-widest">Trade Terbaru Bulan Ini</h3>
                </div>
                {recentTrades.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-slate-600 text-sm font-label">Belum ada trade bulan ini</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {recentTrades.map((trade) => {
                            const date = trade.createdAt?.toDate?.();
                            const dateStr = date ? date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-';

                            return (
                                <div key={trade.id} className="flex items-center justify-between p-3 bg-surface-container rounded-sm hover:bg-surface-container-highest transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-8 rounded-full ${trade.outcome === 'Profit' ? 'bg-success' : trade.outcome === 'Loss' ? 'bg-danger' : 'bg-slate-500'}`} />
                                        <div>
                                            <p className="text-sm font-headline font-bold text-white tracking-tight">{trade.asset}</p>
                                            <p className="text-[10px] font-label text-slate-500 tracking-wide">{dateStr} · {trade.type} · {trade.setup}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-headline font-black tracking-tight ${trade.outcome === 'Profit' ? 'text-success' : trade.outcome === 'Loss' ? 'text-danger' : 'text-slate-400'}`}>
                                            {trade.outcome === 'Profit' ? '+' : trade.outcome === 'Loss' ? '-' : ''}{formatCurrency(trade.amount, currency)}
                                        </p>
                                        <p className="text-[9px] font-label text-slate-600 uppercase tracking-widest">{trade.outcome}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
