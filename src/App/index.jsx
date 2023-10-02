import { Login } from '../Components/SessionManagement/Login';
import { Chat } from './pages/Chat';
import { Chats } from './pages/Chats';
import { NotFound } from '../Components/NotFound';
import { Routes, Route, Navigate } from 'react-router-dom';
import { General } from './pages/General';
import { ContextProvider } from '../Desktop/context';
import { Admin } from './pages/Admin/Admin';
import { PasswordReset } from '../Components/SessionManagement/PasswordReset';
import { AuthContextProvider } from '../Context/AuthContext';
import { PrivateRoutes } from '../Components/AppRouting/PrivateRoutes';
import './App.css';

export default function App() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route element={<PrivateRoutes />}>
          <Route path='/' element={<Navigate to='/conversations' />} />
          <Route
            path='/conversations'
            element={
              <ContextProvider>
                <Chats />
              </ContextProvider>
            }
          />
          <Route
            path='/conversations/general'
            element={
              <ContextProvider>
                <General />
              </ContextProvider>
            }
          />
          <Route
            path='/conversations/:slug'
            element={
              <ContextProvider>
                <Chat />
              </ContextProvider>
            }
          />
          <Route path='/admin' element={<Admin />} />
          <Route path='/resetPassword' element={<PasswordReset />} />
          <Route path='/notfound' element={<NotFound />} />
          <Route path='*' element={<Navigate to='/notfound' />} />
        </Route>
      </Routes>
    </AuthContextProvider>
  );
}
