import React from "react";
import { useState } from "react";

const Context = React.createContext();

function ContextProvider({ children }) {

    const [num, setNum] = useState('');

    return (
        <Context.Provider value={{
            num, setNum
        }}>
            {children}
        </Context.Provider>
    );
}

export { Context, ContextProvider }