import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, redirect } from "react-router-dom";
import { supabase } from "../supabase/client";
import io from 'socket.io-client';
import { Chat } from "./Chat";


function Chats() {
    const [chats, setChats] = useState([])
    const navigate = useNavigate();

    function chts(cht) {
        setChats((state) => [cht, ...state]);
    }

    useEffect(() => {
    
        if (!supabase.auth.getSession()) {
            navigate('/login');
        }
    }, [navigate])

    useEffect(()=>{
        const conversations =
        supabase.from('messages')
            .select('*')
            .neq('direction', 'output')
            .then(data => {
                data.data.map((msg) => {

                    chts({
                        text: (msg.content.body ? msg.content.body : msg.content),
                        from: (
                            msg.direction === 'input' ? msg.contact_id : msg.user_id
                        ),
                    })
                })


            })

    }, [])

    return (
        <>
            {/* <h1>Chats</h1>
            <input type="text" name="" id="" />
            <button
                className="header-button--logout"
                onClick={() => supabase.auth.signOut()}>Logout</button>

            <ul>
                {
                    chats.map((chat, i) => (
                        <li
                            onClick={()=>(<Chat number={chat.from}/>)}
                            key={i}>
                            <h2>{chat.from}</h2>
                            <p>{chat.text}</p>
                            </li>
                    ))
                }
            </ul> */}


            <Chat
            number={'523511507240'}/>

        </>

    );
}

export { Chats };