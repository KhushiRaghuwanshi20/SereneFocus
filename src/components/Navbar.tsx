import { useState, useEffect } from 'react';
import { LogOut, BarChart3, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../services/profileService';
import { UserProfile } from '../services/supabase';

interface NavbarProps {
  onOpenAnalytics: () => void;
  onOpenCalendar: () => void;
  onOpenSettings: () => void;
}

export default function Navbar({ onOpenAnalytics, onOpenCalendar, onOpenSettings }: NavbarProps) {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    const data = await getUserProfile(user.id);
    if (data) {
      setProfile(data);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const fullName = profile?.full_name || 'Khushi Raghuwanshi';
  const bio = profile?.bio || '3rd Year CSE Student';
  const photoUrl = profile?.profile_photo_url;

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌸</span>
          <div>
            <h1 className="text-xl font-bold text-gray-800">SereneFocus</h1>
            <p className="text-xs text-gray-500">Mindful Productivity</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onOpenCalendar}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"
            style={{ borderRadius: '16px' }}
          >
            📅
            <span>Calendar</span>
          </button>

          <button
            onClick={onOpenAnalytics}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-400 to-cyan-400 text-white font-medium hover:from-teal-500 hover:to-cyan-500 transition-all shadow-md hover:shadow-lg"
            style={{ borderRadius: '16px' }}
          >
            <BarChart3 size={18} />
            <span>Insights</span>
          </button>

          <div className="flex items-center gap-3 px-3 py-2 bg-gray-50/50" style={{ borderRadius: '20px' }}>
            <button
              onClick={onOpenSettings}
              className="relative w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg overflow-hidden hover:shadow-lg transition-all group"
            >
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                fullName.charAt(0).toUpperCase()
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                <Settings size={14} className="opacity-0 group-hover:opacity-100 transition-all text-white" />
              </div>
            </button>

            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-800">{fullName}</p>
              <p className="text-xs text-gray-500">{bio}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all"
            style={{ borderRadius: '12px' }}
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
