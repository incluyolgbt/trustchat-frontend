import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../../supabase/client";
import { ChatsList } from "./ChatsList";
import { PopUp } from "../../../modals/PopUp";
import { useOnLine } from "../../../Hooks/useOnLine";
import { ConnectionLost } from "../../../Components/ConnectionLost";
import { Context } from "../../../Desktop/context";
import { v4 } from 'uuid';
import './Chats.css';

function Chats() {
    const { isOnline } = useOnLine();
    const { deleteGeneralMsgs } = useContext(Context)
    const [key, setKey] = useState(1);

    const [chats, setChats] = useState([]);
    function chts(cht) {
        setChats(cht);
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

    const susbscribeForChanges = () => {
        supabase
            .channel('custom-insert-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'messages' },
                () => {
                    console.log('Mensaje nuevo recibido');
                    loadChatList();
                    setKey(key + 1);
                }
            )
            .subscribe();
    };


    const loadChatList = async () => {
        var chatTemps = {};
        let { data, error } = await supabase.rpc('user_fetch_conv_list');
        data.map(msg => {
            const temp = msg.contact_id;
            chatTemps[temp] = {
                name: msg.contact_name,
                text: (msg.content.body ? msg.content.body : msg.content),
                direction: msg.direction
            };
        });
        chts(chatTemps)
    };

    /** On component render **/
    useEffect(() => {
        loadChatList();
        susbscribeForChanges();
    }, []);

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
                    <ChatsList
                        key={key}
                        c={chats} />
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