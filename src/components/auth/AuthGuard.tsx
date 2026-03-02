import { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import SignIn from './SignIn';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFFDF5] to-[#FFF8E7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-6xl mb-4">🌸</div>
          <p className="text-gray-600 font-medium">Loading SereneFocus...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <SignIn />;
  }

  return <>{children}</>;
}
