import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { TrendingUp, ArrowRight, Loader2 } from 'lucide-react';

export const AuthForm: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-6 bg-background overflow-hidden relative">
            {/* Dynamic Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[128px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[128px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="w-full max-w-md glass-panel p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative z-10 animate-fade-in border-t border-white/10">
                <div className="flex flex-col items-center mb-10">
                    <div className="p-4 bg-gradient-to-tr from-primary to-secondary rounded-2xl text-white mb-6 shadow-lg shadow-primary/30">
                        <TrendingUp className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-white mb-2">
                        TradeLog<span className="text-primary">Pro</span>
                    </h1>
                    <p className="text-slate-400 text-sm font-medium text-center max-w-xs">
                        The professional way to track, analyze, and improve your trading performance.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-2xl text-center">
                            {error}
                        </div>
                    )}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-6 py-4 bg-background/50 border border-white/5 rounded-2xl focus:ring-2 focus:ring-primary outline-none text-white placeholder:text-slate-600 focus:border-primary/50 transition-all font-medium"
                            placeholder="trader@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-6 py-4 bg-background/50 border border-white/5 rounded-2xl focus:ring-2 focus:ring-primary outline-none text-white placeholder:text-slate-600 focus:border-primary/50 transition-all font-medium"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-primary to-primary-dark hover:to-primary text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-primary/25 active:scale-[0.98] mt-6 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
                        {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-slate-400 text-xs font-bold hover:text-white transition-colors"
                    >
                        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
};
