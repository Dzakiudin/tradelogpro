import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil } from 'lucide-react';
import { Modal } from '../Common/Modal';
import { addDoc, collection, serverTimestamp, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import type { Trade } from '../../types';

interface TradeFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    editTrade?: Trade | null;
}

export const TradeFormModal: React.FC<TradeFormModalProps> = ({ isOpen, onClose, editTrade }) => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const isEdit = !!editTrade;

    // Checkboxes state
    const [setupChecked, setSetupChecked] = useState(false);
    const [riskChecked, setRiskChecked] = useState(false);

    // Form values for edit mode
    const [formValues, setFormValues] = useState<Record<string, any>>({});

    useEffect(() => {
        if (editTrade) {
            setFormValues({
                asset: editTrade.asset || '',
                tradeDate: editTrade.createdAt ? new Date(editTrade.createdAt.seconds * 1000).toISOString().slice(0, 16) : '',
                lotSize: editTrade.lotSize || '',
                type: editTrade.type || 'Long',
                entryType: editTrade.entryType || 'Market',
                setup: editTrade.setup || 'Breakout',
                entryPrice: editTrade.entryPrice || '',
                exitPrice: editTrade.exitPrice || '',
                slPrice: editTrade.slPrice || '',
                tpPrice: editTrade.tpPrice || '',
                outcome: editTrade.outcome || 'Profit',
                amount: editTrade.amount || '',
                pnlPercent: editTrade.pnlPercent || '',
                rr: editTrade.rr || '',
                mood: editTrade.mood || 'Calm',
                strategy: editTrade.strategy || '',
            });
            setSetupChecked(true);
            setRiskChecked(true);
        } else {
            setFormValues({});
            setSetupChecked(false);
            setRiskChecked(false);
        }
    }, [editTrade, isOpen]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentUser) return;
        setLoading(true);

        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const formDataParser = (name: string, isFloat: boolean = false) => {
                const val = formData.get(name);
                if (!val || val === '') return undefined;
                return isFloat ? parseFloat(val as string) : val;
            };

            const tradeDateStr = formData.get('tradeDate') as string;
            const createdAtVal = tradeDateStr ? Timestamp.fromDate(new Date(tradeDateStr)) : serverTimestamp();

            const tradeData: Record<string, any> = {
                asset: (formData.get('asset') as string).toUpperCase(),
                setup: formData.get('setup'),
                type: formData.get('type'),
                outcome: formData.get('outcome'),
                mood: formData.get('mood'),
                amount: parseFloat(formData.get('amount') as string),
                rr: parseFloat(formData.get('rr') as string),
                strategy: formData.get('strategy') || 'Tanpa Catatan',
                createdAt: createdAtVal,
                entryType: formData.get('entryType'),
                lotSize: formDataParser('lotSize', true),
                entryPrice: formDataParser('entryPrice', true),
                exitPrice: formDataParser('exitPrice', true),
                slPrice: formDataParser('slPrice', true),
                tpPrice: formDataParser('tpPrice', true),
                pnlPercent: formDataParser('pnlPercent', true),
            };

            // clean up undefined/NaN values
            Object.keys(tradeData).forEach(key => {
                if (tradeData[key] === undefined || Number.isNaN(tradeData[key])) {
                    delete tradeData[key];
                }
            });

            if (isEdit && editTrade) {
                await updateDoc(doc(db, 'users', currentUser.uid, 'trades', editTrade.id), tradeData);
            } else {
                await addDoc(collection(db, 'users', currentUser.uid, 'trades'), tradeData);
            }

            form.reset();
            setSetupChecked(false);
            setRiskChecked(false);
            setFormValues({});
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to save trade');
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full px-5 py-4 bg-surface-container-highest border-none rounded-sm focus:ring-1 focus:ring-primary outline-none font-headline font-bold text-lg text-white placeholder:text-slate-600 transition-all shadow-inner";
    const labelClasses = "text-[10px] font-label font-bold text-slate-500 uppercase tracking-widest block mb-2";
    const selectClasses = "w-full px-5 py-4 bg-surface-container-highest border-none rounded-sm focus:ring-1 focus:ring-primary outline-none font-headline font-bold text-sm text-white appearance-none cursor-pointer transition-all shadow-inner";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Edit Trade" : "Input Trade"}
            icon={isEdit ? <Pencil className="w-6 h-6" /> : <PlusCircle className="w-6 h-6" />}
        >
            <form onSubmit={handleSubmit} className="space-y-8 pb-32">
                
                {/* Section 1: Instrumen & Setup */}
                <div className="space-y-4">
                    <h3 className="text-primary font-black text-sm uppercase tracking-widest border-b border-white/5 pb-2">1. Instrumen & Setup</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClasses}>Pair / Aset</label>
                            <input name="asset" required className={inputClasses} placeholder="E.g. XAUUSD" defaultValue={formValues.asset} />
                        </div>
                        <div>
                            <label className={labelClasses}>Waktu Entry (Local)</label>
                            <input type="datetime-local" name="tradeDate" className={inputClasses} defaultValue={formValues.tradeDate} />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClasses}>Lot Size</label>
                            <input type="number" step="any" name="lotSize" className={inputClasses} placeholder="0.1" defaultValue={formValues.lotSize} />
                        </div>
                        <div>
                            <label className={labelClasses}>Arah / Side</label>
                            <select name="type" className={selectClasses} defaultValue={formValues.type}>
                                <option value="Long">🔼 BUY / LONG</option>
                                <option value="Short">🔽 SELL / SHORT</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClasses}>Tipe Entry</label>
                            <select name="entryType" className={selectClasses} defaultValue={formValues.entryType}>
                                <option value="Market">⚡ MARKET</option>
                                <option value="Limit">🎯 LIMIT</option>
                                <option value="Stop">🛑 STOP</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClasses}>Tipe Setup</label>
                            <select name="setup" className={selectClasses} defaultValue={formValues.setup}>
                                <option value="Breakout">🔥 BREAKOUT</option>
                                <option value="Retest">🔄 RETEST</option>
                                <option value="Pullback">📉 PULLBACK</option>
                                <option value="Scalping">⚡ SCALPING</option>
                                <option value="Trend Follow">📈 TREND FOLLOW</option>
                                <option value="Reversal">⚠️ REVERSAL</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section 2: Data Harga */}
                <div className="space-y-4">
                    <h3 className="text-primary font-black text-sm uppercase tracking-widest border-b border-white/5 pb-2">2. Data Harga (Opsional)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClasses}>Entry Price</label>
                            <input type="number" step="any" name="entryPrice" className={inputClasses} placeholder="1950.50" defaultValue={formValues.entryPrice} />
                        </div>
                        <div>
                            <label className={labelClasses}>Exit Price</label>
                            <input type="number" step="any" name="exitPrice" className={inputClasses} placeholder="1960.00" defaultValue={formValues.exitPrice} />
                        </div>
                        <div>
                            <label className={labelClasses}>Stop Loss (SL)</label>
                            <input type="number" step="any" name="slPrice" className={inputClasses} placeholder="1940.00" defaultValue={formValues.slPrice} />
                        </div>
                        <div>
                            <label className={labelClasses}>Take Profit (TP)</label>
                            <input type="number" step="any" name="tpPrice" className={inputClasses} placeholder="1970.00" defaultValue={formValues.tpPrice} />
                        </div>
                    </div>
                </div>

                {/* Section 3: Hasil & Metrik */}
                <div className="space-y-4">
                    <h3 className="text-primary font-black text-sm uppercase tracking-widest border-b border-white/5 pb-2">3. Hasil & Metrik</h3>
                    <div>
                        <label className={labelClasses}>Hasil Akhir</label>
                        <select name="outcome" className={selectClasses} defaultValue={formValues.outcome}>
                            <option value="Profit">WIN ✅</option>
                            <option value="Loss">LOSS ❌</option>
                            <option value="BE">B.E ⚖️</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className={labelClasses}>Net P/L</label>
                            <input type="number" step="any" name="amount" required className={inputClasses} placeholder="100" defaultValue={formValues.amount} />
                        </div>
                        <div>
                            <label className={labelClasses}>P/L (%)</label>
                            <input type="number" step="any" name="pnlPercent" className={inputClasses} placeholder="1.5" defaultValue={formValues.pnlPercent} />
                        </div>
                        <div>
                            <label className={labelClasses}>R:R Aktual</label>
                            <input type="number" step="0.1" name="rr" required className={inputClasses} placeholder="2.5" defaultValue={formValues.rr} />
                        </div>
                    </div>
                </div>

                {/* Section 4: Psikologi & Evaluasi */}
                <div className="space-y-4">
                    <h3 className="text-primary font-black text-sm uppercase tracking-widest border-b border-white/5 pb-2">4. Psikologi & Jurnal</h3>
                    <div>
                        <label className={labelClasses}>Mood / Emosi</label>
                        <select name="mood" className={selectClasses} defaultValue={formValues.mood}>
                            <option value="Calm">🧘 KALEM</option>
                            <option value="Patient">⏳ SABAR</option>
                            <option value="Greedy">🤑 RAKUS</option>
                            <option value="Fear">😨 TAKUT</option>
                            <option value="FOMO">🏃 FOMO</option>
                        </select>
                    </div>

                    <div className="space-y-3 p-4 bg-surface-container-low rounded-sm border-none shadow-sm">
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
                        <label className={labelClasses}>Catatan Tambahan (Jurnal)</label>
                        <textarea name="strategy" rows={3} className={inputClasses} placeholder="E.g. Konfluensi EMA 200, telat entry karena ragu..." style={{ textTransform: 'none' }} defaultValue={formValues.strategy}></textarea>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !setupChecked || !riskChecked}
                    className={`w-full text-background font-headline font-black py-5 rounded-sm transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] active:scale-95 uppercase tracking-[0.2em] text-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed ${isEdit ? 'bg-amber-500 hover:bg-amber-400 font-headline' : 'bg-primary hover:bg-primary-dark'}`}
                >
                    {loading ? 'Menyimpan...' : (isEdit ? 'Update Transaksi' : 'Simpan Transaksi')}
                </button>
            </form>
        </Modal>
    );
};
