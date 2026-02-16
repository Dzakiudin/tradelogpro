import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
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
    // Adjusted for Monday start (0=Mon, 6=Sun) if needed, but keeping standard for now (0=Sun)
    // To make Monday start: (startDay + 6) % 7

    const dailyPnL: Record<number, number> = {};
    let monthlyProfit = 0;

    trades.forEach(t => {
        if (!t.createdAt) return;
        const d = t.createdAt.toDate();
        if (d.getMonth() === month && d.getFullYear() === year) {
            const k = d.getDate();
            const amount = t.outcome === 'Profit' ? t.amount : (t.outcome === 'Loss' ? -t.amount : 0);
            dailyPnL[k] = (dailyPnL[k] || 0) + amount;
            monthlyProfit += amount;
        }
    });

    return (
        <div className="bg-slate-900 rounded-3xl border border-white/5 p-6 h-fit flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                        <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="font-black text-white text-lg tracking-tight">
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h2>
                        <p className={`text-xs font-bold tracking-widest ${monthlyProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {monthlyProfit >= 0 ? '+' : ''}{formatCurrency(monthlyProfit, currency)}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button onClick={prevMonth} className="p-2 bg-surface hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextMonth} className="p-2 bg-surface hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center mb-2">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
                    <div key={d} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2 auto-rows-min">
                {Array.from({ length: startDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="rounded-xl bg-white/0 border border-white/0 aspect-square"></div>
                ))}

                {Array.from({ length: totalDays }).map((_, i) => {
                    const day = i + 1;
                    const pl = dailyPnL[day] || 0;

                    // Heatmap color logic
                    let bgClass = "bg-surface hover:bg-white/5";
                    let textClass = "text-slate-400";

                    if (pl > 0) {
                        bgClass = "bg-emerald-500/20 border-emerald-500/30 hover:bg-emerald-500/30";
                        textClass = "text-emerald-400";
                    } else if (pl < 0) {
                        bgClass = "bg-rose-500/20 border-rose-500/30 hover:bg-rose-500/30";
                        textClass = "text-rose-400";
                    }

                    return (
                        <div key={day} className={`rounded-xl border border-white/5 p-1 aspect-square flex flex-col justify-between transition-all ${bgClass} group relative overflow-hidden`}>
                            <span className={`text-[10px] font-bold ${textClass}`}>{day}</span>

                            {pl !== 0 && (
                                <span className={`text-[8px] md:text-[10px] font-black truncate w-full text-center ${textClass}`}>
                                    {pl > 0 ? '+' : ''}{Math.abs(pl) >= 1000000 ? (Math.abs(pl) / 1000000).toFixed(1) + 'M' : (Math.abs(pl) >= 1000 ? (Math.abs(pl) / 1000).toFixed(0) + 'k' : Math.abs(pl))}
                                </span>
                            )}

                            {/* Hover Tooltip */}
                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm">
                                <span className="text-[10px] font-bold text-white">
                                    {formatCurrency(pl, currency)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer - Motivational Quote or Daily Insight */}
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-xs font-medium text-slate-500 italic">"Consistency is the key to trading mastery."</p>
            </div>
        </div>
    );
};
