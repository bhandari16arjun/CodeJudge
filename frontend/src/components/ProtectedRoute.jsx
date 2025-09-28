import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user, status } = useSelector(state => state.auth);
  const { pathname } = useLocation();

  if (status === 'loading') return null;

  const openRoutes = ['/', '/signin', '/signup'];

  if (!isAuthenticated) {
    return openRoutes.includes(pathname)
      ? children
      : <Navigate to="/signin" replace />;
  }

  if (user?.role === 'problemSetter' && pathname !== '/createProblem') {
    return <Navigate to="/createProblem" replace />;
  }

  if (openRoutes.includes(pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
