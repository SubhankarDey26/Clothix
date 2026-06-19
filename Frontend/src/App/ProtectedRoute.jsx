import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

/**
 * ProtectedRoute — wraps any route that requires authentication.
 * Pass `requireSeller` to additionally guard seller-only pages.
 *
 * Uses the dedicated `authChecked` flag (not the shared `loading`)
 * to wait for the initial /me session check to finish before deciding
 * whether to render children or redirect.
 *
 * Usage:
 *   <ProtectedRoute><SomePage /></ProtectedRoute>
 *   <ProtectedRoute requireSeller><SellerPage /></ProtectedRoute>
 */
const ProtectedRoute = ({ children, requireSeller = false }) => {
  const { user, authChecked } = useSelector((state) => state.auth);

  // Initial /me check hasn't finished yet → show a loading spinner
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-500 text-sm">Verifying session…</p>
        </div>
      </div>
    );
  }

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
