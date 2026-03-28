import React from 'react';
import ReactDOM from 'react-dom';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Konfirmasi",
    message = "Apakah kamu yakin?",
    confirmText = "Ya, Hapus",
    cancelText = "Batal"
}) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 bg-surface w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl p-6 space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-rose-500/10 rounded-xl">
                        <AlertTriangle className="w-6 h-6 text-rose-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-black text-base uppercase tracking-tight">{title}</h3>
                        <p className="text-slate-400 text-sm mt-1">{message}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-white/5 text-slate-300 font-bold text-sm hover:bg-white/10 transition-colors active:scale-95"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => { onConfirm(); onClose(); }}
                        className="flex-1 py-3 rounded-xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-colors active:scale-95"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
