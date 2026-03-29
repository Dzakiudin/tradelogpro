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
            <div className="relative z-10 bg-surface-container-highest w-full max-w-sm rounded-sm border-none shadow-2xl p-6 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-danger/10 rounded-sm">
                        <AlertTriangle className="w-6 h-6 text-danger" />
                    </div>
                    <div>
                        <h3 className="text-white font-headline font-black text-lg uppercase tracking-widest">{title}</h3>
                        <p className="text-slate-400 font-label font-bold text-xs mt-1 tracking-wider">{message}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 rounded-sm bg-surface-container-low text-slate-300 font-headline font-black text-sm uppercase tracking-[0.2em] hover:bg-surface-container transition-colors active:scale-95 shadow-inner"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => { onConfirm(); onClose(); }}
                        className="flex-1 py-3.5 rounded-sm bg-danger text-white font-headline font-black text-sm uppercase tracking-[0.2em] hover:bg-danger/90 transition-colors active:scale-95 shadow-[0_0_15px_rgba(255,0,85,0.2)]"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
