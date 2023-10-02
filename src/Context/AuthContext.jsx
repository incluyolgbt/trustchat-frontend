import { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { useConnection } from '../Hooks/useConnection';
import { useLocalStorage } from '../Hooks/useLocalStorage';
import Loader from '../Components/UI/Loader';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

const AuthContextProvider = ({ children }) => {
  const { handleSocketAuth, handleSocketUnauth } = useConnection();
  const { deleteItems: deleteGeneralMsgs } = useLocalStorage('generalMsgs', []);
  const navigate = useNavigate();

  const [authUser, setAuthUser] = useState(null);
  const [authSocket, setAuthSocket] = useState(null);
  const [isBusy, setIsBusy] = useState(true);

  const fetchUserName = async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('name')
      .eq('id', userId);

    if (!error && data.length) {
      return data[0].name;
    } else {
      return 'amigue';
    }
  };

  /**
   * Por seguridad, cerramos automáticamente sesiones
   * guardadas después de 50 minutos.
   */
  const checkForSessionTimeout = async (expires_at) => {
    const now = new Date();
    const expiration = new Date(expires_at * 1000);
    const diffMinutes = Math.floor(Math.abs(expiration - now) / 1000 / 60);

    if (diffMinutes < 10) {
      deleteGeneralMsgs();
      handleSocketUnauth(authSocket);
      supabase.auth.signOut();
      setAuthUser(null);
      navigate('/login');
      return;
    }
  };

  useEffect(() => {
    const checkForActiveSession = async () => {
      // Mostrar loader mientras se realizan operaciones async
      setIsBusy(true);

      const { data } = await supabase.auth.getSession();

      if (data.session) {
        const { user, expires_at } = data.session;

        await checkForSessionTimeout(expires_at);

        user.name = await fetchUserName(user.id);
        setAuthUser(user);

        let socket = handleSocketAuth(user.id, user.name);
        if (socket) {
          setAuthSocket(socket);
        }
      }

      // Ocultar loader al terminar
      setIsBusy(false);
    };

    checkForActiveSession();

    return () => {
      handleSocketUnauth();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ authUser, setAuthUser, authSocket, setAuthSocket }}
    >
      {isBusy === true && <Loader />}
      {isBusy === false && children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
