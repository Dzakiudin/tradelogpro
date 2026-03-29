import React, { useState } from 'react';
import { User, Facebook, Instagram, LogOut } from 'lucide-react';
import { Modal } from '../Common/Modal';
import { useAuth } from '../../context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db, appId, auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import type { UserSettings } from '../../types';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: UserSettings;
    onSave: (newSettings: UserSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
    const { currentUser } = useAuth();
    const [currency, setCurrency] = useState(settings.currency);
    const [monthlyTarget, setMonthlyTarget] = useState(settings.monthlyTarget);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const newSettings = { currency, monthlyTarget };
            await setDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'settings', 'user_config'), newSettings);
            onSave(newSettings);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full px-5 py-4 bg-surface-container-highest border-none rounded-sm focus:ring-1 focus:ring-primary outline-none font-headline font-bold text-lg text-white placeholder:text-slate-600 transition-all shadow-inner";
    const labelClasses = "text-[10px] font-label font-bold text-slate-500 uppercase tracking-[0.2em] block mb-2";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Pengaturan"
            icon={<User className="w-5 h-5" />}
        >
            <div className="space-y-6 pb-24">
                <div className="flex items-center space-x-4 p-4 bg-surface-container-highest rounded-sm border-none shadow-sm">
                    <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center text-primary font-black text-xl shadow-lg border border-primary/20">
                        <User className="w-6 h-6 drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-[10px] font-label font-bold text-slate-500 uppercase tracking-widest">Active User</p>
                        <p className="text-sm font-headline font-bold text-white truncate max-w-[200px]">{currentUser?.email}</p>
                    </div>
                </div>

                <div>
                    <label className={labelClasses}>Mata Uang</label>
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className={`${inputClasses} appearance-none cursor-pointer`}
                    >
                        <option value="IDR">🇮🇩 IDR (Rupiah)</option>
                        <option value="USD">🇺🇸 USD (Dollar)</option>
                        <option value="EUR">🇪🇺 EUR (Euro)</option>
                        <option value="JPY">🇯🇵 JPY (Yen)</option>
                    </select>
                </div>

                <div>
                    <label className={labelClasses}>Target Profit Bulanan</label>
                    <input
                        type="number"
                        value={monthlyTarget}
                        onChange={(e) => setMonthlyTarget(parseFloat(e.target.value) || 0)}
                        className={inputClasses}
                        placeholder="E.g. 5000000"
                    />
                </div>

                <button onClick={handleSave} disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-background font-headline font-black uppercase tracking-[0.2em] py-5 rounded-sm transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)] active:scale-[0.98] mt-8 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed">
                    {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
                </button>

                <button onClick={() => signOut(auth)} className="w-full bg-danger/10 hover:bg-danger text-danger hover:text-white font-headline font-black uppercase tracking-[0.2em] py-4 rounded-sm transition-all shadow-sm active:scale-[0.98] mt-4 flex items-center justify-center gap-3 border border-danger/20">
                    <LogOut className="w-5 h-5" />
                    Keluar Sesi
                </button>

                <div className="pt-6 border-t border-white/5 text-center mt-10">
                    <p className="text-[10px] font-label font-black text-slate-500 uppercase tracking-widest mb-4">Dibuat oleh Jackie</p>
                    <div className="flex justify-center space-x-4">
                        <a href="https://www.facebook.com/jakijekijuki" target="_blank" className="p-3 bg-blue-500/10 text-blue-400 rounded-sm hover:bg-blue-500 hover:text-white transition-all border-none">
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a href="https://www.instagram.com/jakijekiiii?igsh=MThpaW8ybThid3Zoaw==" target="_blank" className="p-3 bg-pink-500/10 text-pink-400 rounded-sm hover:bg-pink-500 hover:text-white transition-all border-none">
                            <Instagram className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
