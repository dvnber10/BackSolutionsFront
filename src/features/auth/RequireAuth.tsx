import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spinner } from '../../components/ui/Spinner';
import { useAuth } from './useAuth';

/** Guarda de rutas del panel: sin sesión, redirige al login recordando el destino. */
export function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <div className="route-loader">
        <Spinner size="lg" />
      </div>
    );
  }

  if (status === 'anonymous') {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
