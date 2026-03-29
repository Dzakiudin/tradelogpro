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
            <div className="bg-surface-container-highest border-none rounded-sm px-4 py-1 shadow-sm">
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
            <div className="relative z-10 bg-surface-container w-full max-w-md rounded-md border-[0px] shadow-2xl shadow-black/50 overflow-y-auto max-h-[80vh] no-scrollbar">
                {/* Sticky Header */}
                <div className="sticky top-0 z-20 bg-surface-container/95 backdrop-blur-md px-5 pt-5 pb-3">
                    <div className="flex justify-between items-center">
                        <h2 className="font-headline font-black text-white text-base uppercase tracking-tight flex items-center gap-2">
                            <div className="p-1.5 bg-white/5 rounded-sm text-primary">
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
                    <div className="flex items-center justify-between p-4 bg-surface-container-highest rounded-sm border-none relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-headline font-black text-white tracking-tight">{trade.asset}</h2>
                            <p className="text-[10px] text-slate-400 font-label font-bold uppercase tracking-widest mt-0.5">
                                {trade.createdAt ? new Date(trade.createdAt.seconds * 1000).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}
                            </p>
                        </div>
                        <span className={`relative z-10 px-3 py-1.5 rounded-sm text-[10px] font-label font-black uppercase tracking-wider ${trade.outcome === 'Profit' ? 'bg-success/10 text-success' : (trade.outcome === 'Loss' ? 'bg-danger/10 text-danger' : 'bg-slate-500/20 text-slate-400')}`}>
                            {trade.outcome}
                        </span>
                        <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-3xl opacity-10 ${trade.outcome === 'Profit' ? 'bg-success' : (trade.outcome === 'Loss' ? 'bg-danger' : 'bg-slate-500')}`} />
                    </div>

                    {/* Net P/L highlight */}
                    <div className={`text-center py-3 rounded-sm ${trade.outcome === 'Profit' ? 'bg-success/5' : (trade.outcome === 'Loss' ? 'bg-danger/5' : 'bg-surface-container-highest')}`}>
                        <p className="text-[10px] font-label font-black text-slate-500 uppercase tracking-widest mb-1">Net P/L</p>
                        <p className={`text-xl font-headline font-black ${trade.amount > 0 ? 'text-success' : (trade.amount < 0 ? 'text-danger' : 'text-slate-400')}`}>
                            {trade.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(trade.amount), currency)}
                        </p>
                    </div>

                    <Section title="Execution">
                        <InfoRow label="Side" value={trade.type} valueClass={trade.type === 'Long' ? 'text-blue-400' : 'text-amber-400'} />
                        <InfoRow label="Setup" value={trade.setup} />
                        <InfoRow label="Entry Type" value={trade.entryType} />
                        <InfoRow label="Lot Size" value={trade.lotSize} />
                    </Section>

                    <Section title="Price Action">
                        <InfoRow label="Entry Price" value={trade.entryPrice} />
                        <InfoRow label="Exit Price" value={trade.exitPrice} />
                        <InfoRow label="Stop Loss" value={trade.slPrice} valueClass="text-danger" />
                        <InfoRow label="Take Profit" value={trade.tpPrice} valueClass="text-success" />
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
                        <h3 className="text-[10px] text-primary font-label font-black uppercase tracking-widest ml-1">Catatan</h3>
                        <p className="text-sm font-body text-slate-300 bg-surface-container-highest p-4 rounded-sm leading-relaxed">
                            {trade.strategy || 'Tidak ada catatan...'}
                        </p>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
