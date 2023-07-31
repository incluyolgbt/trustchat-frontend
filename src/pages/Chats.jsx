import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabase/client";
import io from 'socket.io-client';
import { Chat } from "./Chat";
import './Chats.css'


function Chats() {
    const [chats, setChats] = useState([])
    const navigate = useNavigate();

    function chts(cht) {
        setChats((state) => [cht, ...state]);
    }

    useEffect(() => {
        if (!supabase.auth.getSession()) {
            navigate('/login');
        } else {
            navigate('/conversations');
        }
    }, [navigate])

    const chatTemps = {}
    useEffect(() => {
        const conversations =
            supabase.from('messages')
                .select('*')
                .then(data => {
                    data.data.map((msg) => {
                        const temp = msg.contact_id;
                        chatTemps[temp] = {
                            text: (msg.content.body ? msg.content.body : msg.content),
                            direction: msg.direction
                        };
                    })
                    chts(chatTemps)
                })
    }, [])

    return (
        <>
            <header className="chats-header--container">
                <h1 className="chats">Chats</h1>
                <div className="chat-header--container--options">
                    <input type="text" className="header-search--chats" />
                    <button
                        className="header-button--logout"
                        onClick={() => supabase.auth.signOut()}>Log out</button>
                </div>
            </header>

            <ul className="chats-container">
                {
                    chats.map((chat, i) => (
                        <li
                            className="chat-info"
                            key={i}>
                            <Link to={`/conversation/${Object.keys(chat)}`}>
                                <h2>{Object.keys(chat)}</h2>
                                <p>{
                                    `${chat[Object.keys(chat)].direction === 'output' ? 'Tú: ' : ''}` +
                                    chat[Object.keys(chat)].text}</p>
                            </Link>


                        </li>
                    ))
                }
            </ul>

        </>

    );
}

export { Chats };