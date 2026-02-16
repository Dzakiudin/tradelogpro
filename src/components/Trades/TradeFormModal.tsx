import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Modal } from '../Common/Modal';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';

interface TradeFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TradeFormModal: React.FC<TradeFormModalProps> = ({ isOpen, onClose }) => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);

    // Checkboxes state
    const [setupChecked, setSetupChecked] = useState(false);
    const [riskChecked, setRiskChecked] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentUser) return;
        setLoading(true);

        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const tradeData = {
                asset: (formData.get('asset') as string).toUpperCase(),
                setup: formData.get('setup'),
                type: formData.get('type'),
                outcome: formData.get('outcome'),
                mood: formData.get('mood'),
                amount: parseFloat(formData.get('amount') as string),
                rr: parseFloat(formData.get('rr') as string),
                strategy: formData.get('strategy') || 'Tanpa Catatan',
                createdAt: serverTimestamp()
            };

            // Using standard path as fixed before
            await addDoc(collection(db, 'users', currentUser.uid, 'trades'), tradeData);
            form.reset();
            setSetupChecked(false);
            setRiskChecked(false);
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to add trade');
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full px-5 py-4 bg-background border border-white/5 rounded-2xl focus:ring-2 focus:ring-primary outline-none uppercase font-bold text-white placeholder:text-slate-600 focus:border-primary/50 transition-all";
    const labelClasses = "text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block";
    const selectClasses = "w-full px-5 py-4 bg-background border border-white/5 rounded-2xl focus:ring-2 focus:ring-primary outline-none font-bold text-white appearance-none cursor-pointer";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Input Trade"
            icon={<PlusCircle className="w-6 h-6" />}
        >
            <form onSubmit={handleSubmit} className="space-y-5 pb-32">
                <div>
                    <label className={labelClasses}>Pair / Aset</label>
                    <input name="asset" required className={inputClasses} placeholder="E.g. XAUUSD" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClasses}>Tipe Setup</label>
                        <div className="relative">
                            <select name="setup" className={selectClasses}>
                                <option value="Breakout">🔥 BREAKOUT</option>
                                <option value="Retest">🔄 RETEST</option>
                                <option value="Pullback">📉 PULLBACK</option>
                                <option value="Scalping">⚡ SCALPING</option>
                                <option value="Trend Follow">📈 TREND FOLLOW</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className={labelClasses}>Side</label>
                        <select name="type" className={selectClasses}>
                            <option value="Long">BUY / LONG</option>
                            <option value="Short">SELL / SHORT</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClasses}>Hasil</label>
                        <select name="outcome" className={selectClasses}>
                            <option value="Profit">WIN ✅</option>
                            <option value="Loss">LOSS ❌</option>
                            <option value="BE">B.E ⚖️</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClasses}>Mood</label>
                        <select name="mood" className={selectClasses}>
                            <option value="Calm">🧘 KALEM</option>
                            <option value="Patient">⏳ SABAR</option>
                            <option value="Greedy">🤑 RAKUS</option>
                            <option value="Fear">😨 TAKUT</option>
                            <option value="FOMO">🏃 FOMO</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClasses}>Net P/L</label>
                        <input type="number" step="1" name="amount" required className={inputClasses} placeholder="100" />
                    </div>
                    <div>
                        <label className={labelClasses}>RR Achieved</label>
                        <input type="number" step="0.1" name="rr" required className={inputClasses} placeholder="1.5" />
                    </div>
                </div>

                <div className="space-y-3 p-4 bg-background rounded-2xl border border-white/5">
                    <label className={labelClasses}>Discipline Checklist</label>
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setSetupChecked(!setupChecked)}>
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${setupChecked ? 'bg-primary border-primary' : 'border-slate-600'}`}>
                            {setupChecked && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <label className="text-xs font-bold text-slate-400 cursor-pointer">Setup sesuai strategi?</label>
                    </div>
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setRiskChecked(!riskChecked)}>
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${riskChecked ? 'bg-primary border-primary' : 'border-slate-600'}`}>
                            {riskChecked && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <label className="text-xs font-bold text-slate-400 cursor-pointer">Risiko sudah diatur?</label>
                    </div>
                </div>

                <div>
                    <label className={labelClasses}>Catatan Tambahan</label>
                    <input type="text" name="strategy" className={inputClasses} placeholder="E.g. Konfluensi EMA 200" style={{ textTransform: 'none' }} />
                </div>

                <button
                    type="submit"
                    disabled={loading || !setupChecked || !riskChecked}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-primary/25 active:scale-95 uppercase tracking-wider text-xs mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
                </button>
            </form>
        </Modal>
    );
};
