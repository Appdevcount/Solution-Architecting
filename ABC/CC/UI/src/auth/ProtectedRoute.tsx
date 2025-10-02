/* istanbul ignore file */
import { PropsWithChildren } from 'react';
import { RootState } from '../state/store/store';
import { useSelector } from 'react-redux';

interface ProtectedRouteProps extends PropsWithChildren {
  allowedRoles?: string[];//Array<User['roles']>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {

  const currentUser = useSelector((state: RootState) => state.auth.user);
  if (currentUser === undefined) {
    return <div>Loading...</div>;
  }

  if (!currentUser || (allowedRoles && !allowedRoles.some(role=>currentUser.roles.includes(role)))) {
    return <div>Permission denied</div>;//<Navigate to="/login" />
  }

  return <>{children}</>;
};

export default ProtectedRoute;
