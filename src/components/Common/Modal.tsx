import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    icon: React.ReactElement;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, icon, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="bg-surface w-full max-w-lg rounded-t-[2.5rem] md:rounded-[2.5rem] p-6 md:p-8 relative z-10 shadow-2xl animate-fade-in overflow-y-auto max-h-[90vh] border border-white/5">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="font-black text-white text-xl uppercase tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-xl text-primary">
                            {icon}
                        </div>
                        {title}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all active:scale-95 text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};
