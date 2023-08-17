import React from "react";
import { useState } from "react";
import { useAuth } from "../../Hooks/useAuth";
import { useConnection } from "../../Hooks/useConnection";

const Context = React.createContext();

function ContextProvider({ children }) {

    const [num, setNum] = useState('');
    const { connection, socket } = useConnection();
    const { userId } = useAuth(socket, connection);

    return (
        <Context.Provider value={{
            num, setNum, userId, connection, socket
        }}>
            {children}
        </Context.Provider>
    );
}

export { Context, ContextProvider }