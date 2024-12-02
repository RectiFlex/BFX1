import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  return function WithAuthComponent(props: any) {
    const { currentUser, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!loading && !currentUser) {
        navigate('/login');
      }
    }, [currentUser, loading, navigate]);

    if (loading) {
      return <div>Loading...</div>;
    }

    return currentUser ? <WrappedComponent {...props} /> : null;
  };
};

export const checkAuth = () => {
  const { currentUser } = useAuth();
  return !!currentUser;
};
