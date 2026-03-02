import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTimer } from '../hooks/useTimer';
import { createFocusSession, completeFocusSession } from '../services/focusService';
import { SessionType } from '../services/supabase';
import IntentModal from './IntentModal';
import ReflectionModal from './ReflectionModal';

interface TimerProps {
  onSessionComplete: () => void;
}

export default function Timer({ onSessionComplete }: TimerProps) {
  const { timeLeft, isRunning, isCompleted, initialDuration, start, pause, reset, formatTime, progress } =
    useTimer(25);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [customMinutes, setCustomMinutes] = useState('25');
  const [sessionType, setSessionType] = useState<SessionType>('focus');
  const [showIntentModal, setShowIntentModal] = useState(false);
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [currentIntent, setCurrentIntent] = useState('');

  useEffect(() => {
    if (isCompleted && sessionId) {
      setShowReflectionModal(true);
    }
  }, [isCompleted, sessionId]);

  const handleStart = async () => {
    if (!sessionId && !isRunning) {
      setShowIntentModal(true);
    } else {
      start();
    }
  };

  const handleIntentSubmit = async (intent: string) => {
    setCurrentIntent(intent);
    setShowIntentModal(false);

    const session = await createFocusSession(initialDuration, sessionType, intent);
    if (session) {
      setSessionId(session.id);
    }
    start();
  };

  const handleReflectionSubmit = async (reflection: string) => {
    if (sessionId) {
      await completeFocusSession(sessionId, reflection);
    }
    setShowReflectionModal(false);
    onSessionComplete();
    setSessionId(null);
    setCurrentIntent('');
  };

  const handleReset = () => {
    setSessionId(null);
    reset();
    setCurrentIntent('');
  };

  const handleSessionTypeClick = (type: SessionType) => {
    setSessionId(null);
    setSessionType(type);
    const durations: Record<SessionType, number> = {
      focus: 25,
      short_break: 5,
      long_break: 15,
    };
    reset(durations[type]);
    setCustomMinutes(durations[type].toString());
  };

  const sessionTypes: { type: SessionType; label: string; emoji: string; color: string }[] = [
    { type: 'focus', label: 'Focus', emoji: '🎯', color: 'from-indigo-400 to-purple-500' },
    { type: 'short_break', label: 'Short Break', emoji: '☕', color: 'from-teal-400 to-cyan-400' },
    { type: 'long_break', label: 'Long Break', emoji: '🌳', color: 'from-green-400 to-emerald-400' },
  ];

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="flex gap-2 justify-center mb-8 flex-wrap">
          {sessionTypes.map((st) => (
            <motion.button
              key={st.type}
              onClick={() => handleSessionTypeClick(st.type)}
              disabled={isRunning}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-white ${
                sessionType === st.type
                  ? `bg-gradient-to-r ${st.color}`
                  : 'bg-gray-200 text-gray-700'
              }`}
              style={{ borderRadius: '20px' }}
            >
              <span>{st.emoji}</span>
              <span>{st.label}</span>
            </motion.button>
          ))}
        </div>

        <div
          className="bg-white/90 backdrop-blur-sm p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
          style={{ borderRadius: '32px' }}
        >
          <div className="relative">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="85" stroke="#f0f0f0" strokeWidth="12" fill="none" />
              <circle
                cx="100"
                cy="100"
                r="85"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 85}`}
                strokeDashoffset={`${2 * Math.PI * 85 * (1 - progress / 100)}`}
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl md:text-7xl font-bold text-gray-800 tracking-tight">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm text-gray-500 mt-2 font-medium">
                  {isCompleted ? 'Session Complete!' : isRunning ? 'Focus Time' : 'Ready to Focus'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8 justify-center">
            <button
              onClick={isRunning ? pause : handleStart}
              disabled={timeLeft === 0 && !isRunning}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{ borderRadius: '20px' }}
            >
              {isRunning ? (
                <>
                  <Pause size={20} />
                  Pause
                </>
              ) : (
                <>
                  <Play size={20} />
                  {timeLeft === initialDuration * 60 ? 'Start' : 'Resume'}
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              style={{ borderRadius: '20px' }}
            >
              <RotateCcw size={20} />
              Reset
            </button>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm font-medium text-gray-700 mb-4 text-center">Custom Duration</p>
          <div className="flex gap-2 items-center justify-center">
            <input
              type="number"
              min="1"
              max="120"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              disabled={isRunning}
              className="w-20 px-3 py-2 bg-white/80 border border-gray-200 text-gray-800 text-center font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50"
              style={{ borderRadius: '16px' }}
              placeholder="25"
            />
            <button
              onClick={() => {
                const minutes = parseInt(customMinutes, 10);
                if (!isNaN(minutes) && minutes > 0 && minutes <= 120) {
                  setSessionId(null);
                  reset(minutes);
                }
              }}
              disabled={isRunning}
              className="px-4 py-2 bg-white/80 hover:bg-white text-gray-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              style={{ borderRadius: '16px' }}
            >
              Set
            </button>
          </div>
        </div>
      </motion.div>

      <IntentModal isOpen={showIntentModal} onSubmit={handleIntentSubmit} onCancel={() => setShowIntentModal(false)} />
      <ReflectionModal isOpen={showReflectionModal} onSubmit={handleReflectionSubmit} intent={currentIntent} />
    </div>
  );
}
