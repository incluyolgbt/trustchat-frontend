import React from 'react';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
const socket = io(import.meta.env.VITE_BACKEND_URL);

const Context = React.createContext();

function ContextProvider({ children }) {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <Context.Provider
      value={{
        userId,
        setUserId,
        userName,
        setUserName,
        search,
        setSearch,
        loading,
        setLoading,
        error,
        setError,
        socket,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export { Context, ContextProvider };
