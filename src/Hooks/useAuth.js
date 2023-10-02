import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { supabase } from '../supabase/client';
import { useLocalStorage } from './useLocalStorage';
import { useConnection } from './useConnection';

function useAuth() {
  const { setAuthUser, setAuthSocket, authSocket } = useContext(AuthContext);
  const { handleSocketAuth, handleSocketUnauth } = useConnection();

  const { deleteItems: deleteGeneralMsgs } = useLocalStorage('generalMsgs', []);

  const handlePasswordLogin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      data.user.name = await fetchUserName(data.user.id);
      setAuthUser(data.user);

      let socket = handleSocketAuth(data.user.id, data.user.name);
      if (socket && !authSocket) {
        setAuthSocket(socket);
      }
    }

    return { user: data.user, error };
  };

  const handleLogout = () => {
    deleteGeneralMsgs();
    handleSocketUnauth(authSocket);
    supabase.auth.signOut();
    setAuthUser(null);
  };

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

  return {
    handlePasswordLogin,
    handleLogout,
    fetchUserName,
  };
}

export { useAuth };
