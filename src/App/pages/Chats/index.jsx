import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../../supabase/client";
import { ChatsList } from "./ChatsList";
import { PopUp } from "../../../modals/PopUp";
import { useOnLine } from "../../../Hooks/useOnLine";
import { ConnectionLost } from "../../../Components/ConnectionLost";
import { Context } from "../../../Desktop/context";
import './Chats.css';

function Chats() {
    const { isOnline } = useOnLine();
    const { deleteGeneralMsgs } = useContext(Context)

    const [chats, setChats] = useState([]);
    function chts(cht) {
        setChats((state) => [...state, cht]);
    }

    const handleLogOut = () => {
        deleteGeneralMsgs();
        supabase.auth.signOut();
    }

    const navigate = useNavigate();

    useEffect(() => {
        if (!supabase.auth.getSession()) {
            navigate('/login');
        } else {
            // navigate('/conversations');
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
                        onClick={handleLogOut}>Log out</button>
                </div>
            </header>

            <div
                className="chat-info">
                <Link to={`/conversations/general`}>
                    <img className="chat-info--photo--chatList" src='https://avatars.githubusercontent.com/u/142632036?s=200&v=4' />
                    <h2 className="chat-info--user">Incluyo general</h2>
                    <p className="chat-info--message"> Hola</p>
                </Link>
            </div>

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
                    <ConnectionLost />
                </PopUp>)}
        </>

    );
}

export { Chats };