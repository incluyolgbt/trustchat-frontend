import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../Components/SessionManagement/Login';
import { NotFound } from '../Components/NotFound';
import { Dashboard } from './Dashboard';
import { Welcome } from './components/Welcome';
import { General } from './components/General';
import { ContextProvider } from './context';
import { Chat } from './components/chat';
import { Admin } from '../App/pages/Admin/Admin';
import { PasswordReset } from '../Components/SessionManagement/PasswordReset';
import { PrivateRoutes } from '../Components/AppRouting/PrivateRoutes';
import { AuthContextProvider } from '../Context/AuthContext';

function Desktop() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route element={<PrivateRoutes />}>
          <Route path='/' element={<Navigate to='/conversations' />} />
          <Route path='/conversations' element={<Dashboard />}>
            <Route
              path=''
              element={
                <ContextProvider>
                  <Welcome />
                </ContextProvider>
              }
            />
            <Route
              path='general'
              element={
                <ContextProvider>
                  <General />
                </ContextProvider>
              }
            />
            <Route
              path=':slug'
              element={
                <ContextProvider>
                  <Chat />
                </ContextProvider>
              }
            />
          </Route>
          <Route path='/admin' element={<Admin />} />
          <Route path='/resetPassword' element={<PasswordReset />} />
          <Route path='/notfound' element={<NotFound />} />
          <Route path='*' element={<Navigate to='/notfound' />} />
        </Route>
      </Routes>
    </AuthContextProvider>
  );
}

export { Desktop };
