import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, redirect } from "react-router-dom";
import { supabase } from "../supabase/client";
import io from 'socket.io-client';


function Chats() {
    const [chats, setChats] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (!supabase.auth.getSession()) {
            navigate('/login');
        }
    }, [navigate])

    useEffect(()=>{
        const conversations = supabase.from('messages').select('*').then(data => {
            setChats(data.data);
            console.log(chats[0])
        })
    }, [])

    return (
        <>
            <h1>Chats</h1>
            <button
                className="header-button--logout"
                onClick={() => supabase.auth.signOut()}>Logout</button>
            <input type="text" name="" id="" />
            <ul>
                <li>hola</li>
            </ul>
            <button
                className="chat"
                onClick={() => redirect('/conversation')}>chat</button>

        </>

    );
}

export { Chats };