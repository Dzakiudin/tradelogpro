import React from 'react';
import { LayoutDashboard, BookOpen, Calendar, BarChart2, Settings, LogOut, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenSettings }) => {
    const { currentUser } = useAuth();

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'trades', icon: BookOpen, label: 'Journal' },
        { id: 'calendar', icon: Calendar, label: 'Calendar' },
        { id: 'analytics', icon: BarChart2, label: 'Analytics' },
    ];

    return (
        <aside className="hidden lg:flex flex-col w-72 h-screen fixed left-0 top-0 bg-surface/50 backdrop-blur-xl border-r border-white/5 p-6 z-50">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <TrendingUp className="text-white w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-xl font-black tracking-tight text-white">TradeLog<span className="text-primary">Pro</span></h1>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Trading Journal</p>
                </div>
            </div>

            {/* User Profile Snippet */}
            <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 flex items-center justify-center text-slate-900 font-bold text-lg">
                    {currentUser?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-200 truncate">{currentUser?.email}</p>
                    <p className="text-xs text-emerald-400 font-medium">Pro Plan Active</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse-slow' : 'group-hover:scale-110 transition-transform'}`} />
                            <span className="font-bold tracking-wide text-sm">{item.label}</span>
                            {isActive && (
                                <div className="absolute right-0 top-0 h-full w-1 bg-white/20 blur-sm"></div>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/5 space-y-2">
                <button
                    onClick={onOpenSettings}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-bold"
                >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                </button>
                <button
                    onClick={() => signOut(auth)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all text-sm font-bold"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};
