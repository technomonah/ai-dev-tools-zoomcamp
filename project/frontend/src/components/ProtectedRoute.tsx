import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LeprecoinLogo from './LeprecoinLogo';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <LeprecoinLogo size={48} className="animate-pulse" />
          <span className="text-xl text-text-secondary">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
