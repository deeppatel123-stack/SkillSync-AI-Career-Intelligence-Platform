import { Navigate, useLocation } from 'react-router-dom';
import { getSession, getDashboardPath } from '../utils/userSession';

export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = session.role || 'student';
    // Allow superadmin access to admin paths, and normalize organizer/college
    const normalizedRole = userRole === 'superadmin' ? 'admin' : userRole === 'organizer' ? 'college' : userRole;
    
    const isAllowed = allowedRoles.some((role) => {
      if (role === 'admin') return userRole === 'admin' || userRole === 'superadmin';
      if (role === 'college') return userRole === 'college' || userRole === 'organizer';
      return role === normalizedRole;
    });

    if (!isAllowed) {
      return <Navigate to={getDashboardPath(userRole)} replace />;
    }
  }

  return children;
}
