import React from 'react';
import { Plus } from 'lucide-react';
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

            <main className="relative z-10 min-h-[calc(100vh-64px)] pt-24 pb-32 transition-all duration-300">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-12 space-y-8 animate-fade-in">
                    {children}
                </div>
            </main>

            {/* Desktop Global Floating Add Button */}
            <button
                onClick={onOpenTradeModal}
                className="hidden md:flex fixed bottom-12 right-12 z-50 w-16 h-16 bg-primary hover:bg-primary-dark rounded-full items-center justify-center text-white shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all duration-300"
                title="Add Trade"
            >
                <Plus className="w-8 h-8" />
            </button>

            <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />
        </div>
    );
};
