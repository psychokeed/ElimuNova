import { useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'student' | 'instructor';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to access this page.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (requiredRole && profile?.role !== requiredRole) {
      toast({
        title: "Access denied",
        description: `This page is only accessible to ${requiredRole}s.`,
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAuthenticated, profile, requiredRole, navigate, toast]);

  if (!isAuthenticated || (requiredRole && profile?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
