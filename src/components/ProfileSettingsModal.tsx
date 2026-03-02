import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile, uploadProfilePhoto } from '../services/profileService';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: () => void;
}

export default function ProfileSettingsModal({ isOpen, onClose, onProfileUpdated }: ProfileSettingsModalProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadProfile = async () => {
    if (!user) return;
    setLoading(true);
    const profile = await getUserProfile(user.id);
    if (profile) {
      setFullName(profile.full_name);
      setBio(profile.bio);
      setPhotoUrl(profile.profile_photo_url || '');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  if (loading && !fullName) {
    loadProfile();
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setSaving(true);
    const url = await uploadProfilePhoto(user.id, file);
    if (url) {
      setPhotoUrl(url);
    }
    setSaving(false);
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    await updateUserProfile(user.id, {
      full_name: fullName,
      bio: bio,
      profile_photo_url: photoUrl,
    });
    setSaving(false);
    onProfileUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto p-8 shadow-2xl"
        style={{ borderRadius: '32px' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 text-gray-600 transition-all"
            style={{ borderRadius: '12px' }}
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28 mb-4">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                {photoUrl ? (
                  <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  fullName.charAt(0).toUpperCase()
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={saving}
                className="absolute bottom-0 right-0 p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full shadow-lg transition-all disabled:opacity-50"
              >
                <Upload size={16} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={saving}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all"
              style={{ borderRadius: '16px' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent resize-none transition-all"
              style={{ borderRadius: '16px', minHeight: '80px' }}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all"
              style={{ borderRadius: '16px' }}
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold transition-all disabled:opacity-50"
              style={{ borderRadius: '16px' }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
