import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Timer from './Timer';
import AnalyticsModal from './AnalyticsModal';
import CalendarInsights from './CalendarInsights';
import ProfileSettingsModal from './ProfileSettingsModal';

export default function Dashboard() {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(0);

  const handleSessionComplete = () => {
    setSessionCompleted(true);
    setTimeout(() => setSessionCompleted(false), 5000);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-1000 ${
        sessionCompleted
          ? 'bg-gradient-to-br from-[#f0fff4] via-[#dcfce7] to-[#bbf7d0]'
          : 'bg-gradient-to-br from-[#FFFDF5] via-[#FFF8E7] to-[#FFF4E0]'
      }`}
    >
      <Navbar
        onOpenAnalytics={() => setShowAnalytics(true)}
        onOpenCalendar={() => setShowCalendar(true)}
        onOpenSettings={() => setShowSettings(true)}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
              Focus & Flow
            </h2>
            <p className="text-gray-600 text-lg">
              One session at a time, build your best self
            </p>
          </div>

          <Timer onSessionComplete={handleSessionComplete} />
        </motion.div>

        {sessionCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-8 right-8 bg-white shadow-2xl px-6 py-4 max-w-sm"
            style={{ borderRadius: '24px' }}
          >
            <p className="text-2xl mb-2">🎉</p>
            <p className="font-bold text-gray-800">Session Complete!</p>
            <p className="text-sm text-gray-600 mt-1">Great focus! Take a well-deserved break.</p>
          </motion.div>
        )}
      </main>

      <AnalyticsModal isOpen={showAnalytics} onClose={() => setShowAnalytics(false)} />
      <CalendarInsights isOpen={showCalendar} onClose={() => setShowCalendar(false)} />
      <ProfileSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onProfileUpdated={() => {
          setProfileUpdated(p => p + 1);
          setShowSettings(false);
        }}
      />
    </div>
  );
}
