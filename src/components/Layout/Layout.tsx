import React from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onOpenSettings: () => void;
    onOpenTradeModal: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onOpenSettings, onOpenTradeModal }) => {

    // Intercept "add" tab from BottomNav to open modal instead of switching tab
    const handleTabChange = (tab: string) => {
        if (tab === 'add') {
            onOpenTradeModal();
        } else {
            setActiveTab(tab);
        }
    };

    return (
        <div className="min-h-screen bg-background text-text-main font-sans selection:bg-primary/30 overflow-x-hidden">
            {/* Dynamic Background Mesh */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[128px] opacity-40 animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[128px] opacity-40 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} onOpenSettings={onOpenSettings} />

            <main className="relative z-10 lg:pl-72 min-h-screen pb-24 lg:pb-0 transition-all duration-300">
                <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8 animate-fade-in">
                    {/* Mobile Header (active tab title) */}
                    <div className="lg:hidden flex items-center justify-between mb-6 sticky top-0 bg-background/80 backdrop-blur-xl p-4 -mx-4 z-40 border-b border-white/5">
                        <h1 className="text-xl font-black tracking-tight text-white capitalize">{activeTab}</h1>
                        <button onClick={onOpenSettings} className="p-2 bg-surface rounded-full text-slate-400">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400"></div>
                        </button>
                    </div>

                    {children}
                </div>
            </main>

            <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />
        </div>
    );
};
