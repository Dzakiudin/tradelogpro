import { useEffect, useState, lazy, Suspense } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthForm } from './components/Auth/AuthForm';
import { Layout } from './components/Layout/Layout';
import { StatsCards } from './components/Dashboard/StatsCards';
import { TargetProgress } from './components/Dashboard/TargetProgress';
import { TradeList } from './components/Trades/TradeList';
import { TradeFormModal } from './components/Trades/TradeFormModal';
import { SettingsModal } from './components/Settings/SettingsModal';
import { collection, doc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db, appId } from './lib/firebase';
import type { Trade, UserSettings } from './types';

// Lazy load heavy components for code splitting
const GrowthChart = lazy(() => import('./components/Charts/GrowthChart').then(m => ({ default: m.GrowthChart })));
const WinRateChart = lazy(() => import('./components/Charts/WinRateChart').then(m => ({ default: m.WinRateChart })));
const TimeAnalysis = lazy(() => import('./components/Analytics/TimeAnalysis').then(m => ({ default: m.TimeAnalysis })));
const TradingCalendar = lazy(() => import('./components/Calendar/TradingCalendar').then(m => ({ default: m.TradingCalendar })));

// Loading skeleton for lazy components
const ChartSkeleton = () => (
    <div className="animate-pulse bg-surface-container-low rounded-sm shadow-sm h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
);

function App() {
  const { currentUser, loading } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [settings, setSettings] = useState<UserSettings>({ currency: 'USD', monthlyTarget: 0 });

  // UI State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editTrade, setEditTrade] = useState<Trade | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setTrades([]);
      return;
    }

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
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'trades', id));
    } catch (error) {
      console.error("Error deleting trade:", error);
    }
  };

  const handleEditTrade = (trade: Trade) => {
    setEditTrade(trade);
    setIsTradeModalOpen(true);
  };

  const handleCloseTradeModal = () => {
    setIsTradeModalOpen(false);
    setEditTrade(null);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="text-slate-500 text-sm font-label font-bold uppercase tracking-widest animate-pulse">Loading...</p>
    </div>
  );

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
              <Suspense fallback={<ChartSkeleton />}>
                <GrowthChart trades={trades} />
              </Suspense>
            </div>
            <div>
              <Suspense fallback={<ChartSkeleton />}>
                <WinRateChart trades={trades} />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {/* Trades Journal Tab */}
      {activeTab === 'trades' && (
        <div className="animate-slide-up">
          <TradeList
            trades={trades}
            onDelete={handleDeleteTrade}
            onEdit={handleEditTrade}
            currency={settings.currency}
            onAddTrade={() => setIsTradeModalOpen(true)}
          />
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="animate-slide-up pb-8">
          <Suspense fallback={<ChartSkeleton />}>
            <TradingCalendar trades={trades} currency={settings.currency} />
          </Suspense>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-slide-up pb-8">
          <Suspense fallback={<ChartSkeleton />}>
            <TimeAnalysis trades={trades} currency={settings.currency} />
          </Suspense>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Suspense fallback={<ChartSkeleton />}>
              <GrowthChart trades={trades} />
            </Suspense>
            <Suspense fallback={<ChartSkeleton />}>
              <WinRateChart trades={trades} />
            </Suspense>
          </div>
        </div>
      )}

      <TradeFormModal
        isOpen={isTradeModalOpen}
        onClose={handleCloseTradeModal}
        editTrade={editTrade}
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
