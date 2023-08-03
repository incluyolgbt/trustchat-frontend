import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../supabase/client";
import { ChatsList } from "./ChatsList";
import './Chats.css'
import { Context } from "../../Context";


function Chats() {
    const {
        chats,
        setSearch,
    } = React.useContext(Context); 
    const navigate = useNavigate();
    useEffect(() => {
        if (!supabase.auth.getSession()) {
            navigate('/login');
        } else {
            navigate('/conversations');
        }
    }, [navigate])

    return (
        <>
            <header className="chats-header--container">
                <h1 className="chats">Chats</h1>
                <div className="chat-header--container--options">
                    <input type="text" className="header-search--chats" onChange={(e) => setSearch(e.target.value)} />
                    <button
                        className="header-button--logout"
                        onClick={async() => await supabase.auth.signOut()}>Log out</button>
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

        </>

    );
}

export { Chats };