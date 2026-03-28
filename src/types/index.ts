import { Timestamp } from "firebase/firestore";

export interface Trade {
    id: string;
    asset: string;
    setup: 'Breakout' | 'Retest' | 'Pullback' | 'Scalping' | 'Trend Follow' | 'Reversal'; // Expanded
    type: 'Long' | 'Short';
    outcome: 'Profit' | 'Loss' | 'BE';
    mood: 'Calm' | 'Patient' | 'Greedy' | 'Fear' | 'FOMO';
    amount: number; // P/L nominal
    rr: number; // Actual Risk-Reward
    strategy: string; // Catatan tambahan / Alasan entry
    createdAt: Timestamp;

    // --- New Fields (Optional for backward compatibility with old trades) ---
    
    // Harga (Price Data)
    entryPrice?: number;
    slPrice?: number;
    tpPrice?: number;
    exitPrice?: number;

    // Entry Spesifik
    entryType?: 'Market' | 'Limit' | 'Stop';
    lotSize?: number;

    // Hasil & Metrik Tambahan
    pnlPercent?: number; // P/L dalam Persentase
    plannedRR?: number; // Target Risk-Reward Awal
}

export interface UserSettings {
    currency: string;
    monthlyTarget: number;
}
