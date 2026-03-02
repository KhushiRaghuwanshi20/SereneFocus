import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDailyFocusMinutes } from '../services/focusService';
import { useAuth } from '../context/AuthContext';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AnalyticsModal({ isOpen, onClose }: AnalyticsModalProps) {
  const { user } = useAuth();
  const [data, setData] = useState<{ date: string; minutes: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      loadData();
    }
  }, [isOpen, user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    const focusData = await getDailyFocusMinutes(user.id, 7);

    const formattedData = focusData.map((item) => ({
      date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
      minutes: item.minutes,
    }));

    setData(formattedData);
    setLoading(false);
  };

  if (!isOpen) return null;

  const totalMinutes = data.reduce((sum, item) => sum + item.minutes, 0);
  const avgMinutes = totalMinutes > 0 ? Math.round(totalMinutes / 7) : 0;
  const completedSessions = data.reduce((sum, item) => sum + Math.floor(item.minutes / 25), 0);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className="bg-white w-full max-w-3xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ borderRadius: '32px' }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Insights</h2>
            <p className="text-gray-600 text-sm mt-1">Your 7-day focus analytics</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 text-gray-600 transition-all"
            style={{ borderRadius: '12px' }}
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-4" style={{ borderRadius: '20px' }}>
            <p className="text-sm text-gray-600 font-medium">Total Focus Time</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{totalMinutes}</p>
            <p className="text-xs text-gray-500 mt-1">minutes</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4" style={{ borderRadius: '20px' }}>
            <p className="text-sm text-gray-600 font-medium">Daily Average</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{avgMinutes}</p>
            <p className="text-xs text-gray-500 mt-1">minutes/day</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4" style={{ borderRadius: '20px' }}>
            <p className="text-sm text-gray-600 font-medium">Sessions Completed</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{completedSessions}</p>
            <p className="text-xs text-gray-500 mt-1">sessions</p>
          </div>
        </div>

        <div className="bg-gray-50/50 p-6" style={{ borderRadius: '24px' }}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Focus Minutes</h3>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">Loading data...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  cursor={{ fill: 'rgba(94, 234, 212, 0.1)' }}
                />
                <Bar dataKey="minutes" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5eead4" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
