import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ReflectionModalProps {
  isOpen: boolean;
  onSubmit: (reflection: string) => void;
  intent?: string;
}

export default function ReflectionModal({ isOpen, onSubmit, intent }: ReflectionModalProps) {
  const [reflection, setReflection] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(reflection);
    setSubmitted(true);
    setTimeout(() => {
      setReflection('');
      setSubmitted(false);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-white w-full max-w-md p-8 text-center shadow-2xl"
          style={{ borderRadius: '32px' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-block p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-4"
          >
            <Check className="text-green-600" size={32} />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Excellent Work!</h3>
          <p className="text-gray-600">Your session and reflection have been saved.</p>
        </motion.div>
      </div>
    );
  }

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
          <div className="inline-block p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-4">
            <Check className="text-green-600" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Session Complete!</h2>
          <p className="text-gray-600 text-sm mt-2">What did you actually achieve?</p>
        </div>

        {intent && (
          <div className="mb-4 p-3 bg-indigo-50 rounded-xl border border-indigo-200">
            <p className="text-xs text-indigo-600 font-medium mb-1">Your Intention</p>
            <p className="text-sm text-indigo-900">{intent}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Share what you accomplished, challenges faced, or next steps..."
            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent resize-none transition-all"
            style={{ borderRadius: '20px', minHeight: '100px' }}
            autoFocus
          />

          <button
            type="submit"
            className="w-full px-4 py-3 bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white font-semibold transition-all"
            style={{ borderRadius: '16px' }}
          >
            Save Reflection
          </button>
        </form>
      </motion.div>
    </div>
  );
}
