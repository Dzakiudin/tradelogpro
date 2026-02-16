import React from 'react';
import { LayoutDashboard, BookOpen, Calendar, BarChart2, TrendingUp } from 'lucide-react';

interface BottomNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
        { id: 'trades', icon: BookOpen, label: 'Trades' },
        { id: 'add', icon: TrendingUp, label: 'Add', isFab: true }, // Special case for center FAB
        { id: 'calendar', icon: Calendar, label: 'Calendar' },
        { id: 'analytics', icon: BarChart2, label: 'Stats' },
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl border-t border-white/10 px-6 py-2 pb-5 z-[70] flex justify-between items-center shadow-2xl">
            {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                if (item.isFab) {
                    return (
                        <div key={item.id} className="relative -top-6">
                            <button
                                onClick={() => setActiveTab(item.id)} // This acts as trigger for Add Modal in parent
                                className="w-14 h-14 bg-gradient-to-tr from-primary to-primary-dark rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/30 active:scale-95 transition-transform"
                            >
                                <Icon className="w-6 h-6" />
                            </button>
                        </div>
                    );
                }

                return (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-primary scale-105' : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Icon className={`w-6 h-6 ${isActive ? 'fill-primary/20' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
                    </button>
                );
            })}
        </div>
    );
};
