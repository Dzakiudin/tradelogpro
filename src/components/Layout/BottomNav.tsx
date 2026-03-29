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
        <nav className="fixed bottom-0 left-0 right-0 z-[70] flex justify-center pb-safe pointer-events-none">
            <div className="bg-surface-container-highest/50 backdrop-blur-[40px] rounded-full mb-6 mx-auto w-max px-6 py-3 flex items-center gap-8 md:gap-10 shadow-2xl shadow-black/50 pointer-events-auto border border-white/5">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    if (item.isFab) {
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className="flex items-center justify-center text-primary-dark hover:text-primary transition-all active:scale-95 duration-200"
                            >
                                <Icon className="w-8 h-8 md:w-10 md:h-10 text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
                            </button>
                        );
                    }

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`relative flex items-center justify-center transition-all active:scale-90 duration-200 ${isActive ? "text-primary after:content-[''] after:absolute after:-bottom-3 after:w-1 after:h-1 after:bg-primary after:rounded-full after:shadow-[0_0_8px_#00E5FF]" : "text-slate-500 opacity-60 hover:opacity-100 hover:text-primary"}`}
                        >
                            <Icon className={`w-6 h-6 md:w-7 md:h-7`} />
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};
