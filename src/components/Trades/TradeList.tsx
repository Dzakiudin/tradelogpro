import React, { useState } from 'react';
import { Trash2, Search, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Trade } from '../../types';
import { formatCurrency } from '../../utils';

interface TradeListProps {
    trades: Trade[];
    onDelete: (id: string) => void;
    currency: string;
    onAddTrade?: () => void; // Keeping in interface for now to avoid breaking App.tsx if I don't update it immediately, but ideally remove.
}

export const TradeList: React.FC<TradeListProps> = ({ trades, onDelete, currency }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTrades = trades.filter(t =>
        (t.asset || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.strategy || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.setup || "").toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

    // Helper for mood emoji
    const getMoodEmoji = (mood: string) => {
        const map: Record<string, string> = { 'Calm': '🧘', 'Patient': '⏳', 'Greedy': '🤑', 'Fear': '😨', 'FOMO': '🏃' };
        return map[mood] || '😐';
    };

    // Helper for Setup badge color
    const getSetupColor = (setup: string) => {
        const map: Record<string, string> = {
            'Breakout': 'bg-orange-500/20 text-orange-400',
            'Retest': 'bg-blue-500/20 text-blue-400',
            'Pullback': 'bg-purple-500/20 text-purple-400',
            'Scalping': 'bg-pink-500/20 text-pink-400',
            'Trend Follow': 'bg-emerald-500/20 text-emerald-400'
        };
        return map[setup] || 'bg-slate-700 text-slate-400';
    };

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            {/* Search Bar & Actions */}
            {/* Search Bar & Actions */}
            <div className="flex items-center gap-4 bg-surface/50 backdrop-blur-xl p-2 rounded-2xl border border-white/5 relative">
                <Search className="w-5 h-5 text-slate-400 ml-3" />
                <input
                    type="text"
                    placeholder="Search asset, strategy, or setup..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none outline-none text-white overflow-hidden w-full placeholder:text-slate-500 font-medium"
                />

                <button className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-colors">
                    <Filter className="w-5 h-5" />
                </button>
            </div>

            {filteredTrades.length === 0 ? (
                <div className="text-center py-20 opacity-50">
                    <p className="text-slate-400 font-bold">No trades found</p>
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full border-separate border-spacing-y-3">
                            <thead>
                                <tr className="text-left text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    <th className="px-6 py-2">Date</th>
                                    <th className="px-6 py-2">Pair</th>
                                    <th className="px-6 py-2">Setup</th>
                                    <th className="px-6 py-2">Side</th>
                                    <th className="px-6 py-2 text-right">P/L</th>
                                    <th className="px-6 py-2 text-center">R:R</th>
                                    <th className="px-6 py-2 text-center">Mood</th>
                                    <th className="px-6 py-2 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTrades.map((t) => (
                                    <tr key={t.id} className="bg-surface hover:bg-surface-light/50 transition-all duration-300 group shadow-lg shadow-black/5 hover:shadow-black/20 hover:-translate-y-1">
                                        <td className="px-6 py-4 rounded-l-2xl text-xs font-mono text-slate-400 border-y border-l border-white/5 group-hover:border-white/10">
                                            {t.createdAt ? new Date(t.createdAt.seconds * 1000).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : '...'}
                                        </td>
                                        <td className="px-6 py-4 font-black text-white border-y border-white/5 group-hover:border-white/10">
                                            {t.asset}
                                        </td>
                                        <td className="px-6 py-4 border-y border-white/5 group-hover:border-white/10">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${getSetupColor(t.setup)}`}>
                                                {t.setup}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 border-y border-white/5 group-hover:border-white/10">
                                            <span className={`flex items-center gap-1 text-xs font-black ${t.type === 'Long' ? 'text-blue-400' : 'text-orange-400'}`}>
                                                {t.type === 'Long' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                                {t.type}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-black border-y border-white/5 group-hover:border-white/10 ${t.outcome === 'Profit' ? 'text-emerald-400 text-glow' : (t.outcome === 'Loss' ? 'text-rose-400' : 'text-slate-400')}`}>
                                            {t.outcome === 'Profit' ? '+' : (t.outcome === 'Loss' ? '-' : '')}{formatCurrency(Math.abs(t.amount || 0), currency)}
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-slate-400 border-y border-white/5 group-hover:border-white/10">
                                            1:{t.rr}
                                        </td>
                                        <td className="px-6 py-4 text-center text-lg border-y border-white/5 group-hover:border-white/10">
                                            {getMoodEmoji(t.mood)}
                                        </td>
                                        <td className="px-6 py-4 text-right rounded-r-2xl border-y border-r border-white/5 group-hover:border-white/10">
                                            <button
                                                onClick={() => onDelete(t.id)}
                                                className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-3">
                        {filteredTrades.map((t) => (
                            <div key={t.id} className="bg-surface/80 backdrop-blur-md p-5 rounded-3xl border border-white/5 active:scale-[0.98] transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${t.type === 'Long' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                            {t.type === 'Long' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-white text-base">{t.asset}</h4>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                {t.createdAt ? new Date(t.createdAt.seconds * 1000).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : '...'} • {t.setup}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-black text-base ${t.outcome === 'Profit' ? 'text-emerald-400' : (t.outcome === 'Loss' ? 'text-rose-400' : 'text-slate-400')}`}>
                                            {t.outcome === 'Profit' ? '+' : (t.outcome === 'Loss' ? '-' : '')}{formatCurrency(Math.abs(t.amount || 0), currency)}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-500">1:{t.rr}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg" title={t.mood}>{getMoodEmoji(t.mood)}</span>
                                        <span className="text-xs font-medium text-slate-400 italic truncate max-w-[150px]">{t.strategy}</span>
                                    </div>
                                    <button
                                        onClick={() => onDelete(t.id)}
                                        className="p-2 text-slate-500 active:text-rose-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
