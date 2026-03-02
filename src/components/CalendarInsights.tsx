import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Target, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getSessionsByDate } from '../services/focusService';
import { FocusSession } from '../services/supabase';

interface CalendarInsightsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CalendarInsights({ isOpen, onClose }: CalendarInsightsProps) {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(false);

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  useEffect(() => {
    if (selectedDate && user) {
      loadSessions(selectedDate);
    }
  }, [selectedDate, user]);

  const loadSessions = async (dateStr: string) => {
    if (!user) return;
    setLoading(true);
    const data = await getSessionsByDate(user.id, dateStr);
    setSessions(data);
    setLoading(false);
  };

  if (!isOpen) return null;

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysArray = Array.from({ length: daysInMonth(currentDate) }, (_, i) => i + 1);
  const firstDay = firstDayOfMonth(currentDate);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => -i - 1);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(null);
    setSessions([]);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(null);
    setSessions([]);
  };

  const handleDateClick = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    setSelectedDate(dateStr);
  };

  const totalFocusMinutes = sessions.reduce((sum, s) => sum + s.duration_minutes, 0);
  const totalSessions = sessions.length;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl"
        style={{ borderRadius: '32px' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{monthName}</h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-gray-100 text-gray-600 transition-all"
                  style={{ borderRadius: '12px' }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-100 text-gray-600 transition-all"
                  style={{ borderRadius: '12px' }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {emptyDays.map((day) => (
                <div key={`empty-${day}`} className="h-10" />
              ))}

              {daysArray.map((day) => {
                const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                  .toISOString()
                  .split('T')[0];
                const isSelected = selectedDate === dateStr;

                return (
                  <motion.button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {day}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div>
            {selectedDate ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">
                    {new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {totalFocusMinutes}
                    <span className="text-lg font-normal text-gray-600 ml-1">min</span>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{totalSessions} sessions</p>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading sessions...</p>
                  </div>
                ) : sessions.length > 0 ? (
                  <div className="space-y-3">
                    {sessions.map((session, idx) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 border border-indigo-200"
                        style={{ borderRadius: '16px' }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <Clock className="text-indigo-600" size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 flex items-center gap-2">
                              {session.session_type === 'focus' && '🎯'}
                              {session.session_type === 'short_break' && '☕'}
                              {session.session_type === 'long_break' && '🌳'}
                              {session.duration_minutes} min {session.session_type}
                            </p>
                            {session.intent && (
                              <p className="text-sm text-gray-700 mt-2 flex items-start gap-2">
                                <Target size={14} className="flex-shrink-0 mt-0.5 text-purple-600" />
                                <span>{session.intent}</span>
                              </p>
                            )}
                            {session.reflection && (
                              <p className="text-sm text-gray-700 mt-2 flex items-start gap-2">
                                <CheckCircle size={14} className="flex-shrink-0 mt-0.5 text-green-600" />
                                <span>{session.reflection}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No sessions on this day</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-gray-600 font-medium">Select a date to view sessions</p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all"
          style={{ borderRadius: '16px' }}
        >
          Close
        </button>
      </motion.div>
    </div>
  );
}
