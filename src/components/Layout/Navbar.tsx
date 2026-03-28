import React from 'react';
import { LineChart, Settings, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface NavbarProps {
    onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings }) => {
    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-4 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-brand-blue rounded-xl text-white shadow-md">
                        <LineChart className="w-5 h-5" />
                    </div>
                    <span className="font-black text-xl tracking-tighter text-slate-800 uppercase">
                        TRADELOG<span className="text-brand-blue">PRO</span>
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onOpenSettings}
                        className="p-2 text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-xl transition-all"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => signOut(auth)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </nav>
    );
};
