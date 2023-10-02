import { createContext, useState } from 'react';
import Loader from './../Components/UI/Loader';

const Context = createContext();

function ContextProvider({ children }) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  return (
    <Context.Provider
      value={{
        search,
        setSearch,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {loading && <Loader />}
      {children}
    </Context.Provider>
  );
}

export { Context, ContextProvider };
