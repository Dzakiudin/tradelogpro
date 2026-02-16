import { Timestamp } from "firebase/firestore";

export interface Trade {
    id: string;
    asset: string;
    setup: 'Breakout' | 'Retest' | 'Pullback' | 'Scalping' | 'Trend Follow';
    type: 'Long' | 'Short';
    outcome: 'Profit' | 'Loss' | 'BE';
    mood: 'Calm' | 'Patient' | 'Greedy' | 'Fear' | 'FOMO';
    amount: number;
    rr: number;
    strategy: string;
    createdAt: Timestamp;
}

export interface UserSettings {
    currency: string;
    monthlyTarget: number;
}
