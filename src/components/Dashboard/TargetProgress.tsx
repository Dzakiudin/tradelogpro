import React from 'react';
import { Target } from 'lucide-react';
import { formatCurrency } from '../../utils';

interface TargetProgressProps {
    current: number;
    target: number;
    currency: string;
}

export const TargetProgress: React.FC<TargetProgressProps> = ({ current, target, currency }) => {
    const progress = target > 0 ? Math.min(100, Math.max(0, (current / target) * 100)) : 0;
    const isPositive = current >= 0;
    const isComplete = progress >= 100;

    return (
        <section className="space-y-6 mb-2">
            {/* Hero Text */}
            <div>
                <h2 className="text-slate-500 font-label text-xs uppercase tracking-[0.4em] mb-4">Institutional Overview</h2>
                <h1 className="font-headline text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter leading-none mb-4">
                    QUARTERLY <span className="text-primary-dark">ALPHA</span> REPORT
                </h1>
                <p className="text-slate-400 text-sm md:text-lg font-light leading-relaxed max-w-lg">
                    Real-time execution metrics and capital deployment tracking for high-frequency algorithmic sequences.
                </p>
            </div>

            {/* Progress Card */}
            <div className="bg-surface-container-low rounded-sm shadow-sm p-6">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-sm ${isComplete ? 'bg-success/10' : 'bg-primary/10'}`}>
                        <Target className={`w-5 h-5 ${isComplete ? 'text-success drop-shadow-[0_0_8px_rgba(204,255,0,0.5)]' : 'text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]'}`} />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-label font-bold text-slate-500 uppercase tracking-[0.2em]">Target Bulanan</h2>
                        <p className="font-headline font-black text-white text-lg tracking-tight">
                            {progress.toFixed(1)}%
                            {isComplete && <span className="ml-2 text-success text-sm">✓ Reached</span>}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className={`text-sm font-headline font-black tracking-tight ${isPositive ? 'text-success' : 'text-danger'}`}>
                        {isPositive ? '+' : ''}{formatCurrency(current, currency)}
                    </p>
                    <p className="text-[10px] font-label text-slate-500 tracking-widest uppercase">
                        / {formatCurrency(target, currency)}
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-3 bg-surface-container-highest rounded-full overflow-hidden shadow-inner">
                <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${isComplete ? 'bg-gradient-to-r from-success/80 to-success shadow-[0_0_16px_rgba(204,255,0,0.4)]' : 'bg-gradient-to-r from-primary/60 to-primary shadow-[0_0_16px_rgba(0,229,255,0.3)]'}`}
                    style={{ width: `${progress}%` }}
                >
                    {/* Glowing Tip */}
                    {progress > 2 && (
                        <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${isComplete ? 'bg-success shadow-[0_0_10px_#CCFF00]' : 'bg-primary shadow-[0_0_10px_#00E5FF]'}`} />
                    )}
                </div>
            </div>

            {/* Progress Labels */}
            <div className="flex justify-between mt-3">
                <span className="text-[9px] font-label text-slate-600 uppercase tracking-widest">0%</span>
                <span className="text-[9px] font-label text-slate-600 uppercase tracking-widest">50%</span>
                <span className="text-[9px] font-label text-slate-600 uppercase tracking-widest">100%</span>
            </div>
            </div>
        </section>
    );
};
