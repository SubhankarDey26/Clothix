import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

/**
 * ProtectedRoute — wraps any route that requires authentication.
 * Pass `requireSeller` to additionally guard seller-only pages.
 *
 * Usage:
 *   <ProtectedRoute><SomePage /></ProtectedRoute>
 *   <ProtectedRoute requireSeller><SellerPage /></ProtectedRoute>
 */
const ProtectedRoute = ({ children, requireSeller = false }) => {
  const { user } = useSelector((state) => state.auth);

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Seller-only route but user is not a seller → redirect to home
  if (requireSeller && user.role !== 'seller') {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
