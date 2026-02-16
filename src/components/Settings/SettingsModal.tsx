import React, { useState } from 'react';
import { User, Facebook, Instagram } from 'lucide-react';
import { Modal } from '../Common/Modal';
import { useAuth } from '../../context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db, appId } from '../../lib/firebase';
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

    const inputClasses = "w-full px-5 py-4 bg-background border border-white/5 rounded-2xl focus:ring-2 focus:ring-primary outline-none font-bold text-white placeholder:text-slate-600 focus:border-primary/50 transition-all";
    const labelClasses = "text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Pengaturan"
            icon={<User className="w-5 h-5" />}
        >
            <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-background rounded-3xl border border-white/5">
                    <div className="w-12 h-12 bg-gradient-to-tr from-primary to-secondary rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">
                        <User className="w-6 h-6" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Active User</p>
                        <p className="text-sm font-bold text-white truncate max-w-[200px]">{currentUser?.email}</p>
                    </div>
                </div>

                <div>
                    <label className={labelClasses}>Mata Uang</label>
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className={inputClasses}
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

                <button onClick={handleSave} disabled={loading} className="w-full bg-white text-slate-900 font-black py-4 rounded-2xl hover:bg-slate-200 transition-all disabled:opacity-50">
                    {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
                </button>

                <div className="pt-6 border-t border-white/5 text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Dibuat oleh Jackie</p>
                    <div className="flex justify-center space-x-4">
                        <a href="https://www.facebook.com/jakijekijuki" target="_blank" className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl hover:bg-blue-500 hover:text-white transition-all">
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a href="https://www.instagram.com/jakijekiiii?igsh=MThpaW8ybThid3Zoaw==" target="_blank" className="p-3 bg-pink-500/10 text-pink-400 rounded-2xl hover:bg-pink-500 hover:text-white transition-all">
                            <Instagram className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
