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

    // //Todas las consultas a base de datos
    // var chatTemps = {};
    // var numbers = [];
    // useEffect(() => {
    //     try {
    //         supabase.from('messages') //consulto por todos los mensajes y guardo solo el último  
    //             .select('*')
    //             .then(data => {
    //                 data.data.map((msg) => {
    //                     const temp = msg.contact_id;
    //                     chatTemps[temp] = {
    //                         text: (msg.content.body ? msg.content.body : msg.content),
    //                         direction: msg.direction
    //                     };
    //                 })
    //                 numbers = Object.keys(chatTemps);
    //                 console.log(numbers);
    //                 chts(chatTemps)
    //             })

            
            
    //         //Buscar nombres de usuarie
    //         // supabase.from('contacts').select('*').eq('wa_num', number).then(data => {
    //         //     setUserName(data.data[0].name)
    //         // })

    //         //buscar en  un bucle for los diferentes slugs
    //         // supabase.from('messages') //Busca los mensajes en base de datos
    //         //     .select('*')
    //         //     .eq('contact_id', number)
    //         //     .then(data => {
    //         //         data.data.map((msg) => {
    //         //             msgs(
    //         //                 {
    //         //                     text: (msg.content.body ? msg.content.body : msg.content),
    //         //                     from: (
    //         //                         msg.direction === 'input' ? msg.contact_id : msg.user_id
    //         //                     ),
    //         //                     to: (
    //         //                         msg.direction === 'output' ? msg.contact_id : msg.user_id
    //         //                     ),
    //         //                     type: msg.type,
    //         //                     messageId: msg.id,
    //         //                 }
    //         //             )
    //         //         })


    //         //     })

    //         setLoading(false);
    //     } catch (error) {
    //         console.error(error)
    //         setError(true);
    //     }

    //     supabase.auth.getSession().then(data => {
    //         console.log(data.data.session.user.id)
    //         setUserId(data.data.session.user.id); // busca user_id en base de datos
    //     })
        
    // }, [])
    
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