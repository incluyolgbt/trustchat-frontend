import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../../supabase/client";
import { ChatsList } from "./ChatsList";
import { PopUp } from "../../../modals/PopUp";
import { useOnLine } from "../../../Hooks/useOnLine";
import { ConnectionLost } from "../../../Components/ConnectionLost";
import './Chats.css';

function Chats() {
    const { isOnline } = useOnLine();

    const [chats, setChats] = useState([]);
    function chts(cht) {
        setChats((state) => [...state, cht]);
    }

    const navigate = useNavigate();

    useEffect(() => {
        if (!supabase.auth.getSession()) {
            navigate('/login');
        } else {
            navigate('/conversations');
        }
    }, [navigate])

    var chatTemps = {};
    useEffect(() => {
        try {
            supabase.from('messages') //consulto por todos los mensajes y guardo solo el último  
                .select(`
                *, 
                contacts (name
                    )
                `)
                .then(data => {
                    data.data.map((msg) => {
                        const temp = msg.contact_id;
                        chatTemps[temp] = {
                            name: msg.contacts.name,
                            text: (msg.content.body ? msg.content.body : msg.content),
                            direction: msg.direction
                        };
                    })
                    chts(chatTemps)
                })
        } catch (error) {
            console.error(error)
        }

    }, [navigate])

    return (
        <>
            <header className="chats-header--container">
                <div className="chat-header--container--options">
                    <h1 className="chats">Chats</h1>
                    <button
                        className="header-button--logout"
                        onClick={() => supabase.auth.signOut()}>Log out</button>
                </div>
            </header>

            <ul className="chats-container">
                {
                    chats.map((c, i) => (
                        <ChatsList
                            key={i}
                            c={c} />
                    ))
                }
            </ul>

            {(isOnline ? null :
                <PopUp>
                    <ConnectionLost/>
                </PopUp>)}
        </>

    );
}

export { Chats };