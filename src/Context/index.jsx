import React from "react";
import { useEffect, useState } from "react";
import io from 'socket.io-client';
const socket = io("/");
import { supabase } from "../supabase/client";

const Context = React.createContext();

function ContextProvider({ children }) {

    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [chats, setChats] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    function msgs(msg) { //para que no se reinicie messages cada vez que se le agregue algo
        setMessages((state) => [msg, ...state]);
    }

    function chts(cht) {
        setChats((state) => [...state, cht]);
    }
    
    return (
        <Context.Provider value={{
            messages,
            msgs,
            userId,
            setUserId,
            userName,
            setUserName,
            chats,
            chts,
            search,
            setSearch,
            loading,
            setLoading,
            error,
            setError,
            socket
        }}>
            {children}
        </Context.Provider>
    );
}

export { Context, ContextProvider }