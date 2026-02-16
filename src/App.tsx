import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthForm } from './components/Auth/AuthForm';
import { Layout } from './components/Layout/Layout';
import { StatsCards } from './components/Dashboard/StatsCards';
import { TargetProgress } from './components/Dashboard/TargetProgress';
import { GrowthChart } from './components/Charts/GrowthChart';
import { WinRateChart } from './components/Charts/WinRateChart';
import { TradingCalendar } from './components/Calendar/TradingCalendar';
import { TradeList } from './components/Trades/TradeList';
import { TradeFormModal } from './components/Trades/TradeFormModal';
import { SettingsModal } from './components/Settings/SettingsModal';
import { collection, doc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db, appId } from './lib/firebase';
import type { Trade, UserSettings } from './types';

function App() {
  const { currentUser, loading } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [settings, setSettings] = useState<UserSettings>({ currency: 'USD', monthlyTarget: 0 });

  // UI State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setTrades([]);
      return;
    }

    // Use standard 'users' path as verified in previous debug steps
    const tradesRef = collection(db, 'users', currentUser.uid, 'trades');

    const unsubTrades = onSnapshot(tradesRef, (snapshot) => {
      const tradesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trade));
      setTrades(tradesData);
    }, (error) => {
      console.error("Trades Snapshot Error:", error);
    });

    const settingsRef = doc(db, 'artifacts', appId, 'users', currentUser.uid, 'settings', 'user_config');
    const unsubSettings = onSnapshot(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as UserSettings);
      }
    });

    return () => {
      unsubTrades();
      unsubSettings();
    }
  }, [currentUser]);

  const handleDeleteTrade = async (id: string) => {
    if (!currentUser || !confirm('Apakah anda yakin ingin menghapus trade ini?')) return;
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'trades', id));
    } catch (error) {
      console.error("Error deleting trade:", error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;

  if (!currentUser) {
    return <AuthForm />;
  }

  // Monthly Progress Calculation
  const now = new Date();
  const currentMonthProfit = trades.filter(t => {
    if (!t.createdAt) return false;
    const d = t.createdAt.toDate();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((acc, t) => acc + (t.outcome === 'Profit' ? t.amount : (t.outcome === 'Loss' ? -t.amount : 0)), 0);

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onOpenSettings={() => setIsSettingsModalOpen(true)}
      onOpenTradeModal={() => setIsTradeModalOpen(prev => !prev)}
    >
      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 md:space-y-8 animate-slide-up">
          <TargetProgress
            current={currentMonthProfit}
            target={settings.monthlyTarget}
            currency={settings.currency}
          />
          <StatsCards
            trades={trades}
            currency={settings.currency}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2">
              <GrowthChart trades={trades} />
            </div>
            <div>
              <WinRateChart trades={trades} />
            </div>
          </div>
          {/* Recent Trades Snippet could go here, but keeping it clean for now */}
        </div>
      )}

      {/* Trades Journal Tab */}
      {activeTab === 'trades' && (
        <div className="animate-slide-up">
          <TradeList
            trades={trades}
            onDelete={handleDeleteTrade}
            currency={settings.currency}
            onAddTrade={() => setIsTradeModalOpen(true)}
          />
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="h-[calc(100vh-140px)] animate-slide-up">
          <TradingCalendar trades={trades} currency={settings.currency} />
        </div>
      )}

      {/* Analytics Tab (Reusing charts for now) */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-slide-up">
          <div className="bg-slate-900 p-6 rounded-3xl border border-white/5">
            <h2 className="text-white font-bold mb-4">Capital Growth</h2>
            <GrowthChart trades={trades} />
          </div>
          <div className="bg-slate-900 p-6 rounded-3xl border border-white/5">
            <h2 className="text-white font-bold mb-4">Performance Distribution</h2>
            <WinRateChart trades={trades} />
          </div>
        </div>
      )}

      <TradeFormModal
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSave={(s) => setSettings(s)}
      />
    </Layout>
  );
}

export default App;
