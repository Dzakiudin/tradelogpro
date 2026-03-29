import React, { useState } from 'react';
import { Trash2, Search, Filter, ArrowUpRight, ArrowDownRight, FileText, Download, Pencil, X, BarChart3 } from 'lucide-react';
import type { Trade } from '../../types';
import { formatCurrency } from '../../utils';
import { exportTradesToExcel, exportTradesToPDF } from '../../utils/exportUtils';
import { TradeDetailModal } from './TradeDetailModal';
import { ConfirmDialog } from '../Common/ConfirmDialog';

interface TradeListProps {
    trades: Trade[];
    onDelete: (id: string) => void;
    onEdit: (trade: Trade) => void;
    currency: string;
    onAddTrade?: () => void;
}

export const TradeList: React.FC<TradeListProps> = ({ trades, onDelete, onEdit, currency }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [showFilter, setShowFilter] = useState(false);
    const [filterOutcome, setFilterOutcome] = useState<string>('all');
    const [filterSetup, setFilterSetup] = useState<string>('all');
    const [filterSide, setFilterSide] = useState<string>('all');

    const filteredTrades = trades.filter(t => {
        const searchMatch = (t.asset || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (t.strategy || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (t.setup || "").toLowerCase().includes(searchTerm.toLowerCase());
        const outcomeMatch = filterOutcome === 'all' || t.outcome === filterOutcome;
        const setupMatch = filterSetup === 'all' || t.setup === filterSetup;
        const sideMatch = filterSide === 'all' || t.type === filterSide;
        return searchMatch && outcomeMatch && setupMatch && sideMatch;
    }).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

    const activeFilters = [filterOutcome, filterSetup, filterSide].filter(f => f !== 'all').length;

    const getMoodEmoji = (mood: string) => {
        const map: Record<string, string> = { 'Calm': '🧘', 'Patient': '⏳', 'Greedy': '🤑', 'Fear': '😨', 'FOMO': '🏃' };
        return map[mood] || '😐';
    };

    const getSetupColor = (setup: string) => {
        const map: Record<string, string> = {
            'Breakout': 'bg-orange-500/20 text-orange-400',
            'Retest': 'bg-blue-500/20 text-blue-400',
            'Pullback': 'bg-purple-500/20 text-purple-400',
            'Scalping': 'bg-pink-500/20 text-pink-400',
            'Trend Follow': 'bg-emerald-500/20 text-emerald-400',
            'Reversal': 'bg-rose-500/20 text-rose-400'
        };
        return map[setup] || 'bg-slate-700 text-slate-400';
    };

    const uniqueSetups = [...new Set(trades.map(t => t.setup))];

    return (
        <div className="space-y-6">
            {/* Search & Export Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                <div className="flex-1 flex items-center gap-4 bg-surface-container-low p-2 rounded-sm border-none shadow-sm relative">
                    <Search className="w-5 h-5 text-slate-400 ml-3" />
                    <input
                        type="text"
                        placeholder="Search asset, strategy, or setup..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none text-white overflow-hidden w-full placeholder:text-slate-500 font-headline font-medium"
                    />
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className={`p-2 rounded-sm transition-colors relative ${showFilter || activeFilters > 0 ? 'bg-primary/20 text-primary' : 'bg-surface-container-highest text-slate-400 hover:text-white'}`}
                    >
                        <Filter className="w-5 h-5" />
                        {activeFilters > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[8px] font-label font-black text-background flex items-center justify-center">
                                {activeFilters}
                            </span>
                        )}
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => exportTradesToExcel(filteredTrades)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-success/10 hover:bg-success/20 text-success font-headline font-bold rounded-sm transition-colors border-none shadow-sm text-sm uppercase tracking-widest"
                    >
                        <Download className="w-4 h-4" /> Excel
                    </button>
                    <button
                        onClick={() => exportTradesToPDF(filteredTrades, currency)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-danger/10 hover:bg-danger/20 text-danger font-headline font-bold rounded-sm transition-colors border-none shadow-sm text-sm uppercase tracking-widest"
                    >
                        <FileText className="w-4 h-4" /> PDF
                    </button>
                </div>
            </div>

            {/* Filter Panel */}
            {showFilter && (
                <div className="bg-surface-container border-none shadow-lg rounded-sm p-4 space-y-4 animate-slide-up">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[10px] font-label font-black text-slate-500 uppercase tracking-widest">Filter</h4>
                        {activeFilters > 0 && (
                            <button
                                onClick={() => { setFilterOutcome('all'); setFilterSetup('all'); setFilterSide('all'); }}
                                className="text-[10px] font-label font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-widest"
                            >
                                <X className="w-3 h-3" /> Reset
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-[10px] font-label font-black text-slate-500 uppercase tracking-widest mb-1 block">Hasil</label>
                            <select
                                value={filterOutcome}
                                onChange={(e) => setFilterOutcome(e.target.value)}
                                className="w-full px-3 py-3 bg-surface-container-highest border-none shadow-inner rounded-sm text-white font-headline text-sm font-bold outline-none cursor-pointer appearance-none"
                            >
                                <option value="all">Semua</option>
                                <option value="Profit">Win ✅</option>
                                <option value="Loss">Loss ❌</option>
                                <option value="BE">B.E ⚖️</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-label font-black text-slate-500 uppercase tracking-widest mb-1 block">Setup</label>
                            <select
                                value={filterSetup}
                                onChange={(e) => setFilterSetup(e.target.value)}
                                className="w-full px-3 py-3 bg-surface-container-highest border-none shadow-inner rounded-sm text-white font-headline text-sm font-bold outline-none cursor-pointer appearance-none"
                            >
                                <option value="all">Semua</option>
                                {uniqueSetups.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-label font-black text-slate-500 uppercase tracking-widest mb-1 block">Side</label>
                            <select
                                value={filterSide}
                                onChange={(e) => setFilterSide(e.target.value)}
                                className="w-full px-3 py-3 bg-surface-container-highest border-none shadow-inner rounded-sm text-white font-headline text-sm font-bold outline-none cursor-pointer appearance-none"
                            >
                                <option value="all">Semua</option>
                                <option value="Long">Long</option>
                                <option value="Short">Short</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {filteredTrades.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                    <div className="w-20 h-20 mx-auto bg-surface-container-low rounded-sm flex items-center justify-center border-none shadow-sm">
                        <BarChart3 className="w-10 h-10 text-slate-600" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-lg">Belum ada trade</p>
                        <p className="text-slate-500 text-sm mt-1">Klik tombol + untuk mulai mencatat</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Trade count */}
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                        {filteredTrades.length} trade{filteredTrades.length > 1 ? 's' : ''}
                    </p>

                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full border-separate border-spacing-y-2">
                            <thead>
                                <tr className="text-left text-[10px] font-label font-bold text-slate-500 uppercase tracking-widest">
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Pair</th>
                                    <th className="px-6 py-4">Setup</th>
                                    <th className="px-6 py-4">Side</th>
                                    <th className="px-6 py-4 text-right">P/L</th>
                                    <th className="px-6 py-4 text-center">R:R</th>
                                    <th className="px-6 py-4 text-center">Mood</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTrades.map((t) => (
                                    <tr
                                        key={t.id}
                                        onClick={() => setSelectedTrade(t)}
                                        className="bg-surface-container-low hover:bg-surface-container-highest transition-colors duration-300 group cursor-pointer"
                                    >
                                        <td className="px-6 py-5 rounded-l-xl text-xs font-mono text-slate-400">
                                            {t.createdAt ? new Date(t.createdAt.seconds * 1000).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : '...'}
                                        </td>
                                        <td className="px-6 py-5 font-headline text-lg font-bold text-white">
                                            {t.asset}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1.5 rounded-sm text-[10px] font-label font-bold uppercase tracking-widest ${getSetupColor(t.setup)} shadow-[0_0_10px_currentColor] opacity-90`}>
                                                {t.setup}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`flex items-center gap-1 text-[10px] font-label uppercase tracking-widest font-bold ${t.type === 'Long' ? 'text-blue-400' : 'text-amber-400'}`}>
                                                {t.type === 'Long' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                                {t.type}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-5 text-right font-headline text-lg font-bold ${t.outcome === 'Profit' ? 'text-success' : (t.outcome === 'Loss' ? 'text-danger' : 'text-slate-400')}`}>
                                            {t.outcome === 'Profit' ? '+' : (t.outcome === 'Loss' ? '-' : '')}{formatCurrency(Math.abs(t.amount || 0), currency)}
                                        </td>
                                        <td className="px-6 py-5 text-center font-bold text-slate-400">
                                            1:{t.rr}
                                        </td>
                                        <td className="px-6 py-5 text-center text-lg">
                                            {getMoodEmoji(t.mood)}
                                        </td>
                                        <td className="px-6 py-5 text-right rounded-r-xl">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onEdit(t); }}
                                                    className="p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-sm transition-all"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(t.id); }}
                                                    className="p-2 text-slate-500 hover:text-danger hover:bg-danger/10 rounded-sm transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-3">
                        {filteredTrades.map((t) => (
                            <div
                                key={t.id}
                                onClick={() => setSelectedTrade(t)}
                                className="bg-surface-container-low p-5 rounded-sm border-none shadow-sm active:bg-surface-container-highest transition-all cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${t.type === 'Long' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                            {t.type === 'Long' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h4 className="font-headline text-white font-bold text-base">{t.asset}</h4>
                                            <p className="text-[10px] font-label font-bold text-slate-500 uppercase tracking-wider">
                                                {t.createdAt ? new Date(t.createdAt.seconds * 1000).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : '...'} • {t.setup}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-headline font-bold text-base ${t.outcome === 'Profit' ? 'text-success' : (t.outcome === 'Loss' ? 'text-danger' : 'text-slate-400')}`}>
                                            {t.outcome === 'Profit' ? '+' : (t.outcome === 'Loss' ? '-' : '')}{formatCurrency(Math.abs(t.amount || 0), currency)}
                                        </p>
                                        <p className="text-[10px] font-label font-bold text-slate-500">1:{t.rr}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg" title={t.mood}>{getMoodEmoji(t.mood)}</span>
                                        <span className="text-xs font-medium text-slate-400 italic truncate max-w-[150px]">{t.strategy}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onEdit(t); }}
                                            className="p-2 text-slate-500 active:text-primary transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setDeleteTarget(t.id); }}
                                            className="p-2 text-slate-500 active:text-danger transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <TradeDetailModal
                trade={selectedTrade}
                onClose={() => setSelectedTrade(null)}
                currency={currency}
            />

            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => { if (deleteTarget) onDelete(deleteTarget); }}
                title="Hapus Trade"
                message="Trade ini akan dihapus secara permanen. Yakin?"
                confirmText="Ya, Hapus"
                cancelText="Batal"
            />
        </div>
    );
};
