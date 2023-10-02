import { createContext } from 'react';
import { useState } from 'react';
import { useLocalStorage } from '../../Hooks/useLocalStorage';

const Context = createContext();

function ContextProvider({ children }) {
  const [num, setNum] = useState('');

  const {
    item: generalMsg,
    saveItem: saveGeneralMsg,
    deleteItems: deleteGeneralMsgs,
  } = useLocalStorage('generalMsgs', []);

  return (
    <Context.Provider
      value={{
        num,
        setNum,
        generalMsg,
        saveGeneralMsg,
        deleteGeneralMsgs,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export { Context, ContextProvider };
