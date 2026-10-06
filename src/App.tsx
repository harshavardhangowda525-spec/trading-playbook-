import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './lib/auth';
import { Background } from './components/Background';
import { CelebrationOverlay } from './components/Celebration';
import { Layout } from './components/Layout';
import { AuthScreen, BootScreen } from './pages/AuthScreen';
import { Dashboard } from './pages/Dashboard';
import { MyDay } from './pages/MyDay';
import { TradingSchedule } from './pages/TradingSchedule';
import { HistoryPage } from './pages/History';
import { WeeklyReview } from './pages/WeeklyReview';
import { Journey } from './pages/Journey';
import { Lesson } from './pages/Lesson';
import { Engine } from './pages/Engine';
import { EvaluationPage } from './pages/Evaluation';
import { ChartPractice } from './pages/ChartPractice';
import { Backtesting } from './pages/Backtesting';
import { Simulation } from './pages/Simulation';
import { TradingJournal } from './pages/TradingJournal';
import { PracticeLab } from './pages/PracticeLab';
import { MistakeLab } from './pages/MistakeLab';
import { StrategyLab } from './pages/StrategyLab';
import { PlaybookPage } from './pages/Playbook';
import { Vault } from './pages/Vault';
import { DailyJournal } from './pages/DailyJournal';
import { Psychology } from './pages/Psychology';
import { Analytics } from './pages/Analytics';
import { SettingsPage } from './pages/Settings';

export function App() {
  const { mode, loading, userId, dataReady } = useAuth();

  let content;
  if (loading) content = <BootScreen label="RESTORING SESSION" />;
  else if (mode === 'cloud' && !userId) content = <AuthScreen />;
  else if (!dataReady) content = <BootScreen label="LOADING YOUR COMMAND CENTER" />;
  else
    content = (
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="my-day" element={<MyDay />} />
            <Route path="trading-schedule" element={<TradingSchedule />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="weekly" element={<WeeklyReview />} />
            <Route path="journey" element={<Journey />} />
            <Route path="journey/:day" element={<Lesson />} />
            <Route path="engine" element={<Engine />} />
            <Route path="evaluation" element={<EvaluationPage />} />
            <Route path="chart-practice" element={<ChartPractice />} />
            <Route path="backtesting" element={<Backtesting />} />
            <Route path="simulation" element={<Simulation />} />
            <Route path="trading-journal/*" element={<TradingJournal />} />
            <Route path="trading/*" element={<PracticeLab />} />
            <Route path="mistakes" element={<MistakeLab />} />
            <Route path="strategy-lab" element={<StrategyLab />} />
            <Route path="playbook" element={<PlaybookPage />} />
            <Route path="vault" element={<Vault />} />
            <Route path="daily-journal" element={<DailyJournal />} />
            <Route path="psychology" element={<Psychology />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    );

  return (
    <>
      <Background />
      {content}
      <CelebrationOverlay />
    </>
  );
}
