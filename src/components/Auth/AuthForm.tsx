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

            <div className="w-full max-w-md glass-panel p-8 md:p-10 rounded-md shadow-2xl relative z-10 animate-fade-in border-none">
                <div className="flex flex-col items-center mb-10">
                    <div className="p-4 bg-surface-container-low rounded-sm text-primary mb-6 shadow-sm border-none">
                        <TrendingUp className="w-10 h-10 drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
                    </div>
                    <h1 className="text-3xl font-headline font-black tracking-tighter text-white mb-2">
                        TRADELOG<span className="text-primary">PRO</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-label font-bold text-center max-w-xs">
                        Institutional grade trade execution tracking
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-danger/10 border-none text-danger text-xs font-bold rounded-sm text-center font-label">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-[10px] font-label font-bold text-slate-500 uppercase tracking-[0.2em] block">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-6 py-4 bg-surface-container-highest border-none rounded-sm focus:ring-1 focus:ring-primary outline-none text-white placeholder:text-slate-600 font-headline shadow-inner text-lg transition-all"
                            placeholder="trader@institution.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-label font-bold text-slate-500 uppercase tracking-[0.2em] block">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-6 py-4 bg-surface-container-highest border-none rounded-sm focus:ring-1 focus:ring-primary outline-none text-white placeholder:text-slate-600 font-headline shadow-inner text-lg transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-dark text-background font-headline font-black uppercase tracking-[0.2em] py-5 rounded-sm transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)] active:scale-[0.98] mt-8 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Initialize Session' : 'Request Access')}
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
