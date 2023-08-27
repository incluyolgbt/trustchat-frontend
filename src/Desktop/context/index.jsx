import React from "react";
import { useState } from "react";
import { useAuth } from "../../Hooks/useAuth";
import { useConnection } from "../../Hooks/useConnection";
import { useLocalStorage } from "../../Hooks/useLocalStorage";

const Context = React.createContext();

function ContextProvider({ children }) {
    const [num, setNum] = useState('');
    const { connection, socket } = useConnection();
    const { userId, name } = useAuth(socket, connection);
    const {item: generalMsg, saveItem: saveGeneralMsg} = useLocalStorage('generalMsgs', [])

    return (
        <Context.Provider value={{
            num, setNum, generalMsg, saveGeneralMsg, name, userId, connection, socket
        }}>
            {children}
        </Context.Provider>
    );
}

export { Context, ContextProvider }