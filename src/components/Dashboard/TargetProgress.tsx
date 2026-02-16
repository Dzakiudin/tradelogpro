import React from 'react';
import { formatCurrency } from '../../utils';

interface TargetProgressProps {
    current: number;
    target: number;
    currency: string;
}

export const TargetProgress: React.FC<TargetProgressProps> = ({ current, target, currency }) => {
    const progress = target > 0 ? Math.min(100, Math.max(0, (current / target) * 100)) : 0;

    return (
        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
            <div className="flex justify-between items-center mb-3 relative z-10">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Monthly Target</h3>
                <span className="text-xs font-bold text-primary text-glow">{progress.toFixed(0)}%</span>
            </div>

            <div className="w-full bg-surface-light/30 h-3 rounded-full overflow-hidden relative z-10">
                <div
                    className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-1000 relative shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
                </div>
            </div>

            <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-500 relative z-10">
                <span className="text-white">{formatCurrency(current, currency)}</span>
                <span>Goal: {formatCurrency(target, currency)}</span>
            </div>

            {/* Background Glow */}
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>
        </div>
    );
};
