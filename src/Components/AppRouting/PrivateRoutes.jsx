import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';

const PrivateRoutes = () => {
  const { authUser } = useContext(AuthContext);
  return authUser ? <Outlet /> : <Navigate to='/login' />;
};

export { PrivateRoutes };
