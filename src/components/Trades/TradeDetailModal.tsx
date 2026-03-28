import React from 'react';
import ReactDOM from 'react-dom';
import { ExternalLink, X } from 'lucide-react';
import type { Trade } from '../../types';
import { formatCurrency } from '../../utils';

interface TradeDetailModalProps {
    trade: Trade | null;
    onClose: () => void;
    currency: string;
}

export const TradeDetailModal: React.FC<TradeDetailModalProps> = ({ trade, onClose, currency }) => {
    if (!trade) return null;

    const InfoRow = ({ label, value, valueClass = "" }: { label: string; value: React.ReactNode; valueClass?: string }) => (
        <div className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
            <span className={`text-sm font-black text-white ${valueClass}`}>{value || '-'}</span>
        </div>
    );

    const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="space-y-1">
            <h3 className="text-[10px] text-primary font-black uppercase tracking-widest ml-1">{title}</h3>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-1">
                {children}
            </div>
        </div>
    );

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ margin: 0 }}>
            {/* Solid backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal content */}
            <div className="relative z-10 bg-surface w-full max-w-md rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-y-auto max-h-[80vh] no-scrollbar">
                {/* Sticky Header */}
                <div className="sticky top-0 z-20 bg-surface/95 backdrop-blur-md px-5 pt-5 pb-3 border-b border-white/5">
                    <div className="flex justify-between items-center">
                        <h2 className="font-black text-white text-base uppercase tracking-tight flex items-center gap-2">
                            <div className="p-1.5 bg-white/5 rounded-lg text-primary">
                                <ExternalLink className="w-4 h-4" />
                            </div>
                            Trade Info
                        </h2>
                        <button 
                            onClick={onClose} 
                            className="p-1.5 hover:bg-white/5 rounded-full transition-all active:scale-95 text-slate-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="px-5 pb-5 pt-4 space-y-4">
                    {/* Header Card */}
                    <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black text-white tracking-tight">{trade.asset}</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                {trade.createdAt ? new Date(trade.createdAt.seconds * 1000).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}
                            </p>
                        </div>
                        <span className={`relative z-10 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${trade.outcome === 'Profit' ? 'bg-emerald-500/20 text-emerald-400' : (trade.outcome === 'Loss' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-500/20 text-slate-400')}`}>
                            {trade.outcome}
                        </span>
                        <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-3xl opacity-15 ${trade.outcome === 'Profit' ? 'bg-emerald-500' : (trade.outcome === 'Loss' ? 'bg-rose-500' : 'bg-slate-500')}`} />
                    </div>

                    {/* Net P/L highlight */}
                    <div className={`text-center py-3 rounded-2xl border ${trade.outcome === 'Profit' ? 'bg-emerald-500/5 border-emerald-500/10' : (trade.outcome === 'Loss' ? 'bg-rose-500/5 border-rose-500/10' : 'bg-white/[0.02] border-white/5')}`}>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Net P/L</p>
                        <p className={`text-xl font-black ${trade.amount > 0 ? 'text-emerald-400' : (trade.amount < 0 ? 'text-rose-400' : 'text-slate-400')}`}>
                            {trade.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(trade.amount), currency)}
                        </p>
                    </div>

                    <Section title="Execution">
                        <InfoRow label="Side" value={trade.type} valueClass={trade.type === 'Long' ? 'text-blue-400' : 'text-orange-400'} />
                        <InfoRow label="Setup" value={trade.setup} />
                        <InfoRow label="Entry Type" value={trade.entryType} />
                        <InfoRow label="Lot Size" value={trade.lotSize} />
                    </Section>

                    <Section title="Price Action">
                        <InfoRow label="Entry Price" value={trade.entryPrice} />
                        <InfoRow label="Exit Price" value={trade.exitPrice} />
                        <InfoRow label="Stop Loss" value={trade.slPrice} valueClass="text-rose-400" />
                        <InfoRow label="Take Profit" value={trade.tpPrice} valueClass="text-emerald-400" />
                    </Section>

                    <Section title="Metrics">
                        <InfoRow label="P/L (%)" value={trade.pnlPercent ? `${trade.pnlPercent}%` : '-'} />
                        <InfoRow label="Risk:Reward" value={`1:${trade.rr}`} />
                    </Section>

                    <Section title="Journal">
                        <InfoRow label="Mood" value={trade.mood} />
                    </Section>

                    {/* Notes */}
                    <div className="space-y-1">
                        <h3 className="text-[10px] text-primary font-black uppercase tracking-widest ml-1">Catatan</h3>
                        <p className="text-sm text-slate-300 bg-white/[0.03] border border-white/5 p-4 rounded-2xl leading-relaxed">
                            {trade.strategy || 'Tidak ada catatan...'}
                        </p>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
