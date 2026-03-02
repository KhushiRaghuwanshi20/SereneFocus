import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface IntentModalProps {
  isOpen: boolean;
  onSubmit: (intent: string) => void;
  onCancel: () => void;
}

export default function IntentModal({ isOpen, onSubmit, onCancel }: IntentModalProps) {
  const [intent, setIntent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(intent);
    setIntent('');
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white w-full max-w-md p-8 shadow-2xl"
        style={{ borderRadius: '32px' }}
      >
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-4">
            <Sparkles className="text-indigo-600" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Set Your Intention</h2>
          <p className="text-gray-600 text-sm mt-2">What will you achieve in this session?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            placeholder="e.g., Complete project proposal, Review code, Study chapter 5..."
            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent resize-none transition-all"
            style={{ borderRadius: '20px', minHeight: '100px' }}
            autoFocus
            required
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all"
              style={{ borderRadius: '16px' }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!intent.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderRadius: '16px' }}
            >
              Start Focus
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
