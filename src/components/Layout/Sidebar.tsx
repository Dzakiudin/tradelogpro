import React from 'react';
import { LayoutDashboard, BookOpen, Calendar, BarChart2, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';


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
        <header className="fixed top-0 w-full z-[60] flex justify-between items-center px-6 h-16 bg-surface/80 backdrop-blur-xl border-none shadow-[0_1px_20px_rgba(0,229,255,0.05)]">
            <div className="flex items-center gap-4">
                <TrendingUp className="text-primary w-6 h-6" />
                <span className="text-primary font-headline uppercase tracking-[0.2em] text-lg font-bold">TRADELOG PRO</span>
            </div>
            <div className="flex items-center gap-6">
                <nav className="hidden md:flex gap-8 text-xs font-label font-bold tracking-widest uppercase">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`transition-colors duration-300 ${activeTab === item.id ? 'text-primary' : 'text-slate-500 hover:text-primary'}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div 
                    className="h-8 w-8 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-slate-300 overflow-hidden border border-white/10 cursor-pointer"
                    onClick={onOpenSettings}
                    title="Settings"
                >
                    {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
            </div>
        </header>
    );
};
